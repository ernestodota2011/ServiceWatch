
import React from "react";
import { ThemeProvider } from "./ThemeProvider";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">{children}</div>
    </ThemeProvider>
  );
}
