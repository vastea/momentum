use chrono::{DateTime, Utc};
use serde::Serialize;
use ts_rs::TS;

/// 提醒事项的领域模型
#[derive(Debug, Serialize, Clone, TS)]
#[ts(export)]
pub struct Reminder {
    pub id: i64,
    pub task_id: i64,
    /// 精确的提醒时间 (UTC)
    pub remind_at: DateTime<Utc>,
    /// 是否已发送
    pub is_sent: bool,
}
