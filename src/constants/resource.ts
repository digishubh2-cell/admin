import type { DifficultyLevel, ResourceType } from "@/types/resource";

export const RESOURCE_TYPES: { value: ResourceType; label: string }[] = [
  { value: "guide", label: "Guide" },
  { value: "documentation", label: "Documentation" },
  { value: "template", label: "Template" },
  { value: "checklist", label: "Checklist" },
  { value: "download", label: "Download" },
  { value: "whitepaper", label: "Whitepaper" },
  { value: "report", label: "Report" },
  { value: "research", label: "Research" },
  { value: "glossary", label: "Glossary" },
  { value: "faq", label: "FAQ" },
  { value: "tutorial", label: "Tutorial" },
  { value: "video", label: "Video" },
  { value: "api-documentation", label: "API Documentation" },
  { value: "starter-kit", label: "Starter Kit" },
  { value: "boilerplate", label: "Boilerplate" },
  { value: "component", label: "Component" },
  { value: "design-asset", label: "Design Asset" },
  { value: "icon", label: "Icon" },
  { value: "illustration", label: "Illustration" },
  { value: "brand-asset", label: "Brand Asset" },
  { value: "certificate", label: "Certificate" },
  { value: "release-notes", label: "Release Notes" },
  { value: "changelog", label: "Changelog" },
  { value: "developer-resource", label: "Developer Resource" },
  { value: "marketing-resource", label: "Marketing Resource" },
  { value: "business-resource", label: "Business Resource" },
  { value: "seo-resource", label: "SEO Resource" },
  { value: "ai-resource", label: "AI Resource" },
];

export const RESOURCE_CATEGORIES = [
  "Developer Resources",
  "Marketing Resources",
  "Business Resources",
  "SEO Resources",
  "AI Resources",
  "Design Resources",
  "Product Resources",
  "Operations",
];

export const DIFFICULTY_LEVELS: { value: DifficultyLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

export const DOWNLOAD_TYPES = [
  { value: "pdf", label: "PDF" },
  { value: "zip", label: "ZIP" },
  { value: "docx", label: "DOCX" },
  { value: "pptx", label: "PPTX" },
  { value: "xlsx", label: "XLSX" },
  { value: "code", label: "Code" },
  { value: "github", label: "GitHub" },
  { value: "figma", label: "Figma" },
  { value: "canva", label: "Canva" },
  { value: "external", label: "External Link" },
];

export function getResourceTypeLabel(type: string) {
  return RESOURCE_TYPES.find((t) => t.value === type)?.label || type;
}
