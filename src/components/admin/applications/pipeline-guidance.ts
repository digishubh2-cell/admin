import type {
  Application,
  ApplicationOffer,
  ApplicationStatus,
} from "@/types/application";
import type { AssessmentAttempt } from "@/types/assessment";

export const STAGE_COPY: Record<
  ApplicationStatus,
  { title: string; blurb: string }
> = {
  new: {
    title: "New application",
    blurb: "Start by reviewing the profile, then shortlist or send an assessment.",
  },
  under_review: {
    title: "Under review",
    blurb: "Decide whether to shortlist, invite to assessment, or reject.",
  },
  shortlisted: {
    title: "Shortlisted",
    blurb: "Next: send an online assessment, or schedule an interview / generate an offer.",
  },
  assessment_invited: {
    title: "Waiting on assessment",
    blurb: "Invite sent — waiting for the candidate to open the link (online test or PDF).",
  },
  assessment_in_progress: {
    title: "Assessment in progress",
    blurb: "Candidate has started the test. Wait for submission before deciding.",
  },
  assessment_submitted: {
    title: "Assessment submitted — decision needed",
    blurb:
      "Review the score and answers, then mark pass (qualified) or fail. You cannot advance the hiring pipeline until you decide.",
  },
  qualified: {
    title: "Qualified",
    blurb:
      "Assessment passed. Continue with interview (if path is test + interview) or generate an offer.",
  },
  interview: {
    title: "Interview stage",
    blurb: "Interview is scheduled or in progress. After it, generate an offer or reject.",
  },
  offered: {
    title: "Offer sent",
    blurb:
      "Offer letter is out. Track candidate Accept / Reject and docs on Documents; when they join, mark hired.",
  },
  hired: {
    title: "Hired / onboarding",
    blurb: "Candidate is hired. When the internship ends, issue a completion certificate.",
  },
  completed: {
    title: "Completed",
    blurb: "Pipeline finished — certificate issued.",
  },
  rejected: {
    title: "Rejected",
    blurb: "This candidate was rejected. Pipeline is closed.",
  },
  archived: {
    title: "Archived",
    blurb: "Application is archived. No further actions.",
  },
};

export type PipelinePrimaryAction = {
  label: string;
  description: string;
  href?: string;
  panel?: "interview" | "offer" | "hire" | "complete" | "reject" | "assessment";
  advanceTo?: ApplicationStatus;
  advanceSendEmail?: boolean;
  resendInvite?: boolean;
};

export function getPathLabel(path?: "test" | "both" | null) {
  if (path === "both") return "Test + Interview";
  if (path === "test") return "Test only";
  return null;
}

export function getPipelinePrimaryAction(
  application: Application,
  attempt?: AssessmentAttempt | null
): PipelinePrimaryAction | null {
  const status = application.status;
  const assessment = application.pipeline?.assessment;
  const attemptId = assessment?.attemptId || attempt?.id;
  const path = attempt?.path || assessment?.path;

  if (status === "archived" || status === "completed") return null;

  if (attempt?.status === "expired") {
    return {
      label: "Resend assessment",
      description:
        "The previous assessment link expired. Send a new tokenized link — the old link will no longer work.",
      resendInvite: true,
    };
  }

  if (status === "assessment_submitted" && attemptId) {
    return {
      label: "Review assessment & decide pass / fail",
      description:
        path === "both"
          ? "Open the attempt, check score and answers, then mark qualified or not. If they pass, schedule the interview next."
          : "Open the attempt, check score and answers, then mark qualified or not. If they pass (test-only), you can generate an offer next.",
      href: `/assessments/${attemptId}`,
    };
  }

  if (status === "assessment_invited" && attemptId) {
    return {
      label: "Resend assessment invite",
      description:
        "Candidate has not finished yet. Resend the invite email if they did not receive it, or open the attempt to check status.",
      resendInvite: true,
    };
  }

  if (status === "assessment_in_progress" && attemptId) {
    return {
      label: "View attempt in progress",
      description: "The candidate is taking the test. You can view progress; decide after they submit.",
      href: `/assessments/${attemptId}`,
    };
  }

  if (status === "qualified") {
    if (path === "both" || assessment?.path === "both") {
      return {
        label: "Schedule interview",
        description:
          "Qualified on the combined path — schedule the interview to continue, then generate an offer after.",
        panel: "interview",
      };
    }
    return {
      label: "Generate offer letter",
      description: "Qualified on the test-only path — generate and email the offer letter.",
      panel: "offer",
    };
  }

  if (status === "new") {
    return {
      label: "Mark under review",
      description: "Acknowledge this application and begin screening.",
      advanceTo: "under_review",
      advanceSendEmail: false,
    };
  }

  if (status === "under_review") {
    return {
      label: "Shortlist & email",
      description: "Move forward and notify the candidate, or send an assessment from secondary actions.",
      advanceTo: "shortlisted",
      advanceSendEmail: true,
    };
  }

  if (status === "shortlisted") {
    return {
      label: "Send assessment",
      description: "Invite the candidate to an online test (recommended before interview/offer).",
      panel: "assessment",
    };
  }

  if (status === "interview") {
    return {
      label: "Generate offer letter",
      description: "After a successful interview, generate and email the offer.",
      panel: "offer",
    };
  }

  if (status === "offered") {
    return {
      label: "Mark hired",
      description: "Confirm join date and send the welcome email.",
      panel: "hire",
    };
  }

  if (status === "hired") {
    return {
      label: "Issue certificate",
      description: "When the internship/trainee period ends, generate the completion certificate.",
      panel: "complete",
    };
  }

  if (status === "rejected") {
    return null;
  }

  return null;
}

export type PipelineFact = { label: string; value: string };

export function buildPipelineFacts(
  application: Application,
  attempt?: AssessmentAttempt | null
): PipelineFact[] {
  const facts: PipelineFact[] = [];
  const pipeline = application.pipeline;
  const assessment = pipeline?.assessment;
  const offer = pipeline?.offer;
  const hire = pipeline?.hire;
  const completion = pipeline?.completion;
  const path = attempt?.path || assessment?.path;
  const emails = pipeline?.emailLog || [];
  const lastEmail = emails.length
    ? [...emails].sort(
        (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
      )[0]
    : null;

  facts.push({
    label: "Stage",
    value: STAGE_COPY[application.status]?.title || application.status.replace(/_/g, " "),
  });

  const pathLabel = getPathLabel(path);
  if (pathLabel) facts.push({ label: "Hiring path", value: pathLabel });

  if (attempt?.kind === "pdf" || assessment?.kind === "pdf") {
    facts.push({ label: "Assessment type", value: "PDF document" });
  } else if (attempt || assessment?.attemptId) {
    facts.push({ label: "Assessment type", value: "Online test" });
  }

  if (attempt?.templateName) {
    facts.push({
      label: attempt.kind === "pdf" ? "Document" : "Assessment template",
      value: attempt.templateName,
    });
  }

  if (attempt) {
    facts.push({
      label: "Assessment status",
      value: `${attempt.status.replace(/_/g, " ")}${
        attempt.adminDecision && attempt.adminDecision !== "pending"
          ? ` · decision: ${attempt.adminDecision}`
          : attempt.status === "submitted"
            ? " · awaiting your decision"
            : ""
      }`,
    });
    if (attempt.autoScore?.total > 0) {
      facts.push({
        label: "Auto score",
        value: `${attempt.autoScore.correct}/${attempt.autoScore.total} (${attempt.autoScore.percent}%)`,
      });
    }
    if (attempt.submittedAt) {
      facts.push({
        label: "Submitted",
        value: formatFactDate(attempt.submittedAt),
      });
    }
  } else if (assessment?.invitedAt) {
    facts.push({
      label: "Assessment invited",
      value: formatFactDate(assessment.invitedAt),
    });
  }

  if (pipeline?.interviewAt) {
    facts.push({
      label: "Interview",
      value: [
        formatFactDate(pipeline.interviewAt),
        pipeline.interviewMode,
      ]
        .filter(Boolean)
        .join(" · "),
    });
  }

  if (offer?.letterUrl || offer?.roleTitle || offer?.sentAt) {
    const responseLabel =
      offer.response?.status === "accepted"
        ? "Accepted"
        : offer.response?.status === "accepted_pending_docs"
          ? "Accepted – awaiting docs"
          : offer.response?.status === "rejected"
            ? "Rejected by candidate"
            : offer.letterUrl
              ? "Awaiting response"
              : null;
    facts.push({
      label: "Offer",
      value: [
        offer.letterUrl ? "Letter sent" : "In progress",
        responseLabel,
        offer.roleTitle,
        offer.track,
        offer.sentAt ? formatFactDate(offer.sentAt) : null,
      ]
        .filter(Boolean)
        .join(" · "),
    });
  }

  if (application.jobType) {
    facts.push({
      label: "Role type",
      value: application.jobType,
    });
  }

  if (hire?.joinedAt) {
    facts.push({
      label: "Joined",
      value: [
        formatFactDate(hire.joinedAt),
        hire.mentorName ? `Mentor: ${hire.mentorName}` : null,
      ]
        .filter(Boolean)
        .join(" · "),
    });
  }

  if (completion?.completedAt || completion?.certificateId) {
    facts.push({
      label: "Completion",
      value: [
        completion.completedAt ? formatFactDate(completion.completedAt) : null,
        completion.certificateId ? `ID ${completion.certificateId}` : null,
        completion.rating != null ? `Rating ${completion.rating}/5` : null,
      ]
        .filter(Boolean)
        .join(" · "),
    });
  }

  if (lastEmail) {
    facts.push({
      label: "Last email",
      value: `${lastEmail.subject} · ${lastEmail.status} · ${formatFactDate(lastEmail.sentAt)}`,
    });
  }

  facts.push({
    label: "Applied",
    value: formatFactDate(application.createdAt),
  });

  if (application.updatedAt) {
    facts.push({
      label: "Last updated",
      value: formatFactDate(application.updatedAt),
    });
  }

  return facts;
}

function formatFactDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

/** Offer has enough fields to show a detail card (avoid empty "Track only" boxes). */
export function hasMeaningfulOffer(offer?: ApplicationOffer | null) {
  if (!offer) return false;
  return Boolean(
    offer.letterUrl ||
      offer.roleTitle ||
      offer.startDate ||
      offer.endDate ||
      offer.sentAt ||
      offer.stipend != null ||
      offer.department ||
      offer.location ||
      offer.mentorName
  );
}
