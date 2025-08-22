import { useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { logger } from "../../../shared/lib/logger";
import { useAppMutation } from "../../../shared/api/useAppMutation";

type CreateLocalPathAttachmentPayload = {
    taskId: bigint;
    path: string;
};

export function useCreateLocalPathAttachment() {
    const queryClient = useQueryClient();
    return useAppMutation({
        mutationFn: (payload: CreateLocalPathAttachmentPayload) => {
            logger.debug(`[API] useCreateLocalPathAttachment 调用 | payload: ${JSON.stringify(payload)}`);
            return invoke("create_local_path_attachment", {
                taskId: payload.taskId,
                path: payload.path,
            });
        },
        onSuccess: (_, variables) => {
            logger.info(`[API] 成功添加本地路径附件 | taskId: ${variables.taskId}`);
            queryClient.invalidateQueries({
                queryKey: ["attachments", variables.taskId],
            });
        },
    });
}