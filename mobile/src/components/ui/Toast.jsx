import React, { useEffect, useRef } from "react";
import {
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { FONTS } from "../../theme/fonts";
import { useToastStore } from "../../store/toastStore";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react-native";

export function Toast() {
  const { toast, hideToast } = useToastStore();
  const translateY = useRef(new Animated.Value(-40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 9,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -30,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [toast, translateY, opacity]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isDanger = toast.type === "danger" || toast.type === "error";
  const isWarning = toast.type === "warning";

  const getBadgeConfig = () => {
    if (isSuccess) {
      return {
        bg: "rgba(16, 185, 129, 0.2)",
        color: "#10B981",
        Icon: CheckCircle2,
      };
    }
    if (isDanger) {
      return {
        bg: "rgba(239, 68, 68, 0.22)",
        color: "#EF4444",
        Icon: AlertCircle,
      };
    }
    if (isWarning) {
      return {
        bg: "rgba(245, 158, 11, 0.2)",
        color: "#F59E0B",
        Icon: AlertTriangle,
      };
    }
    return {
      bg: "rgba(59, 130, 246, 0.2)",
      color: "#60A5FA",
      Icon: Info,
    };
  };

  const badge = getBadgeConfig();
  const IconComponent = badge.Icon;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.pill}
        onPress={hideToast}
        activeOpacity={0.88}
      >
        <View style={[styles.iconCircle, { backgroundColor: badge.bg }]}>
          <IconComponent size={14} color={badge.color} strokeWidth={2.4} />
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {toast.message}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Platform.OS === "ios" ? 54 : 42,
    left: 20,
    right: 20,
    zIndex: 99999,
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.94)", // Apple Dynamic Island obsidian frosted feel
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    paddingLeft: 12,
    maxWidth: "92%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 12,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  message: {
    fontFamily: FONTS.displayBold,
    color: "#F8FAFC",
    fontSize: 12.5,
    fontWeight: "600",
    letterSpacing: -0.2,
    lineHeight: 17,
    flexShrink: 1,
  },
});