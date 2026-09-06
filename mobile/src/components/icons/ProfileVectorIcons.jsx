import React from "react";
import Svg, { Path, Rect, Circle } from "react-native-svg";
import { COLORS } from "../../theme/colors";

/**
 * Program Studi & Jenjang Vector Icon
 * Authentic representation of an academic faculty / curriculum curriculum book with graduation bookmark
 */
export function ProdiVectorIcon({ size = 18, color = COLORS.brandCyan }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Open book base */}
      <Path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bookmark ribbon / curriculum indicator */}
      <Path
        d="M10 2v8l3-2.5 3 2.5V2"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.18"
      />
    </Svg>
  );
}

/**
 * Perguruan Tinggi / Campus Vector Icon
 * Authentic collegiate classical portico pillars representation
 */
export function CampusVectorIcon({ size = 18, color = COLORS.brandIndigo }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Roof pediment triangular top */}
      <Path
        d="M2 10L12 3l10 7H2z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.12"
      />
      {/* Pillars */}
      <Path
        d="M5 10v9M9 10v9M15 10v9M19 10v9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Foundation base */}
      <Path
        d="M2 19h20M1 22h22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Status Akademik / NIM Student Vector Icon
 * Authentic student identity badge / card with lanyard clip
 */
export function AcademicStatusVectorIcon({ size = 18, color = "#F59E0B" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Card Body */}
      <Rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="3"
        stroke={color}
        strokeWidth="2"
        fill={color}
        fillOpacity="0.08"
      />
      {/* Card Clip Slot */}
      <Path
        d="M9 4V2.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5V4"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      {/* Photo Avatar Box */}
      <Circle cx="8.5" cy="11.5" r="2.5" stroke={color} strokeWidth="1.75" />
      {/* Card Info Lines */}
      <Path
        d="M13.5 10h4M13.5 13h3M7 17.5h10"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Authentic GitHub Octocat Vector Icon
 */
export function GithubVectorIcon({ size = 18, color = "#1F2937" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </Svg>
  );
}

/**
 * Authentic Figma Official 5-Segment Vector Icon
 */
export function FigmaVectorIcon({ size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Top Left */}
      <Path
        d="M5 4.5A2.5 2.5 0 0 1 7.5 2H12v5H7.5A2.5 2.5 0 0 1 5 4.5z"
        fill="#F24E1E"
      />
      {/* Top Right */}
      <Path
        d="M12 2h4.5a2.5 2.5 0 1 1 0 5H12V2z"
        fill="#FF7262"
      />
      {/* Middle Left */}
      <Path
        d="M5 9.5A2.5 2.5 0 0 1 7.5 7H12v5H7.5A2.5 2.5 0 0 1 5 9.5z"
        fill="#A259FF"
      />
      {/* Middle Right Circle */}
      <Circle cx="14.5" cy="9.5" r="2.5" fill="#1ABCFE" />
      {/* Bottom Left Teardrop */}
      <Path
        d="M5 14.5A2.5 2.5 0 0 1 7.5 12H12v2.5a2.5 2.5 0 1 1-5 0z"
        fill="#0ACF83"
      />
    </Svg>
  );
}

/**
 * Authentic Globe / Web Vector Icon
 */
export function GlobeVectorIcon({ size = 18, color = COLORS.brandCyan }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <Path
        d="M2 12h20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        stroke={color}
        strokeWidth="2"
      />
    </Svg>
  );
}

/**
 * Authentic LinkedIn Vector Icon
 */
export function LinkedinVectorIcon({ size = 18, color = "#0A66C2" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </Svg>
  );
}

/**
 * Sleek Edit Pencil Vector Icon
 */
export function EditPencilVectorIcon({ size = 16, color = "#FFFFFF" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * WhatsApp Vector Icon
 */
export function WhatsappVectorIcon({ size = 18, color = "#25D366" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.5 9.5c.3.7.8 1.6 1.5 2.3.7.7 1.6 1.2 2.3 1.5l1.2-1.2c.2-.2.5-.2.7-.1.8.4 1.7.7 2.6.8.3 0 .5.3.5.6v2c0 .3-.3.6-.6.6C10.5 16 8 13.5 8 6.6c0-.3.3-.6.6-.6h2c.3 0 .6.2.6.5.1.9.4 1.8.8 2.6.1.2.1.5-.1.7l-1.2 1.2z"
        fill={color}
      />
    </Svg>
  );
}
