import { DashboardShell } from '@/components/layout/dashboard-shell'
import { UNIVERSITY_ADMIN_NAV } from '@/components/layout/nav-config'

export default function UniversityAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardShell section={UNIVERSITY_ADMIN_NAV}>{children}</DashboardShell>
}