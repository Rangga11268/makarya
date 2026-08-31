import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
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
            <CheckCircle2 size={18} color={COLORS.accentLime} />
          ) : isDanger ? (
            <AlertCircle size={18} color={COLORS.danger} />
          ) : (
            <Info size={18} color={COLORS.accentCyan} />
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
    backgroundColor: "rgba(24, 26, 32, 0.95)",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  iconContainer: {
    marginRight: 10,
  },
  message: {
    color: COLORS.textWhite,
    fontSize: 13,
    fontWeight: "600",
    flexShrink: 1,
  },
});