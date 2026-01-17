/**
 * Offers API Service
 * Provides methods for managing promotional offers
 */

import { apiRequest } from "@/lib/utils/apiClient";
import type {
  Offer,
  OfferListResponse,
  OfferResponse,
  CreateOfferParams,
  UpdateOfferParams,
  OfferListParams,
  ValidateOfferParams,
  ValidateOfferResponse,
} from "@/lib/types/offer";

const OFFERS_BASE_PATH = "/api/v1/offers";

/**
 * Create a new promotional offer
 */
export async function createOffer(
  params: CreateOfferParams,
): Promise<OfferResponse> {
  const formData = new FormData();

  formData.append("salonId", params.salonId);
  formData.append("title", params.title);
  if (params.description) formData.append("description", params.description);
  formData.append("offerType", params.offerType);
  if (params.productId) formData.append("productId", params.productId);
  if (params.serviceId) formData.append("serviceId", params.serviceId);
  formData.append("discountType", params.discountType);
  formData.append("discountValue", params.discountValue);
  formData.append("startsAt", params.startsAt);
  formData.append("endsAt", params.endsAt);
  if (params.image) formData.append("image", params.image);

  return apiRequest<OfferResponse>(OFFERS_BASE_PATH, {
    method: "POST",
    body: formData,
    requiresAuth: true,
    isFormData: true,
  });
}

/**
 * Update an existing offer
 */
export async function updateOffer(
  offerId: string,
  params: UpdateOfferParams,
): Promise<OfferResponse> {
  const formData = new FormData();

  if (params.title) formData.append("title", params.title);
  if (params.description) formData.append("description", params.description);
  if (params.discountValue)
    formData.append("discountValue", params.discountValue);
  if (params.startsAt) formData.append("startsAt", params.startsAt);
  if (params.endsAt) formData.append("endsAt", params.endsAt);
  if (params.image) formData.append("image", params.image);

  return apiRequest<OfferResponse>(`${OFFERS_BASE_PATH}/${offerId}`, {
    method: "PATCH",
    body: formData,
    requiresAuth: true,
    isFormData: true,
  });
}

/**
 * Toggle offer active status
 */
export async function toggleOfferStatus(
  offerId: string,
  isActive: boolean,
): Promise<OfferResponse> {
  return apiRequest<OfferResponse>(`${OFFERS_BASE_PATH}/${offerId}/toggle`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
    requiresAuth: true,
  });
}

/**
 * Delete an offer
 */
export async function deleteOffer(
  offerId: string,
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`${OFFERS_BASE_PATH}/${offerId}`, {
    method: "DELETE",
    requiresAuth: true,
  });
}

/**
 * List offers (salon owner view)
 */
export async function getOffers(
  params?: OfferListParams,
): Promise<OfferListResponse> {
  const queryParams = new URLSearchParams();

  if (params?.salonId) queryParams.append("salonId", params.salonId);
  if (params?.productId) queryParams.append("productId", params.productId);
  if (params?.serviceId) queryParams.append("serviceId", params.serviceId);
  if (params?.activeOnly !== undefined)
    queryParams.append("activeOnly", params.activeOnly.toString());
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const queryString = queryParams.toString();
  const path = `${OFFERS_BASE_PATH}${queryString ? `?${queryString}` : ""}`;

  return apiRequest<OfferListResponse>(path, {
    method: "GET",
    requiresAuth: true,
  });
}

/**
 * Get offer by ID (protected)
 */
export async function getOfferById(offerId: string): Promise<OfferResponse> {
  return apiRequest<OfferResponse>(`${OFFERS_BASE_PATH}/${offerId}`, {
    method: "GET",
    requiresAuth: true,
  });
}

/**
 * Get active offers (public)
 */
export async function getActiveOffers(
  params?: OfferListParams,
): Promise<OfferListResponse> {
  const queryParams = new URLSearchParams();

  if (params?.salonId) queryParams.append("salonId", params.salonId);
  if (params?.productId) queryParams.append("productId", params.productId);
  if (params?.serviceId) queryParams.append("serviceId", params.serviceId);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const queryString = queryParams.toString();
  const path = `${OFFERS_BASE_PATH}/public/active${queryString ? `?${queryString}` : ""}`;

  return apiRequest<OfferListResponse>(path, {
    method: "GET",
    requiresAuth: false,
  });
}

/**
 * Get offer by ID (public)
 */
export async function getPublicOfferById(
  offerId: string,
): Promise<OfferResponse> {
  return apiRequest<OfferResponse>(`${OFFERS_BASE_PATH}/public/${offerId}`, {
    method: "GET",
    requiresAuth: false,
  });
}

/**
 * Validate offer and calculate discount
 */
export async function validateOffer(
  params: ValidateOfferParams,
): Promise<ValidateOfferResponse> {
  return apiRequest<ValidateOfferResponse>(`${OFFERS_BASE_PATH}/validate`, {
    method: "POST",
    body: JSON.stringify(params),
    requiresAuth: false,
  });
}

// Export all functions as OfferAPI
export const OfferAPI = {
  createOffer,
  updateOffer,
  toggleOfferStatus,
  deleteOffer,
  getOffers,
  getOfferById,
  getActiveOffers,
  getPublicOfferById,
  validateOffer,
};
