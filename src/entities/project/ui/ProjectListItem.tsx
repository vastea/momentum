import { Project } from "@bindings/Project";
import { useDeleteProject } from "../../../features/delete-project/api/useDeleteProject";
import { useUiStore } from "../../../stores/uiStore";
import './ProjectListItem.css';

interface ProjectListItemProps {
    project: Project;
}

export function ProjectListItem({ project }: ProjectListItemProps) {
    const { mutate: deleteProject, isPending } = useDeleteProject();
    // 从 store 中获取 当前选中的项目ID 和 设置它的方法 和 showConfirmation 动作
    const { viewState, showTaskList, showConfirmation } = useUiStore();
    // 判断当前这个列表项是否是被选中的那一个
    const isSelected = viewState.type === 'list' && viewState.projectId === project.id;

    // 删除按钮需要阻止事件冒泡，否则点击删除也会触发选中项目
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        showConfirmation({
            title: '确认删除项目',
            message: `您确定要删除项目 "${project.name}" 吗？\n\n该项目下的所有任务将被移至“收件箱”。`,
            onConfirm: () => deleteProject(project.id),
        });
    };

    return (
        // onClick 事件，点击时调用 setSelectedProjectId 更新全局状态
        // 同时，根据 isSelected 动态添加 'selected' 类名
        <div
            className={`project-list-item ${isSelected ? 'selected' : ''}`}
            onClick={() => showTaskList(project.id)}
        >
            <span className="project-name">{project.name}</span>
            <button
                onClick={handleDeleteClick}
                disabled={isPending}
                className="delete-project-button"
            >
                &times;
            </button>
        </div>
    );
}