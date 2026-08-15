import { DashboardShell } from '@/components/layout/dashboard-shell'
import { ADMIN_NAV } from '@/components/layout/nav-config'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardShell section={ADMIN_NAV}>{children}</DashboardShell>
}