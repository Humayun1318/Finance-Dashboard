import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { Link, useLocation } from "react-router";
import Logo from "@/assets/icons/Logo";
import { getSidebarItems } from "@/utils/getSidebarItems";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: "ADMIN" | "VIEWER";
  loading: boolean;
}

export function AppSidebar({ role, loading, ...props }: AppSidebarProps) {
  const location = useLocation();
  const data = {
    navMain: loading ? [] : getSidebarItems(role),
  };

  const isActive = (url: string) => location.pathname === url;

  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex flex-row gap-2 items-center">
        <Link to="/">
          <Logo />
        </Link>
        <h5 className="font-heading font-semibold">Finance</h5>
      </SidebarHeader>
      <SidebarContent>
        {loading ? (
          <div className="p-4">Loading menu...</div>
        ) : (
          data.navMain.map((item) => (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <Link to={item.url}>{item.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
