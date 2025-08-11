import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";

// 定义 mutation 函数接收的参数类型
type UpdateDueDatePayload = {
  id: number;
  // dueDate 可以是一个日期字符串，也可以是 null（用于清除截止日期）
  dueDate: string | null;
};

export function useUpdateTaskDueDate() {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * @property mutationFn: 调用后端的 `update_task_due_date` 指令。
     */
    mutationFn: (payload: UpdateDueDatePayload) =>
      invoke("update_task_due_date", {
        id: payload.id,
        dueDate: payload.dueDate,
      }),

    /**
     * @property onSuccess: 成功后，让所有与 "tasks" 相关的查询都失效，
     * 以便界面能显示更新后的截止日期。
     */
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}