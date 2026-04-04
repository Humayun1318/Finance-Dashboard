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

export interface CategoryTotal {
  name: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  year: number;
  income: number;
  expense: number;
  balance: number;
}

export interface MonthlyComparison {
  currentMonth: string;
  previousMonth: string;
  currentExpense: number;
  previousExpense: number;
  expenseChange: number;
  isIncrease: boolean;
}

export interface InsightsData {
  hasData: boolean;
  topExpenseCategory: CategoryTotal | null;
  topIncomeCategory: CategoryTotal | null;
  monthlyComparison: MonthlyComparison | null;
  avgTransactionValue: number;
  totalTransactions: number;
  busiestDay: string | null;
  mostFrequentCategory: CategoryTotal | null;
  savingRate: number;
  bestMonth: { month: string; balance: number } | null;
  worstMonth: { month: string; balance: number } | null;
  totalIncome: number;
  totalExpense: number;
}