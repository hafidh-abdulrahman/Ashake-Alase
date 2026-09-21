import type { ReactNode } from 'react'
import { Button } from './Button'

export function LoadingBlock({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" className="grid place-items-center py-24 text-ink-soft">
      <span className="size-8 animate-spin rounded-full border-[3px] border-ink/20 border-t-ink" aria-hidden />
      <span className="mt-3 text-sm">{label}...</span>
    </div>
  )
}

export function EmptyState({ title, text, actionLabel, actionTo, children }: { title: string; text: string; actionLabel?: string; actionTo?: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      <p className="mt-3 text-ink-soft">{text}</p>
      {actionLabel && actionTo && (
        <div className="mt-7">
          <Button to={actionTo}>{actionLabel}</Button>
        </div>
      )}
      {children}
    </div>
  )
}
