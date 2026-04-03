import type { ComponentType } from "react";


export type TRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}