/**
 * Salon API Service
 * Handles all salon-related API calls
 */

import { get, post, patch, del } from "@/lib/utils/apiClient";
import { buildQueryString } from "@/lib/utils/apiClient";
import {
  Salon,
  CreateSalonData,
  UpdateSalonData,
  GetSalonsParams,
  SearchSalonsParams,
  SearchSalonResult,
  ApiResponse,
} from "@/lib/types/api";

const BASE_PATH = "/api/v1/salons";

/**
 * Build FormData for salon creation/update with images
 */
function buildSalonFormData(data: CreateSalonData | UpdateSalonData): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) return;

    if (key === "images" && Array.isArray(value)) {
      // Append multiple image files
      value.forEach((file: File) => {
        formData.append("images", file);
      });
    } else if (value instanceof File) {
      // Single file (thumbnail)
      formData.append(key, value);
    } else if (typeof value === "object" && !(value instanceof File)) {
      // Objects like geo and hours - send as JSON string
      formData.append(key, JSON.stringify(value));
    } else {
      // Regular field
      formData.append(key, String(value));
    }
  });

  return formData;
}

/**
 * Get all salons with optional filters
 */
export async function getSalons(
  params?: GetSalonsParams
): Promise<ApiResponse<Salon[]>> {
  const queryString = params ? buildQueryString(params) : "";
  return get<ApiResponse<Salon[]>>(`${BASE_PATH}${queryString}`, {
    requiresAuth: false,
  });
}

/**
 * Search salons with advanced filters
 */
export async function searchSalons(
  params: SearchSalonsParams
): Promise<ApiResponse<SearchSalonResult[]>> {
  const queryString = buildQueryString(params);
  return get<ApiResponse<SearchSalonResult[]>>(
    `${BASE_PATH}/search${queryString}`,
    { requiresAuth: false }
  );
}

/**
 * Get salons owned by the authenticated user
 */
export async function getMySalons(
  params?: GetSalonsParams
): Promise<ApiResponse<Salon[]>> {
  const queryString = params ? buildQueryString(params) : "";
  return get<ApiResponse<Salon[]>>(`${BASE_PATH}/my-salons${queryString}`);
}

/**
 * Get a specific salon by ID
 */
export async function getSalonById(id: string): Promise<ApiResponse<Salon>> {
  return get<ApiResponse<Salon>>(`${BASE_PATH}/${id}`, {
    requiresAuth: false,
  });
}

/**
 * Create a new salon
 */
export async function createSalon(
  data: CreateSalonData
): Promise<ApiResponse<Salon>> {
  // Check if we have files to upload
  const hasFiles = data.thumbnail || (data.images && data.images.length > 0);

  if (hasFiles) {
    const formData = buildSalonFormData(data);
    return post<ApiResponse<Salon>>(BASE_PATH, formData);
  } else {
    // JSON request if no files
    return post<ApiResponse<Salon>>(BASE_PATH, data);
  }
}

/**
 * Update a salon
 */
export async function updateSalon(
  id: string,
  data: UpdateSalonData
): Promise<ApiResponse<Salon>> {
  // Check if we have files to upload
  const hasFiles = data.thumbnail || (data.images && data.images.length > 0);

  if (hasFiles) {
    const formData = buildSalonFormData(data);
    return patch<ApiResponse<Salon>>(`${BASE_PATH}/${id}`, formData);
  } else {
    // JSON request if no files
    return patch<ApiResponse<Salon>>(`${BASE_PATH}/${id}`, data);
  }
}

/**
 * Delete a salon
 */
export async function deleteSalon(id: string): Promise<ApiResponse<void>> {
  return del<ApiResponse<void>>(`${BASE_PATH}/${id}`);
}
