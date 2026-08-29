'use client'

import { useRouter } from 'next/navigation'
import { Loader2 } from '@/lib/icons'
import { useAuth } from '@/lib/auth-context'
import { useI18n } from '@/lib/i18n-context'
import { ROLE_LABELS } from '@/lib/roles'
import { PageHeader } from '@/components/shared/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function StudentProfilePage() {
  const { t } = useI18n()
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?'

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary" />
          {t('common.loading')}
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title={t('student.profile.title')}
        description={t('student.profile.description')}
        actions={
          <Button
            variant="destructive"
            onClick={() => logout().finally(() => router.replace('/login'))}
          >
            {t('student.profile.logout')}
          </Button>
        }
      />

      {user ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="gap-4">
            <CardHeader className="items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
                {initials}
              </div>
              <div className="space-y-0.5">
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription>{t(ROLE_LABELS[user.role])}</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('student.profile.account')}</CardTitle>
              <CardDescription>
                {t('student.profile.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <IdentRow label={t('student.profile.name')} value={user.name} />
              <IdentRow
                label={t('student.profile.email')}
                value={user.email ?? t('shared.not_applicable')}
              />
              <IdentRow
                label={t('student.profile.role')}
                value={t(ROLE_LABELS[user.role])}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {t('home.login_prompt')}
          </CardContent>
        </Card>
      )}
    </>
  )
}

function IdentRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="truncate text-sm font-medium">{value}</span>
    </div>
  )
}