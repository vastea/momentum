import { useUiStore } from "../../stores/uiStore";
import { useTaskById } from "../../entities/task/api/useTaskById";
import { useTasksByParent } from "../../entities/task/api/useTasks";
import { TaskItem } from "../../entities/task/ui/TaskItem";
import { CreateTaskForm } from "../../features/create-task/ui/CreateTaskForm";
import type { Task } from "../../entities/task/model/types";
import "./TaskDetailView.css";

interface TaskDetailViewProps {
    taskId: number;
}

export function TaskDetailView({ taskId }: TaskDetailViewProps) {
    const setViewingTaskId = useUiStore((state) => state.setViewingTaskId);

    const { data: parentTask, isLoading: isLoadingParent } = useTaskById(taskId);
    // 在任务详情视图中，获取的是子任务，
    // projectId 设为 null (因为后端不按它筛选子任务)，
    // parentId 设为当前正在查看的任务ID。
    const { data: subtasks, isLoading: isLoadingSubtasks } = useTasksByParent({
        projectId: null,
        parentId: taskId,
    });

    return (
        <div className="task-detail-view">
            <div className="detail-view-header">
                <button onClick={() => setViewingTaskId(null)} className="back-button">
                    &larr; 返回列表
                </button>
            </div>

            {isLoadingParent && <div>正在加载主任务...</div>}
            {parentTask && (
                <div className="parent-task-info">
                    <h1>{parentTask.title}</h1>
                </div>
            )}

            <div className="subtask-section">
                <h2>子任务</h2>
                <CreateTaskForm parentId={taskId} />

                <div className="subtask-list">
                    {isLoadingSubtasks && <div>正在加载子任务...</div>}
                    {/* 为 .map() 中的参数 `subtask` 明确指定类型为 Task */}
                    {subtasks?.map((subtask: Task) => (
                        <TaskItem key={subtask.id} task={subtask} />
                    ))}
                    {subtasks?.length === 0 && <div className="empty-state">还没有子任务</div>}
                </div>
            </div>
        </div>
    );
}