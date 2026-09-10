import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
} from "react-native-svg";
import { FONTS } from "../../theme/fonts";

const PEBBLE_VARIANTS = {
  // Vibrant Royal Sapphire Pebble (identical to 'Send ↑' in the reference)
  sapphire: {
    gradTop: "#60A5FA",
    gradMid: "#2563EB",
    gradBottom: "#1D4ED8",
    specularColor: "#FFFFFF",
    specularOpacity: 0.55,
    shadowColor: "#2563EB",
    shadowOpacity: 0.38,
    shadowRadius: 12,
    textColor: "#FFFFFF",
  },
  // Dark Glass/Silicone Pebble (identical to 'Receive ↓' in the reference)
  dark: {
    gradTop: "#2C354D",
    gradMid: "#1C2335",
    gradBottom: "#0F1422",
    specularColor: "#E0E7FF",
    specularOpacity: 0.32,
    shadowColor: "#000000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    textColor: "#FFFFFF",
  },
  // Deep Slate / Midnight Makarya Pebble
  midnight: {
    gradTop: "#334155",
    gradMid: "#0F172A",
    gradBottom: "#020617",
    specularColor: "#CBD5E1",
    specularOpacity: 0.28,
    shadowColor: "#0F172A",
    shadowOpacity: 0.32,
    shadowRadius: 10,
    textColor: "#FFFFFF",
  },
  // Pearl White Pebble
  pearl: {
    gradTop: "#FFFFFF",
    gradMid: "#F8FAFC",
    gradBottom: "#E2E8F0",
    specularColor: "#FFFFFF",
    specularOpacity: 0.9,
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    textColor: "#0F172A",
    borderColor: "#E2E8F0",
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
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const config = PEBBLE_VARIANTS[variant] || PEBBLE_VARIANTS.sapphire;

  const buttonText = title ?? (typeof children === "string" ? children : null);
  const iconSize = size === "lg" ? 18 : size === "sm" ? 14 : 16;

  const renderIcon = (iconProp) => {
    if (!iconProp) return null;
    if (React.isValidElement(iconProp)) return iconProp;
    if (typeof iconProp === "function") {
      return React.createElement(iconProp, { size: iconSize, color: config.textColor });
    }
    return null;
  };

  const isCircle = size === "circle" || size === "circle-sm";
  const gradId = "pebbleGrad_" + variant + "_" + (isCircle ? "c" : "p");
  const specId = "pebbleSpec_" + variant + "_" + (isCircle ? "c" : "p");

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      onLayout={(e) => {
        const { width: w, height: h } = e.nativeEvent.layout;
        if (w !== layout.width || h !== layout.height) {
          setLayout({ width: w, height: h });
        }
      }}
      style={[
        styles.base,
        styles[size],
        {
          shadowColor: config.shadowColor,
          shadowOpacity: disabled ? 0 : config.shadowOpacity,
          shadowRadius: config.shadowRadius,
          borderColor: config.borderColor || "transparent",
          borderWidth: config.borderColor ? 1 : 0,
        },
        width ? { width } : null,
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      {/* 3D Glossy Pebble Gradient & Specular Lens Layer */}
      {layout.width > 0 && layout.height > 0 && (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <Svg width={layout.width} height={layout.height}>
            <Defs>
              {/* Vertical Body Gradient for 3D Volume */}
              <LinearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={config.gradTop} />
                <Stop offset="45%" stopColor={config.gradMid} />
                <Stop offset="100%" stopColor={config.gradBottom} />
              </LinearGradient>

              {/* Curved Top Specular Reflection (The 3D Lens Highlight) */}
              <RadialGradient
                id={specId}
                cx="50%"
                cy="18%"
                rx="48%"
                ry="35%"
                fx="50%"
                fy="18%"
              >
                <Stop offset="0%" stopColor={config.specularColor} stopOpacity={config.specularOpacity} />
                <Stop offset="70%" stopColor={config.specularColor} stopOpacity={config.specularOpacity * 0.25} />
                <Stop offset="100%" stopColor={config.specularColor} stopOpacity="0" />
              </RadialGradient>
            </Defs>

            {/* Base Fill */}
            <Rect
              x="0"
              y="0"
              width={layout.width}
              height={layout.height}
              rx={999}
              ry={999}
              fill={"url(#" + gradId + ")"}
            />

            {/* Top Specular Sheen */}
            <Rect
              x="0"
              y="0"
              width={layout.width}
              height={layout.height}
              rx={999}
              ry={999}
              fill={"url(#" + specId + ")"}
            />
          </Svg>
        </View>
      )}

      {/* Fallback solid background before layout event */}
      {layout.width === 0 && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: config.gradMid, borderRadius: 999 },
          ]}
          pointerEvents="none"
        />
      )}

      {/* Content */}
      {loading ? (
        <ActivityIndicator size="small" color={config.textColor} />
      ) : (
        <View style={styles.content}>
          {Icon && <View style={{ marginRight: buttonText ? 8 : 0 }}>{renderIcon(Icon)}</View>}
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
          {IconRight && <View style={{ marginLeft: buttonText ? 8 : 0 }}>{renderIcon(IconRight)}</View>}
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
    overflow: "visible",
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
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
});
