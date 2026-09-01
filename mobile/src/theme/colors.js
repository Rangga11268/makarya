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
  
  // Brand Palette (Premium Indigo & Electric Sky)
  brandIndigo: "#4F46E5",      // Indigo 600: Primary CTA & key interactive highlights
  brandIndigoDark: "#4338CA",  // Indigo 700: Pressed state / deep gradient
  brandIndigoLight: "#EEF2FF", // Indigo 50: Soft active pills & backgrounds
  brandIndigoSubtle: "rgba(79, 70, 229, 0.08)",
  brandCyan: "#0EA5E9",        // Sky 500: Secondary accents & active info
  brandCyanLight: "#E0F2FE",   // Sky 50: Soft info pills
  brandCyanSubtle: "rgba(14, 165, 233, 0.08)",
  
  accentLime: "#4F46E5",
  accentCyan: "#0EA5E9",
  accentPurple: "#818CF8",
  
  // High-Contrast Modern Typography Scale
  textDark: "#0F172A",        // Slate 900: High-emphasis titles & headings
  textWhite: "#0F172A",
  textPrimary: "#0F172A",
  textSecondary: "#334155",    // Slate 700: Body copy & form labels
  textMuted: "#64748B",        // Slate 500: Subtitles, timestamps & meta labels
  textDim: "#94A3B8",          // Slate 400: Placeholder & disabled text
  textInverse: "#FFFFFF",      // Pure White: Text inside buttons & dark cards
  
  // Borders, Dividers & Outlines
  borderDark: "#E2E8F0",       // Slate 200: Standard hairline border
  borderSubtle: "#F1F5F9",     // Slate 100: Soft inner dividers
  borderFocus: "#4F46E5",      // Indigo 600: Focused input borders
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
  
  info: "#0EA5E9",             // Sky 500: General info
  infoBg: "#F0F9FF",
  infoBorder: "#BAE6FD",
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
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};