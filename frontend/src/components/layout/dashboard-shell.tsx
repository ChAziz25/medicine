'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Activity, LogOut, Menu, X } from '@/lib/icons'
import { useAuth } from '@/lib/auth-context'
import { useI18n } from '@/lib/i18n-context'
import { ROLE_LABELS, roleHome } from '@/lib/roles'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import type { SectionConfig } from './nav-config'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DashboardShellProps {
  section: SectionConfig
  children: React.ReactNode
}

export function DashboardShell({ section, children }: DashboardShellProps) {
  const { user, loading, logout } = useAuth()
  const { t } = useI18n()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/login')
    } else if (!section.allowedRoles.includes(user.role)) {
      router.replace(roleHome(user.role))
    }
  }, [loading, user, section.allowedRoles, router])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false)
  }, [pathname])

  if (loading || !user || !section.allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="size-4 animate-pulse text-primary" />
          {t('common.loading')}
        </div>
      </div>
    )
  }

  const initials = user.name ? user.name[0].toUpperCase() : 'U'

  const navList = (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {section.items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== roleHome(user.role) && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {t(item.label)}
          </Link>
        )
      })}
    </nav>
  )

  const brand = (
    <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
      <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Activity className="size-4" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold">MedStage</p>
        <p className="text-[11px] text-muted-foreground">{t('home.tagline')}</p>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-svh bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        {brand}
        {navList}
        <div className="border-t border-sidebar-border p-3 text-[11px] text-muted-foreground">
          {t('footer.copyright')}
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-sidebar shadow-lg">
            <div className="flex items-center justify-between">
              {brand}
              <Button
                variant="ghost"
                size="icon-sm"
                className="mr-3"
                onClick={() => setMobileOpen(false)}
                aria-label={t('common.close')}
              >
                <X />
              </Button>
            </div>
            {navList}
          </aside>
        </div>
      ) : null}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
          <Button
            variant="outline"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label={t('common.open')}
          >
            <Menu />
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {t(ROLE_LABELS[user.role])}
              </p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
              {initials}
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                logout().finally(() => router.replace('/login'))
              }}
              aria-label={t('common.logout')}
            >
              <LogOut />
            </Button>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
