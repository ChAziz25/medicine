'use client'

import { AlertTriangle, Loader2 } from '@/lib/icons'
import { useI18n } from '@/lib/i18n-context'
import { Button } from '@/components/ui/button'

interface AsyncContentProps {
  loading: boolean
  error: string | null
  onRetry?: () => void
  children: React.ReactNode
}

export function AsyncContent({
  loading,
  error,
  onRetry,
  children,
}: AsyncContentProps) {
  const { t } = useI18n()

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-14 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-primary" />
        {t('shared.loading_data')}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 py-12 text-center">
        <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-5" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-foreground">
            {t('shared.data_load_error')}
          </p>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground text-pretty">
            {error}
          </p>
        </div>
        {onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            {t('common.retry')}
          </Button>
        ) : null}
      </div>
    )
  }

  return <>{children}</>
}
