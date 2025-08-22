import { useEffect, useState, createContext, useContext } from 'react';
import { QuickAddTaskForm } from '../features/create-task/ui/QuickAddTaskForm';
import './PalettePage.css';

// 创建上下文来传递成功状态
const PaletteContext = createContext<{
    triggerSuccessGlow: () => void;
}>({
    triggerSuccessGlow: () => { },
});

export const usePaletteContext = () => useContext(PaletteContext);

export function PalettePage() {
    const [isSuccessGlow, setIsSuccessGlow] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = 'transparent';
        document.body.style.margin = '0';
        document.body.style.overflow = 'hidden';
    }, []);

    const triggerSuccessGlow = () => {
        setIsSuccessGlow(true);
    };

    const handleAnimationEnd = () => {
        setIsSuccessGlow(false);
    };

    return (
        <PaletteContext.Provider value={{ triggerSuccessGlow }}>
            <div
                className={`palette-page ${isSuccessGlow ? 'success-glow' : ''}`}
                onAnimationEnd={handleAnimationEnd}
            >
                <QuickAddTaskForm />
            </div>
        </PaletteContext.Provider>
    );
}