"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  Package,
  Calendar,
  RefreshCw,
  Download,
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
import { AnalyticsAPI, ApiError } from "@/lib/services";
import type { SalonAnalyticsData } from "@/lib/types/analytics";
import { AuthErrorMessage } from "./AuthErrorMessage";

interface SalonAnalyticsProps {
  salonId: string;
  salonName?: string;
}

const COLORS = ["#FF6A00", "#E55A00", "#FFA366", "#FFB380", "#CC5500"];

export function SalonAnalytics({ salonId, salonName }: SalonAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<SalonAnalyticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<"today" | "currentMonth" | "all">(
    "currentMonth",
  );

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (dateRange === "today") {
        response = await AnalyticsAPI.getTodaySalonAnalytics(salonId);
      } else if (dateRange === "currentMonth") {
        response = await AnalyticsAPI.getCurrentMonthSalonAnalytics(salonId);
      } else {
        response = await AnalyticsAPI.getSalonAnalytics(salonId);
      }

      setAnalyticsData(response.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load analytics data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [salonId, dateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <AuthErrorMessage message={error} />;
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  const { summary, productRevenue, serviceRevenue } = analyticsData;

  // Format currency
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  // Prepare category data for charts
  const serviceCategoryData = serviceRevenue.byCategory.map((cat, index) => ({
    name: cat.category || "Uncategorized",
    value: parseFloat(cat.revenue),
    count: cat.count,
    percentage: cat.percentage,
    color: COLORS[index % COLORS.length],
  }));

  const productCategoryData = productRevenue.byCategory.map((cat, index) => ({
    name: cat.category || "Products",
    value: parseFloat(cat.revenue),
    count: cat.count,
    percentage: cat.percentage,
    color: COLORS[index % COLORS.length],
  }));

  // Combined revenue breakdown
  const revenueBreakdown = [
    {
      name: "Service Revenue",
      value: parseFloat(serviceRevenue.total),
      color: "#FF6A00",
    },
    {
      name: "Product Revenue",
      value: parseFloat(productRevenue.total),
      color: "#E55A00",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Salon Analytics</h2>
          {salonName && (
            <p className="text-muted-foreground mt-1">{salonName}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Select
            value={dateRange}
            onValueChange={(value: any) => setDateRange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="currentMonth">Current Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalRevenue)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              All transactions
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.netProfit)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              After 2% commission
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.totalTransactions.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {formatCurrency(summary.averageTransactionValue)} avg
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.uniqueCustomers.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              Total customers
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) =>
                    `${name}: ${formatCurrency(value.toString())}`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    formatCurrency(value.toString())
                  }
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#FF6A00" }}
                  />
                  <span className="text-sm">Service Revenue</span>
                </div>
                <span className="text-sm font-medium">
                  {formatCurrency(serviceRevenue.total)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#E55A00" }}
                  />
                  <span className="text-sm">Product Revenue</span>
                </div>
                <span className="text-sm font-medium">
                  {formatCurrency(productRevenue.total)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commission & Profit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Admin Commission (2%)
                </span>
                <span className="text-lg font-bold text-red-600">
                  - {formatCurrency(summary.adminCommission)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Total Revenue
                </span>
                <span className="text-lg font-bold">
                  {formatCurrency(summary.totalRevenue)}
                </span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium">Net Profit</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(summary.netProfit)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Product Orders</span>
                </div>
                <span className="text-sm font-medium">
                  {productRevenue.byCategory.reduce(
                    (sum, cat) => sum + cat.count,
                    0,
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Service Bookings</span>
                </div>
                <span className="text-sm font-medium">
                  {serviceRevenue.byCategory.reduce(
                    (sum, cat) => sum + cat.count,
                    0,
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Categories */}
      {serviceCategoryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Service Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceCategoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) =>
                    formatCurrency(value.toString())
                  }
                />
                <Bar dataKey="value" fill="#FF6A00">
                  {serviceCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceCategoryData.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <p className="text-sm font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {category.count} bookings •{" "}
                        {category.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">
                    {formatCurrency(category.value.toString())}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
