/**
 * HELLO Super Admin Centralized Theme Tokens
 * Mandatory Design System Specification for Super Admin Console & Portals
 * Single source of truth for colors, typography, spacing, components, and responsive design.
 */

export const helloBrandTokens = {
  colors: {
    // Brand Core
    primary: "#0076D7",       // Vibrant Royal Blue (Primary actions, links, active states)
    primaryDark: "#0056B8",   // Deep Blue (Hover/pressed state anchor)
    primaryLight: "#1689ED",  // Bright Blue (Highlights, subtle active tint)
    accent: "#FF6B35",        // Dynamic Orange (Brand accents, high-priority highlights)
    accentHover: "#E5531E",   // Deepened Orange for hover states

    // Midnight Navy for Enterprise Sidebar & Headings
    navy: "#0B1220",          // Midnight Charcoal for sidebar & headings
    navySurface: "#131E32",   // Slightly elevated midnight surface
    navyBorder: "#1C2C4A",    // Subtle dark border for dividers

    // Neutral Text Hierarchy
    textPrimary: "#0B1220",   // High-contrast heading and body text
    textSecondary: "#64748B", // Slate muted label and descriptor text
    textTertiary: "#94A3B8",  // Placeholder, inactive icon, and caption text
    textWhite: "#FFFFFF",     // Contrasting white text for dark surfaces

    // Background & Surfaces
    background: "#F8FAFC",    // Crisp light Slate-50 admin workspace backdrop
    surface: "#FFFFFF",       // Pure White for cards, panels, inputs, modals
    surfaceHover: "#F1F5F9",  // Subtle slate hover background
    border: "#E2E8F0",        // Standard clean slate divider and input border
    borderFocus: "#0076D7",   // Active focus ring color

    // Semantic Status Tokens
    success: "#16A34A",       // Approved, published, active green
    successLight: "#ECFDF5",  // Green-50 subtle background
    successBorder: "#BBF7D0", // Green-200 border
    error: "#DC2626",         // Rejected, danger, destructive red
    errorLight: "#FEF2F2",    // Red-50 subtle background
    errorBorder: "#FECACA",   // Red-200 border
    warning: "#F59E0B",       // Pending, review, caution amber
    warningLight: "#FFFBEB",  // Amber-50 subtle background
    warningBorder: "#FDE68A", // Amber-200 border
    info: "#0284C7",          // Informational cyan-blue
    infoLight: "#F0F9FF",     // Blue-50 subtle background
  },

  typography: {
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",

    weights: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
    },

    sizes: {
      display: 40,
      h1: 32,
      h2: 26,
      h3: 22,
      h4: 18,
      bodyLarge: 18,
      body: 14,
      bodySmall: 12,
      button: 16,
      buttonSmall: 14,
      label: 14,
      labelSmall: 12,
      caption: 11,
      micro: 10,
    },

    lineHeights: {
      tight: "1.15",
      snug: "1.25",
      normal: "1.5",
      relaxed: "1.65",
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    section: 48,
    hero: 64,
  },

  radius: {
    small: 6,
    medium: 10,
    large: 16,
    extraLarge: 24,
    pill: 999,
  },

  shadows: {
    card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
    cardElevated: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
    dropdown: "0 10px 30px -5px rgba(11, 18, 32, 0.12), 0 4px 6px -2px rgba(11, 18, 32, 0.04)",
    modal: "0 25px 50px -12px rgba(11, 18, 32, 0.25)",
    buttonPrimary: "0 4px 14px 0 rgba(0, 118, 215, 0.35)",
    phoneDevice: "0 25px 60px -12px rgba(0, 0, 0, 0.35)",
  },

  // Component-Specific Standardized UI Tokens
  components: {
    buttons: {
      primary: {
        bg: "linear-gradient(to right, #0076D7, #0067CA)",
        hoverBg: "linear-gradient(to right, #0067CA, #0056B8)",
        text: "#FFFFFF",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: "600",
        borderRadius: "999px",
      },
      secondary: {
        bg: "#FFFFFF",
        hoverBg: "#F8FAFC",
        border: "#E2E8F0",
        text: "#0076D7",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: "600",
        borderRadius: "999px",
      },
      danger: {
        bg: "#DC2626",
        hoverBg: "#B91C1C",
        text: "#FFFFFF",
        borderRadius: "8px",
      },
      approve: {
        bg: "#16A34A",
        hoverBg: "#15803D",
        text: "#FFFFFF",
        borderRadius: "8px",
      },
    },

    inputs: {
      height: "44px",
      bg: "#FFFFFF",
      border: "#E2E8F0",
      focusBorder: "#0076D7",
      focusRing: "rgba(0, 118, 215, 0.12)",
      text: "#0B1220",
      placeholder: "#94A3B8",
      borderRadius: "10px",
      fontFamily: "'Poppins', sans-serif",
    },

    tables: {
      headerBg: "#F8FAFC",
      headerText: "#64748B",
      headerFontWeight: "600",
      bodyText: "#0B1220",
      rowHover: "#F8FAFC",
      border: "#E2E8F0",
      cellPadding: "12px 16px",
    },

    cards: {
      bg: "#FFFFFF",
      border: "#E2E8F0",
      borderRadius: "16px",
      shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
      padding: "24px",
    },

    modals: {
      backdrop: "rgba(11, 18, 32, 0.6)",
      surface: "#FFFFFF",
      borderRadius: "20px",
      shadow: "0 25px 50px -12px rgba(11, 18, 32, 0.25)",
      headerBorder: "#E2E8F0",
    },

    skeletons: {
      bg: "#E2E8F0",
      shimmer: "linear-gradient(90deg, rgba(226,232,240,0) 0%, rgba(255,255,255,0.6) 50%, rgba(226,232,240,0) 100%)",
      borderRadius: "8px",
    },
  },
} as const;

export type HelloBrandTokens = typeof helloBrandTokens;
