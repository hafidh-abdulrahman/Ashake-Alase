import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, FileText, ImageOff } from 'lucide-react'
import { useOrder } from '@/hooks/useData'
import { Button } from '@/components/ui/Button'
import { EmptyState, LoadingBlock } from '@/components/ui/PageState'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/ui/StatusBadge'
import { OrderTracker } from '@/components/order/OrderTracker'
import { OrderTotals } from '@/components/order/OrderTotals'
import { SummaryLines } from '@/components/order/SummaryLines'
import { nextStatus, orderStatusLabel, previousStatus } from '@/lib/orderMeta'
import { formatDateTime, formatFileSize, formatPlainDate } from '@/lib/format'
import { rejectPayment, updateOrderStatus, verifyPayment } from '@/services/orderService'
import type { Order, OrderStatus } from '@/types'

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-paper p-6">
      <h2 className="mb-5 text-xl font-bold">{title}</h2>
      {children}
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  )
}

export default function AdminOrderPage() {
  const { orderId } = useParams()
  const { data: order, loading, setData } = useOrder(orderId)
  const [busy, setBusy] = useState(false)

  if (loading) return <LoadingBlock label="Loading order" />
  if (!order) return <EmptyState title="Order not found" text="It may have been removed, or the demo data was reset." actionLabel="Back to orders" actionTo="/admin" />

  const run = async (fn: () => Promise<Order | null>) => {
    setBusy(true)
    const updated = await fn()
    if (updated) setData(updated)
    setBusy(false)
  }
  const setStatus = (s: OrderStatus) => run(() => updateOrderStatus(order.id, s))

  const next = nextStatus(order.status)
  const prev = previousStatus(order.status)
  const awaiting = order.status === 'awaiting_verification'
  const { receipt } = order.payment

  return (
    <>
      <Link to="/admin" className="inline-flex items-center gap-1 rounded-full py-2 pr-3 text-sm font-semibold text-ink-soft hover:text-ink">
        <ChevronLeft className="size-4" aria-hidden /> All orders
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="text-4xl md:text-5xl">{order.orderNumber}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-2 text-ink-soft">Placed {formatDateTime(order.createdAt)}</p>

      <div className="mt-8 rounded-3xl border border-line bg-paper p-6">
        <h2 className="mb-6 text-xl font-bold">Order status</h2>
        <OrderTracker status={order.status} onSelect={setStatus} disabled={busy} />
        <div className="mt-8 flex flex-wrap gap-3">
          {next && (
            <Button loading={busy} onClick={() => (awaiting ? run(() => verifyPayment(order.id)) : setStatus(next))}>
              {awaiting ? 'Verify payment and confirm order' : `Mark as ${orderStatusLabel[next]}`}
            </Button>
          )}
          {prev && (
            <Button variant="outline" disabled={busy} onClick={() => setStatus(prev)}>
              Move back to {orderStatusLabel[prev]}
            </Button>
          )}
          {!next && <p className="self-center font-semibold text-ok">This order is complete.</p>}
        </div>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        <Card title="Customer">
          <dl className="space-y-3.5">
            <Row label="Full name">{order.customer.fullName}</Row>
            <Row label="Phone">
              <a href={`tel:${order.customer.phone}`} className="underline underline-offset-4">
                {order.customer.phone}
              </a>
            </Row>
          </dl>
        </Card>

        <Card title="Delivery">
          <dl className="space-y-3.5">
            <Row label="Area">{order.delivery.areaName}</Row>
            <Row label="Address">{order.delivery.address}</Row>
            <Row label="Preferred date">{formatPlainDate(order.delivery.preferredDate)}</Row>
            <Row label="Notes">{order.delivery.notes || <span className="text-ink-soft">None</span>}</Row>
          </dl>
        </Card>

        <Card title="Items ordered">
          <SummaryLines lines={order.items.map((i) => ({ key: i.productId, name: i.name, quantity: i.quantity, unitPrice: i.unitPrice }))} />
          <div className="mt-5 border-t border-line pt-5">
            <OrderTotals subtotal={order.subtotal} deliveryFee={order.deliveryFee} total={order.total} />
          </div>
        </Card>

        <Card title="Payment">
          <div className="flex flex-wrap items-center gap-3">
            <PaymentStatusBadge status={order.payment.status} />
            <span className="text-sm text-ink-soft">Bank transfer</span>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm text-ink-soft">Payment receipt</p>
            {receipt?.previewDataUrl ? (
              <a href={receipt.previewDataUrl} target="_blank" rel="noreferrer">
                <img src={receipt.previewDataUrl} alt="Payment receipt uploaded by the customer" className="max-h-72 rounded-2xl border border-line object-contain" />
              </a>
            ) : (
              <div className="flex items-center gap-4 rounded-2xl border border-dashed border-ink/30 bg-surface p-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-surface-alt">
                  {receipt?.fileType === 'application/pdf' ? <FileText className="size-6" aria-hidden /> : <ImageOff className="size-6" aria-hidden />}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{receipt ? receipt.fileName : 'No receipt uploaded'}</p>
                  <p className="text-sm text-ink-soft">
                    {receipt ? `${formatFileSize(receipt.fileSize)}. The preview appears here once receipts are stored in Supabase.` : 'The customer has not uploaded a receipt.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {order.payment.verifiedAt && <p className="mt-4 text-sm text-ink-soft">Verified {formatDateTime(order.payment.verifiedAt)}</p>}

          {order.payment.status !== 'verified' && (
            <div className="mt-5 flex flex-wrap gap-3">
              <Button size="sm" loading={busy} onClick={() => run(() => verifyPayment(order.id))}>
                Mark payment verified
              </Button>
              {order.payment.status !== 'rejected' && (
                <Button size="sm" variant="outline" disabled={busy} onClick={() => run(() => rejectPayment(order.id))}>
                  Reject receipt
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </>
  )
}
