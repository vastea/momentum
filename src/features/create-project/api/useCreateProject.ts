import { useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { Project } from "@bindings/Project";
import { logger } from "../../../shared/lib/logger";
import { useAppMutation } from "../../../shared/api/useAppMutation";

export function useCreateProject() {
    const queryClient = useQueryClient();
    return useAppMutation({
        mutationFn: (name: string) => {
            logger.debug(`[API] useCreateProject 调用 | name: '${name}'`);
            return invoke<Project>("create_project", { name });
        },
        onSuccess: (data) => {
            logger.info(`[API] 成功创建项目 | data: ${JSON.stringify(data)}`);
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}