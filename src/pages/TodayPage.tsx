// src/pages/TodayPage.tsx

import { CreateTaskForm } from "../features/create-task/ui/CreateTaskForm";
import { TaskList } from "../widgets/task-list/TaskList";
import './TodayPage.css';

/**
 * @description “今日”页面，是应用的主界面。
 * 它负责组合应用的核心功能模块，为用户提供一个连贯的体验。
 */
export function TodayPage() {
    return (
        // 使用一个主容器来控制整体布局
        <main className="today-page-container">
            {/* 在页面顶部，放置创建新任务的表单 */}
            <CreateTaskForm />

            {/* 在表单下方，放置显示所有任务的列表 */}
            <TaskList />
        </main>
    );
}