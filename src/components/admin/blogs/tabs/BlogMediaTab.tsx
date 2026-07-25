"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { BlogPost } from "@/types/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageKitUploadField } from "@/components/admin/media/ImageKitUploadField";
import { ImageKitGalleryField } from "@/components/admin/media/ImageKitGalleryField";

interface Props {
  setValue: UseFormSetValue<Partial<BlogPost>>;
  values: Partial<BlogPost>;
}

export function BlogMediaTab({ setValue, values }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Featured Image</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <ImageKitUploadField
            label="Upload"
            folder="blogs"
            value={values.featuredImage}
            onChange={({ url, publicId }) =>
              setValue("featuredImage", {
                ...values.featuredImage,
                url,
                publicId,
              })
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
                value={values.featuredImage?.url || ""}
                onChange={(e) =>
                  setValue("featuredImage", {
                    ...values.featuredImage,
                    url: e.target.value,
                    publicId: e.target.value ? values.featuredImage?.publicId : null,
                  })
                }
              />
            </div>
          </details>
          <div className="space-y-2">
            <Label>Alt Text</Label>
            <Input
              value={values.featuredImage?.alt || ""}
              onChange={(e) =>
                setValue("featuredImage", {
                  ...values.featuredImage,
                  alt: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Caption</Label>
            <Input
              value={values.featuredImage?.caption || ""}
              onChange={(e) =>
                setValue("featuredImage", {
                  ...values.featuredImage,
                  caption: e.target.value,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Cover Image</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <ImageKitUploadField
            label="Upload"
            folder="blogs"
            value={values.coverImage}
            onChange={({ url, publicId }) =>
              setValue("coverImage", {
                ...values.coverImage,
                url,
                publicId,
              })
            }
          />
          <details className="rounded-lg border border-admin-border px-3 py-2">
            <summary className="cursor-pointer text-xs font-medium text-admin-text-secondary">
              Advanced — paste URL
            </summary>
            <div className="mt-2 space-y-2">
              <Label>Cover URL</Label>
              <Input
                placeholder="https://ik.imagekit.io/..."
                value={values.coverImage?.url || ""}
                onChange={(e) =>
                  setValue("coverImage", {
                    ...values.coverImage,
                    url: e.target.value,
                    publicId: e.target.value ? values.coverImage?.publicId : null,
                  })
                }
              />
            </div>
          </details>
          <div className="space-y-2">
            <Label>Image Credits</Label>
            <Input
              value={values.coverImage?.credit || ""}
              onChange={(e) =>
                setValue("coverImage", {
                  ...values.coverImage,
                  credit: e.target.value,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Gallery</CardTitle></CardHeader>
        <CardContent>
          <ImageKitGalleryField
            label="Gallery images"
            folder="blogs"
            values={values.gallery}
            onChange={(gallery) => setValue("gallery", gallery)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
