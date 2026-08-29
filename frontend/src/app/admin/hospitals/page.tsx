"use client";

import { useState } from "react";
import { Building2 } from "@/lib/icons";
import { useApi } from "@/lib/use-api";
import { useI18n } from "@/lib/i18n-context";
import { adminApi, ApiError } from "@/lib/api";
import type { Hospital } from "@/lib/types";
import { CrudManager } from "@/components/shared/crud-manager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminHospitalsPage() {
  const { t } = useI18n();
  const { data, loading, error, reload } = useApi<Hospital[]>(
    () => adminApi.listHospitals(),
    [],
  );

  return (
    <CrudManager<Hospital>
      title={t("admin.hospitals.title")}
      description={t("admin.hospitals.description")}
      addLabel={t("admin.hospitals.add")}
      columns={[
        {
          key: "name",
          header: t("admin.form_name"),
          render: (h) => <span className="font-medium">{h.name}</span>,
        },
        {
          key: "city",
          header: t("admin.form_city"),
          render: (h) =>
            h.address ? (
              <span className="font-medium">{h.address}</span>
            ) : (
              t("shared.not_applicable")
            ),
        },
      ]}
      rows={data ?? []}
      loading={loading}
      error={error}
      onRetry={reload}
      emptyIcon={Building2}
      emptyTitle={t("admin.empty_hospitals")}
      emptyDescription={t("admin.empty_hospitals_desc")}
      rowKey={(h) => h.id}
      renderForm={({ editing, close }) => (
        <HospitalForm editing={editing} close={close} onDone={reload} />
      )}
      onDelete={(h) => adminApi.deleteHospital(h.id)}
      formTitleAdd={t("admin.hospitals.add")}
      formTitleEdit={t("admin.hospitals.edit")}
    />
  );
}

function HospitalForm({
  editing,
  close,
  onDone,
}: {
  editing: Hospital | null;
  close: () => void;
  onDone: () => void;
}) {
  const { t } = useI18n();
  const [name, setName] = useState(editing?.name ?? "");
  const [city, setCity] = useState(editing?.city ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (editing) {
        await adminApi.updateHospital(editing.id, {
          name,
          city: city || undefined,
        });
      } else {
        await adminApi.createHospital({ name, city: city || undefined });
      }
      onDone();
      close();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : t("shared.data_load_error"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="hospital-name">{t("admin.form_name")}</Label>
        <Input
          id="hospital-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("admin.form_name_placeholder")}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hospital-city">{t("admin.form_city")}</Label>
        <Input
          id="hospital-city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t("admin.form_city_placeholder")}
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
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={close}
          disabled={submitting}
        >
          {t("common.cancel")}
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? t("admin.form_saving") : t("admin.form_save")}
        </Button>
      </div>
    </form>
  );
}
