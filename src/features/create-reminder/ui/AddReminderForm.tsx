import { useState } from "react";
import { useCreateReminder } from "../api/useCreateReminder";
import { addMinutes, addHours, set } from "date-fns";
import { DatePicker } from "../../../shared/ui/DatePicker/DatePicker";
import { Button } from "../../../shared/ui/Button";
import './AddReminderForm.css';

interface AddReminderFormProps {
    taskId: number;
}

export function AddReminderForm({ taskId }: AddReminderFormProps) {
    const { mutate: createReminder, isPending } = useCreateReminder();
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);

    const handleAddReminder = (date: Date) => {
        createReminder({
            taskId,
            remindAt: date.toISOString(), // 转换为 UTC ISO 字符串
        });
    };

    const handlePresetClick = (preset: '10m' | '1h' | 'tomorrow') => {
        const now = new Date();
        let remindAt: Date;

        if (preset === '10m') {
            remindAt = addMinutes(now, 10);
        } else if (preset === '1h') {
            remindAt = addHours(now, 1);
        } else { // tomorrow
            const tomorrow = new Date(now.setDate(now.getDate() + 1));
            remindAt = set(tomorrow, { hours: 9, minutes: 0, seconds: 0 });
        }
        handleAddReminder(remindAt);
    };

    const handleCustomDateChange = (date: Date | undefined) => {
        if (date) {
            handleAddReminder(date);
        }
        setDatePickerOpen(false);
    };

    return (
        <div className="add-reminder-form">
            <div className="preset-buttons">
                <Button onClick={() => handlePresetClick('10m')} disabled={isPending}>10分钟后</Button>
                <Button onClick={() => handlePresetClick('1h')} disabled={isPending}>1小时后</Button>
                <Button onClick={() => handlePresetClick('tomorrow')} disabled={isPending}>明天上午9点</Button>
                <Button onClick={() => setDatePickerOpen(true)} disabled={isPending}>自定义...</Button>
            </div>

            {isDatePickerOpen && (
                <DatePicker
                    value={null}
                    onChange={handleCustomDateChange}
                    onClose={() => setDatePickerOpen(false)}
                />
            )}
        </div>
    );
}