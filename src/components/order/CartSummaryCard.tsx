import type { ReactNode } from 'react'
import { useCart } from '@/context/CartContext'
import { OrderTotals } from './OrderTotals'
import { SummaryLines } from './SummaryLines'

/** Read-only order summary built from the live cart. Used on checkout and payment. */
export function CartSummaryCard({ title = 'Order summary', children }: { title?: string; children?: ReactNode }) {
  const { lines, subtotal, deliveryFee, total } = useCart()
  return (
    <aside aria-label={title} className="h-fit self-start rounded-3xl border border-line bg-paper p-6 lg:sticky lg:top-28">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>
      <SummaryLines lines={lines.map((l) => ({ key: l.product.id, name: l.product.name, quantity: l.quantity, unitPrice: l.product.price }))} />
      <div className="mt-5 border-t border-line pt-5">
        <OrderTotals subtotal={subtotal} deliveryFee={deliveryFee} total={total} deliveryPending="Choose your area" />
      </div>
      {children}
    </aside>
  )
}
