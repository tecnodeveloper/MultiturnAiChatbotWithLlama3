/**
 * Single Source of Truth: Design Tokens for the Analytics Module
 * Brand accent: Orange (#f5a623)
 * Font weights: Regular (400) and Medium (500) only
 */

export const ANALYTICS_TOKENS = {
  // Brand Orange Accent System
  accent: "#f5a623",
  accentHover: "#e09612",
  accentMuted: "rgba(245, 166, 35, 0.12)",
  accentFill: "rgba(245, 166, 35, 0.08)",
  accentBorder: "rgba(245, 166, 35, 0.25)",
  accentSecondary: "rgba(245, 166, 35, 0.65)", // Desaturated accent for comparison series

  // Neutral Gray Ramp for Secondary Series
  neutral: {
    darkest: "#1f2937",
    darker: "#27272a",
    medium: "#3f3f46",
    muted: "#52525b",
    light: "#71717a",
    lighter: "#a1a1aa",
    gridDark: "#1f2937",
    gridLight: "#f1f5f9",
  },

  // Surfaces & Backgrounds
  surface: {
    cardDark: "#161821",
    cardLight: "#ffffff",
    pageDark: "#0f1117",
    pageLight: "#f8fafc",
    borderDark: "#1f2937",
    borderLight: "#e2e8f0",
  },

  // Typography Palette
  text: {
    primaryDark: "#ffffff",
    primaryLight: "#0f172a",
    secondaryDark: "#9ca3af",
    secondaryLight: "#64748b",
    mutedDark: "#6b7280",
    mutedLight: "#94a3b8",
  },
} as const;
