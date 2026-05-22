"use client";

import { getPresetById } from "@/lib/theme-presets";
import type { ThemeConfig } from "@/db/schema";

export function ProjectThemeStyle({ theme }: { theme: ThemeConfig }) {
  const vars: Record<string, string> = {};

  if (theme.mode === "preset" && theme.presetId) {
    const preset = getPresetById(theme.presetId);
    if (preset) {
      vars["--background"] = preset.colors.background;
      vars["--foreground"] = preset.colors.foreground;
      vars["--primary"] = preset.colors.primary;
      vars["--secondary"] = preset.colors.secondary;
      vars["--accent"] = preset.colors.accent;
      vars["--muted"] = preset.colors.muted;
      vars["--border"] = preset.colors.border;
      vars["--card"] = preset.colors.card;
    }
  } else if (theme.mode === "custom" && theme.colors) {
    if (theme.colors.background) vars["--background"] = theme.colors.background;
    if (theme.colors.foreground) vars["--foreground"] = theme.colors.foreground;
    if (theme.colors.primary) vars["--primary"] = theme.colors.primary;
    if (theme.colors.secondary) vars["--secondary"] = theme.colors.secondary;
    if (theme.colors.accent) vars["--accent"] = theme.colors.accent;
    if (theme.colors.muted) vars["--muted"] = theme.colors.muted;
    if (theme.colors.border) vars["--border"] = theme.colors.border;
    if (theme.colors.card) vars["--card"] = theme.colors.card;
  } else if (theme.mode === "developer" && theme.developerVars) {
    Object.assign(vars, theme.developerVars);
  }

  const style = Object.entries(vars)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");

  if (!style) return null;

  return <style>{`:root { ${style} }`}</style>;
}
