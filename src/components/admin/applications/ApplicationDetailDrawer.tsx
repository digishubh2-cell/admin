"use client";

import { BadgeCheck, Download, ExternalLink } from "lucide-react";
import type { Application, ApplicationStatus } from "@/types/application";
import { APPLICATION_STATUSES } from "@/types/application";
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

interface Props {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  onStatusChange: (status: ApplicationStatus) => void;
  onSaveNotes: () => void;
  saving?: boolean;
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

export function ApplicationDetailDrawer({
  application,
  open,
  onOpenChange,
  notes,
  onNotesChange,
  onStatusChange,
  onSaveNotes,
  saving,
}: Props) {
  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
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

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={application.status} />
            <Badge variant="outline" className="capitalize">
              {application.jobType || "job"}
            </Badge>
          </div>

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
            <div>
              <p className="text-xs text-admin-text-muted">Cover letter</p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
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

          <div className="space-y-2">
            <Label>Update status</Label>
            <select
              className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm capitalize"
              value={application.status}
              onChange={(e) => onStatusChange(e.target.value as ApplicationStatus)}
            >
              {APPLICATION_STATUSES.map((status) => (
                <option key={status} value={status} className="capitalize">
                  {status.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

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
        </div>
      </DialogContent>
    </Dialog>
  );
}
