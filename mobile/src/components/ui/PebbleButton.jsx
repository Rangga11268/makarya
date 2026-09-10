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
  // Vibrant Royal Sapphire Pebble
  sapphire: {
    baseColor: "#2563EB",
    gradTop: "#3B82F6",
    gradBottom: "#1D4ED8",
    textColor: "#FFFFFF",
    shadowColor: "#2563EB",
    shadowOpacity: 0.22,
    borderColor: "rgba(255, 255, 255, 0.25)",
    sheenOpacity: 0.22,
  },
  // Dark Glass/Silicone Pebble
  dark: {
    baseColor: "#1E293B",
    gradTop: "#2E384D",
    gradBottom: "#131A29",
    textColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOpacity: 0.18,
    borderColor: "rgba(255, 255, 255, 0.12)",
    sheenOpacity: 0.18,
  },
  // Deep Slate / Midnight Makarya Signature
  midnight: {
    baseColor: "#0F172A",
    gradTop: "#1E293B",
    gradBottom: "#0F172A",
    textColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOpacity: 0.2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    sheenOpacity: 0.15,
  },
  // Pearl White Pebble
  pearl: {
    baseColor: "#FFFFFF",
    gradTop: "#FFFFFF",
    gradBottom: "#F1F5F9",
    textColor: "#0F172A",
    shadowColor: "#64748B",
    shadowOpacity: 0.08,
    borderColor: "#E2E8F0",
    sheenOpacity: 0.35,
  },
  // Luminous Ice-Blue Pebble
  ice: {
    baseColor: "#EFF6FF",
    gradTop: "#FFFFFF",
    gradBottom: "#EFF6FF",
    textColor: "#2563EB",
    shadowColor: "#2563EB",
    shadowOpacity: 0.08,
    borderColor: "#BFDBFE",
    sheenOpacity: 0.35,
  },
  // Emerald / Success Pebble
  emerald: {
    baseColor: "#059669",
    gradTop: "#10B981",
    gradBottom: "#047857",
    textColor: "#FFFFFF",
    shadowColor: "#059669",
    shadowOpacity: 0.2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    sheenOpacity: 0.22,
  },
  // Ruby / Danger Pebble
  ruby: {
    baseColor: "#DC2626",
    gradTop: "#EF4444",
    gradBottom: "#B91C1C",
    textColor: "#FFFFFF",
    shadowColor: "#DC2626",
    shadowOpacity: 0.22,
    borderColor: "rgba(255, 255, 255, 0.2)",
    sheenOpacity: 0.22,
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
  const bodyId = safeId + "_b";
  const sheenId = safeId + "_s";

  const config = PEBBLE_VARIANTS[variant] || PEBBLE_VARIANTS.sapphire;
  const buttonText = title ?? (typeof children === "string" ? children : null);
  const isCircle =
    size === "circle" || size === "circle-sm" || size === "circle-lg";

  const iconSize =
    size === "circle" || size === "circle-lg"
      ? 20
      : size === "circle-sm"
        ? 17
        : size === "lg"
          ? 18
          : size === "sm"
            ? 14
            : 16;

  const renderIcon = (iconProp) => {
    if (!iconProp) return null;
    if (React.isValidElement(iconProp)) return iconProp;
    try {
      return React.createElement(iconProp, {
        size: iconSize,
        color: config.textColor,
        strokeWidth: 2.2,
      });
    } catch {
      return null;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        styles[size],
        {
          backgroundColor: config.baseColor,
          borderColor: config.borderColor,
          shadowColor: config.shadowColor,
          shadowOpacity: disabled ? 0 : config.shadowOpacity,
        },
        width ? { width } : null,
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      {/* Clipped Inner Container for Smooth Gradient & Sheen */}
      <View style={styles.innerClipped} pointerEvents="none">
        <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%">
          <Defs>
            <LinearGradient id={bodyId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={config.gradTop} />
              <Stop offset="100%" stopColor={config.gradBottom} />
            </LinearGradient>
            <LinearGradient id={sheenId} x1="0" y1="0" x2="0" y2="1">
              <Stop
                offset="0%"
                stopColor="#FFFFFF"
                stopOpacity={config.sheenOpacity || 0.25}
              />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill={`url(#${bodyId})`} />
          <Rect width="100%" height="50%" fill={`url(#${sheenId})`} />
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
  base: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  innerClipped: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    overflow: "hidden",
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
