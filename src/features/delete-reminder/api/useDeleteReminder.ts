import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";

export function useDeleteReminder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => invoke("delete_reminder", { id }),
        onSuccess: () => {
            // 成功删除后，让所有 reminders 相关的查询都失效
            // 这是一个简单而有效的策略
            queryClient.invalidateQueries({ queryKey: ["reminders"] });
        },
    });
}