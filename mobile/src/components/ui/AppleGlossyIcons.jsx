import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import { FONTS } from "../../theme/fonts";

/**
 * 1. Apple Message / Chat Glossy Vector Icon
 * Inspired by Apple Messages: Squircle glass tile with gradient & gloss highlight
 */
export function AppleMessageIcon({
  size = 28,
  variant = "blue", // "blue" (iMessage default) | "green" (SMS / active chat)
  style,
}) {
  const isGreen = variant === "green";
  const startColor = isGreen ? "#34C759" : "#0A84FF";
  const endColor = isGreen ? "#28A745" : "#0062D2";
  const gradId = isGreen ? "appleMsgGreenGrad" : "appleMsgBlueGrad";

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          shadowColor: startColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 5,
          elevation: 2,
        },
        style,
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <Defs>
          <LinearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={startColor} />
            <Stop offset="100%" stopColor={endColor} />
          </LinearGradient>
          <LinearGradient id="appleGlossHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
          </LinearGradient>
        </Defs>

        {/* Base Squircle Tile */}
        <Rect
          x="1"
          y="1"
          width="34"
          height="34"
          rx="10"
          fill={`url(#${gradId})`}
        />

        {/* Top Gloss Sheen */}
        <Rect
          x="1.5"
          y="1.5"
          width="33"
          height="16"
          rx="9"
          fill="url(#appleGlossHighlight)"
        />

        {/* Apple Message Bubble Silhouette */}
        <Path
          d="M18 9C12.48 9 8 13.03 8 18C8 20.88 9.53 23.42 11.94 24.96C11.66 26.24 10.95 27.53 9.4 28.52C11.37 28.61 13.56 27.87 15.08 26.68C16.02 26.89 16.99 27 18 27C23.52 27 28 22.97 28 18C28 13.03 23.52 9 18 9Z"
          fill="#FFFFFF"
        />
        {/* Subtle Chat Tail Dot Accent */}
        <Circle cx="14" cy="18" r="1.3" fill={startColor} opacity="0.6" />
        <Circle cx="18" cy="18" r="1.3" fill={startColor} opacity="0.6" />
        <Circle cx="22" cy="18" r="1.3" fill={startColor} opacity="0.6" />
      </Svg>
    </View>
  );
}

/**
 * 2. Apple Vector Icon: Aset / Berkas Sumber (Design & Source Assets)
 */
export function AppleSourceAssetIcon({ size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="appleAssetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#8B5CF6" />
          <Stop offset="100%" stopColor="#6366F1" />
        </LinearGradient>
      </Defs>
      <Rect x="2" y="2" width="20" height="20" rx="6" fill="url(#appleAssetGrad)" />
      {/* Vector Pen & Layer */}
      <Path
        d="M7 16V13.5L13.5 7L16 9.5L9.5 16H7Z"
        fill="#FFFFFF"
      />
      <Circle cx="16.5" cy="7.5" r="1.5" fill="#FDE047" />
    </Svg>
  );
}

/**
 * 3. Apple Vector Icon: Deliverable Siap Pakai (Production-Ready Deliverables)
 */
export function AppleReadyDeliverableIcon({ size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="appleReadyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#0EA5E9" />
          <Stop offset="100%" stopColor="#2563EB" />
        </LinearGradient>
      </Defs>
      <Rect x="2" y="2" width="20" height="20" rx="6" fill="url(#appleReadyGrad)" />
      {/* Apple Box Package Vector */}
      <Path
        d="M12 6L17 9V15L12 18L7 15V9L12 6Z"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <Path
        d="M12 6V18M7 9L17 15M17 9L7 15"
        stroke="#2563EB"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * 4. Apple Vector Icon: Revisi Terstruktur (Structured Revisions)
 */
export function AppleStructuredRevisionIcon({ size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="appleRevGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#10B981" />
          <Stop offset="100%" stopColor="#059669" />
        </LinearGradient>
      </Defs>
      <Rect x="2" y="2" width="20" height="20" rx="6" fill="url(#appleRevGrad)" />
      {/* Apple Check / Sync Arrow */}
      <Path
        d="M7.5 12.5L10.5 15.5L16.5 9.5"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * 5. AppleGlossyBadge: Capsule pill with vector SVG icon and refined Apple typography
 */
export function AppleGlossyBadge({
  icon: IconComponent,
  label,
  style,
  textStyle,
}) {
  return (
    <View style={[styles.badgeContainer, style]}>
      {IconComponent && <IconComponent size={16} />}
      <Text style={[styles.badgeText, textStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  badgeText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11.5,
    color: "#1E293B",
    fontWeight: "600",
    letterSpacing: 0.1,
  },
});
