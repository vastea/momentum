import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { logger } from "../../../shared/lib/logger";

export function useDeleteProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: bigint) => {
            logger.debug(`[API] useDeleteProject 调用 | id: ${id}`);
            return invoke("delete_project", { id });
        },
        onSuccess: (_, id) => {
            logger.info(`[API] 成功删除项目 | id: ${id}`);
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: (error, id) => {
            logger.error(`[API] 删除项目失败 | id: ${id} | error: ${JSON.stringify(error)}`);
        }
    });
}