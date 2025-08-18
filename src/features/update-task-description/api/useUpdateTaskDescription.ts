import { useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { logger } from "../../../shared/lib/logger";
import { useAppMutation } from "../../../shared/api/useAppMutation";

type UpdateDescriptionPayload = {
    id: bigint;
    description: string | null;
};

export function useUpdateTaskDescription() {
    const queryClient = useQueryClient();
    return useAppMutation({
        mutationFn: (payload: UpdateDescriptionPayload) => {
            logger.debug(`[API] useUpdateTaskDescription 调用 | payload: ${JSON.stringify(payload)}`);
            return invoke("update_task_description", {
                id: payload.id,
                description: payload.description,
            });
        },
        onSuccess: (_, variables) => {
            logger.info(`[API] 成功更新任务描述 | taskId: ${variables.id}`);
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}