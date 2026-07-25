"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { Job } from "@/types/job";
import {
  FormSection,
  StringListEditor,
  TextAreaField,
} from "@/components/admin/case-studies/forms/FormHelpers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  setValue: UseFormSetValue<Partial<Job>>;
  values: Partial<Job>;
}

export function JobSeoTab({ setValue, values }: Props) {
  const seo = values.seo || {};
  const aiSeo = values.aiSeo || {};

  return (
    <div className="grid gap-4">
      <FormSection title="Meta SEO">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 lg:col-span-2">
            <Label>Meta title</Label>
            <Input
              value={seo.metaTitle || ""}
              onChange={(e) => setValue("seo", { ...seo, metaTitle: e.target.value })}
              maxLength={70}
            />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label>Meta description</Label>
            <Input
              value={seo.metaDescription || ""}
              onChange={(e) =>
                setValue("seo", { ...seo, metaDescription: e.target.value })
              }
              maxLength={320}
            />
          </div>
          <div className="space-y-2">
            <Label>Focus keyword</Label>
            <Input
              value={seo.focusKeyword || ""}
              onChange={(e) =>
                setValue("seo", { ...seo, focusKeyword: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Canonical URL</Label>
            <Input
              value={seo.canonicalUrl || ""}
              onChange={(e) =>
                setValue("seo", { ...seo, canonicalUrl: e.target.value })
              }
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="AI SEO helpers">
        <TextAreaField
          label="Summary"
          value={aiSeo.summary}
          onChange={(v) => setValue("aiSeo", { ...aiSeo, summary: v })}
          rows={4}
        />
        <StringListEditor
          label="Key takeaways"
          items={aiSeo.keyTakeaways || []}
          onChange={(items) => setValue("aiSeo", { ...aiSeo, keyTakeaways: items })}
        />
      </FormSection>
    </div>
  );
}
