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

/**
 * Modern Precision Vector Icons for Workspace, Contracts, and Project Hub
 * Designed with clean stroke geometry and duotone depth.
 */

// 1. Workspace Desk / Ruang Kerja Active Hub
export function WorkspaceDeskVectorIcon({
  size = 20,
  color = "#2563EB",
  secondaryColor = "#93C5FD",
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Folder / Workspace Base */}
      <Path
        d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Contract & Pen Accent */}
      <Path
        d="M8 13h8M8 16h5"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <Circle cx="16" cy="16" r="1.2" fill={secondaryColor} />
    </Svg>
  );
}

// 2. Project Contract / Escrow Agreement Vector
export function ContractHubVectorIcon({
  size = 20,
  color = "#2563EB",
  secondaryColor = "#3B82F6",
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Clipboard / Document Frame */}
      <Rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2.5"
        stroke={color}
        strokeWidth="1.7"
      />
      {/* Top Clip */}
      <Path
        d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      {/* Active Checkmark & Progress Lines */}
      <Path
        d="M8 11l2.5 2.5L16 8.5"
        stroke={secondaryColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 16h8"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// 3. Modern Briefcase Collaboration Icon
export function BriefcaseWorkVectorIcon({ size = 20, color = "#2563EB" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="2"
        y="7"
        width="20"
        height="14"
        rx="3"
        stroke={color}
        strokeWidth="1.7"
      />
      <Path
        d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <Path
        d="M2 12h20M12 12v3"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </Svg>
  );
}
