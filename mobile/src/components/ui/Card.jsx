import React from "react";
import { View, StyleSheet } from "react-native";
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
    borderRadius: 24, // Dribbble squircle
    padding: 18,
    overflow: "hidden",
  },
  dark: {
    backgroundColor: COLORS.cardDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  cream: {
    backgroundColor: COLORS.cardCream,
  },
  lime: {
    backgroundColor: COLORS.accentLime,
  },
});