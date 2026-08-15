'use client'

import { useState } from 'react'
import { Pencil, Plus, Stethoscope, Trash2 } from '@/lib/icons'
import { useApi } from '@/lib/use-api'
import { useI18n } from '@/lib/i18n-context'
import { hospitalApi, adminApi, ApiError } from '@/lib/api'
import type { Service, ServiceType } from '@/lib/types'
import { PageHeader } from '@/components/shared/page-header'
import { AsyncContent } from '@/components/shared/async-content'
import { EmptyState } from '@/components/shared/empty-state'
import { Modal } from '@/components/shared/modal'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function HospitalServicesPage() {
  const { t } = useI18n()
  const { data, loading, error, reload } = useApi<Service[]>(
    () => hospitalApi.listServices(),
    [],
  )
  // Service types are managed globally by the system admin; loaded for the form select.
  const serviceTypes = useApi<ServiceType[]>(
    () => adminApi.listServiceTypes(),
    [],
  )

  const [editing, setEditing] = useState<Service | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<Service | null>(null)

  const services = data ?? []

  return (
    <>
      <PageHeader
        title={t('hospital.services.title')}
        description={t('hospital.services.description')}
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus />
            {t('hospital.services.new')}
          </Button>
        }
      />

      <AsyncContent loading={loading} error={error} onRetry={reload}>
        {services.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title={t('hospital.services.no_services')}
            description={t('hospital.services.no_services_desc')}
            action={
              <Button size="sm" onClick={() => setCreating(true)}>
                <Plus />
                {t('hospital.services.create_first')}
              </Button>
            }
          />
        ) : (
          <Card className="overflow-hidden py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('hospital.services.table_name')}</TableHead>
                  <TableHead>{t('hospital.services.table_type')}</TableHead>
                  <TableHead>{t('hospital.services.table_capacity')}</TableHead>
                  <TableHead>{t('hospital.services.table_available')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      {service.name}
                    </TableCell>
                    <TableCell>
                      {service.serviceTypeName ? (
                        <Badge variant="outline">
                          {service.serviceTypeName}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {service.capacity ?? '—'}
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {service.availableSpots ?? '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t('common.edit')}
                          onClick={() => setEditing(service)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t('common.delete')}
                          onClick={() => setDeleting(service)}
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </AsyncContent>

      {(creating || editing) && (
        <ServiceFormModal
          service={editing}
          serviceTypes={serviceTypes.data ?? []}
          onClose={() => {
            setCreating(false)
            setEditing(null)
          }}
          onSaved={() => {
            setCreating(false)
            setEditing(null)
            reload()
          }}
        />
      )}

      {deleting ? (
        <DeleteServiceModal
          service={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={() => {
            setDeleting(null)
            reload()
          }}
        />
      ) : null}
    </>
  )
}

function ServiceFormModal({
  service,
  serviceTypes,
  onClose,
  onSaved,
}: {
  service: Service | null
  serviceTypes: ServiceType[]
  onClose: () => void
  onSaved: () => void
}) {
  const { t } = useI18n()
  const [name, setName] = useState(service?.name ?? '')
  const [serviceTypeId, setServiceTypeId] = useState(
    service?.serviceTypeId != null ? String(service.serviceTypeId) : '',
  )
  const [capacity, setCapacity] = useState(
    service?.capacity != null ? String(service.capacity) : '',
  )
  const [description, setDescription] = useState(service?.description ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const payload: Partial<Service> = {
      name,
      serviceTypeId: serviceTypeId || undefined,
      capacity: capacity ? Number(capacity) : undefined,
      description: description || undefined,
    }
    try {
      if (service) {
        await hospitalApi.updateService(service.id, payload)
      } else {
        await hospitalApi.createService(payload)
      }
      onSaved()
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : t('hospital.services.form.submit') + '…',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={service ? t('hospital.services.edit_modal.title') : t('hospital.services.new')}
      description={service ? t('hospital.services.form.edit') : t('hospital.services.title')}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            {t('hospital.services.form.cancel')}
          </Button>
          <Button type="submit" form="service-form" disabled={submitting}>
            {submitting
              ? t('hospital.services.form.submitting')
              : t('hospital.services.form.submit')}
          </Button>
        </>
      }
    >
      <form id="service-form" onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="svc-name">{t('hospital.services.form.name_label')}</Label>
          <Input
            id="svc-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('hospital.services.form.name_placeholder')}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="svc-type">{t('hospital.services.form.type_label')}</Label>
            <Select
              id="svc-type"
              value={serviceTypeId}
              onChange={(e) => setServiceTypeId(e.target.value)}
            >
              <option value="">{t('hospital.services.form.type_placeholder')}</option>
              {serviceTypes.map((st) => (
                <option key={st.id} value={String(st.id)}>
                  {st.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="svc-cap">{t('hospital.services.form.capacity_label')}</Label>
            <Input
              id="svc-cap"
              type="number"
              min={0}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder={t('hospital.services.form.capacity_placeholder')}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="svc-desc">{t('hospital.services.form.description_label')}</Label>
          <Textarea
            id="svc-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('hospital.services.form.description_placeholder')}
          />
        </div>
        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}
      </form>
    </Modal>
  )
}

function DeleteServiceModal({
  service,
  onClose,
  onDeleted,
}: {
  service: Service
  onClose: () => void
  onDeleted: () => void
}) {
  const { t } = useI18n()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function confirm() {
    setSubmitting(true)
    setError(null)
    try {
      await hospitalApi.deleteService(service.id)
      onDeleted()
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : t('hospital.services.delete_modal.error'),
      )
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={t('hospital.services.delete_modal.title')}
      description={t('hospital.services.delete_modal.description')}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            {t('common.cancel')}
          </Button>
          <Button variant="destructive" onClick={confirm} disabled={submitting}>
            {submitting
              ? t('hospital.services.delete_modal.submitting')
              : t('common.delete')}
          </Button>
        </>
      }
    >
      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          {t('hospital.services.delete_modal.hint')}
        </p>
      )}
    </Modal>
  )
}
