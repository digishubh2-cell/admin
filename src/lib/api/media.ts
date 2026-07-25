import { apiClient } from "./client";

/**
 * ImageKit media API helpers (server-side upload via Express).
 *
 * Usage:
 *   const file = await uploadMedia(blob, { folder: "blogs" });
 *   // persist { url: file.url, publicId: file.publicId } on the content model
 *   await deleteMedia(file.publicId);
 *
 * Folder becomes: shubhdigi/admin/{folder}/ on ImageKit.
 * `publicId` is the ImageKit `fileId` — required for delete.
 */

export interface MediaUploadResult {
  url: string | null;
  fileId: string | null;
  publicId: string | null;
  name: string | null;
  filePath: string | null;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  size: number | null;
  fileType: string | null;
}

interface MediaApiResponse {
  success: boolean;
  message?: string;
  file?: MediaUploadResult;
  url?: string | null;
  fileId?: string | null;
  publicId?: string | null;
  name?: string | null;
}

export async function uploadMedia(
  file: File,
  options: { folder?: string } = {}
): Promise<MediaUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  if (options.folder) {
    formData.append("folder", options.folder);
  }

  const { data } = await apiClient.post<MediaApiResponse>("/media/upload", formData, {
    // Browser axios strips this for FormData so the multipart boundary is set correctly
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!data.success) {
    throw new Error(data.message || "Upload failed");
  }

  return (
    data.file || {
      url: data.url ?? null,
      fileId: data.fileId ?? null,
      publicId: data.publicId ?? data.fileId ?? null,
      name: data.name ?? null,
      filePath: null,
      thumbnailUrl: null,
      width: null,
      height: null,
      size: null,
      fileType: null,
    }
  );
}

export async function deleteMedia(fileId: string): Promise<void> {
  const { data } = await apiClient.delete<MediaApiResponse>("/media", {
    data: { fileId, publicId: fileId },
  });

  if (!data.success) {
    throw new Error(data.message || "Delete failed");
  }
}
