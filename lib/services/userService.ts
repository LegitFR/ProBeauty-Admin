/**
 * User API Service
 * Handles user profile and email management API calls
 */

import { get, patch, post } from "@/lib/utils/apiClient";
import {
  UserProfile,
  UpdateUserProfileData,
  ChangeEmailRequestData,
  ChangeEmailConfirmData,
  ApiResponse,
} from "@/lib/types/api";

const BASE_PATH = "/api/v1/user";

/**
 * Get current user profile with all related data
 */
export async function getUserProfile(): Promise<{ user: UserProfile }> {
  return get<{ user: UserProfile }>(`${BASE_PATH}/me`);
}

/**
 * Update current user profile
 */
export async function updateUserProfile(
  data: UpdateUserProfileData
): Promise<ApiResponse<UserProfile>> {
  return patch<ApiResponse<UserProfile>>(`${BASE_PATH}/me`, data);
}

/**
 * Request email change (sends OTP to new email)
 */
export async function requestEmailChange(
  data: ChangeEmailRequestData
): Promise<ApiResponse<void>> {
  return post<ApiResponse<void>>(`${BASE_PATH}/change-email/request`, data);
}

/**
 * Confirm email change with OTP
 */
export async function confirmEmailChange(
  data: ChangeEmailConfirmData
): Promise<ApiResponse<UserProfile>> {
  return post<ApiResponse<UserProfile>>(
    `${BASE_PATH}/change-email/confirm`,
    data
  );
}
