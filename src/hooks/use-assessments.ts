"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createQuestion,
  createTemplate,
  decideAttempt,
  deleteQuestion,
  deleteTemplate,
  fetchAssessmentMeta,
  fetchAttempt,
  fetchAttempts,
  fetchQuestion,
  fetchQuestions,
  fetchTemplate,
  fetchTemplates,
  inviteToAssessment,
  resendAssessmentInvite,
  updateQuestion,
  updateTemplate,
} from "@/lib/api/assessments";
import type {
  AttemptListParams,
  CreateQuestionPayload,
  CreateTemplatePayload,
  DecidePayload,
  InvitePayload,
  QuestionListParams,
} from "@/types/assessment";

export function useAssessmentMeta() {
  return useQuery({ queryKey: ["assessments", "meta"], queryFn: fetchAssessmentMeta });
}

export function useQuestions(params: QuestionListParams) {
  return useQuery({
    queryKey: ["assessments", "questions", params],
    queryFn: () => fetchQuestions(params),
  });
}

export function useQuestion(id: string | null) {
  return useQuery({
    queryKey: ["assessments", "questions", id],
    queryFn: () => fetchQuestion(id!),
    enabled: !!id,
  });
}

export function useQuestionMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["assessments", "questions"] });

  return {
    create: useMutation({
      mutationFn: (payload: CreateQuestionPayload) => createQuestion(payload),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateQuestionPayload> }) =>
        updateQuestion(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id: string) => deleteQuestion(id),
      onSuccess: invalidate,
    }),
  };
}

export function useTemplates(includeInactive = false) {
  return useQuery({
    queryKey: ["assessments", "templates", includeInactive],
    queryFn: () => fetchTemplates(includeInactive),
  });
}

export function useTemplate(id: string | null) {
  return useQuery({
    queryKey: ["assessments", "templates", "detail", id],
    queryFn: () => fetchTemplate(id!),
    enabled: !!id,
  });
}

export function useTemplateMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["assessments", "templates"] });

  return {
    create: useMutation({
      mutationFn: (payload: CreateTemplatePayload) => createTemplate(payload),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateTemplatePayload> }) =>
        updateTemplate(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id: string) => deleteTemplate(id),
      onSuccess: invalidate,
    }),
  };
}

export function useAttempts(params: AttemptListParams) {
  return useQuery({
    queryKey: ["assessments", "attempts", params],
    queryFn: () => fetchAttempts(params),
  });
}

export function useAttempt(id: string | null) {
  return useQuery({
    queryKey: ["assessments", "attempts", id],
    queryFn: () => fetchAttempt(id!),
    enabled: !!id,
  });
}

export function useAssessmentMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["assessments"] });
    queryClient.invalidateQueries({ queryKey: ["applications"] });
  };

  return {
    invite: useMutation({
      mutationFn: ({ applicationId, payload }: { applicationId: string; payload: InvitePayload }) =>
        inviteToAssessment(applicationId, payload),
      onSuccess: invalidate,
    }),
    resend: useMutation({
      mutationFn: (applicationId: string) => resendAssessmentInvite(applicationId),
      onSuccess: invalidate,
    }),
    decide: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: DecidePayload }) =>
        decideAttempt(id, payload),
      onSuccess: invalidate,
    }),
  };
}
