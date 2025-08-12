import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";

export function useDeleteAttachment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => invoke("delete_attachment", { id }),
        onSuccess: () => {
            // 成功删除后，需要找到这个附件属于哪个任务，
            // 并刷新该任务的附件列表。
            // 但在这里我们不知道 taskId，所以采用更广泛的失效策略。
            queryClient.invalidateQueries({ queryKey: ["attachments"] });
        },
    });
}