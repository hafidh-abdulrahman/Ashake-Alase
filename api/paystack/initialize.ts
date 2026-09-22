interface RequestBody {
  orderId?: unknown;
}

interface VercelRequestLike {
  method?: string;
  body?: unknown;
}

interface VercelResponseLike {
  status: (code: number) => VercelResponseLike;
  json: (body: unknown) => void;
  end: () => void;
}

interface OrderRecord {
  id: string;
  order_number: string;
  customer_email: string | null;
  total_amount: number | string;
  payment_status: string;
}

interface PaystackResponse {
  status: boolean;
  message?: string;
  data?: {
    authorization_url?: string;
    access_code?: string;
    reference?: string;
  };
}

import {
  getServerSupabaseConfig,
  supabaseServerRequest,
} from "../_lib/supabaseServer.js";

const jsonError = (res: VercelResponseLike, status: number, message: string) =>
  res.status(status).json({ error: message });

const safeErrorMessage = (value: unknown) =>
  value instanceof Error ? value.message : "Unknown error";

export default async function handler(
  req: VercelRequestLike,
  res: VercelResponseLike,
) {
  console.info("[paystack] initialize request", { method: req.method });
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const supabase = getServerSupabaseConfig();

  if (!secretKey || !supabase) {
    console.error("[paystack] missing server configuration", {
      hasSecretKey: Boolean(secretKey),
      hasSupabaseUrl: Boolean(supabase?.url),
      hasServiceRoleKey: Boolean(supabase?.serviceRoleKey),
    });
    jsonError(res, 500, "Payment service is not configured.");
    return;
  }

  const body = (req.body || {}) as RequestBody;
  if (typeof body.orderId !== "string" || !body.orderId.trim()) {
    console.warn("[paystack] invalid request body", { hasOrderId: false });
    jsonError(res, 400, "A valid order is required.");
    return;
  }

  const orderId = body.orderId.trim();
  console.info("[paystack] order lookup", { orderId });

  try {
    const orderUrl = new URL(`${supabase.url}/rest/v1/orders`);
    orderUrl.searchParams.set(
      "select",
      "id,order_number,customer_email,total_amount,payment_status",
    );
    orderUrl.searchParams.set("id", `eq.${orderId}`);
    orderUrl.searchParams.set("limit", "1");

    const orderResponse = await supabaseServerRequest(
      orderUrl.toString(),
      supabase.serviceRoleKey,
    );
    if (!orderResponse.ok) {
      const responseBody = await orderResponse.text();
      console.error("[paystack] Supabase order lookup failed", {
        status: orderResponse.status,
        body: responseBody.slice(0, 1000),
        orderId,
      });
      throw new Error("Order lookup failed.");
    }

    const orders = (await orderResponse.json()) as OrderRecord[];
    const order = orders[0];
    if (!order) {
      console.warn("[paystack] order not found", { orderId });
      jsonError(res, 404, "Order could not be found.");
      return;
    }

    const email = order.customer_email?.trim();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      console.warn("[paystack] invalid customer email", { orderId });
      jsonError(res, 400, "A valid customer email is required for payment.");
      return;
    }

    if (order.payment_status !== "pending") {
      console.warn("[paystack] order is not pending", {
        orderId,
        paymentStatus: order.payment_status,
      });
      jsonError(res, 409, "This order is not ready for payment.");
      return;
    }

    const total = Number(order.total_amount);
    if (!Number.isFinite(total) || total <= 0) {
      console.warn("[paystack] invalid order total", {
        orderId,
        totalAmount: order.total_amount,
      });
      jsonError(res, 400, "The order amount is invalid.");
      return;
    }

    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(total * 100),
          currency: "NGN",
          reference: order.order_number,
          metadata: {
            order_id: order.id,
            order_number: order.order_number,
          },
        }),
      },
    );

    const result = (await paystackResponse.json()) as PaystackResponse;
    if (!paystackResponse.ok || !result.status || !result.data) {
      console.error("[paystack] initialization rejected", {
        status: paystackResponse.status,
        response: result,
        orderId,
        amountKobo: Math.round(total * 100),
      });
      throw new Error(result.message || "Paystack initialization failed.");
    }

    const { authorization_url, access_code, reference } = result.data;
    if (!authorization_url || !access_code || !reference) {
      throw new Error("Paystack returned an incomplete response.");
    }

    res.status(200).json({ authorization_url, access_code, reference });
  } catch (error) {
    console.error("[paystack] initialization error", {
      orderId,
      message: safeErrorMessage(error),
    });
    jsonError(res, 502, safeErrorMessage(error));
  }
}
