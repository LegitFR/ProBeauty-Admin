"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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

interface Transaction {
  id: string;
  customer: string;
  salon: string;
  amount: number;
  fee: number;
  method: "card" | "paypal" | "apple_pay" | "google_pay";
  status: "completed" | "pending" | "failed";
  date: string;
  time: string;
  service: string;
}

const transactionsData: Transaction[] = [
  {
    id: "TXN001",
    customer: "Sarah Johnson",
    salon: "Glamour Studio",
    amount: 125.0,
    fee: 3.75,
    method: "card",
    status: "completed",
    date: "2024-01-15",
    time: "14:30",
    service: "Hair Cut & Color",
  },
  {
    id: "TXN002",
    customer: "Emily Davis",
    salon: "Beauty Haven",
    amount: 89.5,
    fee: 2.69,
    method: "apple_pay",
    status: "completed",
    date: "2024-01-15",
    time: "13:45",
    service: "Facial Treatment",
  },
  {
    id: "TXN003",
    customer: "Michael Brown",
    salon: "Style & Grace",
    amount: 65.0,
    fee: 1.95,
    method: "google_pay",
    status: "pending",
    date: "2024-01-15",
    time: "12:20",
    service: "Haircut",
  },
  {
    id: "TXN004",
    customer: "Jessica Wilson",
    salon: "Elegant Touch",
    amount: 150.0,
    fee: 4.5,
    method: "card",
    status: "failed",
    date: "2024-01-15",
    time: "11:15",
    service: "Manicure & Pedicure",
  },
  {
    id: "TXN005",
    customer: "David Martinez",
    salon: "Urban Chic",
    amount: 95.75,
    fee: 2.87,
    method: "paypal",
    status: "completed",
    date: "2024-01-15",
    time: "10:30",
    service: "Beard Trim",
  },
];

const revenueData = [
  { day: "Mon", revenue: 12500, transactions: 45 },
  { day: "Tue", revenue: 15200, transactions: 52 },
  { day: "Wed", revenue: 14800, transactions: 48 },
  { day: "Thu", revenue: 16900, transactions: 61 },
  { day: "Fri", revenue: 18400, transactions: 67 },
  { day: "Sat", revenue: 22100, transactions: 78 },
  { day: "Sun", revenue: 19200, transactions: 69 },
];

const paymentMethods = [
  { name: "Credit Card", value: 45, color: "#FF6A00", count: 234 },
  { name: "Apple Pay", value: 25, color: "#E55A00", count: 128 },
  { name: "Google Pay", value: 20, color: "#FFA366", count: 102 },
  { name: "PayPal", value: 10, color: "#FFB380", count: 56 },
];

export function PaymentsFinance() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [statusFilter, setStatusFilter] = useState("all");

  const totalRevenue = transactionsData
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFees = transactionsData
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.fee, 0);

  const pendingAmount = transactionsData
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const failedCount = transactionsData.filter(
    (t) => t.status === "failed"
  ).length;

  const filteredTransactions = transactionsData.filter((transaction) => {
    if (statusFilter === "all") return true;
    return transaction.status === statusFilter;
  });

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "apple_pay":
        return <Smartphone className="h-4 w-4" />;
      case "google_pay":
        return <Smartphone className="h-4 w-4" />;
      case "paypal":
        return <Banknote className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

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
                    ${totalRevenue.toFixed(2)}
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
                    Processing Fees
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">
                    ${totalFees.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-blue-600 flex items-center gap-1">
                <span className="text-sm">2.5% avg</span>
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
                  <p className="text-xl sm:text-2xl font-bold">
                    ${pendingAmount.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-yellow-600 flex items-center gap-1">
                <span className="text-sm">1 pending</span>
              </div>
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
                  <p className="text-2xl font-bold">{failedCount}</p>
                </div>
              </div>
              <div className="text-red-600 flex items-center gap-1">
                <ArrowDownRight className="h-4 w-4" />
                <span className="text-sm">-2.1%</span>
              </div>
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
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue" ? `$${value}` : value,
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
            <CardTitle>Payment Methods</CardTitle>
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

      {/* Transaction Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex gap-3 flex-1">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-2xl">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Real-time updates
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Salon</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">
                      {transaction.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {transaction.customer
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {transaction.customer}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.salon}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {transaction.service}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">
                        ${transaction.amount.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        ${transaction.fee.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMethodIcon(transaction.method)}
                        <span className="capitalize">
                          {transaction.method.replace("_", " ")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`rounded-full ${getStatusColor(
                          transaction.status
                        )}`}
                        variant="secondary"
                      >
                        {transaction.status === "completed" && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {transaction.status === "pending" && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {transaction.status === "failed" && (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{transaction.date}</div>
                        <div className="text-muted-foreground">
                          {transaction.time}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
