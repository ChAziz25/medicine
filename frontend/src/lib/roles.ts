import type { Role } from './types'

/** Translation keys for role labels. Translate with `t(key)` when rendering. */
export const ROLE_LABELS: Record<Role, string> = {
  STUDENT: 'role.student',
  HOSPITAL_ADMIN: 'role.hospitalAdmin',
  HOSPITAL_EMPLOYEE: 'role.hospitalEmployee',
  UNIVERSITY_ADMIN: 'role.universityAdmin',
  TEACHER: 'role.teacher',
  SYSTEM_ADMIN: 'role.systemAdmin',
  ADMIN: 'role.admin',
}

/** Landing route for each role after authentication. */
export const ROLE_HOME: Record<Role, string> = {
  STUDENT: '/student',
  HOSPITAL_ADMIN: '/hospital',
  HOSPITAL_EMPLOYEE: '/hospital',
  UNIVERSITY_ADMIN: '/university-admin',
  TEACHER: '/admin',
  SYSTEM_ADMIN: '/admin',
  ADMIN: '/admin',
}

export function roleHome(role: Role): string {
  return ROLE_HOME[role] ?? '/'
}
