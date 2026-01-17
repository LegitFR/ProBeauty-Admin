/**
 * Analytics API Type Definitions
 * Types for salon and platform-wide analytics data
 */

// ==================== Salon Analytics Types ====================

export interface SalonAnalyticsSummary {
  totalRevenue: string;
  totalTransactions: number;
  netProfit: string;
  adminCommission: string;
  averageTransactionValue: string;
  uniqueCustomers: number;
}

export interface CategoryBreakdown {
  category: string | null;
  revenue: string;
  count: number;
  percentage: number;
}

export interface RevenueByType {
  total: string;
  byCategory: CategoryBreakdown[];
}

export interface TimeRange {
  startDate: string | null;
  endDate: string | null;
}

export interface SalonAnalyticsData {
  summary: SalonAnalyticsSummary;
  productRevenue: RevenueByType;
  serviceRevenue: RevenueByType;
  timeRange: TimeRange;
}

export interface SalonAnalyticsResponse {
  message: string;
  data: SalonAnalyticsData;
}

// ==================== Admin Analytics Types ====================

export interface AdminAnalyticsSummary {
  totalRevenue: string;
  productRevenue: string;
  serviceRevenue: string;
  totalTransactions: number;
  adminProfit: string;
  uniqueCustomers: number;
  totalSalons: number;
  averageRevenuePerSalon: string;
}

export interface RevenueTrendData {
  period: string; // ISO 8601 date
  revenue: string;
  productRevenue: string;
  serviceRevenue: string;
  transactions: number;
}

export interface RevenueTrends {
  period: "daily" | "weekly" | "monthly";
  data: RevenueTrendData[];
}

export interface TopService {
  serviceId: string;
  serviceName: string;
  category: string | null;
  totalRevenue: string;
  bookingCount: number;
  averagePrice: string;
}

export interface AdminAnalyticsData {
  summary: AdminAnalyticsSummary;
  trends: RevenueTrends;
  topServices: TopService[];
  timeRange: TimeRange;
}

export interface AdminAnalyticsResponse {
  message: string;
  data: AdminAnalyticsData;
}

// ==================== Query Parameters ====================

export interface SalonAnalyticsParams {
  startDate?: string; // ISO 8601 datetime
  endDate?: string; // ISO 8601 datetime
}

export interface AdminAnalyticsParams {
  startDate?: string; // ISO 8601 datetime
  endDate?: string; // ISO 8601 datetime
  period?: "daily" | "weekly" | "monthly";
  topServicesLimit?: number; // 1-50, defaults to 10
}
