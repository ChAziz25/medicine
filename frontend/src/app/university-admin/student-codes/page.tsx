"use client";

import { useState } from "react";
import { CheckCircle2, KeyRound, Loader2, Upload } from "@/lib/icons";
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

export default function UniversityAdminStudentCodesPage() {
  const { t } = useI18n();

  const [code, setCode] = useState("");
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [uploadSubmitting, setUploadSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  async function submitSingle(e: React.FormEvent) {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(false);
    setAddSubmitting(true);
    try {
      await universityApi.addStudentCode(code.trim());
      setAddSuccess(true);
      setCode("");
    } catch (err) {
      setAddError(
        err instanceof ApiError ? err.message : t("shared.data_load_error"),
      );
    } finally {
      setAddSubmitting(false);
    }
  }

  async function submitBulk(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploadError(null);
    setUploadSuccess(null);
    if (!file) return;
    setUploadSubmitting(true);
    try {
      const result = await universityApi.uploadStudentCodes(file);
      setUploadSuccess(
        t("universityAdmin.studentCodes.bulk_success", {
          added: String(result.added ?? 0),
        }),
      );
      setFile(null);
      // Reset the input so the same file can be imported again.
      e.currentTarget.reset();
    } catch (err) {
      setUploadError(
        err instanceof ApiError
          ? err.message
          : t("universityAdmin.studentCodes.bulk_error"),
      );
    } finally {
      setUploadSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        title={t("universityAdmin.studentCodes.title")}
        description={t("universityAdmin.studentCodes.description")}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Single code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="size-5 text-primary" />
              {t("universityAdmin.studentCodes.single_title")}
            </CardTitle>
            <CardDescription>
              {t("universityAdmin.studentCodes.single_desc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitSingle} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sc-code">
                  {t("universityAdmin.studentCodes.single_label")}
                </Label>
                <Input
                  id="sc-code"
                  type="text"
                  autoComplete="off"
                  placeholder={t(
                    "universityAdmin.studentCodes.single_placeholder",
                  )}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>

              {addSuccess ? (
                <p className="rounded-lg border border-emerald-600/20 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  <CheckCircle2 className="mr-1.5 inline size-4" />
                  {t("universityAdmin.studentCodes.single_success")}
                </p>
              ) : null}
              {addError ? (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {addError}
                </p>
              ) : null}

              <Button type="submit" disabled={addSubmitting}>
                {addSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {t("admin.form_saving")}
                  </>
                ) : (
                  t("universityAdmin.studentCodes.single_add")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
{/* Bulk import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="size-5 text-primary" />
              {t("universityAdmin.studentCodes.bulk_title")}
            </CardTitle>
            <CardDescription>
              {t("universityAdmin.studentCodes.bulk_desc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitBulk} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sc-file">
                  {t("universityAdmin.studentCodes.bulk_file")}
                </Label>
                <Input
                  id="sc-file"
                  type="file"
                  accept=".csv,.txt,text/plain,text/csv"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  required
                />
              </div>

              {uploadSuccess ? (
                <p className="rounded-lg border border-emerald-600/20 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  <CheckCircle2 className="mr-1.5 inline size-4" />
                  {uploadSuccess}
                </p>
              ) : null}
              {uploadError ? (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {uploadError}
                </p>
              ) : null}

              <Button type="submit" disabled={uploadSubmitting || !file}>
                {uploadSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {t("universityAdmin.studentCodes.bulk_uploading")}
                  </>
                ) : (
                  t("universityAdmin.studentCodes.bulk_upload")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}