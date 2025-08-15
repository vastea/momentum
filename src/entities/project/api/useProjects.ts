import { useQuery } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { Project } from "@bindings/Project";

/**
 * @description 自定义 Hook，用于从后端获取所有项目的列表。
 */
export function useProjects() {
    return useQuery({
        /**
         * @property queryKey: 项目列表的唯一标识，用于缓存。
         */
        queryKey: ["projects"],

        /**
         * @property queryFn: 调用后端的 `get_all_projects` 指令。
         */
        queryFn: async () => invoke<Project[]>("get_all_projects"),
    });
}