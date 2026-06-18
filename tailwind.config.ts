import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Manrope", "sans-serif"],
      },
      colors: {
        brand: {
          navy: "#0e2f54",
          blue: "#1f5e95",
          sky: "#60b8f0",
          muted: "#4b5b6b",
          border: "#d7e1ea",
          cream: "#f7f5f1",
        },
      },
    },
  },
  plugins: [],
};

export default config;
