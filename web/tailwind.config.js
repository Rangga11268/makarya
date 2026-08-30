/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
          cyan: "#0EA5E9",
          "cyan-light": "#E0F2FE",
          indigo: "#4F46E5",
          "indigo-light": "#EEF2FF",
          "indigo-dark": "#4338CA",
          gradient: "linear-gradient(135deg, #0EA5E9 0%, #4F46E5 100%)",
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
        }
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Syne"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        card: "18px",
        pill: "9999px",
      },
      boxShadow: {
        'card': '0 2px 12px -2px rgba(15, 23, 42, 0.04), 0 1px 3px -1px rgba(15, 23, 42, 0.02)',
        'float': '0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        'brand': '0 4px 20px -2px rgba(79, 70, 229, 0.25)',
      }
    },
  },
  plugins: [],
}