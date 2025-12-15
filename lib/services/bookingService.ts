/**
 * Booking API Service
 * Handles all booking-related API calls
 */

import { get, post, put, del } from "@/lib/utils/apiClient";
import { buildQueryString } from "@/lib/utils/apiClient";
import {
  Booking,
  CreateBookingData,
  UpdateBookingData,
  GetBookingsParams,
  GetAvailabilityParams,
  AvailabilityData,
  ApiResponse,
} from "@/lib/types/api";

const BASE_PATH = "/api/v1/bookings";

/**
 * Create a new booking
 */
export async function createBooking(
  data: CreateBookingData
): Promise<ApiResponse<Booking>> {
  return post<ApiResponse<Booking>>(BASE_PATH, data);
}

/**
 * Get all bookings (role-based filtering applied on backend)
 */
export async function getBookings(
  params?: GetBookingsParams
): Promise<ApiResponse<Booking[]>> {
  const queryString = params ? buildQueryString(params) : "";
  return get<ApiResponse<Booking[]>>(`${BASE_PATH}${queryString}`);
}

/**
 * Get available time slots for a service
 */
export async function getAvailableSlots(
  params: GetAvailabilityParams
): Promise<ApiResponse<AvailabilityData>> {
  const queryString = buildQueryString(params);
  return get<ApiResponse<AvailabilityData>>(
    `${BASE_PATH}/availability${queryString}`,
    { requiresAuth: false }
  );
}

/**
 * Get a specific booking by ID
 */
export async function getBookingById(
  id: string
): Promise<ApiResponse<Booking>> {
  return get<ApiResponse<Booking>>(`${BASE_PATH}/${id}`);
}

/**
 * Update a booking
 */
export async function updateBooking(
  id: string,
  data: UpdateBookingData
): Promise<ApiResponse<Booking>> {
  return put<ApiResponse<Booking>>(`${BASE_PATH}/${id}`, data);
}

/**
 * Cancel a booking
 */
export async function cancelBooking(id: string): Promise<ApiResponse<Booking>> {
  return del<ApiResponse<Booking>>(`${BASE_PATH}/${id}`);
}

/**
 * Confirm a booking (salon owners and admins only)
 */
export async function confirmBooking(
  id: string
): Promise<ApiResponse<Booking>> {
  return post<ApiResponse<Booking>>(`${BASE_PATH}/${id}/confirm`);
}

/**
 * Mark a booking as completed (salon owners and admins only)
 */
export async function completeBooking(
  id: string
): Promise<ApiResponse<Booking>> {
  return post<ApiResponse<Booking>>(`${BASE_PATH}/${id}/complete`);
}
