use crate::domain::task::Task;
use chrono::NaiveDateTime;
use rusqlite::{params, Connection, Result as SqliteResult, ToSql};

/// 创建一个新任务，并返回创建好的完整任务对象。
pub fn create_task(conn: &Connection, title: &str, project_id: Option<i64>) -> SqliteResult<Task> {
    // SQL INSERT 语句现在也包含 project_id 字段
    let sql = "INSERT INTO tasks (title, project_id) VALUES (?1, ?2)";
    // 将 title 和 project_id 作为参数传递
    conn.execute(sql, params![title, project_id])?;

    let id = conn.last_insert_rowid();
    get_task_by_id(conn, id)
}

/// 获取所有任务，按创建时间降序排列。
pub fn get_all_tasks(conn: &Connection, project_id: Option<i64>) -> SqliteResult<Vec<Task>> {
    let mut sql = "SELECT id, title, is_completed, project_id, created_at, updated_at FROM tasks".to_string();

    // 使用一个 Vec 来存放动态的查询参数
    let mut params_vec: Vec<Box<dyn ToSql>> = Vec::new();

    // 根据 project_id 是否有值来拼接 WHERE 子句
    if let Some(id) = project_id {
        // 如果有具体的 project_id，筛选该 id
        sql.push_str(" WHERE project_id = ?1");
        // Box::new(id) 将 id 包装成一个可以在 Vec 中存储的 trait 对象
        params_vec.push(Box::new(id));
    } else {
        // 如果 project_id 是 None，我们筛选那些没有项目的任务
        sql.push_str(" WHERE project_id IS NULL");
    }

    sql.push_str(" ORDER BY created_at DESC");

    let mut stmt = conn.prepare(&sql)?;

    // 将 Vec 转换为 rusqlite 需要的参数切片
    let params_slice = rusqlite::params_from_iter(params_vec.iter().map(|p| p.as_ref()));

    let task_iter = stmt.query_map(params_slice, |row| {
        let created_at_str: String = row.get("created_at")?;
        let updated_at_str: String = row.get("updated_at")?;

        Ok(Task {
            id: row.get("id")?,
            title: row.get("title")?,
            is_completed: row.get::<_, i32>("is_completed")? == 1,
            project_id: row.get("project_id")?,
            created_at: NaiveDateTime::parse_from_str(&created_at_str, "%Y-%m-%d %H:%M:%S").unwrap().and_utc(),
            updated_at: NaiveDateTime::parse_from_str(&updated_at_str, "%Y-%m-%d %H:%M:%S").unwrap().and_utc(),
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
    let sql = "SELECT id, title, is_completed, project_id, created_at, updated_at FROM tasks WHERE id = ?";
    conn.query_row(sql, params![id], |row| {
        let created_at_str: String = row.get("created_at")?;
        let updated_at_str: String = row.get("updated_at")?;

        Ok(Task {
            id: row.get("id")?,
            title: row.get("title")?,
            is_completed: row.get::<_, i32>("is_completed")? == 1,
            project_id: row.get("project_id")?,
            created_at: NaiveDateTime::parse_from_str(&created_at_str, "%Y-%m-%d %H:%M:%S").unwrap().and_utc(),
            updated_at: NaiveDateTime::parse_from_str(&updated_at_str, "%Y-%m-%d %H:%M:%S").unwrap().and_utc(),
        })
    })
}