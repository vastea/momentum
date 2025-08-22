use serde::{Deserialize, Serialize};
use ts_rs::TS;

/// @description 定义附件的类型。
#[derive(Debug, Serialize, Deserialize, Clone, Copy, PartialEq, Eq, TS)]
#[ts(export)]
pub enum AttachmentType {
    Url,       // 网络 Url
    LocalPath, // 本地文件/文件夹路径
}

/// @description 定义附件的核心数据结构。
#[derive(Debug, Serialize, Clone, TS)]
#[ts(export)]
pub struct Attachment {
    pub id: i64,
    pub task_id: i64,
    pub attachment_type: AttachmentType,
    pub payload: String,
}

// --- 类型转换：实现 Rust 代码 <-> 数据库 (String) 的转换 ---

/// 将数据库中的字符串转换为 AttachmentType 枚举
impl From<&str> for AttachmentType {
    fn from(value: &str) -> Self {
        match value {
            "Url" => AttachmentType::Url,
            "LocalPath" => AttachmentType::LocalPath,
            _ => AttachmentType::Url, // 默认或备用情况
        }
    }
}

/// 将 AttachmentType 枚举转换为字符串存入数据库
impl From<AttachmentType> for &str {
    fn from(value: AttachmentType) -> Self {
        match value {
            AttachmentType::Url => "Url",
            AttachmentType::LocalPath => "LocalPath",
        }
    }
}
