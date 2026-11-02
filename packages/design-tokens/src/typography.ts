export const typography = {
  fontFamily: {
    sans: ["Poppins", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
    telugu: ["Gautami", "Noto Sans Telugu", "sans-serif"],
    mono: ["JetBrains Mono", "monospace"]
  },
  fontSize: {
    display: { size: "36px", lineHeight: "44px", weight: "700" },
    h1: { size: "28px", lineHeight: "36px", weight: "700" },
    h2: { size: "22px", lineHeight: "28px", weight: "600" },
    h3: { size: "18px", lineHeight: "24px", weight: "600" },
    body: { size: "15px", lineHeight: "22px", weight: "400" },
    caption: { size: "13px", lineHeight: "18px", weight: "500" },
    micro: { size: "11px", lineHeight: "14px", weight: "600" }
  }
} as const;

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px"
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px"
} as const;

export const radii = {
  sm: "6px",
  md: "10px",
  lg: "16px",
  xl: "24px",
  full: "9999px"
} as const;
