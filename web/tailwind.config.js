/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F8FAFC",
        "canvas-soft": "#F1F5F9",
        surface: "#FFFFFF",
        "surface-soft": "#F8FAFC",
        border: "#E2E8F0",
        "border-subtle": "#EDF2F7",
        brand: {
          cyan: "#38BDF8",
          "cyan-light": "#F0F9FF",
          indigo: "#0F172A",
          "indigo-light": "#F1F5F9",
          "indigo-dark": "#020617",
          gradient: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        },
        dark: {
          950: "#090D16",
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
          600: "#475569",
        },
        muted: "#64748B",
        "muted-light": "#94A3B8",
        accent: {
          amber: "#F59E0B",
          emerald: "#10B981",
          rose: "#EF4444",
        },
      },
      fontFamily: {
        heading: [
          '"Plus Jakarta Sans"',
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        sans: [
          '"Plus Jakarta Sans"',
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        serif: ['"Plus Jakarta Sans"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      borderRadius: {
        card: "18px",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 2px 12px -2px rgba(15, 23, 42, 0.04), 0 1px 3px -1px rgba(15, 23, 42, 0.02)",
        float:
          "0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)",
        brand: "0 4px 20px -2px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};
