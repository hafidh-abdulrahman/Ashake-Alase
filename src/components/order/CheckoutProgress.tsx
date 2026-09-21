import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

const steps = ['Your order', 'Delivery details', 'Payment']

export function CheckoutProgress({ current }: { current: 0 | 1 | 2 }) {
  return (
    <ol aria-label="Checkout progress" className="mb-8 flex items-center gap-2 text-sm font-semibold sm:gap-3">
      {steps.map((label, i) => (
        <li key={label} className="flex items-center gap-2 sm:gap-3" aria-current={i === current ? 'step' : undefined}>
          <span
            className={cn(
              'grid size-7 place-items-center rounded-full text-xs',
              i < current && 'bg-ink text-surface',
              i === current && 'bg-primary text-white',
              i > current && 'border-2 border-line text-ink-soft',
            )}
          >
            {i < current ? <Check className="size-4" strokeWidth={3} aria-hidden /> : i + 1}
          </span>
          <span className={cn(i === current ? 'text-ink' : 'text-ink-soft', i !== current && 'max-sm:hidden')}>{label}</span>
          {i < steps.length - 1 && <span aria-hidden className="h-px w-5 bg-line sm:w-10" />}
        </li>
      ))}
    </ol>
  )
}
