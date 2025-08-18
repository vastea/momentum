import React, { useState } from "react";
import { useCreateUrlAttachment } from "../api/useCreateUrlAttachment";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";
import { Link } from "lucide-react";

interface AddAttachmentFormProps {
    taskId: bigint;
}

export function AddAttachmentForm({ taskId }: AddAttachmentFormProps) {
    const [url, setUrl] = useState("");
    const { mutate: addUrl, isPending } = useCreateUrlAttachment();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 简单的 URL 验证
        if (!url.trim().startsWith("http")) {
            alert("请输入一个有效的网址 (以 http 或 https 开头)");
            return;
        }
        addUrl({ taskId, url }, {
            onSuccess: () => setUrl(""), // 成功后清空输入框
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", width: "100%" }}>
            <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="粘贴一个网络链接..."
                disabled={isPending}
                style={{ flexGrow: 1, borderRadius: "4px 0 0 4px" }}
            />
            <Button type="submit" disabled={isPending} title="添加网络链接">
                <Link size={18} />
            </Button>
        </form>
    );
}