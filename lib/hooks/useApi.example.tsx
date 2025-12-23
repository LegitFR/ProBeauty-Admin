/**
 * Example React Hooks for API Integration
 * These are example hooks showing common patterns for using the API services
 * Copy and modify as needed for your application
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { ApiError } from "@/lib/utils/apiClient";

// ==================== Generic Hooks ====================

/**
 * Generic hook for fetching data
 * Usage: const { data, loading, error, refetch } = useFetch(() => SalonAPI.getSalons());
 */
export function useFetch<T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Generic hook for mutations (create, update, delete)
 * Usage: const { mutate, loading, error } = useMutation((data) => SalonAPI.createSalon(data));
 */
export function useMutation<TData, TResult>(
  mutationFunction: (data: TData) => Promise<TResult>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TResult | null>(null);

  const mutate = async (mutationData: TData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFunction(mutationData);
      setData(result);
      return result;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        throw err;
      } else {
        setError("An unexpected error occurred");
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error, data };
}

// ==================== Specific Example Hooks ====================

/**
 * Example: Hook for fetching salons
 */
export function useSalons(verified?: boolean) {
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        setLoading(true);
        // Import dynamically to avoid circular dependencies
        const { SalonAPI } = await import("@/lib/services");
        const response = await SalonAPI.getSalons({ verified });
        setSalons(response.data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to fetch salons");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, [verified]);

  return { salons, loading, error };
}

/**
 * Example: Hook for fetching user profile
 */
export function useUserProfile() {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { UserAPI } = await import("@/lib/services");
      const response = await UserAPI.getUserProfile();
      setProfile(response.user);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to fetch profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, error, refetch: fetchProfile };
}

/**
 * Example: Hook for bookings with filters
 */
export function useBookings(filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const { BookingAPI } = await import("@/lib/services");
        const response = await BookingAPI.getBookings(filters as any);
        setBookings(response.data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to fetch bookings");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [filters?.status, filters?.startDate, filters?.endDate]);

  return { bookings, loading, error };
}

/**
 * Example: Hook for creating a booking
 */
export function useCreateBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (bookingData: any) => {
    try {
      setLoading(true);
      setError(null);
      const { BookingAPI } = await import("@/lib/services");
      const response = await BookingAPI.createBooking(bookingData);
      return response.data;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        throw err;
      } else {
        setError("Failed to create booking");
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, error };
}

/**
 * Example: Hook for pagination
 */
export function usePaginatedData<T>(
  fetchFunction: (page: number, limit: number) => Promise<any>,
  initialPage = 1,
  pageSize = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFunction(pageNum, pageSize);
      setData(response.data);
      setTotalPages(response.pagination?.totalPages || 0);
      setPage(pageNum);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to fetch data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(page);
  }, []);

  const nextPage = () => {
    if (page < totalPages) {
      fetchPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      fetchPage(page - 1);
    }
  };

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      fetchPage(pageNum);
    }
  };

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    refetch: () => fetchPage(page),
  };
}

// ==================== Usage Examples ====================

/*

// Example 1: Using generic useFetch hook
function SalonsList() {
  const { data, loading, error } = useFetch(
    async () => {
      const { SalonAPI } = await import("@/lib/services");
      return SalonAPI.getSalons({ verified: true });
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {data?.data.map(salon => (
        <div key={salon.id}>{salon.name}</div>
      ))}
    </div>
  );
}

// Example 2: Using specific hook
function MySalons() {
  const { salons, loading, error } = useSalons(true);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {salons.map(salon => (
        <div key={salon.id}>{salon.name}</div>
      ))}
    </div>
  );
}

// Example 3: Using mutation hook
function CreateBookingForm() {
  const { mutate, loading, error } = useMutation(async (data) => {
    const { BookingAPI } = await import("@/lib/services");
    return BookingAPI.createBooking(data);
  });

  const handleSubmit = async (formData) => {
    try {
      const result = await mutate(formData);
      alert("Booking created successfully!");
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <button disabled={loading}>
        {loading ? "Creating..." : "Create Booking"}
      </button>
    </form>
  );
}

/**
 * Example: Hook for fetching admin orders with filters
 * Admin-only hook to fetch all orders across users and salons
 */
export function useAdminOrders(filters?: {
  status?: string;
  salonId?: string;
  page?: number;
  limit?: number;
}) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { OrderAPI } = await import("@/lib/services");
      const response = await OrderAPI.getAllOrdersAdmin(filters as any);
      setOrders(response.data);
      setPagination(response.pagination);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to fetch orders");
      }
    } finally {
      setLoading(false);
    }
  }, [filters?.status, filters?.salonId, filters?.page, filters?.limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, pagination, refetch: fetchOrders };
}

/**
 * Example: Hook for updating order status
 */
export function useUpdateOrderStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      setLoading(true);
      setError(null);
      const { OrderAPI } = await import("@/lib/services");
      const response = await OrderAPI.updateOrderStatus(orderId, {
        status,
      } as any);
      return response.data;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        throw err;
      } else {
        setError("Failed to update order status");
        throw new Error("Failed to update order status");
      }
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading, error };
}

// Example 4: Using pagination hook
function ProductsList() {
  const {
    data: products,
    loading,
    error,
    page,
    totalPages,
    nextPage,
    prevPage,
  } = usePaginatedData(async (page, limit) => {
    const { ProductAPI } = await import("@/lib/services");
    return ProductAPI.getProducts({ page, limit });
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map((product: any) => (
        <div key={product.id}>{product.title}</div>
      ))}

      <div className="pagination">
        <button onClick={prevPage} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

// Example 5: Using admin orders hook
function AdminOrdersDashboard() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [salonFilter, setSalonFilter] = useState<string>("");

  const { orders, loading, error, pagination, refetch } = useAdminOrders({
    status: statusFilter || undefined,
    salonId: salonFilter || undefined,
    page: 1,
    limit: 20,
  });

  const { updateStatus } = useUpdateOrderStatus();

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus(orderId, newStatus);
      refetch(); // Refresh the orders list
    } catch (err) {
      console.error("Failed to update order status");
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="filters">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
        </select>

        <input
          type="text"
          placeholder="Filter by Salon ID"
          value={salonFilter}
          onChange={(e) => setSalonFilter(e.target.value)}
        />
      </div>

      {orders.map((order) => (
        <div key={order.id}>
          <h3>Order #{order.id}</h3>
          <p>Status: {order.status}</p>
          <p>Total: ${order.total}</p>
          <button onClick={() => handleStatusChange(order.id, "SHIPPED")}>
            Mark as Shipped
          </button>
        </div>
      ))}

      {pagination && (
        <div>
          Showing {orders.length} of {pagination.total} orders
        </div>
      )}
    </div>
  );
}
