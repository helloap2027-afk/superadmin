import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0076D7",
          dark: "#0056B8",
          light: "#1689ED",
          hover: "#005FAE",
          soft: "#EBF5FF",
        },
        accent: {
          DEFAULT: "#FF6B35",
          hover: "#E5531E",
          light: "#FFF2EB",
        },
        navy: {
          DEFAULT: "#0B1220",
          surface: "#131E32",
          card: "#18243C",
          border: "#1C2C4A",
        },
        dark: {
          DEFAULT: "#0B1220",
          surface: "#131E32",
          card: "#18243C",
          border: "#1C2C4A",
        },
        text: {
          primary: "#0B1220",
          secondary: "#64748B",
          tertiary: "#94A3B8",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          hover: "#F8FAFC",
        },
        app: {
          bg: "#F8FAFC",
          border: "#E2E8F0",
        },
        success: {
          DEFAULT: "#16A34A",
          light: "#ECFDF5",
          border: "#BBF7D0",
        },
        error: {
          DEFAULT: "#DC2626",
          light: "#FEF2F2",
          border: "#FECACA",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FFFBEB",
          border: "#FDE68A",
        },
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        cardElevated: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
        buttonPrimary: "0 4px 14px 0 rgba(0, 118, 215, 0.35)",
        modal: "0 25px 50px -12px rgba(11, 18, 32, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
