import type {
  CheckoutDraft,
  Order,
  OrderItem,
  OrderStatus,
  PaymentReceipt,
} from "@/types";
import { mockOrders } from "@/data/mock/orders";
import { generateOrderNumber } from "@/lib/orderMeta";
import { readJson, removeKey, writeJson } from "@/lib/storage";
import { simulateLatency } from "./delay";

/**
 * Order data access.
 * Phase 1: orders live in this browser's localStorage, seeded with sample orders, so the whole
 * customer-to-admin flow can be demonstrated on one device.
 * Phase 2: replace each function with Supabase calls (orders + order_items + payments).
 * Admin functions (list, update, verify) will then be protected by Supabase Auth and row level security.
 */

const KEY = "aa:orders:v1";

const load = (): Order[] => {
  const stored = readJson<Order[] | null>(KEY, null);
  if (stored) return stored;
  writeJson(KEY, mockOrders);
  return mockOrders;
};
const save = (orders: Order[]) => writeJson(KEY, orders);

export interface CreateOrderInput {
  draft: CheckoutDraft;
  areaName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  receipt: PaymentReceipt;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  await simulateLatency(600);
  const total = input.subtotal + input.deliveryFee;
  const order: Order = {
    id: crypto.randomUUID(),
    orderNumber: generateOrderNumber(),
    customer: {
      fullName: input.draft.fullName.trim(),
      phone: input.draft.phone.trim(),
    },
    delivery: {
      areaId: input.draft.areaId,
      areaName: input.areaName,
      address: input.draft.address.trim(),
      preferredDate: input.draft.preferredDate,
      notes: input.draft.notes.trim(),
    },
    items: input.items,
    subtotal: input.subtotal,
    deliveryFee: input.deliveryFee,
    total,
    status: "awaiting_verification",
    payment: {
      method: "bank_transfer",
      status: "awaiting_verification",
      amount: total,
      receipt: input.receipt,
    },
    createdAt: new Date().toISOString(),
  };
  save([order, ...load()]);
  return order;
}

export async function listOrders(): Promise<Order[]> {
  await simulateLatency(200);
  return [...load()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrder(id: string): Promise<Order | null> {
  await simulateLatency(150);
  return load().find((o) => o.id === id) ?? null;
}

export async function getOrderByNumber(
  orderNumber: string,
): Promise<Order | null> {
  await simulateLatency(150);
  return load().find((o) => o.orderNumber === orderNumber) ?? null;
}

export async function getOrderForCustomer(
  orderNumber: string,
  phone: string,
): Promise<Order | null> {
  await simulateLatency(150);
  const normalizedPhone = phone.replace(/\D/g, "");
  return (
    load().find(
      (o) =>
        o.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase() &&
        o.customer.phone.replace(/\D/g, "") === normalizedPhone,
    ) ?? null
  );
}

const patch = (id: string, fn: (o: Order) => Order): Order | null => {
  const orders = load();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  orders[idx] = fn(orders[idx]);
  save(orders);
  return orders[idx];
};

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order | null> {
  await simulateLatency(150);
  return patch(id, (o) => {
    // Keep payment and order status consistent when an admin moves an order around the flow.
    if (status === "awaiting_verification") {
      return {
        ...o,
        status,
        payment: {
          ...o.payment,
          status: "awaiting_verification",
          verifiedAt: undefined,
        },
      };
    }
    if (o.payment.status !== "verified") {
      return {
        ...o,
        status,
        payment: {
          ...o.payment,
          status: "verified",
          verifiedAt: new Date().toISOString(),
        },
      };
    }
    return { ...o, status };
  });
}

/** Admin confirms the transfer landed. Marks payment verified and moves the order to Confirmed. */
export async function verifyPayment(id: string): Promise<Order | null> {
  await simulateLatency(200);
  return patch(id, (o) => ({
    ...o,
    status: o.status === "awaiting_verification" ? "confirmed" : o.status,
    payment: {
      ...o.payment,
      status: "verified",
      verifiedAt: new Date().toISOString(),
    },
  }));
}

/** Admin could not match the receipt to a transfer. Order stays in Awaiting Verification. */
export async function rejectPayment(id: string): Promise<Order | null> {
  await simulateLatency(200);
  return patch(id, (o) => ({
    ...o,
    payment: { ...o.payment, status: "rejected", verifiedAt: undefined },
  }));
}

export async function resetDemoOrders(): Promise<void> {
  removeKey(KEY);
}
