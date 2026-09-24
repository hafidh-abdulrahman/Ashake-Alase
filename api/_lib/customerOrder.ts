import {
  getServerSupabaseConfig,
  supabaseServerRequest,
} from "./supabaseServer.js";

interface CustomerOrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_fee: number | string;
  subtotal: number | string;
  total_amount: number | string;
  status: string;
  payment_status: string;
  created_at: string;
}

interface CustomerOrderItemRow {
  product_name: string;
  quantity: number;
  unit_price: number | string;
}

export interface CustomerOrderResponse {
  orderNumber: string;
  customerName: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  delivery: {
    address: string;
    preferredDate: string;
    notes: string;
  };
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export const CUSTOMER_ORDER_ERROR =
  "We could not find an order with those details.";

const phonePattern = /^(?:\+?234|0)[789][01]\d{8}$/;

export const normalizePhone = (value: string) => {
  const compact = value.replace(/[\s\-()]/g, "");
  if (!phonePattern.test(compact)) return null;
  const digits = compact.replace(/^\+/, "");
  return digits.startsWith("234") ? digits : `234${digits.slice(1)}`;
};

const phoneCandidates = (phone: string, normalizedPhone: string) => [
  ...new Set([
    phone,
    phone.replace(/\D/g, ""),
    normalizedPhone,
    `+${normalizedPhone}`,
    `0${normalizedPhone.slice(3)}`,
  ]),
];

const parseDelivery = (value: string) => {
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return {
      address: typeof parsed.address === "string" ? parsed.address : "",
      preferredDate:
        typeof parsed.preferredDate === "string" ? parsed.preferredDate : "",
      notes: typeof parsed.notes === "string" ? parsed.notes : "",
    };
  } catch {
    return { address: value, preferredDate: "", notes: "" };
  }
};

const numberValue = (value: number | string) => Number(value);

export const getCustomerOrder = async (orderNumber: string, phone: string) => {
  const config = getServerSupabaseConfig();
  const normalizedPhone = normalizePhone(phone);
  const normalizedOrderNumber = orderNumber.trim().toUpperCase();
  if (
    !config ||
    !normalizedPhone ||
    !normalizedOrderNumber ||
    normalizedOrderNumber.length > 32
  ) {
    return null;
  }

  const baseUrl = `${config.url}/rest/v1`;
  const orderUrl = new URL(`${baseUrl}/orders`);
  orderUrl.searchParams.set(
    "select",
    "id,order_number,customer_name,customer_phone,delivery_address,delivery_fee,subtotal,total_amount,status,payment_status,created_at",
  );
  orderUrl.searchParams.set("order_number", `eq.${normalizedOrderNumber}`);
  orderUrl.searchParams.set(
    "customer_phone",
    `in.(${phoneCandidates(phone, normalizedPhone).join(",")})`,
  );
  orderUrl.searchParams.set("limit", "1");

  const orderResponse = await supabaseServerRequest(
    orderUrl.toString(),
    config.serviceRoleKey,
  );
  if (!orderResponse.ok) throw new Error("Customer order lookup failed.");
  const orders = (await orderResponse.json()) as CustomerOrderRow[];
  const order = orders.find(
    (candidate) => normalizePhone(candidate.customer_phone) === normalizedPhone,
  );
  if (!order) return null;

  const itemUrl = new URL(`${baseUrl}/order_items`);
  itemUrl.searchParams.set("select", "product_name,quantity,unit_price");
  itemUrl.searchParams.set("order_id", `eq.${order.id}`);
  itemUrl.searchParams.set("order", "created_at.asc");
  const itemResponse = await supabaseServerRequest(
    itemUrl.toString(),
    config.serviceRoleKey,
  );
  if (!itemResponse.ok) throw new Error("Customer order items lookup failed.");
  const items = (await itemResponse.json()) as CustomerOrderItemRow[];

  return { config, order, items };
};

export const toCustomerOrderResponse = (
  order: CustomerOrderRow,
  items: CustomerOrderItemRow[],
): CustomerOrderResponse => ({
  orderNumber: order.order_number,
  customerName: order.customer_name,
  status: order.status,
  paymentStatus: order.payment_status,
  subtotal: numberValue(order.subtotal),
  deliveryFee: numberValue(order.delivery_fee),
  total: numberValue(order.total_amount),
  delivery: parseDelivery(order.delivery_address),
  createdAt: order.created_at,
  items: items.map((item) => ({
    name: item.product_name,
    quantity: item.quantity,
    unitPrice: numberValue(item.unit_price),
  })),
});
