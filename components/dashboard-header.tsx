"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  Moon,
  Sun,
  User,
  Menu,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ProfileModal } from "./profile-modal";
import { useAuth } from "@/lib/context/AuthContext";

interface DashboardHeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  notificationCount: number;
}

export function DashboardHeader({
  isDark,
  toggleTheme,
  toggleSidebar,
  notificationCount,
}: DashboardHeaderProps) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center px-3 sm:px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden flex-shrink-0"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1 flex items-center gap-2 sm:gap-4 ml-2 sm:ml-4 md:ml-0 min-w-0">
          <div className="relative max-w-md w-full hidden xs:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-muted/50 text-sm h-9 sm:h-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-2xl h-9 w-9 sm:h-10 sm:w-10"
          >
            {isDark ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-2xl h-9 w-9 sm:h-10 sm:w-10"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            {notificationCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-[10px] sm:text-xs"
              >
                {notificationCount > 9 ? "9+" : notificationCount}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-2xl"
              >
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                  <AvatarImage src="/api/placeholder/32/32" alt="Admin" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "PA"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium leading-none">
                    {user?.name || "ProBeauty Admin"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "admin@probeauty.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </header>
  );
}
