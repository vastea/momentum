// src/widgets/task-list/TaskList.tsx

import { useTasks } from "../../entities/task/api/useTasks";
import { TaskItem } from "../../entities/task/ui/TaskItem";
import './TaskList.css';

export function TaskList() {
    // 调用之前创建的 useTasks Hook 来获取数据。
    // TanStack Query 为返回了所有需要的数据和状态。
    const { data: tasks, isLoading, isError, error } = useTasks();

    // 当数据还在加载时，显示一个提示信息。
    if (isLoading) {
        return <div>正在加载任务...</div>;
    }

    // 当发生错误时，显示错误信息。
    if (isError) {
        return <div>加载任务失败: {error.message}</div>;
    }

    // 当数据成功加载后，渲染任务列表。
    return (
        <div className="task-list-container">
            {/* 检查 tasks 是否为空或长度为0 */}
            {tasks && tasks.length > 0 ? (
                // 使用 .map() 遍历任务数组，为每个任务渲染一个 TaskItem 组件。
                // `key` 是 React 在渲染列表时用于优化的必需属性，使用任务的唯一 id。
                tasks.map((task) => <TaskItem key={task.id} task={task} />)
            ) : (
                // 如果没有任务，显示一个提示信息。
                <div className="empty-state">太棒了，所有任务都已完成！</div>
            )}
        </div>
    );
}