export type Role = 'admin' | 'seller' | 'customer';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: Role;
  addresses: Address[];
  wishlist: string[];
  tastingJournal: { productId: string; note: string; rating?: number; createdAt: string }[];
}

export interface Address {
  label?: string;
  line1?: string;
  line2?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
}

export interface ProductVariant {
  sku: string;
  weightGrams: number;
  price: number;
  currency: string;
  stock: number;
}

export interface Product {
  _id: string;
  sellerId: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  originCountry?: string;
  farmName?: string;
  variety?: string;
  altitudeMeters?: number;
  roastLevel?: string;
  processingMethod?: string;
  flavorNotes: string[];
  roastDate?: string;
  photos: string[];
  variants: ProductVariant[];
  status: string;
  ratingAverage: number;
  ratingCount: number;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  sellerVerified?: boolean;
  sellerName?: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface SellerCompany {
  _id: string;
  userId: string;
  companyName: string;
  slug: string;
  sellerType: string;
  description?: string;
  country?: string;
  deliveryCountries: string[];
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  verified: boolean;
  logoUrl?: string;
}

export interface Country {
  _id: string;
  name: string;
  slug: string;
  isoCode: string;
  region?: string;
  summary?: string;
  heroImageUrl?: string;
  isCoffeeOrigin: boolean;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  type: string;
  summary?: string;
  body?: string;
  countrySlug?: string;
  heroImageUrl?: string;
  tags: string[];
  status: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
}

export interface CartItem {
  productId: string;
  sellerId: string;
  sku: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
}

export interface OrderFulfillment {
  sellerId: string;
  status: 'pending' | 'shipped' | 'delivered';
  shipmentId?: string;
}

export interface Order {
  _id: string;
  items: CartItem[];
  shippingAddress: Address & { fullName: string };
  subtotal: number;
  shippingTotal: number;
  discountTotal: number;
  couponCode?: string;
  total: number;
  currency: string;
  status: string;
  payment: { provider: string; status: string; transactionId: string; paidAt: string };
  fulfillment: OrderFulfillment[];
  createdAt: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  body?: string;
  photos: string[];
  status: string;
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  active: boolean;
}

export interface Carrier {
  _id: string;
  name: string;
  trackingUrlTemplate?: string;
  active: boolean;
}

export interface Shipment {
  _id: string;
  orderId: string;
  sellerId: string;
  carrierName?: string;
  trackingNumber?: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  shippedAt?: string;
  deliveredAt?: string;
}

export interface TrackingEvent {
  _id: string;
  shipmentId: string;
  status: string;
  location?: string;
  note?: string;
  occurredAt: string;
}

export interface OrderTracking {
  shipment: Shipment;
  events: TrackingEvent[];
}

export interface ReturnRequest {
  _id: string;
  orderId: string;
  userId: string;
  sellerId: string;
  sku: string;
  reason: string;
  status: 'requested' | 'approved' | 'rejected' | 'refunded';
  refundAmount?: number;
  createdAt: string;
}

export interface Dispute {
  _id: string;
  orderId: string;
  userId: string;
  reason: string;
  description?: string;
  status: 'open' | 'resolved' | 'rejected';
  resolution?: string;
  createdAt: string;
}

export interface TicketReply {
  authorId: string;
  authorRole: string;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  _id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'closed';
  replies: TicketReply[];
  createdAt: string;
}

export interface AuditLogEntry {
  _id: string;
  actorId: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface SellerPayout {
  _id: string;
  sellerId: string;
  periodStart: string;
  periodEnd: string;
  grossSales: number;
  commissionRate: number;
  commissionAmount: number;
  netPayout: number;
  status: 'pending' | 'paid';
  paidAt?: string;
}

export interface ProductCollection {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  productIds: string[];
  isPublic: boolean;
}

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}
