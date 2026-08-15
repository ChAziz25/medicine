/**
 * Central configuration for the frontend.
 *
 * The backend is an existing Spring Boot REST API. The base URL is read from
 * the NEXT_PUBLIC_API_URL environment variable so it can be pointed at any
 * environment (local, staging, production) without code changes.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'
