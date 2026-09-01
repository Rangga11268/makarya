import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";

export function CategoryChip({ category, isSelected, onPress, variant = "default" }) {
  const IconComp = category.Icon;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        isSelected && styles.chipActive,
        variant === "soft" && isSelected && styles.chipActiveSoft,
      ]}
      activeOpacity={0.75}
    >
      {IconComp && (
        <IconComp
          size={13}
          color={
            isSelected
              ? variant === "soft"
                ? COLORS.brandIndigo
                : "#FFFFFF"
              : COLORS.brandIndigo
          }
        />
      )}
      <Text
        style={[
          styles.text,
          isSelected && styles.textActive,
          variant === "soft" && isSelected && styles.textActiveSoft,
        ]}
      >
        {category.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginRight: 6,
    ...SHADOWS.sm,
  },
  chipActive: {
    backgroundColor: COLORS.brandIndigo,
    borderColor: COLORS.brandIndigo,
  },
  chipActiveSoft: {
    backgroundColor: COLORS.brandIndigoLight,
    borderColor: "rgba(79, 70, 229, 0.25)",
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  textActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  textActiveSoft: {
    color: COLORS.brandIndigo,
    fontWeight: "800",
  },
});
