// src/features/create-task/ui/CreateTaskForm.tsx

import React, { useState } from "react";
import { useCreateTask } from "../api/useCreateTask";
import { Input } from "../../../shared/ui/Input"; // 引入共享的 Input 组件
import { Button } from "../../../shared/ui/Button"; // 引入共享的 Button 组件
import './CreateTaskForm.css';
import { useUiStore } from "../../../stores/uiStore"; // 引入 UI store

export function CreateTaskForm() {
    // 使用 React 的 useState 来管理输入框的当前值。
    const [title, setTitle] = useState("");
    // 调用 useCreateTask Hook，获取执行创建操作的 `mutate` 函数。
    const { mutate: createTask, isPending } = useCreateTask();
    // 从 store 中获取当前选中的项目ID
    const selectedProjectId = useUiStore((state) => state.selectedProjectId);

    /**
     * 表单提交时的处理函数
     */
    const handleSubmit = (event: React.FormEvent) => {
        // 阻止表单的默认提交行为（即页面刷新）。
        event.preventDefault();
        // 如果标题为空，或者正在提交中，则不执行任何操作。
        if (!title.trim() || isPending) return;

        // 调用 mutate 函数，将当前输入框的标题作为参数传给后端。
        createTask({title, projectId: selectedProjectId },
            {
            // 在成功回调中，清空输入框。
            onSuccess: () => {
                setTitle("");
            },
        });
    };

    return (
        // 使用 onSubmit 事件来处理表单提交
        <form onSubmit={handleSubmit} className="create-task-form">
            <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="添加一个新任务..."
                // 当正在提交时，禁用输入框
                disabled={isPending}
                className="task-input"
            />
            <Button type="submit" disabled={isPending} className="submit-button">
                {/* 根据提交状态显示不同文本 */}
                {isPending ? "添加中..." : "添加"}
            </Button>
        </form>
    );
}