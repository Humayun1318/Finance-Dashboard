import type { TRole } from "@/types";

export const getRoleFromPath = (pathname: string): TRole => {
  if (pathname.startsWith("/admin")) return "ADMIN";
  if (pathname.startsWith("/viewer")) return "VIEWER";
  return "ADMIN";
};