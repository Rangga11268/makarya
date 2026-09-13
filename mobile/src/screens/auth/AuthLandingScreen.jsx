import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  SafeAreaView,
  Image,
  Platform,
} from "react-native";
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Rect,
  Circle,
  Path,
} from "react-native-svg";
import { FONTS } from "../../theme/fonts";
import { ShieldCheck } from "lucide-react-native";
import { PebbleButton } from "../../components/ui/PebbleButton";

import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";

const STATUSBAR_OFFSET =
  Platform.OS === "android" ? (StatusBar.currentHeight || 28) + 16 : 16;

export function AuthLandingScreen({ navigation }) {
  const { width, height, authContainerStyle } = useResponsiveLayout();
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Dark Ambient Glow matching Onboarding Background (#091424) */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Svg width={width} height={height}>
          <Defs>
            <RadialGradient
              id="darkAmbientGlow"
              cx="50%"
              cy="36%"
              rx="75%"
              ry="50%"
              fx="50%"
              fy="36%"
            >
              <Stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
              <Stop offset="40%" stopColor="#1E1B4B" stopOpacity="0.45" />
              <Stop offset="80%" stopColor="#0F172A" stopOpacity="0.9" />
              <Stop offset="100%" stopColor="#091424" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={width} height={height} fill="#091424" />
          <Rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="url(#darkAmbientGlow)"
          />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, authContainerStyle]}>
          {/* Top Logo with Official Makarya Icon */}
          <View style={styles.logoRow}>
            <Image
              source={require("../../../assets/logo-icon.webp")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Makarya</Text>
          </View>

          {/* Center Graphic: Ambient 4-point Luminous Star (Makarya Blue/Indigo Tone) */}
          <View style={styles.centerIllustrationWrap}>
            <Svg width={220} height={220} viewBox="0 0 200 200">
              <Defs>
                <LinearGradient
                  id="makaryaStarGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <Stop offset="0%" stopColor="#38BDF8" />
                  <Stop offset="40%" stopColor="#6366F1" />
                  <Stop offset="80%" stopColor="#0F172A" />
                  <Stop offset="100%" stopColor="#4F46E5" />
                </LinearGradient>
              </Defs>
              <Path
                d="M 100,12 Q 100,100 188,100 Q 100,100 100,188 Q 100,100 12,100 Q 100,100 100,12 Z"
                fill="url(#makaryaStarGrad)"
                opacity="0.92"
              />
              <Circle cx="100" cy="100" r="16" fill="#FFFFFF" opacity="0.65" />
            </Svg>
          </View>

          {/* Main Headline & Subtitle */}
          <View style={styles.textBlock}>
            <View style={styles.badgeRow}>
              <ShieldCheck size={13} color="#34D399" />
              <Text style={styles.badgeText}>Garansi Escrow 100% Aman</Text>
            </View>

            <Text style={styles.titleText}>
              Kolaborasi Nyata{"\n"}Mahasiswa & UMKM
            </Text>
            <Text style={styles.subtitleText}>
              Temukan proyek digital berkualitas, bangun portofolio profesional,
              dan raih honor pengerjaan dengan sistem rekening bersama aman.
            </Text>
          </View>

          {/* Action Buttons (3D Glossy Pebble) */}
          <View style={styles.buttonBlock}>
            {/* 1. Create account button (3D Pearl White Pebble) */}
            <PebbleButton
              variant="pearl"
              size="lg"
              title="Buat Akun Baru"
              onPress={() => navigation.navigate("RoleSelection")}
            />

            {/* 2. Sign in button (3D Neu-skeuomorphic Dark Pebble like 'Receive ↓') */}
            <PebbleButton
              variant="dark"
              size="lg"
              title="Masuk ke Akun"
              onPress={() => navigation.navigate("Login")}
            />

            {/* Terms note */}
            <Text style={styles.termsText}>
              Dengan melanjutkan, Anda menyetujui{" "}
              <Text style={styles.termsLink}>Ketentuan Layanan</Text> &{" "}
              <Text style={styles.termsLink}>Kebijakan Privasi</Text> Makarya.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#091424",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: STATUSBAR_OFFSET,
    paddingBottom: 28,
    justifyContent: "space-between",
  },

  // Logo
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  logoImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  logoText: {
    fontFamily: FONTS.displayBold,
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },

  // Center Graphic
  centerIllustrationWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },

  // Typography
  textBlock: {
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(16, 185, 129, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(110, 231, 183, 0.35)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginBottom: 14,
  },
  badgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#6EE7B7",
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  titleText: {
    fontFamily: FONTS.displayBold,
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitleText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 21,
  },

  // Buttons (Apple Pill Style)
  buttonBlock: {
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: "#FFFFFF",
    height: 54,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
    fontWeight: "700",
    color: "#091424",
    letterSpacing: -0.2,
  },
  secondaryBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    height: 54,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
    fontWeight: "700",
    color: "#F8FAFC",
    letterSpacing: -0.2,
  },
  termsText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 16,
  },
  termsLink: {
    color: "#94A3B8",
    fontWeight: "600",
  },
});
