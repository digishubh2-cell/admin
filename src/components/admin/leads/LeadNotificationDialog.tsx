"use client";

import { useEffect, useState } from "react";
import { Mail, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useLeadMutations,
  useLeadNotificationSettings,
} from "@/hooks/use-leads";
import { useAuth } from "@/hooks/use-auth";

const EMAIL_REGEX =
  /^[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z]{2,})+$/i;

const MAX_EMAILS = 20;

function getErrorMessage(err: unknown) {
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as { response?: { data?: { message?: string } } })
      .response;
    if (response?.data?.message) return response.data.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

function parseEmails(raw: string) {
  return raw
    .split(/[\s,;]+/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadNotificationDialog({ open, onOpenChange }: Props) {
  const { data: user } = useAuth();
  const canEdit = user?.role !== "viewer";
  const { data: settings, isLoading } = useLeadNotificationSettings(open);
  const { updateNotificationSettings } = useLeadMutations();
  const [emails, setEmails] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!open) return;
    setEmails(settings?.notificationEmails || []);
    setDraft("");
    setDirty(false);
  }, [open, settings]);

  async function persist(next: string[]) {
    try {
      const saved = await updateNotificationSettings.mutateAsync(next);
      setEmails(saved.notificationEmails || next);
      setDirty(false);
      toast.success(
        next.length
          ? "Notification emails saved"
          : "Lead email notifications turned off"
      );
    } catch (error) {
      setEmails(settings?.notificationEmails || []);
      setDirty(false);
      toast.error(getErrorMessage(error) || "Failed to save notification emails");
    }
  }

  function addEmails() {
    const incoming = parseEmails(draft);
    if (!incoming.length) {
      toast.error("Enter an email address");
      return;
    }

    const invalid = incoming.filter((email) => !EMAIL_REGEX.test(email));
    if (invalid.length) {
      toast.error(`Invalid email: ${invalid[0]}`);
      return;
    }

    const merged = [...new Set([...emails, ...incoming])];
    if (merged.length > MAX_EMAILS) {
      toast.error(`You can add up to ${MAX_EMAILS} emails`);
      return;
    }

    setDraft("");
    setEmails(merged);
    setDirty(true);
    void persist(merged);
  }

  function removeEmail(email: string) {
    const next = emails.filter((item) => item !== email);
    setEmails(next);
    setDirty(true);
    void persist(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Email notifications</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-admin-text-secondary">
          When a new lead is submitted from any website form, these addresses
          receive a full lead-details email. Add more than one if the sales team
          should all be notified.
        </p>

        {isLoading ? (
          <p className="text-sm text-admin-text-muted">Loading saved emails…</p>
        ) : emails.length ? (
          <ul className="space-y-2">
            {emails.map((email) => (
              <li
                key={email}
                className="flex items-center justify-between gap-3 rounded-xl border border-admin-border bg-admin-muted/30 px-3 py-2"
              >
                <span className="flex min-w-0 items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 shrink-0 text-admin-text-muted" />
                  <span className="truncate">{email}</span>
                </span>
                {canEdit ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-danger"
                    aria-label={`Remove ${email}`}
                    onClick={() => removeEmail(email)}
                    disabled={updateNotificationSettings.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-admin-border px-4 py-6 text-center">
            <p className="text-sm font-medium">No notification emails yet</p>
            <p className="mt-1 text-xs text-admin-text-muted">
              Add at least one address to get an email as soon as a lead arrives.
            </p>
          </div>
        )}

        {canEdit ? (
          <form
            className="space-y-2"
            onSubmit={(event) => {
              event.preventDefault();
              addEmails();
            }}
          >
            <Label htmlFor="lead-notify-email">Add email</Label>
            <div className="flex gap-2">
              <Input
                id="lead-notify-email"
                type="text"
                inputMode="email"
                autoComplete="email"
                placeholder="sales@shubhdigi.in"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                disabled={isLoading || updateNotificationSettings.isPending}
              />
              <Button
                type="submit"
                disabled={isLoading || updateNotificationSettings.isPending}
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            <p className="text-xs text-admin-text-muted">
              You can paste several addresses separated by comma. Saving is
              immediate — no extra confirm step.
            </p>
          </form>
        ) : (
          <p className="text-xs text-admin-text-muted">
            You can view these addresses, but only authors and above can change
            them.
          </p>
        )}

        {dirty && updateNotificationSettings.isPending ? (
          <p className="text-xs text-admin-text-muted">Saving…</p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
