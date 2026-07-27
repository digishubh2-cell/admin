"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuestionMutations } from "@/hooks/use-assessments";
import type { AssessmentQuestion, QuestionCategory, QuestionDifficulty } from "@/types/assessment";

function getErrorMessage(err: unknown) {
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

function emptyOptions() {
  return [
    { id: "a", text: "" },
    { id: "b", text: "" },
    { id: "c", text: "" },
    { id: "d", text: "" },
  ];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question?: AssessmentQuestion | null;
}

export function QuestionFormDialog({ open, onOpenChange, question }: Props) {
  const { create, update } = useQuestionMutations();
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState(emptyOptions());
  const [correctOptionId, setCorrectOptionId] = useState("a");
  const [category, setCategory] = useState<QuestionCategory>("tech");
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>("medium");
  const [stackTags, setStackTags] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (question) {
      setPrompt(question.prompt);
      setOptions(question.options.length ? question.options : emptyOptions());
      setCorrectOptionId(question.correctOptionId);
      setCategory(question.category);
      setDifficulty(question.difficulty);
      setStackTags((question.stackTags || []).join(", "));
      setIsActive(question.isActive);
    } else {
      setPrompt("");
      setOptions(emptyOptions());
      setCorrectOptionId("a");
      setCategory("tech");
      setDifficulty("medium");
      setStackTags("");
      setIsActive(true);
    }
  }, [question, open]);

  function updateOptionText(id: string, text: string) {
    setOptions((opts) => opts.map((o) => (o.id === id ? { ...o, text } : o)));
  }

  function addOption() {
    if (options.length >= 8) return;
    const nextId = String.fromCharCode(97 + options.length);
    setOptions((opts) => [...opts, { id: nextId, text: "" }]);
  }

  function removeOption(id: string) {
    if (options.length <= 2) return;
    setOptions((opts) => opts.filter((o) => o.id !== id));
    if (correctOptionId === id) setCorrectOptionId(options[0]?.id || "a");
  }

  async function handleSave() {
    const trimmedOptions = options.filter((o) => o.text.trim());
    if (!prompt.trim() || trimmedOptions.length < 2) {
      toast.error("Add a prompt and at least 2 options");
      return;
    }
    if (!trimmedOptions.some((o) => o.id === correctOptionId)) {
      toast.error("Select a valid correct option");
      return;
    }

    const payload = {
      prompt: prompt.trim(),
      options: trimmedOptions,
      correctOptionId,
      category,
      difficulty,
      stackTags: stackTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isActive,
    };

    try {
      if (question) {
        await update.mutateAsync({ id: question.id, payload });
        toast.success("Question updated");
      } else {
        await create.mutateAsync(payload);
        toast.success("Question created");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  const busy = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{question ? "Edit question" : "New question"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Prompt</Label>
            <Textarea rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Category</Label>
              <select
                className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value as QuestionCategory)}
              >
                <option value="tech">Tech</option>
                <option value="aptitude">Aptitude</option>
              </select>
            </div>
            <div>
              <Label>Difficulty</Label>
              <select
                className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as QuestionDifficulty)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <Label>Stack tags (comma separated)</Label>
            <Input
              value={stackTags}
              onChange={(e) => setStackTags(e.target.value)}
              placeholder="react, javascript, css"
            />
          </div>

          <div className="space-y-2">
            <Label>Options — select the correct one</Label>
            {options.map((opt, idx) => (
              <div key={opt.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctOptionId === opt.id}
                  onChange={() => setCorrectOptionId(opt.id)}
                  aria-label={`Mark option ${idx + 1} as correct`}
                />
                <Input
                  value={opt.text}
                  onChange={(e) => updateOptionText(opt.id, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={options.length <= 2}
                  onClick={() => removeOption(opt.id)}
                  aria-label="Remove option"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              disabled={options.length >= 8}
            >
              <Plus className="h-4 w-4" />
              Add option
            </Button>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active (usable in templates)
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={busy}>
              {question ? "Save changes" : "Create question"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
