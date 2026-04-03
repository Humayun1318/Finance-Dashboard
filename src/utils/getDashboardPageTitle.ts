const routeTitleMap: Record<string, string> = {
  overview: "Dashboard Overview",
  transactions: "Transactions",
  insights: "Insights",
};

export const getDashboardPageTitle = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const page = segments[1] || "overview";

  return routeTitleMap[page] || "Dashboard";
};