import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";

export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: bigint) => invoke("delete_project", { id }),
        onSuccess: () => {
            // 成功删除项目后，不仅要刷新项目列表，
            // 也要刷新任务列表，因为有些任务的 project_id 可能变成了 null。
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}