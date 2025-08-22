import { create } from 'zustand';
import { logger } from '../shared/lib/logger';

// 视图状态类型
type ViewState =
    | { type: 'list'; projectId: bigint | null } // 列表视图，并包含当前项目ID
    | { type: 'detail'; taskId: bigint }      // 详情视图，并包含当前任务ID
    | { type: 'settings' };                 //设置视图

// 确认对话框的状态类型
interface ConfirmationState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
}

interface UiState {
    viewState: ViewState;
    confirmationState: ConfirmationState;
    // 定义可以修改状态的“动作”
    showTaskList: (projectId: bigint | null) => void;
    showTaskDetail: (taskId: bigint) => void;
    showSettings: () => void;
    showConfirmation: (options: { title: string; message: string; onConfirm: () => void }) => void;
    hideConfirmation: () => void;
}

const initialConfirmationState: ConfirmationState = {
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
};


export const useUiStore = create<UiState>((set) => ({
    // 初始状态
    // 应用启动时，默认显示“收件箱”（projectId 为 null）的任务列表
    viewState: { type: 'list', projectId: null },
    confirmationState: initialConfirmationState,

    showTaskList: (projectId) => {
        logger.debug(`[UI Store] 切换到列表视图: ${projectId}`);
        set({ viewState: { type: 'list', projectId } });
    },
    showTaskDetail: (taskId) => {
        logger.debug(`[UI Store] 切换到详情视图: :${taskId}`);
        set({ viewState: { type: 'detail', taskId } });
    },
    showSettings: () => {
        logger.debug(`[UI Store] 切换到设置视图`);
        set({ viewState: { type: 'settings' } });
    },
    showConfirmation: ({ title, message, onConfirm }) => {
        logger.debug(`[UI Store] 显示确认对话框: ${title}`);
        set({
            confirmationState: {
                isOpen: true,
                title,
                message,
                onConfirm,
            },
        });
    },
    hideConfirmation: () => {
        logger.debug(`[UI Store] 隐藏确认对话框`);
        set({ confirmationState: initialConfirmationState });
    },
}));