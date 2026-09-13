import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { COLORS } from "../../theme/colors";
import { AppleGlossyCard } from "./AppleGlossyCard";

export { AppleGlossyCard };

export function Card({
  children,
  variant = "glossy", // default to apple glossy
  style,
  ...props
}) {
  if (variant === "glossy" || variant === "apple") {
    return (
      <AppleGlossyCard style={style} {...props}>
        {children}
      </AppleGlossyCard>
    );
  }

  return (
    <View
      style={[
        styles.base,
        variant === "dark" && styles.dark,
        variant === "cream" && styles.cream,
        variant === "lime" && styles.lime,
        style,
      ]}
      {...props}
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
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.94)",
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
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