'use client'

import { GraduationCap, MapPin, Mail } from '@/lib/icons'
import { useAuth } from '@/lib/auth-context'
import { useI18n } from '@/lib/i18n-context'
import { useApi } from '@/lib/use-api'
import { adminApi } from '@/lib/api'
import type { University } from '@/lib/types'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function UniversityAdminUniversitiesPage() {
  const { t } = useI18n()
  const { user } = useAuth()
  const universities = useApi<University[]>(() => adminApi.listUniversities(), [])

  return (
    <>
      <PageHeader
        title={t('universityAdmin.universities.title')}
        description={t('universityAdmin.universities.description')}
      />

      {universities.loading ? (
        <p className="text-sm text-muted-foreground">{t('shared.loading_data')}</p>
      ) : universities.error ? (
        <p className="text-sm text-destructive">{t('shared.data_load_error')}</p>
      ) : !universities.data || universities.data.length === 0 ? (
        <EmptyState
          title={t('universityAdmin.universities.no_results')}
          description={t('universityAdmin.universities.no_results_desc')}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {universities.data.map((u) => {
            const isUserUniversity = u.id === user?.universityId
            return (
              <Card key={u.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="size-5 text-primary" />
                    {u.name}
                    {isUserUniversity && (
                      <span className="text-xs font-medium text-emerald-600">
                        ({t('universityAdmin.universities.your_university')})
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {u.city && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="size-4 shrink-0" />
                      {u.city}
                    </div>
                  )}
                  {u.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="size-4 shrink-0" />
                      {u.email}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}
