import { useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { logger } from "../../../shared/lib/logger";
import { useAppMutation } from "../../../shared/api/useAppMutation";

export function useDeleteProject() {
    const queryClient = useQueryClient();
    return useAppMutation({
        mutationFn: (id: bigint) => {
            logger.debug(`[API] useDeleteProject 调用 | id: ${id}`);
            return invoke("delete_project", { id });
        },
        onSuccess: (_, id) => {
            logger.info(`[API] 成功删除项目 | id: ${id}`);
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}