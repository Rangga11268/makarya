import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import { COLORS } from "../../theme/colors";

// 1. Premium Architectural Home Icon
export function HomeTabIcon({ focused, size = 22, color = COLORS.brandIndigo }) {
  const activeColor = COLORS.brandIndigo;
  const inactiveColor = COLORS.textMuted;
  const strokeColor = focused ? activeColor : inactiveColor;

  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="homeGlow" x1="0" y1="0" x2="24" y2="24">
            <Stop offset="0%" stopColor={activeColor} stopOpacity="0.22" />
            <Stop offset="100%" stopColor={activeColor} stopOpacity="0.06" />
          </LinearGradient>
        </Defs>

        {/* Roof & House Body */}
        <Path
          d="M3 10.5L11.2 3.6C11.66 3.22 12.34 3.22 12.8 3.6L21 10.5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V10.5Z"
          fill={focused ? "url(#homeGlow)" : "none"}
          stroke={strokeColor}
          strokeWidth={focused ? "2.2" : "1.8"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Door / Window Accent */}
        <Path
          d="M9.5 21V13.5C9.5 12.95 9.95 12.5 10.5 12.5H13.5C14.05 12.5 14.5 12.95 14.5 13.5V21"
          fill={focused ? activeColor : "none"}
          stroke={strokeColor}
          strokeWidth={focused ? "2" : "1.8"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

// 2. Precision Dual-Tone Navigation Compass (Explore)
export function ExploreTabIcon({ focused, size = 22, color = COLORS.brandIndigo }) {
  const activeColor = COLORS.brandIndigo;
  const inactiveColor = COLORS.textMuted;
  const strokeColor = focused ? activeColor : inactiveColor;

  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="compassGlow" x1="0" y1="0" x2="24" y2="24">
            <Stop offset="0%" stopColor={activeColor} stopOpacity="0.20" />
            <Stop offset="100%" stopColor={activeColor} stopOpacity="0.04" />
          </LinearGradient>
        </Defs>

        {/* Outer Precision Ring */}
        <Circle
          cx="12"
          cy="12"
          r="9.25"
          fill={focused ? "url(#compassGlow)" : "none"}
          stroke={strokeColor}
          strokeWidth={focused ? "2" : "1.8"}
        />

        {/* North Arrow Pointer */}
        <Path
          d="M14.8 9.2L11 13L9.2 14.8L13 11L14.8 9.2Z"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.6"
        />
        <Path
          d="M14.8 9.2L12.5 15L11 13L14.8 9.2Z"
          fill={focused ? activeColor : inactiveColor}
        />
        <Path
          d="M9.2 14.8L11.5 9L13 11L9.2 14.8Z"
          fill={focused ? "rgba(79, 70, 229, 0.4)" : "rgba(100, 116, 139, 0.3)"}
        />

        {/* Center Pivot Pin */}
        <Circle cx="12" cy="12" r="1.5" fill={focused ? "#FFFFFF" : strokeColor} />
      </Svg>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

// 3. Layered Kanban / Project Desk Icon (Workspace)
export function WorkspaceTabIcon({ focused, size = 22, color = COLORS.brandIndigo }) {
  const activeColor = COLORS.brandIndigo;
  const inactiveColor = COLORS.textMuted;
  const strokeColor = focused ? activeColor : inactiveColor;

  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="deskGlow" x1="0" y1="0" x2="24" y2="24">
            <Stop offset="0%" stopColor={activeColor} stopOpacity="0.22" />
            <Stop offset="100%" stopColor={activeColor} stopOpacity="0.05" />
          </LinearGradient>
        </Defs>

        {/* Background Card */}
        <Rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="3.5"
          fill={focused ? "url(#deskGlow)" : "none"}
          stroke={strokeColor}
          strokeWidth={focused ? "2" : "1.8"}
        />

        {/* Top Header Bar */}
        <Path
          d="M3 9.5H21"
          stroke={strokeColor}
          strokeWidth={focused ? "1.8" : "1.5"}
          strokeLinecap="round"
        />

        {/* Task Columns / Items */}
        <Rect
          x="6.5"
          y="12"
          width="4.5"
          height="5"
          rx="1.5"
          fill={focused ? activeColor : strokeColor}
        />
        <Rect
          x="13"
          y="12"
          width="4.5"
          height="3"
          rx="1"
          fill={focused ? "rgba(79, 70, 229, 0.45)" : "rgba(100, 116, 139, 0.4)"}
        />
      </Svg>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

// 4. Tactile Smart Wallet & Escrow Vault Icon (Wallet)
export function WalletTabIcon({ focused, size = 22, color = COLORS.brandIndigo }) {
  const activeColor = COLORS.brandIndigo;
  const inactiveColor = COLORS.textMuted;
  const strokeColor = focused ? activeColor : inactiveColor;

  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="walletGlow" x1="0" y1="0" x2="24" y2="24">
            <Stop offset="0%" stopColor={activeColor} stopOpacity="0.22" />
            <Stop offset="100%" stopColor={activeColor} stopOpacity="0.05" />
          </LinearGradient>
        </Defs>

        {/* Card Body */}
        <Rect
          x="2.5"
          y="5.5"
          width="19"
          height="13"
          rx="3.5"
          fill={focused ? "url(#walletGlow)" : "none"}
          stroke={strokeColor}
          strokeWidth={focused ? "2" : "1.8"}
        />

        {/* Magnetic Clasp / Vault Flap */}
        <Path
          d="M15.5 9.5H21V14.5H15.5C14.12 14.5 13 13.38 13 12C13 10.62 14.12 9.5 15.5 9.5Z"
          fill={focused ? activeColor : "none"}
          stroke={strokeColor}
          strokeWidth={focused ? "1.8" : "1.5"}
        />

        {/* Vault Lock Pin */}
        <Circle cx="16.5" cy="12" r="1.25" fill={focused ? "#FFFFFF" : strokeColor} />
      </Svg>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

// 5. Executive Verified Profile Icon (Profile)
export function ProfileTabIcon({ focused, size = 22, color = COLORS.brandIndigo }) {
  const activeColor = COLORS.brandIndigo;
  const inactiveColor = COLORS.textMuted;
  const strokeColor = focused ? activeColor : inactiveColor;

  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="profGlow" x1="0" y1="0" x2="24" y2="24">
            <Stop offset="0%" stopColor={activeColor} stopOpacity="0.22" />
            <Stop offset="100%" stopColor={activeColor} stopOpacity="0.05" />
          </LinearGradient>
        </Defs>

        {/* Outer Ring when Focused */}
        <Circle
          cx="12"
          cy="7.5"
          r="4.25"
          fill={focused ? activeColor : "none"}
          stroke={strokeColor}
          strokeWidth={focused ? "2" : "1.8"}
        />

        {/* Shoulders & Body Arc */}
        <Path
          d="M4.5 19.5C4.5 16.5 7.86 14.5 12 14.5C16.14 14.5 19.5 16.5 19.5 19.5"
          fill={focused ? "url(#profGlow)" : "none"}
          stroke={strokeColor}
          strokeWidth={focused ? "2.2" : "1.8"}
          strokeLinecap="round"
        />

        {/* Verified Star Badge */}
        {focused && (
          <Circle cx="16.5" cy="6" r="1.75" fill="#10B981" />
        )}
      </Svg>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 2,
    position: "relative",
  },
  iconWrapperActive: {
    transform: [{ scale: 1.08 }],
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.brandIndigo,
    marginTop: 2,
  },
});

