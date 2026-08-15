import * as React from 'react'
import { cn } from '@/lib/utils'

/** Base classes shared by every badge variant. */
const badgeBase =
  'inline-flex items-center justify-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap w-fit [&_svg]:size-3 [&_svg]:pointer-events-none'

/** Variant → extra class-name map. Replaces `class-variance-authority`. */
const badgeVariants = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  outline: 'border-border text-foreground',
  success:
    'border-transparent bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
  warning:
    'border-transparent bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
  info: 'border-transparent bg-sky-50 text-sky-700 ring-1 ring-sky-600/20',
  destructive:
    'border-transparent bg-destructive/10 text-destructive ring-1 ring-destructive/20',
} as const

export type BadgeVariant = keyof typeof badgeVariants

function Badge({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'span'> & { variant?: BadgeVariant }) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeBase, badgeVariants[variant], className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

