import type { LucideIcon } from '@/lib/icons'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  label: string
  value: React.ReactNode
  icon: LucideIcon
  hint?: string
}

export function StatCard({ label, value, icon: Icon, hint }: StatCardProps) {
  return (
    <Card className="py-0">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold leading-tight tabular-nums">
            {value}
          </p>
          {hint ? (
            <p className="text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
