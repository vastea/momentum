import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppProvider } from "./app/providers/AppProvider";
import { TodayPage } from "./pages/TodayPage";
import { PalettePage } from "./pages/PalettePage";
import { initializeLogger } from "./shared/lib/logger";
import "./app/styles/globals.css";

initializeLogger();

const router = createBrowserRouter([
  {
    path: "/",
    element: <TodayPage />,
  },
  {
    path: "/palette",
    element: <PalettePage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
);