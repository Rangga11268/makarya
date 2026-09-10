import React from "react";
import Svg, {
  Path,
  Rect,
  Circle,
  Polyline,
  Line,
  Polygon,
} from "react-native-svg";
import { COLORS } from "../../theme/colors";

/**
 * High-End Monochrome Precision Line-Art Category Icons (Fiverr & iOS Standard)
 * Clean, consistent stroke width (1.6px - 1.8px), zero cheap gradients or saturated colors.
 */

// 1. UI/UX Design & Branding (Precision Canvas & Pen Tool)
export function UiUxVectorIcon({ size = 24, color = COLORS.textDark }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke={color}
        strokeWidth="1.6"
      />
      <Circle cx="8.5" cy="8.5" r="1.5" fill={color} />
      <Path
        d="M21 15l-5-5L5 21"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 14l2-2 4 4"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 2. Web & Coding Development (Clean Browser Monitor + Code Bracket </>)
export function WebCodingVectorIcon({ size = 24, color = COLORS.textDark }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="2"
        y="3"
        width="20"
        height="13"
        rx="2"
        stroke={color}
        strokeWidth="1.6"
      />
      <Path
        d="M7 21h10M12 16v5M8 9.5l-2 2 2 2M16 9.5l2 2-2 2M13 8.5l-2 6"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 3. Mobile App Development (Minimalist Smartphone + Layout Cards)
export function MobileAppVectorIcon({ size = 24, color = COLORS.textDark }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="5"
        y="2"
        width="14"
        height="20"
        rx="2.5"
        stroke={color}
        strokeWidth="1.6"
      />
      <Path
        d="M9 6h6M8 10h8M9 14h4"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <Circle cx="12" cy="18.5" r="0.8" fill={color} />
    </Svg>
  );
}

// 4. Video Reels & Motion Graphics (Film Strip Player Clapper)
export function VideoMotionVectorIcon({ size = 24, color = COLORS.textDark }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="2.5"
        stroke={color}
        strokeWidth="1.6"
      />
      <Polygon points="10 9 15 12 10 15 10 9" fill={color} />
      <Path
        d="M6 5v3M18 5v3M6 16v3M18 16v3"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// 5. Digital Marketing & Ads (Megaphone & Growth Arrow)
export function MarketingVectorIcon({ size = 24, color = COLORS.textDark }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 11l15-6v14L3 13v-2zM18 9h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2M6 13v6a2 2 0 0 0 2 2h1"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 6. Research & Copywriting (Document with Clean Editorial Lines)
export function WritingVectorIcon({ size = 24, color = COLORS.textDark }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Polyline
        points="14 2 14 8 20 8"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1="16"
        y1="13"
        x2="8"
        y2="13"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <Line
        x1="16"
        y1="17"
        x2="8"
        y2="17"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// 7. General Project Brief / Contract (Clipboard Checklist)
export function ProjectBriefVectorIcon({ size = 24, color = COLORS.textDark }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect
        x="8"
        y="2"
        width="8"
        height="4"
        rx="1"
        stroke={color}
        strokeWidth="1.6"
      />
      <Path
        d="M9 12l2 2 4-4"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 17h6"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Universal Category Icon Resolver
 */
export function renderProjectCategoryVectorIcon(
  category = "",
  titleOrSize = "",
  sizeOrColor = 22,
  overrideColor = null,
) {
  let title = "";
  let size = 22;
  let color = null;

  if (typeof titleOrSize === "number") {
    // Caller used shorthand: (category, size, color)
    size = titleOrSize;
    color = typeof sizeOrColor === "string" ? sizeOrColor : null;
    title = "";
  } else {
    // Caller used full signature: (category, title, size, color)
    title = typeof titleOrSize === "string" ? titleOrSize : "";
    size = typeof sizeOrColor === "number" ? sizeOrColor : 22;
    color = overrideColor;
  }

  if (typeof size !== "number" || isNaN(size)) {
    size = 22;
  }
  color = color || COLORS.textDark;
  const query = `${category || ""} ${title || ""}`.toUpperCase();

  if (
    query.includes("DESAIN") ||
    query.includes("UI") ||
    query.includes("UX") ||
    query.includes("LOGO") ||
    query.includes("FIGMA")
  ) {
    return <UiUxVectorIcon size={size} color={color} />;
  }

  if (
    query.includes("WEB") ||
    query.includes("CODING") ||
    query.includes("REACT") ||
    query.includes("API") ||
    query.includes("PROGRAM")
  ) {
    return <WebCodingVectorIcon size={size} color={color} />;
  }

  if (
    query.includes("MOBILE") ||
    query.includes("APP") ||
    query.includes("FLUTTER") ||
    query.includes("ANDROID") ||
    query.includes("IOS")
  ) {
    return <MobileAppVectorIcon size={size} color={color} />;
  }

  if (
    query.includes("VIDEO") ||
    query.includes("REELS") ||
    query.includes("MOTION") ||
    query.includes("EDIT")
  ) {
    return <VideoMotionVectorIcon size={size} color={color} />;
  }

  if (
    query.includes("MARKETING") ||
    query.includes("SEO") ||
    query.includes("ADS") ||
    query.includes("IKLAN") ||
    query.includes("PASAR")
  ) {
    return <MarketingVectorIcon size={size} color={color} />;
  }

  if (
    query.includes("TULIS") ||
    query.includes("ARTIKEL") ||
    query.includes("WRITING") ||
    query.includes("COPY") ||
    query.includes("KONTEN") ||
    query.includes("RISET")
  ) {
    return <WritingVectorIcon size={size} color={color} />;
  }

  return <ProjectBriefVectorIcon size={size} color={color} />;
}
