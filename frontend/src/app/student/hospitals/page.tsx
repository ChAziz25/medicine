'use client'

import { useMemo, useState } from 'react'
import { Building2, MapPin, Search, Stethoscope, Users } from '@/lib/icons'
import { useApi } from '@/lib/use-api'
import { useI18n } from '@/lib/i18n-context'
import { studentApi, ApiError } from '@/lib/api'
import type { Hospital, Service } from '@/lib/types'
import { PageHeader } from '@/components/shared/page-header'
import { AsyncContent } from '@/components/shared/async-content'
import { EmptyState } from '@/components/shared/empty-state'
import { Modal } from '@/components/shared/modal'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

export default function StudentHospitalsPage() {
  const { t } = useI18n()
  const { data, loading, error, reload } = useApi<Hospital[]>(
    () => studentApi.listHospitals(),
    [],
  )
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Hospital | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const hospitals = data ?? []
    if (!q) return hospitals
    return hospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        (h.city ?? '').toLowerCase().includes(q),
    )
  }, [data, query])

  return (
    <>
      <PageHeader
        title={t('student.hospitals.title')}
        description={t('student.hospitals.description')}
      />

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder={t('student.hospitals.search_placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <AsyncContent loading={loading} error={error} onRetry={reload}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={Building2}
            title={t('student.hospitals.no_results')}
            description={t('student.hospitals.no_results_desc')}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((hospital) => (
              <Card key={hospital.id} className="gap-4">
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Building2 className="size-5" />
                  </div>
                  <CardTitle className="pt-2">{hospital.name}</CardTitle>
                  {hospital.city ? (
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {hospital.city}
                    </CardDescription>
                  ) : null}
                </CardHeader>
                <CardContent className="mt-auto flex items-center justify-between">
                  <Badge variant="secondary">
                    <Stethoscope />
                    {hospital.serviceCount ?? 0} service
                    {(hospital.serviceCount ?? 0) > 1 ? 's' : ''}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelected(hospital)}
                  >
                    {t('student.hospitals.browse_services')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </AsyncContent>

      {selected ? (
        <HospitalServicesModal
          hospital={selected}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </>
  )
}

function HospitalServicesModal({
  hospital,
  onClose,
}: {
  hospital: Hospital
  onClose: () => void
}) {
  const { t } = useI18n()
  const { data, loading, error, reload } = useApi<Service[]>(
    () => studentApi.listServices(hospital.id),
    [hospital.id],
  )
  const [applyFor, setApplyFor] = useState<Service | null>(null)

  const services = data ?? []

  return (
    <>
      <Modal
        open={!applyFor}
        onClose={onClose}
        title={hospital.name}
        description={
          hospital.city
            ? `${t('student.service_detail.apply')} — ${hospital.city}`
            : t('student.service_detail.apply')
        }
        className="max-w-xl"
      >
        <AsyncContent loading={loading} error={error} onRetry={reload}>
          {services.length === 0 ? (
            <EmptyState
              icon={Stethoscope}
              title={t('student.hospitals.no_results')}
              description={t('student.hospitals.no_results_desc')}
            />
          ) : (
            <ul className="space-y-2">
              {services.map((service) => {
                const spots = service.availableSpots ?? service.capacity
                const full = spots !== undefined && spots <= 0
                return (
                  <li
                    key={service.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{service.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {service.serviceTypeName ? (
                          <Badge variant="outline">
                            {service.serviceTypeName}
                          </Badge>
                        ) : null}
                        {spots !== undefined ? (
                          <span className="inline-flex items-center gap-1">
                            <Users className="size-3.5" />
                            {spots} {t('student.service_detail.available_spots')}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      disabled={full}
                      onClick={() => setApplyFor(service)}
                    >
                      {full
                        ? t('student.service_detail.full')
                        : t('student.service_detail.apply')}
                    </Button>
                  </li>
                )
              })}
            </ul>
          )}
        </AsyncContent>
      </Modal>

      {applyFor ? (
        <ApplyModal
          service={applyFor}
          hospitalName={hospital.name}
          onClose={() => setApplyFor(null)}
          onDone={() => {
            setApplyFor(null)
            onClose()
          }}
        />
      ) : null}
    </>
  )
}

function ApplyModal({
  service,
  hospitalName,
  onClose,
  onDone,
}: {
  service: Service
  hospitalName: string
  onClose: () => void
  onDone: () => void
}) {
  const { t } = useI18n()
  const [motivation, setMotivation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: 'error' | 'success'
    message: string
  } | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setFeedback(null)
    try {
      await studentApi.apply(service.id, motivation)
      setFeedback({
        type: 'success',
        message: t('student.apply_modal.success'),
      })
      setTimeout(onDone, 900)
    } catch (err) {
      setFeedback({
        type: 'error',
        message:
          err instanceof ApiError
            ? err.message
            : t('student.apply_modal.error'),
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={t('student.apply_modal.title')}
      description={`${service.name} — ${hospitalName}`}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            {t('student.apply_modal.cancel')}
          </Button>
          <Button type="submit" form="apply-form" disabled={submitting}>
            {submitting ? t('common.sending') : t('student.apply_modal.submit')}
          </Button>
        </>
      }
    >
      <form id="apply-form" onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="motivation">{t('student.apply_modal.motivation_label')}</Label>
          <Textarea
            id="motivation"
            rows={5}
            placeholder={t('student.apply_modal.motivation_placeholder')}
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            required
          />
        </div>
        {feedback ? (
          <p
            role="alert"
            className={
              feedback.type === 'error'
                ? 'rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive'
                : 'rounded-lg border border-emerald-600/20 bg-emerald-50 px-3 py-2 text-sm text-emerald-700'
            }
          >
            {feedback.message}
          </p>
        ) : null}
      </form>
    </Modal>
  )
}
