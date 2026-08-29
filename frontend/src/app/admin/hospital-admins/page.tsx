'use client'

import { useState } from 'react'
import { Loader2 } from '@/lib/icons'
import { useApi } from '@/lib/use-api'
import { useI18n } from '@/lib/i18n-context'
import { adminApi, ApiError } from '@/lib/api'
import type { Hospital } from '@/lib/types'
import { PageHeader } from '@/components/shared/page-header'
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
import { Select } from '@/components/ui/select'

export default function AdminHospitalAdminsPage() {
  const { t } = useI18n()
  const hospitals = useApi<Hospital[]>(() => adminApi.listHospitals(), [])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hospitalId, setHospitalId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    if (!hospitalId) {
      setError(t('admin.register_needs_select'))
      return
    }
    setSubmitting(true)
    try {
      await adminApi.createHospitalAdmin({
        name,
        email,
        password,
        hospitalId,
      })
      setSuccess(true)
      setName('')
      setEmail('')
      setPassword('')
      setHospitalId('')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('shared.data_load_error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader
        title={t('admin.hospitalAdmins.title')}
        description={t('admin.hospitalAdmins.description')}
      />

      <div className="mx-auto w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.hospitalAdmins.title')}</CardTitle>
            <CardDescription>
              {t('admin.hospitalAdmins.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hab-name">{t('auth.register.name')}</Label>
                <Input
                  id="hab-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('admin.form_name_placeholder')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hab-email">{t('admin.form_email')}</Label>
                <Input
                  id="hab-email"
                  type="email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.tn"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hab-password">{t('admin.form_password')}</Label>
                <Input
                  id="hab-password"
                  type="password"
                  autoComplete="off"
                  minLength={4}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hab-hospital">{t('admin.hospitalAdmins.select')}</Label>
                <Select
                  id="hab-hospital"
                  value={hospitalId}
                  onChange={(e) => setHospitalId(e.target.value)}
                  required
                >
                  <option value="">{t('admin.form_name')}…</option>
                  {(hospitals.data ?? []).map((h) => (
                    <option key={h.id} value={String(h.id)}>
                      {h.name}
                    </option>
                  ))}
                </Select>
              </div>

              {success ? (
                <p className="rounded-lg border border-emerald-600/20 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {t('admin.register_success')}
                </p>
              ) : null}
              {error ? (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {error}
                </p>
              ) : null}

              <div className="flex items-center gap-2">
                <Button type="submit" disabled={submitting || hospitals.loading}>
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      {t('admin.form_saving')}
                    </>
                  ) : (
                    t('admin.hospitalAdmins.create')
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}