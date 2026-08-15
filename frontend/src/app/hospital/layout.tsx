import { DashboardShell } from '@/components/layout/dashboard-shell'
import { HOSPITAL_NAV } from '@/components/layout/nav-config'

export default function HospitalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardShell section={HOSPITAL_NAV}>{children}</DashboardShell>
}
