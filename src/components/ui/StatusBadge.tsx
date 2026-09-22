import type { OrderStatus, PaymentStatus } from "@/types";
import { orderStatusLabel, paymentStatusLabel } from "@/lib/orderMeta";
import { cn } from "@/lib/cn";

const orderStyles: Record<OrderStatus, string> = {
  new: "bg-info-bg text-info",
  awaiting_verification: "bg-warn-bg text-warn",
  confirmed: "bg-info-bg text-info",
  preparing: "bg-flame-bg text-flame",
  ready: "bg-accent/25 text-warn",
  out_for_delivery: "bg-violet-bg text-violet",
  delivered: "bg-ok-bg text-ok",
};
const paymentStyles: Record<PaymentStatus, string> = {
  pending: "bg-warn-bg text-warn",
  awaiting_verification: "bg-warn-bg text-warn",
  verified: "bg-ok-bg text-ok",
  rejected: "bg-bad-bg text-bad",
  paid: "bg-ok-bg text-ok",
};
const base =
  "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold";

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => (
  <span className={cn(base, orderStyles[status])}>
    {orderStatusLabel[status]}
  </span>
);

export const PaymentStatusBadge = ({
  status,
  short,
}: {
  status: PaymentStatus;
  short?: boolean;
}) => (
  <span className={cn(base, paymentStyles[status])}>
    {short && status === "awaiting_verification"
      ? "Awaiting Verification"
      : paymentStatusLabel[status]}
  </span>
);
