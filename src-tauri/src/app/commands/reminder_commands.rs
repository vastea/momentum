use crate::app::state::AppState;
use crate::db::queries::reminder_queries;
use crate::domain::reminder::Reminder;
use crate::error::Result;
use chrono::{DateTime, Utc};
use tauri::State;

#[tauri::command]
pub async fn create_reminder(
    task_id: i64,
    remind_at: DateTime<Utc>,
    state: State<'_, AppState>,
) -> Result<Reminder> {
    let conn = state.db.lock().unwrap();
    let new_reminder = reminder_queries::create_reminder(&conn, task_id, remind_at)?;
    Ok(new_reminder)
}

#[tauri::command]
pub async fn get_reminders_for_task(
    task_id: i64,
    state: State<'_, AppState>,
) -> Result<Vec<Reminder>> {
    let conn = state.db.lock().unwrap();
    let reminders = reminder_queries::get_reminders_for_task(&conn, task_id)?;
    Ok(reminders)
}

#[tauri::command]
pub async fn delete_reminder(id: i64, state: State<'_, AppState>) -> Result<()> {
    let conn = state.db.lock().unwrap();
    reminder_queries::delete_reminder(&conn, id)?;
    Ok(())
}
