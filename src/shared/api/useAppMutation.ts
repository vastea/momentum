import {
    useMutation,
    type UseMutationOptions,
    type UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { logger } from "../lib/logger";

/**
 * @description 一个封装了全局错误处理和日志记录的 useMutation 的自定义 Hook。
 * @param options - 与 TanStack Query 的 useMutation 相同的选项对象。
 */
export function useAppMutation<
    TData = unknown,
    TError = unknown,
    TVariables = void,
    TContext = unknown
>(
    options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {

    return useMutation({
        // 将用户传入的所有 options 展开
        ...options,

        // 在用户定义的 onError 基础上封装逻辑
        onError: (error, variables, context) => {
            let errorMessage: string;
            if (typeof error === 'string') {
                errorMessage = error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                errorMessage = "操作失败，请稍后再试。";
            }

            // 1. 显示错误提示给用户
            toast.error(errorMessage);

            // 2. 在日志中记录详细错误
            logger.error(
                `[Mutation Error] 操作失败 | variables: ${JSON.stringify(variables)} | error: ${JSON.stringify(error)}`
            );

            // 3. 如果用户也定义了 onError，继续调用它
            if (options.onError) {
                options.onError(error, variables, context);
            }
        },
    });
}