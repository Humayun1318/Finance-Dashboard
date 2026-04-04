import type { CategoryTotal, InsightsData, ITransaction, MonthlyComparison, MonthlyData } from "@/types";

// Parse date
  const parseDate = (dateStr: string): Date => {
    try {
      return new Date(dateStr);
    } catch (error) {
      console.error("Invalid date format:", dateStr);
      return new Date();
    }
  };

export const calculateInsights = (data: ITransaction[]): InsightsData => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return {
        hasData: false,
        topExpenseCategory: null,
        topIncomeCategory: null,
        monthlyComparison: null,
        avgTransactionValue: 0,
        totalTransactions: 0,
        busiestDay: null,
        mostFrequentCategory: null,
        savingRate: 0,
        bestMonth: null,
        worstMonth: null,
        totalIncome: 0,
        totalExpense: 0
      };
    }

    const transactions = data as ITransaction[];
    
    // Category analysis (Expenses)
    const expenseByCategory = new Map<string, { amount: number; count: number }>();
    const incomeByCategory = new Map<string, { amount: number; count: number }>();
    
    // Track spending by day of week
    const daySpending = new Map<string, number>();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    let totalExpense = 0;
    let totalIncome = 0;
    let totalTransactions = 0;
    
    // Monthly data for comparison
    const monthlyData = new Map<string, MonthlyData>();
    
    transactions.forEach(t => {
      const date = parseDate(t.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      
      totalTransactions++;
      
      if (t.type === 'Expense') {
        totalExpense += t.amount;
        
        // Category tracking
        const current = expenseByCategory.get(t.category) || { amount: 0, count: 0 };
        current.amount += t.amount;
        current.count++;
        expenseByCategory.set(t.category, current);
        
        // Day tracking
        const dayName = days[date.getDay()];
        daySpending.set(dayName, (daySpending.get(dayName) || 0) + t.amount);
        
        // Monthly tracking
        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, { month: monthName, year, income: 0, expense: 0, balance: 0 });
        }
        const month = monthlyData.get(monthKey)!;
        month.expense += t.amount;
        month.balance = month.income - month.expense;
        
      } else if (t.type === 'Income') {
        totalIncome += t.amount;
        
        // Income category tracking
        const current = incomeByCategory.get(t.category) || { amount: 0, count: 0 };
        current.amount += t.amount;
        current.count++;
        incomeByCategory.set(t.category, current);
        
        // Monthly tracking
        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, { month: monthName, year, income: 0, expense: 0, balance: 0 });
        }
        const month = monthlyData.get(monthKey)!;
        month.income += t.amount;
        month.balance = month.income - month.expense;
      }
    });
    
    // Find top expense category
    let topExpenseCategory: CategoryTotal | null = null;
    let mostFrequentCategory: CategoryTotal | null = null;
    
    expenseByCategory.forEach((value, name) => {
      const percentage = totalExpense > 0 ? (value.amount / totalExpense) * 100 : 0;
      const categoryTotal = { name, amount: value.amount, count: value.count, percentage };
      
      if (!topExpenseCategory || value.amount > topExpenseCategory.amount) {
        topExpenseCategory = categoryTotal;
      }
      
      if (!mostFrequentCategory || value.count > mostFrequentCategory.count) {
        mostFrequentCategory = categoryTotal;
      }
    });
    
    // Find top income category
    let topIncomeCategory: CategoryTotal | null = null;
    incomeByCategory.forEach((value, name) => {
      const percentage = totalIncome > 0 ? (value.amount / totalIncome) * 100 : 0;
      if (!topIncomeCategory || value.amount > topIncomeCategory.amount) {
        topIncomeCategory = { name, amount: value.amount, count: value.count, percentage };
      }
    });
    
    // Find busiest spending day
    let busiestDay: string | null = null;
    let highestSpending = 0;
    daySpending.forEach((amount, day) => {
      if (amount > highestSpending) {
        highestSpending = amount;
        busiestDay = day;
      }
    });
    
    // Monthly comparison (current vs previous month)
    const sortedMonths = Array.from(monthlyData.values()).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(b.month.substring(0, 3)) - months.indexOf(a.month.substring(0, 3));
    });
    
    let monthlyComparison: MonthlyComparison | null = null;
    if (sortedMonths.length >= 2) {
      const currentMonth = sortedMonths[0];
      const previousMonth = sortedMonths[1];
      const expenseChange = previousMonth.expense > 0 
        ? ((currentMonth.expense - previousMonth.expense) / previousMonth.expense) * 100 
        : 0;
      monthlyComparison = {
        currentMonth: `${currentMonth.month} ${currentMonth.year}`,
        previousMonth: `${previousMonth.month} ${previousMonth.year}`,
        currentExpense: currentMonth.expense,
        previousExpense: previousMonth.expense,
        expenseChange,
        isIncrease: expenseChange > 0
      };
    }
    
    // Find best and worst month
    let bestMonth: { month: string; balance: number } | null = null;
    let worstMonth: { month: string; balance: number } | null = null;
    
    sortedMonths.forEach(month => {
      if (!bestMonth || month.balance > bestMonth.balance) {
        bestMonth = { month: `${month.month} ${month.year}`, balance: month.balance };
      }
      if (!worstMonth || month.balance < worstMonth.balance) {
        worstMonth = { month: `${month.month} ${month.year}`, balance: month.balance };
      }
    });
    
    // Calculate saving rate
    const savingRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    
    // Average transaction value
    const avgTransactionValue = totalTransactions > 0 
      ? (totalExpense + totalIncome) / totalTransactions 
      : 0;
    
    return {
      hasData: totalTransactions > 0,
      topExpenseCategory,
      topIncomeCategory,
      monthlyComparison,
      avgTransactionValue,
      totalTransactions,
      busiestDay,
      mostFrequentCategory,
      savingRate,
      bestMonth,
      worstMonth,
      totalIncome,
      totalExpense
    };
  };