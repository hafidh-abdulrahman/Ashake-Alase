import { useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Info } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { LoadingBlock } from "@/components/ui/PageState";
import { CartSummaryCard } from "@/components/order/CartSummaryCard";
import { CheckoutProgress } from "@/components/order/CheckoutProgress";
import { validateDraft } from "@/lib/validation";
import { formatNaira, formatPlainDate } from "@/lib/format";
import { createOrder } from "@/services/orderService";
import { initializePaystackTransaction } from "@/services/paystackService";
import type { Order } from "@/types";

export default function PaymentPage() {
  const {
    lines,
    ready,
    draft,
    areas,
    selectedArea,
    deliveryFee,
    total,
    clear,
  } = useCart();
  const placing = useRef(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!ready) return <LoadingBlock />;
  if (placing.current) return null;
  if (lines.length === 0) return <Navigate to="/cart" replace />;
  if (Object.keys(validateDraft(draft, areas)).length > 0 || !selectedArea)
    return <Navigate to="/checkout" replace />;

  const initializePayment = async (order: Order) => {
    setBusy(true);
    setSubmitError(null);
    try {
      const payment = await initializePaystackTransaction(order.id);
      placing.current = true;
      clear();
      window.location.href = payment.authorization_url;
    } catch {
      setSubmitError(
        `Order ${order.orderNumber} was created, but secure payment could not be initialized. Please try again.`,
      );
      setBusy(false);
    }
  };

  const placeOrder = async () => {
    if (createdOrder) {
      await initializePayment(createdOrder);
      return;
    }

    setBusy(true);
    setSubmitError(null);
    try {
      const order = await createOrder({
        draft,
        areaName: selectedArea.name,
        items: lines.map((l) => ({
          productId: l.product.id,
          name: l.product.name,
          unitPrice: l.product.price,
          quantity: l.quantity,
        })),
        deliveryFee: deliveryFee ?? 0,
      });
      setCreatedOrder(order);
      await initializePayment(order);
    } catch {
      setSubmitError(
        "We could not place your order. Check your connection and try again.",
      );
      setBusy(false);
    }
  };

  return (
    <div className="container-page pb-20 pt-6 lg:pb-28 lg:pt-12">
      <CheckoutProgress current={2} />
      <h1 className="text-[clamp(2.5rem,6vw,4.5rem)]">Payment</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div className="space-y-8">
          <section aria-labelledby="online-payment">
            <h2 id="online-payment" className="text-2xl font-bold">
              1. Secure online payment
            </h2>
            <p className="mt-2 text-ink-soft">
              Pay securely online for exactly{" "}
              <strong className="text-ink">{formatNaira(total)}</strong> to the
              payment provider at the next step.
            </p>
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-surface-alt/30 p-4 text-ink-soft">
              <Info
                className="mt-0.5 size-5 shrink-0 text-primary"
                aria-hidden
              />
              <p className="text-[0.95rem]">
                You will be redirected to Paystack&apos;s secure hosted checkout
                after your order is created.
              </p>
            </div>
          </section>

          <section aria-labelledby="place">
            <h2 id="place" className="text-2xl font-bold">
              2. Place your order
            </h2>
            <div className="mt-3 flex items-start gap-3 rounded-2xl bg-warn-bg p-4 text-warn">
              <Info className="mt-0.5 size-5 shrink-0" aria-hidden />
              <p className="text-[0.95rem]">
                Your order will be processed securely through the online payment
                provider.
              </p>
            </div>
            {submitError && (
              <p role="alert" className="mt-3 text-sm font-medium text-bad">
                {submitError}
              </p>
            )}
            <Button
              size="lg"
              full
              className="mt-4"
              onClick={placeOrder}
              loading={busy}
            >
              {busy
                ? "Preparing secure payment"
                : createdOrder
                  ? "Retry Secure Payment"
                  : `Place Order (${formatNaira(total)})`}
            </Button>
          </section>
        </div>

        <div className="space-y-6">
          <CartSummaryCard />
          <div className="rounded-3xl border border-line bg-paper p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold">Delivering to</h2>
              <Link
                to="/checkout"
                className="text-sm font-semibold underline underline-offset-4 hover:text-primary"
              >
                Edit
              </Link>
            </div>
            <p className="font-semibold">{draft.fullName}</p>
            <p className="text-ink-soft">{draft.phone}</p>
            <p className="mt-2">{draft.address}</p>
            <p className="text-ink-soft">{selectedArea.name}</p>
            <p className="mt-2 text-sm text-ink-soft">
              Preferred date: {formatPlainDate(draft.preferredDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
