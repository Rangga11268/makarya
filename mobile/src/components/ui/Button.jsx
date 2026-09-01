import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

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
  const isBrand =
    variant === "brand" || variant === "lime" || variant === "primary";
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
    fontFamily: FONTS.bodyBold,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
  text_sm: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
  },
  text_md: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
  },
  text_lg: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 15,
  },
  textBrand: {
    fontFamily: FONTS.bodyRegular,
    color: "#FFFFFF",
  },
  textSecondary: {
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textDark,
  },
  textOutline: {
    fontFamily: FONTS.bodyRegular,
    color: COLORS.brandIndigo,
  },
  textSoft: {
    fontFamily: FONTS.bodyRegular,
    color: COLORS.brandIndigo,
  },
  textGhost: {
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textMuted,
  },
  textDanger: {
    fontFamily: FONTS.bodyRegular,
    color: "#FFFFFF",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
