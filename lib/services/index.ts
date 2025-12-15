/**
 * Central export for all API services
 * Import from here for convenient access to all API functions
 */

// Address API
export * as AddressAPI from "./addressService";

// Booking API
export * as BookingAPI from "./bookingService";

// Product API
export * as ProductAPI from "./productService";

// Salon API
export * as SalonAPI from "./salonService";

// Service API
export * as ServiceAPI from "./serviceService";

// Staff API
export * as StaffAPI from "./staffService";

// User API
export * as UserAPI from "./userService";

// Re-export API client utilities for convenience
export { ApiError } from "@/lib/utils/apiClient";
export type { RequestOptions } from "@/lib/utils/apiClient";
