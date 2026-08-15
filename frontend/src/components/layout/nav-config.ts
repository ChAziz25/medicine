import {
  Building2,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Stethoscope,
  Layers,
  type LucideIcon,
} from '@/lib/icons'
import type { Role } from '@/lib/types'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export interface SectionConfig {
  allowedRoles: Role[]
  items: NavItem[]
}

export const STUDENT_NAV: SectionConfig = {
  allowedRoles: ['STUDENT'],
  items: [
    { label: 'nav.dashboard', href: '/student', icon: LayoutDashboard },
    { label: 'nav.hospitals', href: '/student/hospitals', icon: Building2 },
    { label: 'nav.applications', href: '/student/applications', icon: ClipboardList },
  ],
}

export const HOSPITAL_NAV: SectionConfig = {
  allowedRoles: ['HOSPITAL_ADMIN', 'HOSPITAL_EMPLOYEE'],
  items: [
    { label: 'nav.dashboard', href: '/hospital', icon: LayoutDashboard },
    { label: 'nav.services', href: '/hospital/services', icon: Stethoscope },
    { label: 'nav.candidates', href: '/hospital/applications', icon: ClipboardList },
  ],
}

export const ADMIN_NAV: SectionConfig = {
  allowedRoles: ['SYSTEM_ADMIN', 'UNIVERSITY_ADMIN', 'TEACHER', 'ADMIN'],
  items: [
    { label: 'nav.dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'nav.hospitals', href: '/admin/hospitals', icon: Building2 },
    { label: 'nav.universities', href: '/admin/universities', icon: GraduationCap },
    { label: 'nav.serviceTypes', href: '/admin/service-types', icon: Layers },
    { label: 'nav.services', href: '/admin/services', icon: ListChecks },
  ],
}
