"use client";

/**
 * ImageKitUploadField — reusable admin drag-drop image uploader.
 *
 * Uploads go through POST /api/backend/media/upload (Express + ImageKit SDK).
 * Private key stays on the backend; this component never sees it.
 *
 * Pattern for content models that use { url, publicId }:
 *   <ImageKitUploadField
 *     folder="blogs"
 *     value={{ url: media?.url, publicId: media?.publicId }}
 *     onChange={(next) => setValue("featuredImage", { ...media, ...next })}
 *   />
 *
 * `publicId` stores ImageKit `fileId` (required for DELETE /media).
 * If a field only has a URL string, keep companion state: `imageUrl` + `imageFileId`.
 */

import { useCallback, useId, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { deleteMedia, uploadMedia } from "@/lib/api/media";

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml,image/avif";

export interface ImageKitMediaValue {
  url?: string | null;
  publicId?: string | null;
  /** Alias accepted when reading; writes always use publicId */
  fileId?: string | null;
}

interface ImageKitUploadFieldProps {
  label?: string;
  folder?: string;
  value?: ImageKitMediaValue | null;
  onChange: (value: { url: string | null; publicId: string | null }) => void;
  disabled?: boolean;
  className?: string;
  hint?: string;
  /** Override default 8MB limit */
  maxBytes?: number;
  /** Override accepted MIME types */
  accept?: string;
  /** Thumbnail object-fit (signatures often need contain) */
  previewFit?: "cover" | "contain";
  /** Override dropzone min-height class */
  dropzoneClassName?: string;
}

function resolveFileId(value?: ImageKitMediaValue | null) {
  return value?.publicId || value?.fileId || null;
}

export function ImageKitUploadField({
  label = "Image",
  folder = "general",
  value,
  onChange,
  disabled = false,
  className,
  hint = "JPEG, PNG, WebP, GIF up to 8MB",
  maxBytes = MAX_BYTES,
  accept = ACCEPT,
  previewFit = "cover",
  dropzoneClassName,
}: ImageKitUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const url = value?.url || null;
  const fileId = resolveFileId(value);
  const busy = uploading || deleting || disabled;
  const maxMbLabel = Math.max(1, Math.round(maxBytes / (1024 * 1024)));

  const processFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!file.type.startsWith("image/")) {
        setError("Please choose an image file");
        return;
      }
      if (file.size > maxBytes) {
        setError(`Image must be ${maxMbLabel}MB or smaller`);
        return;
      }

      setUploading(true);
      try {
        // Replace: delete previous ImageKit asset after successful new upload
        const previousId = resolveFileId(value);
        const result = await uploadMedia(file, { folder });
        onChange({
          url: result.url,
          publicId: result.publicId || result.fileId,
        });

        if (previousId && previousId !== (result.publicId || result.fileId)) {
          try {
            await deleteMedia(previousId);
          } catch {
            // Non-fatal — new image is already saved
          }
        }

        toast.success("Image uploaded");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        toast.error(message);
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [folder, maxBytes, maxMbLabel, onChange, value]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) void processFile(file);
    },
    [processFile]
  );

  const handleDelete = useCallback(async () => {
    setError(null);
    setDeleting(true);
    try {
      if (fileId) {
        await deleteMedia(fileId);
      }
      onChange({ url: null, publicId: null });
      toast.success("Image removed");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed";
      setError(message);
      toast.error(message);
    } finally {
      setDeleting(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [fileId, onChange]);

  return (
    <div className={cn("space-y-2", className)}>
      {label ? <Label htmlFor={inputId}>{label}</Label> : null}

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
          if (!busy) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => {
          if (!busy) inputRef.current?.click();
        }}
        className={cn(
          "relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-admin-border bg-admin-surface transition-colors",
          dropzoneClassName,
          dragging && "border-primary bg-primary/5",
          busy && "pointer-events-none opacity-70",
          error && "border-danger/50"
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          className="sr-only"
          disabled={busy}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="Upload preview"
            className={cn(
              "absolute inset-0 h-full w-full",
              previewFit === "contain"
                ? "object-contain bg-white p-3"
                : "object-cover"
            )}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-admin-border bg-admin-muted/40 text-admin-text-secondary">
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ImagePlus className="h-5 w-5" />
              )}
            </div>
            <p className="text-sm font-medium text-admin-text">
              {uploading ? "Uploading…" : "Drop an image here, or click to browse"}
            </p>
            <p className="text-xs text-admin-text-muted">{hint}</p>
          </div>
        )}

        {url && (
          <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition-opacity hover:opacity-100 focus-within:opacity-100">
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={busy}
                onClick={() => inputRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Replace
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                disabled={busy}
                onClick={() => void handleDelete()}
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
        )}

        {uploading && url && (
          <div className="absolute inset-0 flex items-center justify-center bg-admin-surface/70">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>

      {error ? <p className="text-xs text-danger">{error}</p> : null}

      {url && !fileId ? (
        <p className="text-xs text-admin-text-muted">
          URL only (no ImageKit file id) — delete clears the field but skips CDN delete.
        </p>
      ) : null}
    </div>
  );
}
