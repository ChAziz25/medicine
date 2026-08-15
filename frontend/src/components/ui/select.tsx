import * as React from 'react'
import { ChevronDown } from '@/lib/icons'
import { cn } from '@/lib/utils'

/**
 * Lightweight native <select> wrapper styled to match the design system.
 * Sufficient for the form/filter needs of this platform.
 */
function Select({ className, children, ...props }: React.ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          'flex h-9 w-full appearance-none rounded-lg border border-input bg-background px-3 py-1 pr-8 text-sm shadow-xs transition-[color,box-shadow] outline-none',
          'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

export { Select }
