import { useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { logger } from "../../../shared/lib/logger";
import { useAppMutation } from "../../../shared/api/useAppMutation";

type UpdateDueDatePayload = {
  id: bigint;
  dueDate: string | null;
};

export function useUpdateTaskDueDate() {
  const queryClient = useQueryClient();
  return useAppMutation({
    mutationFn: (payload: UpdateDueDatePayload) => {
      logger.debug(`[API] useUpdateTaskDueDate 调用 | payload: ${JSON.stringify(payload)}`);
      return invoke("update_task_due_date", {
        id: payload.id,
        dueDate: payload.dueDate,
      });
    },
    onSuccess: (_, variables) => {
      logger.info(`[API] 成功更新任务截止日期 | taskId: ${variables.id}`);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}