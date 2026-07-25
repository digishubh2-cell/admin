"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { Job, JobMedia } from "@/types/job";
import { FormSection } from "@/components/admin/case-studies/forms/FormHelpers";
import { ImageKitUploadField } from "@/components/admin/media/ImageKitUploadField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  setValue: UseFormSetValue<Partial<Job>>;
  values: Partial<Job>;
}

function MediaField({
  label,
  media,
  onChange,
}: {
  label: string;
  media?: JobMedia | null;
  onChange: (m: JobMedia) => void;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-admin-border p-4">
      <ImageKitUploadField
        label={label}
        folder="jobs"
        value={media}
        onChange={({ url, publicId }) => onChange({ ...media, url, publicId })}
      />
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="space-y-2">
          <Label>Alt text</Label>
          <Input
            value={media?.alt || ""}
            onChange={(e) => onChange({ ...media, alt: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Caption</Label>
          <Input
            value={media?.caption || ""}
            onChange={(e) => onChange({ ...media, caption: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

export function JobMediaTab({ setValue, values }: Props) {
  const media = values.media || {};
  return (
    <FormSection title="Media" description="Cover imagery for listings and detail pages.">
      <MediaField
        label="Cover image"
        media={media.coverImage}
        onChange={(coverImage) => setValue("media", { ...media, coverImage })}
      />
      <MediaField
        label="Featured image"
        media={media.featuredImage}
        onChange={(featuredImage) => setValue("media", { ...media, featuredImage })}
      />
    </FormSection>
  );
}
