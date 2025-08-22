// src/features/create-task/ui/QuickAddTaskForm.tsx

import React, { useEffect, useState, useRef } from 'react';
import { useCreateTask } from '../api/useCreateTask';
import { Window } from '@tauri-apps/api/window';
import { usePaletteContext } from '../../../pages/PalettePage';
import './QuickAddTaskForm.css';

const paletteWindow = new Window('palette');

export function QuickAddTaskForm() {
    const [title, setTitle] = useState('');
    const { mutate: createTask, isPending } = useCreateTask();
    const { triggerSuccessGlow } = usePaletteContext();
    const inputRef = useRef<HTMLInputElement>(null);

    // 处理 ESC 键关闭窗口
    useEffect(() => {
        const handleGlobalKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                paletteWindow.hide();
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, []);

    // 处理窗口显示时的自动聚焦
    useEffect(() => {
        const focusInput = () => {
            // 使用 setTimeout 确保 DOM 已经渲染完成
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        };

        const unlisten = paletteWindow.onFocusChanged(({ payload: focused }) => {
            if (focused) {
                focusInput();
            }
        });

        // 初始加载时也立即尝试聚焦
        focusInput();

        return () => {
            unlisten.then(f => f());
        };
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!title.trim() || isPending) return;

        createTask({ title: title.trim(), projectId: null, parentId: null }, {
            onSuccess: () => {
                setTitle('');
                // 成功后，触发窗口光效动画
                triggerSuccessGlow();

                // 确保在下一个事件循环中聚焦，避免被其他操作干扰
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 100);
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="quick-add-form">
            <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入新任务，按 Enter 添加..."
                disabled={isPending}
                className="quick-add-input"
                autoComplete="off"
            />
        </form>
    );
}