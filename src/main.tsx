// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { AppProvider } from "./app/providers/AppProvider";
import { TodayPage } from "./pages/TodayPage";
import "./app/styles/globals.css"; // 确保引入了新的全局样式文件

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <TodayPage />
    </AppProvider>
  </React.StrictMode>
);