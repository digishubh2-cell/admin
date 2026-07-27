"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useAttempt, useAssessmentMutations } from "@/hooks/use-assessments";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function formatDate(date?: string | null) {
  if (!date) return "—";
  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  } catch {
    return "—";
  }
}

function getErrorMessage(err: unknown) {
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

export function AttemptDetailPage({ attemptId }: { attemptId: string }) {
  const { data: attempt, isLoading } = useAttempt(attemptId);
  const { decide } = useAssessmentMutations();
  const [notes, setNotes] = useState("");
  const [sendEmail, setSendEmail] = useState(true);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (!attempt) {
    return <p className="text-admin-text-muted">Attempt not found.</p>;
  }

  async function handleDecide(decision: "pass" | "fail" | "retake") {
    try {
      await decide.mutateAsync({
        id: attempt!.id,
        payload: { decision, notes: notes || null, sendEmail },
      });
      toast.success(`Marked as ${decision}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  const answerMap = new Map(attempt.answers.map((a) => [a.questionId, a.optionId]));
  const canDecide = attempt.status === "submitted";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/assessments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{attempt.candidateName}</h1>
          <p className="text-sm text-admin-text-muted">{attempt.candidateEmail}</p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <StatusBadge status={attempt.status} />
          <StatusBadge status={attempt.adminDecision} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
            <div>
              <p className="text-xs text-admin-text-muted">Role</p>
              <p className="mt-0.5 text-sm font-medium">{attempt.jobTitle || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-admin-text-muted">Template</p>
              <p className="mt-0.5 text-sm font-medium">
                {attempt.templateName || "—"} ({attempt.durationMinutes}m)
              </p>
            </div>
            <div>
              <p className="text-xs text-admin-text-muted">Path</p>
              <p className="mt-0.5 text-sm font-medium capitalize">
                {attempt.path === "both" ? "Test + Interview" : "Test only"}
              </p>
            </div>
            <div>
              <p className="text-xs text-admin-text-muted">Score</p>
              <p className="mt-0.5 text-sm font-medium">
                {attempt.autoScore.correct}/{attempt.autoScore.total} ({attempt.autoScore.percent}%)
              </p>
              <p className="text-xs text-admin-text-muted">
                Tech {attempt.autoScore.breakdown.tech.correct}/{attempt.autoScore.breakdown.tech.total} ·
                Aptitude {attempt.autoScore.breakdown.aptitude.correct}/
                {attempt.autoScore.breakdown.aptitude.total}
              </p>
            </div>
            <div>
              <p className="text-xs text-admin-text-muted">Started</p>
              <p className="mt-0.5 text-sm font-medium">{formatDate(attempt.startedAt)}</p>
            </div>
            <div>
              <p className="text-xs text-admin-text-muted">Submitted</p>
              <p className="mt-0.5 text-sm font-medium">{formatDate(attempt.submittedAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-5">
            <p className="text-xs text-admin-text-muted">Identity selfie</p>
            {attempt.selfie?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={attempt.selfie.url}
                alt={`${attempt.candidateName} selfie`}
                className="h-40 w-40 rounded-xl border border-admin-border object-cover"
              />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-xl border border-dashed border-admin-border text-xs text-admin-text-muted">
                No selfie captured
              </div>
            )}
            {attempt.selfie?.capturedAt ? (
              <p className="text-xs text-admin-text-muted">
                Captured {formatDate(attempt.selfie.capturedAt)}
              </p>
            ) : null}
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href={`/applications?applicationId=${attempt.applicationId}`}>
                View application
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl border border-admin-border bg-admin-surface p-5">
        <h2 className="text-lg font-semibold">Decision</h2>
        {!canDecide ? (
          <p className="mt-2 text-sm text-admin-text-muted">
            {attempt.status === "expired" || attempt.status === "void"
              ? `This attempt is "${attempt.status}" — no decision needed.`
              : "Waiting for the candidate to submit before a decision can be recorded."}
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            <div>
              <Label>Internal notes (optional)</Label>
              <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
              />
              Notify candidate by email
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                disabled={decide.isPending}
                onClick={() => handleDecide("pass")}
                className="bg-success text-white hover:bg-success/90"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark qualified
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={decide.isPending}
                onClick={() => handleDecide("fail")}
              >
                <XCircle className="h-4 w-4" />
                Mark not qualified
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={decide.isPending}
                onClick={() => handleDecide("retake")}
              >
                Allow retake
              </Button>
            </div>
          </div>
        )}
        {attempt.adminNotes ? (
          <p className="mt-3 rounded-lg bg-admin-muted/40 p-3 text-sm">
            <span className="font-medium">Notes: </span>
            {attempt.adminNotes}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Answers ({attempt.templateSnapshot.length})</h2>
        {attempt.templateSnapshot.map((q, index) => {
          const given = answerMap.get(q.id);
          const correct = q.correctOptionId;
          return (
            <div key={q.id} className="rounded-2xl border border-admin-border bg-admin-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium">
                  {index + 1}. {q.prompt}
                </p>
                <Badge variant="outline" className="capitalize shrink-0">
                  {q.category}
                </Badge>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {q.options.map((opt) => {
                  const isGiven = given === opt.id;
                  const isCorrect = correct === opt.id;
                  return (
                    <div
                      key={opt.id}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm",
                        isCorrect && "border-success/40 bg-success/10",
                        isGiven && !isCorrect && "border-danger/40 bg-danger/10",
                        !isGiven && !isCorrect && "border-admin-border"
                      )}
                    >
                      {opt.text}
                      {isCorrect ? (
                        <span className="ml-2 text-xs font-medium text-success">Correct</span>
                      ) : null}
                      {isGiven && !isCorrect ? (
                        <span className="ml-2 text-xs font-medium text-danger">Candidate&apos;s answer</span>
                      ) : null}
                      {isGiven && isCorrect ? (
                        <span className="ml-2 text-xs font-medium text-success">Candidate&apos;s answer</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              {given == null ? (
                <p className="mt-2 text-xs text-admin-text-muted">No answer submitted</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
