import React from 'react';
import './Card.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`card-container ${className}`}>
            {children}
        </div>
    );
}