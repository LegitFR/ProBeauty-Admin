# Admin Orders API Integration Guide

## Overview

This document describes the integration of the admin orders API endpoint that allows administrators to view and manage all orders across all users and salons.

## API Endpoint

```bash
GET /api/v1/orders/admin
```

**Authorization:** Requires Admin JWT Token

## Features

- ✅ Get all orders across all users and salons (admin-only)
- ✅ Filter by order status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- ✅ Filter by salon ID
- ✅ Pagination support (page, limit)
- ✅ Full order details including items, salon, and user information

## Implementation

### 1. Service Layer (`lib/services/orderService.ts`)

Added new admin-specific function:

```typescript
/**
 * Get all orders as admin
 * Admin-only endpoint to view all orders across all users and salons
 */
export async function getAllOrdersAdmin(
  params?: GetOrdersParams
): Promise<ApiResponse<OrderDetail[]>> {
  const queryString = params ? buildQueryString(params) : "";
  return get<ApiResponse<OrderDetail[]>>(`${BASE_PATH}/admin${queryString}`);
}
```

### 2. Component Integration (`components/ecommerce-management.tsx`)

Updated the `fetchOrders` function to use the admin endpoint:

```typescript
const fetchOrders = async () => {
  try {
    setOrdersLoading(true);
    setOrdersError(null);

    const params: any = { page: 1, limit: 100 };
    if (orderStatusFilter !== "all") {
      params.status = orderStatusFilter.toUpperCase();
    }

    // Use admin endpoint to get all orders
    const response = await OrderAPI.getAllOrdersAdmin(params);
    setOrders(response.data);
  } catch (err) {
    // Error handling...
  }
};
```

## Usage Examples

### Basic Usage

```typescript
import { OrderAPI } from "@/lib/services";

// Get all orders
const response = await OrderAPI.getAllOrdersAdmin();
const orders = response.data;
```

### With Pagination

```typescript
// Get first 20 orders
const response = await OrderAPI.getAllOrdersAdmin({
  page: 1,
  limit: 20,
});

console.log(`Total orders: ${response.pagination.total}`);
console.log(`Current page: ${response.pagination.page}`);
console.log(`Total pages: ${response.pagination.totalPages}`);
```

### With Filters

```typescript
// Get confirmed orders only
const confirmedOrders = await OrderAPI.getAllOrdersAdmin({
  status: "CONFIRMED",
  page: 1,
  limit: 50,
});

// Get orders for a specific salon
const salonOrders = await OrderAPI.getAllOrdersAdmin({
  salonId: "clx1salon12345678",
  page: 1,
  limit: 20,
});

// Combine filters
const filteredOrders = await OrderAPI.getAllOrdersAdmin({
  status: "CONFIRMED",
  salonId: "clx1salon12345678",
  page: 1,
  limit: 20,
});
```

### React Component Example

```typescript
"use client";

import { useState, useEffect } from "react";
import { OrderAPI } from "@/lib/services";
import type { OrderDetail, OrderStatus } from "@/lib/types/api";

export function AdminOrdersList() {
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: any = { page: 1, limit: 20 };

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await OrderAPI.getAllOrdersAdmin(params);
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as OrderStatus)}
      >
        <option value="">All Orders</option>
        <option value="PENDING">Pending</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="SHIPPED">Shipped</option>
        <option value="DELIVERED">Delivered</option>
        <option value="CANCELLED">Cancelled</option>
      </select>

      {orders.map((order) => (
        <div key={order.id}>
          <h3>Order #{order.id}</h3>
          <p>Status: {order.status}</p>
          <p>Total: ${order.total}</p>
          <p>Salon: {order.salon?.name}</p>
        </div>
      ))}
    </div>
  );
}
```

### React Hook Example

A custom hook for admin orders is available in `lib/hooks/useApi.example.tsx`:

```typescript
import { useAdminOrders } from "@/lib/hooks/useApi.example";

function OrdersDashboard() {
  const { orders, loading, error, pagination, refetch } = useAdminOrders({
    status: "CONFIRMED",
    page: 1,
    limit: 20,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {orders.map((order) => (
        <div key={order.id}>{order.id}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

## API Parameters

### GetOrdersParams

```typescript
interface GetOrdersParams {
  page?: number; // Default: 1
  limit?: number; // Default: 10, Max: 100
  status?: OrderStatus; // Filter by order status
  salonId?: string; // Filter by salon ID
}
```

### OrderStatus Types

```typescript
type OrderStatus =
  | "PENDING"
  | "PAYMENT_PENDING"
  | "PAYMENT_FAILED"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
```

## Response Structure

```typescript
{
  message: "Orders retrieved successfully",
  data: [
    {
      id: "order_123",
      userId: "user_456",
      salonId: "salon_789",
      total: "199.99",
      status: "CONFIRMED",
      notes: "Please deliver by 5 PM",
      createdAt: "2025-12-23T10:00:00Z",
      updatedAt: "2025-12-23T11:00:00Z",
      orderItems: [
        {
          id: "item_1",
          orderId: "order_123",
          productId: "prod_001",
          quantity: 2,
          unitPrice: "99.99",
          product: {
            id: "prod_001",
            salonId: "salon_789",
            title: "Premium Hair Product",
            sku: "PROD-001",
            price: "99.99",
            quantity: 50,
            images: ["https://..."]
          }
        }
      ],
      salon: {
        id: "salon_789",
        ownerId: "owner_123",
        name: "Beauty Salon",
        address: "123 Main St",
        verified: true
      }
    }
  ],
  pagination: {
    page: 1,
    limit: 20,
    total: 150,
    totalPages: 8
  }
}
```

## Error Handling

```typescript
import { ApiError } from "@/lib/services";

try {
  const response = await OrderAPI.getAllOrdersAdmin();
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      console.error("Unauthorized - Admin access required");
    } else if (error.status === 403) {
      console.error("Forbidden - Insufficient permissions");
    } else {
      console.error(`Error ${error.status}: ${error.message}`);
    }
  }
}
```

## Security Considerations

⚠️ **Important:** This endpoint requires admin authentication. Make sure:

1. The user has a valid JWT token with admin role
2. The token is stored in `localStorage.accessToken`
3. The API automatically includes the token in the Authorization header
4. Handle 401/403 errors appropriately in the UI

## Testing with cURL

```bash
# Get all orders
curl -X GET "http://localhost:5000/api/v1/orders/admin" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json"

# Get orders with pagination
curl -X GET "http://localhost:5000/api/v1/orders/admin?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json"

# Get confirmed orders only
curl -X GET "http://localhost:5000/api/v1/orders/admin?status=CONFIRMED" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json"

# Get orders for specific salon
curl -X GET "http://localhost:5000/api/v1/orders/admin?salonId=clx1salon12345678" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json"

# Combined filters
curl -X GET "http://localhost:5000/api/v1/orders/admin?page=1&limit=20&status=CONFIRMED&salonId=clx1salon12345678" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## Related Files

- [lib/services/orderService.ts](lib/services/orderService.ts) - Order service implementation
- [lib/types/api.ts](lib/types/api.ts) - TypeScript type definitions
- [components/ecommerce-management.tsx](components/ecommerce-management.tsx) - E-commerce component using admin API
- [lib/hooks/useApi.example.tsx](lib/hooks/useApi.example.tsx) - React hooks examples
- [API_QUICK_REFERENCE.md](API_QUICK_REFERENCE.md) - Quick API reference

## Summary

The admin orders API has been successfully integrated with:

✅ Type-safe service function in `orderService.ts`  
✅ Updated e-commerce component to use admin endpoint  
✅ Comprehensive documentation and examples  
✅ React hooks for easy component integration  
✅ Full error handling support  
✅ Pagination and filtering capabilities

The integration follows the existing patterns in the codebase and maintains consistency with other API services.
