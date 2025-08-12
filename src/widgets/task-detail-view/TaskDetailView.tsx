import { useState, useEffect } from "react";
import { useUiStore } from "../../stores/uiStore";
import { useTaskById } from "../../entities/task/api/useTaskById";
import { useTasksByParent } from "../../entities/task/api/useTasks";
import { TaskItem } from "../../entities/task/ui/TaskItem";
import { CreateTaskForm } from "../../features/create-task/ui/CreateTaskForm";
import { useUpdateTaskDescription } from "../../features/update-task-description/api/useUpdateTaskDescription";
import { useDebounce } from "../../shared/lib/hooks/useDebounce";
import { useAttachments } from "../../entities/attachment/api/useAttachments";
import { AttachmentItem } from "../../entities/attachment/ui/AttachmentItem";
import { AddAttachmentForm } from "../../features/add-attachment/ui/AddAttachmentForm";
import "./TaskDetailView.css";

interface TaskDetailViewProps {
    taskId: number;
}

export function TaskDetailView({ taskId }: TaskDetailViewProps) {
    const setViewingTaskId = useUiStore((state) => state.setViewingTaskId);

    const { data: parentTask, isLoading: isLoadingParent } = useTaskById(taskId);
    const { data: subtasks, isLoading: isLoadingSubtasks } = useTasksByParent({
        parentId: taskId,
        projectId: null,
    });
    const { data: attachments, isLoading: isLoadingAttachments } = useAttachments(taskId);
    const { mutate: updateDescription } = useUpdateTaskDescription();

    // 使用本地状态来管理 textarea 的输入，避免每次输入都重渲染整个组件
    const [description, setDescription] = useState(parentTask?.description ?? "");
    // 使用防抖技术来延迟保存操作
    const debouncedDescription = useDebounce(description, 500); // 延迟500毫秒

    // 当父任务数据加载或变化时，同步本地 description 状态
    useEffect(() => {
        // 只有在 textarea 没有聚焦时才同步，避免覆盖用户正在输入的内容
        if (document.activeElement !== document.querySelector('.description-textarea')) {
            setDescription(parentTask?.description ?? "");
        }
    }, [parentTask]);

    // 当防抖后的 description 变化时，触发自动保存
    useEffect(() => {
        // 确保只在用户确实修改过内容后才保存
        // 同时也要确保 parentTask 已经加载
        if (parentTask && debouncedDescription !== (parentTask.description ?? "")) {
            updateDescription({ id: taskId, description: debouncedDescription });
        }
    }, [debouncedDescription, taskId, parentTask, updateDescription]);

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

            <div className="description-section">
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="添加详细描述..."
                    className="description-textarea"
                    rows={5}
                />
            </div>

            <div className="attachments-section">
                <h3>附件</h3>
                <div className="attachments-list">
                    {isLoadingAttachments && <div>加载附件中...</div>}
                    {attachments?.map(att => <AttachmentItem key={att.id} attachment={att} />)}
                </div>
                <AddAttachmentForm taskId={taskId} />
            </div>

            <div className="subtask-section">
                <h2>子任务</h2>
                <CreateTaskForm parentId={taskId} />

                <div className="subtask-list">
                    {isLoadingSubtasks && <div>正在加载子任务...</div>}
                    {subtasks?.map((subtask) => (
                        <TaskItem key={subtask.id} task={subtask} />
                    ))}
                    {subtasks?.length === 0 && (
                        <div className="empty-state">还没有子任务</div>
                    )}
                </div>
            </div>
        </div>
    );
}