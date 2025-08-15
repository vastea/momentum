import { Reminder } from "@bindings/Reminder";
import { useDeleteReminder } from "../../../features/delete-reminder/api/useDeleteReminder";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Bell, Trash2 } from "lucide-react";
import './ReminderItem.css';

interface ReminderItemProps {
    reminder: Reminder;
}

export function ReminderItem({ reminder }: ReminderItemProps) {
    const { mutate: deleteReminder } = useDeleteReminder();

    // 格式化日期为更易读的格式
    const formattedDate = format(
        new Date(reminder.remind_at),
        "yyyy年MM月dd日 HH:mm",
        { locale: zhCN }
    );

    return (
        <div className="reminder-item">
            <Bell size={16} className="reminder-icon" />
            <span className="reminder-time">{formattedDate}</span>
            <button
                className="delete-reminder-button"
                onClick={() => deleteReminder(reminder.id)}
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}