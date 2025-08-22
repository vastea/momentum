use crate::app::state::AppState;
use crate::db::queries::attachment_queries;
use crate::domain::attachment::Attachment;
use crate::error::Result;
use log::{debug, info};

/// Tauri 指令：创建一个新的 URL 附件
#[tauri::command]
pub async fn create_url_attachment(
    task_id: i64,
    url: String,
    state: tauri::State<'_, AppState>,
) -> Result<Attachment> {
    debug!(
        "[Command] create_url_attachment, task_id: {}, url: {}",
        task_id, url
    );
    let conn = state.db.lock().unwrap();
    let attachment = attachment_queries::create_url_attachment(&conn, task_id, &url)?;
    info!(
        "[Command] 成功为任务 {} 添加URL附件, ID: {}",
        task_id, attachment.id
    );
    Ok(attachment)
}

/// Tauri 指令：获取指定任务的所有附件
#[tauri::command]
pub async fn get_attachments_for_task(
    task_id: i64,
    state: tauri::State<'_, AppState>,
) -> Result<Vec<Attachment>> {
    debug!("[Command] get_attachments_for_task, task_id: {}", task_id);
    let conn = state.db.lock().unwrap();
    let attachments = attachment_queries::get_attachments_for_task(&conn, task_id)?;
    Ok(attachments)
}

/// Tauri 指令：删除一个附件
#[tauri::command]
pub async fn delete_attachment(id: i64, state: tauri::State<'_, AppState>) -> Result<()> {
    debug!("[Command] delete_attachment, id: {}", id);
    let conn = state.db.lock().unwrap();
    attachment_queries::delete_attachment(&conn, id)?;
    info!("[Command] 成功删除附件, ID: {}", id);
    Ok(())
}

/// Tauri 指令，创建一个新的本地路径附件
#[tauri::command]
pub async fn create_local_path_attachment(
    task_id: i64,
    path: String,
    state: tauri::State<'_, AppState>,
) -> Result<Attachment> {
    debug!(
        "[Command] create_local_path_attachment, task_id: {}, path: {}",
        task_id, path
    );
    let conn = state.db.lock().unwrap();
    let attachment = attachment_queries::create_local_path_attachment(&conn, task_id, &path)?;
    info!(
        "[Command] 成功为任务 {} 添加本地路径附件, ID: {}",
        task_id, attachment.id
    );
    Ok(attachment)
}
