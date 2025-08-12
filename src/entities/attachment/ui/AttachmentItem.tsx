import type { Attachment } from "../model/types";
import { useDeleteAttachment } from "../../../features/delete-attachment/api/useDeleteAttachment";
import { Link, Trash2 } from "lucide-react";
import { openUrl } from "@tauri-apps/plugin-opener"; // 引入 Tauri 的 open API
import './AttachmentItem.css';

interface AttachmentItemProps {
    attachment: Attachment;
}

export function AttachmentItem({ attachment }: AttachmentItemProps) {
    const { mutate: deleteAttachment } = useDeleteAttachment();

    // 点击链接时，调用 Tauri API 在用户的默认浏览器中打开
    const handleLinkClick = async () => {
        try {
            await openUrl(attachment.payload);
        } catch (error) {
            console.error("Failed to open URL:", error);
        }
    };

    return (
        <div className="attachment-item">
            <Link size={16} className="attachment-icon" />
            <span className="attachment-payload" onClick={handleLinkClick}>
                {attachment.payload}
            </span>
            <button
                className="delete-attachment-button"
                onClick={() => deleteAttachment(attachment.id)}
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}