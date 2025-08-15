import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { Task } from "@bindings/Task";
import { logger } from "../../../shared/lib/logger";

type CreateTaskPayload = {
    title: string;
    projectId: bigint | null;
    parentId: bigint | null;
};

export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation({
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
        onError: (error, variables) => {
            logger.error(`[API] 创建任务失败 | variables: ${JSON.stringify(variables)} | error: ${JSON.stringify(error)}`);
        }
    });
}