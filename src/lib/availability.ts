import type { Product } from "@/types";

export const isSoldOut = (p: Product) =>
  p.availableQuantity !== null && p.availableQuantity <= 0;

/** Highest quantity one customer can add */
export const maxQuantity = (p: Product) =>
  Math.max(
    1,
    Math.min(p.maxPerOrder ?? Infinity, p.availableQuantity ?? Infinity),
  );

export function availabilityText(p: Product): string {
  if (isSoldOut(p)) return "SOLD OUT";
  if (p.showStockQuantity && p.availableQuantity !== null)
    return `${p.availableQuantity} left`;
  if (p.showLimitedAvailability) return "Limited Orders Available";
  return "";
}
