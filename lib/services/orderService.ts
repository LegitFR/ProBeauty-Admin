/**
 * Order API Service
 * Handles order management: creation, retrieval, status updates, and cancellation
 */

import { get, post, patch, buildQueryString } from "@/lib/utils/apiClient";
import type {
  ApiResponse,
  OrderDetail,
  CreateOrderData,
  UpdateOrderStatusData,
  GetOrdersParams,
} from "@/lib/types/api";

const BASE_PATH = "/api/v1/orders";

/**
 * Create a new order from the user's cart
 * Validates stock availability, calculates totals, reduces inventory, and clears cart
 *
 * @param data - Order creation data (addressId and optional notes)
 * @returns Created order with all items
 * @throws ApiError on validation failure, empty cart, or multiple salons
 */
export async function createOrder(
  data: CreateOrderData
): Promise<ApiResponse<OrderDetail>> {
  return post<ApiResponse<OrderDetail>>(BASE_PATH, data);
}

/**
 * Get all orders for the authenticated user
 *
 * @param params - Pagination and filter parameters (page, limit, status, salonId)
 * @returns List of orders with pagination
 */
export async function getAllOrders(
  params?: GetOrdersParams
): Promise<ApiResponse<OrderDetail[]>> {
  const queryString = params ? buildQueryString(params) : "";
  return get<ApiResponse<OrderDetail[]>>(`${BASE_PATH}${queryString}`);
}

/**
 * Get a specific order by ID
 * User must be the order owner or the salon owner
 *
 * @param orderId - Order ID
 * @returns Order details with items and salon information
 * @throws ApiError if order not found or user doesn't have access
 */
export async function getOrderById(
  orderId: string
): Promise<ApiResponse<OrderDetail>> {
  return get<ApiResponse<OrderDetail>>(`${BASE_PATH}/${orderId}`);
}

/**
 * Update order status
 * Only salon owner can update order status
 * Validates status transitions according to order lifecycle
 *
 * @param orderId - Order ID
 * @param data - New status
 * @returns Updated order
 * @throws ApiError if invalid status transition or unauthorized
 */
export async function updateOrderStatus(
  orderId: string,
  data: UpdateOrderStatusData
): Promise<ApiResponse<OrderDetail>> {
  return patch<ApiResponse<OrderDetail>>(
    `${BASE_PATH}/${orderId}/status`,
    data
  );
}

/**
 * Cancel an order
 * User can cancel their own order, or salon owner can cancel
 * Cannot cancel orders that are already shipped, delivered, or cancelled
 * Product quantities are restored to inventory
 *
 * @param orderId - Order ID
 * @returns Cancelled order
 * @throws ApiError if order cannot be cancelled
 */
export async function cancelOrder(
  orderId: string
): Promise<ApiResponse<OrderDetail>> {
  return post<ApiResponse<OrderDetail>>(`${BASE_PATH}/${orderId}/cancel`, {});
}

/**
 * Get all orders as admin
 * Admin-only endpoint to view all orders across all users and salons
 *
 * @param params - Pagination and filter parameters (page, limit, status, salonId)
 * @returns List of all orders with pagination
 * @throws ApiError if unauthorized (requires admin role)
 */
export async function getAllOrdersAdmin(
  params?: GetOrdersParams
): Promise<ApiResponse<OrderDetail[]>> {
  const queryString = params ? buildQueryString(params) : "";
  return get<ApiResponse<OrderDetail[]>>(`${BASE_PATH}/admin${queryString}`);
}
