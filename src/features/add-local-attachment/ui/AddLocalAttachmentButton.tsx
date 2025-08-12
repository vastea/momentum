import { open } from '@tauri-apps/plugin-dialog';
import { useCreateLocalPathAttachment } from "../api/useCreateLocalPathAttachment";
import { Button } from "../../../shared/ui/Button";
import { FolderPlus } from "lucide-react";

interface AddLocalAttachmentButtonProps {
    taskId: number;
}

export function AddLocalAttachmentButton({ taskId }: AddLocalAttachmentButtonProps) {
    const { mutate: addLocalPath, isPending } = useCreateLocalPathAttachment();

    const handleOpenFilePicker = async () => {
        try {
            // 调用 dialog.open() 打开文件选择器
            const selectedPath = await open({
                multiple: false, // 只允许选择单个文件
                directory: false, // 不允许选择文件夹
            });

            // 如果用户选择了文件 (selectedPath 不为 null 或空字符串)
            if (selectedPath) {
                addLocalPath({ taskId, path: selectedPath });
            }
        } catch (error) {
            console.error("打开文件选择器失败:", error);
        }
    };

    return (
        <Button onClick={handleOpenFilePicker} disabled={isPending} title="添加本地文件">
            <FolderPlus size={18} />
        </Button>
    );
}