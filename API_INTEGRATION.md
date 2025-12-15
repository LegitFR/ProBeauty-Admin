# API Integration Guide

This document provides examples and best practices for using the integrated ProBeauty backend APIs.

## Table of Contents

- [Setup](#setup)
- [API Client](#api-client)
- [Services](#services)
  - [Address API](#address-api)
  - [Booking API](#booking-api)
  - [Product API](#product-api)
  - [Salon API](#salon-api)
  - [Service API](#service-api)
  - [Staff API](#staff-api)
  - [User API](#user-api)
- [Error Handling](#error-handling)
- [TypeScript Types](#typescript-types)

## Setup

The API base URL is configured in `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://probeauty-backend.onrender.com
```

All API services are located in `lib/services/` and use the centralized API client from `lib/utils/apiClient.ts`.

## API Client

The API client automatically handles:

- Authentication (Bearer tokens from localStorage)
- Base URL configuration
- CORS proxy in development
- Error handling
- JSON and FormData requests

### Authentication

The client automatically includes the JWT token from localStorage:

```typescript
// Token is automatically retrieved from localStorage.getItem("accessToken")
// No manual token handling needed in API calls
```

## Services

All services can be imported from a central location:

```typescript
import {
  AddressAPI,
  BookingAPI,
  ProductAPI,
  SalonAPI,
  ServiceAPI,
  StaffAPI,
  UserAPI,
} from "@/lib/services";
```

Or import individually:

```typescript
import { getAddresses, createAddress } from "@/lib/services/addressService";
```

---

## Address API

### Get All Addresses

```typescript
import { AddressAPI } from "@/lib/services";

const getMyAddresses = async () => {
  try {
    const response = await AddressAPI.getAddresses();
    console.log("Addresses:", response.data);
  } catch (error) {
    console.error("Error fetching addresses:", error);
  }
};
```

### Create Address

```typescript
import { AddressAPI } from "@/lib/services";
import type { CreateAddressData } from "@/lib/types/api";

const createNewAddress = async () => {
  const addressData: CreateAddressData = {
    fullName: "John Doe",
    phone: "+1-555-0123",
    addressLine1: "123 Main Street",
    addressLine2: "Apt 4B",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "USA",
    addressType: "Home",
    isDefault: true,
  };

  try {
    const response = await AddressAPI.createAddress(addressData);
    console.log("Created address:", response.data);
  } catch (error) {
    console.error("Error creating address:", error);
  }
};
```

### Update Address

```typescript
const updateAddress = async (addressId: string) => {
  try {
    const response = await AddressAPI.updateAddress(addressId, {
      fullName: "Jane Doe",
      phone: "+1-555-9999",
    });
    console.log("Updated address:", response.data);
  } catch (error) {
    console.error("Error updating address:", error);
  }
};
```

### Set Default Address

```typescript
const setDefault = async (addressId: string) => {
  try {
    const response = await AddressAPI.setDefaultAddress(addressId);
    console.log("Default address set:", response.data);
  } catch (error) {
    console.error("Error setting default address:", error);
  }
};
```

---

## Booking API

### Create Booking

```typescript
import { BookingAPI } from "@/lib/services";
import type { CreateBookingData } from "@/lib/types/api";

const createNewBooking = async () => {
  const bookingData: CreateBookingData = {
    salonId: "clw8x9y0z0001abc123def456",
    serviceId: "clw8x9y0z0002abc123def456",
    staffId: "clw8x9y0z0003abc123def456",
    startTime: "2025-11-10T14:00:00.000Z",
  };

  try {
    const response = await BookingAPI.createBooking(bookingData);
    console.log("Booking created:", response.data);
  } catch (error) {
    console.error("Error creating booking:", error);
  }
};
```

### Get Available Slots

```typescript
const checkAvailability = async () => {
  try {
    const response = await BookingAPI.getAvailableSlots({
      salonId: "clw8x9y0z0001abc123def456",
      serviceId: "clw8x9y0z0002abc123def456",
      staffId: "clw8x9y0z0003abc123def456",
      date: "2025-11-10",
    });

    console.log("Available slots:", response.data.slots);
  } catch (error) {
    console.error("Error fetching availability:", error);
  }
};
```

### Get Bookings with Filters

```typescript
const getFilteredBookings = async () => {
  try {
    const response = await BookingAPI.getBookings({
      status: "CONFIRMED",
      startDate: "2025-11-10T00:00:00.000Z",
      endDate: "2025-11-15T23:59:59.999Z",
      page: 1,
      limit: 10,
    });

    console.log("Bookings:", response.data);
    console.log("Pagination:", response.pagination);
  } catch (error) {
    console.error("Error fetching bookings:", error);
  }
};
```

---

## Product API

### Get Products

```typescript
import { ProductAPI } from "@/lib/services";

const getProducts = async () => {
  try {
    const response = await ProductAPI.getProducts({
      inStock: true,
      minPrice: 500,
      maxPrice: 1000,
      page: 1,
      limit: 20,
    });

    console.log("Products:", response.data);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
```

### Create Product with Images

```typescript
const createProduct = async (imageFiles: File[]) => {
  const productData = {
    salonId: "clxxx123456789",
    title: "Argan Oil Shampoo",
    sku: "ARG-SHAM-250",
    price: 699,
    quantity: 25,
    images: imageFiles, // Array of File objects
  };

  try {
    const response = await ProductAPI.createProduct(productData);
    console.log("Product created:", response.data);
  } catch (error) {
    console.error("Error creating product:", error);
  }
};
```

### Update Product

```typescript
const updateProduct = async (productId: string, newImages?: File[]) => {
  const updateData = {
    title: "Argan Oil Shampoo - Premium",
    price: 749,
    quantity: 30,
    ...(newImages && { images: newImages }),
  };

  try {
    const response = await ProductAPI.updateProduct(productId, updateData);
    console.log("Product updated:", response.data);
  } catch (error) {
    console.error("Error updating product:", error);
  }
};
```

---

## Salon API

### Search Salons

```typescript
import { SalonAPI } from "@/lib/services";

const searchSalons = async () => {
  try {
    const response = await SalonAPI.searchSalons({
      service: "haircut",
      location: "Mumbai",
      maxPrice: 1500,
      venueType: "female",
      sortBy: "top_rated",
      page: 1,
      limit: 10,
    });

    console.log("Search results:", response.data);
  } catch (error) {
    console.error("Error searching salons:", error);
  }
};
```

### Create Salon with Images

```typescript
const createSalon = async (thumbnailFile: File, galleryFiles: File[]) => {
  const salonData = {
    name: "Glamour Studio",
    address: "123 Fashion Street, Mumbai, Maharashtra 400001",
    venueType: "female" as const,
    phone: "9876543210",
    geo: {
      latitude: 19.076,
      longitude: 72.8777,
    },
    hours: {
      monday: { open: "09:00", close: "18:00" },
      tuesday: { open: "09:00", close: "18:00" },
      wednesday: { open: "09:00", close: "18:00" },
      thursday: { open: "09:00", close: "18:00" },
      friday: { open: "09:00", close: "18:00" },
      saturday: { open: "10:00", close: "16:00" },
      sunday: { open: "10:00", close: "16:00" },
    },
    thumbnail: thumbnailFile,
    images: galleryFiles,
  };

  try {
    const response = await SalonAPI.createSalon(salonData);
    console.log("Salon created:", response.data);
  } catch (error) {
    console.error("Error creating salon:", error);
  }
};
```

### Get My Salons

```typescript
const getMySalons = async () => {
  try {
    const response = await SalonAPI.getMySalons({
      verified: true,
      page: 1,
      limit: 10,
    });

    console.log("My salons:", response.data);
  } catch (error) {
    console.error("Error fetching salons:", error);
  }
};
```

---

## Service API

### Create Service

```typescript
import { ServiceAPI } from "@/lib/services";
import type { CreateServiceData } from "@/lib/types/api";

const createService = async () => {
  const serviceData: CreateServiceData = {
    salonId: "clv1234567890abcdefgh",
    title: "Men's Haircut",
    category: "Haircut",
    durationMinutes: 30,
    price: 25.99,
  };

  try {
    const response = await ServiceAPI.createService(serviceData);
    console.log("Service created:", response.data);
  } catch (error) {
    console.error("Error creating service:", error);
  }
};
```

### Get Services by Salon

```typescript
const getServicesBySalon = async (salonId: string) => {
  try {
    const response = await ServiceAPI.getServices({ salonId });
    console.log("Salon services:", response.data);
  } catch (error) {
    console.error("Error fetching services:", error);
  }
};
```

---

## Staff API

### Create Staff Member

```typescript
import { StaffAPI } from "@/lib/services";
import type { CreateStaffData } from "@/lib/types/api";

const createStaffMember = async () => {
  const staffData: CreateStaffData = {
    salonId: "clv1234567890abcdefgh",
    serviceId: "clv1111111111abcdefgh",
    availability: {
      monday: {
        isAvailable: true,
        slots: [{ start: "09:00", end: "18:00" }],
      },
      tuesday: {
        isAvailable: true,
        slots: [{ start: "09:00", end: "18:00" }],
      },
      // ... other days
      sunday: {
        isAvailable: false,
      },
    },
    userId: "clv0987654321zyxwvuts",
  };

  try {
    const response = await StaffAPI.createStaff(staffData);
    console.log("Staff member created:", response.data);
  } catch (error) {
    console.error("Error creating staff:", error);
  }
};
```

### Get Staff by Salon

```typescript
const getStaffBySalon = async (salonId: string) => {
  try {
    const response = await StaffAPI.getStaffBySalon(salonId, {
      page: 1,
      limit: 10,
    });

    console.log("Staff members:", response.data);
  } catch (error) {
    console.error("Error fetching staff:", error);
  }
};
```

---

## User API

### Get User Profile

```typescript
import { UserAPI } from "@/lib/services";

const getUserProfile = async () => {
  try {
    const response = await UserAPI.getUserProfile();
    console.log("User profile:", response.user);
    console.log("Bookings:", response.user.bookings);
    console.log("Orders:", response.user.orders);
    console.log("Cart:", response.user.cart);
    console.log("Addresses:", response.user.addresses);
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};
```

### Update Profile

```typescript
const updateProfile = async () => {
  try {
    const response = await UserAPI.updateUserProfile({
      name: "Jane A. Doe",
      phone: "9876543211",
    });

    console.log("Profile updated:", response.data);
  } catch (error) {
    console.error("Error updating profile:", error);
  }
};
```

### Change Email

```typescript
const changeEmail = async () => {
  try {
    // Step 1: Request OTP
    await UserAPI.requestEmailChange({
      newEmail: "new-email@example.com",
    });

    console.log("OTP sent to new email");

    // Step 2: Confirm with OTP
    const response = await UserAPI.confirmEmailChange({
      newEmail: "new-email@example.com",
      otp: "123456",
    });

    console.log("Email updated:", response.data);
  } catch (error) {
    console.error("Error changing email:", error);
  }
};
```

---

## Error Handling

All API calls can throw `ApiError` with status code and message:

```typescript
import { ApiError } from "@/lib/services";

const handleApiCall = async () => {
  try {
    const response = await SalonAPI.getSalons();
    // Success handling
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle API errors
      console.error(`API Error [${error.status}]:`, error.message);

      if (error.status === 401) {
        // Unauthorized - redirect to login
        window.location.href = "/auth";
      } else if (error.status === 403) {
        // Forbidden - show permission error
        alert("You don't have permission to perform this action");
      } else if (error.status === 404) {
        // Not found
        alert("Resource not found");
      } else if (error.errors) {
        // Validation errors
        console.error("Validation errors:", error.errors);
      }
    } else {
      // Handle other errors
      console.error("Unexpected error:", error);
    }
  }
};
```

### Using with React Components

```typescript
"use client";

import { useState, useEffect } from "react";
import { SalonAPI, ApiError } from "@/lib/services";
import type { Salon } from "@/lib/types/api";

export default function SalonsPage() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        setLoading(true);
        const response = await SalonAPI.getSalons({ verified: true });
        setSalons(response.data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {salons.map((salon) => (
        <div key={salon.id}>{salon.name}</div>
      ))}
    </div>
  );
}
```

---

## TypeScript Types

All types are available in `lib/types/api.ts`:

```typescript
import type {
  // Common
  ApiResponse,
  PaginationParams,
  PaginationResponse,

  // Address
  Address,
  CreateAddressData,
  UpdateAddressData,

  // Booking
  Booking,
  CreateBookingData,
  GetBookingsParams,
  AvailabilityData,

  // Product
  Product,
  CreateProductData,
  GetProductsParams,

  // Salon
  Salon,
  CreateSalonData,
  SearchSalonsParams,

  // Service
  Service,
  CreateServiceData,

  // Staff
  Staff,
  CreateStaffData,

  // User
  UserProfile,
  UpdateUserProfileData,
} from "@/lib/types/api";
```

---

## Notes

1. **Authentication**: All protected endpoints automatically use the JWT token from localStorage
2. **File Uploads**: Use File objects for images - the API client handles FormData conversion
3. **Pagination**: Most list endpoints support `page` and `limit` parameters
4. **CORS**: The proxy route handles CORS in development automatically
5. **Error Messages**: All errors include descriptive messages for debugging

For more details, refer to the API documentation provided for each endpoint.
