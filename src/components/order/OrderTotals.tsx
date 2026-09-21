import { formatNaira } from '@/lib/format'

interface Props {
  subtotal: number
  /** null means not chosen yet */
  deliveryFee: number | null
  total: number
  deliveryPending?: string
}

export function OrderTotals({ subtotal, deliveryFee, total, deliveryPending = 'Added at checkout' }: Props) {
  return (
    <dl className="space-y-2.5">
      <div className="flex justify-between">
        <dt className="text-ink-soft">Subtotal</dt>
        <dd className="font-medium tabular-nums">{formatNaira(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-ink-soft">Delivery fee</dt>
        <dd className="font-medium tabular-nums">{deliveryFee === null ? <span className="text-ink-soft">{deliveryPending}</span> : formatNaira(deliveryFee)}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-line pt-3.5">
        <dt className="text-lg font-bold">Total</dt>
        <dd className="font-display text-2xl font-extrabold tabular-nums">{formatNaira(total)}</dd>
      </div>
    </dl>
  )
}
