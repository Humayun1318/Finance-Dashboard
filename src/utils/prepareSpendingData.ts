import type { ITransaction, SpendingDataPoint } from "@/types";

export const prepareSpendingData = (data: ITransactionn[]): SpendingDataPoint[] => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    const expenses = data.filter((t: ITransaction) => t.type === "Expense");
    
    if (expenses.length === 0) {
      return [];
    }

    const categoryMap = new Map<string, number>();
    expenses.forEach((expense: ITransaction) => {
      const category = expense.category;
      const currentAmount = categoryMap.get(category) || 0;
      categoryMap.set(category, currentAmount + expense.amount);
    });

    const total = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);
    
    const spendingData = Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name,
        value,
        formattedValue: `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        percentage: (value / total) * 100
      }))
      .sort((a, b) => b.value - a.value);

    return spendingData;
  };