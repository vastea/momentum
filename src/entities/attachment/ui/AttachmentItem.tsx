import { Attachment } from "@bindings/Attachment";
import { useDeleteAttachment } from "../../../features/delete-attachment/api/useDeleteAttachment";
import { FileIcon, Link, Trash2 } from "lucide-react";
import { openUrl, openPath } from '@tauri-apps/plugin-opener';
import './AttachmentItem.css';

interface AttachmentItemProps {
    attachment: Attachment;
}

export function AttachmentItem({ attachment }: AttachmentItemProps) {
    const { mutate: deleteAttachment } = useDeleteAttachment();

    // 根据附件类型选择不同的图标
    const icon = attachment.attachment_type === 'Url'
        ? <Link size={16} className="attachment-icon" />
        : <FileIcon size={16} className="attachment-icon" />;

    // 点击时，无论是 URL 还是本地路径，都可以用 shell.open 打开
    // 点击链接时，调用 Tauri API 在用户的默认浏览器中打开
    const handleOpen = async () => {
        console.log(attachment.attachment_type, attachment.payload);
        try {
            if (attachment.attachment_type === 'Url') {
                await openUrl(attachment.payload);
            } else if (attachment.attachment_type === 'LocalPath') {
                await openPath(attachment.payload);
            }

        } catch (error) {
            console.error("Failed to open URL:", error);
        }
    };

    // 对于本地路径，只显示文件名而不是完整路径
    const displayText = attachment.attachment_type === 'LocalPath'
        ? attachment.payload.split(/[/\\]/).pop() // 获取路径的最后一部分
        : attachment.payload;

    return (
        <div className="attachment-item" title={attachment.payload}>
            {icon}
            <span className="attachment-payload" onClick={handleOpen}>
                {displayText}
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