// src/app/providers/AppProvider.tsx

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// 创建一个 React Query 客户端实例
const queryClient = new QueryClient();

interface AppProviderProps {
    children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}