"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  FileText,
  Download,
  Calendar as CalendarIcon,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Star,
  Clock,
  Target,
  Bookmark,
  Share,
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
  AreaChart,
  Area,
} from "recharts";
// Removed date-fns import - using built-in date formatting

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  lastGenerated: string;
  frequency: string;
  format: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "1",
    name: "Revenue Performance",
    description:
      "Comprehensive revenue analysis across all salons and services",
    category: "Financial",
    lastGenerated: "2024-01-15",
    frequency: "Weekly",
    format: ["PDF", "Excel", "CSV"],
    icon: DollarSign,
  },
  {
    id: "2",
    name: "Salon Performance",
    description:
      "Individual salon metrics, bookings, and customer satisfaction",
    category: "Operations",
    lastGenerated: "2024-01-14",
    frequency: "Monthly",
    format: ["PDF", "PowerPoint"],
    icon: Building2,
  },
  {
    id: "3",
    name: "Customer Analytics",
    description: "Customer behavior, retention, and lifetime value analysis",
    category: "Customer",
    lastGenerated: "2024-01-13",
    frequency: "Bi-weekly",
    format: ["PDF", "Excel"],
    icon: Users,
  },
  {
    id: "4",
    name: "Booking Trends",
    description: "Booking patterns, peak times, and service demand analysis",
    category: "Operations",
    lastGenerated: "2024-01-12",
    frequency: "Weekly",
    format: ["PDF", "Excel", "CSV"],
    icon: BarChart3,
  },
  {
    id: "5",
    name: "Quality & Reviews",
    description: "Service quality metrics and customer review analysis",
    category: "Quality",
    lastGenerated: "2024-01-11",
    frequency: "Monthly",
    format: ["PDF"],
    icon: Star,
  },
  {
    id: "6",
    name: "Operational Efficiency",
    description:
      "Staff utilization, appointment efficiency, and resource optimization",
    category: "Operations",
    lastGenerated: "2024-01-10",
    frequency: "Weekly",
    format: ["PDF", "Excel"],
    icon: Target,
  },
];

const performanceMetrics = [
  { metric: "Total Revenue", value: "$2.8M", change: "+12.5%", trend: "up" },
  { metric: "Active Salons", value: "1,247", change: "+3.2%", trend: "up" },
  {
    metric: "Customer Satisfaction",
    value: "4.8/5",
    change: "+0.2",
    trend: "up",
  },
  {
    metric: "Booking Completion",
    value: "94.2%",
    change: "+1.8%",
    trend: "up",
  },
];

const benchmarkData = [
  {
    salon: "Glamour Studio",
    revenue: 125400,
    bookings: 1247,
    rating: 4.8,
    efficiency: 94,
  },
  {
    salon: "Beauty Haven",
    revenue: 189400,
    bookings: 1891,
    rating: 4.9,
    efficiency: 96,
  },
  {
    salon: "Elegant Touch",
    revenue: 87600,
    bookings: 876,
    rating: 4.6,
    efficiency: 89,
  },
  {
    salon: "Style & Grace",
    revenue: 103400,
    bookings: 1034,
    rating: 4.7,
    efficiency: 92,
  },
  {
    salon: "Urban Chic",
    revenue: 45200,
    bookings: 567,
    rating: 4.2,
    efficiency: 78,
  },
];

const trendData = [
  { month: "Jan", revenue: 2100000, customers: 15200, satisfaction: 4.6 },
  { month: "Feb", revenue: 2300000, customers: 16800, satisfaction: 4.7 },
  { month: "Mar", revenue: 2150000, customers: 15900, satisfaction: 4.6 },
  { month: "Apr", revenue: 2450000, customers: 17200, satisfaction: 4.8 },
  { month: "May", revenue: 2650000, customers: 18100, satisfaction: 4.8 },
  { month: "Jun", revenue: 2847592, customers: 18247, satisfaction: 4.8 },
];

export function ReportsAnalytics() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  const filteredReports = reportTemplates.filter(
    (report) =>
      selectedCategory === "all" ||
      report.category.toLowerCase() === selectedCategory
  );

  const categories = ["all", "financial", "operations", "customer", "quality"];

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            Reports & Analytics
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Comprehensive reporting and business intelligence dashboard
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="outline" className="rounded-2xl w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button className="bg-primary hover:bg-primary/90 rounded-2xl w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="p-3 sm:p-4 lg:p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {metric.metric}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {metric.value}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm font-medium">
                    {metric.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Report Builder */}
      <Card className="p-3 sm:p-4 lg:p-6">
        <CardHeader className="p-0 pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Custom Report Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                <SelectValue placeholder="Select Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="bookings">Bookings</SelectItem>
                <SelectItem value="customers">Customers</SelectItem>
                <SelectItem value="satisfaction">Satisfaction</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start h-9 sm:h-10 text-xs sm:text-sm"
                >
                  <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">
                    {dateRange ? dateRange.toLocaleDateString() : "Pick a date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateRange}
                  onSelect={setDateRange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Select defaultValue="salon">
              <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                <SelectValue placeholder="Dimension" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salon">By Salon</SelectItem>
                <SelectItem value="service">By Service</SelectItem>
                <SelectItem value="location">By Location</SelectItem>
                <SelectItem value="time">By Time</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-primary hover:bg-primary/90 rounded-2xl h-9 sm:h-10 text-xs sm:text-sm">
              Generate Report
            </Button>
          </div>

          <div className="bg-muted/30 rounded-2xl p-2 sm:p-3 lg:p-4">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue"
                      ? `$${((value as number) / 1000000).toFixed(1)}M`
                      : value,
                    name === "revenue"
                      ? "Revenue"
                      : name === "customers"
                      ? "Customers"
                      : "Satisfaction",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey={
                    selectedMetric === "revenue"
                      ? "revenue"
                      : selectedMetric === "customers"
                      ? "customers"
                      : "satisfaction"
                  }
                  stroke="#FF6A00"
                  fill="#FF6A00"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card className="p-3 sm:p-4 lg:p-6">
        <CardHeader className="p-0 pb-3 sm:pb-4">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-base sm:text-lg">Report Templates</span>
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-1 px-1">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-2xl capitalize text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 whitespace-nowrap flex-shrink-0"
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredReports.map((report) => (
              <Card
                key={report.id}
                className="p-3 sm:p-4 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-xl flex-shrink-0">
                      <report.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 text-sm sm:text-base truncate">
                        {report.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">
                        {report.description}
                      </p>
                      <div className="flex gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
                        <Badge
                          variant="secondary"
                          className="rounded-full text-[10px] sm:text-xs"
                        >
                          {report.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="rounded-full text-[10px] sm:text-xs"
                        >
                          {report.frequency}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm mb-2 sm:mb-3">
                    <span className="text-muted-foreground">
                      Last generated:
                    </span>
                    <span className="font-medium">{report.lastGenerated}</span>
                  </div>

                  <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                    {report.format.map((format) => (
                      <Button
                        key={format}
                        size="sm"
                        variant="outline"
                        className="rounded-2xl text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        {format}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Benchmarking */}
      <Card className="p-3 sm:p-4 lg:p-6">
        <CardHeader className="p-0 pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Performance Benchmarking
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                Revenue vs Efficiency
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={benchmarkData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="salon"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "revenue"
                        ? `$${((value as number) / 1000).toFixed(0)}K`
                        : `${value}%`,
                      name === "revenue" ? "Revenue" : "Efficiency",
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#FF6A00" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                Top Performing Salons
              </h4>
              <div className="space-y-2 sm:space-y-3">
                {[...benchmarkData]
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 5)
                  .map((salon, index) => (
                    <div
                      key={salon.salon}
                      className="flex items-center justify-between p-2 sm:p-3 bg-muted/30 rounded-2xl gap-2"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0 ${
                            index === 0
                              ? "bg-yellow-100 text-yellow-600"
                              : index === 1
                              ? "bg-gray-100 text-gray-600"
                              : index === 2
                              ? "bg-orange-100 text-orange-600"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base truncate">
                            {salon.salon}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {salon.bookings} bookings • {salon.rating}★
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-sm sm:text-base">
                          ${(salon.revenue / 1000).toFixed(0)}K
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                          {salon.efficiency}% eff
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <Card className="p-4 sm:p-6">
          <CardContent className="p-0 text-center">
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2 sm:mb-3" />
            <h3 className="font-semibold mb-2 text-sm sm:text-base">
              Scheduled Reports
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Manage automated report generation and delivery
            </p>
            <Button
              variant="outline"
              className="rounded-2xl text-xs sm:text-sm h-8 sm:h-10"
            >
              Manage Schedule
            </Button>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0 text-center">
            <Bookmark className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2 sm:mb-3" />
            <h3 className="font-semibold mb-2 text-sm sm:text-base">
              Saved Reports
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Access your saved custom reports and analysis
            </p>
            <Button
              variant="outline"
              className="rounded-2xl text-xs sm:text-sm h-8 sm:h-10"
            >
              View Saved
            </Button>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardContent className="p-0 text-center">
            <Share className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2 sm:mb-3" />
            <h3 className="font-semibold mb-2 text-sm sm:text-base">
              Share & Collaborate
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Share reports with team members and stakeholders
            </p>
            <Button
              variant="outline"
              className="rounded-2xl text-xs sm:text-sm h-8 sm:h-10"
            >
              Share Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
