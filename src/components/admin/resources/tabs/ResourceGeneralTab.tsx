"use client";

import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { Resource } from "@/types/resource";
import {
  DIFFICULTY_LEVELS,
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
} from "@/constants/resource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  register: UseFormRegister<Partial<Resource>>;
  setValue: UseFormSetValue<Partial<Resource>>;
  values: Partial<Resource>;
  autoSlug: boolean;
  setAutoSlug: (v: boolean) => void;
  readTime: number;
  downloadTime: number;
}

export function ResourceGeneralTab({
  register,
  setValue,
  values,
  autoSlug,
  setAutoSlug,
  readTime,
  downloadTime,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" placeholder="Resource title" {...register("title", { required: true })} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="slug">Slug</Label>
            <label className="flex items-center gap-2 text-xs text-admin-text-muted">
              <Checkbox checked={autoSlug} onCheckedChange={(c) => setAutoSlug(c === true)} />
              Auto-generate
            </label>
          </div>
          <Input id="slug" placeholder="resource-slug" {...register("slug")} disabled={autoSlug} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            id="type"
            value={values.type || "guide"}
            onChange={(e) => setValue("type", e.target.value as Resource["type"])}
          >
            {RESOURCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea id="shortDescription" rows={2} {...register("shortDescription")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            value={values.category || ""}
            onChange={(e) => setValue("category", e.target.value || null)}
          >
            <option value="">Select category</option>
            {RESOURCE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subcategory">Subcategory</Label>
          <Input id="subcategory" {...register("subcategory")} />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            defaultValue={values.tags?.join(", ") || ""}
            onChange={(e) =>
              setValue(
                "tags",
                e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
              )
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            id="difficulty"
            value={values.difficulty || "intermediate"}
            onChange={(e) => setValue("difficulty", e.target.value as Resource["difficulty"])}
          >
            {DIFFICULTY_LEVELS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select id="language" {...register("language")}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Reading Time</Label>
          <Input value={`${readTime} min (auto)`} disabled />
        </div>

        <div className="space-y-2">
          <Label>Download Time</Label>
          <Input value={`${downloadTime} min (auto)`} disabled />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="canonicalUrl">Canonical URL</Label>
          <Input id="canonicalUrl" type="url" placeholder="https://" {...register("canonicalUrl")} />
        </div>

        <div className="flex flex-wrap gap-6 lg:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={!!values.featured} onCheckedChange={(c) => setValue("featured", c === true)} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={!!values.sticky} onCheckedChange={(c) => setValue("sticky", c === true)} />
            Sticky
          </label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Input id="priority" type="number" {...register("priority", { valueAsNumber: true })} />
        </div>
      </CardContent>
    </Card>
  );
}
