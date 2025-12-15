/**
 * Staff API Service
 * Handles all staff-related API calls
 */

import { get, post, patch, del } from "@/lib/utils/apiClient";
import { buildQueryString } from "@/lib/utils/apiClient";
import {
  Staff,
  CreateStaffData,
  UpdateStaffData,
  GetStaffParams,
  ApiResponse,
} from "@/lib/types/api";

const BASE_PATH = "/api/v1/staff";

/**
 * Get all staff members with optional filters
 */
export async function getAllStaff(
  params?: GetStaffParams
): Promise<ApiResponse<Staff[]>> {
  const queryString = params ? buildQueryString(params) : "";
  return get<ApiResponse<Staff[]>>(`${BASE_PATH}${queryString}`, {
    requiresAuth: false,
  });
}

/**
 * Get staff members by salon ID
 */
export async function getStaffBySalon(
  salonId: string,
  params?: GetStaffParams
): Promise<ApiResponse<Staff[]>> {
  const queryString = params ? buildQueryString(params) : "";
  return get<ApiResponse<Staff[]>>(
    `${BASE_PATH}/salon/${salonId}${queryString}`,
    { requiresAuth: false }
  );
}

/**
 * Get a specific staff member by ID
 */
export async function getStaffById(id: string): Promise<ApiResponse<Staff>> {
  return get<ApiResponse<Staff>>(`${BASE_PATH}/${id}`, {
    requiresAuth: false,
  });
}

/**
 * Create a new staff member
 */
export async function createStaff(
  data: CreateStaffData
): Promise<ApiResponse<Staff>> {
  return post<ApiResponse<Staff>>(BASE_PATH, data);
}

/**
 * Update a staff member
 */
export async function updateStaff(
  id: string,
  data: UpdateStaffData
): Promise<ApiResponse<Staff>> {
  return patch<ApiResponse<Staff>>(`${BASE_PATH}/${id}`, data);
}

/**
 * Delete a staff member
 */
export async function deleteStaff(id: string): Promise<ApiResponse<void>> {
  return del<ApiResponse<void>>(`${BASE_PATH}/${id}`);
}
