"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Download,
  ExternalLink,
  FileText,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import {
  useApplication,
  useApplicationMutations,
} from "@/hooks/use-applications";
import { useAttempt, useAssessmentMutations } from "@/hooks/use-assessments";
import type {
  Application,
  ApplicationOffer,
  ApplicationStatus,
  CompletePayload,
  HirePayload,
  InterviewPayload,
  OfferPayload,
  RejectPayload,
} from "@/types/application";
import { PIPELINE_STAGES } from "@/types/application";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PipelineStepper } from "./PipelineStepper";
import { PipelineActions } from "./PipelineActions";
import { OfferLetterTab } from "./OfferLetterTab";
import {
  STAGE_COPY,
  buildPipelineFacts,
  hasMeaningfulOffer,
} from "./pipeline-guidance";

const DETAIL_TABS = [
  "overview",
  "pipeline",
  "offer",
  "assessment",
  "activity",
  "emails",
  "documents",
  "notes",
] as const;

type DetailTab = (typeof DETAIL_TABS)[number];

function isDetailTab(value: string | null): value is DetailTab {
  return Boolean(value && DETAIL_TABS.includes(value as DetailTab));
}
function getErrorMessage(err: unknown) {
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as { response?: { data?: { message?: string } } })
      .response;
    if (response?.data?.message) return response.data.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

function formatWhen(value?: string | null) {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatDate(value?: string | null) {
  return formatWhen(value) || "—";
}

/** Pending / awaiting-docs past offer valid-until (end of day IST). */
function isOfferExpiredPending(offer?: ApplicationOffer | null) {
  if (!offer?.letterUrl) return false;
  const status = offer.response?.status || "pending";
  if (status !== "pending" && status !== "accepted_pending_docs") return false;
  const raw = offer.offerValidUntil || offer.responseTokenExpiresAt;
  if (!raw) return false;
  const m = String(raw).match(/^(\d{4})-(\d{2})-(\d{2})/);
  let end: Date;
  if (m) {
    end = new Date(`${m[1]}-${m[2]}-${m[3]}T23:59:59.999+05:30`);
  } else {
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return false;
    end = d;
  }
  return Date.now() > end.getTime();
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-admin-text-muted">{label}</p>
      <p className="mt-0.5 text-sm">{value}</p>
    </div>
  );
}

function ScoreBar({
  label,
  correct,
  total,
}: {
  label: string;
  correct: number;
  total: number;
}) {
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-admin-text-muted">{label}</span>
        <span className="font-medium">
          {correct}/{total} · {percent}%
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-admin-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

type ActivityEvent = {
  id: string;
  at: string;
  title: string;
  detail?: string | null;
  tone?: "default" | "success" | "warning" | "danger";
};

function buildActivity(application: Application): ActivityEvent[] {
  const events: ActivityEvent[] = [];

  events.push({
    id: "created",
    at: application.createdAt,
    title: "Application received",
    detail: application.jobTitle
      ? `Applied for ${application.jobTitle}`
      : null,
  });

  if (application.emailVerifiedAt) {
    events.push({
      id: "verified",
      at: application.emailVerifiedAt,
      title: "Email verified",
      tone: "success",
    });
  }

  if (application.reviewedAt) {
    events.push({
      id: "reviewed",
      at: application.reviewedAt,
      title: "Marked under review",
    });
  }

  if (application.shortlistedAt) {
    events.push({
      id: "shortlisted",
      at: application.shortlistedAt,
      title: "Shortlisted",
      tone: "success",
    });
  }

  if (application.pipeline?.assessment?.invitedAt) {
    events.push({
      id: "assessment-invited",
      at: application.pipeline.assessment.invitedAt,
      title: "Assessment invited",
      detail:
        application.pipeline.assessment.path === "both"
          ? "Path: test + interview"
          : "Path: test only",
    });
  }

  if (application.interviewedAt) {
    events.push({
      id: "interviewed",
      at: application.interviewedAt,
      title: "Interview scheduled / recorded",
      detail: application.pipeline?.interviewMode
        ? `Mode: ${application.pipeline.interviewMode}`
        : null,
    });
  }

  if (application.offeredAt) {
    events.push({
      id: "offered",
      at: application.offeredAt,
      title: "Offer sent",
      tone: "success",
      detail: application.pipeline?.offer?.roleTitle || null,
    });
  }

  if (application.hiredAt) {
    events.push({
      id: "hired",
      at: application.hiredAt,
      title: "Marked hired",
      tone: "success",
    });
  }

  if (application.completedAt) {
    events.push({
      id: "completed",
      at: application.completedAt,
      title: "Internship completed",
      tone: "success",
      detail: application.pipeline?.completion?.certificateId
        ? `Certificate ${application.pipeline.completion.certificateId}`
        : null,
    });
  }

  if (application.rejectedAt) {
    events.push({
      id: "rejected",
      at: application.rejectedAt,
      title: "Rejected",
      tone: "danger",
    });
  }

  for (const entry of application.pipeline?.emailLog || []) {
    events.push({
      id: `email-${entry.id}`,
      at: entry.sentAt,
      title: `Email: ${entry.subject}`,
      detail: `${entry.type.replace(/_/g, " ")} · ${entry.to}`,
      tone: entry.status === "failed" ? "danger" : "default",
    });
  }

  return events.sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  );
}

function PipelineProgress({ status }: { status: ApplicationStatus }) {
  const isTerminal = status === "rejected" || status === "archived";
  const currentIndex = PIPELINE_STAGES.indexOf(
    status as (typeof PIPELINE_STAGES)[number]
  );
  const progress =
    isTerminal || currentIndex < 0
      ? 0
      : Math.round((currentIndex / (PIPELINE_STAGES.length - 1)) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-admin-text-muted">
        <span>Pipeline progress</span>
        <span className="font-medium text-admin-text">
          {isTerminal
            ? status.replace(/_/g, " ")
            : `${Math.max(currentIndex + 1, 0)} / ${PIPELINE_STAGES.length}`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-admin-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isTerminal ? "bg-danger" : "bg-primary"
          )}
          style={{ width: isTerminal ? "100%" : `${progress}%` }}
        />
      </div>
      <PipelineStepper status={status} />
    </div>
  );
}

export function ApplicationDetailPage({
  applicationId,
}: {
  applicationId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: application, isLoading, isError, error, refetch } =
    useApplication(applicationId);
  const mutations = useApplicationMutations();
  const { resend, retake } = useAssessmentMutations();
  const [tab, setTab] = useState<DetailTab>("overview");
  const [tabSeeded, setTabSeeded] = useState(false);
  const [notes, setNotes] = useState("");
  const [candidateMessage, setCandidateMessage] = useState("");
  const [sendMessageEmail, setSendMessageEmail] = useState(true);

  const attemptId = application?.pipeline?.assessment?.attemptId || null;
  const { data: attempt, isLoading: attemptLoading } = useAttempt(attemptId);

  useEffect(() => {
    if (application) setNotes(application.notes || "");
  }, [application]);

  useEffect(() => {
    const fromUrl = searchParams.get("tab");
    if (isDetailTab(fromUrl)) {
      setTab(fromUrl);
      setTabSeeded(true);
      return;
    }
    if (!application || tabSeeded) return;
    if (application.status === "offered") {
      setTab("offer");
    } else if (application.status === "qualified") {
      const path = application.pipeline?.assessment?.path;
      setTab(path === "both" ? "pipeline" : "offer");
    } else if (
      [
        "assessment_submitted",
        "assessment_invited",
        "assessment_in_progress",
        "interview",
        "hired",
      ].includes(application.status)
    ) {
      setTab("pipeline");
    }
    setTabSeeded(true);
  }, [application, tabSeeded, searchParams]);

  function handleTabChange(next: string) {
    if (!isDetailTab(next)) return;
    setTab(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next === "overview") {
      params.delete("tab");
    } else {
      params.set("tab", next);
    }
    const qs = params.toString();
    router.replace(
      qs
        ? `/applications/${applicationId}?${qs}`
        : `/applications/${applicationId}`,
      { scroll: false }
    );
  }
  const activity = useMemo(
    () => (application ? buildActivity(application) : []),
    [application]
  );

  const pipelineBusy =
    mutations.advance.isPending ||
    mutations.interview.isPending ||
    mutations.offer.isPending ||
    mutations.hire.isPending ||
    mutations.complete.isPending ||
    mutations.reject.isPending;

  async function handleSaveNotes() {
    if (!application) return;
    try {
      await mutations.update.mutateAsync({
        id: application.id,
        payload: { notes },
      });
      toast.success("Internal notes saved — not emailed");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleSendCandidateMessage() {
    if (!application) return;
    const message = candidateMessage.trim();
    if (!message) {
      toast.error("Write a message first");
      return;
    }
    if (!sendMessageEmail) {
      toast.error("Turn on “Send to candidate” to email this message");
      return;
    }
    try {
      const result = await mutations.sendMessage.mutateAsync({
        id: application.id,
        payload: { message, sendEmail: true },
      });
      if (result.emailWarning) {
        toast.warning(
          `Message recorded, but the email failed: ${result.emailWarning}`
        );
      } else {
        toast.success("Message emailed to the candidate");
        setCandidateMessage("");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  function toastPipelineResult(
    successMessage: string,
    skippedEmailMessage: string,
    sendEmail: boolean | undefined,
    emailWarning?: string | null
  ) {
    if (emailWarning) {
      toast.warning(`${successMessage}, but the email failed: ${emailWarning}`);
      return;
    }
    toast.success(sendEmail === false ? skippedEmailMessage : successMessage);
  }

  async function handleAdvance(
    toStatus: ApplicationStatus,
    sendEmail = true,
    notes?: string | null
  ) {
    if (!application) return;
    try {
      const result = await mutations.advance.mutateAsync({
        id: application.id,
        toStatus,
        sendEmail,
        notes,
      });
      toastPipelineResult(
        `Moved to ${toStatus.replace(/_/g, " ")}`,
        `Moved to ${toStatus.replace(/_/g, " ")}`,
        sendEmail,
        result.emailWarning
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleInterview(payload: InterviewPayload) {
    if (!application) return;
    try {
      const result = await mutations.interview.mutateAsync({
        id: application.id,
        payload,
      });
      toastPipelineResult(
        "Interview invite sent",
        "Interview scheduled",
        payload.sendEmail,
        result.emailWarning
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleOffer(payload: OfferPayload) {
    if (!application) return;
    try {
      toast.message("Generating offer PDF…");
      const result = await mutations.offer.mutateAsync({
        id: application.id,
        payload,
      });
      toastPipelineResult(
        "Offer letter sent",
        "Offer letter generated",
        payload.sendEmail,
        result.emailWarning
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleHire(payload: HirePayload) {
    if (!application) return;
    try {
      const result = await mutations.hire.mutateAsync({
        id: application.id,
        payload,
      });
      toastPipelineResult(
        "Marked hired — welcome email sent",
        "Marked hired",
        payload.sendEmail,
        result.emailWarning
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleComplete(payload: CompletePayload) {
    if (!application) return;
    try {
      toast.message("Generating certificate…");
      const result = await mutations.complete.mutateAsync({
        id: application.id,
        payload,
      });
      toastPipelineResult(
        "Certificate issued and emailed",
        "Certificate issued",
        payload.sendEmail,
        result.emailWarning
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleReject(payload: RejectPayload) {
    if (!application) return;
    try {
      const result = await mutations.reject.mutateAsync({
        id: application.id,
        payload,
      });
      if (result.emailWarning) {
        toast.warning(
          `Candidate rejected, but the email failed: ${result.emailWarning}`
        );
      } else {
        toast.success(
          payload.sendEmail === false
            ? "Candidate rejected"
            : "Candidate rejected — email sent"
        );
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleArchive() {
    if (!application) return;
    if (!confirm("Archive this application?")) return;
    try {
      await mutations.remove.mutateAsync(application.id);
      toast.success("Application archived");
      router.push("/applications");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleResendInvite() {
    if (!application) return;
    try {
      const result = await resend.mutateAsync(application.id);
      if (result.emailWarning) {
        toast.warning(
          `New link created, but the email failed: ${result.emailWarning}`
        );
      } else {
        toast.success("New assessment link sent");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleRetake() {
    if (!application) return;
    try {
      const result = await retake.mutateAsync(application.id);
      if (result.emailWarning) {
        toast.warning(
          `Retake created, but the email failed: ${result.emailWarning}`
        );
      } else {
        toast.success("Retake invite sent with a new link");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/applications">
            <ArrowLeft className="h-4 w-4" />
            Back to applications
          </Link>
        </Button>
        <div className="rounded-2xl border border-dashed border-admin-border px-6 py-16 text-center">
          <p className="text-lg font-medium">Application not found</p>
          <p className="mt-1 text-sm text-admin-text-muted">
            {getErrorMessage(error) ||
              "This candidate may have been removed or the link is invalid."}
          </p>
          <Button className="mt-4" variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const emailLog = application.pipeline?.emailLog || [];
  const offer = application.pipeline?.offer;
  const hire = application.pipeline?.hire;
  const completion = application.pipeline?.completion;
  const assessmentMeta = application.pipeline?.assessment;

  return (
    <div className="space-y-6">
      <div className="sticky top-14 z-20 -mx-1 space-y-4 border-b border-admin-border/80 bg-admin-bg/95 px-1 pb-4 pt-1 backdrop-blur supports-[backdrop-filter]:bg-admin-bg/80">
        <div className="flex flex-wrap items-start gap-3">
          <Button variant="ghost" size="icon" asChild className="mt-0.5 shrink-0">
            <Link href="/applications" aria-label="Back to applications">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
                {application.candidateName}
              </h1>
              {application.emailVerified ? (
                <Badge variant="outline" className="gap-1 text-success">
                  <BadgeCheck className="h-3 w-3" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline">Unverified</Badge>
              )}
              <StatusBadge status={application.status} />
              {offer?.response?.status && offer.response.status !== "pending" ? (
                <Badge
                  variant={
                    offer.response.status === "accepted"
                      ? "success"
                      : offer.response.status === "accepted_pending_docs"
                        ? "warning"
                        : offer.response.status === "rejected"
                          ? "danger"
                          : "outline"
                  }
                >
                  {offer.response.status === "accepted_pending_docs"
                    ? "Accepted – awaiting docs"
                    : offer.response.status === "accepted"
                      ? "Offer accepted"
                      : offer.response.status === "rejected"
                        ? "Offer rejected"
                        : String(offer.response.status).replace(/_/g, " ")}
                </Badge>
              ) : offer?.letterUrl ? (
                <Badge variant="outline">Offer pending response</Badge>
              ) : null}
              {isOfferExpiredPending(offer) ? (
                <Badge variant="danger">Expired</Badge>
              ) : null}
              <Badge variant="outline" className="capitalize">
                {application.jobType || "job"}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-admin-text-secondary">
              {application.jobTitle || "Untitled role"}
              {application.jobDepartment
                ? ` · ${application.jobDepartment}`
                : ""}
              {" · "}
              {application.email}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {application.resume?.url ? (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={application.resume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4" />
                  Resume
                </a>
              </Button>
            ) : null}
            {attemptId ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/assessments/${attemptId}`}>
                  <FileText className="h-4 w-4" />
                  Attempt
                </Link>
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              onClick={handleArchive}
              disabled={mutations.remove.isPending}
            >
              Archive
            </Button>
          </div>
        </div>

        <PipelineProgress status={application.status} />
      </div>

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger
            value="offer"
            className={cn(
              ["qualified", "offered"].includes(application.status) &&
                "text-primary"
            )}
          >
            Offer Letter
          </TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <section className="space-y-5 rounded-2xl border border-admin-border bg-admin-surface p-5">
              <h2 className="text-base font-semibold">Profile</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Row label="Email" value={application.email} />
                <Row label="Phone" value={application.phone} />
                <Row label="Role" value={application.jobTitle} />
                <Row label="Department" value={application.jobDepartment} />
                <Row label="City" value={application.currentCity} />
                <Row
                  label="Experience"
                  value={
                    application.experienceYears != null
                      ? `${application.experienceYears} years`
                      : null
                  }
                />
                <Row label="Education" value={application.education} />
                <Row label="Received" value={formatDate(application.createdAt)} />
              </div>

              {application.coverLetter ? (
                <div>
                  <p className="text-xs text-admin-text-muted">Cover letter</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-admin-text-secondary">
                    {application.coverLetter}
                  </p>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                {application.resume?.url ? (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={application.resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4" />
                      Download resume
                    </a>
                  </Button>
                ) : null}
                {application.linkedinUrl ? (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={application.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                ) : null}
                {application.portfolioUrl ? (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={application.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Portfolio
                    </a>
                  </Button>
                ) : null}
              </div>
            </section>

            <aside className="space-y-5">
              <section className="rounded-2xl border border-admin-border bg-admin-surface p-5">
                <h2 className="text-base font-semibold">Source</h2>
                <div className="mt-4 grid gap-3">
                  <Row label="Page" value={application.source?.pageTitle || application.source?.page} />
                  <Row label="Section" value={application.source?.section} />
                  <Row label="CTA" value={application.source?.ctaLabel} />
                  <Row label="Referrer" value={application.source?.referrer} />
                </div>
              </section>

              {(application.pipeline?.interviewAt ||
                hasMeaningfulOffer(offer) ||
                hire?.joinedAt ||
                completion?.completedAt) && (
                <section className="rounded-2xl border border-admin-border bg-admin-surface p-5">
                  <h2 className="text-base font-semibold">Pipeline summary</h2>
                  <div className="mt-4 grid gap-3">
                    <Row
                      label="Interview"
                      value={formatWhen(application.pipeline?.interviewAt)}
                    />
                    <Row
                      label="Offer role"
                      value={offer?.roleTitle || null}
                    />
                    <Row
                      label="Joined"
                      value={formatWhen(hire?.joinedAt)}
                    />
                    <Row
                      label="Completed"
                      value={formatWhen(completion?.completedAt)}
                    />
                  </div>
                </section>
              )}
            </aside>
          </div>
        </TabsContent>

        <TabsContent value="pipeline">
          <div className="space-y-5">
            <div className="rounded-2xl border border-admin-border bg-admin-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">Pipeline</h2>
                  <p className="mt-1 text-sm text-admin-text-muted">
                    {STAGE_COPY[application.status]?.blurb ||
                      "Advance this candidate through the hiring flow."}
                  </p>
                </div>
                <StatusBadge status={application.status} />
              </div>

              <div className="mt-5">
                <PipelineActions
                  application={application}
                  attempt={attempt}
                  busy={pipelineBusy || mutations.update.isPending}
                  onAdvance={handleAdvance}
                  onInterview={handleInterview}
                  onOffer={handleOffer}
                  onHire={handleHire}
                  onComplete={handleComplete}
                  onReject={handleReject}
                  onOpenOfferTab={() => handleTabChange("offer")}
                />
              </div>
            </div>

            {["qualified", "interview", "offered"].includes(
              application.status
            ) ? (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Offer Letter studio</p>
                    <p className="mt-0.5 text-sm text-admin-text-muted">
                      Edit letter copy, conditions, and preview before generating
                      the PDF.
                    </p>
                  </div>
                  <Button size="sm" onClick={() => handleTabChange("offer")}>
                    <FileText className="h-4 w-4" />
                    Open Offer Letter
                  </Button>
                </div>
              </div>
            ) : null}

            <div className="rounded-2xl border border-admin-border bg-admin-surface p-5">
              <h2 className="text-base font-semibold">At a glance</h2>
              <p className="mt-1 text-sm text-admin-text-muted">
                Key facts for this candidate — only fields with real data.
              </p>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {buildPipelineFacts(application, attempt).map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-xl border border-admin-border/80 bg-admin-muted/20 px-3 py-2.5"
                  >
                    <dt className="text-xs text-admin-text-muted">{fact.label}</dt>
                    <dd className="mt-0.5 text-sm font-medium">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {application.pipeline?.interviewAt ? (
              <div className="rounded-2xl border border-admin-border bg-admin-surface p-5">
                <h2 className="text-base font-semibold">Interview details</h2>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <Row
                    label="When"
                    value={formatWhen(application.pipeline.interviewAt)}
                  />
                  <Row label="Mode" value={application.pipeline.interviewMode} />
                  <Row label="Link" value={application.pipeline.interviewLink} />
                  <Row label="Notes" value={application.pipeline.interviewNotes} />
                </div>
              </div>
            ) : null}

            {hasMeaningfulOffer(offer) ? (
              <div className="rounded-2xl border border-admin-border bg-admin-surface p-5">
                <h2 className="text-base font-semibold">Offer details</h2>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <Row label="Offer role" value={offer?.roleTitle} />
                  <Row label="Track" value={offer?.track} />
                  <Row label="Department" value={offer?.department} />
                  <Row
                    label="Dates"
                    value={
                      offer?.startDate && offer?.endDate
                        ? `${offer.startDate} → ${offer.endDate}`
                        : null
                    }
                  />
                  <Row
                    label="Stipend"
                    value={
                      offer?.stipend != null ? `₹${offer.stipend}/mo` : null
                    }
                  />
                  <Row label="Work mode" value={offer?.workMode} />
                  <Row label="Location" value={offer?.location} />
                  <Row label="Mentor" value={offer?.mentorName} />
                  <Row label="Sent" value={formatWhen(offer?.sentAt)} />
                </div>
              </div>
            ) : null}

            {hire?.joinedAt || hire?.mentorName || hire?.notes ? (
              <div className="rounded-2xl border border-admin-border bg-admin-surface p-5">
                <h2 className="text-base font-semibold">Hire details</h2>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <Row label="Joined" value={formatWhen(hire?.joinedAt)} />
                  <Row label="Mentor" value={hire?.mentorName} />
                  <Row label="Hire notes" value={hire?.notes} />
                </div>
              </div>
            ) : null}

            {completion?.completedAt ||
            completion?.certificateId ||
            completion?.feedback ||
            completion?.rating != null ? (
              <div className="rounded-2xl border border-admin-border bg-admin-surface p-5">
                <h2 className="text-base font-semibold">Completion details</h2>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <Row
                    label="Completed"
                    value={formatWhen(completion?.completedAt)}
                  />
                  <Row
                    label="Rating"
                    value={
                      completion?.rating != null
                        ? `${completion.rating} / 5`
                        : null
                    }
                  />
                  <Row label="Certificate ID" value={completion?.certificateId} />
                  <Row label="Feedback" value={completion?.feedback} />
                </div>
              </div>
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="offer">
          <OfferLetterTab
            application={application}
            busy={mutations.offer.isPending}
            onGenerate={handleOffer}
          />
        </TabsContent>

        <TabsContent value="assessment">
          <div className="space-y-5 rounded-2xl border border-admin-border bg-admin-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Assessment</h2>
                <p className="mt-1 text-sm text-admin-text-muted">
                  Invite status, score breakdown, and identity check.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {assessmentMeta?.attemptId ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/assessments/${assessmentMeta.attemptId}`}>
                      Open full attempt
                    </Link>
                  </Button>
                ) : null}
                {application.status === "assessment_invited" ||
                attempt?.status === "expired" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={resend.isPending}
                    onClick={handleResendInvite}
                  >
                    {attempt?.status === "expired"
                      ? "Resend assessment"
                      : "Resend invite"}
                  </Button>
                ) : null}
                {attempt &&
                ["submitted", "expired", "in_progress", "void"].includes(
                  attempt.status
                ) &&
                !["offered", "hired", "completed", "archived"].includes(
                  application.status
                ) ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={retake.isPending}
                    onClick={handleRetake}
                  >
                    Retake
                  </Button>
                ) : null}
              </div>
            </div>

            {!assessmentMeta?.attemptId ? (
              <p className="text-sm text-admin-text-muted">
                No assessment has been invited yet. Use the Pipeline tab to send
                one.
              </p>
            ) : attemptLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
              </div>
            ) : attempt ? (
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
                <div className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Row
                      label="Type"
                      value={
                        attempt.kind === "pdf"
                          ? "Document file"
                          : "Online test"
                      }
                    />
                    <Row
                      label={attempt.kind === "pdf" ? "Document" : "Template"}
                      value={attempt.templateName}
                    />
                    {attempt.kind === "pdf" && attempt.pdf?.url ? (
                      <div>
                        <p className="text-xs text-admin-text-muted">Document</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-1"
                          asChild
                        >
                          <a
                            href={attempt.pdf.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4" />
                            {attempt.pdf.originalName || attempt.pdf.name || "Open document"}
                          </a>
                        </Button>
                      </div>
                    ) : null}
                    <Row
                      label="Path"
                      value={
                        attempt.path === "both"
                          ? "Test + Interview"
                          : "Test only"
                      }
                    />
                    {attempt.kind === "pdf" ? null : (
                      <Row label="Duration" value={`${attempt.durationMinutes} min`} />
                    )}
                    <div>
                      <p className="text-xs text-admin-text-muted">Status</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <StatusBadge status={attempt.status} />
                        <StatusBadge status={attempt.adminDecision} />
                      </div>
                    </div>
                    <Row label="Invited" value={formatDate(assessmentMeta.invitedAt)} />
                    <Row label="Submitted" value={formatDate(attempt.submittedAt)} />
                  </div>

                  {attempt.kind === "pdf" ? (
                    <div className="rounded-xl border border-admin-border p-4 text-sm text-admin-text-muted">
                      Document assessments have no auto score. Review the file
                      the candidate received, then mark pass or fail from the
                      attempt page.
                    </div>
                  ) : (
                  <div className="space-y-3 rounded-xl border border-admin-border p-4">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-admin-text-muted">Auto score</p>
                        <p className="mt-0.5 text-2xl font-semibold tracking-tight">
                          {attempt.autoScore.percent}%
                        </p>
                      </div>
                      <p className="text-sm text-admin-text-muted">
                        {attempt.autoScore.correct}/{attempt.autoScore.total}{" "}
                        correct
                      </p>
                    </div>
                    <ScoreBar
                      label="Overall"
                      correct={attempt.autoScore.correct}
                      total={attempt.autoScore.total}
                    />
                    <ScoreBar
                      label="Tech"
                      correct={attempt.autoScore.breakdown.tech.correct}
                      total={attempt.autoScore.breakdown.tech.total}
                    />
                    <ScoreBar
                      label="Aptitude"
                      correct={attempt.autoScore.breakdown.aptitude.correct}
                      total={attempt.autoScore.breakdown.aptitude.total}
                    />
                  </div>
                  )}
                </div>

                {attempt.kind === "pdf" ? null : (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-admin-border p-4">
                  <p className="text-xs text-admin-text-muted">Identity selfie</p>
                  {attempt.selfie?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={attempt.selfie.url}
                      alt={`${attempt.candidateName} selfie`}
                      className="h-44 w-44 rounded-xl border border-admin-border object-cover"
                    />
                  ) : (
                    <div className="flex h-44 w-44 items-center justify-center rounded-xl border border-dashed border-admin-border text-xs text-admin-text-muted">
                      No selfie captured
                    </div>
                  )}
                  {attempt.selfie?.capturedAt ? (
                    <p className="text-xs text-admin-text-muted">
                      Captured {formatDate(attempt.selfie.capturedAt)}
                    </p>
                  ) : null}
                </div>
                )}
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <p className="text-admin-text-muted">
                  Attempt record could not be loaded. Pointer on application:
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Row label="Attempt ID" value={assessmentMeta.attemptId} />
                  <Row label="Path" value={assessmentMeta.path} />
                  <Row
                    label="Invited"
                    value={formatDate(assessmentMeta.invitedAt)}
                  />
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/assessments/${assessmentMeta.attemptId}`}>
                    Open attempt page
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="rounded-2xl border border-admin-border bg-admin-surface p-5">
            <h2 className="text-base font-semibold">Activity</h2>
            <p className="mt-1 text-sm text-admin-text-muted">
              Timeline from status milestones and email log.
            </p>

            {activity.length === 0 ? (
              <p className="mt-6 text-sm text-admin-text-muted">
                No activity recorded yet.
              </p>
            ) : (
              <ol className="relative mt-6 space-y-0 border-l border-admin-border pl-6">
                {activity.map((event) => (
                  <li key={event.id} className="relative pb-6 last:pb-0">
                    <span
                      className={cn(
                        "absolute -left-[1.55rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-admin-surface",
                        event.tone === "success" && "bg-success",
                        event.tone === "danger" && "bg-danger",
                        event.tone === "warning" && "bg-warning",
                        (!event.tone || event.tone === "default") &&
                          "bg-primary"
                      )}
                    />
                    <p className="text-sm font-medium">{event.title}</p>
                    {event.detail ? (
                      <p className="mt-0.5 text-sm text-admin-text-secondary">
                        {event.detail}
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs text-admin-text-muted">
                      {formatDate(event.at)}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </TabsContent>

        <TabsContent value="emails">
          <div className="rounded-2xl border border-admin-border bg-admin-surface p-5">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-admin-text-muted" />
              <h2 className="text-base font-semibold">Emails</h2>
            </div>
            {emailLog.length === 0 ? (
              <p className="mt-4 text-sm text-admin-text-muted">
                No emails sent yet for this candidate.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {[...emailLog].reverse().map((entry) => (
                  <li
                    key={entry.id}
                    className="rounded-xl border border-admin-border px-3 py-2.5 text-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium">{entry.subject}</span>
                      <Badge
                        variant={
                          entry.status === "failed" ? "danger" : "outline"
                        }
                        className="capitalize"
                      >
                        {entry.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-admin-text-muted">
                      {entry.type.replace(/_/g, " ")} · {entry.to} ·{" "}
                      {formatWhen(entry.sentAt)}
                    </p>
                    {entry.error ? (
                      <p className="mt-1 text-xs text-danger">{entry.error}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="space-y-4 rounded-2xl border border-admin-border bg-admin-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Documents</h2>
                <p className="mt-1 text-sm text-admin-text-muted">
                  Company-generated files and candidate onboarding uploads.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {offer?.response?.status ? (
                  <Badge
                    variant={
                      offer.response.status === "accepted"
                        ? "success"
                        : offer.response.status === "accepted_pending_docs"
                          ? "warning"
                          : offer.response.status === "rejected"
                            ? "danger"
                            : "outline"
                    }
                  >
                    {offer.response.status === "pending"
                      ? "Pending"
                      : offer.response.status === "accepted_pending_docs"
                        ? "Accepted – awaiting docs"
                        : offer.response.status === "accepted"
                          ? "Accepted"
                          : offer.response.status === "rejected"
                            ? "Rejected"
                            : String(offer.response.status).replace(/_/g, " ")}
                  </Badge>
                ) : null}
                {isOfferExpiredPending(offer) ? (
                  <Badge variant="danger">Expired</Badge>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-admin-border p-4">
                <p className="text-sm font-medium">Resume</p>
                {application.resume?.url ? (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-admin-text-muted">
                      {application.resume.name || "Candidate resume"}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={application.resume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-admin-text-muted">
                    No resume on file.
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-admin-border p-4">
                <p className="text-sm font-medium">Company offer letter</p>
                {offer?.letterUrl ? (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-admin-text-muted">
                      Sent {formatDate(offer.sentAt)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={offer.letterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4" />
                          Offer PDF
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTabChange("offer")}
                      >
                        Edit / regenerate
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-admin-text-muted">
                      No offer letter generated yet.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTabChange("offer")}
                    >
                      Open Offer Letter tab
                    </Button>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:col-span-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">Signed offer letter</p>
                    <p className="mt-1 text-xs text-admin-text-muted">
                      Candidate-uploaded signed copy (separate from company PDF).
                    </p>
                  </div>
                </div>
                {(() => {
                  const signed = (offer?.candidateDocuments || []).find(
                    (d) => d.type === "signed_offer_letter"
                  );
                  return signed?.fileUrl ? (
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={signed.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4" />
                          View signed PDF
                        </a>
                      </Button>
                      <p className="text-xs text-admin-text-muted">
                        {signed.fileName || "Signed offer"}
                        {signed.uploadedAt
                          ? ` · ${formatDate(signed.uploadedAt)}`
                          : ""}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-admin-text-muted">
                      No signed offer letter uploaded yet.
                    </p>
                  );
                })()}
              </div>

              <div className="rounded-xl border border-admin-border p-4 sm:col-span-2">
                <p className="text-sm font-medium">Candidate onboarding documents</p>
                {(offer?.candidateDocuments || []).filter(
                  (d) => d.type !== "signed_offer_letter"
                ).length > 0 ? (
                  <ul className="mt-3 divide-y divide-admin-border">
                    {(offer?.candidateDocuments || [])
                      .filter((d) => d.type !== "signed_offer_letter")
                      .map((doc) => (
                        <li
                          key={doc.id}
                          className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium">
                              {doc.label || doc.type.replace(/_/g, " ")}
                            </p>
                            <p className="text-xs text-admin-text-muted">
                              {doc.fileName || "File"}
                              {doc.uploadedAt
                                ? ` · ${formatDate(doc.uploadedAt)}`
                                : ""}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4" />
                              View
                            </a>
                          </Button>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-admin-text-muted">
                    No candidate documents submitted yet.
                  </p>
                )}
                {offer?.response?.docsSubmittedAt ? (
                  <p className="mt-3 text-xs text-admin-text-muted">
                    Docs submitted {formatDate(offer.response.docsSubmittedAt)}
                  </p>
                ) : null}
                {offer?.response?.rejectReason ? (
                  <p className="mt-2 text-xs text-admin-text-muted">
                    Reject reason: {offer.response.rejectReason}
                  </p>
                ) : null}
              </div>

              <div className="rounded-xl border border-admin-border p-4 sm:col-span-2">
                <p className="text-sm font-medium">Certificate</p>
                {completion?.certificateUrl ? (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={completion.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4" />
                        Certificate PDF
                      </a>
                    </Button>
                    {completion.certificateId ? (
                      <p className="text-xs text-admin-text-muted">
                        ID: {completion.certificateId}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-admin-text-muted">
                    No certificate issued yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <div className="grid max-w-4xl gap-5 lg:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-admin-border bg-admin-surface p-5">
              <div>
                <h2 className="text-base font-semibold">Internal notes</h2>
                <p className="mt-1 text-sm text-admin-text-muted">
                  Visible only to the hiring team. Saving here does not email
                  the candidate.
                </p>
              </div>
              <Label htmlFor="application-notes">Notes</Label>
              <Textarea
                id="application-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={8}
                placeholder="Add hiring notes..."
              />
              <Button
                type="button"
                onClick={handleSaveNotes}
                disabled={mutations.update.isPending}
              >
                Save notes
              </Button>
            </div>

            <div className="space-y-3 rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <div>
                <h2 className="text-base font-semibold">Message to candidate</h2>
                <p className="mt-1 text-sm text-admin-text-muted">
                  This text is emailed to the candidate. Empty messages are not
                  sent.
                </p>
              </div>
              <Label htmlFor="candidate-message">Email message</Label>
              <Textarea
                id="candidate-message"
                value={candidateMessage}
                onChange={(e) => setCandidateMessage(e.target.value)}
                rows={8}
                placeholder="Write the note the candidate should receive..."
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={sendMessageEmail}
                  onChange={(e) => setSendMessageEmail(e.target.checked)}
                />
                Send to candidate by email
              </label>
              <Button
                type="button"
                onClick={handleSendCandidateMessage}
                disabled={
                  mutations.sendMessage.isPending || !candidateMessage.trim()
                }
              >
                Email message
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
