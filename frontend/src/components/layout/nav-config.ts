import {
  Building2,
  ClipboardList,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  Stethoscope,
  Layers,
  UserPlus,
  Users,
  type LucideIcon,
} from "@/lib/icons";
import type { Role } from "@/lib/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface SectionConfig {
  allowedRoles: Role[];
  items: NavItem[];
}

export const STUDENT_NAV: SectionConfig = {
  allowedRoles: ["STUDENT"],
  items: [
    { label: "nav.dashboard", href: "/student", icon: LayoutDashboard },
    { label: "nav.hospitals", href: "/student/hospitals", icon: Building2 },
    {
      label: "nav.applications",
      href: "/student/applications",
      icon: ClipboardList,
    },
  ],
};

export const HOSPITAL_NAV: SectionConfig = {
  allowedRoles: ["HOSPITAL_ADMIN", "HOSPITAL_EMPLOYEE"],
  items: [
    { label: "nav.dashboard", href: "/hospital", icon: LayoutDashboard },
    { label: "nav.services", href: "/hospital/services", icon: Stethoscope },
    {
      label: "nav.candidates",
      href: "/hospital/applications",
      icon: ClipboardList,
    },
    { label: "nav.employees", href: "/hospital/employees", icon: UserPlus },
  ],
};

export const ADMIN_NAV: SectionConfig = {
  allowedRoles: ["SYSTEM_ADMIN", "TEACHER", "ADMIN"],
  items: [
    { label: "nav.dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "nav.hospitals", href: "/admin/hospitals", icon: Building2 },
    {
      label: "nav.universities",
      href: "/admin/universities",
      icon: GraduationCap,
    },
    { label: "nav.serviceTypes", href: "/admin/service-types", icon: Layers },
    { label: "nav.services", href: "/admin/services", icon: ListChecks },
    {
      label: "nav.hospitalAdmins",
      href: "/admin/hospital-admins",
      icon: Building2,
    },
    {
      label: "nav.universityAdmins",
      href: "/admin/university-admins",
      icon: GraduationCap,
    },
    { label: "nav.admins", href: "/admin/admins", icon: Users },
  ],
};

export const UNIVERSITY_ADMIN_NAV: SectionConfig = {
  allowedRoles: ["UNIVERSITY_ADMIN", "SYSTEM_ADMIN"],
  items: [
    {
      label: "nav.dashboard",
      href: "/university-admin",
      icon: LayoutDashboard,
    },
    {
      label: "nav.universities",
      href: "/university-admin/universities",
      icon: GraduationCap,
    },
    {
      label: "nav.serviceTypes",
      href: "/university-admin/service-types",
      icon: Layers,
    },
    {
      label: "nav.teachers",
      href: "/university-admin/teachers",
      icon: UserPlus,
    },
    {
      label: "nav.studentCodes",
      href: "/university-admin/student-codes",
      icon: KeyRound,
    },
  ],
};
