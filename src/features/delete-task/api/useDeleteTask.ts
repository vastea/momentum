import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { logger } from "../../../shared/lib/logger";

export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: bigint) => {
            logger.debug(`[API] useDeleteTask 调用 | id: ${id}`);
            return invoke("delete_task", { id });
        },
        onSuccess: (_, id) => {
            logger.info(`[API] 成功删除任务 | id: ${id}`);
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: (error, id) => {
            logger.error(`[API] 删除任务失败 | id: ${id} | error: ${JSON.stringify(error)}`);
        }
    });
}