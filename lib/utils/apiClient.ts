/**
 * API Client Utility
 * Provides a centralized HTTP client for making authenticated API requests
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://probeauty-backend.onrender.com";

// Use proxy in development to bypass CORS
const USE_PROXY = process.env.NODE_ENV === "development";

export interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  isFormData?: boolean;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors?: any[]
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Get the access token from localStorage
 */
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

/**
 * Build the request URL
 */
function buildUrl(path: string): string {
  if (USE_PROXY) {
    // Use Next.js API proxy in development
    return `/api/proxy?path=${encodeURIComponent(path)}`;
  } else {
    // Direct call in production
    return `${API_BASE_URL}${path}`;
  }
}

/**
 * Make an HTTP request with proper error handling and authentication
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, isFormData = false, ...fetchOptions } = options;

  const url = buildUrl(path);

  const headers: Record<string, string> = {
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  // Add Content-Type for JSON requests (not for FormData)
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // Add authorization header if required
  if (requiresAuth) {
    const token = getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Parse response
    const contentType = response.headers.get("content-type");
    let data: any;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text };
    }

    // Handle error responses
    if (!response.ok) {
      // Handle 401 Unauthorized - clear token and redirect to login
      // But ONLY if we're not on the auth page (to avoid interfering with login)
      if (response.status === 401) {
        console.log("🔴 401 Error detected:", {
          url,
          pathname: window.location.pathname,
          hasToken: !!localStorage.getItem("accessToken"),
        });

        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/auth")
        ) {
          console.log("🔴 Clearing tokens and redirecting to /auth");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          sessionStorage.setItem("auth_redirect", "true");
          window.location.href = "/auth";
        }
      }

      throw new ApiError(
        response.status,
        data.message || "An error occurred",
        data.errors
      );
    }

    return data as T;
  } catch (error: any) {
    // Re-throw ApiError as is
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      console.error("❌ Network request failed!");
      console.error("URL:", url);

      if (!USE_PROXY) {
        console.error(
          "💡 TIP: CORS error detected. Enable proxy in development."
        );
      }

      throw new ApiError(
        0,
        "Network request failed. Please check your connection."
      );
    }

    // Handle other errors
    throw new ApiError(500, error.message || "An unexpected error occurred");
  }
}

/**
 * Helper function for GET requests
 */
export async function get<T>(
  path: string,
  options?: RequestOptions
): Promise<T> {
  return apiRequest<T>(path, {
    ...options,
    method: "GET",
  });
}

/**
 * Helper function for POST requests
 */
export async function post<T>(
  path: string,
  body?: any,
  options?: RequestOptions
): Promise<T> {
  const isFormData = body instanceof FormData;

  return apiRequest<T>(path, {
    ...options,
    method: "POST",
    body: isFormData ? body : JSON.stringify(body),
    isFormData,
  });
}

/**
 * Helper function for PATCH requests
 */
export async function patch<T>(
  path: string,
  body?: any,
  options?: RequestOptions
): Promise<T> {
  const isFormData = body instanceof FormData;

  return apiRequest<T>(path, {
    ...options,
    method: "PATCH",
    body: isFormData ? body : JSON.stringify(body),
    isFormData,
  });
}

/**
 * Helper function for PUT requests
 */
export async function put<T>(
  path: string,
  body?: any,
  options?: RequestOptions
): Promise<T> {
  const isFormData = body instanceof FormData;

  return apiRequest<T>(path, {
    ...options,
    method: "PUT",
    body: isFormData ? body : JSON.stringify(body),
    isFormData,
  });
}

/**
 * Helper function for DELETE requests
 */
export async function del<T>(
  path: string,
  options?: RequestOptions
): Promise<T> {
  return apiRequest<T>(path, {
    ...options,
    method: "DELETE",
  });
}

/**
 * Build query string from params object
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}
