import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FONTS } from "../../theme/fonts";
import { useToastStore } from "../../store/toastStore";
import { COLORS } from "../../theme/colors";
import { CheckCircle2, AlertCircle, Info } from "lucide-react-native";

export function Toast() {
  const { toast } = useToastStore();

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isDanger = toast.type === "danger";

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.pill}>
        <View style={styles.iconContainer}>
          {isSuccess ? (
            <CheckCircle2 size={18} color={COLORS.success} />
          ) : isDanger ? (
            <AlertCircle size={18} color={COLORS.danger} />
          ) : (
            <Info size={18} color={COLORS.brandCyan} />
          )}
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {toast.message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A", // Sleek dark slate pill with high contrast
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  iconContainer: {
    marginRight: 10,
  },
  message: {
    fontFamily: FONTS.bodyBold,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    flexShrink: 1,
  },
});