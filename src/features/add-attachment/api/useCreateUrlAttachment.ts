import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { logger } from "../../../shared/lib/logger";

type CreateUrlAttachmentPayload = {
    taskId: bigint;
    url: string;
};

export function useCreateUrlAttachment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateUrlAttachmentPayload) => {
            logger.debug(`[API] useCreateUrlAttachment 调用 | payload: ${JSON.stringify(payload)}`);
            return invoke("create_url_attachment", {
                taskId: payload.taskId,
                url: payload.url,
            });
        },
        onSuccess: (_, variables) => {
            logger.info(`[API] 成功添加URL附件 | taskId: ${variables.taskId}`);
            queryClient.invalidateQueries({
                queryKey: ["attachments", variables.taskId],
            });
        },
        onError: (error, variables) => {
            logger.error(`[API] 添加URL附件失败 | variables: ${JSON.stringify(variables)} | error: ${JSON.stringify(error)}`);
        }
    });
}