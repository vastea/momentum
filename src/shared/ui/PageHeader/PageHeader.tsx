import { ArrowLeft } from "lucide-react";
import './PageHeader.css';

interface PageHeaderProps {
    title: string;
    onBack: () => void;
}

export function PageHeader({ title, onBack }: PageHeaderProps) {
    return (
        <div className="page-header">
            <button onClick={onBack} className="page-header-back-button" title="返回">
                <ArrowLeft size={20} />
            </button>
            <h1 className="page-header-title">{title}</h1>
        </div>
    );
}