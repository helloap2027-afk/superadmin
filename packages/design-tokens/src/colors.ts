/**
 * HELLO Design System Color Tokens
 * Brand Positioning: "Discover Local. Connect Instantly."
 */

export const colors = {
  brand: {
    primary: "#0076D7",       // Energetic Royal Blue - Primary brand, interactive links & buttons
    primaryHover: "#005FAE",
    primaryLight: "#EBF5FF",  // Background tint for verified badges and pills

    accent: "#FF6B35",        // Dynamic Orange - Action items, CTA buttons & instant enquiry
    accentHover: "#E5531E",
    accentLight: "#FFF2EB",

    dark: "#0B1220",          // Midnight Charcoal - Headers, admin sidebar & high contrast text
    darkSurface: "#131E32",   // Admin card surface
    darkBorder: "#24324D",

    success: "#16A34A",       // Emerald Green - Verified checkmarks, WhatsApp connect, Live Now
    successHover: "#15803D",
    successLight: "#ECFDF5",

    warning: "#F59E0B",       // Amber - Under Review status
    warningLight: "#FFFBEB",

    danger: "#EF4444",        // Crimson - Rejected, error states, delete
    dangerLight: "#FEF2F2",

    bgBase: "#F8FAFC",        // Clean Slate Background
    surfaceWhite: "#FFFFFF",
    borderSlate: "#E2E8F0",
    textPrimary: "#0F172A",
    textMuted: "#64748B",
    textDisabled: "#94A3B8"
  }
} as const;

export type ColorToken = typeof colors;
