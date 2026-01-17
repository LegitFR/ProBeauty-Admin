/**
 * Offer Type Definitions
 */

export type OfferType = "salon" | "product" | "service";
export type DiscountType = "percentage" | "flat";

export interface Offer {
  id: string;
  salonId: string;
  title: string;
  description: string | null;
  offerType: OfferType;
  productId: string | null;
  serviceId: string | null;
  discountType: DiscountType;
  discountValue: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  salon?: {
    id: string;
    name: string;
    address?: string;
  };
  product?: {
    id: string;
    title: string;
    price?: string;
  } | null;
  service?: {
    id: string;
    title: string;
    price?: string;
  } | null;
}

export interface OfferListResponse {
  message: string;
  data: Offer[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OfferResponse {
  message: string;
  data: Offer;
}

export interface CreateOfferParams {
  salonId: string;
  title: string;
  description?: string;
  offerType: OfferType;
  productId?: string;
  serviceId?: string;
  discountType: DiscountType;
  discountValue: string;
  startsAt: string;
  endsAt: string;
  image?: File;
}

export interface UpdateOfferParams {
  title?: string;
  description?: string;
  discountValue?: string;
  startsAt?: string;
  endsAt?: string;
  image?: File;
}

export interface OfferListParams {
  salonId?: string;
  productId?: string;
  serviceId?: string;
  activeOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface ValidateOfferParams {
  offerId: string;
  amount: string;
  salonId: string;
  productId?: string;
  serviceId?: string;
}

export interface ValidateOfferResponse {
  message: string;
  data: {
    valid: boolean;
    discountAmount: number;
    finalAmount: number;
  };
  error?: string;
}
