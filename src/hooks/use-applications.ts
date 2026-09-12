"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  advanceApplication,
  completeInternship,
  deleteApplication,
  fetchApplication,
  fetchApplicationEmails,
  fetchApplications,
  fetchApplicationStats,
  markHired,
  rejectApplication,
  resendApplicationEmail,
  sendCandidateMessage,
  scheduleInterview,
  sendOffer,
  updateApplication,
} from "@/lib/api/applications";
import type {
  ApplicationListParams,
  CompletePayload,
  HirePayload,
  InterviewPayload,
  OfferPayload,
  RejectPayload,
} from "@/types/application";

export function useApplicationStats() {
  return useQuery({
    queryKey: ["applications", "stats"],
    queryFn: fetchApplicationStats,
  });
}

export function useApplications(params: ApplicationListParams) {
  return useQuery({
    queryKey: ["applications", "list", params],
    queryFn: () => fetchApplications(params),
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ["applications", id],
    queryFn: () => fetchApplication(id),
    enabled: !!id,
  });
}

export function useApplicationEmails(id: string | null, enabled = false) {
  return useQuery({
    queryKey: ["applications", id, "emails"],
    queryFn: () => fetchApplicationEmails(id!),
    enabled: !!id && enabled,
  });
}

export function useApplicationMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["applications"] });

  return {
    update: useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: { status?: string; notes?: string | null };
      }) => updateApplication(id, payload),
      onSuccess: invalidate,
    }),
    advance: useMutation({
      mutationFn: ({
        id,
        toStatus,
        sendEmail,
      }: {
        id: string;
        toStatus: string;
        sendEmail?: boolean;
      }) => advanceApplication(id, { toStatus, sendEmail }),
      onSuccess: invalidate,
    }),
    interview: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: InterviewPayload }) =>
        scheduleInterview(id, payload),
      onSuccess: invalidate,
    }),
    offer: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: OfferPayload }) =>
        sendOffer(id, payload),
      onSuccess: invalidate,
    }),
    hire: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload?: HirePayload }) =>
        markHired(id, payload || {}),
      onSuccess: invalidate,
    }),
    complete: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload?: CompletePayload }) =>
        completeInternship(id, payload || {}),
      onSuccess: invalidate,
    }),
    reject: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload?: RejectPayload }) =>
        rejectApplication(id, payload || {}),
      onSuccess: invalidate,
    }),
    sendMessage: useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: { message: string; sendEmail?: boolean };
      }) => sendCandidateMessage(id, payload),
      onSuccess: invalidate,
    }),
    resendEmail: useMutation({
      mutationFn: ({ id, type }: { id: string; type: string }) =>
        resendApplicationEmail(id, type),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: deleteApplication,
      onSuccess: invalidate,
    }),
  };
}
