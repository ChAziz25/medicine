"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { authApi, ApiError } from "@/lib/api";
import { CheckCircle2, Loader2 } from "@/lib/icons";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await authApi.registerStudent({ name, email, password });
      setSuccess(true);
      setTimeout(() => router.replace("/login"), 1200);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(t("auth.login.error_generic"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-semibold">MedStage</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold leading-tight text-balance">
            {t("home.tagline")}
          </h1>
          <p className="max-w-md text-sm text-primary-foreground/80 text-pretty leading-relaxed">
            {t("home.description")}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-primary-foreground/70">
          <CheckCircle2 className="size-4" />
          {t("auth.register.role_hint")}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex justify-end gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t("auth.register.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("auth.register.subtitle")}
            </p>
          </div>

          {success ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-600/20 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <CheckCircle2 className="size-4 shrink-0" />
              {t("auth.register.success")}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">{t("auth.register.name")}</Label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.register.email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="nom@exemple.tn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.register.password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                minLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error ? (
              <p
                role="alert"
                className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={submitting || success}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  {t("auth.register.submitting")}
                </>
              ) : (
                t("auth.register.submit")
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {t("auth.register.have_account")}{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              {t("auth.register.login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}