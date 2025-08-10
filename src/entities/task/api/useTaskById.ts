import { useQuery } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import type { Task } from "../model/types";

/**
 * @description 根据 ID 获取单个任务的详细信息。
 * @param taskId - 要获取的任务的 ID，可以是 null。
 */
export function useTaskById(taskId: number | null) { // 允许 taskId 为 null
    return useQuery({
        queryKey: ["tasks", taskId],
        queryFn: async () => {
            // 如果 taskId 不存在，不应该调用后端，而是直接返回 null
            if (!taskId) return null;
            return invoke<Task>("get_task_by_id", { id: taskId });
        },
        /**
         * @property enabled
         * 只有当 taskId 是一个有效的数字时，这个查询才会真正执行。
         * 当 taskId 为 null 时，查询会处于非活动状态，不会去请求后端。
         */
        enabled: !!taskId,
    });
}