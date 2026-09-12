export type QuestionCategory = "tech" | "aptitude";
export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface AssessmentQuestion {
  id: string;
  prompt: string;
  type: "mcq_single";
  options: QuestionOption[];
  correctOptionId: string;
  category: QuestionCategory;
  stackTags: string[];
  difficulty: QuestionDifficulty;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentTemplate {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  questionIds: string[];
  isActive: boolean;
  isPreset: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AssessmentKind = "interactive" | "pdf";

export type AttemptStatus =
  | "invited"
  | "identity_pending"
  | "in_progress"
  | "submitted"
  | "expired"
  | "void";

export type AdminDecision = "pending" | "pass" | "fail" | "retake";

export interface AttemptQuestionSnapshot {
  id: string;
  prompt: string;
  type: "mcq_single";
  options: QuestionOption[];
  category: QuestionCategory;
  correctOptionId?: string;
}

export interface AttemptAnswer {
  questionId: string;
  optionId: string | null;
}

export interface AttemptScoreBreakdown {
  correct: number;
  total: number;
}

export interface AttemptAutoScore {
  correct: number;
  total: number;
  percent: number;
  breakdown: {
    tech: AttemptScoreBreakdown;
    aptitude: AttemptScoreBreakdown;
  };
}

export interface AssessmentPdf {
  url?: string | null;
  fileId?: string | null;
  name?: string | null;
  size?: number | null;
}

export interface AssessmentAttempt {
  id: string;
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle?: string | null;
  jobId?: string | null;
  kind?: AssessmentKind;
  templateId: string;
  templateName?: string | null;
  path: "test" | "both";
  durationMinutes: number;
  templateSnapshot: AttemptQuestionSnapshot[];
  pdf?: AssessmentPdf | null;
  expiresAt?: string | null;
  status: AttemptStatus;
  selfie: {
    url: string | null;
    fileId: string | null;
    capturedAt: string | null;
  };
  startedAt?: string | null;
  endsAt?: string | null;
  submittedAt?: string | null;
  answers: AttemptAnswer[];
  autoScore: AttemptAutoScore;
  adminDecision: AdminDecision;
  adminNotes?: string | null;
  decidedAt?: string | null;
  decidedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface QuestionListParams {
  page?: number;
  limit?: number;
  category?: QuestionCategory;
  stackTag?: string;
  isActive?: "true" | "false";
  search?: string;
}

export interface AttemptListParams {
  page?: number;
  limit?: number;
  status?: AttemptStatus;
  adminDecision?: AdminDecision;
  applicationId?: string;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "submittedAt" | "candidateName";
  sortOrder?: "asc" | "desc";
}

export interface CreateQuestionPayload {
  prompt: string;
  type?: "mcq_single";
  options: QuestionOption[];
  correctOptionId: string;
  category: QuestionCategory;
  stackTags?: string[];
  difficulty?: QuestionDifficulty;
  isActive?: boolean;
}

export interface CreateTemplatePayload {
  name: string;
  description?: string;
  durationMinutes?: number;
  questionIds: string[];
  isActive?: boolean;
  isPreset?: boolean;
}

export interface InvitePayload {
  templateId?: string;
  kind?: AssessmentKind;
  path?: "test" | "both";
  durationMinutes?: number;
  expiresInHours?: number;
  file?: File;
}

export interface DecidePayload {
  decision: "pass" | "fail" | "retake";
  notes?: string | null;
  sendEmail?: boolean;
}
