import React from "react";
import { View, StyleSheet } from "react-native";
import { FONTS } from "../../theme/fonts";
import { COLORS } from "../../theme/colors";

export function Card({ children, variant = "dark", style }) {
  return (
    <View
      style={[
        styles.base,
        variant === "dark" && styles.dark,
        variant === "cream" && styles.cream,
        variant === "lime" && styles.lime,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 22,
    padding: 18,
    overflow: "hidden",
  },
  dark: {
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  cream: {
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  lime: {
    backgroundColor: COLORS.brandIndigo,
  },
});