use crate::domain::task::Task;
use chrono::NaiveDateTime;
use rusqlite::{params, Connection, Result as SqliteResult, ToSql};

/// 创建一个新任务，并返回创建好的完整任务对象。
pub fn create_task(
    conn: &Connection,
    title: &str,
    project_id: Option<i64>,
    parent_id: Option<i64>,
) -> SqliteResult<Task> {
    // SQL INSERT 语句现在也包含 project_id 字段
    let sql = "INSERT INTO tasks (title, project_id, parent_id) VALUES (?1, ?2, ?3)";
    // 将 title 和 project_id 作为参数传递
    conn.execute(sql, params![title, project_id, parent_id])?;

    let id = conn.last_insert_rowid();
    get_task_by_id(conn, id)
}

/// 获取所有任务，按创建时间降序排列。
pub fn get_tasks_by_parent(
    conn: &Connection,
    project_id: Option<i64>,
    parent_id: Option<i64>,
) -> SqliteResult<Vec<Task>> {
    let mut sql =
        "SELECT id, title, is_completed, project_id, parent_id, created_at, updated_at, (SELECT COUNT(*) FROM tasks AS sub_tasks WHERE sub_tasks.parent_id = tasks.id) AS subtask_count FROM tasks"
            .to_string();

    let mut params_vec: Vec<Box<dyn ToSql>> = Vec::new();

    // --- 核心筛选逻辑 ---
    if let Some(p_id) = parent_id {
        // 1. 如果是获取子任务，则只按 parent_id 筛选
        sql.push_str(" WHERE parent_id = ?1");
        params_vec.push(Box::new(p_id));
    } else {
        // 2. 如果是获取顶级任务，则必须按 parent_id IS NULL 筛选
        sql.push_str(" WHERE parent_id IS NULL");
        if let Some(proj_id) = project_id {
            // 2a. 如果指定了项目ID，则筛选该项目下的顶级任务
            sql.push_str(" AND project_id = ?1");
            params_vec.push(Box::new(proj_id));
        } else {
            // 2b. 如果项目ID是None，则筛选“收件箱”里的顶级任务
            sql.push_str(" AND project_id IS NULL");
        }
    }

    sql.push_str(" ORDER BY created_at DESC");

    let mut stmt = conn.prepare(&sql)?;

    // 使用 `rusqlite::params_from_iter` 将 Vec 转换为 `rusqlite` 可接受的参数类型
    let params_slice = rusqlite::params_from_iter(params_vec.iter());

    let task_iter = stmt.query_map(params_slice, |row| {
        let created_at_str: String = row.get("created_at")?;
        let updated_at_str: String = row.get("updated_at")?;

        Ok(Task {
            id: row.get("id")?,
            title: row.get("title")?,
            is_completed: row.get::<_, i32>("is_completed")? == 1,
            project_id: row.get("project_id")?,
            parent_id: row.get("parent_id")?,
            subtask_count: row.get("subtask_count")?,
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

/// 这是一个内部辅助函数，不对外暴露，仅用于根据 ID 获取单个任务。
pub fn get_task_by_id(conn: &Connection, id: i64) -> SqliteResult<Task> {
    let sql = "SELECT id, title, is_completed, project_id, parent_id, created_at, updated_at, (SELECT COUNT(*) FROM tasks AS sub_tasks WHERE sub_tasks.parent_id = tasks.id) AS subtask_count FROM tasks WHERE id = ?";
    conn.query_row(sql, params![id], |row| {
        let created_at_str: String = row.get("created_at")?;
        let updated_at_str: String = row.get("updated_at")?;

        Ok(Task {
            id: row.get("id")?,
            title: row.get("title")?,
            is_completed: row.get::<_, i32>("is_completed")? == 1,
            project_id: row.get("project_id")?,
            parent_id: row.get("parent_id")?,
            subtask_count: row.get("subtask_count")?,
            created_at: NaiveDateTime::parse_from_str(&created_at_str, "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
            updated_at: NaiveDateTime::parse_from_str(&updated_at_str, "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
        })
    })
}
