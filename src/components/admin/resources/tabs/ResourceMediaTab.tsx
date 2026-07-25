"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { Resource, ResourceMedia } from "@/types/resource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageKitUploadField } from "@/components/admin/media/ImageKitUploadField";
import { ImageKitGalleryField } from "@/components/admin/media/ImageKitGalleryField";

interface Props {
  setValue: UseFormSetValue<Partial<Resource>>;
  values: Partial<Resource>;
}

function MediaFields({
  label,
  folder,
  media,
  onChange,
}: {
  label: string;
  folder: string;
  media?: ResourceMedia | null;
  onChange: (next: ResourceMedia) => void;
}) {
  return (
    <Card>
      <CardHeader><CardTitle>{label}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <ImageKitUploadField
          label="Upload"
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
            <Label>Image URL</Label>
            <Input
              placeholder="https://ik.imagekit.io/..."
              value={media?.url || ""}
              onChange={(e) =>
                onChange({
                  ...media,
                  url: e.target.value,
                  publicId: e.target.value ? media?.publicId : null,
                })
              }
            />
          </div>
        </details>
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
        <div className="space-y-2">
          <Label>Credit</Label>
          <Input
            value={media?.credit || ""}
            onChange={(e) => onChange({ ...media, credit: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function ResourceMediaTab({ setValue, values }: Props) {
  const media = values.media || {};

  function updateMedia(
    key: "featuredImage" | "heroImage" | "coverImage",
    next: ResourceMedia
  ) {
    setValue("media", {
      ...media,
      [key]: next,
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <MediaFields
        label="Featured Image"
        folder="resources"
        media={media.featuredImage}
        onChange={(next) => updateMedia("featuredImage", next)}
      />
      <MediaFields
        label="Hero Image"
        folder="resources"
        media={media.heroImage}
        onChange={(next) => updateMedia("heroImage", next)}
      />
      <MediaFields
        label="Cover Image"
        folder="resources"
        media={media.coverImage}
        onChange={(next) => updateMedia("coverImage", next)}
      />
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Gallery</CardTitle></CardHeader>
        <CardContent>
          <ImageKitGalleryField
            label="Gallery images"
            folder="resources"
            values={values.gallery}
            onChange={(gallery) => setValue("gallery", gallery)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
