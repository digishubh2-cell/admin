"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuestions, useTemplateMutations } from "@/hooks/use-assessments";
import type { AssessmentTemplate } from "@/types/assessment";

function getErrorMessage(err: unknown) {
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: AssessmentTemplate | null;
}

export function TemplateFormDialog({ open, onOpenChange, template }: Props) {
  const { create, update } = useTemplateMutations();
  const { data: questionsData, isLoading: questionsLoading } = useQuestions({
    limit: 200,
    isActive: "true",
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description || "");
      setDurationMinutes(String(template.durationMinutes));
      setSelectedIds(template.questionIds || []);
      setIsActive(template.isActive);
    } else {
      setName("");
      setDescription("");
      setDurationMinutes("30");
      setSelectedIds([]);
      setIsActive(true);
    }
  }, [template, open]);

  const grouped = useMemo(() => {
    const items = questionsData?.items || [];
    return {
      tech: items.filter((q) => q.category === "tech"),
      aptitude: items.filter((q) => q.category === "aptitude"),
    };
  }, [questionsData]);

  function toggle(id: string) {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Template name is required");
      return;
    }
    if (!selectedIds.length) {
      toast.error("Select at least one question");
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      durationMinutes: Number(durationMinutes) || 30,
      questionIds: selectedIds,
      isActive,
    };

    try {
      if (template) {
        await update.mutateAsync({ id: template.id, payload });
        toast.success("Template updated");
      } else {
        await create.mutateAsync(payload);
        toast.success("Template created");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  const busy = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template ? "Edit template" : "New template"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                min={5}
                max={240}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <Label>
              Questions ({selectedIds.length} selected)
            </Label>
            {questionsLoading ? (
              <p className="text-sm text-admin-text-muted">Loading questions…</p>
            ) : (
              <div className="mt-2 max-h-72 space-y-4 overflow-y-auto rounded-xl border border-admin-border p-3">
                {(["tech", "aptitude"] as const).map((cat) =>
                  grouped[cat].length ? (
                    <div key={cat}>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-admin-text-muted">
                        {cat}
                      </p>
                      <div className="space-y-1.5">
                        {grouped[cat].map((q) => (
                          <label
                            key={q.id}
                            className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-admin-muted/40"
                          >
                            <Checkbox
                              checked={selectedIds.includes(q.id)}
                              onCheckedChange={() => toggle(q.id)}
                              className="mt-0.5"
                            />
                            <span className="line-clamp-2">{q.prompt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : null
                )}
                {!grouped.tech.length && !grouped.aptitude.length ? (
                  <p className="text-sm text-admin-text-muted">
                    No active questions yet — create some in the question bank first.
                  </p>
                ) : null}
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active (selectable for invites)
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={busy}>
              {template ? "Save changes" : "Create template"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
