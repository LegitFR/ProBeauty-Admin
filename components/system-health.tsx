"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import {
  Shield,
  Server,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Cpu,
  HardDrive,
  Wifi,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Settings,
  Monitor,
  Zap,
  Globe,
  Lock,
  Eye,
  Bell,
  BarChart3,
  Gauge,
} from "lucide-react";

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
  threshold: { warning: number; critical: number };
  trend: "up" | "down" | "stable";
  lastUpdate: string;
}

interface ServiceStatus {
  id: string;
  name: string;
  status: "online" | "offline" | "maintenance" | "degraded";
  uptime: number;
  responseTime: number;
  lastCheck: string;
  endpoint: string;
  description: string;
}

interface SecurityEvent {
  id: string;
  type:
    | "login_attempt"
    | "access_denied"
    | "suspicious_activity"
    | "breach_attempt";
  severity: "low" | "medium" | "high" | "critical";
  source: string;
  description: string;
  timestamp: string;
  status: "active" | "resolved" | "investigating";
}

interface PerformanceLog {
  id: string;
  timestamp: string;
  endpoint: string;
  responseTime: number;
  statusCode: number;
  errorMessage?: string;
}

export function SystemHealth() {
  const [activeTab, setActiveTab] = useState("overview");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const [metrics] = useState<SystemMetric[]>([
    {
      id: "cpu",
      name: "CPU Usage",
      value: 68,
      unit: "%",
      status: "warning",
      threshold: { warning: 70, critical: 90 },
      trend: "up",
      lastUpdate: "2 minutes ago",
    },
    {
      id: "memory",
      name: "Memory Usage",
      value: 45,
      unit: "%",
      status: "healthy",
      threshold: { warning: 80, critical: 95 },
      trend: "stable",
      lastUpdate: "2 minutes ago",
    },
    {
      id: "disk",
      name: "Disk Usage",
      value: 82,
      unit: "%",
      status: "warning",
      threshold: { warning: 80, critical: 95 },
      trend: "up",
      lastUpdate: "2 minutes ago",
    },
    {
      id: "network",
      name: "Network I/O",
      value: 234,
      unit: "MB/s",
      status: "healthy",
      threshold: { warning: 500, critical: 800 },
      trend: "down",
      lastUpdate: "2 minutes ago",
    },
  ]);

  const [services] = useState<ServiceStatus[]>([
    {
      id: "api",
      name: "Main API",
      status: "online",
      uptime: 99.97,
      responseTime: 145,
      lastCheck: "30 seconds ago",
      endpoint: "https://api.probeauty.com",
      description: "Core application API serving client requests",
    },
    {
      id: "database",
      name: "Primary Database",
      status: "online",
      uptime: 99.99,
      responseTime: 23,
      lastCheck: "30 seconds ago",
      endpoint: "PostgreSQL Cluster",
      description: "Main database cluster with customer and booking data",
    },
    {
      id: "redis",
      name: "Cache Service",
      status: "online",
      uptime: 99.95,
      responseTime: 5,
      lastCheck: "30 seconds ago",
      endpoint: "Redis Cluster",
      description: "Caching layer for improved performance",
    },
    {
      id: "payment",
      name: "Payment Gateway",
      status: "degraded",
      uptime: 98.45,
      responseTime: 892,
      lastCheck: "1 minute ago",
      endpoint: "https://payments.probeauty.com",
      description: "Payment processing service with slight delays",
    },
    {
      id: "storage",
      name: "File Storage",
      status: "online",
      uptime: 99.98,
      responseTime: 67,
      lastCheck: "30 seconds ago",
      endpoint: "AWS S3 Bucket",
      description: "Customer images and document storage",
    },
    {
      id: "email",
      name: "Email Service",
      status: "maintenance",
      uptime: 99.12,
      responseTime: 0,
      lastCheck: "5 minutes ago",
      endpoint: "SMTP Gateway",
      description: "Currently under scheduled maintenance",
    },
  ]);

  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: "SEC-001",
      type: "suspicious_activity",
      severity: "high",
      source: "192.168.1.45",
      description: "Multiple failed login attempts from unknown IP address",
      timestamp: "2 minutes ago",
      status: "investigating",
    },
    {
      id: "SEC-002",
      type: "access_denied",
      severity: "medium",
      source: "admin@probeauty.com",
      description:
        "Access denied to financial reports from restricted location",
      timestamp: "15 minutes ago",
      status: "resolved",
    },
    {
      id: "SEC-003",
      type: "login_attempt",
      severity: "low",
      source: "employee@probeauty.com",
      description: "Successful login from new device - verification required",
      timestamp: "1 hour ago",
      status: "active",
    },
    {
      id: "SEC-004",
      type: "breach_attempt",
      severity: "critical",
      source: "Unknown",
      description: "Potential SQL injection attempt detected and blocked",
      timestamp: "3 hours ago",
      status: "resolved",
    },
  ]);

  const [performanceLogs] = useState<PerformanceLog[]>([
    {
      id: "LOG-001",
      timestamp: "2024-12-07 14:23:15",
      endpoint: "/api/bookings",
      responseTime: 145,
      statusCode: 200,
    },
    {
      id: "LOG-002",
      timestamp: "2024-12-07 14:22:58",
      endpoint: "/api/customers",
      responseTime: 89,
      statusCode: 200,
    },
    {
      id: "LOG-003",
      timestamp: "2024-12-07 14:22:45",
      endpoint: "/api/payments",
      responseTime: 892,
      statusCode: 200,
    },
    {
      id: "LOG-004",
      timestamp: "2024-12-07 14:22:30",
      endpoint: "/api/auth/login",
      responseTime: 234,
      statusCode: 401,
      errorMessage: "Invalid credentials",
    },
    {
      id: "LOG-005",
      timestamp: "2024-12-07 14:22:12",
      endpoint: "/api/salons",
      responseTime: 67,
      statusCode: 200,
    },
  ]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastRefresh(new Date());
      }, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "online":
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
      case "degraded":
      case "investigating":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "critical":
      case "offline":
      case "active":
        return "bg-red-100 text-red-800 border-red-200";
      case "maintenance":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "online":
      case "resolved":
        return CheckCircle;
      case "warning":
      case "degraded":
      case "investigating":
        return AlertTriangle;
      case "critical":
      case "offline":
      case "active":
        return XCircle;
      case "maintenance":
        return Settings;
      default:
        return Activity;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return TrendingUp;
      case "down":
        return TrendingDown;
      default:
        return Activity;
    }
  };

  const healthyServices = services.filter((s) => s.status === "online").length;
  const totalServices = services.length;
  const systemUptime = 99.87;
  const activeIncidents = securityEvents.filter(
    (e) => e.status === "active" || e.status === "investigating"
  ).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            System Health Monitor
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time system monitoring, performance metrics, and security
            alerts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Last update: {lastRefresh.toLocaleTimeString()}
          </div>
          <Button variant="outline" className="rounded-2xl">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button
            onClick={() => setLastRefresh(new Date())}
            className="bg-primary hover:bg-primary/90 rounded-2xl"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold">{systemUptime}%</p>
                <p className="text-xs text-green-600">30 days average</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Server className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Services Online</p>
                <p className="text-2xl font-bold">
                  {healthyServices}/{totalServices}
                </p>
                <p className="text-xs text-blue-600">Core services running</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Active Incidents
                </p>
                <p className="text-2xl font-bold">{activeIncidents}</p>
                <p className="text-xs text-orange-600">Require attention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg Response Time
                </p>
                <p className="text-2xl font-bold">145ms</p>
                <p className="text-xs text-green-600">-12ms from yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5 rounded-2xl">
          <TabsTrigger value="overview" className="rounded-xl">
            <Monitor className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="services" className="rounded-xl">
            <Server className="h-4 w-4 mr-2" />
            Services
          </TabsTrigger>
          <TabsTrigger value="metrics" className="rounded-xl">
            <Gauge className="h-4 w-4 mr-2" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="logs" className="rounded-xl">
            <BarChart3 className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Auto Refresh Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Monitor Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto Refresh</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh data every {refreshInterval} seconds
                  </p>
                </div>
                <Switch
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Metrics Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics.map((metric) => {
                  const TrendIcon = getTrendIcon(metric.trend);
                  return (
                    <div key={metric.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{metric.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(metric.status)}>
                            {metric.status}
                          </Badge>
                          <TrendIcon
                            className={`h-4 w-4 ${
                              metric.trend === "up"
                                ? "text-orange-600"
                                : metric.trend === "down"
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>
                            {metric.value}
                            {metric.unit}
                          </span>
                          <span className="text-muted-foreground">
                            {metric.lastUpdate}
                          </span>
                        </div>
                        <Progress
                          value={metric.value}
                          className={`h-2 ${
                            metric.status === "critical"
                              ? "[&>div]:bg-red-500"
                              : metric.status === "warning"
                              ? "[&>div]:bg-yellow-500"
                              : "[&>div]:bg-green-500"
                          }`}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            Warning: {metric.threshold.warning}
                            {metric.unit}
                          </span>
                          <span>
                            Critical: {metric.threshold.critical}
                            {metric.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {securityEvents.slice(0, 5).map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl"
                      >
                        <div
                          className={`p-1 rounded-full ${getSeverityColor(
                            event.severity
                          )
                            .replace("text-", "text-")
                            .replace("bg-", "bg-")}`}
                        >
                          <Lock className="h-3 w-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              className={`text-xs ${getSeverityColor(
                                event.severity
                              )}`}
                            >
                              {event.severity}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getStatusColor(
                                event.status
                              )}`}
                            >
                              {event.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium line-clamp-2">
                            {event.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {event.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Status Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 p-6">
                {services.map((service, index) => {
                  const StatusIcon = getStatusIcon(service.status);
                  return (
                    <div key={service.id}>
                      <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                        <div
                          className={`p-2 rounded-xl ${getStatusColor(
                            service.status
                          )
                            .replace("text-", "text-")
                            .replace("bg-", "bg-")}`}
                        >
                          <StatusIcon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-medium">{service.name}</h4>
                                <Badge
                                  className={`text-xs rounded-full ${getStatusColor(
                                    service.status
                                  )}`}
                                >
                                  {service.status}
                                </Badge>
                              </div>

                              <p className="text-sm text-muted-foreground mb-3">
                                {service.description}
                              </p>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">
                                    Uptime
                                  </p>
                                  <p className="font-medium">
                                    {service.uptime}%
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Response Time
                                  </p>
                                  <p className="font-medium">
                                    {service.responseTime}ms
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Endpoint
                                  </p>
                                  <p className="font-medium truncate">
                                    {service.endpoint}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Last Check
                                  </p>
                                  <p className="font-medium">
                                    {service.lastCheck}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl"
                              >
                                <Settings className="h-4 w-4 mr-1" />
                                Config
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < services.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {metrics.map((metric) => {
              const TrendIcon = getTrendIcon(metric.trend);
              return (
                <Card key={metric.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {metric.name === "CPU Usage" && (
                        <Cpu className="h-5 w-5" />
                      )}
                      {metric.name === "Memory Usage" && (
                        <HardDrive className="h-5 w-5" />
                      )}
                      {metric.name === "Disk Usage" && (
                        <Database className="h-5 w-5" />
                      )}
                      {metric.name === "Network I/O" && (
                        <Wifi className="h-5 w-5" />
                      )}
                      {metric.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-3xl font-bold">
                          {metric.value}
                          {metric.unit}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(metric.status)}>
                            {metric.status}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <TrendIcon
                              className={`h-4 w-4 ${
                                metric.trend === "up"
                                  ? "text-orange-600"
                                  : metric.trend === "down"
                                  ? "text-green-600"
                                  : "text-muted-foreground"
                              }`}
                            />
                            <span>{metric.trend}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Progress
                        value={metric.value}
                        className={`h-3 ${
                          metric.status === "critical"
                            ? "[&>div]:bg-red-500"
                            : metric.status === "warning"
                            ? "[&>div]:bg-yellow-500"
                            : "[&>div]:bg-green-500"
                        }`}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>0{metric.unit}</span>
                        <span>100{metric.unit}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">
                          Warning Threshold
                        </p>
                        <p className="font-medium">
                          {metric.threshold.warning}
                          {metric.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Critical Threshold
                        </p>
                        <p className="font-medium">
                          {metric.threshold.critical}
                          {metric.unit}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Last updated: {metric.lastUpdate}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Events ({securityEvents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-1 p-6">
                  {securityEvents.map((event, index) => (
                    <div key={event.id}>
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                        <div
                          className={`p-2 rounded-xl ${getSeverityColor(
                            event.severity
                          )
                            .replace("text-", "text-")
                            .replace("bg-", "bg-")}`}
                        >
                          <Lock className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium">{event.id}</h4>
                                <Badge
                                  className={`text-xs rounded-full ${getSeverityColor(
                                    event.severity
                                  )}`}
                                >
                                  {event.severity}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs rounded-full ${getStatusColor(
                                    event.status
                                  )}`}
                                >
                                  {event.status}
                                </Badge>
                              </div>

                              <p className="text-sm mb-3">
                                {event.description}
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  Source: {event.source}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {event.timestamp}
                                </div>
                                <div className="flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Type: {event.type.replace("_", " ")}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < securityEvents.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-1 p-6">
                  {performanceLogs.map((log, index) => (
                    <div key={log.id}>
                      <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <div
                          className={`p-2 rounded-xl ${
                            log.statusCode >= 400
                              ? "bg-red-100 text-red-600"
                              : log.responseTime > 500
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          <Activity className="h-4 w-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Timestamp</p>
                              <p className="font-medium">{log.timestamp}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Endpoint</p>
                              <p className="font-medium">{log.endpoint}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">
                                Response Time
                              </p>
                              <p
                                className={`font-medium ${
                                  log.responseTime > 500
                                    ? "text-yellow-600"
                                    : "text-green-600"
                                }`}
                              >
                                {log.responseTime}ms
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Status</p>
                              <Badge
                                className={`text-xs ${
                                  log.statusCode >= 400
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {log.statusCode}
                              </Badge>
                            </div>
                            <div>
                              {log.errorMessage && (
                                <>
                                  <p className="text-muted-foreground">Error</p>
                                  <p className="font-medium text-red-600 truncate">
                                    {log.errorMessage}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < performanceLogs.length - 1 && (
                        <Separator className="my-1" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
