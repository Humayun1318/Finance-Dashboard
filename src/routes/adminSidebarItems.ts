import Overview from "@/pages/dashboard/Overview";
import type { ISidebarItem } from "@/types";
import { lazy } from "react";


const Transactions = lazy(() => import("@/pages/dashboard/Transactions"));


export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/admin/overview",
        component: Overview,
      },
      {
        title: "Transactions",
        url: "/admin/transactions",
        component: Transactions,
      },
    ],
  },
];
export const viewerSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/viewer/overview",
        component: Overview,
      },
      {
        title: "Transactions",
        url: "/viewer/transactions",
        component: Transactions,
      },
    ],
  },
];