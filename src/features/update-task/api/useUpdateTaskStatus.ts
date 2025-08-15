// src/features/update-task/api/useUpdateTaskStatus.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";

// 定义 mutation 函数接收的参数类型，让代码更清晰
type UpdateTaskPayload = {
    id: bigint;
    isCompleted: boolean;
};

export function useUpdateTaskStatus() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        /**
         * @property mutationFn: 接收一个包含 id 和 isCompleted 的对象。
         * 调用后端的 `update_task_status` 指令来更新数据。
         */
        mutationFn: (payload: UpdateTaskPayload) =>
            invoke("update_task_status", {
                id: payload.id,
                isCompleted: payload.isCompleted,
            }),

        /**
         * @property onSuccess: 成功后，同样让 ['tasks'] 查询失效，以触发列表自动刷新。
         */
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    return mutation;
}