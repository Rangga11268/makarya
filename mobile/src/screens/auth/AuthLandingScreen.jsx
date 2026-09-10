import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
  Path,
} from "react-native-svg";
import { FONTS } from "../../theme/fonts";
import { Sparkles, ArrowRight } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

export function AuthLandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Background Soft Pastel Glow Graphic */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Svg width={width} height={height}>
          <Defs>
            <RadialGradient
              id="bgGlow"
              cx="50%"
              cy="42%"
              rx="60%"
              ry="45%"
              fx="50%"
              fy="42%"
            >
              <Stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.45" />
              <Stop offset="45%" stopColor="#FBCFE8" stopOpacity="0.3" />
              <Stop offset="80%" stopColor="#EDE9FE" stopOpacity="0.15" />
              <Stop offset="100%" stopColor="#FAFAFA" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={width} height={height} fill="#FAFAFA" />
          <Rect x="0" y="0" width={width} height={height} fill="url(#bgGlow)" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Top Logo */}
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <View style={styles.logoInnerDot} />
            </View>
            <Text style={styles.logoText}>Makarya</Text>
          </View>

          {/* Center Ambient 3D Star / Spark Graphic */}
          <View style={styles.centerIllustrationWrap}>
            <Svg width={220} height={220} viewBox="0 0 200 200">
              <Defs>
                <LinearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#F472B6" />
                  <Stop offset="40%" stopColor="#A855F7" />
                  <Stop offset="70%" stopColor="#6366F1" />
                  <Stop offset="100%" stopColor="#38BDF8" />
                </LinearGradient>
              </Defs>
              {/* Four-pointed soft star shape */}
              <Path
                d="M 100,10 Q 100,100 190,100 Q 100,100 100,190 Q 100,100 10,100 Q 100,100 100,10 Z"
                fill="url(#starGrad)"
                opacity="0.9"
              />
              <Circle cx="100" cy="100" r="18" fill="#FFFFFF" opacity="0.6" />
            </Svg>
          </View>

          {/* Main Headline & Subtitle */}
          <View style={styles.textBlock}>
            <Text style={styles.titleText}>
              Temukan Peluang{"\n"}Proyek Impianmu!
            </Text>
            <Text style={styles.subtitleText}>
              Platform kolaborasi terpercaya antara mahasiswa bertalenta kampus
              dan bisnis UMKM dengan garansi pembayaran escrow aman.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonBlock}>
            {/* 1. Create account button (Purple/Indigo) */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate("RoleSelection")}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryBtnText}>Buat Akun Baru</Text>
            </TouchableOpacity>

            {/* 2. Sign in button (Clean White with border) */}
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryBtnText}>Masuk ke Akun</Text>
            </TouchableOpacity>

            {/* Terms & Privacy footer note */}
            <Text style={styles.termsText}>
              Dengan melanjutkan, Anda menyetujui{" "}
              <Text style={styles.termsLink}>Ketentuan Layanan</Text> dan{" "}
              <Text style={styles.termsLink}>Kebijakan Privasi</Text>.
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
    backgroundColor: "#FAFAFA",
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
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
  },
  logoInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6366F1",
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
    marginVertical: 10,
  },

  // Typography
  textBlock: {
    marginBottom: 20,
  },
  titleText: {
    fontFamily: FONTS.displayBold,
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 10,
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
    backgroundColor: "#6366F1", // Vibrant purple/indigo matching mockup
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
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
    shadowOpacity: 0.04,
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
    marginTop: 6,
    lineHeight: 15,
  },
  termsLink: {
    color: "#6366F1",
    fontWeight: "600",
  },
});
