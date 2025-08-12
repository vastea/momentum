use crate::domain::attachment::{Attachment, AttachmentType};
use rusqlite::{params, Connection, Result as SqliteResult};

/// 为指定任务创建一个新的 URL 附件
pub fn create_url_attachment(
    conn: &Connection,
    task_id: i64,
    url: &str,
) -> SqliteResult<Attachment> {
    let attachment_type_str: &str = AttachmentType::Url.into();
    let sql = "INSERT INTO attachments (task_id, type, payload) VALUES (?1, ?2, ?3)";
    conn.execute(sql, params![task_id, attachment_type_str, url])?;

    let id = conn.last_insert_rowid();
    get_attachment_by_id(conn, id)
}

/// 获取指定任务的所有附件
pub fn get_attachments_for_task(conn: &Connection, task_id: i64) -> SqliteResult<Vec<Attachment>> {
    let sql = "SELECT id, task_id, type, payload FROM attachments WHERE task_id = ?1";
    let mut stmt = conn.prepare(sql)?;

    let iter = stmt.query_map(params![task_id], |row| {
        let type_str: String = row.get("type")?;
        Ok(Attachment {
            id: row.get("id")?,
            task_id: row.get("task_id")?,
            attachment_type: AttachmentType::from(type_str.as_str()),
            payload: row.get("payload")?,
        })
    })?;

    iter.collect()
}

/// 根据附件自身的 ID 删除一个附件
pub fn delete_attachment(conn: &Connection, id: i64) -> SqliteResult<usize> {
    let sql = "DELETE FROM attachments WHERE id = ?";
    conn.execute(sql, params![id])
}

/// 内部辅助函数：根据 ID 获取单个附件
fn get_attachment_by_id(conn: &Connection, id: i64) -> SqliteResult<Attachment> {
    let sql = "SELECT id, task_id, type, payload FROM attachments WHERE id = ?";
    conn.query_row(sql, params![id], |row| {
        let type_str: String = row.get("type")?;
        Ok(Attachment {
            id: row.get("id")?,
            task_id: row.get("task_id")?,
            attachment_type: AttachmentType::from(type_str.as_str()),
            payload: row.get("payload")?,
        })
    })
}
