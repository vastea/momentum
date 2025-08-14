// `pub` 关键字让这些模块变为公开，允许 `main.rs` 访问它们。
pub mod app;
pub(crate) mod db;
pub(crate) mod domain;
pub mod error;
