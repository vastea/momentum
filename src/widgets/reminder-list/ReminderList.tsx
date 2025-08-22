import { ReminderItem } from "../../entities/reminder/ui/ReminderItem";
import { AddReminderForm } from "../../features/create-reminder/ui/AddReminderForm";
import { Reminder } from "@bindings/Reminder";

interface ReminderListProps {
    taskId: bigint;
    reminders: Reminder[] | undefined;
    isLoading: boolean;
}
export function ReminderList({ taskId, reminders, isLoading }: ReminderListProps) {

    return (
        <>
            <div className="reminders-list">
                {isLoading && <div>加载中...</div>}
                {reminders?.map((reminder) => (
                    <ReminderItem key={reminder.id} reminder={reminder} />
                ))}
            </div>
            <AddReminderForm taskId={taskId} />
        </>
    );
}