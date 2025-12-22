"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Zap,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
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
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
} from "recharts";

const customerBehaviorData = [
  { month: "Jan", retention: 85, churn: 15, newCustomers: 120 },
  { month: "Feb", retention: 87, churn: 13, newCustomers: 145 },
  { month: "Mar", retention: 89, churn: 11, newCustomers: 167 },
  { month: "Apr", retention: 91, churn: 9, newCustomers: 189 },
  { month: "May", retention: 93, churn: 7, newCustomers: 210 },
  { month: "Jun", retention: 95, churn: 5, newCustomers: 234 },
];

const revenueForecasting = [
  { month: "Jul", predicted: 320000, actual: 315000, confidence: 92 },
  { month: "Aug", predicted: 345000, actual: null, confidence: 89 },
  { month: "Sep", predicted: 365000, actual: null, confidence: 87 },
  { month: "Oct", predicted: 390000, actual: null, confidence: 85 },
  { month: "Nov", predicted: 420000, actual: null, confidence: 83 },
  { month: "Dec", predicted: 450000, actual: null, confidence: 81 },
];

const serviceRecommendations = [
  {
    service: "Hair Coloring",
    predictedDemand: 78,
    currentCapacity: 65,
    recommendation: "Increase capacity by 20%",
    impact: "high",
    revenue: "+$45K",
  },
  {
    service: "Facial Treatments",
    predictedDemand: 62,
    currentCapacity: 70,
    recommendation: "Optimize scheduling",
    impact: "medium",
    revenue: "+$12K",
  },
  {
    service: "Manicure/Pedicure",
    predictedDemand: 85,
    currentCapacity: 55,
    recommendation: "Add 3 stations",
    impact: "high",
    revenue: "+$32K",
  },
  {
    service: "Eyebrow Services",
    predictedDemand: 45,
    currentCapacity: 40,
    recommendation: "Maintain current",
    impact: "low",
    revenue: "+$3K",
  },
];

const churnPrediction = [
  { segment: "High Value", risk: 15, count: 234, revenue: 125000 },
  { segment: "Regular", risk: 25, count: 567, revenue: 89000 },
  { segment: "New Customers", risk: 35, count: 123, revenue: 23000 },
  { segment: "Inactive", risk: 78, count: 89, revenue: 12000 },
];

const mlInsights = [
  {
    type: "trend",
    title: "Weekend Booking Surge Predicted",
    description:
      "ML models predict 25% increase in weekend bookings for hair services",
    confidence: 94,
    impact: "Revenue +$15K this weekend",
    action: "Increase weekend staff by 2-3 stylists",
  },
  {
    type: "optimization",
    title: "Peak Hour Optimization",
    description:
      "AI suggests shifting 15% of appointments from 2-4 PM to improve flow",
    confidence: 87,
    impact: "Reduce wait time by 18 minutes",
    action: "Implement dynamic pricing for peak hours",
  },
  {
    type: "retention",
    title: "Customer Retention Alert",
    description: "147 high-value customers showing early churn signals",
    confidence: 91,
    impact: "Potential revenue loss: $89K",
    action: "Launch targeted retention campaign",
  },
];

export function AIAnalytics() {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            AI Analytics & Insights
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Machine learning powered insights for business optimization
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button variant="outline" className="rounded-2xl">
            <Zap className="h-4 w-4 mr-2" />
            Train Models
          </Button>
          <Button className="bg-primary hover:bg-primary/90 rounded-2xl">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* AI Insights Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mlInsights.map((insight, index) => (
          <Card key={index} className="p-6 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="rounded-full">
                {insight.confidence}% confidence
              </Badge>
            </div>
            <CardContent className="p-0">
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`p-2 rounded-xl ${
                    insight.type === "trend"
                      ? "bg-blue-100 text-blue-600"
                      : insight.type === "optimization"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {insight.type === "trend" && (
                    <TrendingUp className="h-5 w-5" />
                  )}
                  {insight.type === "optimization" && (
                    <Target className="h-5 w-5" />
                  )}
                  {insight.type === "retention" && (
                    <AlertTriangle className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {insight.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{insight.impact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">
                        {insight.action}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full rounded-2xl"
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Behavior Prediction */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Customer Behavior Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={customerBehaviorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="retention"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Retention Rate (%)"
                />
                <Line
                  type="monotone"
                  dataKey="churn"
                  stroke="#EF4444"
                  strokeWidth={3}
                  name="Churn Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">95%</p>
                <p className="text-sm text-muted-foreground">
                  Predicted Retention
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">5%</p>
                <p className="text-sm text-muted-foreground">Predicted Churn</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Forecasting */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Revenue Forecasting
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueForecasting}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `$${((value as number) / 1000).toFixed(0)}K`,
                    name === "predicted"
                      ? "Predicted Revenue"
                      : "Actual Revenue",
                  ]}
                />
                <Bar dataKey="predicted" fill="#FF6A00" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="#E55A00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  6-Month Forecast
                </p>
                <p className="text-2xl font-bold">$2.29M</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-bold text-green-600">89%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Recommendations */}
      <Card className="p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            AI Service Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-4">
            {serviceRecommendations.map((service, index) => (
              <div key={index} className="border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{service.service}</h4>
                    <p className="text-sm text-muted-foreground">
                      {service.recommendation}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        service.impact === "high"
                          ? "default"
                          : service.impact === "medium"
                          ? "secondary"
                          : "outline"
                      }
                      className="rounded-full mb-1"
                    >
                      {service.impact} impact
                    </Badge>
                    <p className="text-sm font-medium text-green-600">
                      {service.revenue}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Predicted Demand</span>
                    <span>{service.predictedDemand}%</span>
                  </div>
                  <Progress value={service.predictedDemand} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Current Capacity</span>
                    <span>{service.currentCapacity}%</span>
                  </div>
                  <Progress
                    value={service.currentCapacity}
                    className="h-2 [&>div]:bg-muted-foreground"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Churn Prediction */}
      <Card className="p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Customer Churn Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {churnPrediction.map((segment, index) => (
              <div key={index} className="border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{segment.segment}</h4>
                  <Badge
                    variant={
                      segment.risk > 50
                        ? "destructive"
                        : segment.risk > 25
                        ? "secondary"
                        : "default"
                    }
                    className="rounded-full"
                  >
                    {segment.risk}% risk
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Customers</span>
                    <span className="font-medium">{segment.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Revenue</span>
                    <span className="font-medium">
                      ${(segment.revenue / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <Progress
                    value={segment.risk}
                    className={`h-2 ${
                      segment.risk > 50
                        ? "[&>div]:bg-red-500"
                        : segment.risk > 25
                        ? "[&>div]:bg-yellow-500"
                        : "[&>div]:bg-green-500"
                    }`}
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-3 rounded-2xl"
                >
                  {segment.risk > 50 ? "Urgent Action" : "Monitor"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Model Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Revenue Prediction</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">94.2%</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <Progress value={94.2} className="h-2" />

              <div className="flex items-center justify-between">
                <span className="text-sm">Churn Detection</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">91.7%</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <Progress value={91.7} className="h-2" />

              <div className="flex items-center justify-between">
                <span className="text-sm">Demand Forecasting</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">87.4%</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <Progress value={87.4} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Data Quality Score</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-green-600 mb-2">A+</div>
              <p className="text-muted-foreground">
                Excellent data quality for ML training
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Data Completeness</span>
                <span className="text-sm font-medium">98.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Data Accuracy</span>
                <span className="text-sm font-medium">97.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Data Freshness</span>
                <span className="text-sm font-medium">Real-time</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
