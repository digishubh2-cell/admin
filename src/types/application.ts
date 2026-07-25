export type ApplicationStatus =
  | "new"
  | "under_review"
  | "shortlisted"
  | "rejected"
  | "archived";

export interface ApplicationResume {
  url?: string | null;
  fileId?: string | null;
  publicId?: string | null;
  name?: string | null;
  size?: number | null;
  fileType?: string | null;
}

export interface ApplicationSource {
  page: string;
  pageUrl?: string | null;
  pageTitle?: string | null;
  section: string;
  ctaLabel?: string | null;
  referrer?: string | null;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle?: string | null;
  jobSlug?: string | null;
  jobType?: "job" | "internship" | null;
  jobDepartment?: string | null;
  candidateName: string;
  email: string;
  phone?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  currentCity?: string | null;
  experienceYears?: number | null;
  education?: string | null;
  coverLetter?: string | null;
  resume: ApplicationResume;
  status: ApplicationStatus;
  emailVerified: boolean;
  emailVerifiedAt?: string | null;
  source: ApplicationSource;
  notes?: string | null;
  reviewedAt?: string | null;
  shortlistedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationStats {
  total: number;
  new: number;
  under_review: number;
  shortlisted: number;
  rejected: number;
  archived: number;
  verified: number;
  byJobType: Record<string, number>;
}

export interface ApplicationListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ApplicationStatus;
  jobId?: string;
  jobType?: "job" | "internship";
  emailVerified?: "true" | "false";
  sortBy?: "createdAt" | "updatedAt" | "candidateName" | "email" | "status" | "jobTitle";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedApplications {
  items: Application[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateApplicationPayload {
  jobId?: string;
  jobSlug?: string;
  candidateName: string;
  email: string;
  phone?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  currentCity?: string | null;
  experienceYears?: number | null;
  education?: string | null;
  coverLetter?: string | null;
  resume: ApplicationResume;
  source?: Partial<ApplicationSource>;
}

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "new",
  "under_review",
  "shortlisted",
  "rejected",
  "archived",
];
