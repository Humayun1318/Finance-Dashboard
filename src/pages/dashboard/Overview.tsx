import BalanceTrendChart from "@/components/modules/dashboard/overview/BalanceTrendChart";
import OverviewCards from "@/components/modules/dashboard/overview/OverviewCards";
import SpendingBreakdownChart from "@/components/modules/dashboard/overview/SpendingBreakdownChart";
import { Link, useLocation } from "react-router";

export default function Overview() {
  const location = useLocation();
  const isAdmin = location.pathname.split("/")[1] === "admin";
  const basePath = isAdmin ? "/admin" : "/viewer";
  return (
    <>
      <OverviewCards />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <Link
          to={`${basePath}/transactions`}
          className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/70 hover:bg-primary/5"
        >
          <p className="text-sm font-semibold text-foreground">Go to Transactions</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Open the transaction list.
          </p>
        </Link>
        <Link
          to={`${basePath}/insights`}
          className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/70 hover:bg-primary/5"
        >
          <p className="text-sm font-semibold text-foreground">Open Insights</p>
          <p className="mt-2 text-sm text-muted-foreground">
            View deeper trends and analytics.
          </p>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time-based chart - takes 2/3 of the space on large screens */}
        <BalanceTrendChart isAdmin={isAdmin} />
        
        {/* Categorical chart - takes 1/3 of the space */}
        <SpendingBreakdownChart   isAdmin={isAdmin} />
     </div>
    </>
  );
}
