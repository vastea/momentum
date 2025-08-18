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
import { AddLocalAttachmentButton } from "../../features/add-local-attachment/ui/AddLocalAttachmentButton";
import { ReminderList } from "../reminder-list/ReminderList";
import { ArrowLeft } from "lucide-react";
import { useReminders } from "../../entities/reminder/api/useReminders";
import TextareaAutosize from 'react-textarea-autosize';
import * as Tabs from '@radix-ui/react-tabs';

import "./TaskDetailView.css";
import "../../shared/ui/Tabs/Tabs.css";

interface TaskDetailViewProps {
    taskId: bigint;
}

export function TaskDetailView({ taskId }: TaskDetailViewProps) {
    const setViewingTaskId = useUiStore((state) => state.setViewingTaskId);
    const { data: parentTask, isLoading: isLoadingParent } = useTaskById(taskId);
    const { data: subtasks, isLoading: isLoadingSubtasks } = useTasksByParent({ parentId: taskId, projectId: null });
    const { data: attachments, isLoading: isLoadingAttachments } = useAttachments(taskId);
    const { mutate: updateDescription } = useUpdateTaskDescription();
    const [description, setDescription] = useState(parentTask?.description ?? "");
    const debouncedDescription = useDebounce(description, 500);
    const { data: reminders, isLoading: isLoadingReminders } = useReminders(taskId);


    useEffect(() => {
        if (document.activeElement !== document.querySelector('.description-textarea')) {
            setDescription(parentTask?.description ?? "");
        }
    }, [parentTask]);

    useEffect(() => {
        if (parentTask && debouncedDescription !== (parentTask.description ?? "")) {
            updateDescription({ id: taskId, description: debouncedDescription });
        }
    }, [debouncedDescription, taskId, parentTask, updateDescription]);

    return (
        <div className="task-detail-view">
            <div className="detail-view-header">
                <button onClick={() => setViewingTaskId(null)} className="back-button" title="返回列表">
                    <ArrowLeft size={20} />
                </button>
                {isLoadingParent && !parentTask && <h1>正在加载...</h1>}
                {parentTask && <h1>{parentTask.title}</h1>}
            </div>

            {parentTask && (
                <Tabs.Root defaultValue="description" className="TabsRoot">
                    <Tabs.List className="TabsList" aria-label="管理你的任务">
                        <Tabs.Trigger className="TabsTrigger" value="description">描述</Tabs.Trigger>
                        <Tabs.Trigger className="TabsTrigger" value="attachments">附件 ({attachments?.length ?? 0})</Tabs.Trigger>
                        <Tabs.Trigger className="TabsTrigger" value="reminders">提醒 ({reminders?.length ?? 0})</Tabs.Trigger>
                        <Tabs.Trigger className="TabsTrigger" value="subtasks">子任务 ({subtasks?.length ?? 0})</Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content className="TabsContent" value="description">
                        <TextareaAutosize
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="添加详细描述..."
                            className="description-textarea"
                            minRows={5}  // 至少显示5行
                            maxRows={20} // 最多扩展到20行，之后会出现滚动条
                        />
                    </Tabs.Content>

                    <Tabs.Content className="TabsContent" value="attachments">
                        <div className="attachments-list">
                            {isLoadingAttachments && <div>加载附件中...</div>}
                            {attachments?.map(att => <AttachmentItem key={att.id} attachment={att} />)}
                        </div>
                        <div className="add-attachment-controls">
                            <AddAttachmentForm taskId={taskId} />
                            <AddLocalAttachmentButton taskId={taskId} />
                        </div>
                    </Tabs.Content>

                    <Tabs.Content className="TabsContent" value="reminders">
                        <ReminderList
                            taskId={taskId}
                            reminders={reminders}
                            isLoading={isLoadingReminders}
                        />
                    </Tabs.Content>

                    <Tabs.Content className="TabsContent" value="subtasks">
                        <CreateTaskForm parentId={taskId} />
                        <div className="subtask-list">
                            {isLoadingSubtasks && <div>正在加载子任务...</div>}
                            {subtasks?.map((subtask) => (
                                <TaskItem key={subtask.id} task={subtask} />
                            ))}
                            {subtasks?.length === 0 && !isLoadingSubtasks && (
                                <div className="empty-state">还没有子任务</div>
                            )}
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            )}
        </div>
    );
}