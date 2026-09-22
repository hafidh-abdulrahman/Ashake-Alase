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
  areaId?: unknown;
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
  is_available: boolean;
}

interface DeliveryAreaRecord {
  id: string;
  area_name: string;
  delivery_fee: number | string;
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
  areaName: string,
  address: string,
  preferredDate: string,
  notes: string,
) => JSON.stringify({ areaName, address, preferredDate, notes });

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
  const areaId = typeof body.areaId === "string" ? body.areaId.trim() : "";
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
  if (!areaId || address.length < 8 || !isValidDate(preferredDate)) {
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
    normalizedItems.some(
      (item) => !item.productId || item.quantity < 1 || item.quantity > 100,
    ) ||
    new Set(normalizedItems.map((item) => item.productId)).size !==
      normalizedItems.length
  ) {
    jsonError(res, 400, "The order items are invalid.");
    return;
  }

  try {
    const baseUrl = `${supabase.url}/rest/v1`;
    const productUrl = new URL(`${baseUrl}/products`);
    productUrl.searchParams.set(
      "select",
      "id,name,price,stock_quantity,is_available",
    );
    productUrl.searchParams.set(
      "id",
      `in.(${normalizedItems.map((item) => item.productId).join(",")})`,
    );
    productUrl.searchParams.set("is_available", "eq.true");

    const areaUrl = new URL(`${baseUrl}/delivery_areas`);
    areaUrl.searchParams.set(
      "select",
      "id,area_name,delivery_fee,is_available",
    );
    areaUrl.searchParams.set("id", `eq.${areaId}`);
    areaUrl.searchParams.set("is_available", "eq.true");
    areaUrl.searchParams.set("limit", "1");

    const [products, areas] = await Promise.all([
      getSupabaseRows<ProductRecord>(
        productUrl.toString(),
        supabase.serviceRoleKey,
      ),
      getSupabaseRows<DeliveryAreaRecord>(
        areaUrl.toString(),
        supabase.serviceRoleKey,
      ),
    ]);
    const productsById = new Map(
      products.map((product) => [product.id, product]),
    );
    const area = areas[0];
    if (!area) {
      jsonError(res, 400, "The selected delivery area is unavailable.");
      return;
    }

    const snapshotItems = normalizedItems.map((item) => {
      const product = productsById.get(item.productId);
      if (!product) throw new Error("One or more products are unavailable.");
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
      };
    });
    const subtotal = snapshotItems.reduce(
      (sum, item) => sum + item.total_price,
      0,
    );
    const deliveryFee = Number(area.delivery_fee);
    if (!Number.isFinite(deliveryFee) || deliveryFee < 0) {
      throw new Error("The delivery fee is invalid.");
    }
    const total = subtotal + deliveryFee;
    const orderId = randomUUID();

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
          delivery_address: encodeDelivery(
            area.area_name,
            address,
            preferredDate,
            notes,
          ),
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
          snapshotItems.map((item) => ({ ...item, order_id: orderId })),
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
    const message =
      error instanceof Error ? error.message : "Could not create the order.";
    jsonError(res, 400, message);
  }
}
