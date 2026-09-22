/**
 * Client-safe Paystack configuration for the upcoming integration.
 * The secret key must remain server-side and is intentionally not read here.
 */
export const paystack = {
  publicKey:
    (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined) || "",
  testMode: true,
} as const;
