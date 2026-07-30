import type { Application, ApplicationOffer } from "@/types/application";

export const DEFAULT_OFFER_CONDITIONS = [
  "You agree to abide by all applicable company policies, code of conduct, and instructions issued by your mentor or reporting manager.",
  "You shall maintain strict confidentiality of all proprietary, client, and business information accessed during the internship and thereafter.",
  "All work product, designs, code, documentation, and intellectual property created during the internship shall belong exclusively to the Company.",
  "This internship / trainee engagement does not constitute permanent employment and does not create an employer–employee relationship beyond the period stated herein.",
  "Either party may terminate this engagement by providing written notice as per company policy, subject to completion of an orderly handover.",
  "You confirm that all information provided in your application and related documents is true and accurate to the best of your knowledge.",
];

export const OFFER_BRAND = {
  companyName: "ShubhDigi",
  companyLegalName: "ShubhDigi",
  companyAddress: "India",
  signatoryName: "Authorized Signatory",
  signatoryTitle: "Founder",
  /** Admin public asset — avoids remote EMAIL_LOGO_URL 403 in the live preview iframe */
  logoUrl: "/logo.png",
};

export type OfferFormState = {
  roleTitle: string;
  track: "internship" | "trainee";
  department: string;
  startDate: string;
  endDate: string;
  durationMonths: string;
  stipend: string;
  workMode: "remote" | "onsite" | "hybrid";
  location: string;
  mentorName: string;
  offerValidUntil: string;
  candidateAddress: string;
  subjectLine: string;
  greeting: string;
  introParagraph: string;
  bodyParagraph: string;
  closingParagraph: string;
  conditionsText: string;
  signatoryName: string;
  signatoryTitle: string;
  companyAddress: string;
  signatureImageUrl: string;
  signatureImageFileId: string;
  sendEmail: boolean;
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toDateInput(value?: string | Date | null) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function formatDisplayDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

function formatStipend(stipend: string) {
  if (stipend === "" || Number(stipend) === 0) return "Unpaid / as discussed";
  return `₹${Number(stipend).toLocaleString("en-IN")} per month`;
}

function durationLabel(
  months: string,
  startDate: string,
  endDate: string
) {
  if (months) return `${months} month${Number(months) === 1 ? "" : "s"}`;
  if (startDate && endDate) {
    return `${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}`;
  }
  return "As agreed";
}

function parseConditions(text: string) {
  return text
    .split("\n")
    .map((line) => line.replace(/^\s*\d+[.)]\s*/, "").trim())
    .filter(Boolean);
}

export function conditionsToText(conditions?: string[] | null) {
  const list =
    conditions && conditions.length
      ? conditions
      : DEFAULT_OFFER_CONDITIONS;
  return list.join("\n");
}

export function buildInitialOfferForm(
  application: Application
): OfferFormState {
  const offer = application.pipeline?.offer;
  const roleTitle =
    offer?.roleTitle || application.jobTitle || "Internship Trainee";
  return {
    roleTitle,
    track:
      offer?.track === "trainee"
        ? "trainee"
        : ("internship" as "internship" | "trainee"),
    department: offer?.department || application.jobDepartment || "",
    startDate: toDateInput(offer?.startDate),
    endDate: toDateInput(offer?.endDate),
    durationMonths:
      offer?.durationMonths != null ? String(offer.durationMonths) : "3",
    stipend: offer?.stipend != null ? String(offer.stipend) : "",
    workMode:
      offer?.workMode === "remote" ||
      offer?.workMode === "onsite" ||
      offer?.workMode === "hybrid"
        ? offer.workMode
        : "hybrid",
    location: offer?.location || "",
    mentorName: offer?.mentorName || "",
    offerValidUntil: toDateInput(offer?.offerValidUntil),
    candidateAddress:
      offer?.candidateAddress || application.currentCity || "",
    subjectLine:
      offer?.subjectLine ||
      `Offer of Internship / Trainee Engagement — ${roleTitle}`,
    greeting:
      offer?.greeting || `Dear ${application.candidateName},`,
    introParagraph:
      offer?.introParagraph ||
      `We are pleased to offer you an internship / trainee engagement as ${roleTitle} in the ${
        offer?.department || application.jobDepartment || "team"
      } team at ${OFFER_BRAND.companyName}. This letter confirms the key terms of your engagement with us.`,
    bodyParagraph:
      offer?.bodyParagraph ||
      (Array.isArray(offer?.bodyParagraphs)
        ? offer.bodyParagraphs.join("\n\n")
        : ""),
    closingParagraph:
      offer?.closingParagraph ||
      "Please confirm acceptance by replying to this email on or before the validity date below. We look forward to having you on the team.",
    conditionsText: conditionsToText(offer?.conditions),
    signatoryName: offer?.signatoryName || OFFER_BRAND.signatoryName,
    signatoryTitle: offer?.signatoryTitle || OFFER_BRAND.signatoryTitle,
    companyAddress: offer?.companyAddress || OFFER_BRAND.companyAddress,
    signatureImageUrl: offer?.signatureImageUrl || "",
    signatureImageFileId: offer?.signatureImageFileId || "",
    sendEmail: true,
  };
}

export function formToOfferPayload(form: OfferFormState) {
  const conditions = parseConditions(form.conditionsText);
  return {
    roleTitle: form.roleTitle || undefined,
    track: form.track,
    department: form.department || null,
    startDate: form.startDate,
    endDate: form.endDate,
    durationMonths: form.durationMonths
      ? Number(form.durationMonths)
      : null,
    stipend: form.stipend === "" ? null : Number(form.stipend),
    workMode: form.workMode,
    location: form.location || null,
    mentorName: form.mentorName || null,
    offerValidUntil: form.offerValidUntil || null,
    candidateAddress: form.candidateAddress || null,
    subjectLine: form.subjectLine || null,
    greeting: form.greeting || null,
    introParagraph: form.introParagraph || null,
    bodyParagraph: form.bodyParagraph || null,
    closingParagraph: form.closingParagraph || null,
    conditions: conditions.length ? conditions : DEFAULT_OFFER_CONDITIONS,
    signatoryName: form.signatoryName || null,
    signatoryTitle: form.signatoryTitle || null,
    companyAddress: form.companyAddress || null,
    signatureImageUrl: form.signatureImageUrl || null,
    signatureImageFileId: form.signatureImageFileId || null,
    sendEmail: form.sendEmail,
  };
}

/** Client-side HTML mirror of Backend/templates/documents/offer-letter.html */
export function buildOfferPreviewHtml(
  application: Application,
  form: OfferFormState
) {
  const companyName = OFFER_BRAND.companyName;
  const companyLegalName = OFFER_BRAND.companyLegalName;
  const companyAddress = form.companyAddress || OFFER_BRAND.companyAddress;
  const signatoryName = form.signatoryName || OFFER_BRAND.signatoryName;
  const signatoryTitle = form.signatoryTitle || OFFER_BRAND.signatoryTitle;
  const logoUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/logo.png`
      : OFFER_BRAND.logoUrl;
  const roleTitle = form.roleTitle || "Internship Trainee";
  const department = form.department || "—";
  const offerValidUntil = formatDisplayDate(form.offerValidUntil || null);
  const letterDate = formatDisplayDate(new Date().toISOString());
  const offerRef = `SD-OFF-${new Date().getFullYear()}-${(application.id || "")
    .slice(0, 8)
    .toUpperCase()}`;
  const subjectLine =
    form.subjectLine ||
    `Offer of Internship / Trainee Engagement — ${roleTitle}`;
  const greeting =
    form.greeting || `Dear ${application.candidateName},`;

  const paragraphs: string[] = [];
  if (form.introParagraph.trim()) paragraphs.push(form.introParagraph.trim());
  if (form.bodyParagraph.trim()) paragraphs.push(form.bodyParagraph.trim());
  if (form.closingParagraph.trim()) {
    paragraphs.push(
      form.closingParagraph
        .trim()
        .replace(/the validity date below/i, offerValidUntil)
    );
  }

  const conditions = parseConditions(form.conditionsText);
  const conditionsHtml = (conditions.length
    ? conditions
    : DEFAULT_OFFER_CONDITIONS
  )
    .map(
      (text, i) =>
        `<li><span class="cond-num">${i + 1}.</span> ${escapeHtml(text)}</li>`
    )
    .join("\n");

  const addressHtml = form.candidateAddress.trim()
    ? `<br />${escapeHtml(form.candidateAddress.trim())}`
    : "";

  const logoBlock = `<img class="logo" src="${escapeHtml(
    logoUrl
  )}" alt="${escapeHtml(companyName)}" />`;

  const signatureImageBlock = form.signatureImageUrl.trim()
    ? `<div class="sign-pad"><img class="signature-img" src="${escapeHtml(
        form.signatureImageUrl.trim()
      )}" alt="Authorized signature" /></div>`
    : `<div class="sign-pad is-empty" aria-hidden="true"></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      color: #0b0f19;
      font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
      font-size: 11px;
      line-height: 1.55;
      background: #fff;
    }
    .page { padding: 28px 32px; }
    .letterhead { display: table; width: 100%; border-collapse: collapse; }
    .letterhead-left, .letterhead-right { display: table-cell; vertical-align: middle; }
    .letterhead-left { width: 62%; }
    .letterhead-right { width: 38%; text-align: right; }
    .brand-wrap { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; min-width: 0; }
    .logo { height: 44px; width: auto; max-width: 200px; object-fit: contain; display: block; }
    .brand-fallback { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; color: #0b0f19; line-height: 1.15; }
    .brand-address { font-size: 9.5px; color: #667085; line-height: 1.35; max-width: 280px; }
    .doc-meta { font-size: 10px; color: #475467; line-height: 1.55; }
    .doc-meta .meta-row { white-space: nowrap; }
    .doc-meta .meta-label { display: inline-block; min-width: 36px; color: #98a2b3; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; font-size: 8.5px; }
    .doc-meta strong { color: #0b0f19; font-weight: 600; }
    .rule-stack { margin: 14px 0 20px; }
    .rule-navy { height: 1px; background: #0b0f19; border: 0; margin: 0; padding: 0; }
    .rule-accent { height: 3px; width: 96px; background: #3882f6; margin: 2px 0 0; border: 0; padding: 0; }
    .doc-title { margin: 0 0 4px; font-size: 16px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #0b0f19; line-height: 1.2; }
    .subject { margin: 0 0 16px; font-size: 11px; color: #344054; }
    .subject strong { color: #0b0f19; font-weight: 600; }
    .to-block { margin: 0 0 14px; padding: 10px 12px; background: #f8fafc; border-left: 2.5px solid #3882f6; font-size: 11px; line-height: 1.5; }
    .to-block .label { font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #98a2b3; margin-bottom: 3px; font-weight: 600; }
    .to-block strong { font-size: 12px; color: #0b0f19; }
    .to-block .to-detail { color: #475467; }
    .greeting { margin: 0 0 10px; font-size: 11.5px; }
    p { margin: 0 0 9px; color: #344054; }
    .section-title { margin: 16px 0 8px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #0b0f19; }
    table.terms { width: 100%; border-collapse: collapse; margin: 0 0 14px; font-size: 10.5px; }
    table.terms th, table.terms td { text-align: left; padding: 6px 10px; border: 0.5px solid #e4e7ec; vertical-align: top; }
    table.terms th { width: 32%; background: #f8fafc; font-weight: 600; color: #475467; }
    table.terms td { color: #0b0f19; }
    table.terms tr:nth-child(even) td { background: #fcfcfd; }
    ol.conditions { margin: 0 0 12px; padding: 0; list-style: none; }
    ol.conditions li { display: flex; gap: 8px; margin: 0 0 6px; color: #344054; font-size: 10.5px; line-height: 1.5; }
    .cond-num { flex: 0 0 16px; font-weight: 700; color: #3882f6; font-size: 10px; }
    .acceptance { margin: 12px 0 10px; padding: 9px 11px; background: #f0f6ff; border: 0.5px solid #d6e4ff; border-left: 2.5px solid #3882f6; font-size: 10px; color: #344054; line-height: 1.5; }
    .sincerely { margin: 14px 0 0; color: #344054; }
    .sign { margin-top: 28px; display: table; width: 100%; border-collapse: separate; border-spacing: 28px 0; table-layout: fixed; }
    .sign-block { display: table-cell; width: 50%; vertical-align: top; font-size: 10.5px; }
    .sign-label { font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #98a2b3; font-weight: 600; margin: 0 0 10px; }
    .sign-pad { height: 64px; display: flex; align-items: flex-end; justify-content: flex-start; margin: 0 0 6px; padding: 4px 6px; background: #fafbfc; border: 0.5px solid #eef0f3; overflow: hidden; }
    .sign-pad.is-empty { background: transparent; border-style: dashed; border-color: #e4e7ec; }
    .signature-img { display: block; max-width: 150px; width: auto; max-height: 56px; height: auto; object-fit: contain; object-position: left bottom; mix-blend-mode: multiply; }
    .sign-rule { height: 0; border: 0; border-top: 1px solid #d0d5dd; margin: 0 0 8px; padding: 0; width: 100%; max-width: 200px; background: none; }
    .sign-identity strong { display: block; font-size: 11.5px; color: #0b0f19; font-weight: 700; line-height: 1.3; }
    .sign-identity .title { color: #667085; margin-top: 1px; font-size: 10px; line-height: 1.35; }
    .footer { margin-top: 28px; padding-top: 8px; border-top: 0.5px solid #e4e7ec; font-size: 8.5px; color: #98a2b3; line-height: 1.45; }
  </style>
</head>
<body>
  <div class="page">
    <div class="letterhead">
      <div class="letterhead-left">
        <div class="brand-wrap">
          ${logoBlock}
          <div class="brand-meta">
            <div class="brand-address">${escapeHtml(companyAddress)}</div>
          </div>
        </div>
      </div>
      <div class="letterhead-right">
        <div class="doc-meta">
          <div class="meta-row"><span class="meta-label">Date</span> <strong>${escapeHtml(letterDate)}</strong></div>
          <div class="meta-row"><span class="meta-label">Ref</span> <strong>${escapeHtml(offerRef)}</strong></div>
        </div>
      </div>
    </div>
    <div class="rule-stack">
      <div class="rule-navy"></div>
      <div class="rule-accent"></div>
    </div>
    <h1 class="doc-title">Offer Letter</h1>
    <p class="subject"><strong>Subject:</strong> ${escapeHtml(subjectLine)}</p>
    <div class="to-block">
      <div class="label">To</div>
      <strong>${escapeHtml(application.candidateName)}</strong><br />
      <span class="to-detail">${escapeHtml(application.email)}${addressHtml}</span>
    </div>
    <p class="greeting">${escapeHtml(greeting)}</p>
    ${paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n")}
    <p class="section-title">Terms of engagement</p>
    <table class="terms">
      <tr><th>Role / track</th><td>${escapeHtml(roleTitle)} (${escapeHtml(form.track)})</td></tr>
      <tr><th>Department</th><td>${escapeHtml(department)}</td></tr>
      <tr><th>Duration</th><td>${escapeHtml(durationLabel(form.durationMonths, form.startDate, form.endDate))}</td></tr>
      <tr><th>Start date</th><td>${escapeHtml(formatDisplayDate(form.startDate || null))}</td></tr>
      <tr><th>End date</th><td>${escapeHtml(formatDisplayDate(form.endDate || null))}</td></tr>
      <tr><th>Stipend</th><td>${escapeHtml(formatStipend(form.stipend))}</td></tr>
      <tr><th>Work mode</th><td>${escapeHtml(form.workMode || "—")}</td></tr>
      <tr><th>Location</th><td>${escapeHtml(form.location || "—")}</td></tr>
      <tr><th>Reporting mentor</th><td>${escapeHtml(form.mentorName || "—")}</td></tr>
      <tr><th>Offer valid until</th><td>${escapeHtml(offerValidUntil)}</td></tr>
    </table>
    <p class="section-title">Terms &amp; conditions</p>
    <ol class="conditions">${conditionsHtml}</ol>
    <div class="acceptance">
      By accepting this offer (replying to the offer email or signing below), you acknowledge that you have read, understood, and agree to the terms stated in this letter.
    </div>
    <p class="sincerely">Sincerely,</p>
    <div class="sign">
      <div class="sign-block">
        <div class="sign-label">For ${escapeHtml(companyName)}</div>
        ${signatureImageBlock}
        <div class="sign-rule"></div>
        <div class="sign-identity">
          <strong>${escapeHtml(signatoryName)}</strong>
          <div class="title">${escapeHtml(signatoryTitle)}</div>
          <div class="title">${escapeHtml(companyName)}</div>
        </div>
      </div>
      <div class="sign-block">
        <div class="sign-label">Candidate acknowledgement</div>
        <div class="sign-pad is-empty" aria-hidden="true"></div>
        <div class="sign-rule"></div>
        <div class="sign-identity">
          <strong>${escapeHtml(application.candidateName)}</strong>
          <div class="title">Signature &amp; date</div>
        </div>
      </div>
    </div>
    <div class="footer">
      Issued by ${escapeHtml(companyLegalName)} · ${escapeHtml(companyAddress)} · Ref ${escapeHtml(offerRef)}
    </div>
  </div>
</body>
</html>`;
}

export function hasOfferContent(offer?: ApplicationOffer | null) {
  return Boolean(
    offer?.letterUrl ||
      offer?.roleTitle ||
      offer?.startDate ||
      offer?.sentAt
  );
}
