import React from 'react';
import './Section.css';

interface SectionProps {
    /**
     * @description 区块的标题
     */
    title: string;
    /**
     * @description 区块的内容
     */
    children: React.ReactNode;
    /**
     * @description 允许传入额外的 CSS 类名
     */
    className?: string;
}

export function Section({ title, children, className = '' }: SectionProps) {
    return (
        <div className={`section-container ${className}`}>
            <h3 className="section-title">{title}</h3>
            <div className="section-content">
                {children}
            </div>
        </div>
    );
}