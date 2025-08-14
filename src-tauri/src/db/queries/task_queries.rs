use crate::domain::priority::Priority;
use crate::domain::task::Task;
use chrono::{DateTime, NaiveDateTime, Utc};
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
        "
        SELECT
            t.id, t.title, t.description, t.is_completed, t.project_id, t.parent_id,
            t.priority, t.due_date, t.created_at, t.updated_at,
            (SELECT COUNT(*) FROM tasks AS st WHERE st.parent_id = t.id) AS subtask_count,
            -- 使用子查询找到每个任务的最近一个未发送的提醒时间
            (SELECT MIN(remind_at) FROM reminders r WHERE r.task_id = t.id AND r.is_sent = 0) AS next_reminder_at
        FROM tasks t
        "
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

    // 首先按 `priority` 降序（DESC）排列，这样 3(高) > 2(中) > 1(低) > 0(无)
    // 对于优先级相同的任务，再按 `created_at` 降序排列，确保新任务在前
    sql.push_str(" ORDER BY priority DESC, created_at DESC");

    let mut stmt = conn.prepare(&sql)?;
    // 使用 `rusqlite::params_from_iter` 将 Vec 转换为 `rusqlite` 可接受的参数类型
    let params_slice = rusqlite::params_from_iter(params_vec.iter());

    let task_iter = stmt.query_map(params_slice, |row| {
        let created_at_str: String = row.get("created_at")?;
        let updated_at_str: String = row.get("updated_at")?;
        let priority_val: i64 = row.get("priority")?;
        let due_date: Option<DateTime<Utc>> = row.get::<_, Option<String>>("due_date")?.map(|s| {
            NaiveDateTime::parse_from_str(&s, "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc()
        });
        let next_reminder_at: Option<DateTime<Utc>> =
            row.get::<_, Option<String>>("next_reminder_at")?.map(|s| {
                NaiveDateTime::parse_from_str(&s, "%Y-%m-%d %H:%M:%S")
                    .unwrap()
                    .and_utc()
            });

        Ok(Task {
            id: row.get("id")?,
            title: row.get("title")?,
            description: row.get("description")?,
            is_completed: row.get::<_, i32>("is_completed")? == 1,
            project_id: row.get("project_id")?,
            parent_id: row.get("parent_id")?,
            subtask_count: row.get("subtask_count")?,
            priority: priority_val.into(),
            due_date,
            next_reminder_at,
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
    let sql =
        "
        SELECT
            t.id, t.title, t.description, t.is_completed, t.project_id, t.parent_id,
            t.priority, t.due_date, t.created_at, t.updated_at,
            (SELECT COUNT(*) FROM tasks AS st WHERE st.parent_id = t.id) AS subtask_count,
            (SELECT MIN(remind_at) FROM reminders r WHERE r.task_id = t.id AND r.is_sent = 0) AS next_reminder_at
        FROM tasks t
        WHERE t.id = ?
        ";

    conn.query_row(sql, params![id], |row| {
        let created_at_str: String = row.get("created_at")?;
        let updated_at_str: String = row.get("updated_at")?;
        let priority_val: i64 = row.get("priority")?;
        let due_date: Option<DateTime<Utc>> = row.get::<_, Option<String>>("due_date")?.map(|s| {
            NaiveDateTime::parse_from_str(&s, "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc()
        });
        let next_reminder_at: Option<DateTime<Utc>> =
            row.get::<_, Option<String>>("next_reminder_at")?.map(|s| {
                NaiveDateTime::parse_from_str(&s, "%Y-%m-%d %H:%M:%S")
                    .unwrap()
                    .and_utc()
            });

        Ok(Task {
            id: row.get("id")?,
            title: row.get("title")?,
            description: row.get("description")?,
            is_completed: row.get::<_, i32>("is_completed")? == 1,
            project_id: row.get("project_id")?,
            parent_id: row.get("parent_id")?,
            subtask_count: row.get("subtask_count")?,
            priority: priority_val.into(),
            due_date,
            next_reminder_at,
            created_at: NaiveDateTime::parse_from_str(&created_at_str, "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
            updated_at: NaiveDateTime::parse_from_str(&updated_at_str, "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
        })
    })
}

/// 用于更新任务优先级的函数
pub fn update_task_priority(conn: &Connection, id: i64, priority: Priority) -> SqliteResult<usize> {
    let sql = "UPDATE tasks SET priority = ?1, updated_at = strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime') \
    WHERE id = ?2";

    // 将 Priority 枚举转换为 i64 存入数据库。
    // `priority.into()` 会自动调用为 Priority 实现的 From<Priority> for i64 Trait。
    let priority_as_i64: i64 = priority.into();
    conn.execute(sql, params![priority_as_i64, id])
}

/// 更新任务截止日期的函数
pub fn update_task_due_date(
    conn: &Connection,
    id: i64,
    due_date: Option<DateTime<Utc>>,
) -> SqliteResult<usize> {
    let sql = "UPDATE tasks SET due_date = ?1, updated_at = strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime') WHERE id = ?2";

    // 将 Option<DateTime<Utc>> 转换为 rusqlite 可以理解的参数
    let due_date_str: Option<String> =
        due_date.map(|dt| dt.format("%Y-%m-%d %H:%M:%S").to_string());

    conn.execute(sql, params![due_date_str, id])
}

/// 更新任务描述的函数
pub fn update_task_description(
    conn: &Connection,
    id: i64,
    description: Option<String>,
) -> SqliteResult<usize> {
    let sql = "UPDATE tasks SET description = ?1, updated_at = strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime') WHERE id = ?2";
    conn.execute(sql, params![description, id])
}
