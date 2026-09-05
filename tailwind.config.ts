import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#f3fcf5",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#edf6ef",
        "surface-container": "#e7f0e9",
        "surface-container-high": "#e2eae4",
        "surface-container-highest": "#dce5de",
        "on-surface": "#151d19",
        "on-surface-variant": "#3f4948",
        outline: "#6f7978",
        "outline-variant": "#bfc8c8",

        primary: {
          DEFAULT: "#035657",
          container: "#2a6f6f",
          fixed: "#aceeee",
          dim: "#90d2d2",
        },
        secondary: {
          DEFAULT: "#a43c27",
          container: "#fd7e63",
          fixed: "#ffdad3",
        },
        tertiary: {
          DEFAULT: "#004d94",
          container: "#2d66ae",
          fixed: "#d5e3ff",
        },

        // Semantic Risk Level Colors
        risk: {
          low: "#035657",
          "low-bg": "#e6f4f1",
          moderate: "#d97706",
          "moderate-bg": "#fef3c7",
          high: "#ea580c",
          "high-bg": "#ffedd5",
          critical: "#ba1a1a",
          "critical-bg": "#fee2e2",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        headline: ["var(--font-jakarta)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-gentle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "coral-glow": "coralPulseGlow 3s infinite ease-in-out",
        "radar-ping": "radarRing 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        coralPulseGlow: {
          "0%, 100%": {
            boxShadow: "0 4px 14px rgba(253, 126, 99, 0.32), 0 0 0 0 rgba(253, 126, 99, 0.45)",
          },
          "50%": {
            boxShadow: "0 6px 20px rgba(253, 126, 99, 0.55), 0 0 0 6px rgba(253, 126, 99, 0.0)",
          },
        },
        radarRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.9" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

