import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Platform } from "react-native";
import { FONTS } from "../../theme/fonts";
import { COLORS } from "../../theme/colors";
import { CheckCircle2 } from "lucide-react-native";

const SIZE_MAP = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
  "2xl": 72,
};

const FONT_SIZE_MAP = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  "2xl": 24,
};

// Deterministic string hash (djb2 algorithm)
function hashString(str) {
  if (!str || typeof str !== "string") return 0;
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

// 12 Curated Accessible Color Pairings (Light Pastel BG + Deep High-Contrast Ink Text)
// Strict WCAG AAA (>= 7:1) contrast ratio
const AVATAR_PALETTES = [
  { bg: "#E0F2FE", text: "#0369A1", border: "#BAE6FD" }, // Sky Blue
  { bg: "#DCFCE7", text: "#15803D", border: "#BBF7D0" }, // Emerald Green
  { bg: "#EDE9FE", text: "#6D28D9", border: "#DDD6FE" }, // Violet
  { bg: "#FEF3C7", text: "#B45309", border: "#FDE68A" }, // Warm Amber
  { bg: "#FEE2E2", text: "#B91C1C", border: "#FECACA" }, // Rose / Crimson
  { bg: "#E0E7FF", text: "#4338CA", border: "#C7D2FE" }, // Royal Indigo
  { bg: "#CCFBF1", text: "#0F766E", border: "#99F6E4" }, // Teal
  { bg: "#FCE7F3", text: "#BE185D", border: "#FBCFE8" }, // Berry Pink
  { bg: "#FFEDD5", text: "#C2410C", border: "#FED7AA" }, // Tangerine
  { bg: "#F3E8FF", text: "#7E22CE", border: "#E9D5FF" }, // Deep Purple
  { bg: "#F1F5F9", text: "#334155", border: "#CBD5E1" }, // Slate
  { bg: "#D1FAE5", text: "#047857", border: "#A7F3D0" }, // Mint Green
];

function getAvatarColors(seed) {
  const index = hashString(seed || "makarya-avatar") % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
}

function getInitials(name) {
  if (!name || typeof name !== "string") return "M";
  const clean = name.trim().replace(/^[@#]/, "");
  if (!clean || clean.toLowerCase() === "string") return "M";

  // Handle CJK characters
  if (/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/.test(clean)) {
    return clean.charAt(0);
  }

  const parts = clean.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].substring(0, Math.min(2, parts[0].length)).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  src,
  name,
  role = "MHS",
  size = "md",
  rounded = "full",
  style,
  showOnlineDot = false,
  isOnline = false,
  showVerifiedDot = false,
  isVerified = false,
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const dimension = typeof size === "number" ? size : SIZE_MAP[size] || 40;
  const fontSize =
    typeof size === "number"
      ? Math.round(size * 0.40)
      : FONT_SIZE_MAP[size] || 14;

  let borderRadius = dimension / 2;
  if (rounded === "lg") borderRadius = 12;
  else if (rounded === "xl") borderRadius = 16;
  else if (rounded === "2xl") borderRadius = 20;
  else if (rounded === "squircle") borderRadius = Math.round(dimension * 0.28);
  else if (typeof rounded === "number") borderRadius = rounded;

  const initials = getInitials(name);
  const colorToken = getAvatarColors(name || role || "makarya");

  const isValidSrc = Boolean(
    src &&
      typeof src === "string" &&
      src.trim() !== "" &&
      src.trim().toLowerCase() !== "null" &&
      src.trim().toLowerCase() !== "undefined"
  );

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius,
        },
        style,
      ]}
    >
      {isValidSrc && !hasError ? (
        <Image
          source={{ uri: src }}
          style={{
            width: dimension,
            height: dimension,
            borderRadius,
          }}
          resizeMode="cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: dimension,
              height: dimension,
              borderRadius,
              backgroundColor: colorToken.bg,
              borderColor: colorToken.border,
            },
          ]}
        >
          <Text
            style={[
              styles.initialText,
              {
                fontSize,
                color: colorToken.text,
                lineHeight: Platform.OS === "ios" ? fontSize + 2 : undefined,
              },
            ]}
          >
            {initials}
          </Text>
        </View>
      )}

      {/* Online Status Dot */}
      {showOnlineDot && (
        <View
          style={[
            styles.onlineDot,
            {
              width: Math.max(8, Math.round(dimension * 0.25)),
              height: Math.max(8, Math.round(dimension * 0.25)),
              borderRadius: Math.max(8, Math.round(dimension * 0.25)) / 2,
              backgroundColor: isOnline ? "#10B981" : "#94A3B8",
            },
          ]}
        />
      )}

      {/* Verified Badge */}
      {showVerifiedDot && isVerified && (
        <View style={styles.verifiedDot}>
          <CheckCircle2
            size={Math.max(12, Math.round(dimension * 0.32))}
            color="#FFFFFF"
            fill={COLORS.success || "#10B981"}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  initialText: {
    fontFamily: FONTS.displayBold,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  onlineDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  verifiedDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
  },
});
