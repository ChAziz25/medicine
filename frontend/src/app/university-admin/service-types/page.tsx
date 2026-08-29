'use client'

import { useState } from 'react'
import { Layers } from '@/lib/icons'
import { useApi } from '@/lib/use-api'
import { useI18n } from '@/lib/i18n-context'
import { adminApi, ApiError } from '@/lib/api'
import type { ServiceType } from '@/lib/types'
import { CrudManager } from '@/components/shared/crud-manager'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function UniversityAdminServiceTypesPage() {
  const { t } = useI18n()
  const { data, loading, error, reload } = useApi<ServiceType[]>(
    () => adminApi.listServiceTypes(),
    [],
  )

  return (
    <CrudManager<ServiceType>
      title={t('universityAdmin.serviceTypes.title')}
      description={t('universityAdmin.serviceTypes.description')}
      addLabel={t('universityAdmin.serviceTypes.new')}
      columns={[
        {
          key: 'name',
          header: t('universityAdmin.serviceTypes.form_name'),
          render: (s) => <span className="font-medium">{s.name}</span>,
        },
      ]}
      rows={data ?? []}
      loading={loading}
      error={error}
      onRetry={reload}
      emptyIcon={Layers}
      emptyTitle={t('universityAdmin.serviceTypes.no_results')}
      emptyDescription={t('universityAdmin.serviceTypes.no_results_desc')}
      rowKey={(s) => s.id}
      renderForm={({ editing, close }) => (
        <ServiceTypeForm editing={editing} close={close} onDone={reload} />
      )}
      onDelete={(s) => adminApi.deleteServiceType(s.id)}
      formTitleAdd={t('universityAdmin.serviceTypes.new')}
      formTitleEdit={t('universityAdmin.serviceTypes.edit')}
    />
  )
}

function ServiceTypeForm({
  editing,
  close,
  onDone,
}: {
  editing: ServiceType | null
  close: () => void
  onDone: () => void
}) {
  const { t } = useI18n()
  const [name, setName] = useState(editing?.name ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (editing) {
        await adminApi.updateServiceType(editing.id, { name })
      } else {
        await adminApi.createServiceType({ name })
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
        <Label htmlFor="uat-name">{t('universityAdmin.serviceTypes.form_name')}</Label>
        <Input
          id="uat-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('universityAdmin.serviceTypes.form_name_placeholder')}
          required
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
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={close} disabled={submitting}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? t('universityAdmin.serviceTypes.form_saving') : t('universityAdmin.serviceTypes.form_submit')}
        </Button>
      </div>
    </form>
  )
}
