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
          hover: "#005FAE",
          light: "#EBF5FF",
        },
        accent: {
          DEFAULT: "#FF6B35",
          hover: "#E5531E",
          light: "#FFF2EB",
        },
        dark: {
          DEFAULT: "#0B1220",
          surface: "#131E32",
        },
        success: {
          DEFAULT: "#16A34A",
          light: "#ECFDF5",
        },
      },
    },
  },
  plugins: [],
};
export default config;

