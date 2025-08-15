import { Task } from "@bindings/Task";
import { Priority } from "@bindings/Priority";
import { useUpdateTaskPriority } from "../api/useUpdateTaskPriority";
import './PrioritySelector.css';

interface PrioritySelectorProps {
    task: Task;
}

// 定义优先级的顺序，用于循环切换
const PRIORITIES: Priority[] = ["None", "Low", "Medium", "High"];

export function PrioritySelector({ task }: PrioritySelectorProps) {
    const { mutate: updatePriority, isPending } = useUpdateTaskPriority();

    const handlePriorityChange = () => {
        if (isPending) return;

        // 找到当前优先级在数组中的索引
        const currentIndex = PRIORITIES.indexOf(task.priority);
        // 计算下一个优先级的索引，使用 % 运算符实现循环
        const nextIndex = (currentIndex + 1) % PRIORITIES.length;
        const nextPriority = PRIORITIES[nextIndex];

        // 调用 mutation Hook 来更新后端数据
        updatePriority({ id: task.id, priority: nextPriority });
    };

    return (
        <div
            className={`priority-selector priority-${task.priority.toLowerCase()}`}
            onClick={handlePriorityChange}
            title={`优先级: ${task.priority} (点击切换)`}
        >
            {/* 这是一个简单的旗帜图标的 SVG */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" x2="4" y1="22" y2="15" />
            </svg>
        </div>
    );
}