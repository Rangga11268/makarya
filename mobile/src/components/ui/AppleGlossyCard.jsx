import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { COLORS } from "../../theme/colors";

/**
 * AppleGlossyCard
 * Reusable Apple-style card component featuring:
 * - 22px squircle corner radius
 * - Translucent crisp white / frosted glass surface
 * - Subtle diffused multi-layer ambient shadow (no harsh Android elevation)
 * - Micro-border rim (rgba border with optional inner sheen)
 */
export function AppleGlossyCard({
  children,
  style,
  onPress,
  variant = "default", // "default" | "hero" | "subtle" | "tinted"
  activeOpacity = 0.85,
  ...props
}) {
  const cardStyle = [
    styles.base,
    variant === "hero" && styles.hero,
    variant === "subtle" && styles.subtle,
    variant === "tinted" && styles.tinted,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={activeOpacity}
        style={cardStyle}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.94)",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.88)"
        : "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: Platform.OS === "android" ? 1 : 2,
    overflow: "hidden",
  },
  hero: {
    padding: 20,
    borderRadius: 24,
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.92)"
        : "rgba(255, 255, 255, 0.98)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: Platform.OS === "android" ? 2 : 3,
  },
  subtle: {
    backgroundColor:
      Platform.OS === "android" ? "#F8FAFC" : "rgba(248, 250, 252, 0.85)",
    borderRadius: 18,
    padding: 14,
    borderColor: "rgba(226, 232, 240, 0.75)",
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 0,
  },
  tinted: {
    backgroundColor:
      Platform.OS === "android" ? "#F0F7FF" : "rgba(240, 247, 255, 0.9)",
    borderColor: "rgba(191, 219, 254, 0.8)",
  },
});
