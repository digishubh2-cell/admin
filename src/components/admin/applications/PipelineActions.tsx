"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAssessmentMutations, useTemplates } from "@/hooks/use-assessments";
import type { AssessmentAttempt } from "@/types/assessment";
import type {
  Application,
  ApplicationStatus,
  CompletePayload,
  HirePayload,
  InterviewPayload,
  OfferPayload,
  RejectPayload,
} from "@/types/application";
import {
  STAGE_COPY,
  getPipelinePrimaryAction,
} from "./pipeline-guidance";

function getErrorMessage(err: unknown) {
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as { response?: { data?: { message?: string } } })
      .response;
    if (response?.data?.message) return response.data.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

function toDateInput(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

interface PipelineActionsProps {
  application: Application;
  attempt?: AssessmentAttempt | null;
  busy?: boolean;
  onAdvance: (
    toStatus: ApplicationStatus,
    sendEmail?: boolean,
    notes?: string | null
  ) => void;
  onInterview: (payload: InterviewPayload) => void;
  onOffer: (payload: OfferPayload) => void;
  onHire: (payload: HirePayload) => void;
  onComplete: (payload: CompletePayload) => void;
  onReject: (payload: RejectPayload) => void;
  /** Deep-link to the Offer Letter tab instead of the inline offer panel */
  onOpenOfferTab?: () => void;
}

export function PipelineActions({
  application,
  attempt,
  busy,
  onAdvance,
  onInterview,
  onOffer,
  onHire,
  onComplete,
  onReject,
  onOpenOfferTab,
}: PipelineActionsProps) {
  const status = application.status;
  const stage = STAGE_COPY[status];
  const primary = getPipelinePrimaryAction(application, attempt);
  const offerLocked =
    Boolean(application.pipeline?.offer?.letterUrl) ||
    ["offered", "hired", "completed"].includes(status);
  const preOffer =
    !offerLocked &&
    [
      "new",
      "under_review",
      "shortlisted",
      "assessment_invited",
      "assessment_in_progress",
      "assessment_submitted",
      "qualified",
      "interview",
      "rejected",
    ].includes(status);

  const assessment = application.pipeline?.assessment;
  const hasActiveAttempt = Boolean(assessment?.attemptId);
  const canInviteToAssessment =
    !offerLocked &&
    ![
      "offered",
      "hired",
      "completed",
      "archived",
    ].includes(status);
  const isAwaitingCandidate = [
    "assessment_invited",
    "assessment_in_progress",
  ].includes(status);
  const isAwaitingDecision = status === "assessment_submitted";
  const bothPathAfterQualify =
    status === "qualified" && assessment?.path === "both";
  const assessmentGate = [
    "assessment_invited",
    "assessment_in_progress",
    "assessment_submitted",
  ].includes(status);
  const canMarkQualified =
    preOffer && !["qualified", "interview"].includes(status);

  const { data: templates } = useTemplates();
  const { invite, resend, retake } = useAssessmentMutations();
  const [templateId, setTemplateId] = useState("");
  const [path, setPath] = useState<"test" | "both">("test");
  const [assessmentKind, setAssessmentKind] = useState<"interactive" | "pdf">(
    "interactive"
  );
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [expiresInHours, setExpiresInHours] = useState("72");

  function toastEmailResult(successMessage: string, emailWarning?: string | null) {
    if (emailWarning) {
      toast.warning(`${successMessage}, but the email failed: ${emailWarning}`);
      return;
    }
    toast.success(successMessage);
  }

  async function handleInvite() {
    if (assessmentKind === "pdf") {
      if (!pdfFile) {
        toast.error("Choose a document to send");
        return;
      }
      if (pdfFile.size > 15 * 1024 * 1024) {
        toast.error("Document must be 15MB or smaller");
        return;
      }
    } else if (!templateId) {
      toast.error("Select a template first");
      return;
    }
    try {
      const result = await invite.mutateAsync({
        applicationId: application.id,
        payload:
          assessmentKind === "pdf"
            ? {
                kind: "pdf",
                file: pdfFile!,
                path,
                expiresInHours: Number(expiresInHours) || 72,
              }
            : {
                kind: "interactive",
                templateId,
                path,
                expiresInHours: Number(expiresInHours) || 72,
              },
      });
      toastEmailResult("Assessment invite sent", result.emailWarning);
      setPanel(null);
      setPdfFile(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleResendInvite() {
    try {
      const result = await resend.mutateAsync(application.id);
      toastEmailResult("New assessment link sent", result.emailWarning);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleRetake() {
    try {
      const result = await retake.mutateAsync(application.id);
      toastEmailResult("Retake invite sent with a new link", result.emailWarning);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  const [panel, setPanel] = useState<
    | null
    | "interview"
    | "offer"
    | "hire"
    | "complete"
    | "reject"
    | "assessment"
    | "qualify"
  >(null);

  const [interview, setInterview] = useState({
    interviewAt: "",
    interviewMode: "online" as "online" | "offline" | "phone",
    interviewLink: "",
    interviewNotes: "",
  });

  const [offer, setOffer] = useState({
    roleTitle: application.jobTitle || "",
    track: "internship" as "internship" | "trainee",
    department: application.jobDepartment || "",
    startDate: "",
    endDate: "",
    durationMonths: "3",
    stipend: "",
    workMode: "hybrid" as "remote" | "onsite" | "hybrid",
    location: "",
    mentorName: "",
    offerValidUntil: "",
  });

  const [hire, setHire] = useState({
    joinedAt: toDateInput(new Date().toISOString()),
    mentorName: application.pipeline?.offer?.mentorName || "",
    notes: "",
  });

  const [complete, setComplete] = useState({
    completedAt: toDateInput(
      application.pipeline?.offer?.endDate || new Date().toISOString()
    ),
    rating: "",
    feedback: "",
  });

  const [rejectReason, setRejectReason] = useState("");
  const [notifyReject, setNotifyReject] = useState(true);
  const [notifyAdvance, setNotifyAdvance] = useState(true);
  const [notifyInterview, setNotifyInterview] = useState(true);
  const [notifyOffer, setNotifyOffer] = useState(true);
  const [notifyHire, setNotifyHire] = useState(true);
  const [notifyComplete, setNotifyComplete] = useState(true);
  const [qualifyNote, setQualifyNote] = useState("");
  const [notifyQualify, setNotifyQualify] = useState(true);

  if (status === "archived" || status === "completed") {
    return (
      <div className="rounded-xl border border-admin-border bg-admin-muted/30 p-4">
        <p className="text-sm font-medium">{stage?.title || "Closed"}</p>
        <p className="mt-1 text-sm text-admin-text-muted">
          {stage?.blurb || "No further pipeline actions for this stage."}
        </p>
      </div>
    );
  }

  const earlyPreOffer =
    preOffer && ["new", "under_review", "shortlisted"].includes(status);

  const showMarkReview =
    earlyPreOffer &&
    status !== "under_review" &&
    primary?.advanceTo !== "under_review";
  const showShortlist =
    earlyPreOffer &&
    status !== "shortlisted" &&
    primary?.advanceTo !== "shortlisted";
  const showInvite =
    canInviteToAssessment && primary?.panel !== "assessment";
  const showQualify =
    canMarkQualified && primary?.panel !== "qualify";
  const attemptExpired = attempt?.status === "expired";
  const canRetake =
    Boolean(attempt) &&
    !offerLocked &&
    ["submitted", "expired", "void", "in_progress", "invited"].includes(
      attempt?.status || ""
    );
  const showResendSecondary =
    (isAwaitingCandidate || attemptExpired) &&
    !primary?.resendInvite;
  const showRetakeSecondary =
    canRetake &&
    ["assessment_submitted", "assessment_in_progress", "qualified", "rejected"].includes(
      status
    ) &&
    !primary?.resendInvite;
  const showViewAttemptSecondary = hasActiveAttempt && !assessmentGate;
  const showInterviewSecondary =
    preOffer && status !== "interview" && primary?.panel !== "interview";
  const showOfferSecondary = preOffer && primary?.panel !== "offer";
  const showHireSecondary = status === "offered" && primary?.panel !== "hire";
  const showCompleteSecondary =
    status === "hired" && primary?.panel !== "complete";
  const showRejectFallback =
    !primary && status !== "rejected" && status !== "hired";
  const hasSecondaryActions =
    showMarkReview ||
    showShortlist ||
    showQualify ||
    showInvite ||
    showResendSecondary ||
    showRetakeSecondary ||
    showViewAttemptSecondary ||
    showInterviewSecondary ||
    showOfferSecondary ||
    showHireSecondary ||
    showCompleteSecondary ||
    showRejectFallback;

  function openOfferComposer() {
    if (onOpenOfferTab) {
      onOpenOfferTab();
      return;
    }
    setPanel("offer");
  }

  function runPrimaryAction() {
    if (!primary) return;
    if (primary.panel === "offer") {
      openOfferComposer();
      return;
    }
    if (primary.panel) {
      setPanel(primary.panel);
      return;
    }
    if (primary.advanceTo) {
      onAdvance(primary.advanceTo, notifyAdvance);
      return;
    }
    if (primary.resendInvite) {
      void handleResendInvite();
    }
  }

  const score =
    attempt?.autoScore?.total && attempt.autoScore.total > 0
      ? attempt.autoScore
      : null;

  return (
    <div className="space-y-4">
      {primary ? (
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Recommended next step
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">
            {stage?.title || status.replace(/_/g, " ")}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-admin-text-secondary">
            {primary.description}
          </p>

          {isAwaitingDecision && score ? (
            <div className="mt-4 max-w-md space-y-2 rounded-lg border border-admin-border/80 bg-admin-surface/80 p-3">
              <div className="flex items-end justify-between gap-2">
                <div>
                  <p className="text-xs text-admin-text-muted">Auto score</p>
                  <p className="text-2xl font-semibold tabular-nums">
                    {score.percent}%
                  </p>
                </div>
                <p className="text-sm text-admin-text-muted">
                  {score.correct}/{score.total} correct
                </p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-admin-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${score.percent}%` }}
                />
              </div>
              <p className="text-xs text-admin-text-muted">
                Tech {score.breakdown.tech.correct}/{score.breakdown.tech.total}
                {" · "}
                Aptitude {score.breakdown.aptitude.correct}/
                {score.breakdown.aptitude.total}
              </p>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {primary.href ? (
              <Button asChild>
                <Link href={primary.href}>
                  <CheckCircle2 className="h-4 w-4" />
                  {primary.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button
                disabled={
                  busy ||
                  (primary.resendInvite &&
                    (resend.isPending || retake.isPending))
                }
                onClick={runPrimaryAction}
              >
                {primary.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            {status === "assessment_invited" && hasActiveAttempt ? (
              <Button variant="outline" asChild>
                <Link href={`/assessments/${assessment?.attemptId}`}>
                  View attempt
                </Link>
              </Button>
            ) : null}
            {status !== "rejected" ? (
              <Button
                variant="outline"
                disabled={busy}
                onClick={() => setPanel("reject")}
              >
                Reject
              </Button>
            ) : null}
          </div>
          {primary.advanceTo ? (
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={notifyAdvance}
                onChange={(e) => setNotifyAdvance(e.target.checked)}
              />
              Email candidate
            </label>
          ) : null}
        </div>
      ) : null}

      {bothPathAfterQualify && !primary ? (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
          <p className="font-medium">Qualified — Test + Interview path</p>
          <p className="mt-0.5 text-admin-text-muted">
            This candidate chose the combined path. Schedule the interview below
            to continue.
          </p>
        </div>
      ) : null}

      {hasSecondaryActions ? (
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-admin-text-muted">
          {assessmentGate ? "Other actions" : "All actions"}
        </p>
        <div className="flex flex-wrap gap-2">
          {showMarkReview ? (
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => onAdvance("under_review", notifyAdvance)}
            >
              Mark under review
            </Button>
          ) : null}
          {showShortlist ? (
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => onAdvance("shortlisted", notifyAdvance)}
            >
              Shortlist
            </Button>
          ) : null}
          {showQualify ? (
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => setPanel("qualify")}
            >
              Mark qualified
            </Button>
          ) : null}
          {showInvite ? (
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => setPanel("assessment")}
            >
              Send assessment
            </Button>
          ) : null}
          {showResendSecondary ? (
            <Button
              size="sm"
              variant="outline"
              disabled={busy || resend.isPending}
              onClick={handleResendInvite}
            >
              {attemptExpired ? "Resend assessment" : "Resend invite"}
            </Button>
          ) : null}
          {showRetakeSecondary ? (
            <Button
              size="sm"
              variant="outline"
              disabled={busy || retake.isPending}
              onClick={handleRetake}
            >
              Retake
            </Button>
          ) : null}
          {showViewAttemptSecondary ? (
            <Button size="sm" variant="outline" asChild>
              <Link href={`/assessments/${assessment?.attemptId}`}>
                View attempt
              </Link>
            </Button>
          ) : null}
          {showInterviewSecondary ? (
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => setPanel("interview")}
            >
              Schedule interview
            </Button>
          ) : null}
          {showOfferSecondary ? (
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={openOfferComposer}
            >
              Generate offer
            </Button>
          ) : null}
          {showHireSecondary ? (
            <Button size="sm" disabled={busy} onClick={() => setPanel("hire")}>
              Mark hired
            </Button>
          ) : null}
          {showCompleteSecondary ? (
            <Button
              size="sm"
              disabled={busy}
              onClick={() => setPanel("complete")}
            >
              Issue certificate
            </Button>
          ) : null}
          {showRejectFallback ? (
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => setPanel("reject")}
            >
              Reject
            </Button>
          ) : null}
        </div>
        {showMarkReview || showShortlist ? (
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={notifyAdvance}
              onChange={(e) => setNotifyAdvance(e.target.checked)}
            />
            Email candidate on advance
          </label>
        ) : null}
        {canMarkQualified || showInvite ? (
          <p className="mt-1 text-xs text-admin-text-muted">
            Platform assessment is optional. If they already completed a test on
            WhatsApp or offline, mark them qualified directly.
          </p>
        ) : null}
      </div>
      ) : assessmentGate && stage?.blurb ? (
        <p className="text-xs text-admin-text-muted">{stage.blurb}</p>
      ) : null}

      {panel === "assessment" ? (
        <div className="space-y-3 rounded-xl border border-admin-border bg-admin-muted/30 p-4">
          <p className="text-sm font-medium">Send assessment</p>
          <div>
            <Label>Assessment type</Label>
            <Select
              value={assessmentKind}
              onChange={(e) =>
                setAssessmentKind(e.target.value as "interactive" | "pdf")
              }
            >
              <option value="interactive">Online test (tech / aptitude)</option>
              <option value="pdf">Document file (PDF, Word, …)</option>
            </Select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {assessmentKind === "interactive" ? (
              <div>
                <Label>Template</Label>
                <Select
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                >
                  <option value="">Select a template…</option>
                  {(templates || []).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.durationMinutes}m, {t.questionIds.length}q)
                    </option>
                  ))}
                </Select>
              </div>
            ) : (
              <div>
                <Label>Document (PDF, Word, …)</Label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt,.rtf,.odt,.ods,.odp,.jpg,.jpeg,.png,.webp,.gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,text/csv,image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                />
                {pdfFile ? (
                  <p className="mt-1 text-xs text-admin-text-muted">
                    {pdfFile.name}
                  </p>
                ) : null}
              </div>
            )}
            <div>
              <Label>Path</Label>
              <Select
                value={path}
                onChange={(e) => setPath(e.target.value as "test" | "both")}
              >
                <option value="test">Test only</option>
                <option value="both">Both — test then interview</option>
              </Select>
            </div>
            <div>
              <Label>Link valid for</Label>
              <Select
                value={expiresInHours}
                onChange={(e) => setExpiresInHours(e.target.value)}
              >
                <option value="72">72 hours</option>
                <option value="168">7 days</option>
                <option value="336">14 days</option>
              </Select>
            </div>
          </div>
          <p className="text-xs text-admin-text-muted">
            {assessmentKind === "pdf"
              ? "The candidate receives an email with a secure link to open or download this file and mark it complete. PDFs preview in the browser; Word and similar files are download-only. Max 15MB. Export Google Docs as PDF or Word first."
              : "The candidate receives an email with a secure link. They'll capture a selfie before the timed test starts. No score is shown to them — you decide pass/fail once they submit."}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={
                busy ||
                invite.isPending ||
                (assessmentKind === "interactive" ? !templateId : !pdfFile)
              }
              onClick={handleInvite}
            >
              Send invite &amp; email
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPanel(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {panel === "qualify" ? (
        <div className="space-y-3 rounded-xl border border-admin-border bg-admin-muted/30 p-4">
          <p className="text-sm font-medium">Mark qualified</p>
          <p className="text-xs text-admin-text-muted">
            Use this when the candidate already passed an offline or WhatsApp
            assessment. No platform invite is created.
          </p>
          <div>
            <Label>Internal note (optional)</Label>
            <Textarea
              rows={2}
              value={qualifyNote}
              onChange={(e) => setQualifyNote(e.target.value)}
              placeholder="Assessed offline / WhatsApp"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={notifyQualify}
              onChange={(e) => setNotifyQualify(e.target.checked)}
            />
            Email candidate
          </label>
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={busy}
              onClick={() => {
                onAdvance(
                  "qualified",
                  notifyQualify,
                  qualifyNote.trim() || null
                );
                setPanel(null);
                setQualifyNote("");
              }}
            >
              Mark qualified
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPanel(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {panel === "interview" ? (
        <div className="space-y-3 rounded-xl border border-admin-border bg-admin-muted/30 p-4">
          <p className="text-sm font-medium">Schedule interview</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Date &amp; time</Label>
              <Input
                type="datetime-local"
                value={interview.interviewAt}
                onChange={(e) =>
                  setInterview((s) => ({ ...s, interviewAt: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Mode</Label>
              <select
                className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
                value={interview.interviewMode}
                onChange={(e) =>
                  setInterview((s) => ({
                    ...s,
                    interviewMode: e.target.value as typeof s.interviewMode,
                  }))
                }
              >
                <option value="online">Online</option>
                <option value="offline">In person</option>
                <option value="phone">Phone</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label>Meet / Zoom / location</Label>
              <Input
                value={interview.interviewLink}
                onChange={(e) =>
                  setInterview((s) => ({ ...s, interviewLink: e.target.value }))
                }
                placeholder="https://meet.google.com/..."
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Notes for candidate</Label>
              <Textarea
                rows={2}
                value={interview.interviewNotes}
                onChange={(e) =>
                  setInterview((s) => ({
                    ...s,
                    interviewNotes: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={notifyInterview}
              onChange={(e) => setNotifyInterview(e.target.checked)}
            />
            Email candidate
          </label>
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={busy || !interview.interviewAt}
              onClick={() =>
                onInterview({
                  interviewAt: new Date(interview.interviewAt).toISOString(),
                  interviewMode: interview.interviewMode,
                  interviewLink: interview.interviewLink || null,
                  interviewNotes: interview.interviewNotes || null,
                  sendEmail: notifyInterview,
                })
              }
            >
              {notifyInterview ? "Send invite" : "Schedule interview"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPanel(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {panel === "offer" ? (
        <div className="space-y-3 rounded-xl border border-admin-border bg-admin-muted/30 p-4">
          <p className="text-sm font-medium">Generate &amp; send offer letter</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Role title</Label>
              <Input
                value={offer.roleTitle}
                onChange={(e) =>
                  setOffer((s) => ({ ...s, roleTitle: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Track</Label>
              <select
                className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
                value={offer.track}
                onChange={(e) =>
                  setOffer((s) => ({
                    ...s,
                    track: e.target.value as typeof s.track,
                  }))
                }
              >
                <option value="internship">Internship</option>
                <option value="trainee">Trainee</option>
              </select>
            </div>
            <div>
              <Label>Department</Label>
              <Input
                value={offer.department}
                onChange={(e) =>
                  setOffer((s) => ({ ...s, department: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Duration (months)</Label>
              <Input
                type="number"
                min={1}
                max={24}
                value={offer.durationMonths}
                onChange={(e) =>
                  setOffer((s) => ({ ...s, durationMonths: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Start date</Label>
              <Input
                type="date"
                value={offer.startDate}
                onChange={(e) =>
                  setOffer((s) => ({ ...s, startDate: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>End date</Label>
              <Input
                type="date"
                value={offer.endDate}
                onChange={(e) =>
                  setOffer((s) => ({ ...s, endDate: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Stipend (₹ / month)</Label>
              <Input
                type="number"
                min={0}
                value={offer.stipend}
                onChange={(e) =>
                  setOffer((s) => ({ ...s, stipend: e.target.value }))
                }
                placeholder="0 = unpaid"
              />
            </div>
            <div>
              <Label>Work mode</Label>
              <select
                className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
                value={offer.workMode}
                onChange={(e) =>
                  setOffer((s) => ({
                    ...s,
                    workMode: e.target.value as typeof s.workMode,
                  }))
                }
              >
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
              </select>
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={offer.location}
                onChange={(e) =>
                  setOffer((s) => ({ ...s, location: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Mentor</Label>
              <Input
                value={offer.mentorName}
                onChange={(e) =>
                  setOffer((s) => ({ ...s, mentorName: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Offer valid until</Label>
              <Input
                type="date"
                value={offer.offerValidUntil}
                onChange={(e) =>
                  setOffer((s) => ({ ...s, offerValidUntil: e.target.value }))
                }
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={notifyOffer}
              onChange={(e) => setNotifyOffer(e.target.checked)}
            />
            Email candidate
          </label>
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={busy || !offer.startDate || !offer.endDate}
              onClick={() =>
                onOffer({
                  roleTitle: offer.roleTitle || undefined,
                  track: offer.track,
                  department: offer.department || null,
                  startDate: offer.startDate,
                  endDate: offer.endDate,
                  durationMonths: offer.durationMonths
                    ? Number(offer.durationMonths)
                    : null,
                  stipend: offer.stipend === "" ? null : Number(offer.stipend),
                  workMode: offer.workMode,
                  location: offer.location || null,
                  mentorName: offer.mentorName || null,
                  offerValidUntil: offer.offerValidUntil || null,
                  sendEmail: notifyOffer,
                })
              }
            >
              {notifyOffer ? "Generate PDF & email" : "Generate PDF"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPanel(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {panel === "hire" ? (
        <div className="space-y-3 rounded-xl border border-admin-border bg-admin-muted/30 p-4">
          <p className="text-sm font-medium">Confirm hire / onboarding</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Join date</Label>
              <Input
                type="date"
                value={hire.joinedAt}
                onChange={(e) =>
                  setHire((s) => ({ ...s, joinedAt: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Mentor</Label>
              <Input
                value={hire.mentorName}
                onChange={(e) =>
                  setHire((s) => ({ ...s, mentorName: e.target.value }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Notes</Label>
              <Textarea
                rows={2}
                value={hire.notes}
                onChange={(e) =>
                  setHire((s) => ({ ...s, notes: e.target.value }))
                }
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={notifyHire}
              onChange={(e) => setNotifyHire(e.target.checked)}
            />
            Email candidate
          </label>
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={busy}
              onClick={() =>
                onHire({
                  joinedAt: hire.joinedAt || null,
                  mentorName: hire.mentorName || null,
                  notes: hire.notes || null,
                  sendEmail: notifyHire,
                })
              }
            >
              {notifyHire ? "Mark hired & welcome email" : "Mark hired"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPanel(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {panel === "complete" ? (
        <div className="space-y-3 rounded-xl border border-admin-border bg-admin-muted/30 p-4">
          <p className="text-sm font-medium">Issue completion certificate</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Completion date</Label>
              <Input
                type="date"
                value={complete.completedAt}
                onChange={(e) =>
                  setComplete((s) => ({ ...s, completedAt: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Rating (1–5)</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={complete.rating}
                onChange={(e) =>
                  setComplete((s) => ({ ...s, rating: e.target.value }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Feedback</Label>
              <Textarea
                rows={2}
                value={complete.feedback}
                onChange={(e) =>
                  setComplete((s) => ({ ...s, feedback: e.target.value }))
                }
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={notifyComplete}
              onChange={(e) => setNotifyComplete(e.target.checked)}
            />
            Email candidate
          </label>
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={busy}
              onClick={() =>
                onComplete({
                  completedAt: complete.completedAt || null,
                  rating: complete.rating ? Number(complete.rating) : null,
                  feedback: complete.feedback || null,
                  sendEmail: notifyComplete,
                })
              }
            >
              {notifyComplete
                ? "Generate certificate & email"
                : "Generate certificate"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPanel(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {panel === "reject" ? (
        <div className="space-y-3 rounded-xl border border-admin-border bg-admin-muted/30 p-4">
          <p className="text-sm font-medium">Reject candidate</p>
          <div>
            <Label>Internal reason (optional)</Label>
            <Textarea
              rows={2}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={notifyReject}
              onChange={(e) => setNotifyReject(e.target.checked)}
            />
            Notify candidate by email
          </label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              disabled={busy}
              onClick={() =>
                onReject({
                  sendEmail: notifyReject,
                  reason: rejectReason || null,
                })
              }
            >
              Confirm reject
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPanel(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
