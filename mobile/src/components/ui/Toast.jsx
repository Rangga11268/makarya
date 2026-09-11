import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  View,
  Platform,
  PanResponder,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FONTS } from "../../theme/fonts";
import { useToastStore } from "../../store/toastStore";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react-native";

export function Toast() {
  const { toast, hideToast } = useToastStore();
  const insets = useSafeAreaInsets();
  const [activeToast, setActiveToast] = useState(toast);

  const translateY = useRef(new Animated.Value(-60)).current;
  const scale = useRef(new Animated.Value(0.78)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Handle enter and exit transitions
  useEffect(() => {
    if (toast) {
      setActiveToast(toast);
      translateY.setValue(-60);
      scale.setValue(0.78);
      opacity.setValue(0);

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 95,
          friction: 7.5,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 95,
          friction: 7.5,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (activeToast) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -60,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setActiveToast(null);
      });
    }
  }, [toast]);

  const dismissToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -60,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      hideToast();
    });
  };

  // Apple-style swipe-up to dismiss gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 4;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < 0) {
          translateY.setValue(gestureState.dy);
        } else {
          translateY.setValue(gestureState.dy * 0.15);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -14 || gestureState.vy < -0.3) {
          dismissToast();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!activeToast) return null;

  const isSuccess = activeToast.type === "success";
  const isDanger =
    activeToast.type === "danger" || activeToast.type === "error";
  const isWarning = activeToast.type === "warning";

  const getBadgeConfig = () => {
    if (isSuccess) {
      return {
        label: "BERHASIL",
        bg: "rgba(16, 185, 129, 0.18)",
        border: "rgba(52, 211, 153, 0.35)",
        color: "#34D399",
        Icon: CheckCircle2,
      };
    }
    if (isDanger) {
      return {
        label: "PERHATIAN",
        bg: "rgba(239, 68, 68, 0.2)",
        border: "rgba(248, 113, 113, 0.35)",
        color: "#F87171",
        Icon: AlertCircle,
      };
    }
    if (isWarning) {
      return {
        label: "PERINGATAN",
        bg: "rgba(245, 158, 11, 0.18)",
        border: "rgba(251, 191, 36, 0.35)",
        color: "#FBBF24",
        Icon: AlertTriangle,
      };
    }
    return {
      label: "INFORMASI",
      bg: "rgba(59, 130, 246, 0.18)",
      border: "rgba(96, 165, 250, 0.35)",
      color: "#60A5FA",
      Icon: Info,
    };
  };

  const badge = getBadgeConfig();
  const IconComponent = badge.Icon;
  const topPosition =
    insets.top > 0
      ? insets.top + (Platform.OS === "ios" ? 4 : 8)
      : Platform.OS === "ios"
      ? 48
      : 36;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          top: topPosition,
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.pill}
        onPress={dismissToast}
        activeOpacity={0.92}
      >
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: badge.bg, borderColor: badge.border },
          ]}
        >
          <IconComponent size={14} color={badge.color} strokeWidth={2.4} />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.badgeLabel, { color: badge.color }]}>
            {badge.label}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {activeToast.message}
          </Text>
        </View>

        <TouchableOpacity
          onPress={dismissToast}
          style={styles.closeBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={11} color="rgba(255, 255, 255, 0.45)" strokeWidth={2.5} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 99999,
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 13,
    maxWidth: "94%",
    minWidth: 260,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 22,
    elevation: 16,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
    justifyContent: "center",
  },
  badgeLabel: {
    fontFamily: FONTS.displayBold,
    fontSize: 9.5,
    fontWeight: "700",
    letterSpacing: 0.7,
    textTransform: "uppercase",
    marginBottom: 1,
  },
  message: {
    fontFamily: FONTS.displaySemiBold,
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "600",
    letterSpacing: -0.2,
    lineHeight: 16.5,
  },
  closeBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },
});
