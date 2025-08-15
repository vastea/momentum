import { useQuery } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { Reminder } from "@bindings/Reminder";

/**
 * @description 根据任务 ID 获取其所有提醒的自定义 Hook。
 * @param taskId - 要获取提醒的任务的 ID。
 */
export function useReminders(taskId: number | null) {
    return useQuery({
        queryKey: ["reminders", taskId],
        queryFn: async () => {
            if (!taskId) return []; // 如果没有 taskId，返回空数组
            return invoke<Reminder[]>("get_reminders_for_task", { taskId });
        },
        enabled: !!taskId, // 只有当 taskId 有效时才执行
    });
}