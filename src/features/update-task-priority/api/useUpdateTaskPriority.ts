import { useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { Priority } from "@bindings/Priority";
import { logger } from "../../../shared/lib/logger";
import { useAppMutation } from "../../../shared/api/useAppMutation";

type UpdatePriorityPayload = {
    id: bigint;
    priority: Priority;
};

export function useUpdateTaskPriority() {
    const queryClient = useQueryClient();
    return useAppMutation({
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
    });
}