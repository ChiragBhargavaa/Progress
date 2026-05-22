"use client";

import { ProgressBar } from "@/components/progress-bar";
import { RequirementRow } from "@/components/requirement-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export type RequirementItem = {
  id: string;
  body: string;
  createdBy: "admin" | "client";
  isCompleted: boolean;
};

type Props = {
  id: string;
  title: string;
  progress: number;
  requirements: RequirementItem[];
  canToggleComplete: boolean;
  canEdit: boolean;
  onAddRequirement: (body: string) => void;
  onToggleRequirement: (id: string) => void;
  onEditRequirement: (id: string, body: string) => void;
  onDeleteRequirement?: (id: string) => void;
  onEditTitle?: (title: string) => void;
};

export function MilestoneCard({
  title,
  progress,
  requirements,
  canToggleComplete,
  canEdit,
  onAddRequirement,
  onToggleRequirement,
  onEditRequirement,
  onDeleteRequirement,
  onEditTitle,
}: Props) {
  const [open, setOpen] = useState(true);
  const [newReq, setNewReq] = useState("");

  return (
    <Card>
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {canEdit && onEditTitle ? (
            <input
              defaultValue={title}
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (v && v !== title) onEditTitle(v);
              }}
              className="w-full border-b border-transparent bg-transparent text-lg font-semibold focus:border-border focus:outline-none"
            />
          ) : (
            <h3 className="text-lg font-semibold">{title}</h3>
          )}
          <div className="mt-3 max-w-md">
            <ProgressBar value={progress} label="Milestone progress" />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 hover:bg-muted/50 md:hidden"
          aria-expanded={open}
        >
          {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="space-y-3">
          {requirements.map((req) => (
            <RequirementRow
              key={req.id}
              body={req.body}
              createdBy={req.createdBy}
              isCompleted={req.isCompleted}
              canToggleComplete={canToggleComplete}
              canEdit={canEdit}
              onToggle={() => onToggleRequirement(req.id)}
              onEdit={(body) => onEditRequirement(req.id, body)}
              onDelete={
                onDeleteRequirement ? () => onDeleteRequirement(req.id) : undefined
              }
            />
          ))}
          {canEdit && (
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                const v = newReq.trim();
                if (!v) return;
                onAddRequirement(v);
                setNewReq("");
              }}
            >
              <Input
                value={newReq}
                onChange={(e) => setNewReq(e.target.value)}
                placeholder="Add a requirement..."
              />
              <Button type="submit" variant="secondary" className="shrink-0">
                Add
              </Button>
            </form>
          )}
        </div>
      )}
    </Card>
  );
}
