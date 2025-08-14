/**
 * @description 代表一个提醒事项的核心数据结构。
 * 与 Rust 后端的 `domain::reminder::Reminder` 结构体对应。
 */
export interface Reminder {
    id: number;
    task_id: number;
    /**
     * @description 精确的提醒时间 (UTC)，ISO 8601 格式字符串。
     */
    remind_at: string;
    /**
     * @description 提醒是否已发送。
     */
    is_sent: boolean;
}