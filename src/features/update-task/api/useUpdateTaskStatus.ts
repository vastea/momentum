import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { logger } from "../../../shared/lib/logger";

type UpdateTaskPayload = {
    id: bigint;
    isCompleted: boolean;
};

export function useUpdateTaskStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateTaskPayload) => {
            logger.debug(`[API] useUpdateTaskStatus 调用 | payload: ${JSON.stringify(payload)}`);
            return invoke("update_task_status", {
                id: payload.id,
                isCompleted: payload.isCompleted,
            });
        },
        onSuccess: (_, variables) => {
            logger.info(`[API] 成功更新任务状态 | taskId: ${variables.id}, isCompleted: ${variables.isCompleted}`);
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: (error, variables) => {
            logger.error(`[API] 更新任务状态失败 | variables: ${JSON.stringify(variables)} | error: ${JSON.stringify(error)}`);
        }
    });
}