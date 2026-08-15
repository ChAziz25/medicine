'use client'

import { useState } from 'react'
import { GraduationCap } from '@/lib/icons'
import { useApi } from '@/lib/use-api'
import { useI18n } from '@/lib/i18n-context'
import { adminApi, ApiError } from '@/lib/api'
import type { University } from '@/lib/types'
import { CrudManager } from '@/components/shared/crud-manager'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminUniversitiesPage() {
  const { t } = useI18n()
  const { data, loading, error, reload } = useApi<University[]>(
    () => adminApi.listUniversities(),
    [],
  )

  return (
    <CrudManager<University>
      title={t('admin.universities.title')}
      description={t('admin.universities.description')}
      addLabel={t('admin.universities.add')}
      columns={[
        {
          key: 'name',
          header: t('admin.form_name'),
          render: (u) => <span className="font-medium">{u.name}</span>,
        },
        {
          key: 'city',
          header: t('admin.form_city'),
          render: (u) => u.city ?? t('shared.not_applicable'),
        },
      ]}
      rows={data ?? []}
      loading={loading}
      error={error}
      onRetry={reload}
      emptyIcon={GraduationCap}
      emptyTitle={t('admin.empty_universities')}
      emptyDescription={t('admin.empty_universities_desc')}
      rowKey={(u) => u.id}
      renderForm={({ editing, close }) => (
        <UniversityForm editing={editing} close={close} onDone={reload} />
      )}
      onDelete={(u) => adminApi.deleteUniversity(u.id)}
      formTitleAdd={t('admin.universities.add')}
      formTitleEdit={t('admin.universities.edit')}
    />
  )
}

function UniversityForm({
  editing,
  close,
  onDone,
}: {
  editing: University | null
  close: () => void
  onDone: () => void
}) {
  const { t } = useI18n()
  const [name, setName] = useState(editing?.name ?? '')
  const [city, setCity] = useState(editing?.city ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (editing) {
        await adminApi.updateUniversity(editing.id, { name, city: city || undefined })
      } else {
        await adminApi.createUniversity({ name, city: city || undefined })
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
        <Label htmlFor="uni-name">{t('admin.form_name')}</Label>
        <Input
          id="uni-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('admin.form_name_placeholder')}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="uni-city">{t('admin.form_city')}</Label>
        <Input
          id="uni-city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t('admin.form_city_placeholder')}
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
          {submitting ? t('admin.form_saving') : t('admin.form_save')}
        </Button>
      </div>
    </form>
  )
}