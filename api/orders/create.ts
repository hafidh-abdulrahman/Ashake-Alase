import { randomUUID } from "node:crypto";
import {
  getServerSupabaseConfig,
  supabaseServerRequest,
} from "../_lib/supabaseServer.js";

interface RequestBody {
  draft?: {
    fullName?: unknown;
    phone?: unknown;
    email?: unknown;
    address?: unknown;
    preferredDate?: unknown;
    notes?: unknown;
  };
  items?: unknown;
}

interface OrderItemInput {
  productId?: unknown;
  quantity?: unknown;
}

interface ProductRecord {
  id: string;
  name: string;
  price: number | string;
  stock_quantity: number | null;
  max_per_order: number | null;
  free_delivery: boolean;
  is_available: boolean;
}

interface ResponseLike {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
}

const jsonError = (res: ResponseLike, status: number, message: string) =>
  res.status(status).json({ error: message });

const isValidEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);
const isValidPhone = (value: string) =>
  /^(?:\+?234|0)[789][01]\d{8}$/.test(value.replace(/[\s\-()]/g, ""));

const isValidDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
};

const encodeDelivery = (
  address: string,
  preferredDate: string,
  notes: string,
) => JSON.stringify({ address, preferredDate, notes });

const getSupabaseRows = async <T>(
  url: string,
  serviceRoleKey: string,
): Promise<T[]> => {
  const response = await supabaseServerRequest(url, serviceRoleKey);
  if (!response.ok) throw new Error("Could not validate order details.");
  return (await response.json()) as T[];
};

const deleteOrder = async (url: string, serviceRoleKey: string) => {
  await supabaseServerRequest(url, serviceRoleKey, { method: "DELETE" });
};

const updateProductStock = async (
  baseUrl: string,
  serviceRoleKey: string,
  productId: string,
  expectedStock: number,
  nextStock: number,
) => {
  const url = new URL(`${baseUrl}/products`);
  url.searchParams.set("id", `eq.${productId}`);
  url.searchParams.set("stock_quantity", `eq.${expectedStock}`);
  url.searchParams.set("select", "id,stock_quantity");
  const response = await supabaseServerRequest(url.toString(), serviceRoleKey, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ stock_quantity: nextStock }),
  });
  if (!response.ok) return false;
  const rows = (await response.json()) as Array<{ id: string }>;
  return rows.length === 1;
};

export default async function handler(
  req: { method?: string; body?: unknown },
  res: ResponseLike,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const supabase = getServerSupabaseConfig();
  if (!supabase) {
    jsonError(res, 500, "Order service is not configured.");
    return;
  }

  const body = (req.body || {}) as RequestBody;
  const draft = body.draft;
  const items = Array.isArray(body.items) ? body.items : [];
  const fullName =
    typeof draft?.fullName === "string" ? draft.fullName.trim() : "";
  const phone = typeof draft?.phone === "string" ? draft.phone.trim() : "";
  const email = typeof draft?.email === "string" ? draft.email.trim() : "";
  const address =
    typeof draft?.address === "string" ? draft.address.trim() : "";
  const preferredDate =
    typeof draft?.preferredDate === "string" ? draft.preferredDate.trim() : "";
  const notes = typeof draft?.notes === "string" ? draft.notes.trim() : "";

  if (fullName.length < 3) {
    jsonError(res, 400, "A valid full name is required.");
    return;
  }
  if (!isValidPhone(phone)) {
    jsonError(res, 400, "A valid phone number is required.");
    return;
  }
  if (!isValidEmail(email)) {
    jsonError(res, 400, "A valid customer email is required.");
    return;
  }
  if (address.length < 8 || !isValidDate(preferredDate)) {
    jsonError(res, 400, "Valid delivery details are required.");
    return;
  }
  if (items.length === 0) {
    jsonError(res, 400, "At least one order item is required.");
    return;
  }

  const requestedItems = items as OrderItemInput[];
  const normalizedItems = requestedItems.map((item) => ({
    productId: typeof item.productId === "string" ? item.productId.trim() : "",
    quantity:
      typeof item.quantity === "number" && Number.isInteger(item.quantity)
        ? item.quantity
        : 0,
  }));
  if (
    normalizedItems.some((item) => !item.productId || item.quantity < 1) ||
    new Set(normalizedItems.map((item) => item.productId)).size !==
      normalizedItems.length
  ) {
    jsonError(res, 400, "The order items are invalid.");
    return;
  }

  const decrementedStocks: Array<{
    productId: string;
    previous: number;
    next: number;
  }> = [];

  try {
    const baseUrl = `${supabase.url}/rest/v1`;
    const productUrl = new URL(`${baseUrl}/products`);
    productUrl.searchParams.set(
      "select",
      "id,name,price,stock_quantity,max_per_order,free_delivery,is_available",
    );
    productUrl.searchParams.set(
      "id",
      `in.(${normalizedItems.map((item) => item.productId).join(",")})`,
    );
    productUrl.searchParams.set("is_available", "eq.true");

    const products = await getSupabaseRows<ProductRecord>(
      productUrl.toString(),
      supabase.serviceRoleKey,
    );
    const productsById = new Map(
      products.map((product) => [product.id, product]),
    );

    const snapshotItems = normalizedItems.map((item) => {
      const product = productsById.get(item.productId);
      if (!product) throw new Error("One or more products are unavailable.");
      if (
        product.max_per_order !== null &&
        item.quantity > product.max_per_order
      ) {
        throw new Error(
          `Only ${product.max_per_order} may be ordered at once.`,
        );
      }
      if (
        product.stock_quantity !== null &&
        item.quantity > product.stock_quantity
      ) {
        throw new Error(
          `Only ${product.stock_quantity} of ${product.name} is available.`,
        );
      }
      const unitPrice = Number(product.price);
      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        throw new Error("One or more product prices are invalid.");
      }
      return {
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: unitPrice * item.quantity,
        free_delivery: product.free_delivery,
      };
    });
    const subtotal = snapshotItems.reduce(
      (sum, item) => sum + item.total_price,
      0,
    );
    const deliveryFee = 0;
    const total = subtotal + deliveryFee;
    const orderId = randomUUID();
    for (const item of snapshotItems) {
      const product = productsById.get(item.product_id);
      if (!product || product.stock_quantity === null) continue;
      const next = product.stock_quantity - item.quantity;
      const changed = await updateProductStock(
        baseUrl,
        supabase.serviceRoleKey,
        product.id,
        product.stock_quantity,
        next,
      );
      if (!changed) throw new Error("Some items are no longer available.");
      decrementedStocks.push({
        productId: product.id,
        previous: product.stock_quantity,
        next,
      });
    }

    let orderNumber = "";
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const candidate = `ASH-${Math.floor(1000 + Math.random() * 9000)}`;
      const existingUrl = new URL(`${baseUrl}/orders`);
      existingUrl.searchParams.set("select", "id");
      existingUrl.searchParams.set("order_number", `eq.${candidate}`);
      existingUrl.searchParams.set("limit", "1");
      const existing = await getSupabaseRows<{ id: string }>(
        existingUrl.toString(),
        supabase.serviceRoleKey,
      );
      if (existing.length === 0) {
        orderNumber = candidate;
        break;
      }
    }
    if (!orderNumber)
      throw new Error("Unable to create a unique order number.");

    const orderUrl = `${baseUrl}/orders`;
    const orderResponse = await supabaseServerRequest(
      orderUrl,
      supabase.serviceRoleKey,
      {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          id: orderId,
          order_number: orderNumber,
          customer_name: fullName,
          customer_phone: phone,
          customer_email: email,
          delivery_address: encodeDelivery(address, preferredDate, notes),
          delivery_fee: deliveryFee,
          subtotal,
          total_amount: total,
          status: "new",
          payment_status: "pending",
        }),
      },
    );
    if (!orderResponse.ok) throw new Error("Could not create the order.");

    const itemResponse = await supabaseServerRequest(
      `${baseUrl}/order_items`,
      supabase.serviceRoleKey,
      {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(
          snapshotItems.map(({ free_delivery: _freeDelivery, ...item }) => ({
            ...item,
            order_id: orderId,
          })),
        ),
      },
    );
    if (!itemResponse.ok) {
      await deleteOrder(
        `${orderUrl}?id=eq.${orderId}`,
        supabase.serviceRoleKey,
      );
      throw new Error("Could not save the order items.");
    }

    res.status(201).json({
      id: orderId,
      orderNumber,
      totalAmount: total,
      customerEmail: email,
    });
  } catch (error) {
    for (const stock of decrementedStocks.reverse()) {
      await updateProductStock(
        `${supabase.url}/rest/v1`,
        supabase.serviceRoleKey,
        stock.productId,
        stock.next,
        stock.previous,
      );
    }
    const message =
      error instanceof Error ? error.message : "Could not create the order.";
    jsonError(res, 400, message);
  }
}
