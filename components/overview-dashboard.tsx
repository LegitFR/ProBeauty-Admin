"use client";

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

const kpiData = [
  {
    title: "Total Revenue",
    value: "$2,847,592",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    period: "vs last month",
  },
  {
    title: "Total Bookings",
    value: "18,247",
    change: "+8.2%",
    trend: "up",
    icon: Calendar,
    period: "vs last month",
  },
  {
    title: "Active Customers",
    value: "94,832",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    period: "vs last month",
  },
  {
    title: "Partner Salons",
    value: "1,247",
    change: "+3.1%",
    trend: "up",
    icon: Building2,
    period: "vs last month",
  },
];

const revenueData = [
  { month: "Jan", revenue: 2100000, bookings: 15200 },
  { month: "Feb", revenue: 2300000, bookings: 16800 },
  { month: "Mar", revenue: 2150000, bookings: 15900 },
  { month: "Apr", revenue: 2450000, bookings: 17200 },
  { month: "May", revenue: 2650000, bookings: 18100 },
  { month: "Jun", revenue: 2847592, bookings: 18247 },
];

const topServices = [
  { name: "Hair Cut & Style", value: 32, color: "#FF6A00" },
  { name: "Hair Coloring", value: 28, color: "#E55A00" },
  { name: "Manicure & Pedicure", value: 22, color: "#FFA366" },
  { name: "Facial Treatment", value: 18, color: "#FFB380" },
];

const recentActivities = [
  {
    id: 1,
    type: "booking",
    description: "New booking created at Glamour Studio",
    time: "2 minutes ago",
    status: "pending",
    amount: "$125",
  },
  {
    id: 2,
    type: "payment",
    description: "Payment processed for Sarah Johnson",
    time: "5 minutes ago",
    status: "completed",
    amount: "$89",
  },
  {
    id: 3,
    type: "salon",
    description: "Beauty Haven salon went live",
    time: "15 minutes ago",
    status: "active",
    amount: null,
  },
  {
    id: 4,
    type: "review",
    description: "5-star review received from customer",
    time: "30 minutes ago",
    status: "positive",
    amount: null,
  },
];

export function OverviewDashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your beauty platform.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl">
            Export Report
          </Button>
          <Button className="bg-primary hover:bg-primary/90 rounded-2xl">
            Add New Salon
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <kpi.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.title}</p>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`flex items-center gap-1 ${
                      kpi.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {kpi.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">{kpi.change}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{kpi.period}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center justify-between">
              <span>Revenue Trend</span>
              <Badge variant="secondary" className="rounded-full">
                6 months
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `$${((value as number) / 1000000).toFixed(1)}M`,
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
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Top Services</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topServices}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {topServices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: service.color }}
                    />
                    <span className="text-sm">{service.name}</span>
                  </div>
                  <span className="text-sm font-medium">{service.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>Recent Activity</span>
            <Button variant="outline" size="sm" className="rounded-2xl">
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      activity.type === "booking"
                        ? "bg-blue-100 text-blue-600"
                        : activity.type === "payment"
                        ? "bg-green-100 text-green-600"
                        : activity.type === "salon"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {activity.type === "booking" && (
                      <Calendar className="h-4 w-4" />
                    )}
                    {activity.type === "payment" && (
                      <DollarSign className="h-4 w-4" />
                    )}
                    {activity.type === "salon" && (
                      <Building2 className="h-4 w-4" />
                    )}
                    {activity.type === "review" && <Star className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {activity.amount && (
                    <p className="font-medium text-green-600">
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
                    className="rounded-full"
                  >
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
