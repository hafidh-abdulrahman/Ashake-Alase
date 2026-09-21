import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { FoodImage } from "@/components/ui/FoodImage";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { EmptyState, LoadingBlock } from "@/components/ui/PageState";
import { OrderTotals } from "@/components/order/OrderTotals";
import { CheckoutProgress } from "@/components/order/CheckoutProgress";
import { formatNaira } from "@/lib/format";
import { maxQuantity } from "@/lib/availability";

export default function CartPage() {
  const { lines, subtotal, ready, setQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (!ready) return <LoadingBlock label="Loading your order" />;
  if (lines.length === 0)
    return (
      <EmptyState
        title="Your order is empty"
        text="Choose something from the menu and it will show up here."
        actionLabel="See the menu"
        actionTo="/menu"
      />
    );

  return (
    <div className="container-page pb-20 pt-6 lg:pb-28 lg:pt-12">
      <CheckoutProgress current={0} />
      <h1 className="text-[clamp(2.5rem,6vw,4.5rem)]">Your Ashake order</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <ul className="divide-y divide-line border-y border-line">
          {lines.map(({ product: p, quantity, lineTotal }) => (
            <li
              key={p.id}
              className="grid grid-cols-[5.5rem_1fr] gap-4 py-6 sm:grid-cols-[7rem_1fr] sm:gap-6"
            >
              <Link to={`/menu/${p.id}`} aria-label={`View ${p.name}`}>
                <FoodImage
                  src={p.image}
                  alt={p.name}
                  placeholder={p.placeholder}
                  className="aspect-square rounded-2xl"
                />
              </Link>
              <div className="flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold sm:text-2xl">{p.name}</h2>
                    <p className="text-ink-soft">{formatNaira(p.price)} each</p>
                  </div>
                  <p className="font-display text-xl font-extrabold tabular-nums">
                    {formatNaira(lineTotal)}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <QuantityStepper
                    size="sm"
                    value={quantity}
                    max={maxQuantity(p)}
                    onChange={(v) => setQuantity(p.id, v)}
                    label={`Quantity of ${p.name}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(p.id)}
                    className="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm font-semibold text-ink-soft hover:text-bad"
                  >
                    <Trash2 className="size-4" aria-hidden /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside
          aria-label="Order summary"
          className="h-fit rounded-3xl border border-primary/20 bg-paper p-6 shadow-lift lg:sticky lg:top-28"
        >
          <p className="eyebrow mb-2 text-primary">Ashake checkout</p>
          <h2 className="mb-5 text-2xl font-bold">Order summary</h2>
          <OrderTotals
            subtotal={subtotal}
            deliveryFee={null}
            total={subtotal}
            deliveryPending="Added at checkout"
          />
          <Button
            size="lg"
            full
            className="mt-6"
            onClick={() => navigate("/checkout")}
          >
            Continue to Checkout
          </Button>
          <Link
            to="/menu"
            className="mt-4 block text-center text-sm font-semibold text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            Add more items
          </Link>
        </aside>
      </div>
    </div>
  );
}
