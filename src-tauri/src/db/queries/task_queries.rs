use crate::domain::task::Task;
use chrono::NaiveDateTime;
use rusqlite::{params, Connection, Result as SqliteResult};

/// 创建一个新任务，并返回创建好的完整任务对象。
pub fn create_task(conn: &Connection, title: &str) -> SqliteResult<Task> {
    let sql = "INSERT INTO tasks (title) VALUES (?)";
    conn.execute(sql, params![title])?;
    let id = conn.last_insert_rowid();
    get_task_by_id(conn, id)
}

/// 获取所有任务，按创建时间降序排列。
pub fn get_all_tasks(conn: &Connection) -> SqliteResult<Vec<Task>> {
    let sql = "SELECT id, title, is_completed, created_at, updated_at FROM tasks ORDER BY created_at DESC";
    let mut stmt = conn.prepare(sql)?;
    let task_iter = stmt.query_map([], |row| {
        let created_at_str: String = row.get(3)?;
        let updated_at_str: String = row.get(4)?;

        Ok(Task {
            id: row.get(0)?,
            title: row.get(1)?,
            is_completed: row.get::<_, i32>(2)? == 1,
            // 1. 先将字符串解析为一个“天真”的、不带时区信息的时间。
            // 2. 然后使用 `.and_utc()` 将其明确指定为 UTC 时间。
            created_at: NaiveDateTime::parse_from_str(&created_at_str, "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
            updated_at: NaiveDateTime::parse_from_str(&updated_at_str, "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
        })
    })?;

    task_iter.collect()
}

/// 更新指定 ID 任务的完成状态。
pub fn update_task_status(conn: &Connection, id: i64, is_completed: bool) -> SqliteResult<usize> {
    let sql = "UPDATE tasks SET is_completed = ?, updated_at = strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime') WHERE id = ?";
    conn.execute(sql, params![is_completed, id])
}

/// 根据 ID 删除一个任务。
pub fn delete_task(conn: &Connection, id: i64) -> SqliteResult<usize> {
    let sql = "DELETE FROM tasks WHERE id = ?";
    conn.execute(sql, params![id])
}

/// 这是一个内部辅助函数，不对外暴露，仅用于本模块内根据 ID 获取单个任务。
fn get_task_by_id(conn: &Connection, id: i64) -> SqliteResult<Task> {
    let sql = "SELECT id, title, is_completed, created_at, updated_at FROM tasks WHERE id = ?";
    conn.query_row(sql, params![id], |row| {
        let created_at_str: String = row.get(3)?;
        let updated_at_str: String = row.get(4)?;

        Ok(Task {
            id: row.get(0)?,
            title: row.get(1)?,
            is_completed: row.get::<_, i32>(2)? == 1,
            created_at: NaiveDateTime::parse_from_str(&created_at_str, "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
            updated_at: NaiveDateTime::parse_from_str(&updated_at_str, "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
        })
    })
}
