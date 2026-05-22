"use client";

import {
  addDesignReference,
  addMilestone,
  addRequirement,
  clientLogout,
  deleteDesignReference,
  deleteRequirement,
  updateClientPreferences,
  updateMilestoneTitle,
  updateRequirementBody,
} from "@/actions/projects";
import { DesignReferences } from "@/components/design-references";
import { MilestoneCard } from "@/components/milestone-card";
import { ProjectThemeStyle } from "@/components/project-theme";
import { ProgressBar } from "@/components/progress-bar";
import { ThemePicker } from "@/components/theme-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import type { ThemeConfig } from "@/db/schema";
import { TECH_STACK_OPTIONS } from "@/lib/theme-presets";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type PortalData = NonNullable<
  Awaited<ReturnType<typeof import("@/actions/projects").getProjectForClient>>
>;

export function PortalClient({ data }: { data: PortalData }) {
  const router = useRouter();
  const { project, milestones, designReferences, overallProgress } = data;
  const [tab, setTab] = useState<"progress" | "preferences" | "design">("progress");
  const [techStack, setTechStack] = useState<string[]>(project.techStack ?? []);
  const [theme, setTheme] = useState<ThemeConfig>(project.theme);
  const [newMilestone, setNewMilestone] = useState("");
  const [prefsSaved, setPrefsSaved] = useState(false);

  const toggleStack = (item: string) => {
    setTechStack((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  return (
    <>
      <ProjectThemeStyle theme={theme} />
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-foreground/60">Welcome, {project.clientName}</p>
            <h1 className="text-2xl font-bold">{project.projectName}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.liveSiteUrl ? (
              <a
                href={project.liveSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" className="gap-2">
                  View site live
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            ) : (
              <Button variant="primary" disabled title="Your team will add the live URL">
                View site live
              </Button>
            )}
            <Button
              variant="outline"
              type="button"
              onClick={async () => {
                await clientLogout();
                router.push("/");
              }}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <div className="mb-6">
          <ProgressBar value={overallProgress} label="Overall progress" />
        </div>

        <nav className="mb-8 flex flex-wrap gap-2 border-b border-border pb-4">
          {(
            [
              ["progress", "Progress"],
              ["preferences", "Preferences"],
              ["design", "Design inspiration"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium",
                tab === key ? "bg-primary text-white" : "text-foreground/70 hover:bg-muted"
              )}
            >
              {label}
            </button>
          ))}
        </nav>

        {tab === "progress" && (
          <div className="space-y-6">
            {milestones.map((m) => (
              <MilestoneCard
                key={m.id}
                id={m.id}
                title={m.title}
                progress={m.progress}
                requirements={m.requirements}
                canToggleComplete={false}
                canEdit
                onAddRequirement={async (body) => {
                  await addRequirement(m.id, body, "client");
                  router.refresh();
                }}
                onToggleRequirement={() => {}}
                onEditRequirement={async (id, body) => {
                  await updateRequirementBody(id, body, false);
                  router.refresh();
                }}
                onDeleteRequirement={async (id) => {
                  await deleteRequirement(id, false);
                  router.refresh();
                }}
                onEditTitle={async (title) => {
                  await updateMilestoneTitle(m.id, title, false);
                  router.refresh();
                }}
              />
            ))}
            <Card>
              <form
                className="flex flex-col gap-2 sm:flex-row"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newMilestone.trim()) return;
                  await addMilestone(project.id, newMilestone, "client");
                  setNewMilestone("");
                  router.refresh();
                }}
              >
                <Input
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  placeholder="Add a milestone..."
                />
                <Button type="submit" variant="secondary">
                  Add milestone
                </Button>
              </form>
            </Card>
          </div>
        )}

        {tab === "preferences" && (
          <div className="space-y-8">
            <Card>
              <h2 className="text-lg font-semibold">Technology stack</h2>
              <p className="mt-1 text-sm text-foreground/70">
                Select the technologies you prefer for this project.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {TECH_STACK_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleStack(opt)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm",
                      techStack.includes(opt)
                        ? "bg-secondary text-white"
                        : "border border-border bg-card"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold">Colors and accent</h2>
              <p className="mt-1 text-sm text-foreground/70">
                Choose a palette for your portal view. Your team sees the same project
                data.
              </p>
              <div className="mt-4">
                <ThemePicker
                  value={theme}
                  onChange={setTheme}
                />
              </div>
              <Button
                className="mt-6"
                type="button"
                onClick={async () => {
                  await updateClientPreferences({ techStack, theme });
                  setPrefsSaved(true);
                  setTimeout(() => setPrefsSaved(false), 2000);
                  router.refresh();
                }}
              >
                {prefsSaved ? "Saved" : "Save preferences"}
              </Button>
            </Card>
          </div>
        )}

        {tab === "design" && (
          <DesignReferences
            references={designReferences}
            canEdit
            onAdd={async (d) => {
              await addDesignReference(d);
              router.refresh();
            }}
            onDelete={async (id) => {
              await deleteDesignReference(id);
              router.refresh();
            }}
          />
        )}
      </main>
    </>
  );
}
