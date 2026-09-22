import type {
  CheckoutDraft,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
} from "@/types";
import { supabase } from "@/lib/supabase";

interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string;
  delivery_fee: number | string;
  subtotal: number | string;
  total_amount: number | string;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number | string;
  total_price: number | string;
  created_at: string;
}

const client = () => {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
};

const toNumber = (value: number | string) => Number(value);

const encodeDelivery = (draft: CheckoutDraft, areaName: string) =>
  JSON.stringify({
    areaName,
    address: draft.address.trim(),
    preferredDate: draft.preferredDate,
    notes: draft.notes.trim(),
  });

const decodeDelivery = (value: string): Order["delivery"] => {
  try {
    const parsed = JSON.parse(value) as Partial<Order["delivery"]>;
    if (parsed.address) {
      return {
        areaId: "",
        areaName: parsed.areaName || "",
        address: parsed.address,
        preferredDate: parsed.preferredDate || "",
        notes: parsed.notes || "",
      };
    }
  } catch {
    // Older or manually entered rows contain a plain address.
  }
  return {
    areaId: "",
    areaName: "",
    address: value,
    preferredDate: "",
    notes: "",
  };
};

const toOrder = (row: OrderRow, itemRows: OrderItemRow[]): Order => ({
  id: row.id,
  orderNumber: row.order_number,
  customer: {
    fullName: row.customer_name,
    phone: row.customer_phone,
    email: row.customer_email || undefined,
  },
  delivery: decodeDelivery(row.delivery_address),
  items: itemRows.map((item) => ({
    productId: item.product_id,
    name: item.product_name,
    quantity: item.quantity,
    unitPrice: toNumber(item.unit_price),
  })),
  subtotal: toNumber(row.subtotal),
  deliveryFee: toNumber(row.delivery_fee),
  total: toNumber(row.total_amount),
  status: row.status as OrderStatus,
  payment: {
    method: "bank_transfer",
    status: row.payment_status as PaymentStatus,
    amount: toNumber(row.total_amount),
  },
  createdAt: row.created_at,
});

const getItems = async (orderId: string) => {
  const { data, error } = await client()
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []) as OrderItemRow[];
};

const getOrderRow = async (column: "id" | "order_number", value: string) => {
  const { data, error } = await client()
    .from("orders")
    .select("*")
    .eq(column, value)
    .maybeSingle();
  if (error) throw error;
  return data as OrderRow | null;
};

export interface CreateOrderInput {
  draft: CheckoutDraft;
  areaName: string;
  items: OrderItem[];
  deliveryFee: number;
}

export async function createOrderItems(
  orderId: string,
  items: OrderItem[],
): Promise<void> {
  const itemPayload = items.map((item) => ({
    order_id: orderId,
    product_id: item.productId,
    product_name: item.name,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.unitPrice * item.quantity,
  }));
  const { error } = await client().from("order_items").insert(itemPayload);
  if (error) throw error;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  if (input.items.length === 0) throw new Error("Your cart is empty.");
  const response = await fetch("/api/orders/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      draft: input.draft,
      areaId: input.draft.areaId,
      items: input.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    }),
  });
  const result = (await response.json().catch(() => null)) as
    | {
        id?: string;
        orderNumber?: string;
        totalAmount?: number;
        customerEmail?: string;
      }
    | { error?: string }
    | null;
  if (!response.ok || !result || !("id" in result) || !result.id) {
    throw new Error(
      result && "error" in result && result.error
        ? result.error
        : "Could not create the order.",
    );
  }
  if (
    !result.orderNumber ||
    typeof result.totalAmount !== "number" ||
    !Number.isFinite(result.totalAmount)
  ) {
    throw new Error("The order response was incomplete.");
  }
  const orderId = result.id;
  const totalAmount = result.totalAmount;
  const subtotal = input.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  return toOrder(
    {
      id: orderId,
      order_number: result.orderNumber,
      customer_name: input.draft.fullName.trim(),
      customer_phone: input.draft.phone.trim(),
      customer_email: result.customerEmail || input.draft.email.trim(),
      delivery_address: encodeDelivery(input.draft, input.areaName),
      delivery_fee: input.deliveryFee,
      subtotal,
      total_amount: totalAmount,
      status: "new",
      payment_status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    input.items.map((item, index) => ({
      id: `new-${index}`,
      order_id: orderId,
      product_id: item.productId,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.unitPrice * item.quantity,
      created_at: new Date().toISOString(),
    })),
  );
}

export async function listOrders(): Promise<Order[]> {
  const { data, error } = await client()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return Promise.all(
    ((data || []) as OrderRow[]).map(async (row) =>
      toOrder(row, await getItems(row.id)),
    ),
  );
}

export async function getOrder(id: string): Promise<Order | null> {
  const row = await getOrderRow("id", id);
  return row ? toOrder(row, await getItems(row.id)) : null;
}

export async function getOrderByNumber(
  orderNumber: string,
): Promise<Order | null> {
  const row = await getOrderRow(
    "order_number",
    orderNumber.trim().toUpperCase(),
  );
  return row ? toOrder(row, await getItems(row.id)) : null;
}

export async function getOrderForCustomer(
  orderNumber: string,
  phone: string,
): Promise<Order | null> {
  const order = await getOrderByNumber(orderNumber);
  if (!order) return null;
  return order.customer.phone.replace(/\D/g, "") === phone.replace(/\D/g, "")
    ? order
    : null;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order | null> {
  const { data, error } = await client()
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data ? toOrder(data as OrderRow, await getItems(id)) : null;
}

export async function confirmOrderDelivery(id: string): Promise<Order | null> {
  const { data, error } = await client()
    .from("orders")
    .update({ status: "delivered", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "out_for_delivery")
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data ? toOrder(data as OrderRow, await getItems(id)) : null;
}
