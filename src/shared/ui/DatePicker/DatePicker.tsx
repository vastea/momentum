import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { zhCN } from 'date-fns/locale';
import { TimePicker } from './TimePicker';
import 'react-day-picker/dist/style.css';
import './DatePicker.css';

interface DatePickerProps {
    value: Date | null;
    onChange: (date: Date | undefined) => void;
    onClose: () => void;
}

export function DatePicker({ value, onChange, onClose }: DatePickerProps) {
    // 使用一个内部状态来管理当前选中的日期+时间
    const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined>(value ?? undefined);

    // 当外部传入的 value 变化时，同步内部状态
    useEffect(() => {
        setSelectedDateTime(value ?? undefined);
    }, [value]);

    const handleDaySelect = (date: Date | undefined) => {
        if (!date) {
            setSelectedDateTime(undefined);
            return;
        }
        // 当用户选择一个新日期时，保留旧的时间（如果存在），否则默认为上午9点
        const hours = selectedDateTime?.getHours() ?? 19;
        const minutes = selectedDateTime?.getMinutes() ?? 0;
        const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
        setSelectedDateTime(newDate);
    };

    const handleTimeChange = (timeValue: string) => { // timeValue is "HH:mm"
        const [hours, minutes] = timeValue.split(':').map(Number);
        // 如果没有选定日期，则基于今天创建一个新日期
        const baseDate = selectedDateTime ?? new Date();
        const newDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), hours, minutes);
        setSelectedDateTime(newDate);
    };

    // 确认按钮的回调
    const handleConfirm = () => {
        onChange(selectedDateTime);
    };

    // 清除按钮的回调
    const handleClear = () => {
        onChange(undefined);
    }

    // 将 Date 对象格式化为 "HH:mm" 字符串
    const timeValue = selectedDateTime
        ? selectedDateTime.toTimeString().substring(0, 5)
        : "19:00";

    return (
        <div className="date-picker-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="date-picker-content">
                <DayPicker
                    mode="single"
                    selected={selectedDateTime}
                    onSelect={handleDaySelect}
                    locale={zhCN}
                    showOutsideDays
                    fixedWeeks
                />
                {/* --- 时间选择器 --- */}
                <div className="time-picker-section">
                    <TimePicker value={timeValue} onChange={handleTimeChange} />
                </div>
                {/* --- 操作按钮 --- */}
                <div className="actions-section">
                    <button onClick={handleClear} className="clear-button">清除日期</button>
                    <button onClick={handleConfirm} className="confirm-button">确认</button>
                </div>
            </div>
        </div>
    );
}