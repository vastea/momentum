/**
 * @description 将 ISO 格式的日期字符串格式化为用户友好的相对或绝对日期。
 * @param dueDateString - 从后端接收的 UTC 日期字符串，或 null。
 * @returns 格式化后的日期字符串，如“今天”、“明天”、“8月12日”。
 */
export function formatDueDate(dueDateString: string | null): string | null {
  if (!dueDateString) {
    return null;
  }

  const dueDate = new Date(dueDateString);
  const now = new Date();

  // 将时间部分清零，只比较日期
  const dueDateStartOfDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const nowStartOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const oneDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.round((dueDateStartOfDay.getTime() - nowStartOfDay.getTime()) / oneDay);

  if (diffDays === 0) {
    return "今天";
  }
  if (diffDays === 1) {
    return "明天";
  }
  if (diffDays === -1) {
    return "昨天";
  }

  // 如果年份是今年，则不显示年份
  if (dueDate.getFullYear() === now.getFullYear()) {
    return dueDate.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }); // 例如 "8月12日"
  }

  // 否则，显示完整的年月日
  return dueDate.toLocaleDateString('zh-CN'); // 例如 "2026/8/12"
}