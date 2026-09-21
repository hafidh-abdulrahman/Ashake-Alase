import { useState } from 'react'
import type { Product } from '@/types'
import { cn } from '@/lib/cn'
import { PlaceholderArt } from './PlaceholderArt'

interface Props {
  src?: string
  alt: string
  placeholder: Product['placeholder']
  className?: string
  /** Set on above-the-fold images so the browser loads them immediately */
  priority?: boolean
}

/**
 * Shows the real photo when it exists, otherwise the designed placeholder.
 * To replace: add the file to /public/images/ using the path set in the data file. No code changes needed.
 */
export function FoodImage({ src, alt, placeholder, className, priority }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  return (
    <div className={cn('relative overflow-hidden bg-surface-alt', className)}>
      <PlaceholderArt variant={placeholder} />
      {src && !failed && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn('absolute inset-0 size-full object-cover transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0')}
        />
      )}
      {(!src || failed) && <span className="sr-only">{alt}</span>}
    </div>
  )
}
