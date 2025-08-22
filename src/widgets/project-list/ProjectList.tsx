import { useProjects } from "../../entities/project/api/useProjects";
import { ProjectListItem } from "../../entities/project/ui/ProjectListItem";
import { CreateProjectForm } from "../../features/create-project/ui/CreateProjectForm";
import { useUiStore } from "../../stores/uiStore";
import { Settings } from "lucide-react";
import './ProjectList.css';

export function ProjectList() {
    const { data: projects, isLoading, isError } = useProjects();
    // 从 store 中获取状态和设置方法
    const { viewState, showTaskList, showSettings } = useUiStore();

    return (
        <div className="project-list-widget">
            <div className="widget-header">
                <h2 className="widget-title">项目列表</h2>
                <button onClick={showSettings} className="settings-button" title="设置">
                    <Settings size={18} />
                </button>
            </div>

            {/* 收件箱选项 */}
            <div
                // 如果 selectedProjectId 是 null，就给它 'selected' 样式
                className={`project-list-item inbox ${viewState.type === 'list' && viewState.projectId === null ? 'selected' : ''}`}
                // 点击时，将 selectedProjectId 设置为 null
                onClick={() => showTaskList(null)}
            >
                <span>收件箱</span>
            </div>

            <div className="divider"></div> {/* 分割线 */}

            <div className="project-list-container">
                {isLoading && <div>加载中...</div>}
                {isError && <div>加载项目失败</div>}
                {projects?.map((project) => (
                    <ProjectListItem key={project.id} project={project} />
                ))}
            </div>

            <div className="create-project-form-container">
                <CreateProjectForm />
            </div>

        </div>
    );
}