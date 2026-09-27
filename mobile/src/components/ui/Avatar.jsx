import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
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

function getInitials(name) {
  if (!name || typeof name !== "string") return "M";
  const clean = name.trim();
  if (!clean || clean.toLowerCase() === "string") return "M";

  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].substring(0, 1).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
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
      ? Math.round(size * 0.38)
      : FONT_SIZE_MAP[size] || 14;

  const normalizedRole = (role || "").toUpperCase();
  const isUmkm = normalizedRole === "UMKM" || normalizedRole === "CLIENT";
  const isMahasiswa =
    normalizedRole === "MHS" ||
    normalizedRole === "MAHASISWA" ||
    normalizedRole === "STUDENT";
  const isAdmin = normalizedRole === "ADMIN";

  let bgColor = "#F1F5F9";
  let textColor = "#334155";
  let borderColor = "#E2E8F0";

  if (isUmkm) {
    bgColor = "#FEF3C7";
    textColor = "#92400E";
    borderColor = "#FDE68A";
  } else if (isMahasiswa) {
    bgColor = "#EEF2FF";
    textColor = "#4338CA";
    borderColor = "#C7D2FE";
  } else if (isAdmin) {
    bgColor = "#0F172A";
    textColor = "#FFFFFF";
    borderColor = "#334155";
  }

  let borderRadius = dimension / 2;
  if (rounded === "lg") borderRadius = 12;
  else if (rounded === "xl") borderRadius = 16;
  else if (rounded === "2xl") borderRadius = 20;
  else if (typeof rounded === "number") borderRadius = rounded;

  const initials = getInitials(name);
  const isValidSrc = Boolean(
    src &&
      typeof src === "string" &&
      src.trim() !== "" &&
      src.trim().toLowerCase() !== "null" &&
      src.trim().toLowerCase() !== "undefined",
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
              backgroundColor: bgColor,
              borderColor,
            },
          ]}
        >
          <Text
            style={[
              styles.initialText,
              {
                fontSize,
                color: textColor,
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
            fill={COLORS.success}
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
    fontWeight: "700",
    textAlign: "center",
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
