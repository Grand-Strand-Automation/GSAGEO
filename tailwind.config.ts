import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          hero: "#002040",
          navy: "#0e2f54",
          dark: "#0a2440",
          blue: "#1f5e95",
          "blue-hover": "#1a5080",
          sky: "#60b8f0",
          muted: "#4b5b6b",
          subtle: "#9AAEBB",
          border: "#d7e1ea",
          cream: "#f7f5f1",
          "cream-dark": "#eae8e4",
          "blue-light": "#e8eff6",
          gold: "#c4a35a",
          "gold-hover": "#b08f45",
          "gold-light": "#f3e8cf",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(14 47 84 / 0.04), 0 1px 2px -1px rgb(14 47 84 / 0.04)",
        "card-md": "0 4px 14px -2px rgb(14 47 84 / 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
