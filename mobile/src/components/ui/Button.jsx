import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";

export function Button({
  title,
  onPress,
  variant = "brand",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  style,
  textStyle,
}) {
  const isBrand = variant === "brand" || variant === "lime" || variant === "primary";
  const isSecondary = variant === "secondary" || variant === "dark";
  const isOutline = variant === "outline";
  const isSoft = variant === "soft";
  const isGhost = variant === "ghost";
  const isDanger = variant === "danger";

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        styles[size],
        isBrand && styles.brand,
        isSecondary && styles.secondary,
        isOutline && styles.outline,
        isSoft && styles.soft,
        isGhost && styles.ghost,
        isDanger && styles.danger,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            isOutline || isGhost || isSoft || isSecondary
              ? COLORS.brandIndigo
              : COLORS.textInverse
          }
        />
      ) : (
        <View style={styles.content}>
          {Icon && <View style={styles.iconLeft}>{Icon}</View>}
          <Text
            style={[
              styles.text,
              styles[`text_${size}`],
              isBrand && styles.textBrand,
              isSecondary && styles.textSecondary,
              isOutline && styles.textOutline,
              isSoft && styles.textSoft,
              isGhost && styles.textGhost,
              isDanger && styles.textDanger,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {IconRight && <View style={styles.iconRight}>{IconRight}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999, // Ergonomic pill radius
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  lg: {
    paddingVertical: 15,
    paddingHorizontal: 28,
  },
  brand: {
    backgroundColor: COLORS.brandIndigo,
    ...SHADOWS.brandGlow,
  },
  secondary: {
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    ...SHADOWS.sm,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.brandIndigo,
  },
  soft: {
    backgroundColor: COLORS.brandIndigoLight,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: COLORS.danger,
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    fontWeight: "800",
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
  textBrand: {
    color: "#FFFFFF",
  },
  textSecondary: {
    color: COLORS.textDark,
  },
  textOutline: {
    color: COLORS.brandIndigo,
  },
  textSoft: {
    color: COLORS.brandIndigo,
  },
  textGhost: {
    color: COLORS.textMuted,
  },
  textDanger: {
    color: "#FFFFFF",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
