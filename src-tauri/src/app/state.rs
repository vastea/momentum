use std::sync::Mutex;

// AppState 结构体持有所有需要在Tauri指令间共享的状态。
pub struct AppState {
    // 将数据库连接 `rusqlite::Connection` 包裹在 `Mutex` 中。
    // Mutex（互斥锁）确保在任何时候只有一个线程能访问数据库连接，从而保证了线程安全。
    pub db: Mutex<rusqlite::Connection>,
}
