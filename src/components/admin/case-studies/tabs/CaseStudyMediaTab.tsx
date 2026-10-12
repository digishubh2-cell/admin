"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { CaseStudy, CaseStudyMedia } from "@/types/case-study";
import { FormSection } from "../forms/FormHelpers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageKitUploadField } from "@/components/admin/media/ImageKitUploadField";
import { ImageKitGalleryField } from "@/components/admin/media/ImageKitGalleryField";
import { CaseStudyResourcesFields } from "./CaseStudyResourcesFields";

interface Props {
  setValue: UseFormSetValue<Partial<CaseStudy>>;
  values: Partial<CaseStudy>;
}

function MediaField({
  label,
  folder,
  media,
  onChange,
}: {
  label: string;
  folder: string;
  media?: CaseStudyMedia | null;
  onChange: (m: CaseStudyMedia) => void;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-admin-border p-4">
      <ImageKitUploadField
        retainAssets
        label={label}
        folder={folder}
        value={media}
        onChange={({ url, publicId }) =>
          onChange({ ...media, url, publicId })
        }
      />
      <details className="rounded-lg border border-admin-border px-3 py-2">
        <summary className="cursor-pointer text-xs font-medium text-admin-text-secondary">
          Advanced — paste URL
        </summary>
        <div className="mt-2 space-y-2">
          <Label>{label} URL</Label>
          <Input
            value={media?.url || ""}
            onChange={(e) =>
              onChange({
                ...media,
                url: e.target.value,
                publicId: e.target.value === media?.url ? media?.publicId : null,
              })
            }
            placeholder="https://ik.imagekit.io/..."
          />
        </div>
      </details>
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="space-y-2">
          <Label>Alt Text</Label>
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

const GALLERY_BUCKETS: {
  key: keyof NonNullable<CaseStudy["gallery"]>;
  label: string;
}[] = [
  { key: "screenshots", label: "Screenshots" },
  { key: "dashboard", label: "Dashboard" },
  { key: "mobile", label: "Mobile" },
  { key: "desktop", label: "Desktop" },
  { key: "beforeAfter", label: "Before / After" },
];

export function CaseStudyMediaTab({ setValue, values }: Props) {
  const media = values.media || {};
  const gallery = values.gallery || {};

  return (
    <div className="grid gap-4">
      <FormSection title="Primary Media" description="Featured, hero, and cover images.">
        <MediaField
          label="Featured Image"
          folder="case-studies"
          media={media.featuredImage}
          onChange={(m) => setValue("media", { ...media, featuredImage: m })}
        />
        <MediaField
          label="Hero Image"
          folder="case-studies"
          media={media.heroImage}
          onChange={(m) => setValue("media", { ...media, heroImage: m })}
        />
        <MediaField
          label="Cover Image"
          folder="case-studies"
          media={media.coverImage}
          onChange={(m) => setValue("media", { ...media, coverImage: m })}
        />
      </FormSection>

      <FormSection
        title="Gallery"
        description="Upload screenshots and visual sets for the public gallery."
      >
        <div className="grid gap-6">
          {GALLERY_BUCKETS.map(({ key, label }) => (
            <ImageKitGalleryField
              retainAssets
              key={key}
              label={label}
              folder="case-studies"
              values={gallery[key] || []}
              onChange={(items) =>
                setValue("gallery", {
                  ...gallery,
                  [key]: items,
                })
              }
            />
          ))}
        </div>
      </FormSection>
      <CaseStudyResourcesFields values={values} setValue={setValue} />
    </div>
  );
}
