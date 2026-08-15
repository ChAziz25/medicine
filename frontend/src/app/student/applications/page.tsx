'use client'

import { useState } from 'react'
import { ClipboardList } from '@/lib/icons'
import { useApi } from '@/lib/use-api'
import { useI18n } from '@/lib/i18n-context'
import { studentApi, ApiError } from '@/lib/api'
import type { Language } from '@/lib/i18n'
import type { Application, ApplicationStatus } from '@/lib/types'
import { PageHeader } from '@/components/shared/page-header'
import { AsyncContent } from '@/components/shared/async-content'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const STATUS_FILTERS: { value: ApplicationStatus | 'ALL'; key: string }[] = [
  { value: 'ALL', key: 'hospital.applications.filter_all' },
  { value: 'PENDING', key: 'hospital.applications.filter_pending' },
  { value: 'UNDER_REVIEW', key: 'hospital.applications.filter_review' },
  { value: 'ACCEPTED', key: 'hospital.applications.filter_accepted' },
  { value: 'REJECTED', key: 'hospital.applications.filter_rejected' },
  { value: 'CANCELLED', key: 'status.cancelled' },
  { value: 'COMPLETED', key: 'status.completed' },
]

function formatDate(value: string | undefined, locale: Language) {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
}

export default function StudentApplicationsPage() {
  const { t, locale } = useI18n()
  const { data, loading, error, reload } = useApi<Application[]>(
    () => studentApi.listMyApplications(),
    [],
  )
  const [filter, setFilter] = useState<ApplicationStatus | 'ALL'>('ALL')
  const [cancelling, setCancelling] = useState<string | number | null>(null)

  const applications = (data ?? []).filter(
    (a) => filter === 'ALL' || a.status === filter,
  )

  async function cancel(id: string | number) {
    setCancelling(id)
    try {
      await studentApi.cancelApplication(id)
      await reload()
    } catch (err) {
      alert(
        err instanceof ApiError
          ? err.message
          : t('student.applications.cannot_cancel'),
      )
    } finally {
      setCancelling(null)
    }
  }

  return (
    <>
      <PageHeader
        title={t('student.applications.title')}
        description={t('student.applications.description')}
        actions={
          <div className="w-48">
            <Select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as ApplicationStatus | 'ALL')
              }
              aria-label={t('hospital.applications.filter_label')}
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {t(f.key)}
                </option>
              ))}
            </Select>
          </div>
        }
      />

      <AsyncContent loading={loading} error={error} onRetry={reload}>
        {applications.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title={t('student.applications.no_results')}
            description={t('student.applications.no_results_desc')}
          />
        ) : (
          <Card className="overflow-hidden py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('hospital.services.table_name')}</TableHead>
                  <TableHead>{t('nav.hospitals')}</TableHead>
                  <TableHead>{t('hospital.applications.submitted_on')}</TableHead>
                  <TableHead>{t('hospital.applications.status_label')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => {
                  const cancellable = ['PENDING', 'UNDER_REVIEW'].includes(
                    app.status,
                  )
                  return (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">
                        {app.serviceName ?? '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {app.hospitalName ?? '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(app.submittedAt, locale)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={app.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {cancellable ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={cancelling === app.id}
                            onClick={() => cancel(app.id)}
                          >
                            {cancelling === app.id
                              ? t('student.applications.cancelling')
                              : t('student.applications.cancel')}
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        )}
      </AsyncContent>
    </>
  )
}
