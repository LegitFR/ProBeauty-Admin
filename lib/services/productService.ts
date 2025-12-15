/**
 * Product API Service
 * Handles all product-related API calls
 */

import { get, post, patch, del } from "@/lib/utils/apiClient";
import { buildQueryString } from "@/lib/utils/apiClient";
import {
  Product,
  CreateProductData,
  UpdateProductData,
  GetProductsParams,
  ApiResponse,
} from "@/lib/types/api";

const BASE_PATH = "/api/v1/products";

/**
 * Build FormData for product creation/update with images
 */
function buildProductFormData(
  data: CreateProductData | UpdateProductData
): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) return;

    if (key === "images" && Array.isArray(value)) {
      // Append multiple image files
      value.forEach((file: File) => {
        formData.append("images", file);
      });
    } else if (value instanceof File) {
      // Single file (e.g., thumbnail)
      formData.append(key, value);
    } else {
      // Regular field - convert to string
      formData.append(key, String(value));
    }
  });

  return formData;
}

/**
 * Get all products with optional filters
 */
export async function getProducts(
  params?: GetProductsParams
): Promise<ApiResponse<Product[]>> {
  const queryString = params ? buildQueryString(params) : "";
  return get<ApiResponse<Product[]>>(`${BASE_PATH}${queryString}`, {
    requiresAuth: false,
  });
}

/**
 * Get products by salon ID
 */
export async function getProductsBySalon(
  salonId: string,
  params?: GetProductsParams
): Promise<ApiResponse<Product[]>> {
  const queryString = params ? buildQueryString(params) : "";
  return get<ApiResponse<Product[]>>(
    `${BASE_PATH}/salon/${salonId}${queryString}`,
    { requiresAuth: false }
  );
}

/**
 * Get a specific product by ID
 */
export async function getProductById(
  id: string
): Promise<ApiResponse<Product>> {
  return get<ApiResponse<Product>>(`${BASE_PATH}/${id}`, {
    requiresAuth: false,
  });
}

/**
 * Create a new product
 */
export async function createProduct(
  data: CreateProductData
): Promise<ApiResponse<Product>> {
  const formData = buildProductFormData(data);
  return post<ApiResponse<Product>>(BASE_PATH, formData);
}

/**
 * Update a product
 */
export async function updateProduct(
  id: string,
  data: UpdateProductData
): Promise<ApiResponse<Product>> {
  // Check if we have files to upload
  const hasFiles = data.images && data.images.length > 0;

  if (hasFiles) {
    const formData = buildProductFormData(data);
    return patch<ApiResponse<Product>>(`${BASE_PATH}/${id}`, formData);
  } else {
    // JSON request if no files
    return patch<ApiResponse<Product>>(`${BASE_PATH}/${id}`, data);
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<ApiResponse<void>> {
  return del<ApiResponse<void>>(`${BASE_PATH}/${id}`);
}
