use std::fs;
use std::path::PathBuf;
use tauri::Manager;
use tauri_plugin_store::StoreExt;

use crate::error::Result;
use log::{error, info};

/// 获取当前数据库文件的父目录路径
fn get_current_db_dir(app_handle: &tauri::AppHandle) -> Result<PathBuf> {
    let store = app_handle.store("settings.json")?;

    let custom_path = if let Some(path_value) = store.get("databasePath") {
        path_value.as_str().map(PathBuf::from)
    } else {
        None
    };

    if let Some(path) = custom_path {
        Ok(path)
    } else {
        let default_path = app_handle.path().app_data_dir()?;
        Ok(default_path)
    }
}

/// Tauri 指令：获取当前数据存储路径
#[tauri::command]
pub async fn get_data_path(app_handle: tauri::AppHandle) -> Result<String> {
    let path = get_current_db_dir(&app_handle)?;
    Ok(path.to_str().unwrap_or("").to_string())
}

/// Tauri 指令：设置新的数据存储路径
#[tauri::command]
pub async fn set_data_path(new_path_str: String, app_handle: tauri::AppHandle) -> Result<()> {
    info!("[Settings] 收到更改数据路径的请求: {}", new_path_str);
    let new_path = PathBuf::from(new_path_str);

    if !new_path.exists() {
        fs::create_dir_all(&new_path)?;
    }

    let old_dir = get_current_db_dir(&app_handle)?;
    let old_db_path = old_dir.join("momentum.db");
    let new_db_path = new_path.join("momentum.db");

    if old_db_path == new_db_path {
        info!("[Settings] 新旧路径相同，无需移动。");
        return Ok(());
    }

    if old_db_path.exists() {
        info!(
            "[Settings] 正在从 {} 移动数据库到 {}",
            old_db_path.display(),
            new_db_path.display()
        );
        if let Err(e) = fs::rename(&old_db_path, &new_db_path) {
            error!("[Settings] 移动数据库文件失败: {}", e);
            fs::copy(&old_db_path, &new_db_path)?;
            fs::remove_file(&old_db_path)?;
        }
    }

    let store = app_handle.store("settings.json")?;

    store.set("databasePath".to_string(), new_path.to_str().unwrap());
    store.save()?;

    info!("[Settings] 成功更新数据路径并保存设置。");
    Ok(())
}
