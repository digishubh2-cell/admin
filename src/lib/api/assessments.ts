import { apiClient } from "./client";
import type { Application } from "@/types/application";
import type {
  AssessmentAttempt,
  AssessmentQuestion,
  AssessmentTemplate,
  AttemptListParams,
  CreateQuestionPayload,
  CreateTemplatePayload,
  DecidePayload,
  InvitePayload,
  PaginatedResult,
  QuestionListParams,
} from "@/types/assessment";

interface ApiResponse {
  success: boolean;
  message?: string;
  question?: AssessmentQuestion;
  template?: AssessmentTemplate;
  items?: unknown[];
  attempt?: AssessmentAttempt;
  application?: Application;
  emailWarning?: string | null;
  pagination?: PaginatedResult<unknown>["pagination"];
  categories?: string[];
  difficulties?: string[];
  attemptStatuses?: string[];
  adminDecisions?: string[];
}

export async function fetchAssessmentMeta() {
  const { data } = await apiClient.get<ApiResponse>("/assessments/meta/options");
  return {
    categories: data.categories || [],
    difficulties: data.difficulties || [],
    attemptStatuses: data.attemptStatuses || [],
    adminDecisions: data.adminDecisions || [],
  };
}

// Questions
export async function fetchQuestions(params: QuestionListParams = {}) {
  const { data } = await apiClient.get<ApiResponse & PaginatedResult<AssessmentQuestion>>(
    "/assessments/questions",
    { params }
  );
  return { items: (data.items as AssessmentQuestion[]) || [], pagination: data.pagination! };
}

export async function fetchQuestion(id: string) {
  const { data } = await apiClient.get<ApiResponse>(`/assessments/questions/${id}`);
  return data.question!;
}

export async function createQuestion(payload: CreateQuestionPayload) {
  const { data } = await apiClient.post<ApiResponse>("/assessments/questions", payload);
  return data.question!;
}

export async function updateQuestion(id: string, payload: Partial<CreateQuestionPayload>) {
  const { data } = await apiClient.patch<ApiResponse>(`/assessments/questions/${id}`, payload);
  return data.question!;
}

export async function deleteQuestion(id: string) {
  const { data } = await apiClient.delete<ApiResponse>(`/assessments/questions/${id}`);
  return data;
}

// Templates
export async function fetchTemplates(includeInactive = false) {
  const { data } = await apiClient.get<ApiResponse>("/assessments/templates", {
    params: { includeInactive: includeInactive ? "true" : undefined },
  });
  return (data.items as AssessmentTemplate[]) || [];
}

export async function fetchTemplate(id: string) {
  const { data } = await apiClient.get<ApiResponse>(`/assessments/templates/${id}`);
  return data.template!;
}

export async function createTemplate(payload: CreateTemplatePayload) {
  const { data } = await apiClient.post<ApiResponse>("/assessments/templates", payload);
  return data.template!;
}

export async function updateTemplate(id: string, payload: Partial<CreateTemplatePayload>) {
  const { data } = await apiClient.patch<ApiResponse>(`/assessments/templates/${id}`, payload);
  return data.template!;
}

export async function deleteTemplate(id: string) {
  const { data } = await apiClient.delete<ApiResponse>(`/assessments/templates/${id}`);
  return data;
}

// Attempts
export async function fetchAttempts(params: AttemptListParams = {}) {
  const { data } = await apiClient.get<ApiResponse & PaginatedResult<AssessmentAttempt>>(
    "/assessments/attempts",
    { params }
  );
  return { items: (data.items as AssessmentAttempt[]) || [], pagination: data.pagination! };
}

export async function fetchAttempt(id: string) {
  const { data } = await apiClient.get<ApiResponse>(`/assessments/attempts/${id}`);
  return data.attempt!;
}

export async function decideAttempt(id: string, payload: DecidePayload) {
  const { data } = await apiClient.post<ApiResponse>(
    `/assessments/attempts/${id}/decide`,
    payload
  );
  return {
    attempt: data.attempt!,
    application: data.application,
    emailWarning: data.emailWarning || null,
  };
}

// Invite (via application)
export async function inviteToAssessment(applicationId: string, payload: InvitePayload) {
  if (payload.kind === "pdf" && payload.file) {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("kind", "pdf");
    formData.append("path", payload.path || "test");
    if (payload.expiresInHours) {
      formData.append("expiresInHours", String(payload.expiresInHours));
    }
    const { data } = await apiClient.post<ApiResponse>(
      `/applications/${applicationId}/assessment/invite-pdf`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return {
      attempt: data.attempt!,
      application: data.application!,
      emailWarning: data.emailWarning || null,
    };
  }

  const { data } = await apiClient.post<ApiResponse>(
    `/applications/${applicationId}/assessment/invite`,
    {
      templateId: payload.templateId,
      path: payload.path,
      durationMinutes: payload.durationMinutes,
      expiresInHours: payload.expiresInHours,
      kind: "interactive",
    }
  );
  return {
    attempt: data.attempt!,
    application: data.application!,
    emailWarning: data.emailWarning || null,
  };
}

export async function resendAssessmentInvite(applicationId: string) {
  const { data } = await apiClient.post<ApiResponse>(
    `/applications/${applicationId}/assessment/resend`
  );
  return {
    attempt: data.attempt!,
    application: data.application!,
    emailWarning: data.emailWarning || null,
  };
}

export async function retakeAssessment(applicationId: string) {
  const { data } = await apiClient.post<ApiResponse>(
    `/applications/${applicationId}/assessment/retake`
  );
  return {
    attempt: data.attempt!,
    application: data.application!,
    emailWarning: data.emailWarning || null,
  };
}
