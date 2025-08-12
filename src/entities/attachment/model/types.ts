/**
 * @description 附件的类型，与 Rust 后端的 AttachmentType 枚举对应。
 */
export type AttachmentType = "Url" | "LocalPath";

/**
 * @description 附件的核心数据结构，与 Rust 后端的 Attachment 结构体对应。
 */
export interface Attachment {
    id: number;
    task_id: number;
    attachment_type: AttachmentType;
    // 对于 "Url" 类型是网址，对于 "LocalPath" 则是文件路径
    payload: string;
}