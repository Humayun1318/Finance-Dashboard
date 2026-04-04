// OverviewCards.jsx
import { Card, CardContent } from "@/components/ui/card";
import { useTransactions } from "@/context/TransactionsContext";
import { calculateTotals } from "@/utils/calculateTotals";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

const OverviewCards = () => {
  // Sample data - replace with your actual data
//   const data = {
//     netBalance: 0.00,
//     totalIncome: 0.00,
//     totalExpense: 0.00
//   };
  const { data } = useTransactions();
  console.log("OverviewCards data:", data);

  const { totalIncome, totalExpense, netBalance } = calculateTotals(data);
  const cards = [
    {
      title: "Net Balance",
      value: netBalance,
      icon: Wallet,
      iconColor: "text-primary",
      borderColor: "border-l-primary",
      bgGradient: "from-primary/5 to-transparent"
    },
    {
      title: "Total Income",
      value: totalIncome,
      icon: TrendingUp,
      iconColor: "text-emerald-500",
      borderColor: "border-l-emerald-500",
      bgGradient: "from-emerald-500/5 to-transparent"
    },
    {
      title: "Total Expense",
      value: totalExpense,
      icon: TrendingDown,
      iconColor: "text-rose-500",
      borderColor: "border-l-rose-500",
      bgGradient: "from-rose-500/5 to-transparent"
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card 
          key={index}
          className={`
            relative overflow-hidden
            border border-border 
            bg-card
            ${card.borderColor} border-l-4
            hover:shadow-lg transition-all duration-200
          `}
        >
          {/* Simple gradient accent - respects dark mode */}
          <div 
            className={`
              absolute inset-0 bg-linear-to-br ${card.bgGradient}
              pointer-events-none
            `}
          />
          
          <CardContent className="relative p-6">
            {/* Header with Icon and Title */}
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  ₹{formatCurrency(card.value)}
                </p>
              </div>
              
              <div className={`
                p-2.5 rounded-lg
                bg-muted/50
                ${card.iconColor}
              `}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>

            {/* Simple divider - respects dark mode */}
            <div className="h-px bg-border my-3" />

            {/* Simple info text */}
            <p className="text-xs text-muted-foreground">
              Current period overview
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OverviewCards;