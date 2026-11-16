"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  beginReissue,
  fetchIssuanceContext,
  issueDocuments,
  previewIssuance,
  previewIssuancePdf,
  reissueDocuments,
  resendCompletionEmail,
  revokeCertificate,
  saveIssuanceDraft,
} from "@/lib/api/issuance";
import type { IssuanceContext, IssuanceForm, IssuanceRecord } from "@/types/issuance";

function errorMessage(error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

function formFrom(context: IssuanceContext, source?: IssuanceRecord | null): IssuanceForm {
  const record = source || context.draft || context.current;
  const base = record || context.defaults;
  const signatoryId =
    (record && "signatoryId" in record ? record.signatoryId : null) ||
    context.signatories.find((item) => item.hasSignature)?.id ||
    context.signatories[0]?.id ||
    "";
  return {
    candidateName: base.candidateName || "",
    designation: base.designation || "",
    department: base.department || "",
    startDate: base.startDate || "",
    endDate: base.endDate || "",
    issueDate: base.issueDate || "",
    acknowledgement: base.acknowledgement || "",
    letterBody: base.letterBody || "",
    signatoryId,
    confirmedLearningAreas:
      (record && record.confirmedLearningAreas?.length
        ? record.confirmedLearningAreas
        : context.verifiedActivities) || [],
    allowEarlyException: false,
    earlyExceptionReason: "",
    acknowledgeNonInternship: false,
    sendEmail: Boolean(context.candidateEmail),
    reissueReason: "",
  };
}

export function IssuanceWorkspace({
  applicationId,
  open,
  onClose,
}: {
  applicationId: string;
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const contextQuery = useQuery({
    queryKey: ["applications", applicationId, "issuance"],
    queryFn: () => fetchIssuanceContext(applicationId),
    enabled: open,
  });
  const context = contextQuery.data;
  const [form, setForm] = useState<IssuanceForm | null>(null);
  const [phase, setPhase] = useState<"edit" | "confirm" | "done" | "manage">("edit");
  const [correcting, setCorrecting] = useState(false);
  const [tab, setTab] = useState<"certificate" | "letter">("certificate");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewMeta, setPreviewMeta] = useState<{ durationLabel?: string | null; certificateNumber?: string }>({});
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [letterDirty, setLetterDirty] = useState(false);
  const [result, setResult] = useState<{ emailWarning?: string | null; issuance?: IssuanceRecord | null } | null>(null);
  const [revokeReason, setRevokeReason] = useState("");

  useEffect(() => {
    if (!open) {
      setForm(null);
      setPhase("edit");
      setCorrecting(false);
      setResult(null);
      setPreviewHtml("");
      return;
    }
    if (!context || form) return;
    setForm(formFrom(context));
    setPhase(context.mode === "issued" ? "manage" : "edit");
    setCorrecting(context.mode === "reissue");
  }, [open, context, form]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape" || busy) return;
      if (phase === "confirm") {
        setPhase("edit");
        return;
      }
      onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, phase, onClose]);

  useEffect(() => {
    if (!open || !form || phase === "manage" || phase === "done") return;
    const handle = window.setTimeout(async () => {
      try {
        setPreviewError(null);
        const preview = await previewIssuance(applicationId, form, { document: tab });
        setPreviewHtml(preview.html || "");
        setPreviewMeta({
          durationLabel: preview.durationLabel,
          certificateNumber: preview.certificateNumber,
        });
      } catch (error) {
        setPreviewError(errorMessage(error));
      }
    }, 350);
    return () => window.clearTimeout(handle);
  }, [open, form, tab, phase, applicationId]);

  const selectedSignatory = useMemo(
    () => context?.signatories.find((item) => item.id === form?.signatoryId) || null,
    [context, form?.signatoryId]
  );
  const blocked = (context?.eligibility.blockers.length || 0) > 0;
  const earlyBlocked = Boolean(context?.eligibility.early && !form?.allowEarlyException);
  const signatureBlocked = !selectedSignatory?.hasSignature;
  const jobBlocked = context?.jobType === "job" && !form?.acknowledgeNonInternship;
  const canContinue = Boolean(form) && !blocked && !earlyBlocked && !signatureBlocked && !jobBlocked;

  function update<K extends keyof IssuanceForm>(key: K, value: IssuanceForm[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  async function refreshContext() {
    await queryClient.invalidateQueries({ queryKey: ["applications", applicationId] });
    await contextQuery.refetch();
  }

  async function onSaveDraft() {
    if (!form) return;
    setBusy("draft");
    try {
      await saveIssuanceDraft(applicationId, form);
      toast.success("Draft saved");
      await refreshContext();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(null);
    }
  }

  async function onDownload() {
    if (!form) return;
    setBusy("pdf");
    try {
      const blob = await previewIssuancePdf(applicationId, form, tab);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(null);
    }
  }

  async function onIssue() {
    if (!form) return;
    setBusy("issue");
    try {
      const response =
        correcting || context?.mode === "reissue"
          ? await reissueDocuments(applicationId, form)
          : await issueDocuments(applicationId, form);
      setResult({ emailWarning: response.emailWarning, issuance: response.issuance });
      setPhase("done");
      if (response.emailWarning) {
        toast.warning(`Documents issued. Email was not sent: ${response.emailWarning}`);
      } else if (form.sendEmail) {
        toast.success("Documents issued and emailed");
      } else {
        toast.success("Documents issued");
      }
      await refreshContext();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(null);
    }
  }

  async function onStartCorrection() {
    setBusy("correct");
    try {
      const response = await beginReissue(applicationId);
      if (response.context) {
        setForm(formFrom(response.context, response.draft));
      }
      setCorrecting(true);
      setLetterDirty(false);
      setPhase("edit");
      toast.message("Correction started. The current certificate stays valid until you issue the new version.");
      await refreshContext();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(null);
    }
  }

  async function onResend() {
    setBusy("resend");
    try {
      await resendCompletionEmail(applicationId);
      toast.success("Completion email resent. The certificate was not regenerated.");
      await refreshContext();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(null);
    }
  }

  async function onRevoke() {
    setBusy("revoke");
    try {
      await revokeCertificate(applicationId, revokeReason.trim());
      toast.success("Certificate revoked");
      setRevokeReason("");
      setForm(null);
      await refreshContext();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(null);
    }
  }

  async function toggleArea(area: string) {
    if (!form) return;
    const selected = form.confirmedLearningAreas.includes(area)
      ? form.confirmedLearningAreas.filter((item) => item !== area)
      : [...form.confirmedLearningAreas, area];
    const next = { ...form, confirmedLearningAreas: selected };
    setForm(next);
    if (letterDirty) return;
    try {
      const preview = await previewIssuance(applicationId, next, {
        document: "letter",
        regenerateLetter: true,
      });
      if (preview.letterBody) {
        setForm((current) => (current ? { ...current, letterBody: preview.letterBody || "" } : current));
      }
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  if (!open) return null;

  const frameWidth = tab === "certificate" ? 1123 : 794;
  const frameHeight = tab === "certificate" ? 794 : 1123;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-admin-bg text-admin-text" role="dialog" aria-modal="true" aria-labelledby="issuance-title">
      <header className="flex items-center justify-between gap-3 border-b border-admin-border px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.14em] text-admin-text-muted">Internship completion</p>
          <h2 id="issuance-title" className="truncate text-lg font-semibold">
            {context?.draft?.candidateName || context?.current?.candidateName || "Issue documents"}
          </h2>
        </div>
        <Button variant="outline" onClick={onClose} disabled={Boolean(busy)}>
          Close
        </Button>
      </header>

      {contextQuery.isLoading || !context || !form ? (
        <div className="flex flex-1 items-center justify-center text-sm text-admin-text-muted">
          {contextQuery.isError ? errorMessage(contextQuery.error) : "Loading candidate records…"}
        </div>
      ) : phase === "manage" && context.current ? (
        <ManagePhase
          context={context}
          busy={busy}
          revokeReason={revokeReason}
          onRevokeReason={setRevokeReason}
          onResend={onResend}
          onRevoke={onRevoke}
          onCorrect={onStartCorrection}
        />
      ) : phase === "done" ? (
        <DonePhase result={result} email={context.candidateEmail} onClose={onClose} onResend={onResend} busy={busy} />
      ) : (
        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(320px,440px)_1fr]">
          <section className="min-h-0 overflow-y-auto border-admin-border px-4 py-4 sm:px-6 lg:border-r">
            <Notices context={context} signatureBlocked={signatureBlocked} />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Candidate name">
                <Input value={form.candidateName} onChange={(event) => update("candidateName", event.target.value)} />
              </Field>
              <Field label="Issue date">
                <Input type="date" value={form.issueDate} onChange={(event) => update("issueDate", event.target.value)} />
              </Field>
              <Field label="Internship designation" className="sm:col-span-2">
                <Input value={form.designation} onChange={(event) => update("designation", event.target.value)} />
              </Field>
              <Field label="Department / team">
                <Input value={form.department} onChange={(event) => update("department", event.target.value)} />
              </Field>
              <Field label="Signatory">
                <Select value={form.signatoryId} onChange={(event) => update("signatoryId", event.target.value)}>
                  <option value="">Select signatory</option>
                  {context.signatories.map((signatory) => (
                    <option key={signatory.id} value={signatory.id}>
                      {signatory.name} — {signatory.designation}
                      {signatory.hasSignature ? "" : " (signature required)"}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Start date">
                <Input type="date" value={form.startDate} onChange={(event) => update("startDate", event.target.value)} />
              </Field>
              <Field label="End date">
                <Input type="date" value={form.endDate} onChange={(event) => update("endDate", event.target.value)} />
              </Field>
            </div>
            <p className="mt-3 text-sm text-admin-text-muted">
              Total duration: <span className="font-medium text-admin-text">{previewMeta.durationLabel || form && "Calculated on preview"}</span>
              {previewMeta.certificateNumber ? ` · ${previewMeta.certificateNumber}` : ""}
            </p>

            <div className="mt-4 flex gap-2">
              <Button type="button" size="sm" variant={tab === "certificate" ? "default" : "outline"} onClick={() => setTab("certificate")}>
                Completion certificate
              </Button>
              <Button type="button" size="sm" variant={tab === "letter" ? "default" : "outline"} onClick={() => setTab("letter")}>
                Completion letter
              </Button>
            </div>

            {tab === "certificate" ? (
              <Field label="Acknowledgement paragraph" className="mt-4">
                <Textarea rows={5} value={form.acknowledgement} onChange={(event) => update("acknowledgement", event.target.value)} />
              </Field>
            ) : (
              <div className="mt-4 space-y-3">
                <Field label="Completion letter">
                  <Textarea
                    rows={12}
                    value={form.letterBody}
                    onChange={(event) => {
                      setLetterDirty(true);
                      update("letterBody", event.target.value);
                    }}
                  />
                </Field>
                <div>
                  <p className="text-sm font-medium">Verified work to mention</p>
                  <p className="mt-1 text-xs text-admin-text-muted">
                    Suggestions stay out of the letter until you select them. Select only work supported by this candidate’s records.
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {[...new Set([...context.verifiedActivities, ...context.suggestions])].map((area) => (
                      <label key={area} className="flex items-start gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={form.confirmedLearningAreas.includes(area)}
                          onChange={() => toggleArea(area)}
                        />
                        <span>
                          {area}
                          {context.verifiedActivities.includes(area) ? (
                            <span className="ml-2 text-xs text-admin-text-muted">On record</span>
                          ) : null}
                        </span>
                      </label>
                    ))}
                    {context.suggestions.length === 0 && context.verifiedActivities.length === 0 ? (
                      <p className="text-sm text-admin-text-muted">No verified activities are on file. The general letter is used.</p>
                    ) : null}
                  </div>
                  {letterDirty ? (
                    <button
                      type="button"
                      className="mt-2 text-sm text-primary underline-offset-2 hover:underline"
                      onClick={() => {
                        setLetterDirty(false);
                        update("letterBody", context.defaults.letterBody);
                      }}
                    >
                      Reset letter to the standard text
                    </button>
                  ) : null}
                </div>
                {context.internalFeedback ? (
                  <p className="rounded-xl bg-admin-muted/50 p-3 text-xs text-admin-text-muted">
                    Internal feedback is not printed: {context.internalFeedback}
                  </p>
                ) : null}
              </div>
            )}

            {context.eligibility.early && context.eligibility.canApplyEarlyException ? (
              <div className="mt-4 space-y-2 rounded-xl border border-admin-border p-3">
                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={form.allowEarlyException}
                    onChange={(event) => update("allowEarlyException", event.target.checked)}
                  />
                  <span>Record an audited exception and issue before the end date</span>
                </label>
                {form.allowEarlyException ? (
                  <Textarea
                    rows={3}
                    placeholder="Why is this exception authorized?"
                    value={form.earlyExceptionReason}
                    onChange={(event) => update("earlyExceptionReason", event.target.value)}
                  />
                ) : null}
              </div>
            ) : null}

            {context.jobType === "job" ? (
              <label className="mt-4 flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={form.acknowledgeNonInternship}
                  onChange={(event) => update("acknowledgeNonInternship", event.target.checked)}
                />
                <span>I confirm this engagement was an internship, not employment.</span>
              </label>
            ) : null}

            {correcting || context.mode === "reissue" ? (
              <Field label="Reason for correction" className="mt-4">
                <Textarea rows={2} value={form.reissueReason} onChange={(event) => update("reissueReason", event.target.value)} />
              </Field>
            ) : null}

            <label className="mt-4 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.sendEmail}
                disabled={!context.candidateEmail}
                onChange={(event) => update("sendEmail", event.target.checked)}
              />
              Email the documents to {context.candidateEmail || "the candidate"}
            </label>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button type="button" variant="outline" disabled={Boolean(busy)} onClick={onSaveDraft}>
                {busy === "draft" ? "Saving…" : "Save as draft"}
              </Button>
              <Button type="button" disabled={!canContinue || Boolean(busy)} onClick={() => setPhase("confirm")}>
                Review and confirm
              </Button>
            </div>
          </section>

          <section className="min-h-0 overflow-auto bg-admin-muted/30 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-medium">{tab === "certificate" ? "Certificate preview" : "Letter preview"}</p>
              <Button type="button" size="sm" variant="outline" disabled={Boolean(busy)} onClick={onDownload}>
                {busy === "pdf" ? "Preparing PDF…" : "Open PDF preview"}
              </Button>
            </div>
            {previewError ? <p className="mb-3 text-sm text-danger">{previewError}</p> : null}
            <PreviewFrame html={previewHtml} width={frameWidth} height={frameHeight} title={tab === "certificate" ? "Certificate preview" : "Letter preview"} />
          </section>
        </div>
      )}

      {phase === "confirm" && form && context ? (
        <ConfirmBar
          form={form}
          context={context}
          certificateNumber={previewMeta.certificateNumber || context.draft?.certificateNumber || ""}
          duration={previewMeta.durationLabel || ""}
          busy={busy === "issue"}
          correcting={correcting || context.mode === "reissue"}
          onBack={() => setPhase("edit")}
          onIssue={onIssue}
        />
      ) : null}
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={className}>
      <Label>{label}</Label>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Notices({ context, signatureBlocked }: { context: IssuanceContext; signatureBlocked: boolean }) {
  const items = [...context.eligibility.blockers, ...context.eligibility.warnings];
  if (signatureBlocked) {
    items.unshift({
      code: "signatory_missing",
      message: "The selected signatory has no uploaded signature. Issuance stays blocked until an authorized admin configures one.",
    });
  }
  if (!items.length && context.company.hasLogo) return null;
  return (
    <div className="space-y-2">
      {!context.company.hasLogo ? (
        <p className="rounded-xl border border-admin-border bg-admin-muted/40 px-3 py-2 text-sm">
          Company logo is not configured. Documents will use the ShubhDigi wordmark.
        </p>
      ) : null}
      {items.map((item) => (
        <p key={item.code + item.message} className="rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-sm">
          {item.message}{" "}
          {item.code === "signatory_missing" ? (
            <Link href="/settings/documents" className="text-primary underline-offset-2 hover:underline">
              Open document settings
            </Link>
          ) : null}
        </p>
      ))}
    </div>
  );
}

function PreviewFrame({ html, width, height, title }: { html: string; width: number; height: number; title: string }) {
  const scale = typeof window !== "undefined" && window.innerWidth < 1024 ? Math.min(0.42, (window.innerWidth - 32) / width) : 0.72;
  if (!html) {
    return <div className="grid h-64 place-items-center text-sm text-admin-text-muted">Preparing preview…</div>;
  }
  return (
    <div className="overflow-auto">
      <div style={{ width: width * scale, height: height * scale }}>
        <iframe
          title={title}
          srcDoc={html}
          className="origin-top-left border border-admin-border bg-white"
          style={{ width, height, transform: `scale(${scale})` }}
        />
      </div>
    </div>
  );
}

function ConfirmBar({
  form,
  context,
  certificateNumber,
  duration,
  busy,
  correcting,
  onBack,
  onIssue,
}: {
  form: IssuanceForm;
  context: IssuanceContext;
  certificateNumber: string;
  duration: string;
  busy: boolean;
  correcting: boolean;
  onBack: () => void;
  onIssue: () => void;
}) {
  return (
    <div className="border-t border-admin-border bg-admin-surface px-4 py-4 sm:px-6">
      <p className="text-base font-semibold">Ready to issue internship completion documents?</p>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <Item label="Candidate" value={form.candidateName} />
        <Item label="Designation" value={form.designation} />
        <Item label="Period" value={`${form.startDate} to ${form.endDate}${duration ? ` · ${duration}` : ""}`} />
        <Item label="Certificate number" value={certificateNumber || "Assigned on issue"} />
        <Item label="Documents" value="Completion certificate and completion letter" />
        <Item label="Recipient" value={form.sendEmail ? context.candidateEmail || "No email" : "Not emailed"} />
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={onBack} disabled={busy}>
          Back
        </Button>
        <Button type="button" onClick={onIssue} disabled={busy}>
          {busy ? "Issuing…" : form.sendEmail ? "Issue & send documents" : "Issue documents"}
        </Button>
      </div>
      {correcting ? <p className="mt-2 text-xs text-admin-text-muted">The previous certificate file is kept and marked superseded.</p> : null}
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-admin-text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function ManagePhase({
  context,
  busy,
  revokeReason,
  onRevokeReason,
  onResend,
  onRevoke,
  onCorrect,
}: {
  context: IssuanceContext;
  busy: string | null;
  revokeReason: string;
  onRevokeReason: (value: string) => void;
  onResend: () => void;
  onRevoke: () => void;
  onCorrect: () => void;
}) {
  const current = context.current!;
  return (
    <div className="mx-auto w-full max-w-3xl overflow-y-auto px-4 py-6 sm:px-6">
      <p className="text-sm text-admin-text-muted">Current certificate</p>
      <h3 className="mt-1 text-2xl font-semibold">{current.certificateNumber}</h3>
      <p className="mt-2 text-sm">
        {current.candidateName} · {current.designation} · {current.department}
      </p>
      <p className="mt-1 text-sm text-admin-text-muted">
        {current.startDate} to {current.endDate} · {current.durationLabel} · Issued {current.issueDate}
      </p>
      <p className="mt-3 text-sm">
        Email: {current.emailStatus || "not sent"}
        {current.emailError ? ` — ${current.emailError}` : ""}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {current.certificateUrl ? (
          <Button variant="outline" asChild>
            <a href={current.certificateUrl} target="_blank" rel="noopener noreferrer">Certificate PDF</a>
          </Button>
        ) : null}
        {current.letterUrl ? (
          <Button variant="outline" asChild>
            <a href={current.letterUrl} target="_blank" rel="noopener noreferrer">Letter PDF</a>
          </Button>
        ) : null}
        <Button variant="outline" disabled={Boolean(busy)} onClick={onResend}>
          {busy === "resend" ? "Sending…" : "Resend email"}
        </Button>
        <Button disabled={Boolean(busy)} onClick={onCorrect}>
          {busy === "correct" ? "Starting…" : "Correct and reissue"}
        </Button>
      </div>
      {context.eligibility.canRevoke ? (
        <div className="mt-8 space-y-2 rounded-2xl border border-admin-border p-4">
          <p className="text-sm font-medium">Revoke certificate</p>
          <Textarea rows={3} value={revokeReason} onChange={(event) => onRevokeReason(event.target.value)} placeholder="Reason for revocation" />
          <Button variant="destructive" disabled={Boolean(busy) || revokeReason.trim().length < 8} onClick={onRevoke}>
            {busy === "revoke" ? "Revoking…" : "Revoke certificate"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function DonePhase({
  result,
  email,
  onClose,
  onResend,
  busy,
}: {
  result: { emailWarning?: string | null; issuance?: IssuanceRecord | null } | null;
  email: string | null;
  onClose: () => void;
  onResend: () => void;
  busy: string | null;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h3 className="text-2xl font-semibold">Documents issued</h3>
      <p className="mt-2 text-sm text-admin-text-muted">
        {result?.issuance?.certificateNumber} is now the current certificate.
        {result?.emailWarning
          ? ` The files are stored, and the email to ${email || "the candidate"} failed: ${result.emailWarning}`
          : email
            ? ` The email was sent to ${email}.`
            : " No email was sent."}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {result?.emailWarning ? (
          <Button disabled={Boolean(busy)} onClick={onResend}>
            {busy === "resend" ? "Sending…" : "Retry email"}
          </Button>
        ) : null}
        <Button variant="outline" onClick={onClose}>Back to candidate</Button>
      </div>
    </div>
  );
}
