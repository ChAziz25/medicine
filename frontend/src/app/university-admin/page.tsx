"use client";

import Link from "next/link";
import {
  Building2,
  GraduationCap,
  ListChecks,
  Layers,
} from "@/lib/icons";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { useApi } from "@/lib/use-api";
import { adminApi } from "@/lib/api";
import type { University, ServiceType, Service, Hospital } from "@/lib/types";
import { ROLE_LABELS } from "@/lib/roles";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UniversityAdminDashboardPage() {
  const { t } = useI18n();
  const { user } = useAuth();

  const universities = useApi<University[]>(
    () => adminApi.listUniversities(),
    [],
  );
  const serviceTypes = useApi<ServiceType[]>(
    () => adminApi.listServiceTypes(),
    [],
  );
  const services = useApi<Service[]>(() => adminApi.listServices(), []);
  const hospitals = useApi<Hospital[]>(() => adminApi.listHospitals(), []);

  const userUniversity = universities.data?.find(
    (u) => u.id === user?.universityId,
  );
  const userUniversityName =
    userUniversity?.name ?? t("universityAdmin.dashboard.no_university");

  const quickLinks = [
    {
      label: t("universityAdmin.dashboard.link_universities"),
      icon: GraduationCap,
      href: "/university-admin/universities",
    },
    {
      label: t("universityAdmin.dashboard.link_service_types"),
      icon: Layers,
      href: "/university-admin/service-types",
    },
  ];

  return (
    <>
      <PageHeader
        title={t("universityAdmin.dashboard.title")}
        description={t("universityAdmin.dashboard.description")}
      />

      {/* User info card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("universityAdmin.dashboard.user_card")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">
              {t("universityAdmin.dashboard.name")}
            </p>
            <p className="font-medium">{user?.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("universityAdmin.dashboard.email")}
            </p>
            <p className="font-medium">{user?.email ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("universityAdmin.dashboard.role")}
            </p>
            <p className="font-medium">
              {t(ROLE_LABELS[user?.role ?? "UNIVERSITY_ADMIN"])}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("universityAdmin.dashboard.university")}
            </p>
            <p className="font-medium">{userUniversityName}</p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t("universityAdmin.dashboard.stats.universities")}
          value={universities.data?.length ?? 0}
          icon={GraduationCap}
        />
        <StatCard
          label={t("universityAdmin.dashboard.stats.serviceTypes")}
          value={serviceTypes.data?.length ?? 0}
          icon={Layers}
        />
        <StatCard
          label={t("universityAdmin.dashboard.stats.services")}
          value={services.data?.length ?? 0}
          icon={ListChecks}
        />
        <StatCard
          label={t("universityAdmin.dashboard.stats.hospitalAdmins")}
          value={hospitals.data?.length ?? 0}
          icon={Building2}
        />
      </div>

      {/* Quick links */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("universityAdmin.dashboard.link_universities")}
          </CardTitle>
          <CardDescription>
            {t("universityAdmin.dashboard.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link) => (
              <Button
                key={link.href}
                asChild
                variant="outline"
                className="h-auto justify-start gap-3 px-4 py-3"
              >
                <Link href={link.href}>
                  <link.icon className="size-4 shrink-0" />
                  {link.label}
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
