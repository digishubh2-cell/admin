export type BlogStatus =
  | "draft"
  | "review"
  | "approved"
  | "scheduled"
  | "published"
  | "archived";

export type BlogVisibility = "public" | "private" | "password";
export type ContentFormat = "markdown" | "mdx" | "html";

export interface BlogMedia {
  url?: string | null;
  publicId?: string | null;
  alt?: string | null;
  caption?: string | null;
  credit?: string | null;
}

export interface BlogSEO {
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
  faq?: { question: string; answer: string }[];
}

export interface BlogAISEO {
  summary?: string | null;
  keyTakeaways?: string[];
  questionsAnswered?: string[];
  structuredFacts?: string[];
  entityMentions?: string[];
  topicCluster?: string | null;
  relatedConcepts?: string[];
  semanticKeywords?: string[];
  knowledgeGraph?: string | null;
  llmSummary?: string | null;
  citationReady?: boolean;
}

export interface BlogSettings {
  comments?: boolean;
  enableIndexing?: boolean;
  enableAds?: boolean;
  enableNewsletter?: boolean;
  allowSharing?: boolean;
  allowDownload?: boolean;
  allowTranslation?: boolean;
  showToc?: boolean;
  enableReadingProgress?: boolean;
  showAuthor?: boolean;
  showUpdatedDate?: boolean;
}

export interface BlogSchema {
  types?: string[];
  jsonLd?: string | null;
}

export interface BlogAnalytics {
  views: number;
  monthlyViews: number;
  indexed: boolean;
}

export interface BlogTocItem {
  level: number;
  text: string;
  id: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  excerpt?: string | null;
  content: string;
  contentFormat: ContentFormat;
  categoryId?: string | null;
  categoryName?: string | null;
  subcategory?: string | null;
  tags: string[];
  authorId?: string | null;
  authorName?: string | null;
  language: string;
  readTimeMinutes: number;
  featured: boolean;
  sticky: boolean;
  priority: number;
  series?: string | null;
  canonicalUrl?: string | null;
  status: BlogStatus;
  workflowStatus: string;
  visibility: BlogVisibility;
  password?: string | null;
  publishAt?: string | null;
  expireAt?: string | null;
  publishedAt?: string | null;
  featuredImage?: BlogMedia | null;
  coverImage?: BlogMedia | null;
  gallery: BlogMedia[];
  seo: BlogSEO;
  aiSeo: BlogAISEO;
  schema: BlogSchema;
  settings: BlogSettings;
  analytics: BlogAnalytics;
  seoScore: number;
  relatedPostIds: string[];
  internalLinks: string[];
  tableOfContents?: BlogTocItem[];
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogStats {
  published: number;
  drafts: number;
  scheduled: number;
  archived: number;
  featured: number;
  totalViews: number;
  monthlyViews: number;
  averageReadTime: number;
  indexedPages: number;
}

export interface BlogListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: BlogStatus;
  categoryId?: string;
  authorId?: string;
  tags?: string;
  featured?: "true" | "false";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedBlogs {
  items: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type BlogFormValues = Partial<
  Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "version" | "analytics" | "seoScore" | "readTimeMinutes">
>;
