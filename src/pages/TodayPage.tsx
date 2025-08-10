// src/pages/TodayPage.tsx

import { CreateTaskForm } from "../features/create-task/ui/CreateTaskForm";
import { TaskList } from "../widgets/task-list/TaskList";
import { ProjectList } from "../widgets/project-list/ProjectList";
import './TodayPage.css';

/**
 * @description “今日”页面，是应用的主界面。
 * 它负责组合应用的核心功能模块，为用户提供一个连贯的体验。
 */
export function TodayPage() {
    return (
        // 主容器是左右布局
        <div className="page-layout">
            {/* 侧边栏区域 */}
            <aside className="sidebar">
                <ProjectList />
            </aside>

            {/* 主内容区域 */}
            <main className="main-content">
                <CreateTaskForm />
                <TaskList />
            </main>
        </div>
    );
}