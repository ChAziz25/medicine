/**
 * Domain types shared across the frontend.
 *
 * These mirror the expected shape of the Spring Boot REST API responses.
 * Adjust field names/types to match the real DTOs once the controllers are
 * fully confirmed.  Fields are kept intentionally permissive where the exact
 * backend contract is not yet known.
 */

export type Role =
  | 'STUDENT'
  | 'HOSPITAL_ADMIN'
  | 'HOSPITAL_EMPLOYEE'
  | 'UNIVERSITY_ADMIN'
  | 'TEACHER'
  | 'SYSTEM_ADMIN'
  | 'ADMIN'

export interface User {
  id: string | number
  name: string
  email?: string
  role: Role
  // Optional linkage depending on role
  hospitalId?: string | number
  universityId?: string | number
}

export type ApplicationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'REFUSED'
  | 'CANCELLED'
  | 'COMPLETED'

export interface University {
  id: string | number
  name: string
  city?: string
  address?: string
  email?: string
  phone?: string
}

export interface Hospital {
  id: string | number
  name: string
  city?: string
  address?: string
  email?: string
  phone?: string
  serviceCount?: number
}

export interface ServiceType {
  id: string | number
  name: string
  description?: string
}

export interface Service {
  id: string | number
  name: string
  hospitalId?: string | number
  hospitalName?: string
  serviceTypeId?: string | number
  serviceTypeName?: string
  capacity?: number
  availableSpots?: number
  description?: string
}

export interface Application {
  id: string | number
  studentId?: string | number
  studentName?: string
  student?: { id?: string | number; name?: string }
  serviceId?: string | number
  serviceName?: string
  hospitalName?: string
  hospitalService?: {
    id?: string | number
    capacity?: number
    hospital?: { name?: string }
    service?: { id?: string | number; name?: string }
  }
  status: ApplicationStatus
  submittedAt?: string
  createdAt?: string
  updatedAt?: string
  motivation?: string
}
