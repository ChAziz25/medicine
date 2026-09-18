"use client";

import { useState } from "react";
import { Loader2, UserPlus } from "@/lib/icons";
import { useI18n } from "@/lib/i18n-context";
import { universityApi, ApiError } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UniversityAdminTeachersPage() {
  const { t } = useI18n();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      await universityApi.createTeacher({ name, email, password });
      setSuccess(true);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : t("shared.data_load_error"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        title={t("universityAdmin.teachers.title")}
        description={t("universityAdmin.teachers.description")}
      />

      <div className="mx-auto w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="size-5 text-primary" />
              {t("universityAdmin.teachers.title")}
            </CardTitle>
            <CardDescription>
              {t("universityAdmin.teachers.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="t-name">{t("auth.register.name")}</Label>
                <Input
                  id="t-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("admin.form_name_placeholder")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-email">{t("admin.form_email")}</Label>
                <Input
                  id="t-email"
                  type="email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.tn"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-password">{t("admin.form_password")}</Label>
                <Input
                  id="t-password"
                  type="password"
                  autoComplete="off"
                  minLength={4}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {success ? (
                <p className="rounded-lg border border-emerald-600/20 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {t("universityAdmin.teachers.success")}
                </p>
              ) : null}
              {error ? (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {error}
                </p>
              ) : null}

              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {t("admin.form_saving")}
                  </>
                ) : (
                  t("universityAdmin.teachers.create")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}