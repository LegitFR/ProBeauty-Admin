/**
 * Address API Service
 * Handles all address-related API calls
 */

import { get, post, patch, del } from "@/lib/utils/apiClient";
import {
  Address,
  CreateAddressData,
  UpdateAddressData,
  ApiResponse,
} from "@/lib/types/api";

const BASE_PATH = "/api/v1/addresses";

/**
 * Create a new address
 */
export async function createAddress(
  data: CreateAddressData
): Promise<ApiResponse<Address>> {
  return post<ApiResponse<Address>>(BASE_PATH, data);
}

/**
 * Get all addresses for the authenticated user
 */
export async function getAddresses(): Promise<ApiResponse<Address[]>> {
  return get<ApiResponse<Address[]>>(BASE_PATH);
}

/**
 * Get a specific address by ID
 */
export async function getAddressById(
  id: string
): Promise<ApiResponse<Address>> {
  return get<ApiResponse<Address>>(`${BASE_PATH}/${id}`);
}

/**
 * Update an address
 */
export async function updateAddress(
  id: string,
  data: UpdateAddressData
): Promise<ApiResponse<Address>> {
  return patch<ApiResponse<Address>>(`${BASE_PATH}/${id}`, data);
}

/**
 * Delete an address
 */
export async function deleteAddress(id: string): Promise<ApiResponse<void>> {
  return del<ApiResponse<void>>(`${BASE_PATH}/${id}`);
}

/**
 * Set an address as default
 */
export async function setDefaultAddress(
  id: string
): Promise<ApiResponse<Address>> {
  return patch<ApiResponse<Address>>(`${BASE_PATH}/${id}/set-default`);
}
