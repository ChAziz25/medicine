"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { ApiError } from "@/lib/api";
import { Loader2 } from "@/lib/icons";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Already authenticated — stay on the unified landing page for browsing.
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError(t("auth.login.error_credentials"));
      } else if (err instanceof ApiError) {
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
          <div className="flex size-9 items-center justify-center rounded-md bg-primary-foreground/15">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <span className="text-2xl text-primary">✚</span>
            </div>
          </div>
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <span className="text-lg text-primary">✓</span>
          </div>
          {t("footer.copyright")}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2 lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="text-lg">✚</span>
              </div>
              <span className="text-lg font-semibold">MedStage</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t("auth.login.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("auth.login.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.login.email")}</Label>
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
              <Label htmlFor="password">{t("auth.login.password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
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
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  {t("auth.login.submitting")}
                </>
              ) : (
                t("auth.login.submit")
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground text-pretty">
            {t("auth.no_account")}
          </p>
        </div>
      </div>
    </div>
  );
}
