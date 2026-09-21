import { formatNaira } from '@/lib/format'

export interface SummaryLine {
  key: string
  name: string
  quantity: number
  unitPrice: number
}

export function SummaryLines({ lines }: { lines: SummaryLine[] }) {
  return (
    <ul className="divide-y divide-line">
      {lines.map((l) => (
        <li key={l.key} className="flex items-start justify-between gap-4 py-3 first:pt-0">
          <div>
            <p className="font-semibold">{l.name}</p>
            <p className="text-sm text-ink-soft">
              {l.quantity} &times; {formatNaira(l.unitPrice)}
            </p>
          </div>
          <p className="font-medium tabular-nums">{formatNaira(l.quantity * l.unitPrice)}</p>
        </li>
      ))}
    </ul>
  )
}
