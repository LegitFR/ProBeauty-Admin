/**
 * Analytics API Service
 * Provides methods for retrieving salon and platform-wide analytics data
 */

import { apiRequest } from "@/lib/utils/apiClient";
import type {
  SalonAnalyticsResponse,
  SalonAnalyticsParams,
  AdminAnalyticsResponse,
  AdminAnalyticsParams,
} from "@/lib/types/analytics";

const ANALYTICS_BASE_PATH = "/api/v1/analytics";

/**
 * Get analytics for a specific salon
 *
 * @param salonId - The salon ID (CUID format)
 * @param params - Optional query parameters for date filtering
 * @returns Comprehensive revenue analytics for the salon
 *
 * @example
 * // Get all-time analytics
 * const analytics = await getSalonAnalytics("cmiplyw1n0002li2gbggmr85q");
 *
 * @example
 * // Get monthly analytics
 * const analytics = await getSalonAnalytics("cmiplyw1n0002li2gbggmr85q", {
 *   startDate: "2026-01-01T00:00:00Z",
 *   endDate: "2026-01-31T23:59:59Z"
 * });
 */
export async function getSalonAnalytics(
  salonId: string,
  params?: SalonAnalyticsParams
): Promise<SalonAnalyticsResponse> {
  const queryParams = new URLSearchParams();

  if (params?.startDate) {
    queryParams.append("startDate", params.startDate);
  }

  if (params?.endDate) {
    queryParams.append("endDate", params.endDate);
  }

  const queryString = queryParams.toString();
  const path = `${ANALYTICS_BASE_PATH}/salons/${salonId}${
    queryString ? `?${queryString}` : ""
  }`;

  return apiRequest<SalonAnalyticsResponse>(path, {
    method: "GET",
    requiresAuth: true,
  });
}

/**
 * Get platform-wide analytics for admin dashboard
 * Only accessible to admin users
 *
 * @param params - Optional query parameters for date filtering, period, and top services limit
 * @returns Comprehensive platform-wide analytics including all salons
 *
 * @example
 * // Get default analytics (last 30 days, monthly trends)
 * const analytics = await getAdminAnalytics();
 *
 * @example
 * // Get daily trends for a specific period
 * const analytics = await getAdminAnalytics({
 *   startDate: "2026-01-01T00:00:00Z",
 *   endDate: "2026-01-31T23:59:59Z",
 *   period: "daily",
 *   topServicesLimit: 20
 * });
 */
export async function getAdminAnalytics(
  params?: AdminAnalyticsParams
): Promise<AdminAnalyticsResponse> {
  const queryParams = new URLSearchParams();

  if (params?.startDate) {
    queryParams.append("startDate", params.startDate);
  }

  if (params?.endDate) {
    queryParams.append("endDate", params.endDate);
  }

  if (params?.period) {
    queryParams.append("period", params.period);
  }

  if (params?.topServicesLimit !== undefined) {
    queryParams.append("topServicesLimit", params.topServicesLimit.toString());
  }

  const queryString = queryParams.toString();
  const path = `${ANALYTICS_BASE_PATH}/admin${
    queryString ? `?${queryString}` : ""
  }`;

  return apiRequest<AdminAnalyticsResponse>(path, {
    method: "GET",
    requiresAuth: true,
  });
}

/**
 * Helper function to get analytics for the current month
 */
export async function getCurrentMonthSalonAnalytics(
  salonId: string
): Promise<SalonAnalyticsResponse> {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  return getSalonAnalytics(salonId, {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });
}

/**
 * Helper function to get analytics for today
 */
export async function getTodaySalonAnalytics(
  salonId: string
): Promise<SalonAnalyticsResponse> {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );

  return getSalonAnalytics(salonId, {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });
}

/**
 * Helper function to get analytics for a date range
 */
export async function getDateRangeSalonAnalytics(
  salonId: string,
  startDate: Date,
  endDate: Date
): Promise<SalonAnalyticsResponse> {
  return getSalonAnalytics(salonId, {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });
}

/**
 * Helper function to get admin analytics for the last 30 days
 */
export async function getLast30DaysAdminAnalytics(
  period: "daily" | "weekly" | "monthly" = "daily"
): Promise<AdminAnalyticsResponse> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  return getAdminAnalytics({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    period,
  });
}

/**
 * Helper function to get admin analytics for the current month
 */
export async function getCurrentMonthAdminAnalytics(
  period: "daily" | "weekly" | "monthly" = "daily"
): Promise<AdminAnalyticsResponse> {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  return getAdminAnalytics({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    period,
  });
}
