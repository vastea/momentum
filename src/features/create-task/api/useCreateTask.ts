import { useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { Task } from "@bindings/Task";
import { logger } from "../../../shared/lib/logger";
import { useAppMutation } from "../../../shared/api/useAppMutation";

type CreateTaskPayload = {
    title: string;
    projectId: bigint | null;
    parentId: bigint | null;
};

export function useCreateTask() {
    const queryClient = useQueryClient();
    return useAppMutation({
        mutationFn: (payload: CreateTaskPayload) => {
            logger.debug(`[API] useCreateTask 调用 | payload: ${JSON.stringify(payload)}`);
            return invoke<Task>("create_task", {
                title: payload.title,
                projectId: payload.projectId,
                parentId: payload.parentId,
            });
        },
        onSuccess: (data) => {
            logger.info(`[API] 成功创建任务 | data: ${JSON.stringify(data)}`);
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}