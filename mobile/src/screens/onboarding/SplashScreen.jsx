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
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const exitFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Staggered Spring Entry
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 36,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1150,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: false,
      }),
    ]).start();

    // 2. Smooth Exit Fade-Out Transition
    const exitTimer = setTimeout(() => {
      Animated.timing(exitFadeAnim, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) onFinish();
      });
    }, 1450);

    return () => clearTimeout(exitTimer);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Animated.View style={[styles.container, { opacity: exitFadeAnim }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent />

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
          {/* Apple Squircle Emblem Frame */}
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
    paddingVertical: Platform.OS === "ios" ? 54 : 36,
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
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 3,
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 14,
  },
  brandTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.6,
    marginTop: 18,
  },
  tagline: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 10.5,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 4,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  // Hairline 2px Progress Capsule
  progressTrack: {
    width: 46,
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: "rgba(15, 23, 42, 0.07)",
    marginTop: 22,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#0F172A",
    borderRadius: 1.5,
  },
  footer: {
    alignItems: "center",
  },
  trustBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "rgba(15, 23, 42, 0.03)",
  },
  trustText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10.5,
    fontWeight: "500",
    color: "#64748B",
    letterSpacing: 0.1,
  },
});
