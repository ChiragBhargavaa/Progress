export type ThemePreset = {
  id: string;
  name: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    border: string;
    card: string;
  };
};

const base = {
  mint: "#D1E8E4",
  sage: "#6B847A",
  ink: "#2E2D3A",
  rose: "#B97A95",
  pink: "#EBC2D6",
  blush: "#F9E4E4",
  white: "#FFFFFF",
};

function preset(
  id: string,
  name: string,
  colors: ThemePreset["colors"]
): ThemePreset {
  return { id, name, colors };
}

export const THEME_PRESETS: ThemePreset[] = [
  preset("blush-classic", "Blush Classic", {
    background: base.blush,
    foreground: base.ink,
    primary: base.rose,
    secondary: base.sage,
    accent: base.pink,
    muted: base.mint,
    border: base.pink,
    card: base.white,
  }),
  preset("sage-garden", "Sage Garden", {
    background: base.mint,
    foreground: base.ink,
    primary: base.sage,
    secondary: base.rose,
    accent: base.sage,
    muted: base.blush,
    border: "#B8D4CE",
    card: base.white,
  }),
  preset("rose-studio", "Rose Studio", {
    background: base.pink,
    foreground: base.ink,
    primary: base.rose,
    secondary: base.sage,
    accent: base.rose,
    muted: base.blush,
    border: base.rose,
    card: base.white,
  }),
  preset("ink-minimal", "Ink Minimal", {
    background: base.white,
    foreground: base.ink,
    primary: base.ink,
    secondary: base.sage,
    accent: base.rose,
    muted: base.mint,
    border: "#E8E4EA",
    card: base.blush,
  }),
  preset("mint-breeze", "Mint Breeze", {
    background: "#E8F4F1",
    foreground: base.ink,
    primary: "#5A9A8E",
    secondary: base.sage,
    accent: base.mint,
    muted: base.blush,
    border: base.mint,
    card: base.white,
  }),
  preset("dusty-evening", "Dusty Evening", {
    background: "#EDE8EC",
    foreground: "#1F1E28",
    primary: "#9A6B82",
    secondary: "#5C6B63",
    accent: base.rose,
    muted: "#D8D0D6",
    border: "#C4B8C0",
    card: base.white,
  }),
  preset("soft-contrast", "Soft Contrast", {
    background: base.blush,
    foreground: "#3D3C4A",
    primary: "#8E6B7A",
    secondary: base.sage,
    accent: base.pink,
    muted: base.mint,
    border: "#DFC8D0",
    card: "#FFFBFB",
  }),
  preset("forest-blush", "Forest Blush", {
    background: "#F5EEEF",
    foreground: base.ink,
    primary: "#4F6B5E",
    secondary: base.rose,
    accent: base.sage,
    muted: base.mint,
    border: base.sage,
    card: base.white,
  }),
  preset("petal-light", "Petal Light", {
    background: "#FFF5F7",
    foreground: base.ink,
    primary: base.rose,
    secondary: "#C9A8B5",
    accent: base.pink,
    muted: "#F0E0E6",
    border: base.pink,
    card: base.white,
  }),
  preset("muted-professional", "Muted Professional", {
    background: "#F2F0F3",
    foreground: "#2A2935",
    primary: "#7A6B78",
    secondary: base.sage,
    accent: "#A8B5AE",
    muted: "#E5E2E6",
    border: "#D0CCD4",
    card: base.white,
  }),
  preset("coastal-sage", "Coastal Sage", {
    background: "#E6EFEC",
    foreground: base.ink,
    primary: "#5F7D72",
    secondary: "#8BB5A8",
    accent: base.mint,
    muted: base.blush,
    border: "#A8C9BE",
    card: base.white,
  }),
  preset("warm-rose", "Warm Rose", {
    background: "#FAE8EE",
    foreground: base.ink,
    primary: "#C47894",
    secondary: base.sage,
    accent: base.rose,
    muted: base.pink,
    border: "#E8B8C8",
    card: base.white,
  }),
  preset("pale-workspace", "Pale Workspace", {
    background: "#F8F6F7",
    foreground: base.ink,
    primary: base.rose,
    secondary: base.sage,
    accent: base.mint,
    muted: "#EEECEF",
    border: "#DDD8DC",
    card: base.white,
  }),
  preset("deep-accent", "Deep Accent", {
    background: base.blush,
    foreground: base.ink,
    primary: "#5E4A56",
    secondary: base.sage,
    accent: base.rose,
    muted: base.mint,
    border: "#8A7A84",
    card: base.white,
  }),
  preset("fresh-mint", "Fresh Mint", {
    background: base.mint,
    foreground: "#243530",
    primary: "#3D6B5E",
    secondary: base.rose,
    accent: "#7AB8A8",
    muted: base.blush,
    border: "#9FCEC4",
    card: base.white,
  }),
  preset("blush-noir", "Blush Noir", {
    background: "#3A3845",
    foreground: base.blush,
    primary: base.pink,
    secondary: base.sage,
    accent: base.rose,
    muted: "#524E5C",
    border: "#5C5868",
    card: "#454352",
  }),
  preset("rose-sage-split", "Rose Sage Split", {
    background: base.white,
    foreground: base.ink,
    primary: base.rose,
    secondary: "#5A7568",
    accent: base.sage,
    muted: base.blush,
    border: base.sage,
    card: "#FDF8F9",
  }),
  preset("calm-client", "Calm Client", {
    background: "#F9F4F5",
    foreground: base.ink,
    primary: base.rose,
    secondary: "#B5A8AE",
    accent: base.pink,
    muted: base.mint,
    border: "#E8DDE2",
    card: base.white,
  }),
  preset("studio-neutral", "Studio Neutral", {
    background: "#F4F2F0",
    foreground: "#35343F",
    primary: base.sage,
    secondary: base.rose,
    accent: base.ink,
    muted: "#E8E5E2",
    border: "#D5D0CC",
    card: base.white,
  }),
  preset("design-seeds", "Design Seeds", {
    background: base.blush,
    foreground: base.ink,
    primary: base.rose,
    secondary: base.sage,
    accent: base.mint,
    muted: base.pink,
    border: base.rose,
    card: base.white,
  }),
  preset("developer-slate", "Developer Slate", {
    background: "#ECEAED",
    foreground: "#22212B",
    primary: "#4A5568",
    secondary: base.sage,
    accent: base.rose,
    muted: "#D8D5DA",
    border: "#B8B4BC",
    card: base.white,
  }),
];

export const DEFAULT_PRESET_ID = "blush-classic";

export function getPresetById(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((p) => p.id === id);
}

export const TECH_STACK_OPTIONS = [
  "Next.js",
  "React",
  "Vue",
  "Svelte",
  "WordPress",
  "Shopify",
  "Webflow",
  "Framer",
  "Node.js",
  "Python / Django",
  "Ruby on Rails",
  "PHP / Laravel",
  "Static HTML",
  "Mobile (React Native)",
  "Mobile (Flutter)",
  "Other",
] as const;

export const DESIGN_SOURCE_OPTIONS = [
  { id: "dribbble" as const, label: "Dribbble" },
  { id: "awwwards" as const, label: "Awwwards" },
  { id: "behance" as const, label: "Behance" },
  { id: "pinterest" as const, label: "Pinterest" },
  { id: "siteinspire" as const, label: "Site Inspire" },
  { id: "custom" as const, label: "Other" },
];
