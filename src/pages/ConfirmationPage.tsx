import { useState } from "react";
import { useParams } from "react-router-dom";
import { Check, Copy, Info } from "lucide-react";
import { useOrderByNumber } from "@/hooks/useData";
import { Button } from "@/components/ui/Button";
import { EmptyState, LoadingBlock } from "@/components/ui/PageState";
import { PaymentStatusBadge } from "@/components/ui/StatusBadge";
import { OrderTracker } from "@/components/order/OrderTracker";
import { OrderTotals } from "@/components/order/OrderTotals";
import { SummaryLines } from "@/components/order/SummaryLines";
import { formatPlainDate } from "@/lib/format";
import { paymentStatusLabel } from "@/lib/orderMeta";
import { Seo } from "@/components/Seo";

export default function ConfirmationPage() {
  const { orderNumber } = useParams();
  const { data: order, loading } = useOrderByNumber(orderNumber);
  const [copied, setCopied] = useState(false);
  const seo = (
    <Seo
      title="Order Confirmation | Ashake Alase"
      description="Your Ashake Alase order confirmation and delivery details."
      path={`/order/${orderNumber ?? ""}`}
      indexable={false}
    />
  );

  if (loading)
    return (
      <>
        {seo}
        <LoadingBlock label="Loading your order" />
      </>
    );
  if (!order)
    return (
      <>
        {seo}
        <EmptyState
          title="We can't find that order"
          text="Check the order number and try again."
          actionLabel="Back to home"
          actionTo="/"
        />
      </>
    );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="container-page pb-20 pt-8 lg:pb-28 lg:pt-14">
      {seo}
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <span className="grid size-16 shrink-0 animate-pop place-items-center rounded-full bg-ok text-white">
            <Check className="size-8" strokeWidth={3} aria-hidden />
          </span>
          <div>
            <h1 className="text-[clamp(2.5rem,7vw,4.25rem)]">Order placed</h1>
            <p className="mt-2 text-lg text-ink-soft">
              Thank you, {order.customer.fullName.split(" ")[0]}. We have
              received your order.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-ink p-6 text-surface">
          <div>
            <p className="text-sm text-surface/70">Order number</p>
            <p className="font-display text-3xl font-extrabold tracking-wide">
              {order.orderNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-full border-2 border-surface/40 px-4 py-2 text-sm font-semibold transition-colors hover:bg-surface hover:text-ink"
          >
            {copied ? (
              <Check className="size-4" aria-hidden />
            ) : (
              <Copy className="size-4" aria-hidden />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div
          className="mt-6 rounded-3xl bg-warn-bg p-6 text-warn"
          role="status"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Info className="size-5" aria-hidden />
            <h2 className="text-xl font-bold">
              {paymentStatusLabel[order.payment.status]}
            </h2>
          </div>
          <p className="mt-2">
            Your order has been received and its payment status is pending. Keep
            your order number handy for any questions.
          </p>
        </div>

        <section aria-labelledby="progress" className="mt-12">
          <h2 id="progress" className="mb-6 text-2xl font-bold">
            What happens next
          </h2>
          <OrderTracker status={order.status} />
        </section>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <section
            aria-labelledby="summary"
            className="rounded-3xl border border-line bg-paper p-6"
          >
            <h2 id="summary" className="mb-5 text-2xl font-bold">
              Order summary
            </h2>
            <SummaryLines
              lines={order.items.map((i) => ({
                key: i.productId,
                name: i.name,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
              }))}
            />
            <div className="mt-5 border-t border-line pt-5">
              <OrderTotals
                subtotal={order.subtotal}
                deliveryFee={order.deliveryFee}
                total={order.total}
              />
            </div>
          </section>

          <section
            aria-labelledby="delivery"
            className="rounded-3xl border border-line bg-paper p-6"
          >
            <h2 id="delivery" className="mb-5 text-2xl font-bold">
              Delivery information
            </h2>
            <dl className="space-y-3.5">
              <div>
                <dt className="text-sm text-ink-soft">Name and phone</dt>
                <dd className="font-semibold">
                  {order.customer.fullName}, {order.customer.phone}
                </dd>
                {order.customer.email && (
                  <dd className="text-ink-soft">{order.customer.email}</dd>
                )}
              </div>
              <div>
                <dt className="text-sm text-ink-soft">Address</dt>
                <dd className="font-semibold">{order.delivery.address}</dd>
              </div>
              {order.delivery.preferredDate && (
                <div>
                  <dt className="text-sm text-ink-soft">Preferred date</dt>
                  <dd className="font-semibold">
                    {formatPlainDate(order.delivery.preferredDate)}
                  </dd>
                </div>
              )}
              {order.delivery.notes && (
                <div>
                  <dt className="text-sm text-ink-soft">Notes</dt>
                  <dd>{order.delivery.notes}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-ink-soft">Payment</dt>
                <dd className="mt-1">
                  <PaymentStatusBadge status={order.payment.status} />
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button to="/" variant="dark">
            Back to home
          </Button>
          <Button to="/menu" variant="outline">
            Order something else
          </Button>
        </div>
      </div>
    </div>
  );
}
