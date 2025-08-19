import { useTasksByParent } from "../../entities/task/api/useTasks";
import { TaskItem } from "../../entities/task/ui/TaskItem";
import { useProjects } from "../../entities/project/api/useProjects";
import './TaskList.css';
import React from "react";

interface TaskListProps {
    projectId: bigint | null;
}

export function TaskList({ projectId }: TaskListProps) {

    // 在任务列表视图中，获取的是顶级任务 (parentId: null)，
    // 并根据当前选中的项目 (selectedProjectId) 进行筛选。
    const { data: tasks, isLoading, isError, error } = useTasksByParent({
        projectId: projectId,
        parentId: null, // 只获取顶级任务
    });

    // 获取所有项目的列表
    const { data: projects } = useProjects();

    // 创建一个从 projectId 到 projectName 的映射，方便快速查找
    // 使用 `useMemo` 可以避免在每次重新渲染时都重复创建 Map
    const projectMap = React.useMemo(() => {
        if (!projects) return new Map();
        return new Map(projects.map(p => [p.id, p.name]));
    }, [projects]);

    if (isError) {
        return <div>加载任务失败: {error.message}</div>;
    }

    return (
        <div className="task-list-container">
            {tasks && tasks.length > 0 ? (
                tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        // 将查找到的项目名称作为 prop 传递给 TaskItem
                        projectName={task.project_id ? projectMap.get(task.project_id) : undefined}
                    />
                ))
            ) : (
                <div className="empty-state">
                    {isLoading ? "正在加载任务..." : "这个列表还没有任务！"}
                </div>
            )}
        </div>
    );
}