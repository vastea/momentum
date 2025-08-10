// src/entities/task/model/types.ts

/**
 * @description 代表一个任务的核心数据结构。
 * 这个类型定义与 Rust 后端的 `domain::task::Task` 结构体严格对应。
 * 它是前端所有任务相关操作的数据基础。
 */
export type Task = {
    /**
     * @description 任务的唯一数字ID。
     * 对应 Rust 的 `i64`。
     */
    id: number;

    /**
     * @description 任务的标题内容。
     * 对应 Rust 的 `String`。
     */
    title: string;

    /**
     * @description 任务是否已完成。
     * 对应 Rust 的 `bool`。
     */
    is_completed: boolean;

    /**
     * @description 新增：任务所属项目的ID。
     * 如果任务不属于任何项目，则该值为 null。
     * 这需要与我们数据库中的 `project_id INTEGER` (可为NULL) 字段相对应。
     */
    project_id: number | null;

    /**
     * @description 任务的创建时间。
     * 对应 Rust 的 `DateTime<Utc>`。
     * @note 在从后端序列化为 JSON 后，`DateTime<Utc>` 类型会转换为 ISO 8601 格式的字符串。
     * 例如："2025-08-08T12:34:56.12345Z"
     */
    created_at: string;

    /**
     * @description 任务的最后更新时间。
     * 同样，这是一个 ISO 8601 格式的字符串。
     */
    updated_at: string;
};