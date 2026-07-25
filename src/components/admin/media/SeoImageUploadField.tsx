"use client";

/**
 * SeoImageUploadField — ImageKit uploader for string SEO fields (ogImage / twitterImage).
 * Persists only the CDN URL (schema stays string); fileId is held in-session for delete.
 */

import { useEffect, useState } from "react";
import { ImageKitUploadField } from "./ImageKitUploadField";

interface SeoImageUploadFieldProps {
  label?: string;
  folder?: string;
  url?: string | null;
  onUrlChange: (url: string | null) => void;
  disabled?: boolean;
  className?: string;
  hint?: string;
}

export function SeoImageUploadField({
  label = "Social Image",
  folder = "seo",
  url,
  onUrlChange,
  disabled,
  className,
  hint,
}: SeoImageUploadFieldProps) {
  const [fileId, setFileId] = useState<string | null>(null);

  useEffect(() => {
    if (!url) setFileId(null);
  }, [url]);

  return (
    <ImageKitUploadField
      label={label}
      folder={folder}
      value={{ url, publicId: fileId }}
      disabled={disabled}
      className={className}
      hint={hint}
      onChange={({ url: nextUrl, publicId }) => {
        setFileId(publicId);
        onUrlChange(nextUrl);
      }}
    />
  );
}
