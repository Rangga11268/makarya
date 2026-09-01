import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  Animated,
  StatusBar,
  Text,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

export function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Dead Center App Monogram Icon & Title */}
      <View style={styles.centerBox}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require("../../../assets/logo-icon.webp")}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          <Text style={styles.brandTitle}>Makarya</Text>
          <Text style={styles.tagline}>
            Marketplace Talenta Mahasiswa & UMKM
          </Text>
        </Animated.View>
      </View>

      {/* Subtle Minimalist Bottom Footer */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.footerCampus}>
          Universitas Bina Sarana Informatika
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50,
  },
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: {
    width: 104,
    height: 104,
    borderRadius: 24,
    marginBottom: 16,
  },
  brandTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 6,
    letterSpacing: -0.1,
  },
  footer: {
    alignItems: "center",
  },
  footerCampus: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    fontWeight: "500",
    color: "#94A3B8",
    letterSpacing: 0.2,
  },
});
