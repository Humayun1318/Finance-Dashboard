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
import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { TRole } from "@/types";
import { getRoleFromPath } from "@/utils/getRoleFromPath";

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

  useEffect(() => {
    setLoading(true);

    const roleFromUrl = getRoleFromPath(location.pathname);

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

  const switchRole = (selectedRole: TRole) => {
    if (loading) return;

    setLoading(true);

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
    <SidebarProvider>
      <AppSidebar
        role={role === "ADMIN" ? "ADMIN" : "VIEWER"}
        loading={loading}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-md border px-3 py-1 text-sm font-medium cursor-pointer"
              disabled={loading}
            >
              {loading ? "Loading role..." : `Role: ${role}`}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onSelect={() => switchRole("ADMIN")}
                className="cursor-pointer"
              >
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => switchRole("VIEWER")}
                className="cursor-pointer"
              >
                Viewer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="rounded-md border px-4 py-2 text-sm font-medium">
                Loading dashboard...
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
