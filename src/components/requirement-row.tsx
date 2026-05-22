"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Props = {
  body: string;
  createdBy: "admin" | "client";
  isCompleted: boolean;
  canToggleComplete: boolean;
  canEdit: boolean;
  onToggle?: () => void;
  onEdit?: (body: string) => void;
  onDelete?: () => void;
};

export function RequirementRow({
  body,
  createdBy,
  isCompleted,
  canToggleComplete,
  canEdit,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  const borderColor =
    createdBy === "admin" ? "border-l-[var(--color-sage)]" : "border-l-[var(--color-pink)]";
  const badgeBg =
    createdBy === "admin" ? "bg-[var(--color-sage)]" : "bg-[var(--color-pink)]";

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-border border-l-4 bg-card p-3",
        borderColor,
        isCompleted && "bg-[var(--color-mint)]/40"
      )}
    >
      <button
        type="button"
        disabled={!canToggleComplete}
        onClick={onToggle}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
          isCompleted
            ? "border-secondary bg-secondary text-white"
            : "border-border bg-card",
          !canToggleComplete && "cursor-default opacity-80"
        )}
        aria-label={isCompleted ? "Completed" : "Not completed"}
      >
        {isCompleted && <Check className="h-3 w-3" />}
      </button>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded px-2 py-0.5 text-xs font-medium text-white",
              badgeBg
            )}
          >
            {createdBy === "admin" ? "From your team" : "From you"}
          </span>
        </div>
        {canEdit ? (
          <input
            defaultValue={body}
            onBlur={(e) => {
              if (e.target.value.trim() !== body && onEdit) {
                onEdit(e.target.value.trim());
              }
            }}
            className={cn(
              "w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-sm focus:border-border focus:bg-card focus:outline-none",
              isCompleted && "line-through text-foreground/60"
            )}
          />
        ) : (
          <p
            className={cn(
              "text-sm",
              isCompleted && "line-through text-foreground/60"
            )}
          >
            {body}
          </p>
        )}
      </div>
      {onDelete && canEdit && (
        <button
          type="button"
          onClick={onDelete}
          className="text-xs text-foreground/50 hover:text-foreground"
        >
          Remove
        </button>
      )}
    </div>
  );
}
