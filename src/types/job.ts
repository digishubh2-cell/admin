export type JobType = "job" | "internship";
export type JobEmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "temporary";
export type JobMode = "remote" | "onsite" | "hybrid";
export type JobStatus =
  | "draft"
  | "review"
  | "approved"
  | "scheduled"
  | "published"
  | "archived";
export type JobVisibility = "public" | "private";

export interface JobMedia {
  url?: string | null;
  publicId?: string | null;
  alt?: string | null;
  caption?: string | null;
  credit?: string | null;
}

export interface JobSEO {
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
}

export interface JobAISEO {
  summary?: string | null;
  keyTakeaways?: string[];
  semanticKeywords?: string[];
  questionsAnswered?: string[];
}

export interface Job {
  id: string;
  type: JobType;
  title: string;
  slug: string;
  department?: string | null;
  location?: string | null;
  employmentType?: JobEmploymentType;
  category?: string | null;
  mode?: JobMode;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  skills?: string[];
  duration?: string | null;
  stipend?: string | null;
  programLabel?: string | null;
  featured?: boolean;
  priority?: number;
  status: JobStatus;
  workflowStatus?: string;
  visibility?: JobVisibility;
  publishAt?: string | null;
  expireAt?: string | null;
  publishedAt?: string | null;
  canonicalUrl?: string | null;
  authorId?: string | null;
  authorName?: string | null;
  language?: string;
  seo?: JobSEO;
  aiSeo?: JobAISEO;
  media?: {
    coverImage?: JobMedia | null;
    featuredImage?: JobMedia | null;
  };
  version?: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobStats {
  published: number;
  drafts: number;
  scheduled: number;
  archived: number;
  jobs: number;
  internships: number;
  featured: number;
  departments: number;
}

export interface JobListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: JobStatus;
  type?: JobType;
  department?: string;
  category?: string;
  mode?: JobMode;
  featured?: "true" | "false";
  sortBy?: "updatedAt" | "createdAt" | "publishedAt" | "title" | "priority" | "department";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedJobs {
  items: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const JOB_DEPARTMENTS = [
  "Engineering",
  "Design",
  "Growth",
  "Product",
  "Operations",
  "People",
] as const;

export const JOB_CATEGORIES = [
  "Engineering",
  "Design",
  "Marketing",
  "Internship",
  "Operations",
] as const;
