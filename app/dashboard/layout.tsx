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
    // Prevent body scroll when sidebar is open on mobile
    if (!sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <DashboardHeader
          isDark={isDark}
          toggleTheme={toggleTheme}
          toggleSidebar={toggleSidebar}
          notificationCount={notificationCount}
        />

        <div className="flex">
          {/* Sidebar */}
          <DashboardSidebar
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
            className={`${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0`}
          />

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => {
                setSidebarOpen(false);
                document.body.style.overflow = "";
              }}
            />
          )}

          {/* Main Content */}
          <main
            className={`flex-1 transition-all duration-300 w-full overflow-x-hidden ${
              sidebarCollapsed ? "md:ml-16" : "md:ml-64"
            }`}
          >
            <div className="min-h-[calc(100vh-4rem)] w-full">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
