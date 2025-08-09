use crate::app::state::AppState;
use crate::db::queries::task_queries;
use crate::domain::task::Task;
use crate::error::Result;

/// 使用 `#[tauri::command]` 宏将这个 Rust 函数标记为一个可以从前端调用的指令。
/// 函数名 `create_task` 将成为前端 `invoke` 时使用的 command 字符串。
#[tauri::command]
pub async fn create_task(
    title: String,                     // 这个参数 `title` 将由前端调用时以 JSON 格式传递。
    state: tauri::State<'_, AppState>, // 通过 `tauri::State` 类型声明，Tauri 会自动注入之前 manage 的共享状态。
) -> Result<Task> {
    // 从共享状态中获取数据库连接。
    // `.lock().unwrap()` 用于获取互斥锁的访问权限，确保线程安全。
    // `.unwrap()` 在这里是安全的，因为如果锁被“毒化”（持有锁的线程崩溃了），希望程序直接恐慌。
    let conn = state.db.lock().unwrap();

    // 调用之前编写的、与数据库直接交互的函数来执行真正的数据库操作。
    // `?` 操作符用于错误传播，如果 `create_task` 返回一个错误，它会立即从当前函数返回。
    let new_task = task_queries::create_task(&conn, &title)?;

    // 返回一个 `Ok(new_task)`，Tauri 会自动将 `new_task` 序列化为 JSON 并通过 `resolve` 返回给前端的 Promise。
    // 如果返回 `Err(...)`，Tauri 会通过 `reject` 将错误信息返回。
    Ok(new_task)
}

#[tauri::command]
pub async fn get_all_tasks(state: tauri::State<'_, AppState>) -> Result<Vec<Task>> {
    let conn = state.db.lock().unwrap();
    let tasks = task_queries::get_all_tasks(&conn)?;
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
