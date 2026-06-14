import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0d",
        surface: "#16161a",
        "surface-light": "#1f1f24",
        border: "#2a2a2e",
        cream: "#f5f1e8",
        muted: "#9b9a96",
        reaper: {
          red: "#c1272d",
          gold: "#e3b23c",
        },
      },
      fontFamily: {
        display: ["var(--font-anton)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
