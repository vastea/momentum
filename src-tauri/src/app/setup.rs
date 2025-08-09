use crate::app::state::AppState;
use crate::error::Result;
// 导入 Manager Trait 来获取 .path() 等方法。
use rusqlite::Connection;
use std::fs;
use std::sync::Mutex;
use tauri::Manager;

/// 初始化数据库的函数。
pub fn init_database(app_handle: &tauri::AppHandle) -> Result<AppState> {
    // 使用 `app_handle.path()` 安全地获取应用的数据目录路径，这在不同操作系统上是不同的。
    // `.expect()` 在路径无法获取时会让程序恐慌，因为这是程序运行的必要条件。
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .expect("获取应用数据目录失败");

    // 如果数据目录尚不存在，则递归地创建它。
    if !app_data_dir.exists() {
        fs::create_dir_all(&app_data_dir).expect("创建应用数据目录失败");
    }

    // 在数据目录中定义数据库文件的名字。
    let db_path = app_data_dir.join("momentum.db");
    // 打开一个到 SQLite 数据库文件的连接。如果文件不存在，会自动创建。
    let conn = Connection::open(db_path)?;

    // `.execute_batch()` 用于执行一批 SQL 语句。
    conn.execute_batch(
        "
        /* 开启 WAL (Write-Ahead Logging) 模式。
           这极大地提高了数据库的并发性能，允许读和写同时进行而不会互相阻塞。*/
        PRAGMA journal_mode = WAL;

        /* 创建 tasks 表，`IF NOT EXISTS` 确保了这条语句只在表不存在时执行，可以安全地重复运行。*/
        CREATE TABLE IF NOT EXISTS tasks (
            id              INTEGER PRIMARY KEY AUTOINCREMENT, -- 自增主键
            title           TEXT NOT NULL, -- 任务标题，不允许为空
            is_completed    INTEGER NOT NULL DEFAULT 0, -- 完成状态，0代表false，1代表true
            created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')), -- 创建时间
            updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime'))  -- 更新时间
        );
        ",
    )?;

    println!("数据库初始化成功。");

    // 将创建好的数据库连接放入 AppState 并返回。
    Ok(AppState {
        db: Mutex::new(conn),
    })
}
