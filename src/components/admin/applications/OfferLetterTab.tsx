"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, ExternalLink, FileText, Plus, Trash2 } from "lucide-react";
import type { Application, ApplicationOffer, OfferPayload } from "@/types/application";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageKitUploadField } from "@/components/admin/media/ImageKitUploadField";
import { cn } from "@/lib/utils";
import {
  DEFAULT_OFFER_CONDITIONS,
  buildInitialOfferForm,
  buildOfferPreviewHtml,
  formToOfferPayload,
  type OfferFormState,
} from "./offer-letter-preview";

const SIGNATURE_MAX_BYTES = 2 * 1024 * 1024;
const SIGNATURE_ACCEPT = "image/jpeg,image/jpg,image/png,image/webp";

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

interface OfferLetterTabProps {
  application: Application;
  busy?: boolean;
  onGenerate: (payload: OfferPayload) => Promise<void> | void;
}

export function OfferLetterTab({
  application,
  busy = false,
  onGenerate,
}: OfferLetterTabProps) {
  const [form, setForm] = useState<OfferFormState>(() =>
    buildInitialOfferForm(application)
  );

  useEffect(() => {
    setForm(buildInitialOfferForm(application));
  }, [application.id, application.pipeline?.offer?.sentAt]);

  const previewHtml = useMemo(
    () => buildOfferPreviewHtml(application, form),
    [application, form]
  );

  const offer = application.pipeline?.offer;
  const alreadySent = Boolean(offer?.letterUrl);
  const canGenerate =
    Boolean(form.startDate && form.endDate) &&
    !busy &&
    !["hired", "completed", "archived"].includes(application.status);

  function patch<K extends keyof OfferFormState>(
    key: K,
    value: OfferFormState[K]
  ) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  const conditionLines = form.conditionsText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  function updateCondition(index: number, value: string) {
    const lines = [...conditionLines];
    lines[index] = value;
    patch("conditionsText", lines.join("\n"));
  }

  function removeCondition(index: number) {
    const lines = conditionLines.filter((_, i) => i !== index);
    patch("conditionsText", lines.join("\n"));
  }

  function addCondition() {
    patch(
      "conditionsText",
      [...conditionLines, "New condition — edit this text"].join("\n")
    );
  }

  function resetConditions() {
    patch("conditionsText", DEFAULT_OFFER_CONDITIONS.join("\n"));
  }

  async function handleSubmit() {
    if (!canGenerate) return;
    await onGenerate(formToOfferPayload(form));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-admin-border bg-admin-surface p-5">
        <div className="min-w-0">
          <h2 className="text-base font-semibold">Offer letter</h2>
          <p className="mt-1 text-sm text-admin-text-muted">
            Edit terms and letter copy, preview the PDF layout live, then
            generate and email the formal offer.
          </p>
          {alreadySent ? (
            <p className="mt-2 text-xs text-warning">
              An offer was already sent
              {offer?.sentAt ? ` on ${formatWhen(offer.sentAt)}` : ""}.
              Generating again will create a new PDF and email (status stays
              offered).
            </p>
          ) : null}
          {offer?.response?.status ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
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
                  ? "Candidate response: Pending"
                  : offer.response.status === "accepted_pending_docs"
                    ? "Accepted – awaiting docs"
                    : offer.response.status === "accepted"
                      ? "Accepted + docs submitted"
                      : offer.response.status === "rejected"
                        ? "Candidate rejected offer"
                        : String(offer.response.status).replace(/_/g, " ")}
              </Badge>
              {isOfferExpiredPending(offer) ? (
                <Badge variant="danger">Expired</Badge>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {offer?.letterUrl ? (
            <Button variant="outline" size="sm" asChild>
              <a
                href={offer.letterUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4" />
                Current PDF
              </a>
            </Button>
          ) : null}
          <Button
            size="sm"
            disabled={!canGenerate}
            onClick={handleSubmit}
          >
            <FileText className="h-4 w-4" />
            {busy ? "Generating…" : "Generate & send PDF"}
          </Button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <section className="space-y-5 rounded-2xl border border-admin-border bg-admin-surface p-5">
          <div>
            <h3 className="text-sm font-semibold">Engagement details</h3>
            <p className="mt-0.5 text-xs text-admin-text-muted">
              Shown in the terms table on the letter.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="offer-role">Role title</Label>
              <Input
                id="offer-role"
                value={form.roleTitle}
                onChange={(e) => patch("roleTitle", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="offer-track">Track</Label>
              <select
                id="offer-track"
                className="flex h-10 w-full rounded-xl border border-admin-border bg-admin-surface px-3 text-sm"
                value={form.track}
                onChange={(e) =>
                  patch(
                    "track",
                    e.target.value as OfferFormState["track"]
                  )
                }
              >
                <option value="internship">Internship</option>
                <option value="trainee">Trainee</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="offer-dept">Department</Label>
              <Input
                id="offer-dept"
                value={form.department}
                onChange={(e) => patch("department", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="offer-duration">Duration (months)</Label>
              <Input
                id="offer-duration"
                type="number"
                min={1}
                max={24}
                value={form.durationMonths}
                onChange={(e) => patch("durationMonths", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="offer-stipend">Stipend (₹ / month)</Label>
              <Input
                id="offer-stipend"
                type="number"
                min={0}
                placeholder="0 = unpaid"
                value={form.stipend}
                onChange={(e) => patch("stipend", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="offer-start">Start date</Label>
              <Input
                id="offer-start"
                type="date"
                value={form.startDate}
                onChange={(e) => patch("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="offer-end">End date</Label>
              <Input
                id="offer-end"
                type="date"
                value={form.endDate}
                onChange={(e) => patch("endDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="offer-mode">Work mode</Label>
              <select
                id="offer-mode"
                className="flex h-10 w-full rounded-xl border border-admin-border bg-admin-surface px-3 text-sm"
                value={form.workMode}
                onChange={(e) =>
                  patch(
                    "workMode",
                    e.target.value as OfferFormState["workMode"]
                  )
                }
              >
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="offer-location">Location</Label>
              <Input
                id="offer-location"
                value={form.location}
                onChange={(e) => patch("location", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="offer-mentor">Mentor</Label>
              <Input
                id="offer-mentor"
                value={form.mentorName}
                onChange={(e) => patch("mentorName", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="offer-valid">Offer valid until</Label>
              <Input
                id="offer-valid"
                type="date"
                value={form.offerValidUntil}
                onChange={(e) => patch("offerValidUntil", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="offer-address">Candidate address / city</Label>
              <Input
                id="offer-address"
                value={form.candidateAddress}
                onChange={(e) => patch("candidateAddress", e.target.value)}
                placeholder="City or postal address on letter"
              />
            </div>
          </div>

          <div className="border-t border-admin-border pt-5">
            <h3 className="text-sm font-semibold">Letter copy</h3>
            <p className="mt-0.5 text-xs text-admin-text-muted">
              Greeting, body paragraphs, and subject line.
            </p>
            <div className="mt-3 grid gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="offer-subject">Subject</Label>
                <Input
                  id="offer-subject"
                  value={form.subjectLine}
                  onChange={(e) => patch("subjectLine", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="offer-greeting">Greeting</Label>
                <Input
                  id="offer-greeting"
                  value={form.greeting}
                  onChange={(e) => patch("greeting", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="offer-intro">Opening paragraph</Label>
                <Textarea
                  id="offer-intro"
                  rows={3}
                  value={form.introParagraph}
                  onChange={(e) => patch("introParagraph", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="offer-body">Additional paragraph</Label>
                <Textarea
                  id="offer-body"
                  rows={3}
                  value={form.bodyParagraph}
                  onChange={(e) => patch("bodyParagraph", e.target.value)}
                  placeholder="Optional second body paragraph"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="offer-closing">Closing paragraph</Label>
                <Textarea
                  id="offer-closing"
                  rows={2}
                  value={form.closingParagraph}
                  onChange={(e) => patch("closingParagraph", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-admin-border pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold">Terms &amp; conditions</h3>
                <p className="mt-0.5 text-xs text-admin-text-muted">
                  Numbered clauses on the letter. One condition per row.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={resetConditions}
                >
                  Reset defaults
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addCondition}
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {(conditionLines.length
                ? conditionLines
                : [""]
              ).map((line, index) => (
                <div key={index} className="flex gap-2">
                  <span className="mt-2.5 w-5 shrink-0 text-center text-xs font-medium text-admin-text-muted">
                    {index + 1}.
                  </span>
                  <Textarea
                    rows={2}
                    value={line}
                    onChange={(e) => updateCondition(index, e.target.value)}
                    className="min-h-[2.5rem]"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="mt-1 shrink-0"
                    onClick={() => removeCondition(index)}
                    disabled={conditionLines.length <= 1}
                    aria-label="Remove condition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-admin-border pt-5">
            <h3 className="text-sm font-semibold">Signatory &amp; letterhead</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="offer-sign-name">Signatory name</Label>
                <Input
                  id="offer-sign-name"
                  value={form.signatoryName}
                  onChange={(e) => patch("signatoryName", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="offer-sign-title">Signatory title</Label>
                <Input
                  id="offer-sign-title"
                  value={form.signatoryTitle}
                  onChange={(e) => patch("signatoryTitle", e.target.value)}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="offer-company-addr">Company address</Label>
                <Input
                  id="offer-company-addr"
                  value={form.companyAddress}
                  onChange={(e) => patch("companyAddress", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <ImageKitUploadField
                  label="Signature image"
                  folder="offer-signatures"
                  value={{
                    url: form.signatureImageUrl || null,
                    publicId: form.signatureImageFileId || null,
                  }}
                  onChange={(next) => {
                    setForm((s) => ({
                      ...s,
                      signatureImageUrl: next.url || "",
                      signatureImageFileId: next.publicId || "",
                    }));
                  }}
                  disabled={busy}
                  maxBytes={SIGNATURE_MAX_BYTES}
                  accept={SIGNATURE_ACCEPT}
                  previewFit="contain"
                  dropzoneClassName="min-h-[120px]"
                  hint="Prefer a transparent PNG signature (no lined paper / gray photo background), up to 2MB — rendered above the signatory name"
                />
              </div>
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-admin-border"
                checked={form.sendEmail}
                onChange={(e) => patch("sendEmail", e.target.checked)}
              />
              Email PDF to candidate when generating
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-admin-border pt-4">
            <Button disabled={!canGenerate} onClick={handleSubmit}>
              <FileText className="h-4 w-4" />
              {busy ? "Generating…" : "Generate & send PDF"}
            </Button>
            {!form.startDate || !form.endDate ? (
              <p className="text-xs text-admin-text-muted">
                Start and end dates are required.
              </p>
            ) : null}
          </div>
        </section>

        <aside className="space-y-3">
          <div className="flex items-center justify-between gap-2 px-1">
            <div>
              <h3 className="text-sm font-semibold">Live preview</h3>
              <p className="text-xs text-admin-text-muted">
                Mirrors the PDF letterhead and layout.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-admin-text-muted">
              <ExternalLink className="h-3 w-3" />
              A4
            </span>
          </div>
          <div
            className={cn(
              "overflow-hidden rounded-2xl border border-admin-border bg-[#e8ebf0] shadow-sm",
              "sticky top-28"
            )}
          >
            <iframe
              title="Offer letter preview"
              className="h-[min(78vh,920px)] w-full bg-white"
              srcDoc={previewHtml}
              sandbox="allow-same-origin"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
