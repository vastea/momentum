import { useQuery } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import type { Attachment } from "../model/types";

/**
 * @description 根据任务ID获取其所有附件的自定义 Hook。
 * @param taskId - 要获取附件的任务的 ID。
 */
export function useAttachments(taskId: number | null) {
    return useQuery({
        /**
         * @property queryKey: 查询的唯一标识，包含了任务ID。
         */
        queryKey: ["attachments", taskId],

        /**
         * @property queryFn: 调用后端的 `get_attachments_for_task` 指令。
         */
        queryFn: async () => {
            if (!taskId) return []; // 如果没有 taskId，返回空数组
            return invoke<Attachment[]>("get_attachments_for_task", { taskId });
        },

        /**
         * @property enabled: 只有当 taskId 是一个有效数字时，此查询才会执行。
         */
        enabled: !!taskId,
    });
}