"use client";

import { DESIGN_SOURCE_OPTIONS } from "@/lib/theme-presets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ExternalLink } from "lucide-react";

export type DesignRef = {
  id: string;
  url: string;
  comment: string | null;
  source: string;
};

type Props = {
  references: DesignRef[];
  canEdit: boolean;
  onAdd: (data: { url: string; comment: string; source: string }) => void;
  onDelete: (id: string) => void;
};

export function DesignReferences({ references, canEdit, onAdd, onDelete }: Props) {
  const [url, setUrl] = useState("");
  const [comment, setComment] = useState("");
  const [source, setSource] = useState<string>("dribbble");

  return (
    <div className="space-y-4">
      <p className="text-sm text-foreground/70">
        Share links to work you love from Dribbble, Awwwards, or anywhere else. Add a
        short note about what you like.
      </p>

      {references.length === 0 && (
        <p className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-foreground/60">
          No inspiration links yet.
        </p>
      )}

      <ul className="space-y-3">
        {references.map((ref) => (
          <Card key={ref.id} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <span className="mb-1 inline-block rounded bg-muted px-2 py-0.5 text-xs font-medium capitalize">
                {ref.source}
              </span>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 break-all text-sm font-medium text-primary hover:underline"
              >
                {ref.url}
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </a>
              {ref.comment && (
                <p className="mt-2 text-sm text-foreground/80">{ref.comment}</p>
              )}
            </div>
            {canEdit && (
              <Button variant="ghost" type="button" onClick={() => onDelete(ref.id)}>
                Remove
              </Button>
            )}
          </Card>
        ))}
      </ul>

      {canEdit && (
        <Card>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!url.trim()) return;
              onAdd({ url: url.trim(), comment: comment.trim(), source });
              setUrl("");
              setComment("");
            }}
          >
            <div>
              <Label>Source</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {DESIGN_SOURCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSource(opt.id)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm",
                      source === opt.id
                        ? "bg-secondary text-white"
                        : "bg-muted text-foreground"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="ref-url">Link URL</Label>
              <Input
                id="ref-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://dribbble.com/shots/..."
                required
              />
            </div>
            <div>
              <Label htmlFor="ref-comment">What do you like about this?</Label>
              <Input
                id="ref-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Clean typography, soft colors..."
              />
            </div>
            <Button type="submit" variant="secondary">
              Add inspiration link
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
