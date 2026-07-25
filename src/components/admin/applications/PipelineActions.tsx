"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  Application,
  ApplicationStatus,
  CompletePayload,
  HirePayload,
  InterviewPayload,
  OfferPayload,
  RejectPayload,
} from "@/types/application";

function toDateInput(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

interface PipelineActionsProps {
  application: Application;
  busy?: boolean;
  onAdvance: (toStatus: ApplicationStatus, sendEmail?: boolean) => void;
  onInterview: (payload: InterviewPayload) => void;
  onOffer: (payload: OfferPayload) => void;
  onHire: (payload: HirePayload) => void;
  onComplete: (payload: CompletePayload) => void;
  onReject: (payload: RejectPayload) => void;
}

export function PipelineActions({
  application,
  busy,
  onAdvance,
  onInterview,
  onOffer,
  onHire,
  onComplete,
  onReject,
}: PipelineActionsProps) {
  const status = application.status;
  const offerLocked = Boolean(application.pipeline?.offer?.letterUrl) ||
    ["offered", "hired", "completed"].includes(status);
  const preOffer =
    !offerLocked &&
    ["new", "under_review", "shortlisted", "interview", "rejected"].includes(
      status
    );

  const [panel, setPanel] = useState<
    null | "interview" | "offer" | "hire" | "complete" | "reject"
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

  if (status === "archived" || status === "completed") {
    return (
      <p className="text-sm text-admin-text-muted">
        No further pipeline actions for this stage.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {preOffer && status !== "under_review" ? (
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => onAdvance("under_review", false)}
          >
            Mark under review
          </Button>
        ) : null}
        {preOffer && status !== "shortlisted" ? (
          <Button
            size="sm"
            disabled={busy}
            onClick={() => onAdvance("shortlisted", true)}
          >
            Shortlist &amp; email
          </Button>
        ) : null}
        {preOffer ? (
          <Button size="sm" disabled={busy} onClick={() => setPanel("interview")}>
            Schedule interview
          </Button>
        ) : null}
        {preOffer ? (
          <Button size="sm" disabled={busy} onClick={() => setPanel("offer")}>
            Generate offer
          </Button>
        ) : null}
        {status === "offered" ? (
          <Button size="sm" disabled={busy} onClick={() => setPanel("hire")}>
            Mark hired
          </Button>
        ) : null}
        {status === "hired" ? (
          <Button size="sm" disabled={busy} onClick={() => setPanel("complete")}>
            Issue certificate
          </Button>
        ) : null}
        {status !== "rejected" && status !== "hired" && status !== "completed" ? (
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
                  setInterview((s) => ({ ...s, interviewNotes: e.target.value }))
                }
              />
            </div>
          </div>
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
                  sendEmail: true,
                })
              }
            >
              Send invite
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
                  sendEmail: true,
                })
              }
            >
              Generate PDF &amp; email
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
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={busy}
              onClick={() =>
                onHire({
                  joinedAt: hire.joinedAt || null,
                  mentorName: hire.mentorName || null,
                  notes: hire.notes || null,
                  sendEmail: true,
                })
              }
            >
              Mark hired &amp; welcome email
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
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={busy}
              onClick={() =>
                onComplete({
                  completedAt: complete.completedAt || null,
                  rating: complete.rating ? Number(complete.rating) : null,
                  feedback: complete.feedback || null,
                  sendEmail: true,
                })
              }
            >
              Generate certificate &amp; email
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
