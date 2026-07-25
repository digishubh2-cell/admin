"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { CaseStudy } from "@/types/case-study";
import { FormSection, StringListEditor, TextAreaField } from "../forms/FormHelpers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  setValue: UseFormSetValue<Partial<CaseStudy>>;
  values: Partial<CaseStudy>;
}

export function CaseStudyExecutionTab({ setValue, values }: Props) {
  const design = values.design || {};
  const development = values.development || {};
  const technology = values.technology || { stack: [], custom: [] };

  const updateDesign = (key: string, val: string) => setValue("design", { ...design, [key]: val });
  const updateDev = (key: string, val: string | string[]) => setValue("development", { ...development, [key]: val });

  return (
    <div className="grid gap-4">
      <FormSection title="Design" description="Brand, UI system, and accessibility decisions.">
        <TextAreaField label="Brand Identity" value={design.brandIdentity as string} onChange={(v) => updateDesign("brandIdentity", v)} />
        <TextAreaField label="Typography" value={design.typography as string} onChange={(v) => updateDesign("typography", v)} />
        <TextAreaField label="Color Palette" value={design.colorPalette as string} onChange={(v) => updateDesign("colorPalette", v)} />
        <TextAreaField label="UI Components" value={design.uiComponents as string} onChange={(v) => updateDesign("uiComponents", v)} />
        <TextAreaField label="Responsive Strategy" value={design.responsiveStrategy as string} onChange={(v) => updateDesign("responsiveStrategy", v)} />
        <TextAreaField label="Accessibility" value={design.accessibility as string} onChange={(v) => updateDesign("accessibility", v)} />
        <StringListEditor label="Design Decisions" items={(design.designDecisions as string[]) || []} onChange={(items) => setValue("design", { ...design, designDecisions: items })} />
      </FormSection>

      <FormSection title="Development" description="Technical stack and implementation details.">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2"><Label>Frontend Stack</Label><Input value={development.frontendStack as string || ""} onChange={(e) => updateDev("frontendStack", e.target.value)} /></div>
          <div className="space-y-2"><Label>Backend Stack</Label><Input value={development.backendStack as string || ""} onChange={(e) => updateDev("backendStack", e.target.value)} /></div>
          <div className="space-y-2"><Label>Database</Label><Input value={development.database as string || ""} onChange={(e) => updateDev("database", e.target.value)} /></div>
          <div className="space-y-2"><Label>Authentication</Label><Input value={development.authentication as string || ""} onChange={(e) => updateDev("authentication", e.target.value)} /></div>
          <div className="space-y-2"><Label>Admin Panel</Label><Input value={development.adminPanel as string || ""} onChange={(e) => updateDev("adminPanel", e.target.value)} /></div>
          <div className="space-y-2"><Label>API</Label><Input value={development.api as string || ""} onChange={(e) => updateDev("api", e.target.value)} /></div>
          <div className="space-y-2"><Label>Cloudinary</Label><Input value={development.cloudinary as string || ""} onChange={(e) => updateDev("cloudinary", e.target.value)} /></div>
          <div className="space-y-2"><Label>Deployment</Label><Input value={development.deployment as string || ""} onChange={(e) => updateDev("deployment", e.target.value)} /></div>
        </div>
        <StringListEditor label="Third-party Integrations" items={(development.integrations as string[]) || []} onChange={(items) => updateDev("integrations", items)} />
        <TextAreaField label="Development Notes" value={development.notes as string} onChange={(v) => updateDev("notes", v)} />
      </FormSection>

      <FormSection title="Technology Stack" description="Technologies used in this project.">
        <StringListEditor label="Stack" items={technology.stack || []} onChange={(items) => setValue("technology", { ...technology, stack: items })} placeholder="Next.js, MongoDB..." />
        <StringListEditor label="Custom Technologies" items={technology.custom || []} onChange={(items) => setValue("technology", { ...technology, custom: items })} />
      </FormSection>
    </div>
  );
}
