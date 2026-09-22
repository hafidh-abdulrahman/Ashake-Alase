import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useOrder } from "@/hooks/useData";
import { Button } from "@/components/ui/Button";
import { EmptyState, LoadingBlock } from "@/components/ui/PageState";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/ui/StatusBadge";
import { OrderTracker } from "@/components/order/OrderTracker";
import { OrderTotals } from "@/components/order/OrderTotals";
import { SummaryLines } from "@/components/order/SummaryLines";
import { orderNextAction, orderStatusLabel } from "@/lib/orderMeta";
import { formatDateTime, formatPlainDate } from "@/lib/format";
import { updateOrderStatus } from "@/services/orderService";
import type { Order, OrderStatus } from "@/types";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-line bg-paper p-6">
      <h2 className="mb-5 text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}

export default function AdminOrderPage() {
  const { orderId } = useParams();
  const { data: order, loading, setData, reload } = useOrder(orderId);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!order) return;
    const timer = window.setInterval(reload, 15000);
    return () => window.clearInterval(timer);
  }, [order, reload]);

  if (loading) return <LoadingBlock label="Loading order" />;
  if (!order)
    return (
      <EmptyState
        title="Order not found"
        text="It may have been removed, or the demo data was reset."
        actionLabel="Back to orders"
        actionTo="/admin"
      />
    );

  const run = async (
    fn: () => Promise<Order | null>,
    successMessage: string,
  ) => {
    setBusy(true);
    setFeedback(null);
    try {
      const updated = await fn();
      if (updated) {
        setData(updated);
        setFeedback({ type: "success", message: successMessage });
      } else {
        setFeedback({
          type: "error",
          message:
            "The order could not be updated. Please refresh and try again.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "The order could not be updated. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };
  const action = orderNextAction[order.status];
  const advance = () => {
    if (!action.nextStatus || busy) return;
    if (action.confirmation && !window.confirm(action.confirmation)) return;
    run(
      () => updateOrderStatus(order.id, action.nextStatus as OrderStatus),
      `Order marked ${orderStatusLabel[action.nextStatus]}.`,
    );
  };
  return (
    <>
      <Link
        to="/admin"
        className="inline-flex items-center gap-1 rounded-full py-2 pr-3 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <ChevronLeft className="size-4" aria-hidden /> All orders
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="text-4xl md:text-5xl">{order.orderNumber}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-2 text-ink-soft">
        Placed {formatDateTime(order.createdAt)}
      </p>

      <div className="mt-8 rounded-3xl border border-line bg-paper p-6">
        <h2 className="mb-6 text-xl font-bold">Order status</h2>
        <OrderTracker status={order.status} />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          {action.nextStatus ? (
            <Button
              loading={busy}
              onClick={advance}
              className="w-full sm:w-auto"
            >
              {action.label}
            </Button>
          ) : (
            <p className="font-semibold text-ok">{action.label}</p>
          )}
        </div>
        {feedback && (
          <p
            role="status"
            className={`mt-4 text-sm font-semibold ${feedback.type === "success" ? "text-ok" : "text-bad"}`}
          >
            {feedback.message}
          </p>
        )}
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        <Card title="Customer">
          <dl className="space-y-3.5">
            <Row label="Full name">{order.customer.fullName}</Row>
            <Row label="Phone">
              <a
                href={`tel:${order.customer.phone}`}
                className="underline underline-offset-4"
              >
                {order.customer.phone}
              </a>
            </Row>
          </dl>
        </Card>

        <Card title="Delivery">
          <dl className="space-y-3.5">
            <Row label="Area">{order.delivery.areaName}</Row>
            <Row label="Address">{order.delivery.address}</Row>
            <Row label="Preferred date">
              {formatPlainDate(order.delivery.preferredDate)}
            </Row>
            <Row label="Notes">
              {order.delivery.notes || (
                <span className="text-ink-soft">None</span>
              )}
            </Row>
          </dl>
        </Card>

        <Card title="Items ordered">
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
        </Card>

        <Card title="Payment">
          <div className="flex flex-wrap items-center gap-3">
            <PaymentStatusBadge status={order.payment.status} />
            <span className="text-sm text-ink-soft">Secure online payment</span>
          </div>

          {order.payment.verifiedAt && (
            <p className="mt-4 text-sm text-ink-soft">
              Verified {formatDateTime(order.payment.verifiedAt)}
            </p>
          )}
        </Card>
      </div>
    </>
  );
}
