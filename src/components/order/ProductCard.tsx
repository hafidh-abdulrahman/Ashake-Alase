import { ArrowUpRight } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import type { Product } from "@/types";
import { FoodImage } from "@/components/ui/FoodImage";
import { formatNaira } from "@/lib/format";
import { availabilityText } from "@/lib/availability";

export function ProductCard({ product: p }: { product: Product }) {
  return (
    <RouterLink
      to={`/menu/${p.id}`}
      className="group block overflow-hidden rounded-2xl bg-paper shadow-[0_1px_0_rgb(36_25_22/0.06),0_16px_30px_-22px_rgb(36_25_22/0.5)] transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative overflow-hidden">
        <FoodImage
          src={p.image}
          alt={p.name}
          placeholder={p.placeholder}
          className="aspect-4/3 transition-transform duration-500 group-hover:scale-105"
        />
        {p.campaign && (
          <span className="eyebrow absolute left-3 top-3 rounded-full bg-accent px-3 py-1.5 text-ink shadow-lift">
            {p.campaign.label}
          </span>
        )}
      </div>
      <div className="flex items-start justify-between gap-4 p-5 lg:p-6">
        <div>
          <h3 className="text-[1.65rem] font-bold group-hover:text-primary">
            {p.name}
          </h3>
          <p className="mt-1 text-ink-soft">{p.summary}</p>
          <p className="mt-2 text-sm font-medium text-ink-soft">
            {availabilityText(p)}
          </p>
        </div>
        <p className="font-display text-xl font-extrabold tabular-nums">
          {formatNaira(p.price)}
        </p>
      </div>
      <div className="flex items-center justify-between border-t border-line/70 px-5 py-3 text-sm font-bold text-primary lg:px-6">
        <span>View this plate</span>
        <ArrowUpRight
          className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      </div>
    </RouterLink>
  );
}
