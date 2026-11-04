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
        brand: {
          primary: "#0076D7",
          accent: "#FF6B35",
          dark: "#0B1220",
          success: "#16A34A",
          bg: "#F8FAFC"
        }
      }
    },
  },
  plugins: [],
};
export default config;

