export interface PaystackInitialization {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export async function initializePaystackTransaction(
  orderId: string,
): Promise<PaystackInitialization> {
  const response = await fetch("/api/paystack/initialize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  });

  const result = (await response.json().catch(() => null)) as
    | PaystackInitialization
    | { error?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      result && "error" in result && result.error
        ? result.error
        : `Secure payment could not be initialized (${response.status}).`,
    );
  }

  if (
    !result ||
    !("authorization_url" in result) ||
    !result.authorization_url ||
    !result.access_code ||
    !result.reference
  ) {
    throw new Error("Secure payment returned an incomplete response.");
  }

  return result as PaystackInitialization;
}
