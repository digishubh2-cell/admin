"use client";

import { cn } from "@/lib/utils";
import { PIPELINE_STAGES, type ApplicationStatus } from "@/types/application";

const LABELS: Record<string, string> = {
  new: "New",
  under_review: "Review",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offered: "Offer",
  hired: "Hired",
  completed: "Completed",
};

export function PipelineStepper({ status }: { status: ApplicationStatus }) {
  const isTerminal = status === "rejected" || status === "archived";
  const currentIndex = PIPELINE_STAGES.indexOf(
    status as (typeof PIPELINE_STAGES)[number]
  );

  return (
    <div className="space-y-2">
      {isTerminal ? (
        <p className="text-sm text-admin-text-muted capitalize">
          Pipeline closed — {status.replace(/_/g, " ")}
        </p>
      ) : null}
      <ol className="flex flex-wrap gap-1.5">
        {PIPELINE_STAGES.map((stage, index) => {
          const done = !isTerminal && currentIndex > index;
          const active = !isTerminal && currentIndex === index;
          return (
            <li
              key={stage}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium capitalize",
                done && "bg-success/15 text-success",
                active && "bg-primary text-white",
                !done && !active && "bg-admin-muted text-admin-text-muted"
              )}
            >
              {LABELS[stage] || stage}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
