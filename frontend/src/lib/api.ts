import { API_BASE_URL } from "./config";
import type {
  Application,
  Hospital,
  Service,
  ServiceType,
  University,
  User,
} from "./types";

/**
 * Thin, typed client for the existing Spring Boot REST API.
 *
 * Auth: the backend issues a JWT stored in an HttpOnly cookie, so every request
 * uses `credentials: 'include'` and we never touch the token from JS.
 */

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type FetchOptions = Omit<RequestInit, "body"> & { body?: unknown };

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let parsed: unknown = undefined;
    try {
      parsed = await res.json();
    } catch {
      // ignore non-JSON error bodies
    }
    const b = parsed as { message?: string; error?: string } | null;
    const message =
      b?.message ?? b?.error ?? `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message, parsed);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

/* -- Response transformers ------------------------------------------------- */
/* The Spring controllers return leaner DTOs than the frontend types expect.
   These helpers bridge the gap so the UI keeps working. */

function transformHospital(raw: {
  id: string | number;
  name: string;
}): Hospital {
  return { id: raw.id, name: raw.name };
}

function transformServiceType(raw: {
  id: string | number;
  name: string;
}): ServiceType {
  return { id: raw.id, name: raw.name };
}

function transformService(raw: { id: string | number; name: string }): Service {
  return { id: raw.id, name: raw.name };
}

/** HospitalService endpoint returns `{ id, "hospital name", "service name", capacity }` */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformHospitalService(raw: any): Service {
  return {
    id: raw.id,
    name: String(raw["service name"] ?? raw.name ?? ""),
    hospitalName: raw["hospital name"],
    capacity: raw.capacity,
    availableSpots: raw.capacity,
  };
}

/** Application entities come back nested — flatten to the UI-friendly shape. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformApplication(raw: any): Application {
  const hs = raw.hospitalService;
  const service = hs?.service;
  const hospital = hs?.hospital;
  const student = raw.student;
  return {
    id: raw.id,
    studentId: student?.id ?? raw.studentId,
    studentName: student?.name ?? raw.studentName,
    student,
    serviceId: service?.id,
    serviceName: service?.name ?? raw.serviceName,
    hospitalName: hospital?.name ?? raw.hospitalName,
    status: (raw.status as Application["status"]) ?? "PENDING",
    submittedAt: raw.createdAt ?? raw.submittedAt,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    motivation: raw.motivation,
    hospitalService: hs,
  };
}

/* -------------------------------------------------------------------------- */
/* Auth                                                                        */
/* -------------------------------------------------------------------------- */

export const authApi = {
  // POST /api/user/login — sets JWT cookie, returns { message, name, role }
  login: (email: string, password: string) =>
    apiFetch<Record<string, unknown>>("/user/login", {
      method: "POST",
      body: { email, password },
    }),

  // GET /api/user/checkSession — returns { id, name, role }
  me: () => apiFetch<User>("/user/checkSession"),

  // POST /api/user/logout — clears JWT cookie
  logout: () =>
    apiFetch<{ message: string }>("/user/logout", { method: "POST" }),

  // POST /api/user/StudentRegister — creates a student account, body: { name, email, password }
  registerStudent: (data: { name: string; email: string; password: string }) =>
    apiFetch<Record<string, unknown>>("/user/StudentRegister", {
      method: "POST",
      body: data,
    }),
};

/* -------------------------------------------------------------------------- */
/* Student                                                                     */
/* -------------------------------------------------------------------------- */

export const studentApi = {
  // GET /api/hospital/listHospitals → [{ id, name }]
  listHospitals: async (): Promise<Hospital[]> => {
    const raw = await apiFetch<Array<{ id: string | number; name: string }>>(
      "/hospital/listHospitals",
    );
    return raw.map(transformHospital);
  },

  // GET /api/service/list_HospitalService → [{ id, "hospital name", "service name", capacity }]
  listServices: async (_hospitalId?: string | number): Promise<Service[]> => {
    const raw = await apiFetch<Record<string, unknown>[]>(
      "/service/list_HospitalService",
    );
    return raw.map(transformHospitalService);
  },

  // GET /api/user/listApplicationsByStudentId
  listMyApplications: async (): Promise<Application[]> => {
    const raw = await apiFetch<Record<string, unknown>[]>(
      "/user/listApplicationsByStudentId",
    );
    return raw.map(transformApplication);
  },

  // POST /api/user/Apply — body: { hospitalServiceId, motivation? }
  apply: (serviceId: string | number, motivation?: string) =>
    apiFetch<Record<string, unknown>>("/user/Apply", {
      method: "POST",
      body: { hospitalServiceId: serviceId, motivation },
    }),

  // Cancel — not yet implemented on the backend
  cancelApplication: (id: string | number) =>
    apiFetch<void>(`/user/application/${id}/cancel`, { method: "POST" }),
};

/* -------------------------------------------------------------------------- */
/* Hospital admin                                                              */
/* -------------------------------------------------------------------------- */

export const hospitalApi = {
  // Placeholder — no dedicated "my hospital" endpoint yet
  myHospital: () => apiFetch<Hospital>("/hospital/me"),

  // GET /api/service/list_HospitalService
  listServices: async (): Promise<Service[]> => {
    const raw = await apiFetch<Record<string, unknown>[]>(
      "/service/list_HospitalService",
    );
    return raw.map(transformHospitalService);
  },

  // POST /api/service/add_service — body: { name, typeId }
  createService: (data: Partial<Service>) =>
    apiFetch("/service/add_service", {
      method: "POST",
      body: { name: data.name, typeId: data.serviceTypeId },
    }),

  // POST /api/service/add_ServiceToHospital — body: { hospitalId, serviceId }
  addServiceToHospital: (
    hospitalId: string | number,
    serviceId: string | number,
  ) =>
    apiFetch("/service/add_ServiceToHospital", {
      method: "POST",
      body: { hospitalId, serviceId },
    }),

  // Not yet implemented on the backend
  updateService: (id: string | number, data: Partial<Service>) =>
    apiFetch(`/hospital/services/${id}`, { method: "PUT", body: data }),

  deleteService: (id: string | number) =>
    apiFetch<void>(`/hospital/services/${id}`, { method: "DELETE" }),

  // GET /api/user/listApplicationsByHospitalId
  listApplications: async (): Promise<Application[]> => {
    const raw = await apiFetch<Record<string, unknown>[]>(
      "/user/listApplicationsByHospitalId",
    );
    return raw.map(transformApplication);
  },

  // PATCH /api/user/applicationReview — body: { applicationId, accepted: boolean }
  decideApplication: (id: string | number, decision: "ACCEPTED" | "REJECTED") =>
    apiFetch<Record<string, unknown>>("/user/applicationReview", {
      method: "PATCH",
      body: { applicationId: id, accepted: decision === "ACCEPTED" },
    }),
};

/* -------------------------------------------------------------------------- */
/* System admin                                                                */
/* -------------------------------------------------------------------------- */

export const adminApi = {
  // Hospitals
  // GET /api/hospital/listHospitals
  listHospitals: async (): Promise<Hospital[]> => {
    const raw = await apiFetch<Array<{ id: string | number; name: string }>>(
      "/hospital/listHospitals",
    );
    return raw.map(transformHospital);
  },
  // POST /api/hospital/createHospital — body: { name }
  createHospital: (data: Partial<Hospital>) =>
    apiFetch<Record<string, unknown>>("/hospital/createHospital", {
      method: "POST",
      body: { name: data.name },
    }),
  updateHospital: (id: string | number, data: Partial<Hospital>) =>
    apiFetch(`/admin/hospitals/${id}`, { method: "PUT", body: data }),
  deleteHospital: (id: string | number) =>
    apiFetch<void>(`/admin/hospitals/${id}`, { method: "DELETE" }),

  // Universities
  // GET /api/university/listUniversities
  listUniversities: async (): Promise<University[]> => {
    const raw = await apiFetch<Array<{ id: string | number; name: string }>>(
      "/university/listUniversities",
    );
    return raw.map((u) => ({ id: u.id, name: u.name }));
  },
  // POST /api/university/createUniversity — body: { name }
  createUniversity: (data: Partial<University>) =>
    apiFetch<Record<string, unknown>>("/university/createUniversity", {
      method: "POST",
      body: { name: data.name },
    }),
  updateUniversity: (id: string | number, data: Partial<University>) =>
    apiFetch(`/admin/universities/${id}`, { method: "PUT", body: data }),
  deleteUniversity: (id: string | number) =>
    apiFetch<void>(`/admin/universities/${id}`, { method: "DELETE" }),

  // Service types
  // GET /api/service/list_type
  listServiceTypes: async (): Promise<ServiceType[]> => {
    const raw =
      await apiFetch<Array<{ id: string | number; name: string }>>(
        "/service/list_type",
      );
    return raw.map(transformServiceType);
  },
  // POST /api/service/add_type — body: { name }
  createServiceType: (data: Partial<ServiceType>) =>
    apiFetch<Record<string, unknown>>("/service/add_type", {
      method: "POST",
      body: { name: data.name },
    }),
  updateServiceType: (id: string | number, data: Partial<ServiceType>) =>
    apiFetch(`/admin/service-types/${id}`, { method: "PUT", body: data }),
  deleteServiceType: (id: string | number) =>
    apiFetch<void>(`/admin/service-types/${id}`, { method: "DELETE" }),

  // Services
  // GET /api/service/list_service
  listServices: async (): Promise<Service[]> => {
    const raw = await apiFetch<Array<{ id: string | number; name: string }>>(
      "/service/list_service",
    );
    return raw.map(transformService);
  },
  // POST /api/service/add_service — body: { name, typeId }
  createService: (data: Partial<Service>) =>
    apiFetch<Record<string, unknown>>("/service/add_service", {
      method: "POST",
      body: { name: data.name, typeId: data.serviceTypeId },
    }),
  updateService: (id: string | number, data: Partial<Service>) =>
    apiFetch(`/admin/services/${id}`, { method: "PUT", body: data }),
  deleteService: (id: string | number) =>
    apiFetch<void>(`/admin/services/${id}`, { method: "DELETE" }),

  // Hospital admins
  // POST /api/user/H_AdminRegister — body: { name, email, password, hospitalId }
  createHospitalAdmin: (data: {
    name: string;
    email: string;
    password: string;
    hospitalId: string | number;
  }) =>
    apiFetch<Record<string, unknown>>("/user/H_AdminRegister", {
      method: "POST",
      body: data,
    }),

  // University admins
  // POST /api/user/Uni_AdminRegister — body: { name, email, password, universityId }
  createUniversityAdmin: (data: {
    name: string;
    email: string;
    password: string;
    universityId: string | number;
  }) =>
    apiFetch<Record<string, unknown>>("/user/Uni_AdminRegister", {
      method: "POST",
      body: data,
    }),
};
