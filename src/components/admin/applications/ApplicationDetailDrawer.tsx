"use client";

import { useState } from "react";
import { BadgeCheck, Download, ExternalLink } from "lucide-react";
import type {
  Application,
  ApplicationStatus,
  CompletePayload,
  HirePayload,
  InterviewPayload,
  OfferPayload,
  RejectPayload,
} from "@/types/application";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PipelineStepper } from "./PipelineStepper";
import { PipelineActions } from "./PipelineActions";

interface Props {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  onSaveNotes: () => void;
  saving?: boolean;
  pipelineBusy?: boolean;
  onAdvance: (toStatus: ApplicationStatus, sendEmail?: boolean) => void;
  onInterview: (payload: InterviewPayload) => void;
  onOffer: (payload: OfferPayload) => void;
  onHire: (payload: HirePayload) => void;
  onComplete: (payload: CompletePayload) => void;
  onReject: (payload: RejectPayload) => void;
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

export function ApplicationDetailDrawer({
  application,
  open,
  onOpenChange,
  notes,
  onNotesChange,
  onSaveNotes,
  saving,
  pipelineBusy,
  onAdvance,
  onInterview,
  onOffer,
  onHire,
  onComplete,
  onReject,
}: Props) {
  const [tab, setTab] = useState("pipeline");

  if (!application) return null;

  const emailLog = application.pipeline?.emailLog || [];
  const offer = application.pipeline?.offer;
  const completion = application.pipeline?.completion;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            {application.candidateName}
            {application.emailVerified ? (
              <Badge variant="outline" className="gap-1 text-success">
                <BadgeCheck className="h-3 w-3" />
                Verified
              </Badge>
            ) : (
              <Badge variant="outline">Unverified</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={application.status} />
            <Badge variant="outline" className="capitalize">
              {application.jobType || "job"}
            </Badge>
          </div>

          <PipelineStepper status={application.status} />

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="emails">Emails</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="pipeline">
              <PipelineActions
                application={application}
                busy={pipelineBusy || saving}
                onAdvance={onAdvance}
                onInterview={onInterview}
                onOffer={onOffer}
                onHire={onHire}
                onComplete={onComplete}
                onReject={onReject}
              />
              {application.pipeline?.interviewAt ? (
                <div className="mt-4 grid gap-2 rounded-xl border border-admin-border p-3 text-sm sm:grid-cols-2">
                  <Row
                    label="Interview"
                    value={formatWhen(application.pipeline.interviewAt)}
                  />
                  <Row label="Mode" value={application.pipeline.interviewMode} />
                  <Row label="Link" value={application.pipeline.interviewLink} />
                  <Row label="Notes" value={application.pipeline.interviewNotes} />
                </div>
              ) : null}
            </TabsContent>

            <TabsContent value="profile">
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
              </div>

              {application.coverLetter ? (
                <div className="mt-4">
                  <p className="text-xs text-admin-text-muted">Cover letter</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
                    {application.coverLetter}
                  </p>
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
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
            </TabsContent>

            <TabsContent value="emails">
              {emailLog.length === 0 ? (
                <p className="text-sm text-admin-text-muted">
                  No emails sent yet for this candidate.
                </p>
              ) : (
                <ul className="space-y-2">
                  {[...emailLog].reverse().map((entry) => (
                    <li
                      key={entry.id}
                      className="rounded-xl border border-admin-border px-3 py-2 text-sm"
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
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="documents">
              <div className="space-y-3">
                {offer?.letterUrl ? (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={offer.letterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4" />
                      Offer letter PDF
                    </a>
                  </Button>
                ) : (
                  <p className="text-sm text-admin-text-muted">
                    No offer letter generated yet.
                  </p>
                )}
                {completion?.certificateUrl ? (
                  <div className="space-y-1">
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
                  <p className="text-sm text-admin-text-muted">
                    No certificate issued yet.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="notes">
              <div className="space-y-2">
                <Label>Internal notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => onNotesChange(e.target.value)}
                  rows={4}
                  placeholder="Add hiring notes..."
                />
                <Button type="button" onClick={onSaveNotes} disabled={saving}>
                  Save notes
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
