import type { ITransaction } from "@/types";

// Calculate totals from transactions array
  export const calculateTotals = (transactions: ITransaction[]) => {
    if (!transactions || !Array.isArray(transactions)) {
      return { totalIncome: 0, totalExpense: 0, netBalance: 0 };
    }

    const totalIncome = transactions
      .filter(t => t.type === "Income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === "Expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpense;
    console.log("Calculated totals:", { totalIncome, totalExpense, netBalance });

    return { totalIncome, totalExpense, netBalance };
  };