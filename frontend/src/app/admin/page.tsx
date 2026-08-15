'use client'

import Link from 'next/link'
import {
  Building2,
  GraduationCap,
  Layers,
  ListChecks,
  ArrowRight,
} from '@/lib/icons'
import { useI18n } from '@/lib/i18n-context'
import { useApi } from '@/lib/use-api'
import { adminApi } from '@/lib/api'
import type { Hospital, Service, ServiceType, University } from '@/lib/types'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminDashboardPage() {
  const { t } = useI18n()
  const hospitals = useApi<Hospital[]>(() => adminApi.listHospitals(), [])
  const universities = useApi<University[]>(() => adminApi.listUniversities(), [])
  const serviceTypes = useApi<ServiceType[]>(() => adminApi.listServiceTypes(), [])
  const services = useApi<Service[]>(() => adminApi.listServices(), [])

  return (
    <>
      <PageHeader
        title={t('admin.dashboard.title')}
        description={t('admin.dashboard.description')}
        actions={
          <Button asChild>
            <Link href="/admin/hospitals">
              {t('admin.hospitals.title')}
              <ArrowRight />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t('admin.hospitals.title')}
          value={hospitals.data?.length ?? 0}
          icon={Building2}
        />
        <StatCard
          label={t('admin.universities.title')}
          value={universities.data?.length ?? 0}
          icon={GraduationCap}
        />
        <StatCard
          label={t('admin.serviceTypes.title')}
          value={serviceTypes.data?.length ?? 0}
          icon={Layers}
        />
        <StatCard
          label={t('admin.services.title')}
          value={services.data?.length ?? 0}
          icon={ListChecks}
        />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>{t('admin.dashboard.title')}</CardTitle>
            <CardDescription>{t('admin.dashboard.description')}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: '/admin/hospitals',
                label: t('admin.hospitals.title'),
                icon: Building2,
              },
              {
                href: '/admin/universities',
                label: t('admin.universities.title'),
                icon: GraduationCap,
              },
              {
                href: '/admin/service-types',
                label: t('admin.serviceTypes.title'),
                icon: Layers,
              },
              {
                href: '/admin/services',
                label: t('admin.services.title'),
                icon: ListChecks,
              },
            ].map((link) => (
              <Button
                key={link.href}
                asChild
                variant="outline"
                className="h-auto justify-start gap-3 px-4 py-3"
              >
                <Link href={link.href}>
                  <link.icon className="size-4 shrink-0" />
                  {link.label}
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}