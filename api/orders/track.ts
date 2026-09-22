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
    if (!result) {
      res.status(404).json({ error: CUSTOMER_ORDER_ERROR });
      return;
    }
    res.status(200).json(toCustomerOrderResponse(result.order, result.items));
  } catch (error) {
    console.error("[orders] customer tracking failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    res.status(404).json({ error: CUSTOMER_ORDER_ERROR });
  }
}
