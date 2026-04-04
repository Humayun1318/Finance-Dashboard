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

export interface ChartDataPoint {
  month: string;
  monthShort: string;
  income: number;
  expense: number;
  balance: number;
  year: number;
}

export interface SpendingDataPoint {
  name: string;
  value: number;
  formattedValue: string;
  percentage: number;
}