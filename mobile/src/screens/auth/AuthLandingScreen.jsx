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
  TouchableOpacity,
} from "react-native";
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Rect,
  Circle,
  Path,
  G,
} from "react-native-svg";
import { FONTS } from "../../theme/fonts";
import { PebbleButton } from "../../components/ui/PebbleButton";
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";
import { ShieldCheck, ArrowRight } from "lucide-react-native";

const { width: W, height: H } = Dimensions.get("window");

const STATUSBAR_OFFSET =
  Platform.OS === "android" ? (StatusBar.currentHeight || 28) + 14 : 14;

// Accurate Indonesian Top Universities Data with Authentic Identity Colors & Vector Emblems
const CAMPUS_ROWS = [
  // Row 1: UI, ITB, UGM
  [
    {
      id: "ui",
      name: "Universitas Indonesia",
      short: "UI",
      bg: "#FBBF24", // Makara Kuning Emas UI
      textColor: "#0F172A",
      iconBg: "#0F172A",
      iconColor: "#FBBF24",
      type: "makara",
      width: 178,
    },
    {
      id: "itb",
      name: "ITB Bandung",
      short: "ITB",
      bg: "#1D4ED8", // Ganesha Biru ITB
      textColor: "#FFFFFF",
      iconBg: "rgba(255,255,255,0.2)",
      iconColor: "#FFFFFF",
      type: "ganesha",
      width: 140,
    },
    {
      id: "ugm",
      name: "UGM Yogyakarta",
      short: "UGM",
      bg: "#0F172A", // Surya Biru Navy UGM
      textColor: "#FFFFFF",
      iconBg: "#F59E0B",
      iconColor: "#0F172A",
      type: "surya",
      width: 160,
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
      iconBg: "rgba(255,255,255,0.2)",
      iconColor: "#FFFFFF",
      type: "binus_b",
      width: 156,
    },
    {
      id: "its",
      name: "ITS Surabaya",
      short: "ITS",
      bg: "#0284C7", // Biru Laut ITS
      textColor: "#FFFFFF",
      iconBg: "#FFFFFF",
      iconColor: "#0284C7",
      type: "its_gear",
      width: 138,
    },
    {
      id: "telkom",
      name: "Telkom University",
      short: "TELKOM",
      bg: "#DC2626", // Merah Telkom
      textColor: "#FFFFFF",
      iconBg: "#FFFFFF",
      iconColor: "#DC2626",
      type: "telkom_torch",
      width: 165,
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
      iconBg: "#1E3A8A",
      iconColor: "#FDE047",
      type: "garuda_unair",
      width: 152,
    },
    {
      id: "ub",
      name: "UB Malang",
      short: "UB",
      bg: "#1E3A8A", // Biru Brawijaya
      textColor: "#FFFFFF",
      iconBg: "#F59E0B",
      iconColor: "#1E3A8A",
      type: "ub_raden",
      width: 130,
    },
    {
      id: "ipb",
      name: "IPB University",
      short: "IPB",
      bg: "#059669", // Hijau Daun IPB
      textColor: "#FFFFFF",
      iconBg: "#FFFFFF",
      iconColor: "#059669",
      type: "ipb_leaf",
      width: 145,
    },
    {
      id: "unpad",
      name: "UNPAD",
      short: "UNPAD",
      bg: "#2563EB", // Biru Padjadjaran
      textColor: "#FFFFFF",
      iconBg: "#FACC15",
      iconColor: "#1E3A8A",
      type: "unpad_crown",
      width: 115,
    },
  ],
];

// Accurate Vector Campus Crests
function CampusVectorIcon({ type, color, bg }) {
  return (
    <View style={[styles.campusIconBox, { backgroundColor: bg }]}>
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        {/* UI: Makara (Bunga Teratai & Pohon Kalpataru) */}
        {type === "makara" && (
          <G
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Circle cx="12" cy="7" r="3.5" fill={color} />
            <Path d="M5 20c0-3.87 3.13-7 7-7s7 3.13 7 7" />
            <Path d="M12 10v7M8 14h8" />
          </G>
        )}
        {/* ITB: Lambang Ganesha Segilima */}
        {type === "ganesha" && (
          <G
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="M12 2l8 5v10l-8 5-8-5V7l8-5z" />
            <Circle cx="12" cy="12" r="2.5" fill={color} />
            <Path d="M12 7v2.5M10 14.5l4-5" />
          </G>
        )}
        {/* UGM: Lambang Surya Surya Matahari Segilima */}
        {type === "surya" && (
          <G stroke={color} strokeWidth={2} strokeLinecap="round">
            <Circle cx="12" cy="12" r="3.5" fill={color} />
            <Path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2.2 2.2M16.8 16.8l2.2 2.2M5 19l2.2-2.2M16.8 7.2l2.2-2.2" />
          </G>
        )}
        {/* ITS: Lambang Ombak & Roda Gigi Segilima */}
        {type === "its_gear" && (
          <G
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Circle cx="12" cy="12" r="3" />
            <Path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2 2M17.5 17.5l2 2M4.5 19.5l2-2M17.5 6.5l2-2" />
          </G>
        )}
        {/* BINUS: Monogram Identitas B */}
        {type === "binus_b" && (
          <G fill={color}>
            <Path d="M6 3h7a4.5 4.5 0 0 1 3.8 6.9A4.5 4.5 0 0 1 14 19H6V3zm3.5 3v4h3.5a1.75 1.75 0 0 0 0-3.5H9.5zm0 6.5v4.5h4.2a2 2 0 0 0 0-4H9.5z" />
          </G>
        )}
        {/* TELKOM: Lambang Obor & Lidah Api Telkom */}
        {type === "telkom_torch" && (
          <G
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="M12 2c-3.5 4-6 7.5-6 11.5a6 6 0 1 0 12 0c0-4-2.5-7.5-6-11.5z" />
            <Circle cx="12" cy="14" r="2" fill={color} />
          </G>
        )}
        {/* UNAIR: Garuda Mukti */}
        {type === "garuda_unair" && (
          <G
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path
              d="M12 3l3 5 6 1-4.5 4 1.5 6-6-3.5L6 19l1.5-6L3 9l6-1z"
              fill={color}
              opacity={0.7}
            />
          </G>
        )}
        {/* UB: Raden Wijaya / Tugu Mahkota Brawijaya */}
        {type === "ub_raden" && (
          <G
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Circle cx="12" cy="12" r="7" />
            <Path d="M12 5v14M5 12h14" />
          </G>
        )}
        {/* IPB: Daun Tiga & Tunas Pertanian */}
        {type === "ipb_leaf" && (
          <G
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path
              d="M11 20A8 8 0 0 1 3 12C3 4 11 2 21 3c0 10-2 18-10 17z"
              fill={color}
              opacity={0.3}
            />
            <Path d="M3 21l8-8" />
          </G>
        )}
        {/* UNPAD: Mahkota Padjadjaran */}
        {type === "unpad_crown" && (
          <G
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path
              d="M3 6l3.5 10h11L21 6l-5.5 5L12 4l-3.5 7L3 6z"
              fill={color}
              opacity={0.4}
            />
          </G>
        )}
      </Svg>
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

          {/* 1. Hero Block: Human, Evidence-Backed Copywriting (Antislop Compliant) */}
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

          {/* 2. Structured, Angled University Pill Collage (Clean Staggered Stack) */}
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
                    <CampusVectorIcon
                      type={c.type}
                      color={c.iconColor}
                      bg={c.iconBg}
                    />
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
                    <CampusVectorIcon
                      type={c.type}
                      color={c.iconColor}
                      bg={c.iconBg}
                    />
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
                    <CampusVectorIcon
                      type={c.type}
                      color={c.iconColor}
                      bg={c.iconBg}
                    />
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

          {/* 3. Action Buttons (Exact PebbleButton Onboarding Design) */}
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
    paddingVertical: 6.5,
    borderRadius: 22,
    gap: 6.5,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  campusIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
