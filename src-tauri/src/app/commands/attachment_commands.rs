use crate::app::state::AppState;
use crate::db::queries::attachment_queries;
use crate::domain::attachment::Attachment;
use crate::error::Result;

/// Tauri 指令：创建一个新的 URL 附件
#[tauri::command]
pub async fn create_url_attachment(
    task_id: i64,
    url: String,
    state: tauri::State<'_, AppState>,
) -> Result<Attachment> {
    let conn = state.db.lock().unwrap();
    let attachment = attachment_queries::create_url_attachment(&conn, task_id, &url)?;
    Ok(attachment)
}

/// Tauri 指令：获取指定任务的所有附件
#[tauri::command]
pub async fn get_attachments_for_task(
    task_id: i64,
    state: tauri::State<'_, AppState>,
) -> Result<Vec<Attachment>> {
    let conn = state.db.lock().unwrap();
    let attachments = attachment_queries::get_attachments_for_task(&conn, task_id)?;
    Ok(attachments)
}

/// Tauri 指令：删除一个附件
#[tauri::command]
pub async fn delete_attachment(id: i64, state: tauri::State<'_, AppState>) -> Result<()> {
    let conn = state.db.lock().unwrap();
    attachment_queries::delete_attachment(&conn, id)?;
    Ok(())
}
