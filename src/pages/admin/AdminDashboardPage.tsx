import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '@/hooks/useData'
import { LoadingBlock } from '@/components/ui/PageState'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { ORDER_FLOW, orderStatusLabel } from '@/lib/orderMeta'
import { formatDate, formatNaira } from '@/lib/format'
import { resetDemoOrders } from '@/services/orderService'
import { cn } from '@/lib/cn'
import type { Order, OrderStatus } from '@/types'

const itemsSummary = (o: Order) => {
  const [first, ...rest] = o.items
  return `${first.quantity} × ${first.name}${rest.length ? ` +${rest.length} more` : ''}`
}

export default function AdminDashboardPage() {
  const { data: orders, loading, reload } = useOrders()
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

  const counts = useMemo(() => {
    const c = Object.fromEntries(ORDER_FLOW.map((s) => [s, 0])) as Record<OrderStatus, number>
    orders?.forEach((o) => (c[o.status] += 1))
    return c
  }, [orders])

  if (loading || !orders) return <LoadingBlock label="Loading orders" />

  const visible = filter === 'all' ? orders : orders.filter((o) => o.status === filter)
  const stats: Array<{ key: OrderStatus | 'all'; label: string; value: number }> = [
    { key: 'all', label: 'Total Orders', value: orders.length },
    ...ORDER_FLOW.map((s) => ({ key: s, label: orderStatusLabel[s], value: counts[s] })),
  ]

  const reset = async () => {
    await resetDemoOrders()
    setFilter('all')
    reload()
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl md:text-5xl">Orders</h1>
        <div className="flex items-center gap-3 text-sm text-ink-soft">
          <span>Demo data, saved in this browser only.</span>
          <button type="button" onClick={reset} className="font-semibold text-ink underline underline-offset-4 hover:text-primary">
            Reset demo data
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setFilter(s.key)}
            aria-pressed={filter === s.key}
            className={cn(
              'rounded-2xl border-2 p-4 text-left transition-colors',
              filter === s.key ? 'border-ink bg-ink text-surface' : 'border-line bg-paper hover:border-ink',
            )}
          >
            <span className="block font-display text-4xl font-extrabold tabular-nums">{s.value}</span>
            <span className={cn('mt-1 block text-sm font-medium', filter === s.key ? 'text-surface/80' : 'text-ink-soft')}>{s.label}</span>
          </button>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-bold">{filter === 'all' ? 'All orders' : orderStatusLabel[filter]}</h2>

      {visible.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-line p-8 text-center text-ink-soft">No orders with this status yet.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-5 hidden overflow-x-auto rounded-3xl border border-line bg-paper lg:block">
            <table className="w-full text-left text-[0.95rem]">
              <thead className="border-b border-line bg-surface-alt/60 text-sm text-ink-soft">
                <tr>
                  {['Order', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Date', ''].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-semibold">
                      {h || <span className="sr-only">Actions</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.map((o) => (
                  <tr key={o.id} className="hover:bg-surface/70">
                    <td className="whitespace-nowrap px-4 py-4 font-semibold">{o.orderNumber}</td>
                    <td className="px-4 py-4">{o.customer.fullName}</td>
                    <td className="max-w-56 px-4 py-4 text-ink-soft">{itemsSummary(o)}</td>
                    <td className="px-4 py-4 font-semibold tabular-nums">{formatNaira(o.total)}</td>
                    <td className="px-4 py-4">
                      <PaymentStatusBadge status={o.payment.status} short />
                    </td>
                    <td className="px-4 py-4">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-ink-soft">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-4 text-right">
                      <Button to={`/admin/orders/${o.id}`} size="sm" variant="outline">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="mt-5 space-y-3 lg:hidden">
            {visible.map((o) => (
              <li key={o.id} className="rounded-2xl border border-line bg-paper p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{o.orderNumber}</p>
                    <p className="text-ink-soft">{o.customer.fullName}</p>
                  </div>
                  <p className="font-display text-lg font-extrabold tabular-nums">{formatNaira(o.total)}</p>
                </div>
                <p className="mt-2 text-sm text-ink-soft">{itemsSummary(o)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <OrderStatusBadge status={o.status} />
                  <PaymentStatusBadge status={o.payment.status} short />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-ink-soft">{formatDate(o.createdAt)}</span>
                  <Link to={`/admin/orders/${o.id}`} className="rounded-full border-2 border-ink/80 px-4 py-1.5 text-sm font-semibold hover:bg-ink hover:text-surface">
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}
