import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  SafeAreaView,
  Image,
  Platform,
} from "react-native";
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Rect,
} from "react-native-svg";
import { FONTS } from "../../theme/fonts";
import { PebbleButton } from "../../components/ui/PebbleButton";
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";
import { ShieldCheck, ArrowRight } from "lucide-react-native";

const { width: W, height: H } = Dimensions.get("window");

const STATUSBAR_OFFSET =
  Platform.OS === "android" ? (StatusBar.currentHeight || 28) + 14 : 14;

// Authentic Indonesian Top Universities Official Logos Mapping
const CAMPUS_LOCAL_LOGOS = {
  ui: require("../../../assets/campuses/ui.png"),
  itb: require("../../../assets/campuses/itb.png"),
  ugm: require("../../../assets/campuses/ugm.png"),
  binus: require("../../../assets/campuses/binus.png"),
  its: require("../../../assets/campuses/its.png"),
  telkom: require("../../../assets/campuses/telkom.png"),
  unair: require("../../../assets/campuses/unair.png"),
  ub: require("../../../assets/campuses/ub.png"),
  ipb: require("../../../assets/campuses/ipb.png"),
  unpad: require("../../../assets/campuses/unpad.png"),
  undip: require("../../../assets/campuses/undip.png"),
  ubsi: require("../../../assets/campuses/ubsi.png"),
};

// Accurate Indonesian Top Universities Data with Authentic Identity Colors & Real Logos
const CAMPUS_ROWS = [
  // Row 1: UI, ITB, UGM, UBSI
  [
    {
      id: "ui",
      name: "Universitas Indonesia",
      short: "UI",
      bg: "#FBBF24", // Makara Kuning Emas UI
      textColor: "#0F172A",
      width: 182,
    },
    {
      id: "itb",
      name: "ITB Bandung",
      short: "ITB",
      bg: "#1D4ED8", // Ganesha Biru ITB
      textColor: "#FFFFFF",
      width: 140,
    },
    {
      id: "ugm",
      name: "UGM Yogyakarta",
      short: "UGM",
      bg: "#0F172A", // Surya Biru Navy UGM
      textColor: "#FFFFFF",
      width: 160,
    },
    {
      id: "ubsi",
      name: "Universitas BSI",
      short: "UBSI",
      bg: "#0284C7", // Biru UBSI
      textColor: "#FFFFFF",
      width: 145,
    },
  ],
  // Row 2: BINUS, ITS, TELKOM, UNPAD
  [
    {
      id: "binus",
      name: "BINUS University",
      short: "BINUS",
      bg: "#EA580C", // Oranye Binus
      textColor: "#FFFFFF",
      width: 156,
    },
    {
      id: "its",
      name: "ITS Surabaya",
      short: "ITS",
      bg: "#0284C7", // Biru Laut ITS
      textColor: "#FFFFFF",
      width: 138,
    },
    {
      id: "telkom",
      name: "Telkom University",
      short: "TELKOM",
      bg: "#DC2626", // Merah Telkom
      textColor: "#FFFFFF",
      width: 165,
    },
    {
      id: "unpad",
      name: "UNPAD Bandung",
      short: "UNPAD",
      bg: "#2563EB", // Biru Padjadjaran
      textColor: "#FFFFFF",
      width: 148,
    },
  ],
  // Row 3: UNAIR, UB, IPB, UNDIP
  [
    {
      id: "unair",
      name: "UNAIR Surabaya",
      short: "UNAIR",
      bg: "#CA8A04", // Kuning Emas Garuda Unair
      textColor: "#0F172A",
      width: 152,
    },
    {
      id: "ub",
      name: "UB Malang",
      short: "UB",
      bg: "#1E3A8A", // Biru Brawijaya
      textColor: "#FFFFFF",
      width: 130,
    },
    {
      id: "ipb",
      name: "IPB University",
      short: "IPB",
      bg: "#059669", // Hijau Daun IPB
      textColor: "#FFFFFF",
      width: 145,
    },
    {
      id: "undip",
      name: "UNDIP Semarang",
      short: "UNDIP",
      bg: "#0F172A", // Biru Diponegoro
      textColor: "#FFFFFF",
      width: 152,
    },
  ],
];

// Official Real Logo Emblem Container
function CampusBadgeLogo({ id, name }) {
  const logoSource = CAMPUS_LOCAL_LOGOS[id];

  return (
    <View style={styles.campusIconBox}>
      {logoSource ? (
        <Image
          source={logoSource}
          style={styles.realCampusLogo}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.fallbackInitial}>{name?.[0] || "U"}</Text>
      )}
    </View>
  );
}

export function AuthLandingScreen({ navigation }) {
  const { authContainerStyle } = useResponsiveLayout();

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Dark Ambient Gradient (Exact Onboarding Canvas Match #091424) */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Svg width={W} height={H}>
          <Defs>
            <RadialGradient
              id="onboardGlow"
              cx="50%"
              cy="25%"
              rx="75%"
              ry="50%"
              fx="50%"
              fy="25%"
            >
              <Stop offset="0%" stopColor="#1E293B" stopOpacity="0.85" />
              <Stop offset="45%" stopColor="#1E1B4B" stopOpacity="0.5" />
              <Stop offset="80%" stopColor="#0F172A" stopOpacity="0.95" />
              <Stop offset="100%" stopColor="#091424" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={W} height={H} fill="#091424" />
          <Rect x="0" y="0" width={W} height={H} fill="url(#onboardGlow)" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, authContainerStyle]}>
          {/* Top Brand Logo */}
          <View style={styles.topLogoRow}>
            <Image
              source={require("../../../assets/logo-icon.webp")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Makarya</Text>
          </View>

          {/* 1. Hero Block */}
          <View style={styles.heroSection}>
            <View style={styles.badgeRow}>
              <ShieldCheck size={13} color="#34D399" />
              <Text style={styles.badgeText}>
                Garansi Rekening Bersama 100% Aman
              </Text>
            </View>

            <Text style={styles.heroTitle}>
              Proyek Nyata UMKM{"\n"}untuk Portofolio{"\n"}Mahasiswa
            </Text>

            <Text style={styles.heroSub}>
              Kerjakan proyek industri, bangun bukti kompetensi resmi, dan
              terima honor dengan sistem pembayaran terjamin.
            </Text>
          </View>

          {/* 2. Structured, Angled University Pill Collage */}
          <View style={styles.collageContainer}>
            <View style={styles.collageHeader}>
              <Text style={styles.collageLabel}>
                Terhubung dengan mahasiswa & alumni kampus:
              </Text>
            </View>

            <View style={styles.stackArea}>
              {/* Row 1 - Tilted -2.5deg */}
              <View
                style={[
                  styles.staggeredRow,
                  { transform: [{ rotate: "-2.5deg" }], marginLeft: -12 },
                ]}
              >
                {CAMPUS_ROWS[0].map((c) => (
                  <View
                    key={c.id}
                    style={[
                      styles.campusPill,
                      { backgroundColor: c.bg, width: c.width },
                    ]}
                  >
                    <CampusBadgeLogo id={c.id} name={c.name} />
                    <Text
                      style={[styles.campusPillText, { color: c.textColor }]}
                      numberOfLines={1}
                    >
                      {c.name}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Row 2 - Tilted 2deg */}
              <View
                style={[
                  styles.staggeredRow,
                  { transform: [{ rotate: "2deg" }], marginLeft: 8 },
                ]}
              >
                {CAMPUS_ROWS[1].map((c) => (
                  <View
                    key={c.id}
                    style={[
                      styles.campusPill,
                      { backgroundColor: c.bg, width: c.width },
                    ]}
                  >
                    <CampusBadgeLogo id={c.id} name={c.name} />
                    <Text
                      style={[styles.campusPillText, { color: c.textColor }]}
                      numberOfLines={1}
                    >
                      {c.name}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Row 3 - Tilted -1.5deg */}
              <View
                style={[
                  styles.staggeredRow,
                  { transform: [{ rotate: "-1.5deg" }], marginLeft: -6 },
                ]}
              >
                {CAMPUS_ROWS[2].map((c) => (
                  <View
                    key={c.id}
                    style={[
                      styles.campusPill,
                      { backgroundColor: c.bg, width: c.width },
                    ]}
                  >
                    <CampusBadgeLogo id={c.id} name={c.name} />
                    <Text
                      style={[styles.campusPillText, { color: c.textColor }]}
                      numberOfLines={1}
                    >
                      {c.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* 3. Action Buttons */}
          <View style={styles.buttonBlock}>
            {/* Primary Action: Pearl White 3D Pebble */}
            <PebbleButton
              variant="pearl"
              size="lg"
              title="Buat Akun Baru"
              iconRight={ArrowRight}
              onPress={() => navigation.navigate("RoleSelection")}
            />

            {/* Secondary Action: Neu-Dark Pebble */}
            <PebbleButton
              variant="dark"
              size="lg"
              title="Masuk ke Akun"
              onPress={() => navigation.navigate("Login")}
            />

            {/* Clean Terms Notice */}
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
    paddingHorizontal: 24,
    paddingTop: STATUSBAR_OFFSET,
    paddingBottom: 24,
    justifyContent: "space-between",
  },

  // Brand Header
  topLogoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  logoImage: {
    width: 30,
    height: 30,
    borderRadius: 8,
  },
  logoText: {
    fontFamily: FONTS.displayBold,
    fontSize: 21,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },

  // Hero Section
  heroSection: {
    marginTop: 10,
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(16, 185, 129, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(110, 231, 183, 0.35)",
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#6EE7B7",
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  heroTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 27,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.6,
    lineHeight: 35,
    marginBottom: 8,
  },
  heroSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: "#CBD5E1",
    lineHeight: 20,
  },

  // Campus Pill Collage
  collageContainer: {
    marginVertical: 4,
    overflow: "hidden",
  },
  collageHeader: {
    marginBottom: 10,
  },
  collageLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11.5,
    color: "#94A3B8",
    fontWeight: "600",
  },
  stackArea: {
    gap: 9,
    paddingVertical: 4,
  },
  staggeredRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  campusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 22,
    gap: 7,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  campusIconBox: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 2.5,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1,
  },
  realCampusLogo: {
    width: "100%",
    height: "100%",
  },
  fallbackInitial: {
    fontFamily: FONTS.displayBold,
    fontSize: 11,
    fontWeight: "800",
    color: "#0F172A",
  },
  campusPillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11.5,
    fontWeight: "700",
    letterSpacing: -0.2,
    flexShrink: 1,
  },

  // Action Buttons
  buttonBlock: {
    gap: 10,
    marginTop: 6,
  },
  termsText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
    marginTop: 2,
    lineHeight: 16,
  },
  termsLink: {
    color: "#94A3B8",
    fontWeight: "600",
  },
});