export type ResourceStatus =
  | "draft"
  | "review"
  | "approved"
  | "scheduled"
  | "published"
  | "archived";

export type ResourceVisibility = "public" | "private" | "password";
export type ContentFormat = "markdown" | "mdx" | "html";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type ResourceType =
  | "guide"
  | "documentation"
  | "template"
  | "checklist"
  | "download"
  | "whitepaper"
  | "report"
  | "research"
  | "glossary"
  | "faq"
  | "tutorial"
  | "video"
  | "api-documentation"
  | "starter-kit"
  | "boilerplate"
  | "component"
  | "design-asset"
  | "icon"
  | "illustration"
  | "brand-asset"
  | "certificate"
  | "release-notes"
  | "changelog"
  | "developer-resource"
  | "marketing-resource"
  | "business-resource"
  | "seo-resource"
  | "ai-resource";

export type DownloadType =
  | "pdf"
  | "zip"
  | "docx"
  | "pptx"
  | "xlsx"
  | "code"
  | "github"
  | "figma"
  | "canva"
  | "external";

export interface ResourceMedia {
  url?: string | null;
  publicId?: string | null;
  alt?: string | null;
  caption?: string | null;
  credit?: string | null;
}

export interface ResourceDownload {
  title: string;
  url?: string | null;
  type?: DownloadType | null;
  fileSize?: string | null;
  description?: string | null;
}

export interface ResourceReference {
  title: string;
  url?: string | null;
  type?: string | null;
}

export interface ResourceSEO {
  metaTitle?: string | null;
  metaDescription?: string | null;
  focusKeyword?: string | null;
  secondaryKeywords?: string[];
  canonicalUrl?: string | null;
  robots?: string;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  twitterCard?: string;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
  breadcrumb?: { label: string; href: string }[];
  internalLinks?: string[];
  externalLinks?: string[];
}

export interface ResourceAISEO {
  summary?: string | null;
  executiveSummary?: string | null;
  keyTakeaways?: string[];
  questionsAnswered?: string[];
  entities?: string[];
  semanticKeywords?: string[];
  knowledgeGraph?: string | null;
  citationReady?: boolean;
}

export interface ResourceSettings {
  enableIndexing?: boolean;
  enableDownload?: boolean;
  enableLeadForm?: boolean;
  enableCta?: boolean;
  enableRelatedResources?: boolean;
  enableNewsletter?: boolean;
  showAuthor?: boolean;
  showToc?: boolean;
  showUpdatedDate?: boolean;
  allowSharing?: boolean;
}

export interface ResourceSchema {
  types?: string[];
  jsonLd?: string | null;
}

export interface ResourceAnalytics {
  views: number;
  monthlyViews: number;
  downloads: number;
  searches: number;
  indexed: boolean;
}

export interface ResourceTocItem {
  level: number;
  text: string;
  id: string;
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  category?: string | null;
  subcategory?: string | null;
  type: ResourceType;
  tags: string[];
  authorId?: string | null;
  authorName?: string | null;
  difficulty: DifficultyLevel;
  readTimeMinutes: number;
  downloadTimeMinutes: number;
  language: string;
  featured: boolean;
  sticky: boolean;
  priority: number;
  status: ResourceStatus;
  workflowStatus: string;
  visibility: ResourceVisibility;
  password?: string | null;
  publishAt?: string | null;
  expireAt?: string | null;
  publishedAt?: string | null;
  canonicalUrl?: string | null;
  seoScore: number;
  content: string;
  contentFormat: ContentFormat;
  tableOfContents: ResourceTocItem[];
  references: ResourceReference[];
  internalLinks: string[];
  relatedResourceIds: string[];
  downloads: ResourceDownload[];
  media: {
    featuredImage?: ResourceMedia | null;
    heroImage?: ResourceMedia | null;
    coverImage?: ResourceMedia | null;
  };
  gallery: ResourceMedia[];
  seo: ResourceSEO;
  aiSeo: ResourceAISEO;
  schema: ResourceSchema;
  settings: ResourceSettings;
  analytics: ResourceAnalytics;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface ResourceStats {
  total: number;
  published: number;
  drafts: number;
  scheduled: number;
  archived: number;
  featured: number;
  categories: number;
  types: number;
  totalViews: number;
  monthlyViews: number;
  totalDownloads: number;
  totalSearches: number;
  averageSeoScore: number;
}

export interface ResourceListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ResourceStatus;
  type?: ResourceType;
  category?: string;
  difficulty?: DifficultyLevel;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResources {
  items: Resource[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ResourceMeta {
  types: ResourceType[];
  categories: string[];
}
