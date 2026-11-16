"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchDocumentSettings,
  replaceSignatorySignature,
  saveDocumentSettings,
  uploadDocumentLogo,
  uploadSignatory,
} from "@/lib/api/issuance";
import type { DocumentSettings } from "@/types/issuance";

function errorMessage(error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
            errors?: Record<string, string[] | undefined>;
          };
        };
      }
    ).response;
    const fieldErrors = response?.data?.errors;
    if (fieldErrors) {
      const first = Object.values(fieldErrors).flat().find(Boolean);
      if (first) return first;
    }
    if (response?.data?.message) return response.data.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

export function DocumentSettingsPage() {
  const query = useQuery({
    queryKey: ["document-settings"],
    queryFn: fetchDocumentSettings,
  });
  const [form, setForm] = useState<DocumentSettings | null>(null);
  const [busy, setBusy] = useState(false);
  const [signatoryName, setSignatoryName] = useState("");
  const [signatoryTitle, setSignatoryTitle] = useState("");
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.data) setForm(query.data);
  }, [query.data]);

  async function saveCompanySettings() {
    if (!form) return;
    setBusy(true);
    try {
      const payload: Parameters<typeof saveDocumentSettings>[0] = {
        companyName: form.companyName,
        companyLegalName: form.companyLegalName,
        companyWebsite: form.companyWebsite,
        companyPositioning: form.companyPositioning,
        officialEmail: form.officialEmail,
        companyAddress: form.companyAddress || "",
        defaultAcknowledgement: form.defaultAcknowledgement,
        signatories: form.signatories.map((item) => ({
          id: item.id,
          name: item.name,
          designation: item.designation,
          active: item.active,
        })),
      };
      // Avoid sending an empty signatories array that marks the company as
      // "configured" with no signers when none have been uploaded yet.
      if (form.signatories.length === 0) {
        delete (payload as { signatories?: unknown }).signatories;
      }
      const saved = await saveDocumentSettings(payload);
      setForm(saved);
      toast.success("Document settings saved");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function addSignatory() {
    const name = signatoryName.trim();
    const designation = signatoryTitle.trim();
    if (name.length < 3) {
      toast.error("Enter the authorized person's real name.");
      return;
    }
    if (designation.length < 2) {
      toast.error("Enter the signatory designation.");
      return;
    }
    if (!signatureFile) {
      toast.error("Choose the signature image file before adding the signatory.");
      return;
    }
    setBusy(true);
    try {
      setForm(await uploadSignatory(signatureFile, name, designation));
      setSignatoryName("");
      setSignatoryTitle("");
      setSignatureFile(null);
      if (signatureInputRef.current) signatureInputRef.current.value = "";
      toast.success("Signatory added");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  if (query.isLoading || !form) {
    return (
      <p className="text-sm text-admin-text-muted">
        {query.isError ? errorMessage(query.error) : "Loading document settings…"}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Document settings</h1>
        <p className="mt-1 text-sm text-admin-text-muted">
          Company details and the authorized signature used on internship certificates and completion letters.
        </p>
      </div>

      <form
        className="space-y-4 rounded-2xl border border-admin-border bg-admin-surface p-5"
        onSubmit={(event) => {
          event.preventDefault();
          void saveCompanySettings();
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <Label>Display name</Label>
            <Input
              className="mt-1.5"
              value={form.companyName}
              onChange={(event) => setForm({ ...form, companyName: event.target.value })}
            />
          </label>
          <label>
            <Label>Legal name</Label>
            <Input
              className="mt-1.5"
              value={form.companyLegalName}
              onChange={(event) => setForm({ ...form, companyLegalName: event.target.value })}
            />
          </label>
          <label>
            <Label>Website</Label>
            <Input
              className="mt-1.5"
              value={form.companyWebsite}
              onChange={(event) => setForm({ ...form, companyWebsite: event.target.value })}
            />
          </label>
          <label>
            <Label>Official email</Label>
            <Input
              className="mt-1.5"
              type="email"
              value={form.officialEmail}
              onChange={(event) => setForm({ ...form, officialEmail: event.target.value })}
            />
          </label>
          <label className="sm:col-span-2">
            <Label>Positioning</Label>
            <Input
              className="mt-1.5"
              value={form.companyPositioning}
              onChange={(event) => setForm({ ...form, companyPositioning: event.target.value })}
            />
          </label>
          <label className="sm:col-span-2">
            <Label>Address</Label>
            <Input
              className="mt-1.5"
              value={form.companyAddress || ""}
              onChange={(event) => setForm({ ...form, companyAddress: event.target.value })}
            />
          </label>
          <label className="sm:col-span-2">
            <Label>Default acknowledgement</Label>
            <Textarea
              className="mt-1.5"
              rows={4}
              value={form.defaultAcknowledgement}
              onChange={(event) => setForm({ ...form, defaultAcknowledgement: event.target.value })}
            />
          </label>
        </div>
        <Button type="submit" disabled={busy}>
          Save company settings
        </Button>
      </form>

      <section className="rounded-2xl border border-admin-border bg-admin-surface p-5">
        <h2 className="text-base font-semibold">Company logo</h2>
        <p className="mt-1 text-sm text-admin-text-muted">
          PNG, JPEG, or WebP. This logo is placed on the certificate and letter.
        </p>
        {form.logoUrl ? (
          <img src={form.logoUrl} alt="Company logo" className="mt-3 h-12 w-auto" />
        ) : (
          <p className="mt-3 text-sm">No logo uploaded yet. The wordmark is used until one is added.</p>
        )}
        <input
          className="mt-3 block text-sm"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setBusy(true);
            try {
              setForm(await uploadDocumentLogo(file));
              toast.success("Logo updated");
            } catch (error) {
              toast.error(errorMessage(error));
            } finally {
              setBusy(false);
            }
          }}
        />
      </section>

      <section className="space-y-4 rounded-2xl border border-admin-border bg-admin-surface p-5">
        <div>
          <h2 className="text-base font-semibold">Authorized signatories</h2>
          <p className="mt-1 text-sm text-admin-text-muted">
            Add the person’s real name, designation, and their actual signature image. Generated signatures
            are never used.
          </p>
        </div>
        {form.signatories.length === 0 ? (
          <p className="text-sm text-admin-text-muted">
            No signatory is configured yet. Certificates cannot be issued until one is added below.
          </p>
        ) : null}
        <ul className="space-y-3">
          {form.signatories.map((signatory) => (
            <li key={signatory.id} className="rounded-xl border border-admin-border p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  value={signatory.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      signatories: form.signatories.map((item) =>
                        item.id === signatory.id ? { ...item, name: event.target.value } : item
                      ),
                    })
                  }
                />
                <Input
                  value={signatory.designation}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      signatories: form.signatories.map((item) =>
                        item.id === signatory.id ? { ...item, designation: event.target.value } : item
                      ),
                    })
                  }
                />
              </div>
              <p className="mt-2 text-xs text-admin-text-muted">
                {signatory.hasSignature ? "Signature on file" : "Signature missing"}
              </p>
              <input
                className="mt-2 block text-sm"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setBusy(true);
                  try {
                    setForm(await replaceSignatorySignature(signatory.id, file));
                    toast.success("Signature replaced");
                  } catch (error) {
                    toast.error(errorMessage(error));
                  } finally {
                    setBusy(false);
                  }
                }}
              />
            </li>
          ))}
        </ul>
        {form.signatories.length > 0 ? (
          <Button type="button" variant="outline" disabled={busy} onClick={() => void saveCompanySettings()}>
            Save signatory name changes
          </Button>
        ) : null}

        <div className="space-y-3 border-t border-admin-border pt-4">
          <p className="text-sm font-medium text-admin-text">Add a signatory</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Input
              placeholder="Full name (required)"
              value={signatoryName}
              onChange={(event) => setSignatoryName(event.target.value)}
            />
            <Input
              placeholder="Designation (required)"
              value={signatoryTitle}
              onChange={(event) => setSignatoryTitle(event.target.value)}
            />
          </div>
          <input
            ref={signatureInputRef}
            className="block text-sm"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setSignatureFile(event.target.files?.[0] || null)}
          />
          <p className="text-xs text-admin-text-muted">
            {signatureFile
              ? `Selected: ${signatureFile.name}`
              : "Choose a PNG, JPEG, or WebP signature image, then click Add signatory."}
          </p>
          <Button type="button" disabled={busy} onClick={() => void addSignatory()}>
            Add signatory
          </Button>
        </div>
      </section>
    </div>
  );
}
