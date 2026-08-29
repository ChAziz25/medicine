"use client"

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Building2,
  ClipboardList,
  Globe,
  GraduationCap,
  Layers,
  Search,
  Stethoscope,
  type LucideIcon,
} from "@/lib/icons";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { roleHome } from "@/lib/roles";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Role } from "@/lib/types";

const STUDENT_ROLES: Role[] = ["STUDENT"];
const HOSPITAL_ROLES: Role[] = ["HOSPITAL_ADMIN", "HOSPITAL_EMPLOYEE"];
const ADMIN_ROLES: Role[] = [
  "SYSTEM_ADMIN",
  "UNIVERSITY_ADMIN",
  "TEACHER",
  "ADMIN",
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const { t } = useI18n();

  return (
    <div className="min-h-svh bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Activity className="size-4" />
            </div>
            <span className="text-lg font-semibold">MedStage</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
            {!loading && user ? (
              <Button asChild size="sm">
                <Link href={roleHome(user.role)}>
                  {t("common.view")} {t("nav.dashboard")}
                  <ArrowRight />
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href="/login">{t("home.login_button")}</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Globe className="mr-1.5 size-3.5" />
              {t("home.tagline")}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              {!loading && user
                ? `${t("home.authenticated.greeting")}, ${user.name}`
                : t("home.welcome")}
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground text-pretty leading-relaxed sm:text-lg">
              {t("home.description")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {!loading && user ? (
                <Button asChild size="lg">
                  <Link href={roleHome(user.role)}>
                    {t("common.view")} {t("nav.dashboard")}
                    <ArrowRight />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg">
                    <Link href="/login">
                      {t("home.login_button")}
                      <ArrowRight />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/register">{t("auth.register.title")}</Link>
                  </Button>
                </>
              )}
              <Button asChild size="lg" variant="outline">
                <Link href="/student/hospitals">
                  <Search />
                  {t("home.browse_services")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon={Search}
              title={t("home.feature_browse.title")}
              description={t("home.feature_browse.description")}
            />
            <Feature
              icon={ClipboardList}
              title={t("home.feature_apply.title")}
              description={t("home.feature_apply.description")}
            />
            <Feature
              icon={Stethoscope}
              title={t("home.feature_manage.title")}
              description={t("home.feature_manage.description")}
            />
            <Feature
              icon={Layers}
              title={t("home.feature_admin.title")}
              description={t("home.feature_admin.description")}
            />
          </div>
        </div>
      </section>

      {/* Role-aware actions */}
      {!loading && user ? (
        <section className="border-t border-border py-12">
          <div className="mx-auto w-full max-w-6xl space-y-6 px-4 sm:px-6">
            {STUDENT_ROLES.includes(user.role) ? (
              <QuickLinks
                title={t("home.student.quick_links")}
                links={[
                  {
                    href: "/student/hospitals",
                    label: t("home.student.browse_hospitals"),
                    icon: Building2,
                  },
                  {
                    href: "/student/applications",
                    label: t("home.student.my_applications"),
                    icon: ClipboardList,
                  },
                ]}
              />
            ) : null}

            {HOSPITAL_ROLES.includes(user.role) ? (
              <QuickLinks
                title={t("home.hospital.quick_links")}
                links={[
                  {
                    href: "/hospital/services",
                    label: t("home.hospital.manage_services"),
                    icon: Stethoscope,
                  },
                  {
                    href: "/hospital/applications",
                    label: t("home.hospital.review_applications"),
                    icon: ClipboardList,
                  },
                ]}
              />
            ) : null}

            {ADMIN_ROLES.includes(user.role) ? (
              <QuickLinks
                title={t("home.admin.quick_links")}
                links={[
                  {
                    href: "/admin/hospitals",
                    label: t("home.admin.manage_hospitals"),
                    icon: Building2,
                  },
                  {
                    href: "/admin/universities",
                    label: t("home.admin.manage_universities"),
                    icon: GraduationCap,
                  },
                  {
                    href: "/admin/services",
                    label: t("home.admin.manage_services"),
                    icon: Stethoscope,
                  },
                ]}
              />
            ) : null}
          </div>
        </section>
      ) : (
        <section className="border-t border-border py-16 text-center">
          <div className="mx-auto w-full max-w-md px-4">
            <Button asChild size="lg">
              <Link href="/login">
                {t("home.login_button")}
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="mx-auto w-full max-w-6xl px-4 text-center text-xs text-muted-foreground sm:px-6">
          {t("footer.copyright")}
        </div>
      </footer>
    </div>
  );
}

type IconComponent = LucideIcon;

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Card className="gap-3 py-5">
      <CardHeader className="px-5">
        <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-5" />
        </div>
        <CardTitle className="pt-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-5">
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function QuickLinks({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; icon: IconComponent }[];
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
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
    </div>
  );
}
