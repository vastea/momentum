import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { Task } from "@bindings/Task";

// 定义 mutation 函数接收的参数类型
type CreateTaskPayload = {
    title: string;
    projectId: bigint | null; // projectId 可以是 null
    parentId: bigint | null;
};

/**
 * @description useCreateTask 是一个用于创建新任务的自定义 React Hook。
 * 它封装了 `useMutation` 的逻辑。
 */
export function useCreateTask() {
    // `useQueryClient` Hook 让能访问到 QueryClient 的实例，
    // 它是 TanStack Query 的大脑，可以用它来手动操作缓存。
    const queryClient = useQueryClient();

    // `useMutation` 用于执行会改变后端数据的操作。
    return useMutation({
        /**
         * @property mutationFn: 一个执行数据变更的异步函数。
         * 接收一个包含 title 和 projectId 的对象,
         * 然后调用后端的 `create_task` 指令。
         * 将此对象包装在一个对象中以匹配 Tauri指令的参数格式。
         */
        mutationFn: (payload: CreateTaskPayload) =>
            invoke<Task>("create_task", {
                title: payload.title,
                projectId: payload.projectId, // 将 projectId 传递给后端
                parentId: payload.parentId, // 传递 parentId
            }),

        /**
         * @property onSuccess: 一个在 mutationFn 成功执行后触发的回调函数。
         * 这是实现自动更新的关键！
         * `queryClient.invalidateQueries` 会告诉 TanStack Query，
         * 所有 queryKey 为 ['tasks'] 的查询数据都“过时”了。
         * TanStack Query 会自动在后台重新运行这些查询，
         * 从而让使用了 `useTasks` Hook 的组件获取到最新的任务列表并重新渲染。
         */
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}