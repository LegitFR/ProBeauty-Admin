// ==================== Common Types ====================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  pagination?: PaginationResponse;
}

// ==================== Address Types ====================

export type AddressType = "Home" | "Work" | "Office" | "Other";

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType: AddressType;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType?: AddressType;
  isDefault?: boolean;
}

export interface UpdateAddressData {
  fullName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  addressType?: AddressType;
}

// ==================== Booking Types ====================

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export interface BookingUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePicture?: string;
}

export interface BookingSalon {
  id: string;
  name: string;
  address: string;
  phone?: string;
  thumbnail?: string;
  verified?: boolean;
}

export interface BookingService {
  id: string;
  title: string;
  durationMinutes: number;
  price: string;
  description?: string;
}

export interface BookingStaffUser {
  name: string;
  email: string;
}

export interface BookingStaff {
  id: string;
  role: string;
  user: BookingStaffUser;
}

export interface Booking {
  id: string;
  userId: string;
  salonId: string;
  serviceId: string;
  staffId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  user: BookingUser;
  salon: BookingSalon;
  service: BookingService;
  staff: BookingStaff;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  salonId: string;
  serviceId: string;
  staffId: string;
  startTime: string;
}

export interface UpdateBookingData {
  startTime?: string;
  staffId?: string;
  status?: BookingStatus;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface AvailabilityData {
  date: string;
  salon: {
    id: string;
    name: string;
  };
  service: {
    id: string;
    title: string;
    durationMinutes: number;
  };
  staff: {
    id: string;
    role: string;
  };
  slots: TimeSlot[];
}

export interface GetBookingsParams extends PaginationParams {
  salonId?: string;
  staffId?: string;
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
}

export interface GetAvailabilityParams {
  salonId: string;
  serviceId: string;
  staffId: string;
  date: string;
}

// ==================== Product Types ====================

export interface Product {
  id: string;
  salonId: string;
  title: string;
  sku: string;
  price: number;
  quantity: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  salonId: string;
  title: string;
  sku: string;
  price: string | number;
  quantity: string | number;
  images?: File[];
}

export interface UpdateProductData {
  title?: string;
  sku?: string;
  price?: string | number;
  quantity?: string | number;
  images?: File[];
}

export interface GetProductsParams extends PaginationParams {
  salonId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

// ==================== Salon Types ====================

export type VenueType = "male" | "female" | "everyone";

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface BusinessHours {
  open: string;
  close: string;
}

export interface SalonHours {
  monday?: BusinessHours;
  tuesday?: BusinessHours;
  wednesday?: BusinessHours;
  thursday?: BusinessHours;
  friday?: BusinessHours;
  saturday?: BusinessHours;
  sunday?: BusinessHours;
}

export interface SalonOwner {
  id: string;
  name: string;
  email: string;
}

export interface SalonStaffUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface StaffAvailabilitySlot {
  start: string;
  end: string;
}

export interface DayAvailability {
  isAvailable: boolean;
  slots?: StaffAvailabilitySlot[];
}

export interface StaffAvailability {
  monday?: DayAvailability;
  tuesday?: DayAvailability;
  wednesday?: DayAvailability;
  thursday?: DayAvailability;
  friday?: DayAvailability;
  saturday?: DayAvailability;
  sunday?: DayAvailability;
}

export interface SalonStaff {
  id: string;
  salonId: string;
  userId: string | null;
  name: string;
  image: string | null;
  availability: StaffAvailability;
  user?: SalonStaffUser;
}

export interface SalonService {
  id: string;
  title?: string;
  name?: string;
  price: number | string;
}

export interface SalonProduct {
  id: string;
  title: string;
  price: number;
}

export interface Salon {
  id: string;
  name: string;
  address: string;
  venueType: VenueType;
  phone: string;
  ownerId: string;
  verified: boolean;
  geo: GeoCoordinates | null;
  hours: SalonHours | null;
  thumbnail?: string;
  images?: string[];
  owner?: SalonOwner;
  staff: SalonStaff[];
  services: SalonService[];
  products: SalonProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSalonData {
  name: string;
  address: string;
  venueType?: VenueType;
  phone?: string;
  geo?: GeoCoordinates | string;
  hours?: SalonHours | string;
  thumbnail?: File;
  images?: File[];
}

export interface UpdateSalonData {
  name?: string;
  address?: string;
  venueType?: VenueType;
  phone?: string;
  geo?: GeoCoordinates | string;
  hours?: SalonHours | string;
  thumbnail?: File;
  images?: File[];
  verified?: boolean;
}

export interface GetSalonsParams extends PaginationParams {
  verified?: boolean;
}

export type SalonSortBy = "top_rated" | "recommended" | "nearest";
export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export interface SearchSalonsParams extends PaginationParams {
  venueType?: VenueType;
  maxPrice?: number;
  sortBy?: SalonSortBy;
  service?: string;
  location?: string;
  date?: string;
  time?: TimeOfDay;
  latitude?: number;
  longitude?: number;
}

export interface SearchSalonResult {
  id: string;
  name: string;
  venueType: VenueType;
  address: string;
  averageRating?: number;
  distanceKm?: number;
  services: SalonService[];
  geo: GeoCoordinates | null;
}

// ==================== Service Types ====================

export interface Service {
  id: string;
  salonId: string;
  title: string;
  category: string;
  durationMinutes: number;
  price: string;
  salon?: {
    id: string;
    name: string;
    address: string;
  };
}

export interface CreateServiceData {
  salonId: string;
  title: string;
  category: string;
  durationMinutes: number;
  price: number;
}

export interface UpdateServiceData {
  title?: string;
  category?: string;
  durationMinutes?: number;
  price?: number;
}

export interface GetServicesParams {
  salonId?: string;
}

// ==================== Staff Types ====================

export interface StaffServiceRelation {
  id: string;
  service: {
    id: string;
    title: string;
    price: number | string;
  };
}

export interface Staff {
  id: string;
  salonId: string;
  userId: string | null;
  name: string;
  image: string | null;
  availability: StaffAvailability;
  services: StaffServiceRelation[];
  salon?: {
    id: string;
    name: string;
    address?: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  bookings?: {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
  }[];
}

export interface CreateStaffData {
  salonId: string;
  serviceId: string;
  availability?: StaffAvailability;
  userId?: string;
}

export interface UpdateStaffData {
  serviceId?: string;
  availability?: StaffAvailability;
  userId?: string;
}

export interface GetStaffParams extends PaginationParams {
  salonId?: string;
}

// ==================== User Types ====================

export interface UserBooking {
  id: string;
  salonId: string;
  serviceId: string;
  staffId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
}

export interface Payment {
  id: string;
  provider: string;
  amount: string;
  status: string;
  txnId: string;
}

export interface Order {
  id: string;
  salonId: string;
  total: string;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
  payments: Payment[];
}

export interface CartItemProduct {
  id: string;
  title: string;
  price: string;
  images: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: CartItemProduct;
}

export interface Cart {
  id: string;
  cartItems: CartItem[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  bookings: UserBooking[];
  orders: Order[];
  cart: Cart | null;
  addresses: Address[];
}

export interface UpdateUserProfileData {
  name?: string;
  phone?: string;
}

export interface ChangeEmailRequestData {
  newEmail: string;
}

export interface ChangeEmailConfirmData {
  newEmail: string;
  otp: string;
}

// ==================== Order Types ====================

export type OrderStatus =
  | "PENDING"
  | "PAYMENT_PENDING"
  | "PAYMENT_FAILED"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderProduct {
  id: string;
  salonId: string;
  title: string;
  sku: string;
  price: string;
  quantity: number;
  images: string[];
}

export interface OrderItemDetail {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  product: OrderProduct;
}

export interface OrderSalon {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  verified: boolean;
}

export interface OrderDetail {
  id: string;
  userId: string;
  salonId: string;
  total: string;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  orderItems: OrderItemDetail[];
  salon?: OrderSalon;
}

export interface CreateOrderData {
  addressId: string;
  notes?: string;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
}

export interface GetOrdersParams extends PaginationParams {
  status?: OrderStatus;
  salonId?: string;
}
