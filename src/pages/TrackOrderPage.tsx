import { useEffect, useState, type FormEvent } from "react";
import { Search, Truck } from "lucide-react";
import { useCustomerOrder } from "@/hooks/useData";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { LoadingBlock } from "@/components/ui/PageState";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/ui/StatusBadge";
import { OrderTracker } from "@/components/order/OrderTracker";
import { OrderTotals } from "@/components/order/OrderTotals";
import { SummaryLines } from "@/components/order/SummaryLines";
import { formatDate, formatPlainDate } from "@/lib/format";
import { confirmOrderDelivery } from "@/services/orderService";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [lookupNumber, setLookupNumber] = useState<string>();
  const [lookupPhone, setLookupPhone] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const [confirmingDelivery, setConfirmingDelivery] = useState(false);
  const [deliveryFeedback, setDeliveryFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const {
    data: order,
    loading,
    setData,
    reload,
  } = useCustomerOrder(lookupNumber, lookupPhone);

  useEffect(() => {
    if (!order) return;
    const timer = window.setInterval(reload, 15000);
    return () => window.clearInterval(timer);
  }, [order, reload]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    setLookupNumber(orderNumber.trim());
    setLookupPhone(phone.trim());
  };

  const confirmDelivery = async () => {
    if (!order || order.status !== "out_for_delivery" || confirmingDelivery)
      return;
    setConfirmingDelivery(true);
    setDeliveryFeedback(null);
    try {
      const updated = await confirmOrderDelivery(
        order.orderNumber,
        lookupPhone ?? phone,
      );
      if (!updated) throw new Error("Order update returned no order.");
      setData(updated);
      setDeliveryFeedback({
        type: "success",
        message: "Thank you. Your order has been marked as delivered.",
      });
    } catch {
      setDeliveryFeedback({
        type: "error",
        message: "We could not confirm delivery. Please try again.",
      });
    } finally {
      setConfirmingDelivery(false);
    }
  };

  const notFound = submitted && !loading && !order;

  return (
    <div className="container-page pb-20 pt-8 lg:pb-28 lg:pt-14">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="eyebrow text-primary">Ashake delivery desk</p>
          <h1 className="mt-3 font-serif text-[clamp(3rem,8vw,6rem)]">
            Track your order.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
            Enter the order number and phone number used at checkout to see the
            latest update from our kitchen.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="mx-auto mt-10 grid gap-4 rounded-3xl border border-line bg-paper p-5 shadow-lift sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-6"
        >
          <TextField
            label="Order number"
            placeholder="AA-260921-4F7K"
            value={orderNumber}
            onChange={(event) => setOrderNumber(event.target.value)}
            required
          />
          <TextField
            label="Phone number"
            type="tel"
            inputMode="tel"
            placeholder="0801 234 5678"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
          <Button type="submit" size="lg" className="sm:mb-0.5">
            <Search className="size-5" aria-hidden /> Track order
          </Button>
        </form>

        {loading && submitted && <LoadingBlock label="Finding your order" />}
        {notFound && (
          <p
            className="mt-6 rounded-2xl border border-bad/30 bg-bad-bg p-5 text-center font-semibold text-bad"
            role="alert"
          >
            We couldn&apos;t find an order with those details. Check the order
            number and phone number, then try again.
          </p>
        )}

        {order && !loading && (
          <div className="mt-10 space-y-6">
            <section className="rounded-3xl bg-ink p-6 text-surface sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-surface/65">
                    Order received {formatDate(order.createdAt)}
                  </p>
                  <h2 className="mt-1 font-display text-3xl font-extrabold tracking-wide">
                    {order.orderNumber}
                  </h2>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="mt-8 overflow-x-auto pb-2">
                <OrderTracker status={order.status} />
              </div>
              {order.status === "out_for_delivery" && (
                <div className="mt-8 border-t border-surface/15 pt-6">
                  <p className="font-semibold">Have you received your order?</p>
                  <Button
                    type="button"
                    size="sm"
                    className="mt-4"
                    loading={confirmingDelivery}
                    onClick={confirmDelivery}
                  >
                    Yes, I received my order
                  </Button>
                  {deliveryFeedback && (
                    <p
                      role={
                        deliveryFeedback.type === "error" ? "alert" : "status"
                      }
                      className={`mt-3 text-sm font-semibold ${deliveryFeedback.type === "success" ? "text-ok" : "text-warn"}`}
                    >
                      {deliveryFeedback.message}
                    </p>
                  )}
                </div>
              )}
            </section>

            <div className="grid gap-6 md:grid-cols-2">
              <section className="rounded-3xl border border-line bg-paper p-6">
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
                    <Truck className="size-5" aria-hidden />
                  </span>
                  <h2 className="text-2xl font-bold">Delivery</h2>
                </div>
                <dl className="space-y-3.5">
                  <div>
                    <dt className="text-sm text-ink-soft">Delivering to</dt>
                    <dd className="font-semibold">{order.delivery.address}</dd>
                    <dd className="text-ink-soft">{order.delivery.areaName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-ink-soft">Preferred date</dt>
                    <dd className="font-semibold">
                      {formatPlainDate(order.delivery.preferredDate)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-ink-soft">Payment</dt>
                    <dd className="mt-1">
                      <PaymentStatusBadge status={order.payment.status} />
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-3xl border border-line bg-paper p-6">
                <h2 className="mb-5 text-2xl font-bold">Order details</h2>
                <SummaryLines
                  lines={order.items.map((item) => ({
                    key: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
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
            </div>
            <p className="text-center text-sm text-ink-soft">
              This page checks for updates every 15 seconds while open.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
