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
  // Vibrant Royal Sapphire Pebble (identical to 'Send ↑' in the reference)
  sapphire: {
    gradTop: "#3B82F6",
    gradMid: "#2563EB",
    gradBottom: "#1D4ED8",
    textColor: "#FFFFFF",
    shadowColor: "#2563EB",
    shadowOpacity: 0.45,
    shadowRadius: 10,
    borderTopColor: "rgba(255, 255, 255, 0.65)",
    borderBottomColor: "rgba(15, 23, 42, 0.4)",
    borderSideColor: "rgba(255, 255, 255, 0.25)",
    specularOpacity: 0.35,
    lightBarOpacity: 0.8,
  },
  // Dark Glass/Silicone Pebble (identical to 'Receive ↓' in the reference)
  dark: {
    gradTop: "#334155",
    gradMid: "#1E293B",
    gradBottom: "#0F172A",
    textColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    borderTopColor: "rgba(255, 255, 255, 0.4)",
    borderBottomColor: "rgba(0, 0, 0, 0.6)",
    borderSideColor: "rgba(255, 255, 255, 0.15)",
    specularOpacity: 0.28,
    lightBarOpacity: 0.65,
  },
  // Deep Slate / Midnight Makarya Signature
  midnight: {
    gradTop: "#1E293B",
    gradMid: "#0F172A",
    gradBottom: "#020617",
    textColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOpacity: 0.45,
    shadowRadius: 10,
    borderTopColor: "rgba(255, 255, 255, 0.35)",
    borderBottomColor: "rgba(0, 0, 0, 0.7)",
    borderSideColor: "rgba(255, 255, 255, 0.12)",
    specularOpacity: 0.25,
    lightBarOpacity: 0.6,
  },
  // Pearl White Pebble
  pearl: {
    gradTop: "#FFFFFF",
    gradMid: "#F8FAFC",
    gradBottom: "#E2E8F0",
    textColor: "#0F172A",
    shadowColor: "#0F172A",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderTopColor: "#FFFFFF",
    borderBottomColor: "#CBD5E1",
    borderSideColor: "#E2E8F0",
    specularOpacity: 0.75,
    lightBarOpacity: 0.95,
  },
  // Emerald / Success Pebble
  emerald: {
    gradTop: "#34D399",
    gradMid: "#059669",
    gradBottom: "#047857",
    textColor: "#FFFFFF",
    shadowColor: "#059669",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    borderTopColor: "rgba(255, 255, 255, 0.6)",
    borderBottomColor: "rgba(6, 78, 59, 0.4)",
    borderSideColor: "rgba(255, 255, 255, 0.2)",
    specularOpacity: 0.35,
    lightBarOpacity: 0.75,
  },
  // Ruby / Danger Pebble
  ruby: {
    gradTop: "#F87171",
    gradMid: "#EF4444",
    gradBottom: "#DC2626",
    textColor: "#FFFFFF",
    shadowColor: "#EF4444",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    borderTopColor: "rgba(255, 255, 255, 0.6)",
    borderBottomColor: "rgba(153, 27, 27, 0.4)",
    borderSideColor: "rgba(255, 255, 255, 0.2)",
    specularOpacity: 0.35,
    lightBarOpacity: 0.75,
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
  const isCircle = size === "circle" || size === "circle-sm" || size === "circle-lg";

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
        {/* 1. Vertical Gradient Body Volume */}
        <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%">
          <Defs>
            <LinearGradient id={safeId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={config.gradTop} />
              <Stop offset="55%" stopColor={config.gradMid} />
              <Stop offset="100%" stopColor={config.gradBottom} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" rx={999} ry={999} fill={`url(#${safeId})`} />
        </Svg>

        {/* 2. 3D Specular Sheen (Curved Top Lens Pill) */}
        <View
          pointerEvents="none"
          style={[
            styles.specularCap,
            isCircle ? styles.specularCircle : styles.specularPill,
            {
              backgroundColor: "#FFFFFF",
              opacity: config.specularOpacity,
            },
          ]}
        />

        {/* 3. Crisp Top Reflection Edge Bar */}
        <View
          pointerEvents="none"
          style={[
            styles.lightBar,
            isCircle ? styles.lightBarCircle : styles.lightBarPill,
            {
              backgroundColor: "#FFFFFF",
              opacity: config.lightBarOpacity,
            },
          ]}
        />
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
    borderTopWidth: 1.4,
    borderBottomWidth: 1.4,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  specularCap: {
    position: "absolute",
    top: 2,
    height: "44%",
    borderRadius: 999,
  },
  specularPill: {
    left: "10%",
    right: "10%",
  },
  specularCircle: {
    left: "14%",
    right: "14%",
  },
  lightBar: {
    position: "absolute",
    top: 1.5,
    height: 1.5,
    borderRadius: 1,
  },
  lightBarPill: {
    left: "20%",
    right: "20%",
  },
  lightBarCircle: {
    left: "26%",
    right: "26%",
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
