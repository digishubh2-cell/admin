"use client";

/**
 * SeoImageUploadField — ImageKit uploader for string SEO fields (ogImage / twitterImage).
 * Persists only the CDN URL (schema stays string); fileId is held in-session for delete.
 */

import { useState } from "react";
import { ImageKitUploadField } from "./ImageKitUploadField";

interface SeoImageUploadFieldProps {
  label?: string;
  folder?: string;
  url?: string | null;
  onUrlChange: (url: string | null) => void;
  disabled?: boolean;
  className?: string;
  hint?: string;
  retainAssets?: boolean;
}

export function SeoImageUploadField({
  label = "Social Image",
  folder = "seo",
  url,
  onUrlChange,
  disabled,
  className,
  hint,
  retainAssets,
}: SeoImageUploadFieldProps) {
  const [uploaded, setUploaded] = useState<{ url: string | null; publicId: string | null } | null>(null);
  // A manually changed URL must never inherit an unrelated file's delete ID.
  const fileId = uploaded?.url === url ? uploaded?.publicId : null;

  return (
    <ImageKitUploadField
      retainAssets={retainAssets}
      label={label}
      folder={folder}
      value={{ url, publicId: fileId }}
      disabled={disabled}
      className={className}
      hint={hint}
      onChange={({ url: nextUrl, publicId }) => {
        setUploaded({ url: nextUrl, publicId });
        onUrlChange(nextUrl);
      }}
    />
  );
}
