// 在非调试模式下（即发布版），禁用 Windows 系统上的命令行窗口。
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use momentum_lib::{
    app::{self, commands::task_commands},
    error::Result,
};
use tauri::Manager;

fn main() -> Result<()> {
    // 使用 `tauri::Builder` 来构建应用。
    tauri::Builder::default()
        // `.setup()` 是一个在Tauri核心初始化后，但在窗口创建前运行的钩子函数。
        // 在这里进行数据库的初始化工作。
        .setup(|app| {
            // 在 Tauri 2.0 中，setup闭包里直接拿到的是 `App`，用 `app.handle()`
            // 来获取一个 `AppHandle`，它实现了 Manager Trait，并且可以在多线程间安全共享。
            let state = app::setup::init_database(app.handle())?;
            // `.manage()` 方法将 AppState 实例放入 Tauri 的状态管理器中，
            // 这样任何指令函数都可以通过 `tauri::State` 类型轻松获取它。
            app.handle().manage(state);
            Ok(())
        })
        // `.invoke_handler()` 负责注册所有想要从前端调用的 Rust 函数。
        // `generate_handler!` 宏会自动收集所有列出的、标记为 `#[tauri::command]` 的函数。
        .invoke_handler(tauri::generate_handler![
            task_commands::create_task,
            task_commands::get_all_tasks,
            task_commands::update_task_status,
            task_commands::delete_task
        ])
        // `.run()` 启动事件循环并显示窗口，这是最后一步。
        .run(tauri::generate_context!())
        .expect("运行 Tauri 应用时出错");

    Ok(())
}
