"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { CaseStudy } from "@/types/case-study";
import { FormSection, StringListEditor, TextAreaField } from "../forms/FormHelpers";

interface Props {
  setValue: UseFormSetValue<Partial<CaseStudy>>;
  values: Partial<CaseStudy>;
}

export function CaseStudyStoryTab({ setValue, values }: Props) {
  const business = values.business || {};
  const challenges = values.challenges || {};
  const research = values.research || {};
  const planning = values.planning || {};

  const updateBusiness = (patch: Partial<typeof business>) =>
    setValue("business", { ...business, ...patch });
  const updateChallenges = (patch: Partial<typeof challenges>) =>
    setValue("challenges", { ...challenges, ...patch });
  const updateResearch = (key: string, val: string) =>
    setValue("research", { ...research, [key]: val });
  const updatePlanning = (key: string, val: string) =>
    setValue("planning", { ...planning, [key]: val });

  return (
    <div className="grid gap-4">
      <FormSection title="Business Context" description="Client background, goals, and success criteria.">
        <TextAreaField label="Client Background" value={business.clientBackground} onChange={(v) => updateBusiness({ clientBackground: v })} rows={4} />
        <TextAreaField label="Target Audience" value={business.targetAudience} onChange={(v) => updateBusiness({ targetAudience: v })} />
        <StringListEditor label="Business Goals" items={business.businessGoals || []} onChange={(items) => updateBusiness({ businessGoals: items })} />
        <StringListEditor label="Business Problems" items={business.businessProblems || []} onChange={(items) => updateBusiness({ businessProblems: items })} />
        <StringListEditor label="Requirements" items={business.requirements || []} onChange={(items) => updateBusiness({ requirements: items })} />
        <StringListEditor label="Success Criteria" items={business.successCriteria || []} onChange={(items) => updateBusiness({ successCriteria: items })} />
      </FormSection>

      <FormSection title="Challenges" description="Problems faced across business, technical, and SEO dimensions.">
        <StringListEditor label="Core Problems" items={challenges.problems || []} onChange={(items) => updateChallenges({ problems: items })} />
        <StringListEditor label="Technical Challenges" items={challenges.technical || []} onChange={(items) => updateChallenges({ technical: items })} />
        <StringListEditor label="Business Challenges" items={challenges.business || []} onChange={(items) => updateChallenges({ business: items })} />
        <StringListEditor label="SEO Challenges" items={challenges.seo || []} onChange={(items) => updateChallenges({ seo: items })} />
        <StringListEditor label="Performance Challenges" items={challenges.performance || []} onChange={(items) => updateChallenges({ performance: items })} />
        <StringListEditor label="Security Challenges" items={challenges.security || []} onChange={(items) => updateChallenges({ security: items })} />
        <StringListEditor label="Scalability Challenges" items={challenges.scalability || []} onChange={(items) => updateChallenges({ scalability: items })} />
      </FormSection>

      <FormSection title="Research" description="Discovery and audit findings.">
        <TextAreaField label="Competitor Analysis" value={research.competitorAnalysis as string} onChange={(v) => updateResearch("competitorAnalysis", v)} />
        <TextAreaField label="Market Research" value={research.marketResearch as string} onChange={(v) => updateResearch("marketResearch", v)} />
        <TextAreaField label="User Research" value={research.userResearch as string} onChange={(v) => updateResearch("userResearch", v)} />
        <TextAreaField label="Keyword Research" value={research.keywordResearch as string} onChange={(v) => updateResearch("keywordResearch", v)} />
        <TextAreaField label="Content Strategy" value={research.contentStrategy as string} onChange={(v) => updateResearch("contentStrategy", v)} />
        <TextAreaField label="Technical Audit" value={research.technicalAudit as string} onChange={(v) => updateResearch("technicalAudit", v)} />
      </FormSection>

      <FormSection title="Planning" description="Architecture, sitemap, and delivery roadmap.">
        <TextAreaField label="Architecture" value={planning.architecture as string} onChange={(v) => updatePlanning("architecture", v)} />
        <TextAreaField label="Wireframes" value={planning.wireframes as string} onChange={(v) => updatePlanning("wireframes", v)} />
        <TextAreaField label="Sitemap" value={planning.sitemap as string} onChange={(v) => updatePlanning("sitemap", v)} />
        <TextAreaField label="Database Planning" value={planning.databasePlanning as string} onChange={(v) => updatePlanning("databasePlanning", v)} />
        <TextAreaField label="API Planning" value={planning.apiPlanning as string} onChange={(v) => updatePlanning("apiPlanning", v)} />
        <TextAreaField label="SEO Planning" value={planning.seoPlanning as string} onChange={(v) => updatePlanning("seoPlanning", v)} />
        <TextAreaField label="Timeline" value={planning.timeline as string} onChange={(v) => updatePlanning("timeline", v)} />
      </FormSection>
    </div>
  );
}
