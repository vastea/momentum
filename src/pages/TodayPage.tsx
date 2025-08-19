// src/pages/TodayPage.tsx

import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useQueryClient } from "@tanstack/react-query";
import { TaskList } from "../widgets/task-list/TaskList";
import { ProjectList } from "../widgets/project-list/ProjectList";
import './TodayPage.css';
import { logger } from "../shared/lib/logger";
import { useUiStore } from "../stores/uiStore";
import { TaskDetailView } from "../widgets/task-detail-view/TaskDetailView";
import { CreateTaskForm } from "../features/create-task/ui/CreateTaskForm";
import { SettingsPage } from "./SettingsPage";

export function TodayPage() {
    const queryClient = useQueryClient();
    const { viewState } = useUiStore();

    useEffect(() => {
        const setupListener = async () => {
            const unlisten = await listen<number[]>("reminder_sent", (event) => {
                logger.info(`[Event] 收到 'reminder_sent' 事件，将刷新任务列表。payload: ${event.payload}`);
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
            });
            return () => unlisten();
        };
        setupListener();
    }, [queryClient]);

    return (
        <div className="page-layout">
            <aside className="sidebar">
                <ProjectList />
            </aside>
            <main className="main-content">
                {viewState.type === 'list' && (
                    <>
                        <CreateTaskForm parentId={null} />
                        <TaskList projectId={viewState.projectId} />
                    </>
                )}
                {viewState.type === 'detail' && (
                    <TaskDetailView taskId={viewState.taskId} />
                )}
                {viewState.type === 'settings' && (
                    <SettingsPage />
                )}
            </main>
        </div>
    );
}