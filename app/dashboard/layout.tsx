"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount] = useState(7);

  // Theme handling
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    // Cleanup body overflow on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <DashboardHeader
          isDark={isDark}
          toggleTheme={toggleTheme}
          toggleSidebar={toggleSidebar}
          notificationCount={notificationCount}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <DashboardSidebar
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
            isDark={isDark}
            className={`${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0`}
          />

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main
            className={`flex-1 transition-all duration-300 overflow-y-auto ${
              sidebarCollapsed ? "md:pl-16" : "md:pl-64"
            }`}
          >
            <div className="min-h-full w-full max-w-full">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
