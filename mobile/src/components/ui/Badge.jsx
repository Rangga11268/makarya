import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";

export function Badge({ label, variant = "neutral", style, textStyle }) {
  const getColors = () => {
    switch (variant) {
      case "lime":
        return { bg: COLORS.accentLime, text: COLORS.textDark };
      case "cyan":
        return { bg: COLORS.accentCyan, text: COLORS.textDark };
      case "success":
        return { bg: COLORS.successBg, text: COLORS.success };
      case "warning":
        return { bg: COLORS.warningBg, text: COLORS.warning };
      case "danger":
        return { bg: COLORS.dangerBg, text: COLORS.danger };
      case "dark":
        return { bg: COLORS.cardDark, text: COLORS.textWhite, border: COLORS.borderDark };
      default:
        return { bg: "rgba(255, 255, 255, 0.08)", text: COLORS.textMuted };
    }
  };

  const c = getColors();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: c.bg, borderColor: c.border || "transparent", borderWidth: c.border ? 1 : 0 },
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
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});