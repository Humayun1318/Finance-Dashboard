import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { TRole } from "@/types";
import { getRoleFromPath } from "@/utils/getRoleFromPath";
import { getDashboardPageTitle } from "@/utils/getDashboardPageTitle";
import { TransactionsProvider } from "@/context/TransactionsContext";
import { ModeToggle } from "./ModeToggle";

const mockFetchUserRole = (roleFromUrl: TRole): Promise<TRole> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(roleFromUrl); // simulate backend confirming role
    }, 1500);
  });

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [role, setRole] = useState<TRole>("ADMIN");
  const [loading, setLoading] = useState<boolean>(true);

  const pageTitle = getDashboardPageTitle(location.pathname);

  useEffect(() => {
    setLoading(true);

    const roleFromUrl = getRoleFromPath(location.pathname);

    // Simulate fetching user role from backend based on URL and validating it
    mockFetchUserRole(roleFromUrl).then((apiRole) => {
      setRole(apiRole);

      // ensure URL is valid
      if (
        !location.pathname.startsWith("/admin") &&
        !location.pathname.startsWith("/viewer")
      ) {
        navigate("/admin/overview", { replace: true });
      }

      setLoading(false);
    });
  }, []);

  // Handle role switching from the dropdown
  const switchRole = (selectedRole: TRole) => {
    if (loading) return;

    setLoading(true);

    // Simulate backend role switch and validation
    setTimeout(() => {
      const target = selectedRole.toLowerCase();
      const fallback = `/${target}/overview`;

      const nextPath = location.pathname.replace(
        /^\/(admin|viewer)/,
        `/${target}`,
      );

      const sanitizedPath =
        nextPath === location.pathname ? fallback : nextPath;
      setRole(selectedRole);
      navigate(sanitizedPath, { replace: false });

      setLoading(false);
    }, 1000);
  };

  return (
    <TransactionsProvider>
      <SidebarProvider>
        {/* Sidebar + Header Layout */}
        <AppSidebar
          role={role === "ADMIN" ? "ADMIN" : "VIEWER"}
          loading={loading}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
            {/* LEFT */}
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
            </div>

            {/* MIDDLE → PAGE TITLE */}
            <div className="font-heading text-base lg:text-lg font-semibold">
              {pageTitle}
            </div>

            {/* RIGHT */}
            <div className="flex flex-row items-center gap-2">
              <ModeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger
                  className="rounded-md border px-3 py-1 text-sm font-medium cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <Skeleton className="h-4 w-24" />
                  ) : (
                    `Role: ${role}`
                  )}
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem onSelect={() => switchRole("ADMIN")}>
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => switchRole("VIEWER")}>
                    Viewer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col gap-4 p-4">
            {loading ? (
              <div className="space-y-6">
                {/* KPI Cards Skeleton - 3 cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-xl border bg-card p-6 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-8 w-32" />
                        </div>
                        <Skeleton className="h-10 w-10 rounded-lg" />
                      </div>
                      <div className="h-px bg-border" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  ))}
                </div>

                {/* Charts Section Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Balance Trend Chart Skeleton - takes 2/3 width */}
                  <div className="lg:col-span-2">
                    <div className="rounded-xl border bg-card p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-lg" />
                          <Skeleton className="h-5 w-32" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-6 w-24" />
                          </div>
                          <div className="space-y-1">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-6 w-24" />
                          </div>
                          <div className="space-y-1">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-6 w-24" />
                          </div>
                          <div className="space-y-1">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-6 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-80 w-full rounded-lg" />
                      </div>
                    </div>
                  </div>

                  {/* Spending Breakdown Chart Skeleton */}
                  <div>
                    <div className="rounded-xl border bg-card p-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-5 w-40" />
                      </div>
                      <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <Skeleton className="h-32 w-32 rounded-full" />
                        <div className="space-y-2 w-full">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4 mx-auto" />
                        </div>
                      </div>
                      <div className="border-t border-border pt-4 space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TransactionsProvider>
  );
}
