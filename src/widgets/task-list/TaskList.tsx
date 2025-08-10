import { useTasksByParent } from "../../entities/task/api/useTasks";
import { TaskItem } from "../../entities/task/ui/TaskItem";
import { useUiStore } from "../../stores/uiStore";
import { TaskDetailView } from "../task-detail-view/TaskDetailView";
import './TaskList.css';

export function TaskList() {
    const { selectedProjectId, viewingTaskId } = useUiStore();

    // 在任务列表视图中，获取的是顶级任务 (parentId: null)，
    // 并根据当前选中的项目 (selectedProjectId) 进行筛选。
    const { data: tasks, isLoading, isError, error } = useTasksByParent({
        projectId: selectedProjectId,
        parentId: null, // 只获取顶级任务
    });

    if (viewingTaskId) {
        return <TaskDetailView taskId={viewingTaskId} />;
    }

    if (isError) {
        return <div>加载任务失败: {error.message}</div>;
    }

    return (
        <div className="task-list-container">
            {tasks && tasks.length > 0 ? (
                tasks.map((task) => <TaskItem key={task.id} task={task} />)
            ) : (
                <div className="empty-state">
                    {isLoading ? "正在加载任务..." : "这个列表还没有任务！"}
                </div>
            )}
        </div>
    );
}