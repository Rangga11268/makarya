import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { ShieldCheck, GraduationCap } from "lucide-react-native";

export function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        {/* Brand Logo */}
        <View style={styles.logoCard}>
          <Image
            source={require("../../../assets/logo.webp")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Tagline */}
        <Text style={styles.brandTitle}>Makarya Mobile</Text>
        <Text style={styles.tagline}>
          Platform Marketplace Talenta Mahasiswa & UMKM Terverifikasi
        </Text>

        {/* Security Badge */}
        <View style={styles.securityBadge}>
          <ShieldCheck size={14} color={COLORS.brandCyan} />
          <Text style={styles.securityText}>100% Escrow Holding Protected</Text>
        </View>
      </View>

      {/* Bottom Loading Indicator & Copyright */}
      <View style={styles.bottomFooter}>
        <ActivityIndicator size="small" color={COLORS.brandIndigo} />
        <Text style={styles.copyrightText}>
          Karya Inovasi Digital Mahasiswa Indonesia
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 20,
    ...SHADOWS.md,
  },
  logo: {
    width: 160,
    height: 50,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 280,
    lineHeight: 19,
    fontWeight: "500",
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.brandCyanLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 20,
  },
  securityText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.brandCyan,
  },
  bottomFooter: {
    alignItems: "center",
    gap: 12,
  },
  copyrightText: {
    fontSize: 11,
    color: COLORS.textDim,
    fontWeight: "600",
  },
});
