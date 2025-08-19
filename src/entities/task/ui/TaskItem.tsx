import { Task } from "@bindings/Task";
import { useUpdateTaskStatus } from "../../../features/update-task/api/useUpdateTaskStatus";
import { useDeleteTask } from "../../../features/delete-task/api/useDeleteTask";
import { useUiStore } from "../../../stores/uiStore.ts";
import { PrioritySelector } from "../../../features/update-task-priority/ui/PrioritySelector.tsx"; // 将为组件添加一些样式
import { useUpdateTaskDueDate } from "../../../features/update-task-due-date/api/useUpdateTaskDueDate";
import { useState } from "react";
import { DatePicker } from "../../../shared/ui/DatePicker/DatePicker"; // 引入新组件
import { Calendar, Folder, GitCommitHorizontal, Bell } from "lucide-react";
import './TaskItem.css';
import { formatDueDate } from "../../../shared/lib/dateUtils.ts";

interface TaskItemProps {
    /**
     * @property task: 组件接收的单个任务对象
     */
    task: Task;
    projectName?: string;
}

export function TaskItem({ task, projectName }: TaskItemProps) {
    // 在组件内部调用刚刚创建的 Hooks，获取执行 mutation 的能力
    const { mutate: updateStatus } = useUpdateTaskStatus();
    const { mutate: deleteTask } = useDeleteTask();
    const { mutate: updateDueDate } = useUpdateTaskDueDate();
    const showTaskDetail = useUiStore((state) => state.showTaskDetail);
    const [isDatePickerOpen, setDatePickerOpen] = useState(false); // 新增状态控制弹窗


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

    // 当日期选择器的值改变时触发
    const handleDateChange = (date: Date | undefined) => {
        // `date` 已经是包含完整日期和时间的对象，或者 undefined
        updateDueDate({
            id: task.id,
            dueDate: date ? date.toISOString() : null
        });
        setDatePickerOpen(false); // 选择后关闭弹窗
    };

    return (
        <>
            <div className={`task-item priority-border-${task.priority.toLowerCase()}`}>
                <div className="task-main-content">
                    {/* --- 任务完成情况勾选框 --- */}
                    <input
                        type="checkbox"
                        checked={task.is_completed}
                        onChange={handleToggleComplete}
                        className="task-checkbox"
                    />
                    {/* --- 任务优先级 --- */}
                    <PrioritySelector task={task} />
                    {/* --- 任务标题 --- */}
                    <span
                        className={`task-title ${task.is_completed ? "completed" : ""}`}
                        onClick={() => showTaskDetail(task.id)}
                    >
                        {task.title}
                    </span>
                    {/* --- 删除按钮 --- */}
                    <button onClick={handleDelete} className="delete-button">&times;</button>
                </div>
                {/* --- 元数据行 --- */}
                <div className="task-metadata">
                    {/* 显示最近提醒 */}
                    {task.next_reminder_at && (
                        <div className="metadata-item reminder-indicator">
                            <Bell size={14} />
                            <span>{formatDueDate(task.next_reminder_at)}</span>
                        </div>
                    )}

                    {/* 截止日期 */}
                    <div className="metadata-item due-date" onClick={() => setDatePickerOpen(true)}>
                        <Calendar size={14} />
                        <span data-has-date={!!task.due_date}>
                            {task.due_date ? formatDueDate(task.due_date) : '添加截止日期'}
                        </span>
                    </div>

                    {/* 子任务数量 */}
                    {task.subtask_count > 0 && (
                        <div className="metadata-item subtask-indicator">
                            <GitCommitHorizontal size={14} />
                            <span>{task.subtask_count}</span>
                        </div>
                    )}

                    {/* 项目名称 */}
                    {projectName && (
                        <div className="metadata-item project-indicator">
                            <Folder size={14} />
                            <span>{projectName}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 条件渲染 DatePicker 弹窗 */}
            {
                isDatePickerOpen && (
                    <DatePicker
                        value={task.due_date ? new Date(task.due_date) : null}
                        onChange={handleDateChange}
                        onClose={() => setDatePickerOpen(false)}
                    />
                )
            }
        </>
    );
}