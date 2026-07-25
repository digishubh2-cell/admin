"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { Resource, ResourceDownload } from "@/types/resource";
import { DOWNLOAD_TYPES } from "@/constants/resource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  setValue: UseFormSetValue<Partial<Resource>>;
  values: Partial<Resource>;
}

export function ResourceDownloadsTab({ setValue, values }: Props) {
  const downloads = values.downloads || [];

  function addDownload() {
    setValue("downloads", [
      ...downloads,
      { title: "", url: "", type: "pdf", fileSize: "", description: "" },
    ]);
  }

  function updateDownload(index: number, patch: Partial<ResourceDownload>) {
    const next = [...downloads];
    next[index] = { ...next[index], ...patch };
    setValue("downloads", next);
  }

  function removeDownload(index: number) {
    setValue("downloads", downloads.filter((_, i) => i !== index));
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Downloadable Assets</CardTitle>
          <p className="mt-1 text-sm text-admin-text-muted">
            PDF, ZIP, DOCX, PPTX, XLSX, Code, GitHub, Figma, Canva, and external links.
          </p>
        </div>
        <Button type="button" size="sm" onClick={addDownload}>
          <Plus className="h-4 w-4" /> Add Download
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {downloads.length === 0 && (
          <div className="rounded-xl border border-dashed border-admin-border py-12 text-center text-sm text-admin-text-muted">
            No downloads attached. Add PDFs, templates, starter kits, or external resources.
          </div>
        )}
        {downloads.map((dl, i) => (
          <div key={i} className="grid gap-4 rounded-xl border border-admin-border p-4 lg:grid-cols-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={dl.title} onChange={(e) => updateDownload(i, { title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
                value={dl.type || "pdf"}
                onChange={(e) => updateDownload(i, { type: e.target.value as ResourceDownload["type"] })}
              >
                {DOWNLOAD_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label>URL</Label>
              <Input
                placeholder="https:// or GitHub/Figma link"
                value={dl.url || ""}
                onChange={(e) => updateDownload(i, { url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>File Size</Label>
              <Input
                placeholder="2.4 MB"
                value={dl.fileSize || ""}
                onChange={(e) => updateDownload(i, { fileSize: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={dl.description || ""}
                onChange={(e) => updateDownload(i, { description: e.target.value })}
              />
            </div>
            <div className="lg:col-span-2">
              <Button type="button" size="sm" variant="ghost" className="text-danger" onClick={() => removeDownload(i)}>
                <Trash2 className="h-4 w-4" /> Remove
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
