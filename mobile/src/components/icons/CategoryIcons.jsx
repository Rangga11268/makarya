import React from "react";
import Svg, {
  Path,
  Rect,
  Circle,
  G,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import { COLORS } from "../../theme/colors";

// 1. UI/UX Design & Branding Vector Icon
export function UiUxVectorIcon({ size = 24, color = COLORS.brandIndigo }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="uiGrad" x1="2" y1="2" x2="30" y2="30">
          <Stop offset="0%" stopColor={color} stopOpacity="0.16" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </LinearGradient>
      </Defs>
      <Rect
        x="3"
        y="4"
        width="26"
        height="24"
        rx="6"
        fill="url(#uiGrad)"
        stroke={color}
        strokeWidth="1.75"
      />
      <Rect x="7" y="8" width="8" height="7" rx="2" fill={color} />
      <Circle cx="21" cy="11.5" r="3.5" stroke={color} strokeWidth="1.75" />
      <Path
        d="M7 21 L13 21 M18 21 L25 21 M7 24 L16 24"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// 2. Web & Coding Development Vector Icon
export function WebCodingVectorIcon({ size = 24, color = COLORS.brandIndigo }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="webGrad" x1="2" y1="2" x2="30" y2="30">
          <Stop offset="0%" stopColor={color} stopOpacity="0.16" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </LinearGradient>
      </Defs>
      <Rect
        x="3"
        y="5"
        width="26"
        height="22"
        rx="6"
        fill="url(#webGrad)"
        stroke={color}
        strokeWidth="1.75"
      />
      <Circle cx="8" cy="10" r="1.5" fill={color} />
      <Circle cx="12.5" cy="10" r="1.5" fill={color} />
      <Path d="M3 14 L29 14" stroke={color} strokeWidth="1.2" opacity="0.4" />
      <Path
        d="M11 19 L8 21.5 L11 24"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 19 L24 21.5 L21 24"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 18 L15 25"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// 3. Mobile App Development Vector Icon
export function MobileAppVectorIcon({ size = 24, color = COLORS.brandIndigo }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="mobGrad" x1="4" y1="2" x2="28" y2="30">
          <Stop offset="0%" stopColor={color} stopOpacity="0.16" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </LinearGradient>
      </Defs>
      <Rect
        x="7"
        y="3"
        width="18"
        height="26"
        rx="5"
        fill="url(#mobGrad)"
        stroke={color}
        strokeWidth="1.75"
      />
      <Path d="M13 6 L19 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Rect x="10" y="9" width="12" height="13" rx="2" fill={color} opacity="0.12" />
      <Path
        d="M13 13 L19 13 M13 16 L17 16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Circle cx="16" cy="25.5" r="1.5" fill={color} />
    </Svg>
  );
}

// 4. Video Editing & Motion Vector Icon
export function VideoMotionVectorIcon({ size = 24, color = COLORS.brandIndigo }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="vidGrad" x1="2" y1="4" x2="30" y2="28">
          <Stop offset="0%" stopColor={color} stopOpacity="0.16" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </LinearGradient>
      </Defs>
      <Rect
        x="4"
        y="5"
        width="24"
        height="22"
        rx="5"
        fill="url(#vidGrad)"
        stroke={color}
        strokeWidth="1.75"
      />
      <Path d="M4 12 L28 12" stroke={color} strokeWidth="1.75" />
      <Path d="M9 5 L7 12 M16 5 L14 12 M23 5 L21 12" stroke={color} strokeWidth="1.5" />
      <Path
        d="M13.5 16.5 L19.5 20 L13.5 23.5 Z"
        fill={color}
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 5. Digital Marketing & Analytics Vector Icon
export function MarketingVectorIcon({ size = 24, color = COLORS.brandIndigo }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="mktGrad" x1="2" y1="4" x2="30" y2="28">
          <Stop offset="0%" stopColor={color} stopOpacity="0.16" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </LinearGradient>
      </Defs>
      <Rect
        x="3"
        y="4"
        width="26"
        height="24"
        rx="6"
        fill="url(#mktGrad)"
        stroke={color}
        strokeWidth="1.75"
      />
      <Rect x="7" y="19" width="3.5" height="5" rx="1" fill={color} />
      <Rect x="12.5" y="15" width="3.5" height="9" rx="1" fill={color} />
      <Rect x="18" y="11" width="3.5" height="13" rx="1" fill={color} />
      <Path
        d="M8 14 L14 9 L19 12 L24 7"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 7 L24 7 L24 11"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 6. Content Writing & Campus Research Vector Icon
export function WritingVectorIcon({ size = 24, color = COLORS.brandIndigo }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="wrtGrad" x1="4" y1="2" x2="28" y2="30">
          <Stop offset="0%" stopColor={color} stopOpacity="0.16" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </LinearGradient>
      </Defs>
      <Path
        d="M6 7 C6 4.79 7.79 3 10 3 L19 3 L26 10 L26 25 C26 27.21 24.21 29 22 29 L10 29 C7.79 29 6 27.21 6 25 Z"
        fill="url(#wrtGrad)"
        stroke={color}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <Path d="M19 3 L19 10 L26 10" stroke={color} strokeWidth="1.75" strokeLinejoin="round" />
      <Path
        d="M10 14 L19 14 M10 18 L22 18 M10 22 L17 22"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// 7. General Project / Brief Vector Icon
export function ProjectBriefVectorIcon({ size = 24, color = COLORS.brandIndigo }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="briefGrad" x1="3" y1="3" x2="29" y2="29">
          <Stop offset="0%" stopColor={color} stopOpacity="0.16" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </LinearGradient>
      </Defs>
      <Rect
        x="4"
        y="6"
        width="24"
        height="21"
        rx="5"
        fill="url(#briefGrad)"
        stroke={color}
        strokeWidth="1.75"
      />
      <Path
        d="M12 6 V4 C12 3.45 12.45 3 13 3 H19 C19.55 3 20 3.45 20 4 V6"
        stroke={color}
        strokeWidth="1.75"
      />
      <Path d="M4 14 H28" stroke={color} strokeWidth="1.5" />
      <Rect x="13" y="11" width="6" height="5" rx="1.5" fill={color} />
    </Svg>
  );
}

// Dynamic Icon Resolver
export function renderProjectCategoryVectorIcon(category, title = "", size = 22, color = COLORS.brandIndigo) {
  const query = `${category || ""} ${title || ""}`.toUpperCase();
  if (query.includes("DESAIN") || query.includes("UI") || query.includes("UX") || query.includes("LOGO") || query.includes("FIGMA")) {
    return <UiUxVectorIcon size={size} color={color} />;
  }
  if (query.includes("WEB") || query.includes("CODING") || query.includes("REACT") || query.includes("API") || query.includes("PROGRAM")) {
    return <WebCodingVectorIcon size={size} color={color} />;
  }
  if (query.includes("MOBILE") || query.includes("APP") || query.includes("FLUTTER") || query.includes("ANDROID") || query.includes("IOS")) {
    return <MobileAppVectorIcon size={size} color={color} />;
  }
  if (query.includes("VIDEO") || query.includes("REELS") || query.includes("MOTION") || query.includes("EDIT")) {
    return <VideoMotionVectorIcon size={size} color={color} />;
  }
  if (query.includes("MARKETING") || query.includes("SEO") || query.includes("ADS") || query.includes("IKLAN") || query.includes("PASAR")) {
    return <MarketingVectorIcon size={size} color={color} />;
  }
  if (query.includes("TULIS") || query.includes("ARTIKEL") || query.includes("WRITING") || query.includes("COPY") || query.includes("KONTEN")) {
    return <WritingVectorIcon size={size} color={color} />;
  }
  return <ProjectBriefVectorIcon size={size} color={color} />;
}
