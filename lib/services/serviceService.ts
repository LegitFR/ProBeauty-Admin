/**
 * Service API Service
 * Handles all service-related API calls
 */

import { get, post, put, del } from "@/lib/utils/apiClient";
import { buildQueryString } from "@/lib/utils/apiClient";
import {
  Service,
  CreateServiceData,
  UpdateServiceData,
  GetServicesParams,
  ApiResponse,
} from "@/lib/types/api";

const BASE_PATH = "/api/v1/services";

/**
 * Get all services with optional salon filter
 */
export async function getServices(
  params?: GetServicesParams
): Promise<ApiResponse<Service[]>> {
  const queryString = params ? buildQueryString(params) : "";
  return get<ApiResponse<Service[]>>(`${BASE_PATH}${queryString}`, {
    requiresAuth: false,
  });
}

/**
 * Get a specific service by ID
 */
export async function getServiceById(
  id: string
): Promise<ApiResponse<Service>> {
  return get<ApiResponse<Service>>(`${BASE_PATH}/${id}`, {
    requiresAuth: false,
  });
}

/**
 * Create a new service
 */
export async function createService(
  data: CreateServiceData
): Promise<ApiResponse<Service>> {
  return post<ApiResponse<Service>>(BASE_PATH, data);
}

/**
 * Update a service
 */
export async function updateService(
  id: string,
  data: UpdateServiceData
): Promise<ApiResponse<Service>> {
  return put<ApiResponse<Service>>(`${BASE_PATH}/${id}`, data);
}

/**
 * Delete a service
 */
export async function deleteService(id: string): Promise<ApiResponse<void>> {
  return del<ApiResponse<void>>(`${BASE_PATH}/${id}`);
}
