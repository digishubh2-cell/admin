"use client";

import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { Resource } from "@/types/resource";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  register: UseFormRegister<Partial<Resource>>;
  setValue: UseFormSetValue<Partial<Resource>>;
  values: Partial<Resource>;
}

export function ResourceContentTab({ register, setValue, values }: Props) {
  const references = values.references || [];

  function addReference() {
    setValue("references", [...references, { title: "", url: "", type: "link" }]);
  }

  function updateReference(index: number, field: string, value: string) {
    const next = [...references];
    next[index] = { ...next[index], [field]: value };
    setValue("references", next);
  }

  function removeReference(index: number) {
    setValue("references", references.filter((_, i) => i !== index));
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Content Editor</CardTitle>
          <CardDescription>Markdown, MDX, and HTML supported with auto table of contents.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contentFormat">Format</Label>
            <Select
              id="contentFormat"
              value={values.contentFormat || "markdown"}
              onChange={(e) => setValue("contentFormat", e.target.value as Resource["contentFormat"])}
            >
              <option value="markdown">Markdown</option>
              <option value="mdx">MDX</option>
              <option value="html">HTML</option>
            </Select>
          </div>
          <Textarea
            id="content"
            rows={24}
            className="font-mono text-sm"
            placeholder="Write your resource content. Supports headings, tables, code blocks, callouts, quotes, accordions..."
            {...register("content")}
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Content Features</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-admin-text-secondary">
            <p>✓ Rich text &amp; Markdown</p>
            <p>✓ Tables, images, videos</p>
            <p>✓ Code blocks &amp; callouts</p>
            <p>✓ Quotes &amp; accordions</p>
            <p>✓ Auto table of contents</p>
            <p>✓ Internal link suggestions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>References</CardTitle>
            <Button type="button" size="sm" variant="outline" onClick={addReference}>
              <Plus className="h-3 w-3" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {references.length === 0 && (
              <p className="text-sm text-admin-text-muted">No references added.</p>
            )}
            {references.map((ref, i) => (
              <div key={i} className="space-y-2 rounded-xl border border-admin-border p-3">
                <InputField label="Title" value={ref.title} onChange={(v) => updateReference(i, "title", v)} />
                <InputField label="URL" value={ref.url || ""} onChange={(v) => updateReference(i, "url", v)} />
                <Button type="button" size="sm" variant="ghost" className="text-danger" onClick={() => removeReference(i)}>
                  <Trash2 className="h-3 w-3" /> Remove
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Internal Links</CardTitle></CardHeader>
          <CardContent>
            <Textarea
              rows={4}
              placeholder="One URL per line"
              defaultValue={values.internalLinks?.join("\n") || ""}
              onChange={(e) =>
                setValue("internalLinks", e.target.value.split("\n").map((l) => l.trim()).filter(Boolean))
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <input
        className="flex h-9 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
