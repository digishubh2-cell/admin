"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuestionMutations, useQuestions } from "@/hooks/use-assessments";
import type { AssessmentQuestion, QuestionListParams } from "@/types/assessment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AssessmentsTabs } from "./AssessmentsTabs";
import { QuestionFormDialog } from "./QuestionFormDialog";

export function QuestionsPage() {
  const [params, setParams] = useState<QuestionListParams>({ page: 1, limit: 50 });
  const { data, isLoading } = useQuestions(params);
  const { remove } = useQuestionMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AssessmentQuestion | null>(null);

  function handleCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function handleEdit(question: AssessmentQuestion) {
    setEditing(question);
    setDialogOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this question? Templates referencing it will keep only a snapshot for past attempts.")) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Question deleted");
    } catch {
      toast.error("Failed to delete question");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Assessments</h1>
          <p className="mt-1 text-admin-text-secondary">
            Question bank used to build assessment templates.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          New question
        </Button>
      </div>

      <AssessmentsTabs />

      <div className="grid gap-4 rounded-2xl border border-admin-border bg-admin-surface p-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <Label htmlFor="q-search">Search</Label>
          <Input
            id="q-search"
            placeholder="Search prompt..."
            value={params.search || ""}
            onChange={(e) => setParams((p) => ({ ...p, search: e.target.value, page: 1 }))}
          />
        </div>
        <div>
          <Label htmlFor="q-category">Category</Label>
          <select
            id="q-category"
            className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
            value={params.category || ""}
            onChange={(e) =>
              setParams((p) => ({
                ...p,
                category: (e.target.value || undefined) as QuestionListParams["category"],
                page: 1,
              }))
            }
          >
            <option value="">All categories</option>
            <option value="tech">Tech</option>
            <option value="aptitude">Aptitude</option>
          </select>
        </div>
        <div>
          <Label htmlFor="q-active">Status</Label>
          <select
            id="q-active"
            className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
            value={params.isActive || ""}
            onChange={(e) =>
              setParams((p) => ({
                ...p,
                isActive: (e.target.value || undefined) as QuestionListParams["isActive"],
                page: 1,
              }))
            }
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      ) : !data?.items.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-admin-border py-16 text-center">
          <p className="text-lg font-medium">No questions yet</p>
          <p className="mt-1 max-w-md text-sm text-admin-text-muted">
            Create questions to build assessment templates, or run{" "}
            <code className="rounded bg-admin-muted px-1 py-0.5">npm run seed:assessments</code>{" "}
            in the backend.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.items.map((q) => (
            <div
              key={q.id}
              className="flex flex-col gap-2 rounded-2xl border border-admin-border bg-admin-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{q.prompt}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" className="capitalize">
                    {q.category}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {q.difficulty}
                  </Badge>
                  {!q.isActive ? <Badge variant="danger">Inactive</Badge> : null}
                  {(q.stackTags || []).map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(q)} aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(q.id)}
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <QuestionFormDialog open={dialogOpen} onOpenChange={setDialogOpen} question={editing} />
    </div>
  );
}
