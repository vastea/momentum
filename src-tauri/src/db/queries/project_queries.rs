// src-tauri/src/db/queries/project_queries.rs

use crate::domain::project::Project;
use chrono::NaiveDateTime;
use rusqlite::{params, Connection, Error as SqliteError, Result as SqliteResult};

/// 创建一个新项目
pub fn create_project(conn: &Connection, name: &str) -> SqliteResult<Project> {
    let check_sql = "SELECT id FROM projects WHERE name = ?";
    let existing: SqliteResult<i64> = conn.query_row(check_sql, params![name], |row| row.get("id"));
    if existing.is_ok() {
        return Err(SqliteError::SqliteFailure(
            rusqlite::ffi::Error::new(rusqlite::ffi::SQLITE_CONSTRAINT_UNIQUE),
            Some("一个同名的项目已经存在。".to_string()),
        ));
    }

    let sql = "INSERT INTO projects (name) VALUES (?)";
    conn.execute(sql, params![name])?;
    let id = conn.last_insert_rowid();
    get_project_by_id(conn, id)
}

/// 获取所有项目
pub fn get_all_projects(conn: &Connection) -> SqliteResult<Vec<Project>> {
    let sql = "SELECT id, name, created_at, updated_at FROM projects ORDER BY name ASC";
    let mut stmt = conn.prepare(sql)?;

    let project_iter = stmt.query_map([], |row| {
        let created_at_str: String = row.get("created_at")?;
        let updated_at_str: String = row.get("updated_at")?;
        Ok(Project {
            id: row.get("id")?,
            name: row.get("name")?,
            created_at: NaiveDateTime::parse_from_str(&created_at_str, "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
            updated_at: NaiveDateTime::parse_from_str(&updated_at_str, "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
        })
    })?;

    project_iter.collect()
}

/// 更新一个现有项目的名称
pub fn update_project(conn: &Connection, id: i64, name: &str) -> SqliteResult<Project> {
    let check_sql = "SELECT id FROM projects WHERE name = ? AND id != ?";
    let existing: SqliteResult<i64> =
        conn.query_row(check_sql, params![name, id], |row| row.get("id"));
    if existing.is_ok() {
        return Err(SqliteError::SqliteFailure(
            rusqlite::ffi::Error::new(rusqlite::ffi::SQLITE_CONSTRAINT_UNIQUE),
            Some("一个同名的项目已经存在。".to_string()),
        ));
    }

    let sql =
        "UPDATE projects SET name = ?, updated_at = strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime') WHERE id = ?";
    conn.execute(sql, params![name, id])?;
    get_project_by_id(conn, id)
}

/// 删除一个项目
pub fn delete_project(conn: &Connection, id: i64) -> SqliteResult<usize> {
    let sql = "DELETE FROM projects WHERE id = ?";
    conn.execute(sql, params![id])
}

/// 内部辅助函数：根据 ID 获取单个项目
fn get_project_by_id(conn: &Connection, id: i64) -> SqliteResult<Project> {
    let sql = "SELECT id, name, created_at, updated_at FROM projects WHERE id = ?";
    conn.query_row(sql, params![id], |row| {
        let created_at_str: String = row.get("created_at")?;
        let updated_at_str: String = row.get("updated_at")?;
        Ok(Project {
            id: row.get("id")?,
            name: row.get("name")?,
            created_at: NaiveDateTime::parse_from_str(&created_at_str, "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
            updated_at: NaiveDateTime::parse_from_str(&updated_at_str, "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
        })
    })
}