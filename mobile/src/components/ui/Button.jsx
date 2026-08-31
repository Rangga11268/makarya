import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { COLORS } from "../../theme/colors";

export function Button({
  title,
  onPress,
  variant = "lime",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  style,
  textStyle,
}) {
  const isLime = variant === "lime";
  const isDark = variant === "dark";
  const isOutline = variant === "outline";
  const isGhost = variant === "ghost";
  const isDanger = variant === "danger";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        styles[size],
        isLime && styles.lime,
        isDark && styles.dark,
        isOutline && styles.outline,
        isGhost && styles.ghost,
        isDanger && styles.danger,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isLime ? COLORS.textDark : COLORS.textWhite}
        />
      ) : (
        <View style={styles.content}>
          {Icon && <View style={styles.iconLeft}>{Icon}</View>}
          <Text
            style={[
              styles.text,
              styles[`text_${size}`],
              isLime && styles.textLime,
              isDark && styles.textDarkVariant,
              isOutline && styles.textOutline,
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
    borderRadius: 999, // Pill shape like Dribbble
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
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  lime: {
    backgroundColor: COLORS.accentLime,
  },
  dark: {
    backgroundColor: COLORS.cardDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.accentLime,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: COLORS.danger,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  text_sm: {
    fontSize: 12,
  },
  text_md: {
    fontSize: 14,
  },
  text_lg: {
    fontSize: 16,
  },
  textLime: {
    color: COLORS.textWhite,
  },
  textDarkVariant: {
    color: COLORS.textWhite,
  },
  textOutline: {
    color: COLORS.accentLime,
  },
  textGhost: {
    color: COLORS.textMuted,
  },
  textDanger: {
    color: COLORS.textWhite,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
