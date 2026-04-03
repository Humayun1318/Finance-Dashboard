import Overview from "@/pages/dashboard/Overview";
import Transactions from "@/pages/dashboard/Transactions";
import type { ISidebarItem } from "@/types";



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