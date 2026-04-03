import type { ComponentType } from "react";


export type TRole = "ADMIN" | "VIEWER";

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}

export interface ITransaction {
  id: string;
  date: string;
  category: string;
  type: "Income" | "Expense";
  amount: number;
};