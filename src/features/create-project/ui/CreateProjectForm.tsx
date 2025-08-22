import React, { useState } from "react";
import { useCreateProject } from "../api/useCreateProject";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";

export function CreateProjectForm() {
    const [name, setName] = useState("");
    const { mutate: createProject, isPending } = useCreateProject();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || isPending) return;
        createProject(name, {
            onSuccess: () => setName(""),
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', marginBottom: '16px' }}>
            <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="创建一个新项目..."
                disabled={isPending}
                style={{ flexGrow: 1 }}
            />
            <Button type="submit" disabled={isPending}>
                +
            </Button>
        </form>
    );
}