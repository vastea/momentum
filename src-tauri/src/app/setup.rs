// src-tauri/src/app/setup.rs

use crate::app::state::AppState;
use crate::error::Result;
use log::{error, info};
use rusqlite::Connection;
use std::fs;
use std::sync::Mutex;
use tauri::Manager;

/// 一个辅助结构体，用于解析和排序迁移文件
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
struct Migration {
    version: u32,
    path: std::path::PathBuf,
    sql: String,
}

pub fn init_database(app_handle: &tauri::AppHandle) -> Result<AppState> {
    info!("[Setup] 正在初始化数据库...");
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .expect("获取应用数据目录失败");
    if !app_data_dir.exists() {
        fs::create_dir_all(&app_data_dir).expect("创建应用数据目录失败");
    }
    let db_path = app_data_dir.join("momentum.db");
    let mut conn = Connection::open(&db_path)?;

    // 开启 WAL 模式以提高并发性能
    conn.execute_batch("PRAGMA journal_mode = WAL;")?;

    // --- 数据库迁移核心逻辑 ---
    run_migrations(&mut conn, app_handle)?;

    info!(
        "[Setup] 数据库初始化/迁移成功, 路径: {}",
        db_path.to_str().unwrap_or("路径无效")
    );
    Ok(AppState {
        db: Mutex::new(conn),
    })
}

/// 执行数据库迁移
fn run_migrations(conn: &mut Connection, app_handle: &tauri::AppHandle) -> Result<()> {
    // 1. 获取当前数据库版本
    let current_version: u32 = conn.query_row("PRAGMA user_version", [], |row| row.get(0))?;
    info!("[DB Migration] 当前数据库版本: {}", current_version);

    // 2. 读取并解析所有迁移文件
    let mut migrations = Vec::new();
    // `tauri::path::BaseDirectory::Resource` 会定位到我们稍后在 tauri.conf.json 中配置的 resources 目录
    let migration_dir = app_handle
        .path()
        .resolve("migrations", tauri::path::BaseDirectory::Resource)?;

    for entry in fs::read_dir(migration_dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_file() && path.extension().and_then(|s| s.to_str()) == Some("sql") {
            if let Some(file_name) = path.file_stem().and_then(|s| s.to_str()) {
                if let Some(version_str) = file_name.split("__").next() {
                    // 从文件名 "V1__..." 中解析出版本号 1
                    if let Some(version) = version_str
                        .strip_prefix('V')
                        .and_then(|s| s.parse::<u32>().ok())
                    {
                        let sql = fs::read_to_string(&path)?;
                        migrations.push(Migration { version, path, sql });
                    }
                }
            }
        }
    }

    // 3. 按版本号从小到大排序
    migrations.sort();

    // 4. 执行所有版本号高于当前数据库版本的迁移
    for migration in migrations {
        if migration.version > current_version {
            info!(
                "[DB Migration] 正在应用迁移 V{} from {}...",
                migration.version,
                migration.path.display()
            );
            let tx = conn.transaction()?;

            // 在事务中执行 SQL 脚本
            if let Err(e) = tx.execute_batch(&migration.sql) {
                error!("[DB Migration] 迁移 V{} 失败: {}", migration.version, e);
                tx.rollback()?; // 失败则回滚，保证数据安全
                return Err(e.into());
            }

            // 更新数据库版本
            tx.execute_batch(&format!("PRAGMA user_version = {}", migration.version))?;
            tx.commit()?; // 成功则提交事务
            info!("[DB Migration] 成功应用迁移 V{}", migration.version);
        }
    }

    Ok(())
}
