# API Quick Reference

Quick reference for all available API functions.

## Import

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

---

## 📍 Address API

| Function                  | Parameters                      | Returns     | Auth |
| ------------------------- | ------------------------------- | ----------- | ---- |
| `getAddresses()`          | -                               | `Address[]` | ✅   |
| `getAddressById(id)`      | `id: string`                    | `Address`   | ✅   |
| `createAddress(data)`     | `CreateAddressData`             | `Address`   | ✅   |
| `updateAddress(id, data)` | `id: string, UpdateAddressData` | `Address`   | ✅   |
| `deleteAddress(id)`       | `id: string`                    | `void`      | ✅   |
| `setDefaultAddress(id)`   | `id: string`                    | `Address`   | ✅   |

---

## 📅 Booking API

| Function                    | Parameters                      | Returns            | Auth |
| --------------------------- | ------------------------------- | ------------------ | ---- |
| `getBookings(params?)`      | `GetBookingsParams?`            | `Booking[]`        | ✅   |
| `getBookingById(id)`        | `id: string`                    | `Booking`          | ✅   |
| `getAvailableSlots(params)` | `GetAvailabilityParams`         | `AvailabilityData` | ❌   |
| `createBooking(data)`       | `CreateBookingData`             | `Booking`          | ✅   |
| `updateBooking(id, data)`   | `id: string, UpdateBookingData` | `Booking`          | ✅   |
| `cancelBooking(id)`         | `id: string`                    | `Booking`          | ✅   |
| `confirmBooking(id)`        | `id: string`                    | `Booking`          | ✅   |
| `completeBooking(id)`       | `id: string`                    | `Booking`          | ✅   |

---

## 🛍️ Product API

| Function                               | Parameters                            | Returns     | Auth |
| -------------------------------------- | ------------------------------------- | ----------- | ---- |
| `getProducts(params?)`                 | `GetProductsParams?`                  | `Product[]` | ❌   |
| `getProductsBySalon(salonId, params?)` | `salonId: string, GetProductsParams?` | `Product[]` | ❌   |
| `getProductById(id)`                   | `id: string`                          | `Product`   | ❌   |
| `createProduct(data)`                  | `CreateProductData`                   | `Product`   | ✅   |
| `updateProduct(id, data)`              | `id: string, UpdateProductData`       | `Product`   | ✅   |
| `deleteProduct(id)`                    | `id: string`                          | `void`      | ✅   |

---

## 💈 Salon API

| Function                | Parameters                    | Returns               | Auth |
| ----------------------- | ----------------------------- | --------------------- | ---- |
| `getSalons(params?)`    | `GetSalonsParams?`            | `Salon[]`             | ❌   |
| `searchSalons(params)`  | `SearchSalonsParams`          | `SearchSalonResult[]` | ❌   |
| `getMySalons(params?)`  | `GetSalonsParams?`            | `Salon[]`             | ✅   |
| `getSalonById(id)`      | `id: string`                  | `Salon`               | ❌   |
| `createSalon(data)`     | `CreateSalonData`             | `Salon`               | ✅   |
| `updateSalon(id, data)` | `id: string, UpdateSalonData` | `Salon`               | ✅   |
| `deleteSalon(id)`       | `id: string`                  | `void`                | ✅   |

---

## ✂️ Service API

| Function                  | Parameters                      | Returns     | Auth |
| ------------------------- | ------------------------------- | ----------- | ---- |
| `getServices(params?)`    | `GetServicesParams?`            | `Service[]` | ❌   |
| `getServiceById(id)`      | `id: string`                    | `Service`   | ❌   |
| `createService(data)`     | `CreateServiceData`             | `Service`   | ✅   |
| `updateService(id, data)` | `id: string, UpdateServiceData` | `Service`   | ✅   |
| `deleteService(id)`       | `id: string`                    | `void`      | ✅   |

---

## 👥 Staff API

| Function                            | Parameters                         | Returns   | Auth |
| ----------------------------------- | ---------------------------------- | --------- | ---- |
| `getAllStaff(params?)`              | `GetStaffParams?`                  | `Staff[]` | ❌   |
| `getStaffBySalon(salonId, params?)` | `salonId: string, GetStaffParams?` | `Staff[]` | ❌   |
| `getStaffById(id)`                  | `id: string`                       | `Staff`   | ❌   |
| `createStaff(data)`                 | `CreateStaffData`                  | `Staff`   | ✅   |
| `updateStaff(id, data)`             | `id: string, UpdateStaffData`      | `Staff`   | ✅   |
| `deleteStaff(id)`                   | `id: string`                       | `void`    | ✅   |

---

## 👤 User API

| Function                   | Parameters               | Returns                 | Auth |
| -------------------------- | ------------------------ | ----------------------- | ---- |
| `getUserProfile()`         | -                        | `{ user: UserProfile }` | ✅   |
| `updateUserProfile(data)`  | `UpdateUserProfileData`  | `UserProfile`           | ✅   |
| `requestEmailChange(data)` | `ChangeEmailRequestData` | `void`                  | ✅   |
| `confirmEmailChange(data)` | `ChangeEmailConfirmData` | `UserProfile`           | ✅   |

---

## Common Parameters

### Pagination

```typescript
{
  page?: number;      // Default: 1
  limit?: number;     // Default: 10
}
```

### Booking Filters

```typescript
{
  salonId?: string;
  staffId?: string;
  status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  startDate?: string;  // ISO 8601
  endDate?: string;    // ISO 8601
}
```

### Product Filters

```typescript
{
  salonId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}
```

### Salon Search

```typescript
{
  venueType?: "male" | "female" | "everyone";
  maxPrice?: number;
  sortBy?: "top_rated" | "recommended" | "nearest";
  service?: string;
  location?: string;
  date?: string;       // YYYY-MM-DD
  time?: "morning" | "afternoon" | "evening" | "night";
  latitude?: number;
  longitude?: number;
}
```

---

## Response Format

All responses follow this structure:

```typescript
{
  message: string;
  data: T;              // Your data
  pagination?: {        // For list endpoints
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
}
```

---

## Error Handling

```typescript
import { ApiError } from "@/lib/services";

try {
  const result = await SalonAPI.getSalons();
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.status); // HTTP status code
    console.log(error.message); // Error message
    console.log(error.errors); // Validation errors (if any)
  }
}
```

---

## Common Patterns

### Fetch and Display

```typescript
const { data } = await SalonAPI.getSalons();
data.forEach((salon) => console.log(salon.name));
```

### Create with Files

```typescript
const formData = {
  title: "Product",
  price: 999,
  images: [file1, file2], // File objects
};
await ProductAPI.createProduct(formData);
```

### Pagination

```typescript
const page1 = await ProductAPI.getProducts({ page: 1, limit: 10 });
console.log(`Showing ${page1.data.length} of ${page1.pagination.total}`);
```

### Filter Data

```typescript
const verified = await SalonAPI.getSalons({ verified: true });
const inStock = await ProductAPI.getProducts({ inStock: true });
const confirmed = await BookingAPI.getBookings({ status: "CONFIRMED" });
```

---

## File Uploads

For endpoints that support file uploads (Product, Salon):

```typescript
// Get file from input
const fileInput = document.querySelector('input[type="file"]');
const files = fileInput.files;

// Pass File objects directly
await ProductAPI.createProduct({
  title: "Product Name",
  images: Array.from(files),
});
```

The API client automatically handles:

- Converting to FormData
- Setting correct content-type
- Uploading files

---

## Authentication

Token is automatically handled:

- Stored in `localStorage.accessToken`
- Automatically included in requests
- No manual token management needed

Functions marked with ✅ require authentication.
Functions marked with ❌ are public endpoints.
