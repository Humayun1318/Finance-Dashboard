import BalanceTrendChart from "@/components/modules/dashboard/overview/BalanceTrendChart";
import OverviewCards from "@/components/modules/dashboard/overview/OverviewCards";
import SpendingBreakdownChart from "@/components/modules/dashboard/overview/SpendingBreakdownChart";

export default function Overview() {
  return (
    <>
      <OverviewCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time-based chart - takes 2/3 of the space on large screens */}
        <BalanceTrendChart />
        
        {/* Categorical chart - takes 1/3 of the space */}
        <SpendingBreakdownChart />
     </div>
    </>
  );
}
