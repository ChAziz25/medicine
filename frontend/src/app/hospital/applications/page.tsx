'use client'

import { useState } from 'react'
import { Check, ClipboardList, Eye, X } from '@/lib/icons'
import { useApi } from '@/lib/use-api'
import { useI18n } from '@/lib/i18n-context'
import { hospitalApi, ApiError } from '@/lib/api'
import type { Language } from '@/lib/i18n'
import type { Application, ApplicationStatus } from '@/lib/types'
import { PageHeader } from '@/components/shared/page-header'
import { AsyncContent } from '@/components/shared/async-content'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { Modal } from '@/components/shared/modal'
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

export default function HospitalApplicationsPage() {
  const { t, locale } = useI18n()
  const { data, loading, error, reload } = useApi<Application[]>(
    () => hospitalApi.listApplications(),
    [],
  )
  const [filter, setFilter] = useState<ApplicationStatus | 'ALL'>('ALL')
  const [viewing, setViewing] = useState<Application | null>(null)
  const [busyId, setBusyId] = useState<string | number | null>(null)

  const applications = (data ?? []).filter(
    (a) => filter === 'ALL' || a.status === filter,
  )

  async function decide(
    app: Application,
    decision: 'ACCEPTED' | 'REJECTED',
  ) {
    setBusyId(app.id)
    try {
      await hospitalApi.decideApplication(app.id, decision)
      await reload()
      setViewing(null)
    } catch (err) {
      alert(
        err instanceof ApiError
          ? err.message
          : t('hospital.applications.update_error'),
      )
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <PageHeader
        title={t('hospital.applications.title')}
        description={t('hospital.applications.description')}
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
            title={t('hospital.applications.no_results')}
            description={t('hospital.applications.no_results_desc')}
          />
        ) : (
          <Card className="overflow-hidden py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('hospital.applications.student_placeholder')}</TableHead>
                  <TableHead>{t('hospital.applications.service_placeholder')}</TableHead>
                  <TableHead>{t('hospital.applications.submitted_on')}</TableHead>
                  <TableHead>{t('hospital.applications.status_label')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => {
                  const decidable = ['PENDING', 'UNDER_REVIEW'].includes(
                    app.status,
                  )
                  return (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">
                        {app.studentName ?? '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {app.serviceName ?? '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(app.submittedAt, locale)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={app.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={t('common.view')}
                            onClick={() => setViewing(app)}
                          >
                            <Eye />
                          </Button>
                          {decidable ? (
                            <>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={t('hospital.applications.accept')}
                                disabled={busyId === app.id}
                                onClick={() => decide(app, 'ACCEPTED')}
                              >
                                <Check className="text-emerald-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={t('hospital.applications.reject')}
                                disabled={busyId === app.id}
                                onClick={() => decide(app, 'REJECTED')}
                              >
                                <X className="text-destructive" />
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        )}
      </AsyncContent>

      {viewing ? (
        <Modal
          open
          onClose={() => setViewing(null)}
          title={t('hospital.applications.detail_title')}
          description={`${viewing.studentName ?? t('hospital.applications.student_placeholder')} — ${viewing.serviceName ?? t('hospital.applications.service_placeholder')}`}
          footer={
            ['PENDING', 'UNDER_REVIEW'].includes(viewing.status) ? (
              <>
                <Button
                  variant="destructive"
                  disabled={busyId === viewing.id}
                  onClick={() => decide(viewing, 'REJECTED')}
                >
                  <X />
                  {t('hospital.applications.reject')}
                </Button>
                <Button
                  disabled={busyId === viewing.id}
                  onClick={() => decide(viewing, 'ACCEPTED')}
                >
                  <Check />
                  {t('hospital.applications.accept')}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setViewing(null)}>
                {t('common.close')}
              </Button>
            )
          }
        >
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('hospital.applications.status_label')}</span>
              <StatusBadge status={viewing.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('hospital.applications.submitted_on')}</span>
              <span>{formatDate(viewing.submittedAt, locale)}</span>
            </div>
            <div className="space-y-1.5">
              <p className="text-muted-foreground">{t('hospital.applications.motivation')}</p>
              <p className="rounded-lg border border-border bg-muted/40 p-3 leading-relaxed text-pretty">
                {viewing.motivation?.trim()
                  ? viewing.motivation
                  : t('hospital.applications.no_motivation')}
              </p>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  )
}
