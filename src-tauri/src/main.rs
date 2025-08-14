// src-tauri/src/main.rs

// 在非调试模式下（即发布版），禁用 Windows 系统上的命令行窗口。
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use momentum_lib::app::commands::{attachment_commands, project_commands};
use momentum_lib::{
    app::{self, commands::task_commands},
    error::Result,
};

use tauri::include_image;
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};

fn main() -> Result<()> {
    tauri::Builder::default()
        // 注册插件
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        // `.setup()` 钩子函数，在 webview 准备好之前运行，适合进行初始化操作。
        .setup(|app| {
            // 初始化数据库和应用状态
            let state = app::setup::init_database(app.handle())?;
            app.handle().manage(state);

            // 定义托盘右键菜单：显示窗口 / 退出
            let show_item = MenuItem::with_id(app, "show", "显示窗口", true, None::<&str>)?;
            let exit_item = MenuItem::with_id(app, "exit", "退出", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_item, &exit_item])?;

            // 创建并配置托盘图标
            TrayIconBuilder::new()
                // 设置托盘图标
                .icon(include_image!("icons/icon.png"))
                // 设置鼠标悬停提示
                .tooltip("Momentum 正在运行")
                // 附加菜单
                .menu(&menu)
                // 处理菜单点击
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
                // 处理托盘图标点击
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

            Ok(())
        })
        // 注册窗口事件处理器：点击关闭按钮时仅隐藏窗口
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
            attachment_commands::create_local_path_attachment
        ])
        // 启动应用
        .run(tauri::generate_context!())
        .expect("运行 Tauri 应用时出错");

    Ok(())
}
