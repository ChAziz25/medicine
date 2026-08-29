'use client'

import { useState } from 'react'
import { ListChecks } from '@/lib/icons'
import { useApi } from '@/lib/use-api'
import { useI18n } from '@/lib/i18n-context'
import { adminApi, ApiError } from '@/lib/api'
import type { Service, ServiceType } from '@/lib/types'
import { CrudManager } from '@/components/shared/crud-manager'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

export default function AdminServicesPage() {
  const { t } = useI18n()
  const { data, loading, error, reload } = useApi<Service[]>(
    () => adminApi.listServices(),
    [],
  )
  const serviceTypes = useApi<ServiceType[]>(() => adminApi.listServiceTypes(), [])

  const types = serviceTypes.data ?? []

  return (
    <CrudManager<Service>
      title={t('admin.services.title')}
      description={t('admin.services.description')}
      addLabel={t('admin.services.add')}
      columns={[
        {
          key: 'name',
          header: t('admin.form_name'),
          render: (s) => <span className="font-medium">{s.name}</span>,
        },
        {
          key: 'type',
          header: t('admin.form_type'),
          render: (s) =>
            s.serviceTypeName ? (
              s.serviceTypeName
            ) : (
              <span className="text-muted-foreground">{t('shared.not_applicable')}</span>
            ),
        },
        {
          key: 'capacity',
          header: t('admin.form_capacity'),
          render: (s) =>
            s.capacity != null ? s.capacity : t('shared.not_applicable'),
        },
      ]}
      rows={data ?? []}
      loading={loading}
      error={error}
      onRetry={reload}
      emptyIcon={ListChecks}
      emptyTitle={t('admin.empty_services')}
      emptyDescription={t('admin.empty_services_desc')}
      rowKey={(s) => s.id}
      renderForm={({ editing, close }) => (
        <ServiceForm
          editing={editing}
          serviceTypes={types}
          close={close}
          onDone={reload}
        />
      )}
      onDelete={(s) => adminApi.deleteService(s.id)}
      formTitleAdd={t('admin.services.add')}
      formTitleEdit={t('admin.services.edit')}
    />
  )
}

function ServiceForm({
  editing,
  serviceTypes,
  close,
  onDone,
}: {
  editing: Service | null
  serviceTypes: ServiceType[]
  close: () => void
  onDone: () => void
}) {
  const { t } = useI18n()
  const [name, setName] = useState(editing?.name ?? '')
  const [serviceTypeId, setServiceTypeId] = useState(
    editing?.serviceTypeId != null ? String(editing.serviceTypeId) : '',
  )
  const [capacity, setCapacity] = useState(
    editing?.capacity != null ? String(editing.capacity) : '',
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const payload: Partial<Service> = {
      name,
      serviceTypeId: serviceTypeId || undefined,
      capacity: capacity ? Number(capacity) : undefined,
    }
    try {
      if (editing) {
        await adminApi.updateService(editing.id, payload)
      } else {
        await adminApi.createService(payload)
      }
      onDone()
      close()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('shared.data_load_error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="svc-name">{t('admin.form_name')}</Label>
        <Input
          id="svc-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('admin.form_name_placeholder')}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="svc-type">{t('admin.form_type')}</Label>
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
          <Label htmlFor="svc-cap">{t('admin.form_capacity')}</Label>
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
      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={close} disabled={submitting}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? t('admin.form_saving') : t('admin.form_save')}
        </Button>
      </div>
    </form>
  )
}