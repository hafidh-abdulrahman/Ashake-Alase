import {
  CUSTOMER_ORDER_ERROR,
  getCustomerOrder,
  toCustomerOrderResponse,
} from "../_lib/customerOrder.js";

interface RequestBody {
  orderNumber?: unknown;
  phone?: unknown;
}

interface ResponseLike {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
}

export default async function handler(
  req: { method?: string; body?: unknown },
  res: ResponseLike,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const body = (req.body || {}) as RequestBody;
  const orderNumber =
    typeof body.orderNumber === "string" ? body.orderNumber : "";
  const phone = typeof body.phone === "string" ? body.phone : "";

  try {
    const result = await getCustomerOrder(orderNumber, phone);
    if (!result || result.order.status !== "out_for_delivery") {
      res.status(409).json({ error: CUSTOMER_ORDER_ERROR });
      return;
    }

    const updateUrl = new URL(`${result.config.url}/rest/v1/orders`);
    updateUrl.searchParams.set("id", `eq.${result.order.id}`);
    updateUrl.searchParams.set("status", "eq.out_for_delivery");
    const updateResponse = await fetch(updateUrl.toString(), {
      method: "PATCH",
      headers: {
        apikey: result.config.serviceRoleKey,
        Authorization: `Bearer ${result.config.serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        status: "delivered",
        updated_at: new Date().toISOString(),
      }),
    });
    if (!updateResponse.ok) throw new Error("Customer delivery update failed.");

    const updated = await getCustomerOrder(orderNumber, phone);
    if (!updated || updated.order.status !== "delivered") {
      throw new Error("Customer delivery update could not be verified.");
    }
    res.status(200).json(toCustomerOrderResponse(updated.order, updated.items));
  } catch (error) {
    console.error("[orders] customer delivery confirmation failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    res.status(409).json({ error: CUSTOMER_ORDER_ERROR });
  }
}
