'use client'

import Link from 'next/link'
import {
  Building2,
  ClipboardList,
  CheckCircle2,
  Clock,
  ArrowRight,
} from '@/lib/icons'
import { useAuth } from '@/lib/auth-context'
import { useI18n } from '@/lib/i18n-context'
import { useApi } from '@/lib/use-api'
import { studentApi } from '@/lib/api'
import type { Application } from '@/lib/types'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { AsyncContent } from '@/components/shared/async-content'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function StudentDashboardPage() {
  const { user } = useAuth()
  const { t } = useI18n()
  const { data, loading, error, reload } = useApi<Application[]>(
    () => studentApi.listMyApplications(),
    [],
  )

  const applications = data ?? []
  const pending = applications.filter((a) =>
    ['PENDING', 'UNDER_REVIEW'].includes(a.status),
  ).length
  const accepted = applications.filter((a) => a.status === 'ACCEPTED').length
  const recent = applications.slice(0, 5)

  return (
    <>
      <PageHeader
        title={`${t('home.authenticated.greeting')}${user?.name ? `, ${user.name}` : ''}`}
        description={t('student.dashboard.description')}
        actions={
          <Button asChild>
            <Link href="/student/hospitals">
              {t('home.student.browse_hospitals')}
              <ArrowRight />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label={t('student.total_applications')}
          value={applications.length}
          icon={ClipboardList}
        />
        <StatCard label={t('student.pending')} value={pending} icon={Clock} />
        <StatCard label={t('student.accepted')} value={accepted} icon={CheckCircle2} />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>{t('student.recent_applications')}</CardTitle>
            <CardDescription>
              {t('student.dashboard.description')}
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/student/applications">{t('student.see_all')}</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <AsyncContent loading={loading} error={error} onRetry={reload}>
            {recent.length === 0 ? (
              <EmptyState
                icon={Building2}
                title={t('student.no_applications')}
                description={t('student.browse_hint')}
                action={
                  <Button asChild size="sm">
                    <Link href="/student/hospitals">
                      {t('student.see_hospitals')}
                    </Link>
                  </Button>
                }
              />
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((app) => (
                  <li
                    key={app.id}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {app.serviceName ?? t('shared.not_applicable')}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {app.hospitalName ?? t('shared.not_applicable')}
                      </p>
                    </div>
                    <StatusBadge status={app.status} />
                  </li>
                ))}
              </ul>
            )}
          </AsyncContent>
        </CardContent>
      </Card>
    </>
  )
}
