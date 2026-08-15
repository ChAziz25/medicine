'use client'

import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n-context'
import type { ApplicationStatus } from '@/lib/types'

/** Translation keys for app status badges. */
const STATUS_KEYS: Record<ApplicationStatus, string> = {
  PENDING: 'status.pending',
  UNDER_REVIEW: 'status.under_review',
  ACCEPTED: 'status.accepted',
  REJECTED: 'status.rejected',
  REFUSED: 'status.refused',
  CANCELLED: 'status.cancelled',
  COMPLETED: 'status.completed',
}

const STATUS_VARIANTS: Record<
  ApplicationStatus,
  React.ComponentProps<typeof Badge>['variant']
> = {
  PENDING: 'warning',
  UNDER_REVIEW: 'info',
  ACCEPTED: 'success',
  REJECTED: 'destructive',
  REFUSED: 'destructive',
  CANCELLED: 'secondary',
  COMPLETED: 'outline',
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const { t } = useI18n()
  const key = STATUS_KEYS[status] ?? status
  const variant = STATUS_VARIANTS[status] ?? 'secondary'
  return <Badge variant={variant}>{t(key)}</Badge>
}
