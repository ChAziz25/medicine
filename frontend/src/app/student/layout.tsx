import { DashboardShell } from '@/components/layout/dashboard-shell'
import { STUDENT_NAV } from '@/components/layout/nav-config'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardShell section={STUDENT_NAV}>{children}</DashboardShell>
}
