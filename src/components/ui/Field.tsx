import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

const control =
  'w-full rounded-xl border-2 bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-soft/60 transition-colors focus:border-ink focus:outline-none'

interface Shared {
  label: string
  hint?: string
  error?: string
  optional?: boolean
}

function Wrapper({ id, label, hint, error, optional, children }: Shared & { id: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink-soft">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-medium text-bad">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

const describe = (id: string, error?: string, hint?: string) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined)

export function TextField({ label, hint, error, optional, className, ...rest }: Shared & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <Wrapper id={id} label={label} hint={hint} error={error} optional={optional}>
      <input id={id} aria-invalid={!!error} aria-describedby={describe(id, error, hint)} className={cn(control, error ? 'border-bad' : 'border-line', className)} {...rest} />
    </Wrapper>
  )
}

export function TextAreaField({ label, hint, error, optional, className, ...rest }: Shared & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <Wrapper id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea id={id} rows={3} aria-invalid={!!error} aria-describedby={describe(id, error, hint)} className={cn(control, 'resize-y', error ? 'border-bad' : 'border-line', className)} {...rest} />
    </Wrapper>
  )
}

export function SelectField({ label, hint, error, optional, className, children, ...rest }: Shared & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId()
  return (
    <Wrapper id={id} label={label} hint={hint} error={error} optional={optional}>
      <div className="relative">
        <select id={id} aria-invalid={!!error} aria-describedby={describe(id, error, hint)} className={cn(control, 'appearance-none pr-11', error ? 'border-bad' : 'border-line', className)} {...rest}>
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-ink-soft" aria-hidden />
      </div>
    </Wrapper>
  )
}
