use crate::domain::priority::Priority;
use chrono::{DateTime, Utc}; // 引入 `chrono` 库来处理与时区无关的时间。
use serde::Serialize; // 引入 `serde` 的 `Serialize` Trait，用于将结构体序列化为 JSON。
use ts_rs::TS;

/// 核心业务模型：任务
/// 它代表了一个待办事项的完整信息，是领域驱动设计（DDD）中的“领域对象”。
#[derive(Debug, Serialize, Clone, TS)]
#[ts(export)]
pub struct Task {
    /// 任务的唯一标识符，使用 `i64` 以匹配数据库的 `INTEGER` 类型，并能容纳大量数据。
    pub id: i64,
    /// 任务的标题。
    pub title: String,

    /// 任务的详细描述。
    // 使用 `Option<String>` 来表示一个可以为 `None` (NULL) 的文本。
    pub description: Option<String>,

    /// 任务是否已完成。
    pub is_completed: bool,

    /// 任务所属项目的 ID。
    // 使用 `Option<i64>` 类型来表示这个字段。
    // - `Some(project_id)`: 代表任务属于某个项目。
    // - `None`: 代表任务不属于任何项目（对应数据库中的 NULL）。
    pub project_id: Option<i64>,

    /// 父任务的ID。
    // 使用 `Option<i64>` 类型来表示这个字段。
    // - `Some(parent_id)`: 代表这是一个子任务。
    // - `None`: 代表这是一个顶层任务（父任务），对应数据库中的 NULL。
    pub parent_id: Option<i64>,

    // 子任务的数量。
    // 这个字段不存在于数据库表中，而是通过 SQL 查询动态计算出来的。
    pub subtask_count: i64,

    /// 优先级
    pub priority: Priority,

    /// 任务的截止日期。
    pub due_date: Option<DateTime<Utc>>,

    /// 最近一次未发送的提醒时间 (如果有的话)
    pub next_reminder_at: Option<DateTime<Utc>>,

    /// 使用 `chrono` 的 `DateTime<Utc>` 来确保所有时间戳都使用统一的世界协调时（UTC）。
    /// 这是处理时间的最佳实践，可以避免因用户本地时区不同而导致的数据混乱。
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
