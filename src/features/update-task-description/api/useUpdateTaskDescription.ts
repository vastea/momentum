import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";

type UpdateDescriptionPayload = {
    id: number;
    description: string | null;
};

export function useUpdateTaskDescription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateDescriptionPayload) =>
            invoke("update_task_description", {
                id: payload.id,
                description: payload.description,
            }),

        onSuccess: () => {
            // 成功后，让所有与 "tasks" 相关的查询都失效
            // 这会刷新任务列表（以显示/隐藏描述指示器）和任务详情
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}