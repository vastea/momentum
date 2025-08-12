use chrono::{DateTime, Utc};

use crate::app::state::AppState;
use crate::db::queries::task_queries;
use crate::domain::priority::Priority;
use crate::domain::task::Task;
use crate::error::Result;

/// 使用 `#[tauri::command]` 宏将这个 Rust 函数标记为一个可以从前端调用的指令。
/// 函数名 `create_task` 将成为前端 `invoke` 时使用的 command 字符串。
#[tauri::command]
pub async fn create_task(
    title: String,                     // 这个参数 `title` 将由前端调用时以 JSON 格式传递。
    project_id: Option<i64>,           // project_id 参数，用于和 project 做关联
    parent_id: Option<i64>,            // parent_id 参数，用于关联父子任务
    state: tauri::State<'_, AppState>, // 通过 `tauri::State` 类型声明，Tauri 会自动注入之前 manage 的共享状态。
) -> Result<Task> {
    println!(
        "接收到创建任务的请求, 标题: {}, 项目ID: {:?}, 父任务ID: {:?}",
        title, project_id, parent_id
    );
    // 从共享状态中获取数据库连接。
    // `.lock().unwrap()` 用于获取互斥锁的访问权限，确保线程安全。
    // `.unwrap()` 在这里是安全的，因为如果锁被“毒化”（持有锁的线程崩溃了），希望程序直接恐慌。
    let conn = state.db.lock().unwrap();

    // 调用之前编写的、与数据库直接交互的函数来执行真正的数据库操作。
    // `?` 操作符用于错误传播，如果 `create_task` 返回一个错误，它会立即从当前函数返回。
    let new_task = task_queries::create_task(&conn, &title, project_id, parent_id)?;

    // 返回一个 `Ok(new_task)`，Tauri 会自动将 `new_task` 序列化为 JSON 并通过 `resolve` 返回给前端的 Promise。
    // 如果返回 `Err(...)`，Tauri 会通过 `reject` 将错误信息返回。
    Ok(new_task)
}

#[tauri::command]
pub async fn get_tasks_by_parent(
    project_id: Option<i64>,
    parent_id: Option<i64>, // 接收 parent_id 参数
    state: tauri::State<'_, AppState>,
) -> Result<Vec<Task>> {
    let conn = state.db.lock().unwrap();
    let tasks = task_queries::get_tasks_by_parent(&conn, project_id, parent_id)?;
    Ok(tasks)
}

#[tauri::command]
pub async fn update_task_status(
    id: i64,
    is_completed: bool,
    state: tauri::State<'_, AppState>,
) -> Result<()> {
    // 这个指令在成功时不需要返回有意义的数据，所以用 `()` （空元组）表示。
    let conn = state.db.lock().unwrap();
    task_queries::update_task_status(&conn, id, is_completed)?;
    Ok(())
}

#[tauri::command]
pub async fn delete_task(id: i64, state: tauri::State<'_, AppState>) -> Result<()> {
    let conn = state.db.lock().unwrap();
    task_queries::delete_task(&conn, id)?;
    Ok(())
}

/// Tauri 指令：根据ID获取单个任务的详细信息
#[tauri::command]
pub async fn get_task_by_id(id: i64, state: tauri::State<'_, AppState>) -> Result<Task> {
    let conn = state.db.lock().unwrap();
    let task = task_queries::get_task_by_id(&conn, id)?;
    Ok(task)
}

/// Tauri 指令，用于更新一个任务的优先级
#[tauri::command]
pub async fn update_task_priority(
    id: i64,
    priority: Priority, // 前端将直接发送 "High", "Medium" 等字符串
    state: tauri::State<'_, AppState>,
) -> Result<()> {
    // 成功时无需返回数据
    // 得益于为 Priority 枚举实现的 `serde::Deserialize`，
    // Tauri 会自动将前端发来的 JSON 字符串 ("High") 解析为 Priority::High 枚举成员。
    let conn = state.db.lock().unwrap();
    // 调用刚刚创建的数据库查询函数
    task_queries::update_task_priority(&conn, id, priority)?;
    Ok(())
}

/// Tauri 指令，用于更新一个任务的截止日期
#[tauri::command]
pub async fn update_task_due_date(
    id: i64,
    due_date: Option<DateTime<Utc>>, // 前端可以传来一个日期字符串或 null
    state: tauri::State<'_, AppState>,
) -> Result<()> {
    // Tauri 的 serde 反序列化能力会自动将前端的 ISO 8601 日期字符串解析为 DateTime<Utc>
    let conn = state.db.lock().unwrap();
    task_queries::update_task_due_date(&conn, id, due_date)?;
    Ok(())
}

/// Tauri 指令，用于更新一个任务的描述
#[tauri::command]
pub async fn update_task_description(
    id: i64,
    description: Option<String>, // 描述可以是一个字符串，也可以是 null
    state: tauri::State<'_, AppState>,
) -> Result<()> {
    let conn = state.db.lock().unwrap();
    task_queries::update_task_description(&conn, id, description)?;
    Ok(())
}
