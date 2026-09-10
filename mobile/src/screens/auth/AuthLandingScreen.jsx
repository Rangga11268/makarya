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
import { COLORS } from "../../theme/colors";
import { Sparkles, ShieldCheck, ArrowRight } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

export function AuthLandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Background Soft Subtle Ambient Glow */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Svg width={width} height={height}>
          <Defs>
            <RadialGradient
              id="makaryaGlow"
              cx="50%"
              cy="36%"
              rx="65%"
              ry="45%"
              fx="50%"
              fy="36%"
            >
              <Stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.5" />
              <Stop offset="45%" stopColor="#F1F5F9" stopOpacity="0.35" />
              <Stop offset="85%" stopColor="#F8FAFC" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={width} height={height} fill="#F8FAFC" />
          <Rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="url(#makaryaGlow)"
          />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
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
              <ShieldCheck size={13} color="#059669" />
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

          {/* Action Buttons */}
          <View style={styles.buttonBlock}>
            {/* 1. Create account button (Makarya Signature Deep Slate 900) */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate("RoleSelection")}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryBtnText}>Buat Akun Baru</Text>
            </TouchableOpacity>

            {/* 2. Sign in button (White with subtle border) */}
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryBtnText}>Masuk ke Akun</Text>
            </TouchableOpacity>

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
    backgroundColor: "#F8FAFC",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: "space-between",
  },

  // Logo
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  logoImage: {
    width: 30,
    height: 30,
    borderRadius: 8,
  },
  logoText: {
    fontFamily: FONTS.displayBold,
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },

  // Center Graphic
  centerIllustrationWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },

  // Typography
  textBlock: {
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: "#059669",
    fontWeight: "700",
  },
  titleText: {
    fontFamily: FONTS.displayBold,
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitleText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: "#64748B",
    lineHeight: 20,
  },

  // Buttons
  buttonBlock: {
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: "#0F172A", // Signature Slate 900
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  secondaryBtn: {
    backgroundColor: "#FFFFFF",
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  secondaryBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  termsText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 15,
  },
  termsLink: {
    color: "#0F172A",
    fontWeight: "600",
  },
});
