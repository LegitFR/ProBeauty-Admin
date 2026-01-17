"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AnalyticsAPI, ApiError } from "@/lib/services";
import type { AdminAnalyticsData } from "@/lib/types/analytics";
import { AuthErrorMessage } from "./AuthErrorMessage";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Smartphone,
  Banknote,
  Shield,
  ShoppingCart,
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

// Payment methods sample data (kept for UI demonstration only)
const paymentMethods = [
  { name: "Credit Card", value: 45, color: "#FF6A00", count: 234 },
  { name: "Apple Pay", value: 25, color: "#E55A00", count: 128 },
  { name: "Google Pay", value: 20, color: "#FFA366", count: 102 },
  { name: "PayPal", value: 10, color: "#FFB380", count: 56 },
];

export function PaymentsFinance() {
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [analyticsData, setAnalyticsData] = useState<AdminAnalyticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (selectedPeriod === "7d") {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        response = await AnalyticsAPI.getAdminAnalytics({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          period: "daily",
        });
      } else if (selectedPeriod === "30d") {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        response = await AnalyticsAPI.getAdminAnalytics({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          period: "daily",
        });
      } else if (selectedPeriod === "90d") {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 90);
        response = await AnalyticsAPI.getAdminAnalytics({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          period: "weekly",
        });
      } else {
        // All time
        response = await AnalyticsAPI.getAdminAnalytics({ period: "monthly" });
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

  const formatCurrency = (amount: string | number) => {
    const value = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Calculate metrics from real analytics data
  const totalRevenue = analyticsData
    ? parseFloat(analyticsData.summary.totalRevenue)
    : 0;
  const totalFees = analyticsData
    ? parseFloat(analyticsData.summary.adminProfit)
    : 0; // 2% platform commission
  const totalTransactions = analyticsData?.summary.totalTransactions || 0;
  const productRevenue = analyticsData
    ? parseFloat(analyticsData.summary.productRevenue)
    : 0;
  const serviceRevenue = analyticsData
    ? parseFloat(analyticsData.summary.serviceRevenue)
    : 0;

  // Pending and failed transaction data not available from API yet
  const pendingAmount = 0;
  const failedCount = 0;

  // Convert analytics trends to chart data
  const revenueChartData =
    analyticsData?.trends.data.map((item) => ({
      day: new Date(item.period).toLocaleDateString("en-US", {
        weekday:
          selectedPeriod === "90d" || selectedPeriod === "all"
            ? undefined
            : "short",
        month:
          selectedPeriod === "90d" || selectedPeriod === "all"
            ? "short"
            : undefined,
        day: "numeric",
      }),
      revenue: parseFloat(item.revenue),
      transactions: item.transactions,
    })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading financial data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return <AuthErrorMessage message={error} onRetry={fetchAnalytics} />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Payments & Finance</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Monitor transactions, revenue, and financial performance
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button
            variant="outline"
            className="rounded-2xl"
            onClick={fetchAnalytics}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline" className="rounded-2xl">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button className="bg-primary hover:bg-primary/90 rounded-2xl">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-xl">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Total Revenue
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {formatCurrency(totalRevenue)}
                  </p>
                </div>
              </div>
              <div className="text-green-600 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm">+12.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-xl">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Platform Commission
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {formatCurrency(totalFees)}
                  </p>
                </div>
              </div>
              <div className="text-blue-600 flex items-center gap-1">
                <span className="text-sm">2% of revenue</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-xl">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Pending Amount
                  </p>
                  <p className="text-lg sm:text-xl font-medium text-muted-foreground">
                    Coming Soon
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                No API
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-red-100 rounded-xl">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Failed Transactions
                  </p>
                  <p className="text-lg sm:text-xl font-medium text-muted-foreground">
                    Coming Soon
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                No API
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown - Products vs Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Product Revenue</p>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(productRevenue)}
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {totalRevenue > 0
                ? ((productRevenue / totalRevenue) * 100).toFixed(1)
                : 0}
              % of total revenue
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Service Revenue</p>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(serviceRevenue)}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {totalRevenue > 0
                ? ((serviceRevenue / totalRevenue) * 100).toFixed(1)
                : 0}
              % of total revenue
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold mt-1">
                  {totalTransactions.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Across all salons
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Revenue Trend */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center justify-between">
              <span>Daily Revenue Trend</span>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue"
                      ? formatCurrency(value as number)
                      : value,
                    name === "revenue" ? "Revenue" : "Transactions",
                  ]}
                />
                <Bar dataKey="revenue" fill="#FF6A00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods Distribution */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              Payment Methods
              <Badge variant="secondary" className="text-xs">
                Sample Data
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Usage"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-3">
              {paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: method.color }}
                    />
                    <span className="text-sm">{method.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{method.value}%</span>
                    <p className="text-xs text-muted-foreground">
                      {method.count} transactions
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Transactions</span>
            <Badge variant="secondary" className="text-xs">
              Coming Soon
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="p-4 bg-muted/50 rounded-full mb-4">
              <CreditCard className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Transaction Details Coming Soon
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Individual transaction tracking with payment methods, customer
              details, and real-time status updates will be available once the
              transaction API endpoint is integrated.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                View All Transactions
              </Button>
              <Button variant="outline" size="sm" disabled>
                Export Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fraud Detection Alert */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                Fraud Detection Alert
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                No suspicious activities detected in the last 24 hours. All
                transactions are processing normally.
              </p>
            </div>
            <Button variant="outline" size="sm" className="rounded-2xl">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
