"use client";

import { useState, type ReactNode } from "react";
import { Plus, Pencil, Trash2, type LucideIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Modal } from "@/components/shared/modal";
import { AsyncContent } from "@/components/shared/async-content";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

interface CrudManagerProps<T> {
  title: string;
  description?: string;
  addLabel: string;
  columns: Column<T>[];
  rows: T[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  rowKey: (row: T) => string | number;
  renderForm: (args: { editing: T | null; close: () => void }) => ReactNode;
  onDelete?: (row: T) => Promise<void> | void;
  formTitleAdd: string;
  formTitleEdit: string;
}

export function CrudManager<T>({
  title,
  description,
  addLabel,
  columns,
  rows,
  loading,
  error,
  onRetry,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  rowKey,
  renderForm,
  onDelete,
  formTitleAdd,
  formTitleEdit,
}: CrudManagerProps<T>) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(row: T) {
    setEditing(row);
    setFormOpen(true);
  }

  async function confirmDelete() {
    if (!deleting || !onDelete) return;
    setDeleteBusy(true);
    try {
      await onDelete(deleting);
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button onClick={openAdd}>
            <Plus className="size-4" />
            {addLabel}
          </Button>
        }
      />

      <AsyncContent loading={loading} error={error} onRetry={onRetry}>
        {rows.length === 0 ? (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
            action={
              <Button size="sm" onClick={openAdd}>
                <Plus className="size-4" />
                {addLabel}
              </Button>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((c) => (
                    <TableHead key={c.key} className={c.className}>
                      {c.header}
                    </TableHead>
                  ))}
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={rowKey(row)}>
                    {columns.map((c) => (
                      <TableCell key={c.key} className={c.className}>
                        {c.render(row)}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Modifier"
                          onClick={() => openEdit(row)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        {onDelete ? (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Supprimer"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleting(row)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </AsyncContent>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? formTitleEdit : formTitleAdd}
      >
        {renderForm({ editing, close: () => setFormOpen(false) })}
      </Modal>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Confirmer la suppression"
        description="Cette action est irréversible."
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteBusy}
            >
              {deleteBusy ? "Suppression…" : "Supprimer"}
            </Button>
          </>
        }
      />
    </div>
  );
}
