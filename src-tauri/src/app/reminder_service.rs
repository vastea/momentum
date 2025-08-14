use crate::app::state::AppState;
use crate::db::queries::{reminder_queries, task_queries};
use std::{thread, time::Duration};
use tauri::{Emitter, Manager};
use tauri_plugin_notification::NotificationExt;

/// 启动后台提醒轮询服务
pub fn start(app_handle: tauri::AppHandle) {
    // 创建一个新线程，防止阻塞 Tauri 的主线程
    thread::spawn(move || {
        // 这是一个无限循环，代表服务在持续运行
        loop {
            // --- 1. 暂停一分钟 ---
            // 每次循环后，线程会“睡眠”60秒。
            // 这定义了轮询频率，避免了不必要的 CPU 占用。
            thread::sleep(Duration::from_secs(60));

            println!("[ReminderService] Tick! Checking for due reminders...");

            // --- 2. 获取数据库连接 ---
            // `app_handle.state()` 用于安全地从 Tauri 的状态管理器中获取 AppState。
            let state = app_handle.state::<AppState>();
            let conn_guard = state.db.lock().unwrap();

            // --- 3. 查询到期的提醒 ---
            // 使用 `get_due_reminders` 函数。
            // 在 `if let Ok(...)` 中处理，以确保即使查询失败，线程也不会崩溃。
            if let Ok(reminders) = reminder_queries::get_due_reminders(&conn_guard) {
                if !reminders.is_empty() {
                    println!("[ReminderService] Found {} due reminders.", reminders.len());
                }

                let mut sent_ids = Vec::new();
                // 被提醒的任务id
                let mut affected_task_ids = Vec::new();

                // --- 4. 遍历提醒并发送通知 ---
                for reminder in reminders {
                    // 获取提醒关联的任务，以在通知中显示任务标题
                    if let Ok(task) = task_queries::get_task_by_id(&conn_guard, reminder.task_id) {
                        // 使用 tauri-plugin-notification 构建和发送通知
                        let notification_result = app_handle
                            .notification()
                            .builder()
                            .title("Momentum 任务提醒")
                            .body(format!("任务 '{}' 即将到期！", task.title))
                            .show();

                        if let Ok(_) = notification_result {
                            // 如果通知发送成功，记录其 ID
                            sent_ids.push(reminder.id);
                            // 记录任务id
                            affected_task_ids.push(task.id);
                            println!("{} task notice success", task.id)
                        } else {
                            eprintln!(
                                "[ReminderService] Error sending notification for reminder ID: {}",
                                reminder.id
                            );
                        }
                    }
                }

                // --- 5. 将已发送的提醒在数据库中标记 ---
                // 批量更新，以提高效率
                if !sent_ids.is_empty() {
                    if let Err(e) = reminder_queries::mark_reminders_as_sent(&conn_guard, &sent_ids)
                    {
                        eprintln!("[ReminderService] Error marking reminders as sent: {}", e);
                    } else {
                        println!(
                            "[ReminderService] Marked {} reminders as sent.",
                            sent_ids.len()
                        );
                        // 发送全局事件
                        // `emit_all` 会向所有打开的窗口广播这个事件。
                        // 事件名为 "reminder_sent"，payload 是一个包含所有受影响 task_id 的数组。
                        if let Err(e) = app_handle.emit("reminder_sent", &affected_task_ids) {
                            eprintln!("[ReminderService] Error emitting event: {}", e);
                        }
                    }
                }
            }
        }
    });
}
