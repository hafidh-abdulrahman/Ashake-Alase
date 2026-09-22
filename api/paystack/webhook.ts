import { createHmac, timingSafeEqual } from "node:crypto";

interface VercelRequestLike {
  method?: string;
  body?: unknown;
  rawBody?: string | Buffer;
  headers?: Record<string, string | string[] | undefined>;
}

interface VercelResponseLike {
  status: (code: number) => VercelResponseLike;
  json: (body: unknown) => void;
}

interface OrderRecord {
  id: string;
  order_number: string;
  customer_email: string | null;
  total_amount: number | string;
  payment_status: string;
}

interface PaystackVerifyResponse {
  status: boolean;
  message?: string;
  data?: {
    status?: string;
    reference?: string;
    amount?: number;
    currency?: string;
    customer?: { email?: string };
  };
}

const json = (res: VercelResponseLike, status: number, body: unknown) =>
  res.status(status).json(body);

const header = (req: VercelRequestLike, name: string) => {
  const value = req.headers?.[name] ?? req.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
};

const rawPayload = (req: VercelRequestLike) => {
  if (typeof req.rawBody === "string") return req.rawBody;
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody.toString("utf8");
  return typeof req.body === "string"
    ? req.body
    : JSON.stringify(req.body ?? {});
};

const signaturesMatch = (
  payload: string,
  signature: string,
  secret: string,
) => {
  const expected = createHmac("sha512", secret).update(payload).digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(signature, "hex");
  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
};

const supabaseRequest = async (url: string, key: string, init?: RequestInit) =>
  fetch(url, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

export default async function handler(
  req: VercelRequestLike,
  res: VercelResponseLike,
) {
  if (req.method !== "POST")
    return json(res, 405, { error: "Method not allowed." });

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const signature = header(req, "x-paystack-signature");

  if (!secretKey || !supabaseUrl || !supabaseKey || !signature) {
    console.warn(
      "[paystack] webhook rejected: missing configuration or signature",
    );
    return json(res, 401, { error: "Invalid webhook." });
  }

  const payload = rawPayload(req);
  if (!signaturesMatch(payload, signature, secretKey)) {
    console.warn("[paystack] webhook rejected: invalid signature");
    return json(res, 401, { error: "Invalid webhook." });
  }

  try {
    const event = JSON.parse(payload) as {
      event?: string;
      data?: { reference?: string };
    };
    if (event.event !== "charge.success" || !event.data?.reference) {
      return json(res, 200, { received: true });
    }

    const reference = event.data.reference;
    const orderUrl = new URL(`${supabaseUrl}/rest/v1/orders`);
    orderUrl.searchParams.set(
      "select",
      "id,order_number,customer_email,total_amount,payment_status",
    );
    orderUrl.searchParams.set("order_number", `eq.${reference}`);
    orderUrl.searchParams.set("limit", "1");

    const orderResponse = await supabaseRequest(
      orderUrl.toString(),
      supabaseKey,
    );
    if (!orderResponse.ok) {
      console.error("[paystack] webhook order lookup failed", {
        status: orderResponse.status,
        reference,
      });
      return json(res, 502, { error: "Order lookup failed." });
    }

    const orders = (await orderResponse.json()) as OrderRecord[];
    const order = orders[0];
    if (!order) return json(res, 404, { error: "Order not found." });
    if (order.payment_status === "paid") {
      return json(res, 200, { received: true, alreadyProcessed: true });
    }
    if (order.payment_status !== "pending") {
      console.warn("[paystack] webhook ignored for non-pending order", {
        reference,
        paymentStatus: order.payment_status,
      });
      return json(res, 200, { received: true });
    }

    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } },
    );
    const verification =
      (await verifyResponse.json()) as PaystackVerifyResponse;
    const transaction = verification.data;
    const expectedAmount = Math.round(Number(order.total_amount) * 100);
    const emailMatches =
      Boolean(order.customer_email) &&
      transaction?.customer?.email?.trim().toLowerCase() ===
        order.customer_email?.trim().toLowerCase();

    if (
      !verifyResponse.ok ||
      !verification.status ||
      transaction?.status !== "success" ||
      transaction.reference !== order.order_number ||
      transaction.currency !== "NGN" ||
      transaction.amount !== expectedAmount ||
      !emailMatches
    ) {
      console.warn("[paystack] webhook verification failed", {
        reference,
        verifyStatus: verifyResponse.status,
        transactionStatus: transaction?.status,
        amountMatches: transaction?.amount === expectedAmount,
        emailMatches,
      });
      return json(res, 200, { received: true });
    }

    const updateResponse = await supabaseRequest(
      `${supabaseUrl}/rest/v1/orders?id=eq.${encodeURIComponent(order.id)}&payment_status=eq.pending`,
      supabaseKey,
      {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ payment_status: "paid" }),
      },
    );
    if (!updateResponse.ok) {
      console.error("[paystack] webhook payment update failed", {
        status: updateResponse.status,
        reference,
        orderId: order.id,
      });
      return json(res, 502, { error: "Payment update failed." });
    }

    console.info("[paystack] payment confirmed", {
      reference,
      orderId: order.id,
      amountKobo: expectedAmount,
    });
    return json(res, 200, { received: true });
  } catch (error) {
    console.error("[paystack] webhook processing failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return json(res, 400, { error: "Invalid webhook payload." });
  }
}
