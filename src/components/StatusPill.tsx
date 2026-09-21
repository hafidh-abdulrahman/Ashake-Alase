const orderTone: Record<string, string> = {
  "Awaiting Verification": "bg-gold-light/20 text-gold-light",
  Confirmed: "bg-blue-400/20 text-blue-300",
  Preparing: "bg-ember/20 text-ember-light",
  "Out for Delivery": "bg-purple-400/20 text-purple-300",
  Delivered: "bg-green-400/20 text-green-300",
};

const paymentTone: Record<string, string> = {
  "Awaiting Payment Verification": "bg-gold-light/20 text-gold",
  Verified: "bg-green-400/20 text-green-600",
};

export function OrderStatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${orderTone[status] ?? "bg-charcoal/10 text-charcoal"}`}>
      {status}
    </span>
  );
}

export function PaymentStatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${paymentTone[status] ?? "bg-charcoal/10 text-charcoal"}`}>
      {status}
    </span>
  );
}
