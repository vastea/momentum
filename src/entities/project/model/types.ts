/**
 * @description 代表一个项目的核心数据结构。
 * 与 Rust 后端的 `domain::project::Project` 结构体对应。
 */
export type Project = {
  /**
   * @description 项目的唯一数字ID。
   */
  id: number;

  /**
   * @description 项目的名称。
   */
  name: string;

  /**
   * @description 项目的创建时间 (ISO 8601 格式字符串)。
   */
  created_at: string;

  /**
   * @description 项目的最后更新时间 (ISO 8601 格式字符串)。
   */
  updated_at: string;
};