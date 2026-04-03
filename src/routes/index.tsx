import DashboardLayout from "@/components/layout/DashboardLayout";
import { generateRoutes } from "@/utils/generateRoutes";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems, viewerSidebarItems } from "./adminSidebarItems";
import NotFound from "@/pages/NotFound";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/admin" replace />,
  },
  {
    Component: DashboardLayout,
    path: "/admin",
    children: [
      { index: true, element: <Navigate to="/admin/overview" /> },
      ...generateRoutes(adminSidebarItems),
    ],
  },
  {
    Component: DashboardLayout,
    path: "/viewer",
    children: [
      { index: true, element: <Navigate to="/viewer/overview" /> },
      ...generateRoutes(viewerSidebarItems),
    ],
  },
  {
    Component: NotFound,
    path: "*",
  },
]);
