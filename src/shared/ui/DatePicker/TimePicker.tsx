import React from 'react';
import './TimePicker.css';

interface TimePickerProps {
    value: string; // "HH:mm"
    onChange: (value: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
    const [hourStr, minuteStr] = value.split(':');

    // --- 处理键盘输入或值变化的函数 ---
    const handleValueChange = (part: 'hour' | 'minute', val: string) => {
        let numVal = parseInt(val, 10);
        // 如果输入不是一个有效的数字（例如用户清空了输入框），将其视为0
        if (isNaN(numVal)) {
            numVal = 0;
        }

        // 确保数值在合法范围内
        if (part === 'hour') {
            if (numVal > 23) numVal = 23;
            if (numVal < 0) numVal = 0;
            onChange(`${String(numVal).padStart(2, '0')}:${minuteStr}`);
        } else { // part === 'minute'
            if (numVal > 59) numVal = 59;
            if (numVal < 0) numVal = 0;
            onChange(`${hourStr}:${String(numVal).padStart(2, '0')}`);
        }
    };

    // --- 处理滚轮滚动的函数 (现在只处理增减逻辑) ---
    const handleWheel = (part: 'hour' | 'minute', e: React.WheelEvent<HTMLInputElement>) => {
        e.preventDefault();

        let currentValue = part === 'hour' ? parseInt(hourStr) : parseInt(minuteStr);
        const max = part === 'hour' ? 23 : 59;

        if (e.deltaY < 0) { // 向上滚动
            currentValue = (currentValue + 1) % (max + 1);
        } else { // 向下滚动
            currentValue = (currentValue - 1 + (max + 1)) % (max + 1);
        }

        // 复用 handleValueChange 来更新状态，确保逻辑统一
        handleValueChange(part, String(currentValue));
    };

    return (
        <div className="time-picker-wrapper-inline">
            <input
                type="number" // number 类型以允许键盘输入
                value={hourStr}
                onChange={(e) => handleValueChange('hour', e.target.value)}
                onWheel={(e) => handleWheel('hour', e)} // 保留滚轮事件
                className="time-input-inline"
            />
            <span className="time-separator-inline">:</span>
            <input
                type="number"
                value={minuteStr}
                onChange={(e) => handleValueChange('minute', e.target.value)}
                onWheel={(e) => handleWheel('minute', e)} // 保留滚轮事件
                className="time-input-inline"
            />
        </div>
    );
}