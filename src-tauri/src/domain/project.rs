use chrono::{DateTime, Utc};
use serde::Serialize;
use ts_rs::TS;

/// 项目的领域模型，定义了一个“项目”或“分类”的核心属性。
#[derive(Debug, Serialize, Clone, TS)]
#[ts(export)]
pub struct Project {
    pub id: i64,
    pub name: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
