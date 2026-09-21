import { Check } from 'lucide-react'
import type { OrderStatus } from '@/types'
import { ORDER_FLOW, orderStatusLabel } from '@/lib/orderMeta'
import { cn } from '@/lib/cn'

interface Props {
  status: OrderStatus
  /** When provided, steps become buttons (admin demo) */
  onSelect?: (status: OrderStatus) => void
  disabled?: boolean
}

export function OrderTracker({ status, onSelect, disabled }: Props) {
  const currentIdx = ORDER_FLOW.indexOf(status)
  return (
    <ol className="flex flex-col gap-4 md:flex-row md:gap-0" aria-label="Order progress">
      {ORDER_FLOW.map((s, i) => {
        const done = i < currentIdx
        const current = i === currentIdx
        const dot = (
          <span
            className={cn(
              'relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 text-xs font-bold transition-colors',
              done && 'border-ink bg-ink text-surface',
              current && 'border-primary bg-primary text-white',
              !done && !current && 'border-line bg-paper text-ink-soft',
            )}
          >
            {done ? <Check className="size-4" strokeWidth={3} aria-hidden /> : i + 1}
          </span>
        )
        const label = <span className={cn('text-sm font-semibold', current ? 'text-ink' : 'text-ink-soft')}>{orderStatusLabel[s]}</span>
        const content = (
          <span className="flex items-center gap-3 md:flex-col md:gap-2.5 md:text-center">
            {dot}
            {label}
          </span>
        )
        return (
          <li
            key={s}
            aria-current={current ? 'step' : undefined}
            className={cn(
              'relative md:flex-1',
              i < ORDER_FLOW.length - 1 &&
                'max-md:before:absolute max-md:before:left-4 max-md:before:top-8 max-md:before:-bottom-4 max-md:before:w-0.5 md:after:absolute md:after:left-1/2 md:after:top-4 md:after:h-0.5 md:after:w-full',
              i < ORDER_FLOW.length - 1 && (done ? 'before:bg-ink after:bg-ink' : 'before:bg-line after:bg-line'),
            )}
          >
            {onSelect ? (
              <button type="button" disabled={disabled || current} onClick={() => onSelect(s)} className="w-full text-left enabled:hover:opacity-80 md:text-center">
                {content}
              </button>
            ) : (
              content
            )}
          </li>
        )
      })}
    </ol>
  )
}
