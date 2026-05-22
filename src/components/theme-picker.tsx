"use client";

import { THEME_PRESETS, type ThemePreset } from "@/lib/theme-presets";
import type { ThemeConfig } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props = {
  value: ThemeConfig;
  onChange: (theme: ThemeConfig) => void;
  disabled?: boolean;
};

const CUSTOM_KEYS = [
  "background",
  "foreground",
  "primary",
  "secondary",
  "accent",
  "muted",
  "border",
  "card",
] as const;

export function ThemePicker({ value, onChange, disabled }: Props) {
  const [tab, setTab] = useState<"preset" | "custom" | "developer">(value.mode);
  const [devOpen, setDevOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["preset", "custom", "developer"] as const).map((t) => (
          <button
            key={t}
            type="button"
            disabled={disabled}
            onClick={() => {
              setTab(t);
              if (t === "preset") {
                onChange({
                  mode: "preset",
                  presetId: value.presetId ?? "blush-classic",
                });
              } else if (t === "custom") {
                onChange({ mode: "custom", colors: value.colors ?? {} });
              } else {
                onChange({
                  mode: "developer",
                  developerVars: value.developerVars ?? {},
                });
              }
            }}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium",
              tab === t
                ? "bg-primary text-white"
                : "bg-muted text-foreground hover:opacity-90"
            )}
          >
            {t === "preset" ? "Presets" : t === "custom" ? "Custom colors" : "Developer"}
          </button>
        ))}
      </div>

      {tab === "preset" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {THEME_PRESETS.map((preset) => (
            <PresetSwatch
              key={preset.id}
              preset={preset}
              selected={value.presetId === preset.id}
              disabled={disabled}
              onSelect={() =>
                onChange({ mode: "preset", presetId: preset.id })
              }
            />
          ))}
        </div>
      )}

      {tab === "custom" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {CUSTOM_KEYS.map((key) => (
            <div key={key}>
              <Label className="capitalize">{key}</Label>
              <div className="mt-1 flex gap-2">
                <input
                  type="color"
                  disabled={disabled}
                  value={value.colors?.[key] ?? "#F9E4E4"}
                  onChange={(e) =>
                    onChange({
                      mode: "custom",
                      colors: { ...value.colors, [key]: e.target.value },
                    })
                  }
                  className="h-10 w-12 cursor-pointer rounded border border-border"
                />
                <Input
                  disabled={disabled}
                  value={value.colors?.[key] ?? ""}
                  onChange={(e) =>
                    onChange({
                      mode: "custom",
                      colors: { ...value.colors, [key]: e.target.value },
                    })
                  }
                  placeholder="#hex"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "developer" && (
        <div>
          <button
            type="button"
            className="text-sm font-medium text-foreground/70 underline"
            onClick={() => setDevOpen(!devOpen)}
          >
            Developer choice — CSS variables
          </button>
          {devOpen && (
            <div className="mt-3 space-y-2">
              {[
                "--background",
                "--foreground",
                "--primary",
                "--secondary",
                "--accent",
                "--muted",
                "--border",
                "--card",
              ].map((v) => (
                <div key={v} className="flex flex-col gap-1 sm:flex-row sm:items-center">
                  <Label className="sm:w-40">{v}</Label>
                  <Input
                    disabled={disabled}
                    placeholder="#hex or valid CSS color"
                    value={value.developerVars?.[v] ?? ""}
                    onChange={(e) =>
                      onChange({
                        mode: "developer",
                        developerVars: {
                          ...value.developerVars,
                          [v]: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PresetSwatch({
  preset,
  selected,
  disabled,
  onSelect,
}: {
  preset: ThemePreset;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "rounded-lg border-2 p-2 text-left transition-colors",
        selected ? "border-primary" : "border-border"
      )}
    >
      <div className="mb-2 flex h-8 overflow-hidden rounded">
        {Object.values(preset.colors)
          .slice(0, 4)
          .map((c, i) => (
            <div key={i} className="flex-1" style={{ background: c }} />
          ))}
      </div>
      <span className="text-xs font-medium">{preset.name}</span>
    </button>
  );
}
