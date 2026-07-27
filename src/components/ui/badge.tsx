import { cn } from "@/lib/utils";

const variants = {
  default: "bg-admin-muted text-admin-text",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  primary: "bg-primary/10 text-primary",
  outline: "border border-admin-border bg-transparent text-admin-text-secondary",
} as const;

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, keyof typeof variants> = {
    published: "success",
    draft: "outline",
    scheduled: "primary",
    review: "warning",
    approved: "primary",
    archived: "default",
    new: "primary",
    contacted: "warning",
    qualified: "success",
    won: "success",
    lost: "danger",
    under_review: "warning",
    shortlisted: "success",
    assessment_invited: "primary",
    assessment_in_progress: "warning",
    assessment_submitted: "primary",
    interview: "primary",
    offered: "warning",
    hired: "success",
    completed: "success",
    rejected: "danger",
    invited: "primary",
    identity_pending: "warning",
    in_progress: "warning",
    submitted: "primary",
    expired: "danger",
    void: "default",
    pending: "outline",
    pass: "success",
    fail: "danger",
    retake: "warning",
  };

  return (
    <Badge variant={map[status] || "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function SeoScoreBadge({ score }: { score: number }) {
  const variant =
    score >= 80 ? "success" : score >= 50 ? "warning" : "danger";
  return <Badge variant={variant}>{score}/100</Badge>;
}
