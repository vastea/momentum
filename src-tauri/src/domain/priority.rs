use serde::{Deserialize, Serialize}; // 引入 Serialize 和 Deserialize
use ts_rs::TS; // 引入 ts-rs 用于自动生成 TypeScript 类型

/// @description 定义任务的优先级。
/// 使用一个枚举来确保类型安全，避免在代码中使用“魔术数字”。
/// `#[derive(...)]` 宏自动实现了许多有用的功能。
#[derive(Debug, Serialize, Deserialize, Clone, Copy, PartialEq, Eq, TS)]
#[ts(export)] // ts-rs 会读取这个，并导出为 TypeScript 类型
pub enum Priority {
    None,   // 无优先级
    Low,    // 低优先级
    Medium, // 中优先级
    High,   // 高优先级
}

// --- 类型转换：实现 Rust 代码 <-> 数据库 (i64) 的转换 ---

/// 实现 `From<i64>` Trait，用于将数据库中的整数转换为 Priority 枚举。
impl From<i64> for Priority {
    fn from(value: i64) -> Self {
        match value {
            1 => Priority::Low,
            2 => Priority::Medium,
            3 => Priority::High,
            _ => Priority::None, // 任何其他值（包括 0）都视为“无优先级”
        }
    }
}

/// 实现 `From<Priority>` Trait，用于将 Priority 枚举转换为整数存入数据库。
impl From<Priority> for i64 {
    fn from(value: Priority) -> Self {
        match value {
            Priority::None => 0,
            Priority::Low => 1,
            Priority::Medium => 2,
            Priority::High => 3,
        }
    }
}