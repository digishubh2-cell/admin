export type TestimonialStatus =
  | "draft"
  | "review"
  | "approved"
  | "scheduled"
  | "published"
  | "archived";

export type TestimonialVisibility = "public" | "private" | "password";

export type TestimonialType =
  | "client_testimonial"
  | "video_testimonial"
  | "google_review"
  | "linkedin_recommendation"
  | "partner_review"
  | "employee_review"
  | "internship_testimonial"
  | "founder_recommendation"
  | "success_story";

export type CompanySize = "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+";

export type BusinessType =
  | "startup"
  | "smb"
  | "enterprise"
  | "agency"
  | "nonprofit"
  | "government"
  | "freelancer"
  | "other";

export interface TestimonialMedia {
  url?: string | null;
  publicId?: string | null;
  alt?: string | null;
  caption?: string | null;
  credit?: string | null;
}

export interface TestimonialReview {
  title?: string | null;
  shortReview?: string | null;
  detailedReview?: string | null;
  rating?: number;
  wouldRecommend?: boolean;
  projectName?: string | null;
  projectCategory?: string | null;
  projectUrl?: string | null;
  servicesUsed?: string[];
  timeline?: string | null;
  highlights?: string[];
  keyBenefits?: string[];
  businessOutcome?: string | null;
}

export interface TestimonialCompany {
  size?: CompanySize | null;
  industry?: string | null;
  businessType?: BusinessType | null;
  location?: string | null;
  website?: string | null;
}

export interface TestimonialSEO {
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

export interface TestimonialAISEO {
  summary?: string | null;
  executiveSummary?: string | null;
  keyBenefits?: string[];
  questionsAnswered?: string[];
  entities?: string[];
  semanticKeywords?: string[];
  citationReadySummary?: string | null;
  citationReady?: boolean;
}

export interface TestimonialSettings {
  showRating?: boolean;
  showCompany?: boolean;
  showLogo?: boolean;
  showVideo?: boolean;
  enableIndexing?: boolean;
  enableCta?: boolean;
  enableSocialShare?: boolean;
  enableRelatedTestimonials?: boolean;
}

export interface TestimonialSchema {
  types?: string[];
  jsonLd?: string | null;
}

export interface TestimonialAnalytics {
  views: number;
  monthlyViews: number;
  impressions: number;
  clicks: number;
  shares: number;
  indexed: boolean;
}

export interface Testimonial {
  id: string;
  fullName: string;
  designation?: string | null;
  companyName?: string | null;
  companyWebsite?: string | null;
  industry?: string | null;
  country?: string | null;
  city?: string | null;
  email?: string | null;
  linkedinUrl?: string | null;
  reviewType: TestimonialType;
  featured: boolean;
  priority: number;
  status: TestimonialStatus;
  workflowStatus: string;
  visibility: TestimonialVisibility;
  language: string;
  slug: string;
  seoScore: number;
  canonicalUrl?: string | null;
  publishAt?: string | null;
  expireAt?: string | null;
  publishedAt?: string | null;
  review: TestimonialReview;
  company: TestimonialCompany;
  media: {
    profileImage?: TestimonialMedia | null;
    companyLogo?: TestimonialMedia | null;
    coverImage?: TestimonialMedia | null;
    video?: TestimonialMedia | null;
    youtubeUrl?: string | null;
  };
  gallery: TestimonialMedia[];
  seo: TestimonialSEO;
  aiSeo: TestimonialAISEO;
  schema: TestimonialSchema;
  settings: TestimonialSettings;
  analytics: TestimonialAnalytics;
  relatedTestimonialIds: string[];
  internalLinks: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  relatedTestimonials?: Testimonial[];
}

export interface TestimonialStats {
  total: number;
  published: number;
  drafts: number;
  scheduled: number;
  archived: number;
  featured: number;
  videoTestimonials: number;
  totalReviews: number;
  totalViews: number;
  monthlyViews: number;
  averageRating: number;
  averageSeoScore: number;
}

export interface TestimonialListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TestimonialStatus;
  reviewType?: TestimonialType;
  featured?: boolean;
  language?: string;
  rating?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedTestimonials {
  items: Testimonial[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TestimonialMeta {
  types: TestimonialType[];
  languages: string[];
}

export interface TestimonialRevision {
  id: string;
  testimonialId: string;
  version: number;
  snapshot: Record<string, unknown>;
  createdAt: string;
  createdBy?: string;
}
