export const COLORS = {
  // Primary Canvases & Surfaces (Ultra-clean Light Slate Theme)
  bgDark: "#F8FAFC",          // Slate 50: Canvas background
  bgSurface: "#FFFFFF",       // Pure White: Primary elevated card surface
  bgSurfaceSubtle: "#F1F5F9", // Slate 100: Secondary card / container surface
  cardDark: "#FFFFFF",
  cardDarkHover: "#F8FAFC",
  cardCream: "#F8FAFC",
  canvasSoft: "#F1F5F9",
  surfaceLight: "#FFFFFF",
  
  // Brand Palette (High-End Deep Slate & Graphite - No cheap neon purple/blue)
  brandIndigo: "#0F172A",      // Slate 900: Primary CTA & key interactive highlights
  brandIndigoDark: "#020617",  // Slate 950: Pressed state
  brandIndigoLight: "#F1F5F9", // Slate 100: Soft active pills & backgrounds
  brandIndigoSubtle: "rgba(15, 23, 42, 0.04)",
  brandCyan: "#334155",        // Slate 700: Secondary accents & meta
  brandCyanLight: "#F8FAFC",   // Slate 50: Soft info pills
  brandCyanSubtle: "rgba(51, 65, 85, 0.04)",
  
  accentLime: "#0F172A",
  accentCyan: "#334155",
  accentPurple: "#475569",
  
  // High-Contrast Modern Typography Scale
  textDark: "#0F172A",        // Slate 900: High-emphasis titles & headings
  textWhite: "#0F172A",
  textPrimary: "#0F172A",
  textSecondary: "#334155",    // Slate 700: Body copy & form labels
  textMuted: "#64748B",        // Slate 500: Subtitles, timestamps & meta labels
  textDim: "#94A3B8",          // Slate 400: Placeholder & disabled text
  textInverse: "#FFFFFF",      // Pure White: Text inside dark buttons
  
  // Borders, Dividers & Outlines
  borderDark: "#E2E8F0",       // Slate 200: Standard hairline border
  borderSubtle: "#F1F5F9",     // Slate 100: Soft inner dividers
  borderFocus: "#0F172A",      // Slate 900: Focused input borders
  borderLight: "#CBD5E1",      // Slate 300: Hover / active borders
  
  // Semantic Status Colors
  success: "#10B981",          // Emerald 500: Payouts, active escrow, verified
  successBg: "#ECFDF5",        // Emerald 50: Soft badge background
  successBorder: "#A7F3D0",
  
  warning: "#F59E0B",          // Amber 500: Pending review, warnings
  warningBg: "#FFFBEB",        // Amber 50: Soft badge background
  warningBorder: "#FDE68A",
  
  danger: "#EF4444",           // Red 500: Rejected, withdrawals, errors
  dangerBg: "#FEF2F2",         // Red 50: Soft badge background
  dangerBorder: "#FECACA",
  
  info: "#0F172A",             // Slate 900: General info
  infoBg: "#F1F5F9",
  infoBorder: "#E2E8F0",
};

export const SHADOWS = {
  sm: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  brandGlow: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
};