// 使用 `thiserror` 库可以方便地为自定义 Error 枚举派生标准的错误处理能力。
#[derive(Debug, thiserror::Error)]
pub enum Error {
    // `#[error(transparent)]` 和 `#[from]` 能优雅地将其他错误类型（如 rusqlite::Error）
    // “包装”进自己的 Error 类型中，无需编写额外的转换代码。
    #[error(transparent)]
    Sqlite(#[from] rusqlite::Error),
}

// `pub type Result<T>` 是一个贯穿整个项目的类型别名，
// 它代表一个返回 `T` 或自定义 `Error` 的 `Result`，简化了函数签名。
pub type Result<T> = std::result::Result<T, Error>;

// 为了让的自定义错误能被 Tauri 正确序列化并通过 `invoke` 的 `reject` 返回给前端，
// 需要为它手动实现 `serde::Serialize` Trait。
impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        // 只将错误的文本信息序列化为字符串发给前端。
        serializer.serialize_str(self.to_string().as_ref())
    }
}
