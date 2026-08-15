'use client'

import Link from 'next/link'
import { ClipboardList, Clock, Stethoscope, Users } from '@/lib/icons'
import { useI18n } from '@/lib/i18n-context'
import { useApi } from '@/lib/use-api'
import { hospitalApi } from '@/lib/api'
import type { Application, Hospital, Service } from '@/lib/types'
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

export default function HospitalDashboardPage() {
  const { t } = useI18n()
  const hospital = useApi<Hospital>(() => hospitalApi.myHospital(), [])
  const services = useApi<Service[]>(() => hospitalApi.listServices(), [])
  const applications = useApi<Application[]>(
    () => hospitalApi.listApplications(),
    [],
  )

  const apps = applications.data ?? []
  const pending = apps.filter((a) =>
    ['PENDING', 'UNDER_REVIEW'].includes(a.status),
  )

  return (
    <>
      <PageHeader
        title={hospital.data?.name ?? t('shared.not_applicable')}
        description={
          hospital.data?.city
            ? `${t('hospital.dashboard.description')} ${hospital.data.city}`
            : t('hospital.dashboard.description')
        }
        actions={
          <Button asChild>
            <Link href="/hospital/applications">
              {t('hospital.dashboard.review_applications')}
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label={t('hospital.dashboard.services_published')}
          value={services.data?.length ?? 0}
          icon={Stethoscope}
        />
        <StatCard
          label={t('hospital.dashboard.applications_received')}
          value={apps.length}
          icon={ClipboardList}
        />
        <StatCard
          label={t('hospital.dashboard.pending_review')}
          value={pending.length}
          icon={Clock}
        />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>{t('hospital.applications.title')}</CardTitle>
            <CardDescription>
              {t('hospital.dashboard.no_pending_desc')}
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/hospital/applications">{t('student.see_all')}</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <AsyncContent
            loading={applications.loading}
            error={applications.error}
            onRetry={applications.reload}
          >
            {pending.length === 0 ? (
              <EmptyState
                icon={Users}
                title={t('hospital.dashboard.no_pending')}
                description={t('hospital.dashboard.no_pending_desc')}
              />
            ) : (
              <ul className="divide-y divide-border">
                {pending.slice(0, 5).map((app) => (
                  <li
                    key={app.id}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {app.studentName ?? t('hospital.applications.student_placeholder')}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {app.serviceName ?? t('hospital.applications.service_placeholder')}
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
