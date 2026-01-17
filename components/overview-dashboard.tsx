"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Clock,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  SalonAPI,
  BookingAPI,
  UserAPI,
  AnalyticsAPI,
  ApiError,
} from "@/lib/services";
import type { Salon, Booking } from "@/lib/types/api";
import type { AdminAnalyticsData } from "@/lib/types/analytics";
import { AuthErrorMessage } from "./AuthErrorMessage";

interface Activity {
  id: number;
  type: "booking" | "payment" | "salon" | "review";
  description: string;
  time: string;
  status: string;
  amount: string | null;
}

export function OverviewDashboard() {
  const router = useRouter();
  const [salons, setSalons] = useState<Salon[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AdminAnalyticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsAuthError(false);

      const [salonsRes, bookingsRes, analyticsRes] = await Promise.all([
        SalonAPI.getSalons({ page: 1, limit: 100 }),
        BookingAPI.getBookings({ page: 1, limit: 100 }),
        AnalyticsAPI.getAdminAnalytics({ period: "monthly" }), // All-time analytics
      ]);

      setSalons(salonsRes.data);
      setBookings(bookingsRes.data);
      setAnalyticsData(analyticsRes.data);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setIsAuthError(true);
        }
        setError(err.message);
      } else {
        setError("Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: string | number) => {
    const value = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate KPIs from real data
  const totalBookings =
    analyticsData?.summary.totalTransactions || bookings.length;
  const totalSalons = analyticsData?.summary.totalSalons || salons.length;
  const totalRevenue = analyticsData?.summary.totalRevenue || "0";
  const uniqueCustomers = analyticsData?.summary.uniqueCustomers || 0;

  const kpiData = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      period: "vs last month",
    },
    {
      title: "Total Transactions",
      value: totalBookings.toLocaleString(),
      change: "+8.2%",
      trend: "up" as const,
      icon: Calendar,
      period: "vs last month",
    },
    {
      title: "Unique Customers",
      value: uniqueCustomers.toLocaleString(),
      change: "+15.3%",
      trend: "up" as const,
      icon: Users,
      period: "vs last month",
    },
    {
      title: "Active Salons",
      value: totalSalons.toLocaleString(),
      change: "+3.1%",
      trend: "up" as const,
      icon: Building2,
      period: "vs last month",
    },
  ];

  // Revenue data from analytics
  const revenueData =
    analyticsData?.trends.data.map((item) => ({
      month: new Date(item.period).toLocaleDateString("en-US", {
        month: "short",
      }),
      revenue: parseFloat(item.revenue),
      bookings: item.transactions,
    })) || [];

  // Top services from analytics
  const topServices =
    analyticsData?.topServices.slice(0, 4).map((service, index) => ({
      name: service.serviceName,
      value: parseFloat(service.totalRevenue),
      color: ["#FF6A00", "#E55A00", "#FFA366", "#FFB380"][index] || "#FF6A00",
    })) || [];

  // Calculate percentages for pie chart
  const totalServiceRevenue = topServices.reduce((sum, s) => sum + s.value, 0);
  const topServicesWithPercentage = topServices.map((service) => ({
    ...service,
    percentage:
      totalServiceRevenue > 0
        ? ((service.value / totalServiceRevenue) * 100).toFixed(1)
        : 0,
  }));

  // Recent activities from bookings
  const recentActivities = bookings.slice(0, 4).map((booking, index) => {
    const createdDate = new Date(booking.createdAt);
    const now = new Date();

    // Check if date is valid
    let timeAgo = "Recently";
    if (!isNaN(createdDate.getTime())) {
      const diffMs = now.getTime() - createdDate.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) {
        timeAgo = "Just now";
      } else if (diffMins < 60) {
        timeAgo = `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
      } else if (diffHours < 24) {
        timeAgo = `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
      } else if (diffDays < 30) {
        timeAgo = `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
      } else {
        timeAgo = createdDate.toLocaleDateString();
      }
    }

    return {
      id: index,
      type: "booking" as const,
      description: `New booking at ${booking.salon.name}`,
      time: timeAgo,
      status: booking.status.toLowerCase(),
      amount: formatCurrency(booking.service.price.toString()),
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    if (isAuthError) {
      return <AuthErrorMessage onRetry={fetchDashboardData} />;
    }
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your beauty platform.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button variant="outline" className="rounded-2xl">
            Export Report
          </Button>
          <Button className="bg-primary hover:bg-primary/90 rounded-2xl">
            Add New Salon
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="p-4 sm:p-6">
            <CardContent className="p-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="p-2 bg-primary/10 rounded-xl shrink-0">
                    <kpi.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {kpi.title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold">{kpi.value}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div
                    className={`flex items-center gap-0.5 sm:gap-1 ${
                      kpi.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {kpi.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                    <span className="text-xs sm:text-sm font-medium">
                      {kpi.change}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {kpi.period}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        {/* Revenue Trend */}
        <Card className="p-4 sm:p-6">
          <CardHeader className="p-0 pb-3 sm:pb-4">
            <CardTitle className="flex items-center justify-between text-base sm:text-lg">
              <span>Revenue Trend</span>
              <Badge variant="secondary" className="rounded-full text-xs">
                6 months
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <ResponsiveContainer width="100%" height={250} minWidth={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FF6A00"
                  strokeWidth={3}
                  dot={{ fill: "#FF6A00", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Top Services */}
        <Card className="p-4 sm:p-6">
          <CardHeader className="p-0 pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Top Services</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <ResponsiveContainer width="100%" height={250} minWidth={300}>
              <PieChart>
                <Pie
                  data={topServicesWithPercentage}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {topServicesWithPercentage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
              {topServicesWithPercentage.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: service.color }}
                    />
                    <span className="text-xs sm:text-sm truncate">
                      {service.name}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium shrink-0">
                    {service.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-4 sm:p-6">
        <CardHeader className="p-0 pb-3 sm:pb-4">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-base sm:text-lg">
            <span>Recent Activity</span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-2xl"
              onClick={() => router.push("/dashboard/bookings")}
            >
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-3 sm:space-y-4">
            {recentActivities.map((activity) => {
              const iconClass = "h-3 w-3 sm:h-4 sm:w-4";
              const type = activity.type as Activity["type"];

              let iconBgClass = "";
              if (type === "booking") iconBgClass = "bg-blue-100 text-blue-600";
              else if (type === "payment")
                iconBgClass = "bg-green-100 text-green-600";
              else if (type === "salon")
                iconBgClass = "bg-purple-100 text-purple-600";
              else if (type === "review")
                iconBgClass = "bg-yellow-100 text-yellow-600";

              return (
                <div
                  key={activity.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-muted/30 rounded-xl sm:rounded-2xl"
                >
                  <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                    <div
                      className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0 ${iconBgClass}`}
                    >
                      {type === "booking" && <Calendar className={iconClass} />}
                      {type === "payment" && (
                        <DollarSign className={iconClass} />
                      )}
                      {type === "salon" && <Building2 className={iconClass} />}
                      {type === "review" && <Star className={iconClass} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-medium line-clamp-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:text-right shrink-0">
                    {activity.amount && (
                      <p className="text-sm sm:text-base font-medium text-green-600">
                        {activity.amount}
                      </p>
                    )}
                    <Badge
                      variant={
                        activity.status === "completed" ||
                        activity.status === "active" ||
                        activity.status === "positive"
                          ? "default"
                          : "secondary"
                      }
                      className="rounded-full text-xs"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
