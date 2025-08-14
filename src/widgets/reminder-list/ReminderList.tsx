import { useReminders } from "../../entities/reminder/api/useReminders";
import { ReminderItem } from "../../entities/reminder/ui/ReminderItem";
import { AddReminderForm } from "../../features/create-reminder/ui/AddReminderForm";
import './ReminderList.css';

interface ReminderListProps {
    taskId: number;
}

export function ReminderList({ taskId }: ReminderListProps) {
    const { data: reminders, isLoading } = useReminders(taskId);

    return (
        <div className="reminders-section">
            <h3>提醒</h3>
            <div className="reminders-list">
                {isLoading && <div>加载中...</div>}
                {reminders?.map((reminder) => (
                    <ReminderItem key={reminder.id} reminder={reminder} />
                ))}
            </div>
            <AddReminderForm taskId={taskId} />
        </div>
    );
}