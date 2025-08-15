import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { Priority } from "@bindings/Priority";

// 定义 mutation 函数接收的参数类型
type UpdatePriorityPayload = {
    id: bigint;
    priority: Priority;
};

export function useUpdateTaskPriority() {
    const queryClient = useQueryClient();

    return useMutation({
        /**
         * @property mutationFn: 接收包含 id 和 priority 的对象，
         * 调用后端的 `update_task_priority` 指令。
         */
        mutationFn: (payload: UpdatePriorityPayload) =>
            invoke("update_task_priority", {
                id: payload.id,
                priority: payload.priority,
            }),

        /**
         * @property onSuccess: 成功后，让所有与 "tasks" 相关的查询都失效，
         * 这样任务列表会以新的优先级顺序重新获取和渲染。
         */
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}