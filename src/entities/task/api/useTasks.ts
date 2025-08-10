// src/entities/task/api/useTasks.ts

import { useQuery } from "@tanstack/react-query";
// 引入之前创建的、类型安全的 invoke 辅助函数
import { invoke } from "../../../shared/api/tauri";
// 引入刚刚定义的 Task 类型
import type { Task } from "../model/types";
import {useUiStore} from "../../../stores/uiStore.ts";

/**
 * @description useTasks 是一个自定义 React Hook，专门用于从后端获取所有任务的列表。
 * 它封装了 useQuery 的所有逻辑，让组件可以一行代码就获取到需要的数据、加载状态和错误信息。
 */
export function useTasks() {
    // 从 store 中获取当前选中的项目 ID
    const selectedProjectId = useUiStore((state) => state.selectedProjectId);

    // useQuery是 TanStack Query 的核心 Hook，用于获取（查询）数据。
    // 它接收一个配置对象，其中最重要的两个属性是 queryKey 和 queryFn。
    const query = useQuery({
        /**
         * @property queryKey: 一个用于唯一标识此查询的数组。
         * TanStack Query 会使用这个 key 来进行缓存、重新获取等所有操作。
         * 当其他地方的代码让这个 key 失效时，查询会自动重新运行。
         */
        queryKey: ["tasks", selectedProjectId],

        /**
         * @property queryFn: 一个返回 Promise 的查询函数，用于实际获取数据。
         * 这个函数必须是异步的（async）。
         * 在这里调用后端的 `get_all_tasks` 指令。
         * 为 invoke 指定了泛型 <Task[]>，这样 TypeScript 就会知道这个 Promise
         * 成功时会返回一个 Task 类型的数组，从而提供完整的类型安全。
         */
        queryFn: async () => invoke<Task[]>("get_all_tasks", { projectId: selectedProjectId }),
    });

    return query;
}