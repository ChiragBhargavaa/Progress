"use client";

import {
  addMilestone,
  addRequirement,
  deleteRequirement,
  revealProjectPassword,
  toggleRequirementComplete,
  updateMilestoneTitle,
  updateProject,
  updateRequirementBody,
} from "@/actions/projects";
import { MilestoneCard } from "@/components/milestone-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/progress-bar";
import type { ThemeConfig } from "@/db/schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { calcProgress } from "@/lib/progress";

type Milestone = {
  id: string;
  title: string;
  sortOrder: number;
  createdBy: "admin" | "client";
};

type Requirement = {
  id: string;
  milestoneId: string;
  body: string;
  createdBy: "admin" | "client";
  isCompleted: boolean;
  sortOrder: number;
};

type Project = {
  id: string;
  clientName: string;
  projectName: string;
  liveSiteUrl: string | null;
  techStack: string[];
  theme: ThemeConfig;
};

export function AdminProjectClient({
  project,
  milestones: ms,
  requirements: reqs,
}: {
  project: Project;
  milestones: Milestone[];
  requirements: Requirement[];
}) {
  const router = useRouter();
  const [clientName, setClientName] = useState(project.clientName);
  const [projectName, setProjectName] = useState(project.projectName);
  const [liveUrl, setLiveUrl] = useState(project.liveSiteUrl ?? "");
  const [password, setPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [newMilestone, setNewMilestone] = useState("");
  const [saving, setSaving] = useState(false);

  const allReqs = reqs;
  const overall = calcProgress(allReqs);

  const saveMeta = async () => {
    setSaving(true);
    await updateProject(project.id, {
      clientName,
      projectName,
      liveSiteUrl: liveUrl.trim() || null,
    });
    setSaving(false);
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="text-lg font-semibold">Project details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Client name</Label>
            <Input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              onBlur={saveMeta}
            />
          </div>
          <div>
            <Label>Project name</Label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={saveMeta}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Live site URL</Label>
            <Input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              onBlur={saveMeta}
              placeholder="https://yoursite.com"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={async () => {
              const p = await revealProjectPassword(project.id);
              setPassword(p);
            }}
          >
            Reveal client access code
          </Button>
          {password && (
            <span className="flex items-center gap-2 font-mono text-lg tracking-widest">
              {password}
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(password);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </span>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Preview live site <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
        {saving && <p className="mt-2 text-xs text-foreground/50">Saving...</p>}
      </Card>

      <div>
        <ProgressBar value={overall} label="Overall project progress" />
      </div>

      <div className="space-y-4">
        {ms.map((m) => {
          const mReqs = reqs.filter((r) => r.milestoneId === m.id);
          return (
            <MilestoneCard
              key={m.id}
              id={m.id}
              title={m.title}
              progress={calcProgress(mReqs)}
              requirements={mReqs}
              canToggleComplete
              canEdit
              onAddRequirement={async (body) => {
                await addRequirement(m.id, body, "admin");
                router.refresh();
              }}
              onToggleRequirement={async (id) => {
                await toggleRequirementComplete(id);
                router.refresh();
              }}
              onEditRequirement={async (id, body) => {
                await updateRequirementBody(id, body, true);
                router.refresh();
              }}
              onDeleteRequirement={async (id) => {
                await deleteRequirement(id, true);
                router.refresh();
              }}
              onEditTitle={async (title) => {
                await updateMilestoneTitle(m.id, title, true);
                router.refresh();
              }}
            />
          );
        })}
      </div>

      <Card>
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!newMilestone.trim()) return;
            await addMilestone(project.id, newMilestone, "admin");
            setNewMilestone("");
            router.refresh();
          }}
        >
          <Input
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            placeholder="New milestone title"
          />
          <Button type="submit" variant="secondary">
            Add milestone
          </Button>
        </form>
      </Card>
    </div>
  );
}
