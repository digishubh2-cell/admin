"use client";

/**
 * ImageKitGalleryField — multi-image drag-drop uploader for admin galleries.
 * Each item stores { url, publicId } (publicId = ImageKit fileId for delete).
 */

import { useCallback, useId, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { deleteMedia, uploadMedia } from "@/lib/api/media";
import type { ImageKitMediaValue } from "./ImageKitUploadField";

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml,image/avif";

export type GalleryMediaItem = ImageKitMediaValue & {
  alt?: string | null;
  caption?: string | null;
  credit?: string | null;
};

interface ImageKitGalleryFieldProps {
  label?: string;
  folder?: string;
  values?: GalleryMediaItem[] | null;
  onChange: (values: GalleryMediaItem[]) => void;
  disabled?: boolean;
  className?: string;
  hint?: string;
}

function resolveFileId(item?: ImageKitMediaValue | null) {
  return item?.publicId || item?.fileId || null;
}

export function ImageKitGalleryField({
  label = "Gallery",
  folder = "general",
  values,
  onChange,
  disabled = false,
  className,
  hint = "JPEG, PNG, WebP, GIF up to 8MB each — drop multiple images",
}: ImageKitGalleryFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const items = values || [];
  const busy = uploading || deletingIndex !== null || disabled;

  const processFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      setError(null);

      const valid: File[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          setError("Only image files are allowed");
          continue;
        }
        if (file.size > MAX_BYTES) {
          setError(`${file.name} is larger than 8MB`);
          continue;
        }
        valid.push(file);
      }
      if (!valid.length) return;

      setUploading(true);
      const uploaded: GalleryMediaItem[] = [];
      try {
        for (const file of valid) {
          const result = await uploadMedia(file, { folder });
          uploaded.push({
            url: result.url,
            publicId: result.publicId || result.fileId,
          });
        }
        onChange([...items, ...uploaded]);
        toast.success(
          uploaded.length === 1 ? "Image added to gallery" : `${uploaded.length} images added`
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        toast.error(message);
        if (uploaded.length) onChange([...items, ...uploaded]);
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [folder, items, onChange]
  );

  const handleDelete = useCallback(
    async (index: number) => {
      const item = items[index];
      if (!item) return;
      setError(null);
      setDeletingIndex(index);
      try {
        const fileId = resolveFileId(item);
        if (fileId) {
          await deleteMedia(fileId);
        }
        onChange(items.filter((_, i) => i !== index));
        toast.success("Image removed");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Delete failed";
        setError(message);
        toast.error(message);
      } finally {
        setDeletingIndex(null);
      }
    },
    [items, onChange]
  );

  return (
    <div className={cn("space-y-3", className)}>
      {label ? <Label htmlFor={inputId}>{label}</Label> : null}

      {items.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const url = item.url || null;
            const deleting = deletingIndex === index;
            return (
              <div
                key={`${url || "empty"}-${resolveFileId(item) || index}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-admin-border bg-admin-surface"
              >
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt={item.alt || `Gallery ${index + 1}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-admin-text-muted">
                    No URL
                  </div>
                )}
                <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={busy}
                    onClick={() => void handleDelete(index)}
                  >
                    {deleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <div
        role="button"
        tabIndex={busy ? -1 : 0}
        onKeyDown={(e) => {
          if (busy) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!busy) setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!busy) setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragging(false);
          if (!busy) void processFiles(e.dataTransfer.files);
        }}
        onClick={() => {
          if (!busy) inputRef.current?.click();
        }}
        className={cn(
          "relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-admin-border bg-admin-surface transition-colors",
          dragging && "border-primary bg-primary/5",
          busy && "pointer-events-none opacity-70",
          error && "border-danger/50"
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          disabled={busy}
          onChange={(e) => void processFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-admin-border bg-admin-muted/40 text-admin-text-secondary">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : items.length ? (
              <Upload className="h-5 w-5" />
            ) : (
              <ImagePlus className="h-5 w-5" />
            )}
          </div>
          <p className="text-sm font-medium text-admin-text">
            {uploading
              ? "Uploading…"
              : items.length
                ? "Drop more images, or click to add"
                : "Drop images here, or click to browse"}
          </p>
          <p className="text-xs text-admin-text-muted">{hint}</p>
        </div>
      </div>

      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
