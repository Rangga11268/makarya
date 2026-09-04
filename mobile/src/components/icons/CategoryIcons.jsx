import React from "react";
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import { COLORS } from "../../theme/colors";

// 1. UI/UX Design & Branding Vector Icon (Crafted with layered depth)
export function UiUxVectorIcon({ size = 24, color = "#4F46E5" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="uiCardGrad" x1="4" y1="4" x2="28" y2="28">
          <Stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </LinearGradient>
        <LinearGradient id="uiAccentGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#4F46E5" />
          <Stop offset="100%" stopColor="#7C3AED" />
        </LinearGradient>
      </Defs>

      {/* Main Artboard Canvas */}
      <Rect
        x="3.5"
        y="4.5"
        width="25"
        height="23"
        rx="5.5"
        fill="url(#uiCardGrad)"
        stroke={color}
        strokeWidth="1.8"
      />

      {/* Top Floating Swatch / Component */}
      <Rect
        x="7.5"
        y="8.5"
        width="8"
        height="7.5"
        rx="2.5"
        fill="url(#uiAccentGrad)"
      />

      {/* Color Picker / Selection Circle */}
      <Circle
        cx="21"
        cy="12"
        r="4"
        stroke={color}
        strokeWidth="1.8"
      />
      <Circle cx="21" cy="12" r="1.5" fill={color} />

      {/* Wireframe Layout Lines */}
      <Path
        d="M7.5 20H15M19 20H24.5M7.5 23.5H18"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// 2. Web & Coding Development Vector Icon (Modern IDE Window)
export function WebCodingVectorIcon({ size = 24, color = "#0284C7" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="codeWinGrad" x1="3" y1="3" x2="29" y2="29">
          <Stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </LinearGradient>
      </Defs>

      {/* Browser Window Body */}
      <Rect
        x="3.5"
        y="5"
        width="25"
        height="22"
        rx="5.5"
        fill="url(#codeWinGrad)"
        stroke={color}
        strokeWidth="1.8"
      />

      {/* Window Controls */}
      <Circle cx="8" cy="9.5" r="1.5" fill="#EF4444" />
      <Circle cx="12.5" cy="9.5" r="1.5" fill="#F59E0B" />
      <Circle cx="17" cy="9.5" r="1.5" fill="#10B981" />
      <Path d="M3.5 13.5H28.5" stroke={color} strokeWidth="1.2" opacity="0.3" />

      {/* Code Syntax Brackets */}
      <Path
        d="M11 17.5L8 20.5L11 23.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 17.5L24 20.5L21 23.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.5 16.5L14.5 24.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// 3. Mobile App Development Vector Icon (Bezel-less Smartphone)
export function MobileAppVectorIcon({ size = 24, color = "#10B981" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="phoneGrad" x1="6" y1="3" x2="26" y2="29">
          <Stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </LinearGradient>
      </Defs>

      {/* Phone Outer Chassis */}
      <Rect
        x="7.5"
        y="3.5"
        width="17"
        height="25"
        rx="5"
        fill="url(#phoneGrad)"
        stroke={color}
        strokeWidth="1.8"
      />

      {/* Speaker / Dynamic Island */}
      <Rect x="13" y="6" width="6" height="1.5" rx="0.75" fill={color} />

      {/* App Interface Cards */}
      <Rect
        x="10.5"
        y="10"
        width="11"
        height="7.5"
        rx="2"
        fill={color}
        fillOpacity="0.18"
        stroke={color}
        strokeWidth="1"
      />

      {/* Content Skeleton Lines */}
      <Path
        d="M11 20H18M11 22.5H16"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* Home Indicator Bar */}
      <Rect x="13.5" y="25.5" width="5" height="1.2" rx="0.6" fill={color} />
    </Svg>
  );
}

// 4. Video Editing & Motion Vector Icon (Film Clapperboard)
export function VideoMotionVectorIcon({ size = 24, color = "#F59E0B" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="vidGrad" x1="3" y1="4" x2="29" y2="28">
          <Stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </LinearGradient>
      </Defs>

      {/* Main Clapper Body */}
      <Rect
        x="4"
        y="5.5"
        width="24"
        height="21"
        rx="5"
        fill="url(#vidGrad)"
        stroke={color}
        strokeWidth="1.8"
      />

      {/* Top Clapper Bar */}
      <Path d="M4 12.5H28" stroke={color} strokeWidth="1.6" />
      <Path
        d="M9.5 5.5L7.5 12.5M16.5 5.5L14.5 12.5M23.5 5.5L21.5 12.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Play Icon Triangle */}
      <Path
        d="M13.5 16.5L19.5 20L13.5 23.5V16.5Z"
        fill={color}
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 5. Digital Marketing & Analytics Vector Icon (Growth Trendline)
export function MarketingVectorIcon({ size = 24, color = "#EC4899" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="mktGrad" x1="3" y1="3" x2="29" y2="29">
          <Stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </LinearGradient>
      </Defs>

      {/* Frame Box */}
      <Rect
        x="3.5"
        y="4.5"
        width="25"
        height="23"
        rx="5.5"
        fill="url(#mktGrad)"
        stroke={color}
        strokeWidth="1.8"
      />

      {/* Rising Bar Chart Columns */}
      <Rect x="7.5" y="19" width="3.5" height="5" rx="1" fill={color} fillOpacity="0.5" />
      <Rect x="13" y="15" width="3.5" height="9" rx="1" fill={color} fillOpacity="0.75" />
      <Rect x="18.5" y="11" width="3.5" height="13" rx="1" fill={color} />

      {/* Trend Arrow */}
      <Path
        d="M8 14.5L13.5 9.5L18.5 12.5L23.5 7.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.5 7.5H23.5V11.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 6. Content Writing & Campus Research Vector Icon (Editorial Article)
export function WritingVectorIcon({ size = 24, color = "#8B5CF6" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="wrtGrad" x1="4" y1="3" x2="28" y2="29">
          <Stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </LinearGradient>
      </Defs>

      {/* Document Sheet */}
      <Path
        d="M6.5 7C6.5 4.8 8.3 3 10.5 3H18.5L25.5 10V25C25.5 27.2 23.7 29 21.5 29H10.5C8.3 29 6.5 27.2 6.5 25V7Z"
        fill="url(#wrtGrad)"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Folded Corner */}
      <Path
        d="M18.5 3V10H25.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Editorial Text Lines */}
      <Path
        d="M10.5 14.5H16M10.5 18.5H21.5M10.5 22.5H18"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// 7. General Project / Brief Vector Icon (Executive Portfolio)
export function ProjectBriefVectorIcon({ size = 24, color = "#4F46E5" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="briefGrad" x1="3" y1="4" x2="29" y2="28">
          <Stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </LinearGradient>
      </Defs>

      {/* Case Body */}
      <Rect
        x="4.5"
        y="7"
        width="23"
        height="19"
        rx="4.5"
        fill="url(#briefGrad)"
        stroke={color}
        strokeWidth="1.8"
      />

      {/* Sturdy Handle */}
      <Path
        d="M12 7V4.5C12 3.95 12.45 3.5 13 3.5H19C19.55 3.5 20 3.95 20 4.5V7"
        stroke={color}
        strokeWidth="1.8"
      />

      {/* Metal Clasp / Center Seam */}
      <Path d="M4.5 14H27.5" stroke={color} strokeWidth="1.4" strokeOpacity="0.5" />
      <Rect
        x="13.5"
        y="12"
        width="5"
        height="4"
        rx="1.2"
        fill={color}
      />
    </Svg>
  );
}

// Dynamic Icon Resolver with Color Palettes
export function renderProjectCategoryVectorIcon(
  category,
  title = "",
  size = 22,
  overrideColor = null
) {
  const query = `${category || ""} ${title || ""}`.toUpperCase();

  if (
    query.includes("DESAIN") ||
    query.includes("UI") ||
    query.includes("UX") ||
    query.includes("LOGO") ||
    query.includes("FIGMA")
  ) {
    return <UiUxVectorIcon size={size} color={overrideColor || "#4F46E5"} />;
  }

  if (
    query.includes("WEB") ||
    query.includes("CODING") ||
    query.includes("REACT") ||
    query.includes("API") ||
    query.includes("PROGRAM")
  ) {
    return <WebCodingVectorIcon size={size} color={overrideColor || "#0284C7"} />;
  }

  if (
    query.includes("MOBILE") ||
    query.includes("APP") ||
    query.includes("FLUTTER") ||
    query.includes("ANDROID") ||
    query.includes("IOS")
  ) {
    return <MobileAppVectorIcon size={size} color={overrideColor || "#10B981"} />;
  }

  if (
    query.includes("VIDEO") ||
    query.includes("REELS") ||
    query.includes("MOTION") ||
    query.includes("EDIT")
  ) {
    return <VideoMotionVectorIcon size={size} color={overrideColor || "#F59E0B"} />;
  }

  if (
    query.includes("MARKETING") ||
    query.includes("SEO") ||
    query.includes("ADS") ||
    query.includes("IKLAN") ||
    query.includes("PASAR")
  ) {
    return <MarketingVectorIcon size={size} color={overrideColor || "#EC4899"} />;
  }

  if (
    query.includes("TULIS") ||
    query.includes("ARTIKEL") ||
    query.includes("WRITING") ||
    query.includes("COPY") ||
    query.includes("KONTEN")
  ) {
    return <WritingVectorIcon size={size} color={overrideColor || "#8B5CF6"} />;
  }

  return <ProjectBriefVectorIcon size={size} color={overrideColor || COLORS.brandIndigo || "#4F46E5"} />;
}
