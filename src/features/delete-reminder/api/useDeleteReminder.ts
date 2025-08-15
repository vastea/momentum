import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { logger } from "../../../shared/lib/logger";

export function useDeleteReminder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: bigint) => {
            logger.debug(`[API] useDeleteReminder 调用 | id: ${id}`);
            return invoke("delete_reminder", { id });
        },
        onSuccess: (_, id) => {
            logger.info(`[API] 成功删除提醒 | id: ${id}`);
            queryClient.invalidateQueries({ queryKey: ["reminders"] });
            // 同时刷新任务列表，以更新 next_reminder_at
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: (error, id) => {
            logger.error(`[API] 删除提醒失败 | id: ${id} | error: ${JSON.stringify(error)}`);
        }
    });
}