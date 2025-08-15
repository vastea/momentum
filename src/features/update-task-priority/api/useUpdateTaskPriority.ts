import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { Priority } from "@bindings/Priority";
import { logger } from "../../../shared/lib/logger";

type UpdatePriorityPayload = {
    id: bigint;
    priority: Priority;
};

export function useUpdateTaskPriority() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdatePriorityPayload) => {
            logger.debug(`[API] useUpdateTaskPriority 调用 | payload: ${JSON.stringify(payload)}`);
            return invoke("update_task_priority", {
                id: payload.id,
                priority: payload.priority,
            });
        },
        onSuccess: (_, variables) => {
            logger.info(`[API] 成功更新任务优先级 | taskId: ${variables.id}`);
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: (error, variables) => {
            logger.error(`[API] 更新任务优先级失败 | variables: ${JSON.stringify(variables)} | error: ${JSON.stringify(error)}`);
        }
    });
}