import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  Animated,
  StatusBar,
  Text,
  Easing,
  Platform,
} from "react-native";
import { FONTS } from "../../theme/fonts";
import { ShieldCheck } from "lucide-react-native";

export function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const exitFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Smooth Apple Spring & Fade Entry
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 30,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1850,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
        useNativeDriver: false,
      }),
    ]).start();

    // 2. Elegant Exit Transition after user comfortably sees the branding
    const exitTimer = setTimeout(() => {
      Animated.timing(exitFadeAnim, {
        toValue: 0,
        duration: 320,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) onFinish();
      });
    }, 2350);

    return () => clearTimeout(exitTimer);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Animated.View style={[styles.container, { opacity: exitFadeAnim }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FAFC"
        translucent
      />

      {/* 1. Center Identity Monolith */}
      <View style={styles.centerBox}>
        <Animated.View
          style={[
            styles.identityWrap,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Apple Squircle Elevated Emblem */}
          <View style={styles.squircleContainer}>
            <Image
              source={require("../../../assets/logo-icon.webp")}
              style={styles.logoIcon}
              resizeMode="contain"
            />
          </View>

          {/* Clean Wordmark Typography */}
          <Text style={styles.brandTitle}>Makarya</Text>
          <Text style={styles.tagline}>Kolaborasi Talenta Kampus & UMKM</Text>

          {/* Hairline Progress Capsule (Indicates workspace hydration) */}
          <View style={styles.progressTrack}>
            <Animated.View
              style={[styles.progressBar, { width: progressWidth }]}
            />
          </View>
        </Animated.View>
      </View>

      {/* 2. Apple Understated Minimalist Trust Footer */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <View style={styles.trustBadgeRow}>
          <ShieldCheck size={12} color="#10B981" strokeWidth={2.4} />
          <Text style={styles.trustText}>Escrow Platform Terverifikasi</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC", // Apple Slate-50 Canvas
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Platform.OS === "ios" ? 58 : 40,
  },
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  identityWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  // Apple Squircle Elevated Emblem
  squircleContainer: {
    width: 96,
    height: 96,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  logoIcon: {
    width: 66,
    height: 66,
    borderRadius: 16,
  },
  brandTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.6,
    marginTop: 20,
  },
  tagline: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 5,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  // Hairline Progress Capsule
  progressTrack: {
    width: 68,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(15, 23, 42, 0.08)",
    marginTop: 24,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#0F172A",
    borderRadius: 2,
  },
  footer: {
    alignItems: "center",
  },
  trustBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "rgba(15, 23, 42, 0.04)",
  },
  trustText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
    letterSpacing: 0.1,
  },
});
