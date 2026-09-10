import React, { useId } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { FONTS } from "../../theme/fonts";

export const PEBBLE_VARIANTS = {
  // Vibrant Royal Sapphire Pebble (Send button reference)
  sapphire: {
    gradTop: "#3B82F6",
    gradBottom: "#1D4ED8",
    textColor: "#FFFFFF",
    shadowColor: "#2563EB",
    shadowOpacity: 0.38,
    borderTopColor: "rgba(255, 255, 255, 0.45)",
    borderBottomColor: "rgba(15, 23, 42, 0.35)",
    borderSideColor: "rgba(255, 255, 255, 0.18)",
    sheenOpacity: 0.28,
  },
  // Dark Glass/Silicone Pebble (Receive button reference)
  dark: {
    gradTop: "#2E384D",
    gradBottom: "#131A29",
    textColor: "#FFFFFF",
    shadowColor: "#0B0F19",
    shadowOpacity: 0.35,
    borderTopColor: "rgba(255, 255, 255, 0.3)",
    borderBottomColor: "rgba(0, 0, 0, 0.5)",
    borderSideColor: "rgba(255, 255, 255, 0.1)",
    sheenOpacity: 0.2,
  },
  // Deep Slate / Midnight Makarya Signature
  midnight: {
    gradTop: "#1E293B",
    gradBottom: "#0F172A",
    textColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOpacity: 0.4,
    borderTopColor: "rgba(255, 255, 255, 0.25)",
    borderBottomColor: "rgba(0, 0, 0, 0.6)",
    borderSideColor: "rgba(255, 255, 255, 0.08)",
    sheenOpacity: 0.18,
  },
  // Pearl White Pebble
  pearl: {
    gradTop: "#FFFFFF",
    gradBottom: "#F1F5F9",
    textColor: "#0F172A",
    shadowColor: "#64748B",
    shadowOpacity: 0.12,
    borderTopColor: "#FFFFFF",
    borderBottomColor: "#CBD5E1",
    borderSideColor: "#E2E8F0",
    sheenOpacity: 0.4,
  },
  // Emerald / Success Pebble
  emerald: {
    gradTop: "#10B981",
    gradBottom: "#047857",
    textColor: "#FFFFFF",
    shadowColor: "#059669",
    shadowOpacity: 0.35,
    borderTopColor: "rgba(255, 255, 255, 0.45)",
    borderBottomColor: "rgba(6, 78, 59, 0.35)",
    borderSideColor: "rgba(255, 255, 255, 0.18)",
    sheenOpacity: 0.28,
  },
  // Ruby / Danger Pebble (Keluar dari Akun)
  ruby: {
    gradTop: "#EF4444",
    gradBottom: "#B91C1C",
    textColor: "#FFFFFF",
    shadowColor: "#DC2626",
    shadowOpacity: 0.38,
    borderTopColor: "rgba(255, 255, 255, 0.45)",
    borderBottomColor: "rgba(153, 27, 27, 0.35)",
    borderSideColor: "rgba(255, 255, 255, 0.18)",
    sheenOpacity: 0.28,
  },
};

export function PebbleButton({
  title,
  children,
  onPress,
  variant = "sapphire",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  style,
  textStyle,
  width,
}) {
  const rawId = useId ? useId() : Math.random().toString();
  const safeId = "pb_" + String(rawId).replace(/[^a-zA-Z0-9]/g, "_");

  const config = PEBBLE_VARIANTS[variant] || PEBBLE_VARIANTS.sapphire;
  const buttonText = title ?? (typeof children === "string" ? children : null);
  const iconSize = size === "lg" ? 18 : size === "sm" ? 14 : 16;
  const isCircle =
    size === "circle" || size === "circle-sm" || size === "circle-lg";

  const renderIcon = (iconProp) => {
    if (!iconProp) return null;
    if (React.isValidElement(iconProp)) return iconProp;
    if (typeof iconProp === "function") {
      return React.createElement(iconProp, {
        size: iconSize,
        color: config.textColor,
        strokeWidth: 2.2,
      });
    }
    return null;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.outerShadow,
        styles[size],
        {
          shadowColor: config.shadowColor,
          shadowOpacity: disabled ? 0 : config.shadowOpacity,
          shadowRadius: config.shadowRadius,
        },
        width ? { width } : null,
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      {/* Clipped Inner Container for 3D Shaders & Gloss */}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          styles.innerClipped,
          {
            borderTopColor: config.borderTopColor,
            borderBottomColor: config.borderBottomColor,
            borderLeftColor: config.borderSideColor,
            borderRightColor: config.borderSideColor,
          },
        ]}
        pointerEvents="none"
      >
        {/* 1. Full-bleed Body Gradient and 2. Smooth Top Gloss Sheen */}
        <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%">
          <Defs>
            <LinearGradient id={safeId + "_body"} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={config.gradTop} />
              <Stop offset="100%" stopColor={config.gradBottom} />
            </LinearGradient>
            <LinearGradient id={safeId + "_sheen"} x1="0" y1="0" x2="0" y2="1">
              <Stop
                offset="0%"
                stopColor="#FFFFFF"
                stopOpacity={config.sheenOpacity || 0.28}
              />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
            </LinearGradient>
          </Defs>
          {/* Full body fill (no rx/ry, clipped by parent View borderRadius: 999) */}
          <Rect width="100%" height="100%" fill={`url(#${safeId + "_body"})`} />
          {/* Smooth upper-half gloss gradient with zero hard edges */}
          <Rect width="100%" height="52%" fill={`url(#${safeId + "_sheen"})`} />
        </Svg>
      </View>

      {/* Button Content Label & Icons */}
      {loading ? (
        <ActivityIndicator size="small" color={config.textColor} />
      ) : (
        <View style={styles.content}>
          {Icon && (
            <View style={{ marginRight: buttonText ? 8 : 0 }}>
              {renderIcon(Icon)}
            </View>
          )}
          {buttonText ? (
            <Text
              style={[
                styles.text,
                styles["text_" + size],
                { color: config.textColor },
                textStyle,
              ]}
            >
              {buttonText}
            </Text>
          ) : React.isValidElement(children) ? (
            children
          ) : null}
          {IconRight && (
            <View style={{ marginLeft: buttonText ? 8 : 0 }}>
              {renderIcon(IconRight)}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerShadow: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    backgroundColor: "transparent",
  },
  innerClipped: {
    borderRadius: 999,
    overflow: "hidden",
    borderTopWidth: 1.2,
    borderBottomWidth: 1.2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  sm: {
    height: 38,
    paddingHorizontal: 16,
  },
  md: {
    height: 48,
    paddingHorizontal: 22,
  },
  lg: {
    height: 54,
    paddingHorizontal: 28,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 0,
  },
  "circle-sm": {
    width: 40,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 0,
  },
  "circle-lg": {
    width: 54,
    height: 54,
    borderRadius: 27,
    paddingHorizontal: 0,
  },
  text: {
    fontFamily: FONTS.displayBold,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  text_sm: {
    fontSize: 12,
  },
  text_md: {
    fontSize: 14,
  },
  text_lg: {
    fontSize: 15,
  },
  text_circle: {
    fontSize: 0,
  },
  "text_circle-sm": {
    fontSize: 0,
  },
  "text_circle-lg": {
    fontSize: 0,
  },
});
