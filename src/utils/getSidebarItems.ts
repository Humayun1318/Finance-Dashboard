
import { role } from "@/constants/role";
import { adminSidebarItems, viewerSidebarItems } from "@/routes/adminSidebarItems";
import type { TRole } from "@/types";


export const getSidebarItems = (userRole: TRole) => {
  switch (userRole) {
    case role.admin:
      return [...adminSidebarItems];
    case role.user:
      return [...viewerSidebarItems];
    default:
      return [];
  }
};