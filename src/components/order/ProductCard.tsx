import { ArrowUpRight, Plus } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import type { Product } from "@/types";
import { FoodImage } from "@/components/ui/FoodImage";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/format";
import { availabilityText, isSoldOut } from "@/lib/availability";

export function ProductCard({ product: p }: { product: Product }) {
  const { addItem, productsReady } = useCart();
  const soldOut = isSoldOut(p);
  const [addError, setAddError] = useState(false);

  return (
    <div className="group block overflow-hidden rounded-2xl bg-paper shadow-[0_1px_0_rgb(36_25_22/0.06),0_16px_30px_-22px_rgb(36_25_22/0.5)] transition-transform duration-300 hover:-translate-y-1">
      <RouterLink to={`/menu/${p.id}`}>
        <div className="relative overflow-hidden">
          <FoodImage
            src={p.image}
            alt={p.name}
            placeholder={p.placeholder}
            className="aspect-video transition-transform duration-500 group-hover:scale-105"
          />
          {p.campaign && (
            <span className="eyebrow absolute left-2 top-2 rounded-full bg-accent px-2 py-1 text-ink shadow-lift lg:left-3 lg:top-3 lg:px-3 lg:py-1.5">
              {p.campaign.label}
            </span>
          )}
        </div>
        <div className="flex items-start justify-between gap-2 p-3 lg:gap-3 lg:p-5">
          <div>
            <h3 className="text-[1.05rem] font-bold leading-tight group-hover:text-primary lg:text-[1.35rem]">
              {p.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-snug text-ink-soft lg:text-base lg:leading-normal">
              {p.summary}
            </p>
            <p className="mt-1 text-[0.7rem] font-medium leading-tight text-ink-soft lg:mt-2 lg:text-sm lg:leading-normal">
              {availabilityText(p)}
            </p>
          </div>
          <p className="font-display text-base font-extrabold leading-tight tabular-nums lg:text-xl">
            {formatNaira(p.price)}
          </p>
        </div>
      </RouterLink>
      <div className="flex items-center justify-between border-t border-line/70 px-3 py-2 text-xs font-bold text-primary lg:px-5 lg:py-2.5 lg:text-sm">
        <RouterLink
          to={`/menu/${p.id}`}
          className="inline-flex items-center gap-1.5 lg:gap-2"
        >
          <span>View this plate</span>
          <ArrowUpRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 lg:size-4"
            aria-hidden
          />
        </RouterLink>
        <button
          type="button"
          aria-label={`Add ${p.name} to cart`}
          title={soldOut ? "Sold out" : "Add to cart"}
          disabled={soldOut || !productsReady}
          onClick={() => {
            setAddError(!addItem(p.id, 1));
          }}
          className="grid size-8 place-items-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40 lg:size-8"
        >
          <Plus className="size-4" aria-hidden />
        </button>
      </div>
      {addError && (
        <p
          role="alert"
          className="px-3 pb-3 text-xs font-medium text-bad lg:px-5"
        >
          Unable to add this item right now. Please try again.
        </p>
      )}
    </div>
  );
}
