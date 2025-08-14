// src/pages/TodayPage.tsx
import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useQueryClient } from "@tanstack/react-query";
import { CreateTaskForm } from "../features/create-task/ui/CreateTaskForm";
import { TaskList } from "../widgets/task-list/TaskList";
import { ProjectList } from "../widgets/project-list/ProjectList";
import './TodayPage.css';

/**
 * @description “今日”页面，是应用的主界面。
 * 它负责组合应用的核心功能模块，为用户提供一个连贯的体验。
 */
export function TodayPage() {
    // 获取 queryClient 实例
    const queryClient = useQueryClient();

    // 使用 useEffect 设置事件监听器
    useEffect(() => {
        // 定义一个异步函数来设置监听
        const setupListener = async () => {
            // 监听名为 "reminder_sent" 的事件
            const unlisten = await listen<number[]>("reminder_sent", (event) => {
                console.log("收到了来自后端的 reminder_sent 事件, payload:", event.payload);
                // 当事件发生时，让所有 queryKey 以 ['tasks'] 开头的查询都失效
                // 这会触发 useTasksByParent Hook 自动重新获取最新的任务数据
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
            });

            // useEffect 的清理函数：
            // 当组件卸载时，这个函数会被调用，确保取消事件监听，防止内存泄漏。
            return () => {
                unlisten();
            };
        };

        // 调用函数进行设置
        setupListener();
    }, [queryClient]); // 依赖项数组中包含 queryClient

    return (
        <div className="page-layout">
            <aside className="sidebar">
                <ProjectList />
            </aside>
            <main className="main-content">
                <CreateTaskForm />
                <TaskList />
            </main>
        </div>
    );
}