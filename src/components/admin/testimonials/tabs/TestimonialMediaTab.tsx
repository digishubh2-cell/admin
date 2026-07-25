"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { Testimonial, TestimonialMedia } from "@/types/testimonial";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageKitUploadField } from "@/components/admin/media/ImageKitUploadField";
import { ImageKitGalleryField } from "@/components/admin/media/ImageKitGalleryField";

interface Props {
  setValue: UseFormSetValue<Partial<Testimonial>>;
  values: Partial<Testimonial>;
}

function MediaFields({
  label,
  folder,
  media,
  onChange,
}: {
  label: string;
  folder: string;
  media?: TestimonialMedia | null;
  onChange: (next: TestimonialMedia) => void;
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
      </CardContent>
    </Card>
  );
}

export function TestimonialMediaTab({ setValue, values }: Props) {
  const media = values.media || {};

  function updateMedia(
    key: "profileImage" | "companyLogo" | "coverImage",
    next: TestimonialMedia
  ) {
    setValue("media", {
      ...media,
      [key]: next,
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <MediaFields
        label="Profile Photo"
        folder="testimonials"
        media={media.profileImage}
        onChange={(next) => updateMedia("profileImage", next)}
      />
      <MediaFields
        label="Company Logo"
        folder="testimonials"
        media={media.companyLogo}
        onChange={(next) => updateMedia("companyLogo", next)}
      />
      <MediaFields
        label="Cover Image"
        folder="testimonials"
        media={media.coverImage}
        onChange={(next) => updateMedia("coverImage", next)}
      />

      <Card>
        <CardHeader><CardTitle>Video Upload URL</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-admin-text-muted">
            External or ImageKit video URL (image uploader does not accept video files).
          </p>
          <div className="space-y-2">
            <Label>Video URL</Label>
            <Input
              placeholder="https://..."
              value={media.video?.url || ""}
              onChange={(e) =>
                setValue("media", {
                  ...media,
                  video: { ...media.video, url: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Video file id (optional)</Label>
            <Input
              placeholder="ImageKit fileId for delete support"
              value={media.video?.publicId || ""}
              onChange={(e) =>
                setValue("media", {
                  ...media,
                  video: { ...media.video, publicId: e.target.value },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>YouTube URL</CardTitle></CardHeader>
        <CardContent>
          <Input
            placeholder="https://youtube.com/watch?v=..."
            value={media.youtubeUrl || ""}
            onChange={(e) => setValue("media", { ...media, youtubeUrl: e.target.value })}
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Gallery (optional)</CardTitle></CardHeader>
        <CardContent>
          <ImageKitGalleryField
            label="Gallery images"
            folder="testimonials"
            values={values.gallery}
            onChange={(gallery) => setValue("gallery", gallery)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
