import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        ink: "#0F1E2E",
        body: "#3A4A5C",
        muted: "#5B6B7D",
        surface: "#FFFFFF",
        "surface-alt": "#F3F6F8",
        border: "#DCE3E9",
        "input-border": "#B9C5CF",
        accent: {
          DEFAULT: "#0F766E",
          hover: "#115E59",
          tint: "#E6F4F1",
          "on-dark": "#5EEAD4",
        },
        "on-dark": "#C3CFDA",
        "dark-raised": {
          DEFAULT: "#13263A",
          border: "#22364B",
        },
        highlight: "#FBBF24",
        warn: {
          DEFAULT: "#7A4A00",
          bg: "#FEF0C7",
          bar: "#D97706",
        },
        bad: {
          DEFAULT: "#B42318",
          bg: "#FEF3F2",
        },
        // Legacy brand tokens (admin / results pages)
        brand: {
          hero: "#0F1E2E",
          navy: "#0F1E2E",
          dark: "#0F1E2E",
          blue: "#0F766E",
          "blue-hover": "#115E59",
          sky: "#5EEAD4",
          muted: "#5B6B7D",
          subtle: "#5B6B7D",
          border: "#DCE3E9",
          cream: "#F3F6F8",
          "cream-dark": "#E6EBEF",
          "blue-light": "#E6F4F1",
          gold: "#FBBF24",
          "gold-hover": "#F59E0B",
          "gold-light": "#FEF0C7",
        },
      },
      maxWidth: {
        site: "1200px",
      },
      borderRadius: {
        card: "16px",
        control: "10px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(15 30 46 / 0.04), 0 1px 2px -1px rgb(15 30 46 / 0.04)",
        "card-md": "0 4px 14px -2px rgb(15 30 46 / 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
