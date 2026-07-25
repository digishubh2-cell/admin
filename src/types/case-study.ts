export type CaseStudyStatus =
  | "draft"
  | "review"
  | "approved"
  | "scheduled"
  | "published"
  | "archived";

export type CaseStudyVisibility = "public" | "private" | "password";

export interface CaseStudyMedia {
  url?: string | null;
  publicId?: string | null;
  alt?: string | null;
  caption?: string | null;
  credit?: string | null;
  type?: string | null;
}

export interface CaseStudyMetric {
  label: string;
  before?: string | null;
  after?: string | null;
  change?: string | null;
}

export interface CaseStudyTestimonial {
  clientName?: string | null;
  designation?: string | null;
  company?: string | null;
  photo?: string | null;
  review?: string | null;
  rating?: number | null;
  linkedin?: string | null;
}

export interface CaseStudyTimelineItem {
  phase: string;
  title?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface CaseStudyDownload {
  title: string;
  url?: string | null;
  type?: string | null;
  fileSize?: string | null;
}

export interface CaseStudyFAQ {
  question: string;
  answer: string;
}

export interface CaseStudySEO {
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

export interface CaseStudyAISEO {
  summary?: string | null;
  executiveSummary?: string | null;
  businessOutcome?: string | null;
  keyLearnings?: string[];
  technicalHighlights?: string[];
  entities?: string[];
  semanticKeywords?: string[];
  knowledgeGraph?: string | null;
  questionsAnswered?: string[];
  keyTakeaways?: string[];
  citationReady?: boolean;
}

export interface CaseStudySettings {
  comments?: boolean;
  enableIndexing?: boolean;
  enableLeadForm?: boolean;
  enableCta?: boolean;
  enableRelatedProjects?: boolean;
  enableNewsletter?: boolean;
  showAuthor?: boolean;
  showTimeline?: boolean;
  showTechnologies?: boolean;
}

export interface CaseStudySchema {
  types?: string[];
  jsonLd?: string | null;
}

export interface CaseStudyAnalytics {
  views: number;
  monthlyViews: number;
  conversions: number;
  ctaClicks: number;
  indexed: boolean;
}

export interface CaseStudy {
  id: string;
  projectName: string;
  slug: string;
  shortSummary?: string | null;
  industry?: string | null;
  category?: string | null;
  clientName?: string | null;
  projectType?: string | null;
  projectUrl?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  featured: boolean;
  sticky: boolean;
  priority: number;
  status: CaseStudyStatus;
  workflowStatus: string;
  visibility: CaseStudyVisibility;
  password?: string | null;
  publishAt?: string | null;
  expireAt?: string | null;
  publishedAt?: string | null;
  canonicalUrl?: string | null;
  authorId?: string | null;
  authorName?: string | null;
  language: string;
  readTimeMinutes: number;
  seoScore: number;
  content: string;
  contentFormat: "markdown" | "html";

  business: {
    clientBackground?: string | null;
    businessGoals?: string[];
    targetAudience?: string | null;
    businessProblems?: string[];
    requirements?: string[];
    successCriteria?: string[];
    budgetRange?: string | null;
    timeline?: string | null;
  };

  challenges: {
    problems?: string[];
    technical?: string[];
    business?: string[];
    seo?: string[];
    performance?: string[];
    security?: string[];
    scalability?: string[];
  };

  research: Record<string, string | null | undefined>;
  planning: Record<string, string | null | undefined>;
  design: Record<string, string | string[] | null | undefined>;
  development: Record<string, string | string[] | null | undefined>;
  seo: CaseStudySEO;
  seoImplementation: Record<string, string | null | undefined>;
  performance: Record<string, string | number | string[] | null | undefined>;
  results: {
    summary?: string | null;
    trafficGrowth?: string | null;
    leadGrowth?: string | null;
    conversionGrowth?: string | null;
    revenueGrowth?: string | null;
    keywordRankings?: string | null;
    coreWebVitalsImprovement?: string | null;
    businessImpact?: string | null;
    beforeAfter?: string | null;
    metrics?: CaseStudyMetric[];
    charts?: Record<string, unknown>[];
  };

  testimonials: CaseStudyTestimonial[];
  media: {
    featuredImage?: CaseStudyMedia | null;
    heroImage?: CaseStudyMedia | null;
    coverImage?: CaseStudyMedia | null;
  };
  gallery: {
    screenshots?: CaseStudyMedia[];
    dashboard?: CaseStudyMedia[];
    mobile?: CaseStudyMedia[];
    desktop?: CaseStudyMedia[];
    videos?: CaseStudyMedia[];
    beforeAfter?: CaseStudyMedia[];
  };
  technology: { stack?: string[]; custom?: string[] };
  timeline: CaseStudyTimelineItem[];
  team: Record<string, string | null | undefined>;
  downloads: CaseStudyDownload[];
  faq: CaseStudyFAQ[];
  aiSeo: CaseStudyAISEO;
  schema: CaseStudySchema;
  settings: CaseStudySettings;
  analytics: CaseStudyAnalytics;
  relatedCaseStudyIds: string[];
  tableOfContents?: { level: number; text: string; id: string }[];
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface CaseStudyStats {
  published: number;
  drafts: number;
  scheduled: number;
  archived: number;
  featured: number;
  industries: number;
  clients: number;
  totalViews: number;
  monthlyViews: number;
  conversions: number;
  ctaClicks: number;
  averageSeoScore: number;
}

export interface CaseStudyListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CaseStudyStatus;
  industry?: string;
  category?: string;
  featured?: "true" | "false";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedCaseStudies {
  items: CaseStudy[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const CASE_STUDY_INDUSTRIES = [
  "FinTech",
  "SaaS",
  "E-Commerce",
  "Healthcare",
  "EdTech",
  "Real Estate",
  "Manufacturing",
  "Digital Marketing",
  "Logistics",
  "Enterprise",
] as const;

export const CASE_STUDY_CATEGORIES = [
  "Web Development",
  "SEO",
  "SaaS Platform",
  "E-Commerce",
  "Admin Dashboard",
  "Mobile App",
  "Automation",
  "Rebrand",
  "Migration",
] as const;

export const CASE_STUDY_PROJECT_TYPES = [
  "New Build",
  "Redesign",
  "Migration",
  "SEO Overhaul",
  "Platform Engineering",
  "Growth Retainer",
] as const;
