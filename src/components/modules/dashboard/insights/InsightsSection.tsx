// InsightsSection.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/context/TransactionsContext";

import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Calendar, 
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  DollarSign,
  Coffee,
  Home,
  Car,
  ShoppingCart,
  Briefcase,
  Utensils,
  Film,
  Heart,
  type LucideIcon
} from "lucide-react";
import type { ITransaction } from '@/types';

interface CategoryTotal {
  name: string;
  amount: number;
  count: number;
  percentage: number;
}

interface MonthlyData {
  month: string;
  year: number;
  income: number;
  expense: number;
  balance: number;
}

interface MonthlyComparison {
  currentMonth: string;
  previousMonth: string;
  currentExpense: number;
  previousExpense: number;
  expenseChange: number;
  isIncrease: boolean;
}

interface InsightsData {
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

const InsightsSection: React.FC = () => {
  const { data } = useTransactions();

  // Helper to get category icon
  const getCategoryIcon = (category: string): LucideIcon => {
    const cat = category.toLowerCase();
    if (cat.includes('food') || cat.includes('bazar') || cat.includes('grocery')) return Utensils;
    if (cat.includes('salary') || cat.includes('income') || cat.includes('freelance')) return Briefcase;
    if (cat.includes('rent') || cat.includes('home')) return Home;
    if (cat.includes('car') || cat.includes('fuel') || cat.includes('transport')) return Car;
    if (cat.includes('shopping') || cat.includes('internet') || cat.includes('bil')) return ShoppingCart;
    if (cat.includes('movie') || cat.includes('entertainment')) return Film;
    if (cat.includes('health') || cat.includes('medical')) return Heart;
    return Coffee;
  };

  // Parse date
  const parseDate = (dateStr: string): Date => {
    try {
      return new Date(dateStr);
    } catch (error) {
      return new Date();
    }
  };

  // Calculate insights from data
  const calculateInsights = (): InsightsData => {
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

  const insights = calculateInsights();

  if (!insights.hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">Not enough data to generate insights</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Add more transactions to see meaningful insights
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Insights Title */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Key Insights</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Based on your transaction history
        </p>
      </div>

      {/* 3 Main Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Highest Spending Category */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-rose-500/10">
                <ShoppingBag className="w-4 h-4 text-rose-500" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Highest Spending</p>
            <p className="text-xl font-bold text-foreground mb-1">
              {insights.topExpenseCategory?.name || 'N/A'}
            </p>
            {insights.topExpenseCategory && (
              <p className="text-xs text-muted-foreground">
                ₹{insights.topExpenseCategory.amount.toLocaleString('en-IN')} 
                ({insights.topExpenseCategory.percentage.toFixed(0)}% of expenses)
              </p>
            )}
          </CardContent>
        </Card>

        {/* Monthly Comparison */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Calendar className="w-4 h-4 text-blue-500" />
              </div>
              {insights.monthlyComparison && (
                insights.monthlyComparison.isIncrease ? 
                  <ArrowUpRight className="w-4 h-4 text-rose-500" /> :
                  <ArrowDownRight className="w-4 h-4 text-emerald-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">Monthly Comparison</p>
            {insights.monthlyComparison ? (
              <>
                <p className="text-lg font-bold text-foreground mb-1">
                  {insights.monthlyComparison.expenseChange > 0 ? '+' : ''}
                  {Math.abs(insights.monthlyComparison.expenseChange).toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  vs last month ({insights.monthlyComparison.previousMonth})
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Need 2+ months of data</p>
            )}
          </CardContent>
        </Card>

        {/* Saving Rate */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Wallet className="w-4 h-4 text-emerald-500" />
              </div>
              {insights.savingRate > 0 ? 
                <ArrowUpRight className="w-4 h-4 text-emerald-500" /> :
                <ArrowDownRight className="w-4 h-4 text-rose-500" />
              }
            </div>
            <p className="text-sm text-muted-foreground mb-1">Saving Rate</p>
            <p className="text-xl font-bold text-foreground mb-1">
              {insights.savingRate > 0 ? '+' : ''}{insights.savingRate.toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground">
              of total income saved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Most Frequent Category */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Most Frequent Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted/50">
                {React.createElement(getCategoryIcon(insights.mostFrequentCategory?.name || ''), {
                  className: "w-5 h-5 text-primary"
                })}
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">
                  {insights.mostFrequentCategory?.name || 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {insights.mostFrequentCategory?.count || 0} transactions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best & Worst Month */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-muted-foreground">Best Month</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-500">
                    {insights.bestMonth?.month || 'N/A'}
                  </p>
                  {insights.bestMonth && (
                    <p className="text-xs text-muted-foreground">
                      ₹{insights.bestMonth.balance.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-rose-500" />
                  <span className="text-xs text-muted-foreground">Worst Month</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-rose-500">
                    {insights.worstMonth?.month || 'N/A'}
                  </p>
                  {insights.worstMonth && (
                    <p className="text-xs text-muted-foreground">
                      ₹{insights.worstMonth.balance.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Note */}
      <Card className="bg-muted/20 border-border">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-primary/10 mt-0.5">
              <DollarSign className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Summary:</span> You've made {insights.totalTransactions} transactions totaling 
                ₹{insights.totalIncome.toLocaleString('en-IN')} income and ₹{insights.totalExpense.toLocaleString('en-IN')} expenses.
                {insights.savingRate > 20 ? ' Great saving rate!' : insights.savingRate > 0 ? ' Keep saving!' : ' Try to reduce expenses.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsSection;