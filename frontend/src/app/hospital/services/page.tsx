'use client'

import { useMemo, useState } from 'react'
import { Plus, Stethoscope } from '@/lib/icons'
import { useApi } from '@/lib/use-api'
import { useI18n } from '@/lib/i18n-context'
import { hospitalApi, adminApi, ApiError } from '@/lib/api'
import type { Hospital, Service } from '@/lib/types'
import { PageHeader } from '@/components/shared/page-header'
import { AsyncContent } from '@/components/shared/async-content'
import { EmptyState } from '@/components/shared/empty-state'
import { Modal } from '@/components/shared/modal'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
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
  // HospitalService links (what each hospital currently offers).
  const { data, loading, error, reload } = useApi<Service[]>(
    () => hospitalApi.listServices(),
    [],
  )
  // Global service catalog (created by the system admin via /admin/services).
  const catalog = useApi<Service[]>(() => adminApi.listServices(), [])
  // Hospitals to attach a service to (no reliable "my hospital" endpoint yet).
  const hospitals = useApi<Hospital[]>(() => adminApi.listHospitals(), [])

  const [adding, setAdding] = useState(false)

  const services = (data ?? []).map((s) => ({
    ...s,
    // list_HospitalService returns every {hospital, service} pair; expose both.
    hospitalName: s.hospitalName ?? t('shared.not_applicable'),
  }))

  // Services already linked to the currently selected hospital, to avoid
  // creating duplicate links from the add flow.
  const linkedKeys = useMemo(
    () =>
      new Set(
        services.map((s) => `${String(s.hospitalName)}::${String(s.name)}`),
      ),
    [services],
  )

  return (
    <>
      <PageHeader
        title={t('hospital.services.title')}
        description={t('hospital.services.manage_desc')}
        actions={
          <Button onClick={() => setAdding(true)}>
            <Plus />
            {t('hospital.services.add_to_hospital')}
          </Button>
        }
      />

      <AsyncContent loading={loading} error={error} onRetry={reload}>
        {services.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title={t('hospital.services.no_services')}
            description={t('hospital.services.manage_desc')}
            action={
              <Button size="sm" onClick={() => setAdding(true)}>
                <Plus />
                {t('hospital.services.add_to_hospital')}
              </Button>
            }
          />
        ) : (
          <Card className="overflow-hidden py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('hospital.services.table_name')}</TableHead>
                  <TableHead>{t('nav.hospitals')}</TableHead>
                  <TableHead>{t('hospital.services.table_capacity')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={String(service.id)}>
                    <TableCell className="font-medium">
                      {service.name ?? t('shared.not_applicable')}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {service.hospitalName}
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {service.capacity ?? t('shared.not_applicable')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </AsyncContent>

      {adding ? (
        <AddServiceModal
          catalog={catalog.data ?? []}
          hospitalList={hospitals.data ?? []}
          hospitalsLoading={hospitals.loading}
          linkedKeys={linkedKeys}
          onClose={() => setAdding(false)}
          onAdded={() => {
            setAdding(false)
            reload()
            catalog.reload()
          }}
        />
      ) : null}
    </>
  )
function AddServiceModal({
  catalog,
  hospitalList,
  hospitalsLoading,
  linkedKeys,
  onClose,
  onAdded,
}: {
  catalog: Service[]
  hospitalList: Hospital[]
  hospitalsLoading: boolean
  linkedKeys: Set<string>
  onClose: () => void
  onAdded: () => void
}) {
  const { t } = useI18n()
  const [hospitalId, setHospitalId] = useState(() =>
    hospitalList[0] ? String(hospitalList[0].id) : '',
  )
  const [serviceId, setServiceId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const selectedHospitalName =
    hospitalList.find((h) => String(h.id) === hospitalId)?.name ?? ''

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    if (!hospitalId || !serviceId) {
      setError(t('admin.register_needs_select'))
      return
    }
    const selService = catalog.find((s) => String(s.id) === serviceId)
    const selHospital = hospitalList.find((h) => String(h.id) === hospitalId)
    if (
      selService &&
      selHospital &&
      linkedKeys.has(`${selHospital.name}::${selService.name}`)
    ) {
      setError(t('hospital.services.already_linked'))
      return
    }
    setSubmitting(true)
    try {
      await hospitalApi.addServiceToHospital(hospitalId, serviceId)
      setSuccess(true)
      setServiceId('')
      setTimeout(onAdded, 700)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : t('shared.data_load_error'),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={t('hospital.services.add_to_hospital')}
      description={t('hospital.services.manage_desc')}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="add-svc-form" disabled={submitting}>
            {submitting
              ? t('admin.form_saving')
              : t('hospital.services.add_to_hospital')}
          </Button>
        </>
      }
    >
      <form id="add-svc-form" onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pick-hospital">
            {t('hospital.services.pick_hospital')}
          </Label>
          {hospitalsLoading ? (
            <p className="text-sm text-muted-foreground">
              {t('common.loading')}
            </p>
          ) : (
            <Select
              id="pick-hospital"
              value={hospitalId}
              onChange={(e) => setHospitalId(e.target.value)}
              required
            >
              <option value="">{t('admin.form_name')}…</option>
              {hospitalList.map((h) => (
                <option key={h.id} value={String(h.id)}>
                  {h.name}
                </option>
              ))}
            </Select>
          )}
          {selectedHospitalName ? (
            <p className="text-xs text-muted-foreground">
              {t('hospital.services.pick_hospital')}: {selectedHospitalName}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pick-service">
            {t('hospital.services.pick_service')}
          </Label>
          {catalog.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t('hospital.services.no_services_desc')}
            </p>
          ) : (
            <Select
              id="pick-service"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              required
            >
              <option value="">{t('admin.form_name')}…</option>
              {catalog.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name}
                </option>
              ))}
            </Select>
          )}
        </div>

        {success ? (
          <p className="rounded-lg border border-emerald-600/20 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {t('hospital.services.success')}
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
      </form>
    </Modal>
  )
}
}