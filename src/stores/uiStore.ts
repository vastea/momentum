import { create } from 'zustand';

// 定义状态的接口
interface UiState {
    // 当前选中的项目ID，可以为 null（表示未选择任何项目，例如“收件箱”）
    selectedProjectId: bigint | null;
    // 定义一个可以修改状态的“动作” (Action)
    setSelectedProjectId: (projectId: bigint | null) => void;
    /**
     * @description 当前正在查看详情的任务ID。
     * 如果为 null，表示正在查看任务列表。
     * 如果为数字，表示正在查看该ID对应的任务详情。
     */
    viewingTaskId: bigint | null;
    setViewingTaskId: (taskId: bigint | null) => void;
}

/**
 * 创建一个用于管理全局 UI 状态的 Zustand store
 */
export const useUiStore = create<UiState>((set) => ({
    // 初始状态下，没有选中任何项目
    selectedProjectId: null,
    // 当调用这个函数时，它会使用新的 projectId 来更新状态
    setSelectedProjectId: (projectId) => set({ selectedProjectId: projectId }),

    // 新增状态和 action
    viewingTaskId: null,
    setViewingTaskId: (taskId) => set({ viewingTaskId: taskId }),
}));