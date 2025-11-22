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
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] bg-background border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo and Brand */}
        <div className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Scissors className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">ProBeauty</span>
                <span className="text-xs text-muted-foreground">
                  Admin Panel
                </span>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 rounded-2xl hidden md:flex"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation Items - Scrollable Area */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <nav className="px-4 pt-6 pb-4 space-y-2">
            {sidebarItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/dashboard" && pathname === "/dashboard");
              return (
                <Link key={item.id} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start rounded-xl transition-all duration-200 h-12",
                      isCollapsed ? "px-3" : "px-4 py-3",
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                        : "hover:bg-accent text-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        isCollapsed ? "" : "mr-3.5"
                      )}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left text-sm font-medium">
                          {item.label}
                        </span>
                        {item.badge && (
                          <Badge
                            variant={isActive ? "secondary" : "default"}
                            className="ml-auto rounded-full px-2.5 py-0.5"
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
            <div className="mx-4 mb-6 mt-4 border-t pt-4">
              <div className="bg-primary/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Super Admin</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Full system access with all permissions
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
