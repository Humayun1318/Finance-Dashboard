import type { ITransaction } from "@/types";
import { getStoredTransactions, saveTransactions } from "@/utils/localStorageHelper";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const transactionAPI = {
  async getAll(): Promise<ITransaction[]> {
    await delay(500);
    return getStoredTransactions();
  },

  async create(newItem: ITransaction): Promise<ITransaction> {
    await delay(500);

    const current = getStoredTransactions();
    const updated = [newItem, ...current];

    saveTransactions(updated);

    return newItem;
  },

  async update(updatedItem: ITransaction): Promise<ITransaction> {
    await delay(500);

    const current = getStoredTransactions();
    const updated = current.map((item) =>
      item.id === updatedItem.id ? updatedItem : item,
    );

    saveTransactions(updated);

    return updatedItem;
  },

  async remove(id: string): Promise<string> {
    await delay(500);

    const current = getStoredTransactions();
    const updated = current.filter((item) => item.id !== id);

    saveTransactions(updated);

    return id;
  },
};