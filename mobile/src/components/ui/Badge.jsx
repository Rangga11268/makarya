import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

export function Badge({ label, variant = "neutral", style, textStyle }) {
  const getColors = () => {
    switch (variant) {
      case "lime":
      case "brand":
      case "indigo":
        return {
          bg: "#F1F5F9",
          text: COLORS.brandIndigo,
          border: "#E2E8F0",
        };
      case "cyan":
      case "info":
        return {
          bg: "#F8FAFC",
          text: "#334155",
          border: "#E2E8F0",
        };
      case "success":
        return {
          bg: "#ECFDF5",
          text: "#059669",
          border: "#A7F3D0",
        };
      case "warning":
        return {
          bg: "#FFFBEB",
          text: "#D97706",
          border: "#FDE68A",
        };
      case "danger":
        return {
          bg: "#FEF2F2",
          text: "#DC2626",
          border: "#FECACA",
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
      <Text style={[styles.text, { color: c.text }, textStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  text: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
});
