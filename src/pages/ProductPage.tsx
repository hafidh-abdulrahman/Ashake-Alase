import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, ChevronLeft } from "lucide-react";
import { useProduct } from "@/hooks/useData";
import { useCart } from "@/context/CartContext";
import { FoodImage } from "@/components/ui/FoodImage";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { EmptyState, LoadingBlock } from "@/components/ui/PageState";
import { formatNaira } from "@/lib/format";
import { availabilityText, isSoldOut, maxQuantity } from "@/lib/availability";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: p, loading } = useProduct(id);
  const { addItem, ready } = useCart();
  const [qty, setQty] = useState(1);

  if (loading) return <LoadingBlock label="Loading" />;
  if (!p)
    return (
      <EmptyState
        title="We can't find that item"
        text="It may no longer be available."
        actionLabel="See the menu"
        actionTo="/menu"
      />
    );

  const soldOut = isSoldOut(p);
  const max = maxQuantity(p);

  const add = () => {
    addItem(p.id, qty);
    navigate("/cart");
  };

  return (
    <div className="pb-20 lg:pb-28">
      <div className="container-page pt-4 lg:pt-8">
        <Link
          to="/menu"
          className="inline-flex items-center gap-1 rounded-full py-2 pr-3 text-sm font-semibold text-ink-soft hover:text-primary"
        >
          <ChevronLeft className="size-4" aria-hidden /> Back to menu
        </Link>

        <div className="mt-4 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="mx-auto w-full max-w-xl lg:max-w-none">
            <FoodImage
              src={p.image}
              alt={p.name}
              placeholder={p.placeholder}
              priority
              className="aspect-4/3 w-full rounded-3xl lg:aspect-5/4"
            />
          </div>

          <div className="lg:pt-6">
            {p.campaign && (
              <p className="inline-flex items-center gap-2 rounded-full bg-surface-alt px-3.5 py-1.5 text-sm font-semibold">
                <span aria-hidden className="size-2 rounded-full bg-primary" />
                {p.campaign.label}
              </p>
            )}
            <h1 className="mt-4 text-[clamp(2.5rem,6vw,4.5rem)]">{p.name}</h1>
            <div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-1">
              <p className="font-display text-4xl font-extrabold tabular-nums">
                {formatNaira(p.price)}
              </p>
              <p
                className={
                  soldOut
                    ? "font-semibold text-bad"
                    : "font-medium text-ink-soft"
                }
              >
                {availabilityText(p)}
              </p>
            </div>
            <p className="mt-6 max-w-xl text-lg text-ink-soft">
              {p.description}
            </p>

            <section aria-labelledby="includes" className="mt-8">
              <h2 id="includes" className="text-2xl font-bold">
                What&rsquo;s included
              </h2>
              <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {p.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink text-surface">
                      <Check className="size-3" strokeWidth={3.5} aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-10 rounded-3xl border border-line bg-paper p-5 shadow-lift sm:p-6">
              {soldOut ? (
                <p className="font-semibold">
                  This item is sold out. Check the menu for other options.
                </p>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <QuantityStepper
                      value={qty}
                      max={max}
                      onChange={(v) => setQty(Math.max(1, Math.min(v, max)))}
                    />
                    <p className="text-right">
                      <span className="block text-sm text-ink-soft">
                        Subtotal
                      </span>
                      <span className="font-display text-2xl font-extrabold tabular-nums">
                        {formatNaira(p.price * qty)}
                      </span>
                    </p>
                  </div>
                  <Button
                    size="lg"
                    full
                    className="mt-5"
                    onClick={add}
                    disabled={!ready}
                  >
                    Add to Order
                  </Button>
                  <p className="mt-3 text-center text-sm text-ink-soft">
                    {p.maxPerOrder === null
                      ? "Choose the quantity you need."
                      : `Up to ${max} per order.`}{" "}
                    Delivery is added at checkout.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
