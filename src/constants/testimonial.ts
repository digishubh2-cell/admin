import type { BusinessType, CompanySize, TestimonialType } from "@/types/testimonial";

export const TESTIMONIAL_TYPES: { value: TestimonialType; label: string }[] = [
  { value: "client_testimonial", label: "Client Testimonial" },
  { value: "video_testimonial", label: "Video Testimonial" },
  { value: "google_review", label: "Google Review" },
  { value: "linkedin_recommendation", label: "LinkedIn Recommendation" },
  { value: "partner_review", label: "Partner Review" },
  { value: "employee_review", label: "Employee Review" },
  { value: "internship_testimonial", label: "Internship Testimonial" },
  { value: "founder_recommendation", label: "Founder Recommendation" },
  { value: "success_story", label: "Featured Success Story" },
];

export const COMPANY_SIZES: { value: CompanySize; label: string }[] = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "501-1000", label: "501–1,000 employees" },
  { value: "1000+", label: "1,000+ employees" },
];

export const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  { value: "startup", label: "Startup" },
  { value: "smb", label: "SMB" },
  { value: "enterprise", label: "Enterprise" },
  { value: "agency", label: "Agency" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "government", label: "Government" },
  { value: "freelancer", label: "Freelancer" },
  { value: "other", label: "Other" },
];

export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "ar", label: "Arabic" },
  { value: "pt", label: "Portuguese" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese" },
];

export const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Education",
  "Manufacturing",
  "Real Estate",
  "Marketing",
  "Consulting",
  "SaaS",
  "Media",
  "Logistics",
  "Hospitality",
  "Legal",
  "Other",
];

export function getTestimonialTypeLabel(type: TestimonialType): string {
  return TESTIMONIAL_TYPES.find((t) => t.value === type)?.label || type;
}
