import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";

type CreateLocalPathAttachmentPayload = {
    taskId: number;
    path: string;
};

export function useCreateLocalPathAttachment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateLocalPathAttachmentPayload) =>
            invoke("create_local_path_attachment", {
                taskId: payload.taskId,
                path: payload.path,
            }),

        onSuccess: (_, variables) => {
            // 成功添加后，刷新对应任务的附件列表
            queryClient.invalidateQueries({
                queryKey: ["attachments", variables.taskId],
            });
        },
    });
}