import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";

type CreateReminderPayload = {
    taskId: number;
    remindAt: string; // ISO 8601 格式的日期字符串
};

export function useCreateReminder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateReminderPayload) =>
            invoke("create_reminder", {
                taskId: payload.taskId,
                remindAt: payload.remindAt,
            }),
        onSuccess: (_, variables) => {
            // 成功后，让对应任务的提醒列表查询失效，以触发刷新
            queryClient.invalidateQueries({
                queryKey: ["reminders", variables.taskId],
            });
        },
    });
}