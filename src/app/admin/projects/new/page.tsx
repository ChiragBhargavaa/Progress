"use client";

import { createProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [milestonesText, setMilestonesText] = useState(
    "Discovery\nDesign\nDevelopment\nLaunch"
  );
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (createdPassword) {
    return (
      <main className="mx-auto max-w-lg flex-1 px-6 py-12">
          <Card>
            <h1 className="text-xl font-bold">Project created</h1>
            <p className="mt-2 text-sm text-foreground/70">
              Share this access code with your client. They use it on the client login
              page.
            </p>
            <div className="mt-6 flex items-center gap-2 rounded-lg bg-muted p-4 font-mono text-2xl tracking-widest">
              {createdPassword}
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(createdPassword);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="ml-auto rounded p-2 hover:bg-card"
                aria-label="Copy password"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-secondary" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="mt-6 flex gap-3">
              <Link href="/admin" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back to projects
                </Button>
              </Link>
            </div>
          </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg flex-1 px-6 py-8">
        <Link href="/admin" className="text-sm text-foreground/60 hover:text-foreground">
          Back to projects
        </Link>
        <h1 className="mt-4 text-2xl font-bold">New project</h1>
        <Card className="mt-6">
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError("");
              try {
                const initialMilestones = milestonesText
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean);
                const result = await createProject({
                  clientName,
                  projectName,
                  initialMilestones,
                });
                setCreatedPassword(result.password);
                router.refresh();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to create");
              }
              setLoading(false);
            }}
          >
            <div>
              <Label htmlFor="client">Client name</Label>
              <Input
                id="client"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="project">Project name</Label>
              <Input
                id="project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="milestones">Initial milestones (one per line)</Label>
              <textarea
                id="milestones"
                value={milestonesText}
                onChange={(e) => setMilestonesText(e.target.value)}
                rows={5}
                className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
              />
            </div>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create project and generate access code"}
            </Button>
          </form>
        </Card>
    </main>
  );
}
