// 在非调试模式下（即发布版），禁用 Windows 系统上的命令行窗口。
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use momentum_lib::app::commands::{
    attachment_commands, project_commands, reminder_commands, settings_commands, task_commands,
};
use momentum_lib::{
    app::{self}, // 确保导入了 reminder_service
    error::Result,
};

use tauri::include_image;
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};

use log::LevelFilter;
use tauri_plugin_log::{Builder as LogBuilder, Target, TargetKind};
use tauri_plugin_store::Builder as StoreBuilder;

fn main() -> Result<()> {
    let log_plugin = LogBuilder::new()
        // 定义日志输出的目标
        .targets([
            // 输出到标准输出（终端）
            Target::new(TargetKind::Stdout),
            // 输出到应用的日志目录，文件名为 momentum.log
            Target::new(TargetKind::LogDir {
                file_name: Some("momentum".into()),
            }),
        ])
        // 设置全局日志级别
        // 在 debug 模式下，记录 Debug 及以上级别
        // 在 release 模式下，只记录 Info 及以上级别
        .level(if cfg!(debug_assertions) {
            LevelFilter::Debug
        } else {
            LevelFilter::Info
        })
        .build();

    tauri::Builder::default()
        // 注册插件
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(log_plugin)
        .plugin(StoreBuilder::default().build())
        // `.setup()` 钩子函数
        .setup(|app| {
            // 初始化数据库和应用状态
            let state = app::setup::init_database(app.handle())?;
            app.handle().manage(state);

            // 定义托盘右键菜单
            let show_item = MenuItem::with_id(app, "show", "显示窗口", true, None::<&str>)?;
            let exit_item = MenuItem::with_id(app, "exit", "退出", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_item, &exit_item])?;

            // 创建并配置托盘图标
            TrayIconBuilder::new()
                .icon(include_image!("icons/icon.png"))
                .tooltip("Momentum 正在运行")
                .menu(&menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "exit" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            // --- 2. 启动后台提醒服务 ---
            let app_handle = app.handle().clone();
            std::thread::spawn(move || {
                // 调用 reminder_service 的 start 函数
                app::reminder_service::start(app_handle);
            });
            // --- 结束 ---

            Ok(())
        })
        // 注册窗口事件处理器
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        // 注册所有后端 Tauri 指令
        .invoke_handler(tauri::generate_handler![
            // 任务相关的指令
            task_commands::create_task,
            task_commands::get_tasks_by_parent,
            task_commands::update_task_status,
            task_commands::delete_task,
            task_commands::get_task_by_id,
            task_commands::update_task_priority,
            task_commands::update_task_due_date,
            task_commands::update_task_description,
            // 项目相关的指令
            project_commands::create_project,
            project_commands::get_all_projects,
            project_commands::update_project,
            project_commands::delete_project,
            // 附件相关的指令
            attachment_commands::create_url_attachment,
            attachment_commands::get_attachments_for_task,
            attachment_commands::delete_attachment,
            attachment_commands::create_local_path_attachment,
            // 提醒相关的指令
            reminder_commands::create_reminder,
            reminder_commands::get_reminders_for_task,
            reminder_commands::delete_reminder,
            // 设置相关的指令
            settings_commands::get_data_path,
            settings_commands::set_data_path
        ])
        // 启动应用
        .run(tauri::generate_context!())
        .expect("运行 Tauri 应用时出错");

    Ok(())
}
