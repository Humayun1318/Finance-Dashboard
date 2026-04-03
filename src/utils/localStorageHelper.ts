import type { ITransaction } from "@/types";

const STORAGE_KEY = "transactions_data";

export const getStoredTransactions = (): ITransaction[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTransactions = (data: ITransaction[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};