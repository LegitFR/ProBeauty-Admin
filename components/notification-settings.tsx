"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Bell,
  BellRing,
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Mail,
  Smartphone,
  MessageSquare,
  Shield,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: "booking" | "payment" | "customer" | "system" | "promotion" | "alert";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high" | "critical";
  category: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  inAppNotifications: boolean;
  bookingAlerts: boolean;
  paymentAlerts: boolean;
  customerAlerts: boolean;
  systemAlerts: boolean;
  promotionAlerts: boolean;
  criticalAlerts: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: "instant" | "daily" | "weekly";
  soundEnabled: boolean;
}

export function NotificationSettings() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    inAppNotifications: true,
    bookingAlerts: true,
    paymentAlerts: true,
    customerAlerts: true,
    systemAlerts: true,
    promotionAlerts: false,
    criticalAlerts: true,
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00",
    },
    frequency: "instant",
    soundEnabled: true,
  });

  const [notifications] = useState<NotificationItem[]>([
    {
      id: "1",
      type: "booking",
      title: "New Booking Alert",
      message:
        "Sarah Johnson booked a Premium Facial at Luxury Spa Downtown for tomorrow at 2:00 PM",
      timestamp: "2 minutes ago",
      read: false,
      priority: "high",
      category: "Booking Management",
    },
    {
      id: "2",
      type: "payment",
      title: "Payment Failed",
      message:
        "Payment of $150.00 failed for booking #BK-2024-001. Customer card was declined.",
      timestamp: "5 minutes ago",
      read: false,
      priority: "critical",
      category: "Payment Processing",
    },
    {
      id: "3",
      type: "customer",
      title: "VIP Customer Check-in",
      message:
        "Emma Williams (VIP) has checked in for her appointment at Elite Beauty Salon",
      timestamp: "10 minutes ago",
      read: true,
      priority: "medium",
      category: "Customer Service",
    },
    {
      id: "4",
      type: "system",
      title: "System Maintenance Complete",
      message:
        "Scheduled maintenance for payment gateway has been completed successfully",
      timestamp: "15 minutes ago",
      read: true,
      priority: "low",
      category: "System Updates",
    },
    {
      id: "5",
      type: "alert",
      title: "Low Inventory Alert",
      message:
        "Hair Serum Premium is running low (3 units remaining) at Beauty Hub Central",
      timestamp: "30 minutes ago",
      read: false,
      priority: "medium",
      category: "Inventory Management",
    },
    {
      id: "6",
      type: "promotion",
      title: "Campaign Performance",
      message:
        "Black Friday promotion achieved 85% of target with 2 days remaining",
      timestamp: "1 hour ago",
      read: true,
      priority: "low",
      category: "Marketing",
    },
    {
      id: "7",
      type: "booking",
      title: "Booking Cancellation",
      message:
        "Michael Chen cancelled his appointment scheduled for today at 4:00 PM",
      timestamp: "2 hours ago",
      read: false,
      priority: "medium",
      category: "Booking Management",
    },
    {
      id: "8",
      type: "customer",
      title: "New Customer Registration",
      message:
        "Jessica Martinez registered as a new customer and completed her profile",
      timestamp: "3 hours ago",
      read: true,
      priority: "low",
      category: "Customer Management",
    },
  ]);

  const updateSetting = (key: keyof NotificationSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateQuietHours = (field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value,
      },
    }));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return Calendar;
      case "payment":
        return CreditCard;
      case "customer":
        return Users;
      case "system":
        return Settings;
      case "promotion":
        return TrendingUp;
      case "alert":
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" || notification.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            Notification Center
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage notifications, alerts, and communication preferences
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
          <Badge variant="outline" className="rounded-full">
            {unreadCount} Unread
          </Badge>
          <Button className="bg-primary hover:bg-primary/90 rounded-2xl">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 rounded-2xl p-1">
          <TabsTrigger
            value="notifications"
            className="rounded-xl text-xs sm:text-sm px-2 sm:px-3"
          >
            <BellRing className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Recent</span>
            <span className="hidden md:inline"> Notifications</span>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="rounded-xl text-xs sm:text-sm px-2 sm:px-3"
          >
            <Settings className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden xs:inline">Preferences</span>
          </TabsTrigger>
          <TabsTrigger
            value="channels"
            className="rounded-xl text-xs sm:text-sm px-2 sm:px-3"
          >
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden xs:inline">Channels</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          {/* Search and Filter Bar */}
          <Card className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9 sm:h-10 text-sm"
                />
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-40 h-9 sm:h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="booking">Bookings</SelectItem>
                    <SelectItem value="payment">Payments</SelectItem>
                    <SelectItem value="customer">Customers</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="promotion">Promotions</SelectItem>
                    <SelectItem value="alert">Alerts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Notification List */}
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-lg">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] sm:h-[500px] lg:h-[600px]">
                <div className="space-y-1 p-3 sm:p-6">
                  {filteredNotifications.map((notification, index) => {
                    const IconComponent = getNotificationIcon(
                      notification.type
                    );
                    return (
                      <div key={notification.id}>
                        <div
                          className={`flex items-start gap-2 sm:gap-4 p-2 sm:p-4 rounded-xl hover:bg-muted/50 transition-colors ${
                            !notification.read
                              ? "bg-primary-light border border-primary/20"
                              : ""
                          }`}
                        >
                          <div
                            className={`p-1.5 sm:p-2 rounded-xl flex-shrink-0 ${
                              notification.type === "booking"
                                ? "bg-blue-100 text-blue-600"
                                : notification.type === "payment"
                                ? "bg-green-100 text-green-600"
                                : notification.type === "customer"
                                ? "bg-purple-100 text-purple-600"
                                : notification.type === "system"
                                ? "bg-gray-100 text-gray-600"
                                : notification.type === "promotion"
                                ? "bg-orange-100 text-orange-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-xs sm:text-sm truncate">
                                  {notification.title}
                                </h4>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                                  <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span className="truncate">
                                      {notification.timestamp}
                                    </span>
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={`text-[10px] sm:text-xs rounded-full ${getPriorityColor(
                                      notification.priority
                                    )}`}
                                  >
                                    {notification.priority}
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] sm:text-xs rounded-full hidden sm:inline-flex"
                                  >
                                    {notification.category}
                                  </Badge>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                {notification.read ? (
                                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                                ) : (
                                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0"
                                >
                                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < filteredNotifications.length - 1 && (
                          <Separator className="my-2" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Sound Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sound for new notifications
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {settings.soundEnabled ? (
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <VolumeX className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Switch
                        checked={settings.soundEnabled}
                        onCheckedChange={(value: boolean) =>
                          updateSetting("soundEnabled", value)
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Notification Frequency</Label>
                    <Select
                      value={settings.frequency}
                      onValueChange={(value: "instant" | "daily" | "weekly") =>
                        updateSetting("frequency", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instant">Instant</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quiet Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Quiet Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Enable Quiet Hours</Label>
                    <p className="text-sm text-muted-foreground">
                      Mute non-critical notifications during specified hours
                    </p>
                  </div>
                  <Switch
                    checked={settings.quietHours.enabled}
                    onCheckedChange={(value: boolean) =>
                      updateQuietHours("enabled", value)
                    }
                  />
                </div>

                {settings.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={settings.quietHours.start}
                        onChange={(e) =>
                          updateQuietHours("start", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={settings.quietHours.end}
                        onChange={(e) =>
                          updateQuietHours("end", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Notification Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <Label>Booking Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          New bookings, cancellations, modifications
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.bookingAlerts}
                      onCheckedChange={(value: boolean) =>
                        updateSetting("bookingAlerts", value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      <div>
                        <Label>Payment Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Payment confirmations, failures, refunds
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.paymentAlerts}
                      onCheckedChange={(value: boolean) =>
                        updateSetting("paymentAlerts", value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-purple-600" />
                      <div>
                        <Label>Customer Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          New registrations, profile updates, reviews
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.customerAlerts}
                      onCheckedChange={(value: boolean) =>
                        updateSetting("customerAlerts", value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-red-600" />
                      <div>
                        <Label>System Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Maintenance, updates, security notices
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.systemAlerts}
                      onCheckedChange={(value: boolean) =>
                        updateSetting("systemAlerts", value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      <div>
                        <Label>Promotion Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Campaign updates, performance metrics
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.promotionAlerts}
                      onCheckedChange={(value: boolean) =>
                        updateSetting("promotionAlerts", value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <Label>Critical Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Urgent issues requiring immediate attention
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.criticalAlerts}
                      onCheckedChange={(value: boolean) =>
                        updateSetting("criticalAlerts", value)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(value: boolean) =>
                      updateSetting("emailNotifications", value)
                    }
                  />
                </div>

                {settings.emailNotifications && (
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value="admin@probeauty.com"
                        className="bg-background"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Push Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Push Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Browser Push</Label>
                    <p className="text-sm text-muted-foreground">
                      Show desktop notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(value: boolean) =>
                      updateSetting("pushNotifications", value)
                    }
                  />
                </div>

                {settings.pushNotifications && (
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Browser permissions granted
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SMS Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  SMS Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Critical alerts via SMS
                    </p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(value: boolean) =>
                      updateSetting("smsNotifications", value)
                    }
                  />
                </div>

                {settings.smsNotifications && (
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="bg-background"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* In-App Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  In-App Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Dashboard Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show notifications in dashboard
                    </p>
                  </div>
                  <Switch
                    checked={settings.inAppNotifications}
                    onCheckedChange={(value: boolean) =>
                      updateSetting("inAppNotifications", value)
                    }
                  />
                </div>

                <div className="p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-primary" />
                    Real-time notifications enabled
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Button variant="outline" className="rounded-2xl">
                  Reset to Default
                </Button>
                <Button className="bg-primary hover:bg-primary/90 rounded-2xl">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
