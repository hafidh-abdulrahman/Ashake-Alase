import type { Product } from '@/types'

export const isSoldOut = (p: Product) => p.availableQuantity !== null && p.availableQuantity <= 0

/** Highest quantity one customer can add */
export const maxQuantity = (p: Product) => Math.max(1, Math.min(p.maxPerOrder, p.availableQuantity ?? Infinity))

export function availabilityText(p: Product): string {
  if (isSoldOut(p)) return 'Sold out'
  if (p.availableQuantity === null) return 'Available'
  return `${p.availableQuantity} left`
}
