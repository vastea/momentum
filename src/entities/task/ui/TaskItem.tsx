import type { Task } from "../model/types";
import { useUpdateTaskStatus } from "../../../features/update-task/api/useUpdateTaskStatus";
import { useDeleteTask } from "../../../features/delete-task/api/useDeleteTask";
import './TaskItem.css';
import {useUiStore} from "../../../stores/uiStore.ts";
import {PrioritySelector} from "../../../features/update-task-priority/ui/PrioritySelector.tsx"; // 将为组件添加一些样式

interface TaskItemProps {
    /**
     * @property task: 组件接收的单个任务对象
     */
    task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
    // 在组件内部调用刚刚创建的 Hooks，获取执行 mutation 的能力
    const { mutate: updateStatus } = useUpdateTaskStatus();
    const { mutate: deleteTask } = useDeleteTask();
    const setViewingTaskId = useUiStore((state) => state.setViewingTaskId);

    /**
     * 当复选框状态改变时调用的处理函数
     */
    const handleToggleComplete = () => {
        // 调用 updateStatus mutation，并传入需要的参数
        updateStatus({ id: task.id, isCompleted: !task.is_completed });
    };

    /**
     * 当删除按钮被点击时调用的处理函数
     */
    const handleDelete = () => {
        // 调用 deleteTask mutation，并传入任务 id
        deleteTask(task.id);
    };

    return (
        // 根据任务的优先级，为整个任务项添加一个边框颜色提示
        <div className={`task-item priority-border-${task.priority.toLowerCase()}`}>
            <input
                type="checkbox"
                checked={task.is_completed}
                onChange={handleToggleComplete}
                className="task-checkbox"
            />
            {/* 在复选框和标题之间，添加优先级选择器 */}
            <PrioritySelector task={task} />
            {/* 将标题包裹在一个可点击的 div 中 */}
            <div className="task-content" onClick={() => setViewingTaskId(task.id)}>
                <span className={`task-title ${task.is_completed ? "completed" : ""}`}>
                  {task.title}
                </span>
                {/* 如果有子任务，就显示指示器 */}
                {task.subtask_count > 0 && (
                    <div className="subtask-indicator">
                        {task.subtask_count} 个子任务
                    </div>
                )}
            </div>
            <button onClick={handleDelete} className="delete-button">
                &times; {/* HTML 的乘号实体，作为删除图标 */}
            </button>
        </div>
    );
}