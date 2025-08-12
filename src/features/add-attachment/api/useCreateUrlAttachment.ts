import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";

type CreateUrlAttachmentPayload = {
    taskId: number;
    url: string;
};

export function useCreateUrlAttachment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateUrlAttachmentPayload) =>
            invoke("create_url_attachment", {
                taskId: payload.taskId,
                url: payload.url,
            }),

        onSuccess: (_, variables) => {
            // 成功添加后，让对应任务的附件列表查询失效，以触发刷新
            queryClient.invalidateQueries({
                queryKey: ["attachments", variables.taskId],
            });
        },
    });
}