import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { logger } from "../../../shared/lib/logger";

type CreateReminderPayload = {
    taskId: bigint;
    remindAt: string;
};

export function useCreateReminder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateReminderPayload) => {
            logger.debug(`[API] useCreateReminder 调用 | payload: ${JSON.stringify(payload)}`);
            return invoke("create_reminder", {
                taskId: payload.taskId,
                remindAt: payload.remindAt,
            });
        },
        onSuccess: (_, variables) => {
            logger.info(`[API] 成功创建提醒 | taskId: ${variables.taskId}`);
            queryClient.invalidateQueries({
                queryKey: ["reminders", variables.taskId],
            });
            // 同时刷新任务列表，以显示 next_reminder_at
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: (error, variables) => {
            logger.error(`[API] 创建提醒失败 | variables: ${JSON.stringify(variables)} | error: ${JSON.stringify(error)}`);
        }
    });
}