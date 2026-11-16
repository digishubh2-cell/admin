import { apiClient } from "./client";
import type {
  DocumentSettings,
  IssuanceContext,
  IssuanceForm,
  IssuanceRecord,
} from "@/types/issuance";
import type { Application } from "@/types/application";

interface IssuanceResponse {
  success: boolean;
  message?: string;
  context?: IssuanceContext;
  html?: string;
  document?: string;
  letterBody?: string;
  durationLabel?: string | null;
  certificateNumber?: string;
  letterReference?: string;
  verificationUrl?: string;
  hasSignature?: boolean;
  application?: Application;
  issuance?: IssuanceRecord;
  emailWarning?: string | null;
  draft?: IssuanceRecord | null;
  settings?: DocumentSettings;
}

function payloadFromForm(
  form: IssuanceForm,
  extras: Record<string, unknown> = {}
) {
  return {
    candidateName: form.candidateName,
    designation: form.designation,
    department: form.department,
    startDate: form.startDate,
    endDate: form.endDate,
    issueDate: form.issueDate,
    acknowledgement: form.acknowledgement,
    letterBody: form.letterBody,
    signatoryId: form.signatoryId,
    confirmedLearningAreas: form.confirmedLearningAreas,
    allowEarlyException: form.allowEarlyException,
    earlyExceptionReason: form.earlyExceptionReason || null,
    acknowledgeNonInternship: form.acknowledgeNonInternship,
    sendEmail: form.sendEmail,
    reissueReason: form.reissueReason || null,
    ...extras,
  };
}

export async function fetchIssuanceContext(id: string) {
  const { data } = await apiClient.get<IssuanceResponse>(`/applications/${id}/issuance`);
  return data.context!;
}

export async function saveIssuanceDraft(id: string, form: IssuanceForm) {
  const { data } = await apiClient.post<IssuanceResponse>(
    `/applications/${id}/issuance/draft`,
    payloadFromForm(form)
  );
  return data;
}

export async function previewIssuance(
  id: string,
  form: IssuanceForm,
  options: { document: "certificate" | "letter"; regenerateLetter?: boolean }
) {
  const { data } = await apiClient.post<IssuanceResponse>(
    `/applications/${id}/issuance/preview`,
    payloadFromForm(form, options)
  );
  return data;
}

export async function previewIssuancePdf(
  id: string,
  form: IssuanceForm,
  document: "certificate" | "letter"
) {
  const { data } = await apiClient.post<Blob>(
    `/applications/${id}/issuance/preview-pdf`,
    payloadFromForm(form, { document }),
    { responseType: "blob" }
  );
  return data;
}

export async function issueDocuments(id: string, form: IssuanceForm) {
  const { data } = await apiClient.post<IssuanceResponse>(
    `/applications/${id}/issuance/issue`,
    payloadFromForm(form, { confirm: true })
  );
  return data;
}

export async function reissueDocuments(id: string, form: IssuanceForm) {
  const { data } = await apiClient.post<IssuanceResponse>(
    `/applications/${id}/issuance/reissue`,
    payloadFromForm(form, { confirm: true })
  );
  return data;
}

export async function beginReissue(id: string) {
  const { data } = await apiClient.post<IssuanceResponse>(
    `/applications/${id}/issuance/reissue/start`
  );
  return data;
}

export async function revokeCertificate(id: string, reason: string) {
  const { data } = await apiClient.post<IssuanceResponse>(
    `/applications/${id}/issuance/revoke`,
    { reason }
  );
  return data;
}

export async function resendCompletionEmail(id: string) {
  const { data } = await apiClient.post<IssuanceResponse>(
    `/applications/${id}/issuance/resend`
  );
  return data;
}

export async function fetchDocumentSettings() {
  const { data } = await apiClient.get<IssuanceResponse>("/document-settings");
  return data.settings!;
}

export async function saveDocumentSettings(settings: {
  companyName: string;
  companyLegalName: string;
  companyWebsite: string;
  companyPositioning: string;
  officialEmail: string;
  companyAddress: string;
  defaultAcknowledgement: string;
  signatories: Array<{ id: string; name: string; designation: string; active: boolean }>;
}) {
  const { data } = await apiClient.put<IssuanceResponse>("/document-settings", settings);
  return data.settings!;
}

export async function uploadDocumentLogo(file: File) {
  const body = new FormData();
  body.append("file", file);
  // Let the browser set multipart boundaries. A manual Content-Type breaks multer.
  const { data } = await apiClient.post<IssuanceResponse>("/document-settings/logo", body);
  return data.settings!;
}

export async function uploadSignatory(file: File, name: string, designation: string) {
  const body = new FormData();
  body.append("file", file);
  body.append("name", name.trim());
  body.append("designation", designation.trim());
  const { data } = await apiClient.post<IssuanceResponse>("/document-settings/signatories", body);
  return data.settings!;
}

export async function replaceSignatorySignature(signatoryId: string, file: File) {
  const body = new FormData();
  body.append("file", file);
  const { data } = await apiClient.post<IssuanceResponse>(
    `/document-settings/signatories/${signatoryId}/signature`,
    body
  );
  return data.settings!;
}
