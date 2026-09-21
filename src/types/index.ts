/**
 * Domain types.
 * These mirror the tables planned for Supabase in Phase 2
 * (products, delivery_areas, orders, order_items, payments).
 * Money is always stored as whole naira (no kobo) to keep maths simple.
 */

export type ProductCategory = "combo" | "catering" | "food" | "event";

export interface ProductCampaign {
  /** Short label shown in the hero, e.g. "October 1st Special" */
  label: string;
  /** ISO date the campaign closes. Optional. */
  endsAt?: string;
}

export interface Product {
  id: string;
  name: string;
  /** One-line summary for cards */
  summary: string;
  description: string;
  /** Price in naira */
  price: number;
  /** Public path (e.g. /images/combo.jpg) or full URL. Falls back to a placeholder if it fails to load. */
  image: string;
  /** Placeholder artwork style used until a real photo exists */
  placeholder: "plate" | "grill" | "tray" | "box";
  /** Bullet list shown as "What's included" */
  includes: string[];
  /** Units still available. `null` means unlimited. */
  availableQuantity: number | null;
  /** Max units one customer can order at once */
  maxPerOrder: number;
  isActive: boolean;
  featured: boolean;
  category: ProductCategory;
  campaign?: ProductCampaign;
}

export interface DeliveryArea {
  id: string;
  name: string;
  /** Fee in naira */
  fee: number;
  isActive: boolean;
}

export type OrderStatus =
  | "awaiting_verification"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered";

export type PaymentStatus = "awaiting_verification" | "verified" | "rejected";

/** bank_transfer is live in Phase 1. Others are reserved for automated payments later. */
export type PaymentMethod = "bank_transfer" | "paystack" | "flutterwave";

export interface PaymentReceipt {
  fileName: string;
  fileType: string;
  fileSize: number;
  /** Small preview kept in the browser for the demo. In Phase 2 this becomes a Supabase Storage path. */
  previewDataUrl?: string;
}

export interface Payment {
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  receipt?: PaymentReceipt;
  /** Gateway reference (Paystack/Flutterwave) in a later phase */
  reference?: string;
  verifiedAt?: string;
}

export interface OrderItem {
  productId: string;
  /** Snapshot of the name and price at the time of order, so later edits never change old orders */
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
}

export interface DeliveryDetails {
  areaId: string;
  areaName: string;
  address: string;
  /** yyyy-mm-dd */
  preferredDate: string;
  notes: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerDetails;
  delivery: DeliveryDetails;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  payment: Payment;
  createdAt: string;
}

/** What the checkout form collects before an order exists */
export interface CheckoutDraft {
  fullName: string;
  phone: string;
  areaId: string;
  address: string;
  preferredDate: string;
  notes: string;
}

export interface CartLine {
  productId: string;
  quantity: number;
}
