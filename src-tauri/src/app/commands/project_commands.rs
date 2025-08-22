use crate::app::state::AppState;
use crate::db::queries::project_queries;
use crate::domain::project::Project;
use crate::error::Result;
use log::{debug, info};

/// Tauri 指令：创建一个新项目
#[tauri::command]
pub async fn create_project(name: String, state: tauri::State<'_, AppState>) -> Result<Project> {
    debug!("[Command] create_project, name: '{}'", name);
    // 从共享状态中获取数据库连接
    let conn = state.db.lock().unwrap();
    // 调用底层的数据库查询函数
    let new_project = project_queries::create_project(&conn, &name)?;
    info!(
        "[Command] 成功创建新项目, ID: {}, 名称: '{}'",
        new_project.id, new_project.name
    );
    // 将结果返回给前端
    Ok(new_project)
}

/// Tauri 指令：获取所有项目
#[tauri::command]
pub async fn get_all_projects(state: tauri::State<'_, AppState>) -> Result<Vec<Project>> {
    debug!("[Command] get_all_projects");
    let conn = state.db.lock().unwrap();
    let projects = project_queries::get_all_projects(&conn)?;
    Ok(projects)
}

/// Tauri 指令：更新一个项目的名称
#[tauri::command]
pub async fn update_project(
    id: i64,
    name: String,
    state: tauri::State<'_, AppState>,
) -> Result<Project> {
    debug!("[Command] update_project, id: {}, name: '{}'", id, name);
    let conn = state.db.lock().unwrap();
    let updated_project = project_queries::update_project(&conn, id, &name)?;
    info!(
        "[Command] 成功更新项目, ID: {}, 新名称: '{}'",
        id, updated_project.name
    );
    Ok(updated_project)
}

/// Tauri 指令：删除一个项目
#[tauri::command]
pub async fn delete_project(id: i64, state: tauri::State<'_, AppState>) -> Result<()> {
    debug!("[Command] delete_project, id: {}", id);
    let conn = state.db.lock().unwrap();
    project_queries::delete_project(&conn, id)?;
    info!("[Command] 成功删除项目, ID: {}", id);
    Ok(())
}
