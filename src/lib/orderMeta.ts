import type { OrderStatus, PaymentStatus } from "@/types";

export const ORDER_FLOW: OrderStatus[] = [
  "new",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
];

export const LEGACY_ORDER_FLOW: OrderStatus[] = [
  "awaiting_verification",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
];

export const orderStatusLabel: Record<OrderStatus, string> = {
  new: "New",
  awaiting_verification: "Awaiting Verification",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready for delivery",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  pending: "Payment Pending",
  awaiting_verification: "Awaiting Payment Verification",
  verified: "Payment Verified",
  rejected: "Receipt Rejected",
};

export const nextStatus = (s: OrderStatus): OrderStatus | null =>
  ORDER_FLOW[ORDER_FLOW.indexOf(s) + 1] ?? null;
export const previousStatus = (s: OrderStatus): OrderStatus | null =>
  ORDER_FLOW[ORDER_FLOW.indexOf(s) - 1] ?? null;

/** Legacy local-demo order number generator. Supabase orders use ASH-XXXX. */
export const generateOrderNumber = () => {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++)
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `AA-${yy}${mm}${dd}-${suffix}`;
};
