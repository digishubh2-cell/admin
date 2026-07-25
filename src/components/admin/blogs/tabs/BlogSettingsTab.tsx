"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { BlogPost } from "@/types/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  setValue: UseFormSetValue<Partial<BlogPost>>;
  values: Partial<BlogPost>;
}

const settingsList = [
  { key: "comments", label: "Enable Comments" },
  { key: "enableIndexing", label: "Enable Indexing" },
  { key: "enableAds", label: "Enable Ads" },
  { key: "enableNewsletter", label: "Enable Newsletter" },
  { key: "allowSharing", label: "Allow Sharing" },
  { key: "allowDownload", label: "Allow Download" },
  { key: "allowTranslation", label: "Allow Translation" },
  { key: "showToc", label: "Show Table of Contents" },
  { key: "enableReadingProgress", label: "Reading Progress Bar" },
  { key: "showAuthor", label: "Show Author" },
  { key: "showUpdatedDate", label: "Show Updated Date" },
] as const;

export function BlogSettingsTab({ setValue, values }: Props) {
  const settings = values.settings || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post Settings</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {settingsList.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={!!settings[key]}
              onCheckedChange={(c) =>
                setValue("settings", { ...settings, [key]: c === true })
              }
            />
            {label}
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
