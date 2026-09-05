import React from "react";
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  G,
} from "react-native-svg";
import { COLORS } from "../../theme/colors";

// 1. UI/UX Design & Branding Vector Icon (Layered Canvas + Pen Tool + Sparkle)
export function UiUxVectorIcon({ size = 26, color = "#4F46E5" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Defs>
        <LinearGradient id="uiuxCanvasGrad" x1="4" y1="4" x2="32" y2="32">
          <Stop offset="0%" stopColor="#4F46E5" stopOpacity="0.22" />
          <Stop offset="100%" stopColor="#06B6D4" stopOpacity="0.06" />
        </LinearGradient>
        <LinearGradient id="uiuxAccentCard" x1="6" y1="6" x2="20" y2="20">
          <Stop offset="0%" stopColor="#6366F1" />
          <Stop offset="100%" stopColor="#8B5CF6" />
        </LinearGradient>
        <LinearGradient id="uiuxPenGrad" x1="16" y1="12" x2="30" y2="28">
          <Stop offset="0%" stopColor="#06B6D4" />
          <Stop offset="100%" stopColor="#3B82F6" />
        </LinearGradient>
      </Defs>

      {/* Main Artboard Canvas */}
      <Rect
        x="3"
        y="4"
        width="26"
        height="24"
        rx="6"
        fill="url(#uiuxCanvasGrad)"
        stroke="#4F46E5"
        strokeWidth="1.75"
      />

      {/* Floating UI Component Card */}
      <Rect
        x="6.5"
        y="7.5"
        width="11"
        height="9"
        rx="3"
        fill="url(#uiuxAccentCard)"
      />

      {/* Color Palette Swatch Circle */}
      <Circle cx="23.5" cy="11.5" r="3.5" fill="#06B6D4" />
      <Circle cx="23.5" cy="11.5" r="1.5" fill="#FFFFFF" />

      {/* Curving Bézier Vector Spline */}
      <Path
        d="M6.5 21C11.5 21 14 24.5 19 24.5"
        stroke="#06B6D4"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Anchor Point Dots */}
      <Circle
        cx="6.5"
        cy="21"
        r="1.5"
        fill="#4F46E5"
        stroke="#FFFFFF"
        strokeWidth="1"
      />
      <Circle
        cx="19"
        cy="24.5"
        r="1.5"
        fill="#4F46E5"
        stroke="#FFFFFF"
        strokeWidth="1"
      />

      {/* Stylized Digital Pen Tool Nib */}
      <G transform="translate(18, 14)">
        <Path
          d="M3 13L11 5L13 7L5 15L2 15.5L3 13Z"
          fill="url(#uiuxPenGrad)"
          stroke="#06B6D4"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <Circle cx="12" cy="6" r="1.2" fill="#FBBF24" />
      </G>

      {/* Gold Sparkle Star */}
      <Path
        d="M31 6L31.8 8.2L34 9L31.8 9.8L31 12L30.2 9.8L28 9L30.2 8.2L31 6Z"
        fill="#FBBF24"
      />
    </Svg>
  );
}

// 2. Web & Coding Development Vector Icon (Terminal Window + Glow Brackets </>)
export function WebCodingVectorIcon({ size = 26, color = "#0284C7" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Defs>
        <LinearGradient id="webWinGrad" x1="3" y1="4" x2="33" y2="32">
          <Stop offset="0%" stopColor="#0284C7" stopOpacity="0.2" />
          <Stop offset="100%" stopColor="#4F46E5" stopOpacity="0.05" />
        </LinearGradient>
        <LinearGradient id="codeBrackGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#06B6D4" />
          <Stop offset="100%" stopColor="#38BDF8" />
        </LinearGradient>
      </Defs>

      {/* Browser / Terminal Window Frame */}
      <Rect
        x="3"
        y="5"
        width="30"
        height="25"
        rx="6"
        fill="url(#webWinGrad)"
        stroke="#0284C7"
        strokeWidth="1.75"
      />

      {/* Window Top Bar Line */}
      <Path
        d="M3 12.5H33"
        stroke="#0284C7"
        strokeWidth="1.2"
        strokeOpacity="0.3"
      />

      {/* macOS Window Traffic Lights */}
      <Circle cx="7.5" cy="8.8" r="1.6" fill="#EF4444" />
      <Circle cx="12.5" cy="8.8" r="1.6" fill="#F59E0B" />
      <Circle cx="17.5" cy="8.8" r="1.6" fill="#10B981" />

      {/* Glowing Code Tag Brackets */}
      {/* Left Bracket < */}
      <Path
        d="M12.5 17L8.5 21L12.5 25"
        stroke="url(#codeBrackGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Code Slash / */}
      <Path
        d="M19.5 16L16.5 26"
        stroke="#6366F1"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Right Bracket > */}
      <Path
        d="M23.5 17L27.5 21L23.5 25"
        stroke="url(#codeBrackGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Micro Sparkle Accent */}
      <Circle cx="29" cy="8.5" r="1" fill="#38BDF8" />
    </Svg>
  );
}

// 3. Mobile App Development Vector Icon (Curved Smartphone + UI Cards)
export function MobileAppVectorIcon({ size = 26, color = "#10B981" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Defs>
        <LinearGradient id="mobiChassisGrad" x1="8" y1="3" x2="28" y2="33">
          <Stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
          <Stop offset="100%" stopColor="#06B6D4" stopOpacity="0.06" />
        </LinearGradient>
        <LinearGradient id="mobiCardGrad" x1="12" y1="10" x2="24" y2="18">
          <Stop offset="0%" stopColor="#10B981" />
          <Stop offset="100%" stopColor="#059669" />
        </LinearGradient>
      </Defs>

      {/* Smartphone Chassis */}
      <Rect
        x="8.5"
        y="3.5"
        width="19"
        height="29"
        rx="6"
        fill="url(#mobiChassisGrad)"
        stroke="#10B981"
        strokeWidth="1.75"
      />

      {/* Dynamic Island Notch */}
      <Rect x="14.5" y="6" width="7" height="2" rx="1" fill="#10B981" />

      {/* Featured Header Card on Screen */}
      <Rect
        x="11.5"
        y="10"
        width="13"
        height="8"
        rx="2.5"
        fill="url(#mobiCardGrad)"
      />

      {/* Secondary App Skeleton Tiles */}
      <Rect
        x="11.5"
        y="20"
        width="5.5"
        height="4.5"
        rx="1.5"
        fill="#06B6D4"
        fillOpacity="0.5"
      />
      <Rect
        x="19"
        y="20"
        width="5.5"
        height="4.5"
        rx="1.5"
        fill="#4F46E5"
        fillOpacity="0.4"
      />

      {/* Home Indicator Bar */}
      <Rect x="15" y="28.5" width="6" height="1.4" rx="0.7" fill="#10B981" />

      {/* Interactive Touch Pulse Dot */}
      <Circle
        cx="29"
        cy="20"
        r="3.5"
        stroke="#10B981"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <Circle cx="29" cy="20" r="1.5" fill="#10B981" />
    </Svg>
  );
}

// 4. Video Editing & Motion Vector Icon (Clapperboard + Glowing Golden Play)
export function VideoMotionVectorIcon({ size = 26, color = "#F59E0B" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Defs>
        <LinearGradient id="vidBodyGrad" x1="4" y1="5" x2="32" y2="31">
          <Stop offset="0%" stopColor="#F59E0B" stopOpacity="0.22" />
          <Stop offset="100%" stopColor="#EF4444" stopOpacity="0.06" />
        </LinearGradient>
        <LinearGradient id="playBtnGrad" x1="14" y1="16" x2="23" y2="24">
          <Stop offset="0%" stopColor="#FBBF24" />
          <Stop offset="100%" stopColor="#F59E0B" />
        </LinearGradient>
      </Defs>

      {/* Main Clapperboard Body */}
      <Rect
        x="4"
        y="6"
        width="28"
        height="24"
        rx="6"
        fill="url(#vidBodyGrad)"
        stroke="#F59E0B"
        strokeWidth="1.75"
      />

      {/* Clapper Hinge Top Strip */}
      <Path d="M4 14H32" stroke="#F59E0B" strokeWidth="1.5" />

      {/* Angled Production Stripes */}
      <Path
        d="M10 6L7 14M17 6L14 14M24 6L21 14M31 6L28 14"
        stroke="#F59E0B"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Radiant Golden Play Badge */}
      <Circle cx="18" cy="21.5" r="5.5" fill="rgba(245, 158, 11, 0.18)" />
      <Path
        d="M16.5 18.5L21.5 21.5L16.5 24.5V18.5Z"
        fill="url(#playBtnGrad)"
        stroke="#F59E0B"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Gold Sparkle */}
      <Path
        d="M32 4L32.6 5.4L34 6L32.6 6.6L32 8L31.4 6.6L30 6L31.4 5.4L32 4Z"
        fill="#FBBF24"
      />
    </Svg>
  );
}

// 5. Digital Marketing & Analytics Vector Icon (Ascending Chart + Rocket Trend)
export function MarketingVectorIcon({ size = 26, color = "#EC4899" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Defs>
        <LinearGradient id="mktCanvasGrad" x1="4" y1="5" x2="32" y2="31">
          <Stop offset="0%" stopColor="#EC4899" stopOpacity="0.2" />
          <Stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05" />
        </LinearGradient>
        <LinearGradient id="barHighGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#EC4899" />
          <Stop offset="100%" stopColor="#BE185D" />
        </LinearGradient>
      </Defs>

      {/* Card Base */}
      <Rect
        x="4"
        y="5"
        width="28"
        height="25"
        rx="6"
        fill="url(#mktCanvasGrad)"
        stroke="#EC4899"
        strokeWidth="1.75"
      />

      {/* Ascending Chart Bars */}
      <Rect
        x="8.5"
        y="21"
        width="4"
        height="5.5"
        rx="1.5"
        fill="#8B5CF6"
        fillOpacity="0.45"
      />
      <Rect
        x="14.5"
        y="16.5"
        width="4"
        height="10"
        rx="1.5"
        fill="#EC4899"
        fillOpacity="0.65"
      />
      <Rect
        x="20.5"
        y="11.5"
        width="4.5"
        height="15"
        rx="1.5"
        fill="url(#barHighGrad)"
      />

      {/* Upward Growth Arrow Trendline */}
      <Path
        d="M8.5 16L14.5 11L20.5 14L27 7.5"
        stroke="#06B6D4"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22.5 7.5H27V12"
        stroke="#06B6D4"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Target Bullseye Ring */}
      <Circle cx="28" cy="22" r="2.5" stroke="#EC4899" strokeWidth="1.2" />
      <Circle cx="28" cy="22" r="1" fill="#EC4899" />
    </Svg>
  );
}

// 6. Content Writing & Campus Research Vector Icon (Document + Gold Nib)
export function WritingVectorIcon({ size = 26, color = "#8B5CF6" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Defs>
        <LinearGradient id="wrtSheetGrad" x1="5" y1="4" x2="31" y2="32">
          <Stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.22" />
          <Stop offset="100%" stopColor="#06B6D4" stopOpacity="0.06" />
        </LinearGradient>
      </Defs>

      {/* Folded Document Sheet */}
      <Path
        d="M7 7C7 4.8 8.8 3 11 3H21L29 11V27C29 29.2 27.2 31 25 31H11C8.8 31 7 29.2 7 27V7Z"
        fill="url(#wrtSheetGrad)"
        stroke="#8B5CF6"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />

      {/* Folded Corner Flap */}
      <Path
        d="M21 3V11H29"
        fill="rgba(139, 92, 246, 0.25)"
        stroke="#8B5CF6"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />

      {/* Editorial Content Lines in Cyan & Violet */}
      <Path
        d="M11.5 15.5H18M11.5 19.5H24.5M11.5 23.5H20.5"
        stroke="#6366F1"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Golden Quill Pen Tip */}
      <G transform="translate(20, 18)">
        <Path
          d="M6 3L11 8L8 11L3 6L6 3Z"
          fill="#FBBF24"
          stroke="#F59E0B"
          strokeWidth="1"
        />
        <Path d="M3 6L1 12L7 10" fill="#F59E0B" />
        <Circle cx="7.5" cy="6.5" r="0.8" fill="#FFFFFF" />
      </G>
    </Svg>
  );
}

// 7. General Project / Brief Vector Icon (Executive Portfolio)
export function ProjectBriefVectorIcon({ size = 26, color = "#4F46E5" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Defs>
        <LinearGradient id="briefCaseGrad" x1="4" y1="6" x2="32" y2="30">
          <Stop offset="0%" stopColor="#4F46E5" stopOpacity="0.22" />
          <Stop offset="100%" stopColor="#06B6D4" stopOpacity="0.08" />
        </LinearGradient>
      </Defs>

      {/* Briefcase Body */}
      <Rect
        x="4"
        y="8"
        width="28"
        height="22"
        rx="5.5"
        fill="url(#briefCaseGrad)"
        stroke="#4F46E5"
        strokeWidth="1.75"
      />

      {/* Solid Top Handle */}
      <Path
        d="M13 8V5C13 4.2 13.7 3.5 14.5 3.5H21.5C22.3 3.5 23 4.2 23 5V8"
        stroke="#4F46E5"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Center Dividing Seam */}
      <Path
        d="M4 16H32"
        stroke="#4F46E5"
        strokeWidth="1.4"
        strokeOpacity="0.4"
      />

      {/* Gold Latch Clasp */}
      <Rect
        x="15.5"
        y="13.5"
        width="5"
        height="5"
        rx="1.5"
        fill="#FBBF24"
        stroke="#F59E0B"
        strokeWidth="1"
      />
    </Svg>
  );
}

// Dynamic Icon Resolver with Color Palettes
export function renderProjectCategoryVectorIcon(
  category,
  title = "",
  size = 24,
  overrideColor = null,
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
    return (
      <WebCodingVectorIcon size={size} color={overrideColor || "#0284C7"} />
    );
  }

  if (
    query.includes("MOBILE") ||
    query.includes("APP") ||
    query.includes("FLUTTER") ||
    query.includes("ANDROID") ||
    query.includes("IOS")
  ) {
    return (
      <MobileAppVectorIcon size={size} color={overrideColor || "#10B981"} />
    );
  }

  if (
    query.includes("VIDEO") ||
    query.includes("REELS") ||
    query.includes("MOTION") ||
    query.includes("EDIT")
  ) {
    return (
      <VideoMotionVectorIcon size={size} color={overrideColor || "#F59E0B"} />
    );
  }

  if (
    query.includes("MARKETING") ||
    query.includes("SEO") ||
    query.includes("ADS") ||
    query.includes("IKLAN") ||
    query.includes("PASAR")
  ) {
    return (
      <MarketingVectorIcon size={size} color={overrideColor || "#EC4899"} />
    );
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

  return (
    <ProjectBriefVectorIcon
      size={size}
      color={overrideColor || COLORS.brandIndigo || "#4F46E5"}
    />
  );
}
