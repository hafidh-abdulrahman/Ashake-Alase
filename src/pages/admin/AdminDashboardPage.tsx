import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "@/hooks/useData";
import { LoadingBlock } from "@/components/ui/PageState";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { ORDER_FLOW, orderStatusLabel } from "@/lib/orderMeta";
import { formatDate, formatNaira } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Order, OrderStatus } from "@/types";

const itemsSummary = (o: Order) => {
  const [first, ...rest] = o.items;
  return `${first.quantity} × ${first.name}${rest.length ? ` +${rest.length} more` : ""}`;
};

export default function AdminDashboardPage() {
  const { data: orders, loading } = useOrders();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const counts = useMemo(() => {
    const c = Object.fromEntries(ORDER_FLOW.map((s) => [s, 0])) as Record<
      OrderStatus,
      number
    >;
    orders?.forEach((o) => (c[o.status] += 1));
    return c;
  }, [orders]);

  if (loading || !orders) return <LoadingBlock label="Loading orders" />;

  const visible =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const stats: Array<{
    key: OrderStatus | "all";
    label: string;
    value: number;
  }> = [
    { key: "all", label: "Total Orders", value: orders.length },
    ...ORDER_FLOW.map((s) => ({
      key: s,
      label: orderStatusLabel[s],
      value: counts[s],
    })),
  ];

  const selectFilter = (nextFilter: OrderStatus | "all") => {
    setFilter(nextFilter);
    document
      .getElementById("admin-order-list")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-primary">Order control</p>
          <h1 className="mt-2 text-4xl md:text-5xl">Orders</h1>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
          <span>Orders stored in Supabase.</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => selectFilter(s.key)}
            aria-pressed={filter === s.key}
            className={cn(
              "rounded-2xl border-2 p-3 text-left transition-colors sm:p-4",
              filter === s.key
                ? "border-ink bg-ink text-surface"
                : "border-line bg-white hover:border-ink",
            )}
          >
            <span className="block font-display text-3xl font-extrabold tabular-nums sm:text-4xl">
              {s.value}
            </span>
            <span
              className={cn(
                "mt-1 block min-h-8 text-xs font-medium leading-4 sm:text-sm",
                filter === s.key ? "text-surface/80" : "text-ink-soft",
              )}
            >
              {s.label}
            </span>
          </button>
        ))}
      </div>

      <div
        id="admin-order-list"
        className="scroll-mt-6 flex items-center justify-between gap-3"
      >
        <h2 className="text-2xl font-bold">
          {filter === "all" ? "All orders" : orderStatusLabel[filter]}
        </h2>
        <span className="shrink-0 text-sm text-ink-soft">
          {visible.length} {visible.length === 1 ? "order" : "orders"}
        </span>
      </div>

      {visible.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-line p-8 text-center text-ink-soft">
          No orders with this status yet.
        </p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-5 hidden overflow-x-auto rounded-3xl border border-line bg-white lg:block">
            <table className="w-full text-left text-[0.95rem]">
              <thead className="border-b border-line bg-surface-alt/60 text-sm text-ink-soft">
                <tr>
                  {[
                    "Order",
                    "Customer",
                    "Phone",
                    "Items",
                    "Amount",
                    "Payment",
                    "Status",
                    "Date",
                    "",
                  ].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-semibold">
                      {h || <span className="sr-only">Actions</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.map((o) => (
                  <tr key={o.id} className="hover:bg-surface/70">
                    <td className="whitespace-nowrap px-4 py-4 font-semibold">
                      {o.orderNumber}
                    </td>
                    <td className="px-4 py-4">{o.customer.fullName}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-ink-soft">
                      {o.customer.phone}
                    </td>
                    <td className="max-w-56 px-4 py-4 text-ink-soft">
                      {itemsSummary(o)}
                    </td>
                    <td className="px-4 py-4 font-semibold tabular-nums">
                      {formatNaira(o.total)}
                    </td>
                    <td className="px-4 py-4">
                      <PaymentStatusBadge status={o.payment.status} short />
                    </td>
                    <td className="px-4 py-4">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-ink-soft">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button
                        to={`/admin/orders/${o.id}`}
                        size="sm"
                        variant="outline"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-3 lg:hidden">
            {visible.map((o) => (
              <li
                key={o.id}
                className="rounded-2xl border border-line bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">{o.orderNumber}</p>
                    <p className="break-words text-ink-soft">
                      {o.customer.fullName}
                    </p>
                  </div>
                  <p className="shrink-0 text-right font-display text-lg font-extrabold tabular-nums">
                    {formatNaira(o.total)}
                  </p>
                </div>
                <p className="mt-3 break-words text-sm text-ink-soft">
                  {itemsSummary(o)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <OrderStatusBadge status={o.status} />
                  <PaymentStatusBadge status={o.payment.status} short />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-ink-soft">
                    {formatDate(o.createdAt)}
                  </span>
                  <Link
                    to={`/admin/orders/${o.id}`}
                    className="rounded-full border-2 border-ink/80 px-4 py-1.5 text-sm font-semibold hover:bg-ink hover:text-surface"
                  >
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
