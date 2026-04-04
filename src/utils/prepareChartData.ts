import type { ChartDataPoint, ITransaction } from "@/types";

const getAllMonths = (): string[] => {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  };

export const prepareChartData = (data: ITransaction[]): { data: ChartDataPoint[]; year: number } => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { data: [], year: new Date().getFullYear() };
    }

    let latestYear = 0;
    const transactionsByMonth = new Map<string, { income: number; expense: number; monthIndex: number; year: number }>();
    
    data.forEach((transaction: ITransaction) => {
      const date = new Date(transaction.date);
      if (isNaN(date.getTime())) return;
      
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      const key = `${year}-${monthIndex}`;
      
      if (year > latestYear) latestYear = year;
      
      if (!transactionsByMonth.has(key)) {
        transactionsByMonth.set(key, { income: 0, expense: 0, monthIndex, year });
      }
      
      const current = transactionsByMonth.get(key)!;
      if (transaction.type === "Income") {
        current.income += transaction.amount;
      } else {
        current.expense += transaction.amount;
      }
    });

    const displayYear = latestYear || new Date().getFullYear();
    const allMonths = getAllMonths();
    
    const chartData: ChartDataPoint[] = [];
    let runningBalance = 0;
    
    allMonths.forEach((month, monthIndex) => {
      const key = `${displayYear}-${monthIndex}`;
      const monthData = transactionsByMonth.get(key);
      
      const income = monthData?.income || 0;
      const expense = monthData?.expense || 0;
      runningBalance += income - expense;
      
      chartData.push({
        month: `${month} ${displayYear}`,
        monthShort: month,
        income,
        expense,
        balance: runningBalance,
        year: displayYear
      });
    });

    return { data: chartData, year: displayYear };
  };