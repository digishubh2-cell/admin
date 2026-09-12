export type ApplicationStatus =
  | "new"
  | "under_review"
  | "shortlisted"
  | "assessment_invited"
  | "assessment_in_progress"
  | "assessment_submitted"
  | "qualified"
  | "interview"
  | "offered"
  | "hired"
  | "completed"
  | "rejected"
  | "archived";

export const PIPELINE_STAGES: ApplicationStatus[] = [
  "new",
  "under_review",
  "shortlisted",
  "assessment_invited",
  "assessment_submitted",
  "qualified",
  "interview",
  "offered",
  "hired",
  "completed",
];

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

export interface ApplicationOfferResponse {
  status?:
    | "pending"
    | "accepted_pending_docs"
    | "accepted"
    | "rejected"
    | string
    | null;
  decidedAt?: string | null;
  rejectedAt?: string | null;
  acceptedAt?: string | null;
  docsSubmittedAt?: string | null;
  rejectReason?: string | null;
}

export interface ApplicationCandidateDocument {
  id: string;
  type: string;
  label?: string | null;
  fileName?: string | null;
  fileUrl: string;
  fileId?: string | null;
  mimeType?: string | null;
  size?: number | null;
  uploadedAt?: string | null;
}

export interface ApplicationOffer {
  roleTitle?: string | null;
  track?: "internship" | "trainee" | string | null;
  department?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  durationMonths?: number | null;
  stipend?: number | null;
  workMode?: string | null;
  location?: string | null;
  mentorName?: string | null;
  offerValidUntil?: string | null;
  candidateAddress?: string | null;
  subjectLine?: string | null;
  greeting?: string | null;
  introParagraph?: string | null;
  bodyParagraph?: string | null;
  bodyParagraphs?: string[] | null;
  closingParagraph?: string | null;
  conditions?: string[] | null;
  signatoryName?: string | null;
  signatoryTitle?: string | null;
  companyAddress?: string | null;
  signatureImageUrl?: string | null;
  signatureImageFileId?: string | null;
  letterUrl?: string | null;
  letterFileId?: string | null;
  sentAt?: string | null;
  responseTokenExpiresAt?: string | null;
  response?: ApplicationOfferResponse;
  candidateDocuments?: ApplicationCandidateDocument[];
}

export interface ApplicationHire {
  joinedAt?: string | null;
  mentorName?: string | null;
  notes?: string | null;
}

export interface ApplicationCompletion {
  completedAt?: string | null;
  certificateUrl?: string | null;
  certificateFileId?: string | null;
  certificateId?: string | null;
  rating?: number | null;
  feedback?: string | null;
}

export interface ApplicationEmailLogEntry {
  id: string;
  type: string;
  subject: string;
  to: string;
  resendId?: string | null;
  sentAt: string;
  sentBy?: string | null;
  status: string;
  error?: string | null;
}

export interface ApplicationAssessment {
  attemptId?: string | null;
  path?: "test" | "both" | null;
  templateId?: string | null;
  kind?: "interactive" | "pdf" | null;
  invitedAt?: string | null;
}

export interface ApplicationPipeline {
  interviewAt?: string | null;
  interviewMode?: "online" | "offline" | "phone" | string | null;
  interviewLink?: string | null;
  interviewNotes?: string | null;
  offer?: ApplicationOffer;
  hire?: ApplicationHire;
  completion?: ApplicationCompletion;
  assessment?: ApplicationAssessment;
  emailLog?: ApplicationEmailLogEntry[];
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
  pipeline?: ApplicationPipeline;
  reviewedAt?: string | null;
  shortlistedAt?: string | null;
  interviewedAt?: string | null;
  offeredAt?: string | null;
  hiredAt?: string | null;
  completedAt?: string | null;
  rejectedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationStats {
  total: number;
  new: number;
  under_review: number;
  shortlisted: number;
  assessment_invited: number;
  assessment_in_progress: number;
  assessment_submitted: number;
  qualified: number;
  interview: number;
  offered: number;
  hired: number;
  completed: number;
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

export interface InterviewPayload {
  interviewAt: string;
  interviewMode?: "online" | "offline" | "phone";
  interviewLink?: string | null;
  interviewNotes?: string | null;
  sendEmail?: boolean;
}

export interface OfferPayload {
  roleTitle?: string;
  track?: "internship" | "trainee";
  department?: string | null;
  startDate: string;
  endDate: string;
  durationMonths?: number | null;
  stipend?: number | null;
  workMode?: "remote" | "onsite" | "hybrid";
  location?: string | null;
  mentorName?: string | null;
  offerValidUntil?: string | null;
  candidateAddress?: string | null;
  subjectLine?: string | null;
  greeting?: string | null;
  introParagraph?: string | null;
  bodyParagraph?: string | null;
  bodyParagraphs?: string[] | null;
  closingParagraph?: string | null;
  conditions?: string[] | null;
  signatoryName?: string | null;
  signatoryTitle?: string | null;
  companyAddress?: string | null;
  signatureImageUrl?: string | null;
  signatureImageFileId?: string | null;
  sendEmail?: boolean;
}

export interface HirePayload {
  joinedAt?: string | null;
  mentorName?: string | null;
  notes?: string | null;
  sendEmail?: boolean;
}

export interface CompletePayload {
  completedAt?: string | null;
  rating?: number | null;
  feedback?: string | null;
  sendEmail?: boolean;
}

export interface RejectPayload {
  sendEmail?: boolean;
  reason?: string | null;
}

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "new",
  "under_review",
  "shortlisted",
  "assessment_invited",
  "assessment_in_progress",
  "assessment_submitted",
  "qualified",
  "interview",
  "offered",
  "hired",
  "completed",
  "rejected",
  "archived",
];

/** Statuses that can be set via simple advance (not dedicated forms). */
export const SIMPLE_ADVANCE_STATUSES: ApplicationStatus[] = [
  "under_review",
  "shortlisted",
  "rejected",
  "archived",
];
