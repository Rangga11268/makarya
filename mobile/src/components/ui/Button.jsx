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
  children,
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
  const isGoogle = variant === "google" || variant === "white";
  const isOutline = variant === "outline";
  const isSoft = variant === "soft";
  const isGhost = variant === "ghost";
  const isDanger = variant === "danger";

  const buttonText = title ?? (typeof children === "string" ? children : null);

  const iconColor =
    isOutline || isGhost || isSoft || isSecondary || isGoogle
      ? COLORS.brandIndigo
      : isBrand
        ? "#FFFFFF"
        : COLORS.textDark;
  const iconSize = size === "lg" ? 18 : size === "sm" ? 14 : 16;

  const renderIcon = (iconProp, isLeft = true) => {
    if (!iconProp) return null;
    if (React.isValidElement(iconProp)) {
      return (
        <View style={isLeft ? styles.iconLeft : styles.iconRight}>
          {iconProp}
        </View>
      );
    }
    if (
      typeof iconProp === "function" ||
      (typeof iconProp === "object" &&
        iconProp !== null &&
        ("$$typeof" in iconProp || "render" in iconProp))
    ) {
      return (
        <View style={isLeft ? styles.iconLeft : styles.iconRight}>
          {React.createElement(iconProp, { size: iconSize, color: iconColor })}
        </View>
      );
    }
    return null;
  };

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
        isGoogle && styles.google,
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
            isOutline || isGhost || isSoft || isSecondary || isGoogle
              ? COLORS.brandIndigo
              : COLORS.textInverse
          }
        />
      ) : (
        <View style={styles.content}>
          {renderIcon(Icon, true)}
          {buttonText ? (
            <Text
              style={[
                styles.text,
                styles[`text_${size}`],
                isBrand && styles.textBrand,
                isSecondary && styles.textSecondary,
                isGoogle && styles.textGoogle,
                isOutline && styles.textOutline,
                isSoft && styles.textSoft,
                isGhost && styles.textGhost,
                isDanger && styles.textDanger,
                textStyle,
              ]}
            >
              {buttonText}
            </Text>
          ) : React.isValidElement(children) ? (
            children
          ) : typeof children === "function" ? (
            React.createElement(children)
          ) : null}
          {renderIcon(IconRight, false)}
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
  brand: {
    backgroundColor: COLORS.brandIndigo,
    shadowColor: COLORS.brandIndigo,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  secondary: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1.2,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  google: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.2,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  outline: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  soft: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1.2,
    borderColor: "#BFDBFE",
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
    fontFamily: FONTS.bodyMedium,
    fontWeight: "600",
    letterSpacing: -0.1,
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
  textGoogle: {
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
