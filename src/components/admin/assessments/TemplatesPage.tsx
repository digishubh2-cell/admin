"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTemplateMutations, useTemplates } from "@/hooks/use-assessments";
import type { AssessmentTemplate } from "@/types/assessment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AssessmentsTabs } from "./AssessmentsTabs";
import { TemplateFormDialog } from "./TemplateFormDialog";

export function TemplatesPage() {
  const { data: templates, isLoading } = useTemplates(true);
  const { remove } = useTemplateMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AssessmentTemplate | null>(null);

  function handleCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function handleEdit(template: AssessmentTemplate) {
    setEditing(template);
    setDialogOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this template? Past attempts keep their own question snapshot.")) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Template deleted");
    } catch {
      toast.error("Failed to delete template");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Assessments</h1>
          <p className="mt-1 text-admin-text-secondary">
            Reusable templates that bundle questions for a candidate invite.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          New template
        </Button>
      </div>

      <AssessmentsTabs />

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : !templates?.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-admin-border py-16 text-center">
          <p className="text-lg font-medium">No templates yet</p>
          <p className="mt-1 max-w-md text-sm text-admin-text-muted">
            Create a template from questions in your bank, or run{" "}
            <code className="rounded bg-admin-muted px-1 py-0.5">npm run seed:assessments</code>{" "}
            in the backend for presets.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <div key={t.id} className="rounded-2xl border border-admin-border bg-admin-surface p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{t.name}</p>
                {!t.isActive ? <Badge variant="danger">Inactive</Badge> : null}
                {t.isPreset ? <Badge variant="outline">Preset</Badge> : null}
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-admin-text-muted">{t.description}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-admin-text-muted">
                <Badge variant="outline">{t.questionIds.length} questions</Badge>
                <Badge variant="outline">{t.durationMinutes}m</Badge>
              </div>
              <div className="mt-3 flex gap-1">
                <Button variant="outline" size="sm" onClick={() => handleEdit(t)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TemplateFormDialog open={dialogOpen} onOpenChange={setDialogOpen} template={editing} />
    </div>
  );
}
