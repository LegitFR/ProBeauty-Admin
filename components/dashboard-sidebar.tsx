"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  Users,
  Calendar,
  ShoppingCart,
  CreditCard,
  Brain,
  FileText,
  Bell,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  Scissors,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  href: string;
}

interface DashboardSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
}

const sidebarItems: SidebarItem[] = [
  { id: "overview", label: "Overview", icon: BarChart3, href: "/dashboard" },
  {
    id: "salons",
    label: "Salon Management",
    icon: Building2,
    href: "/dashboard/salons",
  },
  {
    id: "customers",
    label: "Customer Management",
    icon: Users,
    href: "/dashboard/customers",
  },
  {
    id: "bookings",
    label: "Booking Management",
    icon: Calendar,
    badge: 12,
    href: "/dashboard/bookings",
  },
  {
    id: "ecommerce",
    label: "E-Commerce",
    icon: ShoppingCart,
    href: "/dashboard/ecommerce",
  },
  {
    id: "payments",
    label: "Payments & Finance",
    icon: CreditCard,
    href: "/dashboard/payments",
  },
  {
    id: "ai-analytics",
    label: "AI Analytics",
    icon: Brain,
    href: "/dashboard/ai-analytics",
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    icon: FileText,
    href: "/dashboard/reports",
  },
  {
    id: "notifications",
    label: "Notification Center",
    icon: Bell,
    badge: 5,
    href: "/dashboard/notifications",
  },
  {
    id: "health",
    label: "System Health",
    icon: Shield,
    href: "/dashboard/health",
  },
  {
    id: "disputes",
    label: "Dispute Management",
    icon: Users,
    href: "/dashboard/disputes",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function DashboardSidebar({
  isCollapsed,
  onToggleCollapse,
  className,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-40 bg-background border-r transition-all duration-300 overflow-y-auto overscroll-contain min-h-screen",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
      style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
    >
      <div className="flex flex-col min-h-full pb-6">
        {/* Logo and Brand */}
        <div className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-6 md:mt-1 border-b">
          {!isCollapsed && (
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
              <div className="w-7 h-7 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Scissors className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-sm sm:text-base text-foreground truncate">
                  ProBeauty
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  Admin Panel
                </span>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 rounded-2xl hidden md:flex flex-shrink-0"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col justify-center px-2 sm:px-3 py-2 sm:py-3 space-y-0.5 sm:space-y-1 space-y-2">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/dashboard" && pathname === "/dashboard");
            return (
              <Link key={item.id} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start rounded-lg transition-all duration-200 h-8 sm:h-10",
                    isCollapsed ? "px-2" : "px-2 sm:px-3 py-1.5 sm:py-2",
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                      : "hover:bg-accent text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0",
                      isCollapsed ? "" : "mr-2 sm:mr-3"
                    )}
                  />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left text-xs sm:text-sm font-medium">
                        {item.label}
                      </span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "secondary" : "default"}
                          className="ml-auto rounded-full px-1.5 sm:px-2.5 py-0 sm:py-0.5 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Role Indicator */}
        {!isCollapsed && (
          <div className="mx-2 sm:mx-3 mt-2 sm:mt-3 mb-2 border-t pt-2 sm:pt-3">
            <div className="bg-primary/10 rounded-lg p-2 sm:p-3">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                <span className="text-xs font-semibold">Super Admin</span>
              </div>
              <p className="text-xs text-muted-foreground leading-tight sm:leading-snug">
                Full system access with all permissions
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
