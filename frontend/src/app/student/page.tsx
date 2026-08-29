"use client";

import Link from "next/link";
import {
  Building2,
  ClipboardList,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Stethoscope,
  Users,
} from "@/lib/icons";
import { useAuth } from "@/lib/auth-context";
import { ROLE_LABELS } from "@/lib/roles";
import { useI18n } from "@/lib/i18n-context";
import { useApi } from "@/lib/use-api";
import { studentApi } from "@/lib/api";
import type { Application } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { AsyncContent } from "@/components/shared/async-content";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentProfilePage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { data, loading, error, reload } = useApi<Application[]>(
    () => studentApi.listMyApplications(),
    [],
  );

  const applications = data ?? [];
  const pending = applications.filter(
    (a) => ["PENDING", "UNDER_REVIEW"].includes(a.status),
  ).length;
  const accepted = applications.filter((a) => a.status === "ACCEPTED").length;
  const recent = applications.slice(0, 5);

    return (
    <>
      <PageHeader
        title={`${t("home.authenticated.greeting")}${user?.name ? `, ${user.name}` : ""}`}
        description={t("student.dashboard.description")}
      />

      {/* Profile summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((p) => p[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xl font-semibold">{user?.name ?? "?"}</p>
              {user ? (
                <p className="text-sm text-muted-foreground">
                  {t(ROLE_LABELS[user.role])}
                </p>
              ) : null}
              {user?.email ? (
                <p className="truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              ) : null}
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/student/profile">
                {t("student.profile.view_full")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hero / CTA — the app's core action for students */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary via-primary to-primary text-primary-foreground">
        <CardContent className="py-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-xl bg-white/10">
              <Stethoscope className="size-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold sm:text-3xl">
                {t("student.dashboard.hero_title")}
              </h2>
              <p className="mx-auto max-w-md text-sm text-primary-foreground/80 sm:text-base">
                {t("student.dashboard.hero_desc")}
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="mt-2 bg-white text-primary hover:bg-white/90"
            >
              <Link href="/student/hospitals">
                <Search className="size-4" />
                {t("student.dashboard.hero_cta")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label={t("student.total_applications")}
          value={applications.length}
          icon={ClipboardList}
        />
        <StatCard label={t("student.pending")} value={pending} icon={Clock} />
                <StatCard
          label={t("student.accepted")}
          value={accepted}
          icon={CheckCircle2}
        />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" asChild>
          <Link href="/student/hospitals">
            <Search className="size-4" />
            {t("student.dashboard.quick_browse")}
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/student/applications">
            <ClipboardList className="size-4" />
            {t("student.dashboard.quick_applications")}
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/student/profile">
            <Users className="size-4" />
            {t("student.dashboard.quick_profile")}
          </Link>
        </Button>
      </div>

      {/* Recent applications */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>{t("student.recent_applications")}</CardTitle>
            <CardDescription>
              {t("student.dashboard.description")}
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/student/applications">{t("student.see_all")}</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <AsyncContent loading={loading} error={error} onRetry={reload}>
            {recent.length === 0 ? (
              <EmptyState
                icon={Building2}
                title={t("student.no_applications")}
                description={t("student.browse_hint")}
                action={
                  <Button asChild size="sm">
                    <Link href="/student/hospitals">
                      {t("student.see_hospitals")}
                    </Link>
                  </Button>
                }
              />
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((app) => (
                  <li
                    key={app.id}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {app.serviceName ?? t("shared.not_applicable")}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {app.hospitalName ?? t("shared.not_applicable")}
                      </p>
                    </div>
                    <StatusBadge status={app.status} />
                  </li>
                ))}
              </ul>
            )}
          </AsyncContent>
        </CardContent>
      </Card>
    </>
  );
}
