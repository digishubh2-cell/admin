"use client";

import type { Job } from "@/types/job";
import { FormSection } from "@/components/admin/case-studies/forms/FormHelpers";
import { Badge } from "@/components/ui/badge";

export function JobPreviewTab({ values }: { values: Partial<Job> }) {
  return (
    <FormSection title="Preview" description="Quick read of how this posting will look.">
      <div className="space-y-4 rounded-2xl border border-admin-border bg-admin-muted/20 p-6">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="capitalize">
            {values.type || "job"}
          </Badge>
          {values.mode ? (
            <Badge variant="outline" className="capitalize">
              {values.mode}
            </Badge>
          ) : null}
          {values.department ? <Badge variant="outline">{values.department}</Badge> : null}
        </div>
        <h2 className="text-2xl font-semibold">{values.title || "Untitled role"}</h2>
        <p className="text-sm text-admin-text-secondary">
          {[values.location, values.employmentType].filter(Boolean).join(" · ") ||
            "Location and employment type not set"}
        </p>
        {values.type === "internship" ? (
          <p className="text-sm text-admin-text-muted">
            {[values.programLabel, values.duration, values.stipend]
              .filter(Boolean)
              .join(" · ")}
          </p>
        ) : null}
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-admin-text-secondary">
          {values.description || "No description yet."}
        </p>
        {(values.skills || []).length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {values.skills!.filter(Boolean).map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </FormSection>
  );
}
