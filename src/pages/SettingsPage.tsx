import { useUiStore } from "../stores/uiStore";
import { PageHeader } from "../shared/ui/PageHeader/PageHeader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../shared/api/tauri";
import { open } from '@tauri-apps/plugin-dialog';
import { useAppMutation } from "../shared/api/useAppMutation";
import { toast } from "react-hot-toast";
import { Button } from "../shared/ui/Button";
import { Card } from '../shared/ui/Card/Card';
import './SettingsPage.css';

export function SettingsPage() {
    const showTaskList = useUiStore((state) => state.showTaskList);
    const queryClient = useQueryClient();

    // 1. 获取当前数据路径
    const { data: currentPath, isLoading } = useQuery({
        queryKey: ['settings', 'dataPath'],
        queryFn: () => invoke<string>('get_data_path'),
    });

    // 2. 设置新数据路径的 mutation
    const { mutate: setDataPath, isPending } = useAppMutation({
        mutationFn: (newPath: string) => invoke('set_data_path', { newPathStr: newPath }),
        onSuccess: () => {
            // 成功后，刷新路径显示并提示用户
            queryClient.invalidateQueries({ queryKey: ['settings', 'dataPath'] });
            toast.success("数据位置已更新！请重启应用以使更改完全生效。");
        }
    });

    // 3. 处理“更改位置”按钮点击
    const handleChangeLocation = async () => {
        try {
            const selected = await open({
                directory: true, // 只允许选择文件夹
                multiple: false,
                title: '请选择新的数据存储位置'
            });

            if (typeof selected === 'string') {
                setDataPath(selected);
            }
        } catch (error) {
            console.error("选择文件夹失败:", error);
        }
    };

    return (
        <div className="settings-page">
            <PageHeader title="设置" onBack={() => showTaskList(null)} />

            <div className="page-content">
                <Card>
                    <h4>数据存储</h4>
                    <p className="description">
                        你的所有任务和项目数据都存储在一个本地文件中 (momentum.db)。
                    </p>
                    <div className="path-display">
                        <span>当前位置:</span>
                        <code>{isLoading ? '加载中...' : currentPath}</code>
                    </div>
                    <Button onClick={handleChangeLocation} disabled={isPending}>
                        {isPending ? '正在移动...' : '更改位置...'}
                    </Button>
                </Card>
            </div>
        </div>
    );
}