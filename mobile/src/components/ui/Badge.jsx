import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";

export function Badge({ label, variant = "neutral", style, textStyle }) {
  const getColors = () => {
    switch (variant) {
      case "lime":
      case "brand":
      case "indigo":
        return {
          bg: "rgba(79, 70, 229, 0.1)",
          text: COLORS.brandIndigo,
          border: "rgba(79, 70, 229, 0.25)",
        };
      case "cyan":
      case "info":
        return {
          bg: "rgba(14, 165, 233, 0.1)",
          text: COLORS.brandCyan,
          border: "rgba(14, 165, 233, 0.25)",
        };
      case "success":
        return {
          bg: "rgba(16, 185, 129, 0.1)",
          text: COLORS.success,
          border: "rgba(16, 185, 129, 0.25)",
        };
      case "warning":
        return {
          bg: "rgba(245, 158, 11, 0.1)",
          text: COLORS.warning,
          border: "rgba(245, 158, 11, 0.25)",
        };
      case "danger":
        return {
          bg: "rgba(239, 68, 68, 0.1)",
          text: COLORS.danger,
          border: "rgba(239, 68, 68, 0.25)",
        };
      case "dark":
        return {
          bg: COLORS.canvasSoft,
          text: COLORS.textDark,
          border: COLORS.borderDark,
        };
      default:
        return {
          bg: COLORS.canvasSoft,
          text: COLORS.textMuted,
          border: COLORS.borderDark,
        };
    }
  };

  const c = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: c.bg,
          borderColor: c.border || "transparent",
          borderWidth: 1,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: c.text }, textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
});