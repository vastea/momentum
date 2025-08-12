import { useState, useEffect } from 'react';

/**
 * @description 一个防抖 Hook，用于延迟一个值的更新。
 * @param value - 需要被防抖的值。
 * @param delay - 延迟的毫秒数。
 * @returns 返回一个延迟更新后的值。
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // 设置一个定时器，在 delay 毫秒后更新值
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // 在下一次 effect 执行前或组件卸载时，清除上一个定时器
        // 这是实现防抖的关键
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // 仅当 value 或 delay 变化时才重新设置定时器

    return debouncedValue;
}