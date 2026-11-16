"use client";

import { useEffect, useState } from "react";
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
    const response = (error as { response?: { data?: { message?: string } } }).response;
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

  useEffect(() => {
    if (query.data) setForm(query.data);
  }, [query.data]);

  async function save(next: DocumentSettings) {
    setBusy(true);
    try {
      const saved = await saveDocumentSettings({
        companyName: next.companyName,
        companyLegalName: next.companyLegalName,
        companyWebsite: next.companyWebsite,
        companyPositioning: next.companyPositioning,
        officialEmail: next.officialEmail,
        companyAddress: next.companyAddress || "",
        defaultAcknowledgement: next.defaultAcknowledgement,
        signatories: next.signatories.map((item) => ({
          id: item.id,
          name: item.name,
          designation: item.designation,
          active: item.active,
        })),
      });
      setForm(saved);
      toast.success("Document settings saved");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  if (query.isLoading || !form) {
    return <p className="text-sm text-admin-text-muted">{query.isError ? errorMessage(query.error) : "Loading document settings…"}</p>;
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
          void save(form);
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <Label>Display name</Label>
            <Input className="mt-1.5" value={form.companyName} onChange={(event) => setForm({ ...form, companyName: event.target.value })} />
          </label>
          <label>
            <Label>Legal name</Label>
            <Input className="mt-1.5" value={form.companyLegalName} onChange={(event) => setForm({ ...form, companyLegalName: event.target.value })} />
          </label>
          <label>
            <Label>Website</Label>
            <Input className="mt-1.5" value={form.companyWebsite} onChange={(event) => setForm({ ...form, companyWebsite: event.target.value })} />
          </label>
          <label>
            <Label>Official email</Label>
            <Input className="mt-1.5" type="email" value={form.officialEmail} onChange={(event) => setForm({ ...form, officialEmail: event.target.value })} />
          </label>
          <label className="sm:col-span-2">
            <Label>Positioning</Label>
            <Input className="mt-1.5" value={form.companyPositioning} onChange={(event) => setForm({ ...form, companyPositioning: event.target.value })} />
          </label>
          <label className="sm:col-span-2">
            <Label>Address</Label>
            <Input className="mt-1.5" value={form.companyAddress || ""} onChange={(event) => setForm({ ...form, companyAddress: event.target.value })} />
          </label>
          <label className="sm:col-span-2">
            <Label>Default acknowledgement</Label>
            <Textarea className="mt-1.5" rows={4} value={form.defaultAcknowledgement} onChange={(event) => setForm({ ...form, defaultAcknowledgement: event.target.value })} />
          </label>
        </div>
        <Button type="submit" disabled={busy}>Save settings</Button>
      </form>

      <section className="rounded-2xl border border-admin-border bg-admin-surface p-5">
        <h2 className="text-base font-semibold">Company logo</h2>
        <p className="mt-1 text-sm text-admin-text-muted">PNG, JPEG, or WebP. This logo is placed on the certificate and letter.</p>
        {form.logoUrl ? <img src={form.logoUrl} alt="Company logo" className="mt-3 h-12 w-auto" /> : <p className="mt-3 text-sm">No logo uploaded yet. The wordmark is used until one is added.</p>}
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
            Upload the person’s actual signature. A generated signature is never used, and placeholder names are rejected.
          </p>
        </div>
        {form.signatories.length === 0 ? <p className="text-sm text-admin-text-muted">No signatory is configured. Certificates cannot be issued yet.</p> : null}
        <ul className="space-y-3">
          {form.signatories.map((signatory) => (
            <li key={signatory.id} className="rounded-xl border border-admin-border p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  value={signatory.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      signatories: form.signatories.map((item) => item.id === signatory.id ? { ...item, name: event.target.value } : item),
                    })
                  }
                />
                <Input
                  value={signatory.designation}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      signatories: form.signatories.map((item) => item.id === signatory.id ? { ...item, designation: event.target.value } : item),
                    })
                  }
                />
              </div>
              <p className="mt-2 text-xs text-admin-text-muted">{signatory.hasSignature ? "Signature on file" : "Signature missing"}</p>
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
        <div className="grid gap-2 border-t border-admin-border pt-4 sm:grid-cols-2">
          <Input placeholder="Signatory name" value={signatoryName} onChange={(event) => setSignatoryName(event.target.value)} />
          <Input placeholder="Designation" value={signatoryTitle} onChange={(event) => setSignatoryTitle(event.target.value)} />
        </div>
        <input
          className="block text-sm"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setBusy(true);
            try {
              setForm(await uploadSignatory(file, signatoryName, signatoryTitle));
              setSignatoryName("");
              setSignatoryTitle("");
              toast.success("Signatory added");
            } catch (error) {
              toast.error(errorMessage(error));
            } finally {
              setBusy(false);
            }
          }}
        />
        <Button type="button" variant="outline" disabled={busy} onClick={() => save(form)}>
          Save signatory names
        </Button>
      </section>
    </div>
  );
}
