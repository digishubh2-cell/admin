"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { CaseStudy, CaseStudyMedia, CaseStudyDownload } from "@/types/case-study";
import { FormSection } from "../forms/FormHelpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CaseStudyResourcesFields({ values, setValue }: {
  values: Partial<CaseStudy>;
  setValue: UseFormSetValue<Partial<CaseStudy>>;
}) {
  const videos = values.gallery?.videos ?? [];
  const downloads = values.downloads ?? [];
  const setVideos = (items: CaseStudyMedia[]) => setValue("gallery", { ...values.gallery, videos: items }, { shouldDirty: true });
  const setDownloads = (items: CaseStudyDownload[]) => setValue("downloads", items, { shouldDirty: true });
  const updateVideo = (index: number, patch: Partial<CaseStudyMedia>) => setVideos(videos.map((item, i) => i === index ? { ...item, ...patch } : item));
  const updateDownload = (index: number, patch: Partial<CaseStudyDownload>) => setDownloads(downloads.map((item, i) => i === index ? { ...item, ...patch } : item));

  return <>
    <FormSection title="Project videos" description="Use a direct HTTPS media URL. Poster, title and upload date support VideoObject structured data. Removing an entry only removes it from this case study.">
      {videos.map((video, index) => <div key={index} className="space-y-3 rounded-xl border border-admin-border p-4">
        {([
          ["url", "Video URL"], ["title", "Video title"], ["caption", "Description"],
          ["thumbnailUrl", "Poster image URL"], ["uploadDate", "Upload date (ISO 8601, with timezone)"], ["type", "MIME type, e.g. video/mp4"],
        ] as const).map(([key, label]) => <label key={key} className="block space-y-1 text-sm"><span>{label}</span><Input value={video[key] || ""} onChange={(e) => updateVideo(index, { [key]: e.target.value || null })} /></label>)}
        <label className="block space-y-1 text-sm"><span>Duration in seconds</span><Input type="number" min="0.1" step="0.1" value={video.durationSeconds ?? ""} onChange={(e) => updateVideo(index, { durationSeconds: e.target.value ? Number(e.target.value) : null })} /></label>
        <label className="block space-y-1 text-sm"><span>Transcript or visual walkthrough</span><textarea className="min-h-28 w-full rounded-md border border-admin-border bg-transparent p-3" value={video.transcript || ""} onChange={(e) => updateVideo(index, { transcript: e.target.value })} /></label>
        <Button type="button" variant="outline" onClick={() => setVideos(videos.filter((_, i) => i !== index))}>Remove video entry</Button>
      </div>)}
      <Button type="button" variant="outline" onClick={() => setVideos([...videos, { type: "video/mp4" }])}>Add video</Button>
    </FormSection>
    <FormSection title="Project downloads" description="Link published files such as PDFs or an Android APK. Include compatibility information for installable files.">
      {downloads.map((item, index) => <div key={index} className="space-y-3 rounded-xl border border-admin-border p-4">
        {([
          ["title", "Title"], ["url", "HTTPS download URL"], ["type", "File type"], ["fileSize", "File size"],
          ["description", "Description"], ["version", "Version"], ["minimumOs", "Minimum operating system"], ["sha256", "SHA-256 checksum"],
        ] as const).map(([key, label]) => <label key={key} className="block space-y-1 text-sm"><span>{label}</span><Input value={item[key] || ""} onChange={(e) => updateDownload(index, { [key]: key === "title" ? e.target.value : e.target.value || null })} /></label>)}
        <Button type="button" variant="outline" onClick={() => setDownloads(downloads.filter((_, i) => i !== index))}>Remove download entry</Button>
      </div>)}
      <Button type="button" variant="outline" onClick={() => setDownloads([...downloads, { title: "" }])}>Add download</Button>
    </FormSection>
  </>;
}
