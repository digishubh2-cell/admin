export interface IssuanceNotice {
  code: string;
  message: string;
}

export interface IssuanceSignatoryOption {
  id: string;
  name: string;
  designation: string;
  hasSignature: boolean;
  active?: boolean;
}

export interface IssuanceFacts {
  candidateName: string;
  firstName?: string;
  designation: string;
  department: string;
  startDate: string | null;
  endDate: string | null;
  durationLabel: string | null;
  issueDate: string | null;
  acknowledgement: string;
  letterBody: string;
  verifiedAreas?: string[];
  confirmedLearningAreas?: string[];
  signatoryId?: string | null;
}

export interface IssuanceRecord {
  id: string;
  version: number;
  status: "draft" | "issued" | "revoked" | "superseded";
  certificateNumber: string;
  letterReference: string;
  verificationUrl?: string | null;
  candidateName: string;
  designation: string;
  department: string;
  startDate: string | null;
  endDate: string | null;
  durationLabel: string | null;
  issueDate: string | null;
  acknowledgement: string;
  letterBody: string;
  confirmedLearningAreas: string[];
  signatoryId: string | null;
  signatoryName: string | null;
  signatoryTitle: string | null;
  hasSignature: boolean;
  emailStatus: string | null;
  emailError: string | null;
  emailTo: string | null;
  emailSentAt: string | null;
  certificateUrl: string | null;
  letterUrl: string | null;
  issuedAt: string | null;
  issuedByName: string | null;
  revokedAt: string | null;
  revocationReason: string | null;
}

export interface IssuanceContext {
  mode: "draft" | "issued" | "reissue";
  eligibility: {
    eligible: boolean;
    early: boolean;
    canApplyEarlyException: boolean;
    canRevoke: boolean;
    blockers: IssuanceNotice[];
    warnings: IssuanceNotice[];
    alreadyIssued: boolean;
  };
  signatories: IssuanceSignatoryOption[];
  company: {
    name: string;
    website: string;
    officialEmail: string;
    hasLogo: boolean;
  };
  suggestions: string[];
  verifiedActivities: string[];
  internalFeedback: string | null;
  internalNotes: string | null;
  defaults: IssuanceFacts;
  draft: IssuanceRecord | null;
  current: IssuanceRecord | null;
  history: Array<{
    id: string;
    version: number;
    status: string;
    certificateNumber: string;
    letterReference: string;
    certificateUrl: string | null;
    letterUrl: string | null;
    issueDate: string | null;
    issuedAt: string | null;
    issuedByName: string | null;
    revokedAt: string | null;
    revocationReason: string | null;
  }>;
  candidateEmail: string | null;
  jobType: string | null;
}

export interface IssuanceForm {
  candidateName: string;
  designation: string;
  department: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  acknowledgement: string;
  letterBody: string;
  signatoryId: string;
  confirmedLearningAreas: string[];
  allowEarlyException: boolean;
  earlyExceptionReason: string;
  acknowledgeNonInternship: boolean;
  sendEmail: boolean;
  reissueReason: string;
}

export interface DocumentSettings {
  companyName: string;
  companyLegalName: string;
  companyWebsite: string;
  companyPositioning: string;
  officialEmail: string;
  companyAddress: string | null;
  logoUrl: string | null;
  hasLogo: boolean;
  defaultAcknowledgement: string;
  updatedAt: string | null;
  signatories: Array<{
    id: string;
    name: string;
    designation: string;
    active: boolean;
    hasSignature: boolean;
  }>;
}
