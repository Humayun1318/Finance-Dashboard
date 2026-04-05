import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { routes } from "./routes";
import { ThemeProvider } from "./providers/them.provider";
import { Toaster } from "./components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RouterProvider router={routes} />
      <Toaster/>
    </ThemeProvider>
  </StrictMode>,
);
