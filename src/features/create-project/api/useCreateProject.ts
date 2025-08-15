import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "../../../shared/api/tauri";
import { Project } from "@bindings/Project";

export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        /**
         * @property mutationFn: 调用后端的 `create_project` 指令。
         */
        mutationFn: (name: string) => invoke<Project>("create_project", { name }),

        /**
         * @property onSuccess: 成功后，让 `['projects']` 查询失效以自动刷新列表。
         */
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}