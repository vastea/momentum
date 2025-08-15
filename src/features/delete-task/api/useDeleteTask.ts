// src/features/delete-task/api/useDeleteTask.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";

export function useDeleteTask() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        /**
         * @property mutationFn: 只接收要删除的任务 `id`。
         */
        mutationFn: (id: bigint) => invoke("delete_task", { id }),

        /**
         * @property onSuccess: 成功删除后，也让 ['tasks'] 查询失效。
         */
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    return mutation;
}