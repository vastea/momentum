use crate::domain::reminder::Reminder;
use chrono::{DateTime, NaiveDateTime, Utc};
use rusqlite::{params, Connection, Result as SqliteResult};

/// 为指定任务创建一个新的提醒
pub fn create_reminder(
    conn: &Connection,
    task_id: i64,
    remind_at: DateTime<Utc>,
) -> SqliteResult<Reminder> {
    let sql = "INSERT INTO reminders (task_id, remind_at) VALUES (?1, ?2)";
    let remind_at_str = remind_at.format("%Y-%m-%d %H:%M:%S").to_string();
    conn.execute(sql, params![task_id, remind_at_str])?;
    let id = conn.last_insert_rowid();
    get_reminder_by_id(conn, id)
}

/// 获取指定任务的所有提醒
pub fn get_reminders_for_task(conn: &Connection, task_id: i64) -> SqliteResult<Vec<Reminder>> {
    let sql = "SELECT id, task_id, remind_at, is_sent FROM reminders 
               WHERE task_id = ?1 AND is_sent = 0 
               ORDER BY remind_at ASC";
    let mut stmt = conn.prepare(sql)?;
    let iter = stmt.query_map(params![task_id], |row| {
        let remind_at_str: String = row.get("remind_at")?;
        Ok(Reminder {
            id: row.get("id")?,
            task_id: row.get("task_id")?,
            remind_at: NaiveDateTime::parse_from_str(&remind_at_str, "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
            is_sent: row.get::<_, i32>("is_sent")? == 1,
        })
    })?;
    iter.collect()
}

/// 删除一个提醒
pub fn delete_reminder(conn: &Connection, id: i64) -> SqliteResult<usize> {
    let sql = "DELETE FROM reminders WHERE id = ?";
    conn.execute(sql, params![id])
}

/// (为后台服务使用) 获取所有已到期且未发送的提醒
pub fn get_due_reminders(conn: &Connection) -> SqliteResult<Vec<Reminder>> {
    let sql = "SELECT id, task_id, remind_at, is_sent FROM reminders 
               WHERE is_sent = 0 AND remind_at <= strftime('%Y-%m-%d %H:%M:%S', 'now')";
    let mut stmt = conn.prepare(sql)?;
    let iter = stmt.query_map([], |row| {
        let remind_at_str: String = row.get("remind_at")?;
        Ok(Reminder {
            id: row.get("id")?,
            task_id: row.get("task_id")?,
            remind_at: NaiveDateTime::parse_from_str(&remind_at_str, "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
            is_sent: row.get::<_, i32>("is_sent")? == 1,
        })
    })?;
    iter.collect()
}

/// (为后台服务使用) 将一组提醒标记为已发送
pub fn mark_reminders_as_sent(conn: &Connection, ids: &[i64]) -> SqliteResult<usize> {
    if ids.is_empty() {
        return Ok(0);
    }
    // 使用 rusqlite 的 `vtab` 功能来高效地处理 `IN` 查询
    let sql = format!(
        "UPDATE reminders SET is_sent = 1 WHERE id IN ({})",
        ids.iter().map(|_| "?").collect::<Vec<_>>().join(", ")
    );
    let params_vec: Vec<&dyn rusqlite::ToSql> =
        ids.iter().map(|id| id as &dyn rusqlite::ToSql).collect();
    conn.execute(&sql, &params_vec[..])
}

/// 内部辅助函数：根据 ID 获取单个提醒
fn get_reminder_by_id(conn: &Connection, id: i64) -> SqliteResult<Reminder> {
    let sql = "SELECT id, task_id, remind_at, is_sent FROM reminders WHERE id = ?";
    conn.query_row(sql, params![id], |row| {
        let remind_at_str: String = row.get("remind_at")?;
        Ok(Reminder {
            id: row.get("id")?,
            task_id: row.get("task_id")?,
            remind_at: NaiveDateTime::parse_from_str(&remind_at_str, "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
            is_sent: row.get::<_, i32>("is_sent")? == 1,
        })
    })
}
