import { useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { logger } from "../../../shared/lib/logger";
import { useAppMutation } from "../../../shared/api/useAppMutation";

export function useDeleteAttachment() {
    const queryClient = useQueryClient();
    return useAppMutation({
        mutationFn: (id: bigint) => {
            logger.debug(`[API] useDeleteAttachment 调用 | id: ${id}`);
            return invoke("delete_attachment", { id });
        },
        onSuccess: (_, id) => {
            logger.info(`[API] 成功删除附件 | id: ${id}`);
            queryClient.invalidateQueries({ queryKey: ["attachments"] });
        },
    });
}