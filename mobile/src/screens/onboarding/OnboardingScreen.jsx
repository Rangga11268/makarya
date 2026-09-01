import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { Button } from "../../components/ui/Button";
import {
  ShieldCheck,
  Sparkles,
  Wallet,
  CheckCircle2,
  Compass,
  Lock,
  ArrowRight,
  Star,
  Layers,
  GraduationCap,
  TrendingUp,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

export function OnboardingScreen({ navigation, onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: "1",
      title: "Temukan Proyek Digital dengan Mudah",
      subtitle:
        "Jelajahi ratusan peluang proyek nyata dari UMKM terpercaya dan bangun portofolio profesionalmu sejak kuliah.",
      badge: "Marketplace Mahasiswa",
      visual: "earnings",
    },
    {
      id: "2",
      title: "Garansi 100% Rekening Bersama",
      subtitle:
        "Honor pengerjaan dijamin tersimpan aman di rekening escrow dan cair otomatis saat hasil deliverable disetujui.",
      badge: "Garansi Rekening Bersama",
      visual: "escrow",
    },
    {
      id: "3",
      title: "Kolaborasi Cepat & Terpercaya",
      subtitle:
        "Kirim proposal penawaran, pantau progres milestone pengerjaan secara real-time langsung dari genggamanmu.",
      badge: "Pelacakan Real-Time",
      visual: "collaboration",
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      if (onComplete) {
        onComplete();
      } else {
        navigation.navigate("Login");
      }
    }
  };

  const handleSkip = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigation.navigate("Login");
    }
  };

  const activeSlide = slides[currentSlide];

  return (
    <View style={styles.container}>
      {/* Top Header Logo */}
      <View style={styles.topLogoRow}>
        <Image
          source={require("../../../assets/logo.webp")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.topTag}>
          <GraduationCap size={12} color={COLORS.brandIndigo} />
          <Text style={styles.topTagText}>Terverifikasi UBSI</Text>
        </View>
      </View>

      {/* Hero Visual Presentation (High-Contrast Rich Cards) */}
      <View style={styles.visualContainer}>
        {/* Slide 1: Earnings Bento Card (Royal Indigo) */}
        {activeSlide.visual === "earnings" && (
          <View style={[styles.mockupFloatingCard, styles.mockupCardIndigo]}>
            <View style={styles.mockupInnerHeader}>
              <Text style={styles.mockupTagIndigo}>Saldo Honor Mahasiswa</Text>
              <Text style={styles.mockupDetailsIndigo}>Rincian</Text>
            </View>

            <Text style={styles.mockupAmount}>Rp 850.000</Text>
            <View style={styles.trendRow}>
              <TrendingUp size={13} color="#93C5FD" />
              <Text style={styles.mockupTrendIndigo}>+12% dari bulan lalu</Text>
            </View>

            <View style={styles.mockupMiniPillIndigo}>
              <Wallet size={13} color="#FFFFFF" />
              <Text style={styles.mockupMiniTextIndigo}>
                Target: Rp 1.000.000 / Bulan
              </Text>
            </View>

            <View style={styles.mockupDotsRow}>
              <View style={[styles.mockupDot, styles.mockupDotActive]} />
              <View style={styles.mockupDot} />
              <View style={styles.mockupDot} />
            </View>
          </View>
        )}

        {/* Slide 2: Escrow Protection Card (Deep Emerald Green) */}
        {activeSlide.visual === "escrow" && (
          <View style={[styles.mockupFloatingCard, styles.mockupCardEmerald]}>
            <View style={styles.mockupInnerHeader}>
              <View style={styles.escrowIconBadge}>
                <ShieldCheck size={16} color="#A7F3D0" />
              </View>
              <Text style={styles.mockupTagEmerald}>Proteksi Transaksi</Text>
            </View>

            <Text style={styles.mockupAmount}>100% Rekening Bersama</Text>
            <Text style={styles.mockupTrendEmerald}>
              Dana terkunci aman & anti-gagal bayar
            </Text>

            <View style={styles.mockupMiniPillEmerald}>
              <CheckCircle2 size={13} color="#6EE7B7" />
              <Text style={styles.mockupMiniTextEmerald}>
                Garansi Resmi Kampus & Escrow
              </Text>
            </View>

            <View style={styles.mockupDotsRow}>
              <View style={styles.mockupDot} />
              <View style={[styles.mockupDot, styles.mockupDotActive]} />
              <View style={styles.mockupDot} />
            </View>
          </View>
        )}

        {/* Slide 3: Live Milestone Collaboration Card (Midnight Sky) */}
        {activeSlide.visual === "collaboration" && (
          <View style={[styles.mockupFloatingCard, styles.mockupCardSky]}>
            <View style={styles.mockupInnerHeader}>
              <Compass size={16} color="#7DD3FC" />
              <Text style={styles.mockupTagSky}>Pelacakan Real-Time</Text>
            </View>

            <Text style={styles.mockupAmount}>Pengerjaan Cepat</Text>
            <Text style={styles.mockupTrendSky}>
              Review & serah terima proyek otomatis
            </Text>

            <View style={styles.mockupMiniPillSky}>
              <Star size={13} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.mockupMiniTextSky}>
                Rating 5.0 Kepuasan Klien UMKM
              </Text>
            </View>

            <View style={styles.mockupDotsRow}>
              <View style={styles.mockupDot} />
              <View style={styles.mockupDot} />
              <View style={[styles.mockupDot, styles.mockupDotActive]} />
            </View>
          </View>
        )}
      </View>

      {/* Bottom Content Sheet */}
      <View style={styles.bottomSheet}>
        {/* Slider Pagination Dots */}
        <View style={styles.paginationRow}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.pagerDot,
                index === currentSlide && styles.pagerDotActive,
              ]}
            />
          ))}
        </View>

        {/* Headline & Subheadline */}
        <Text style={styles.headline}>{activeSlide.title}</Text>
        <Text style={styles.subheadline}>{activeSlide.subtitle}</Text>

        {/* Action Buttons Row */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipBtnText}>Lewati</Text>
          </TouchableOpacity>

          <Button
            title={
              currentSlide === slides.length - 1 ? "Mulai Sekarang" : "Lanjut"
            }
            variant="brand"
            size="md"
            iconRight={<ArrowRight size={16} color="#FFFFFF" />}
            onPress={handleNext}
            style={styles.nextBtn}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    justifyContent: "space-between",
  },
  topLogoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 54,
  },
  logo: {
    width: 120,
    height: 34,
  },
  topTag: {
    fontFamily: FONTS.bodyRegular,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  topTagText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.brandIndigo,
  },
  visualContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  mockupFloatingCard: {
    width: width * 0.78,
    borderRadius: 24,
    padding: 22,
    ...SHADOWS.lg,
  },
  mockupCardIndigo: {
    backgroundColor: "#1E1B4B", // Deep Royal Indigo
  },
  mockupCardEmerald: {
    backgroundColor: "#064E3B", // Deep Emerald
  },
  mockupCardSky: {
    backgroundColor: "#0F172A", // Deep Midnight Slate
  },
  mockupInnerHeader: {
    fontFamily: FONTS.bodyRegular,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  mockupTagIndigo: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "600",
    color: "#C7D2FE",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  mockupDetailsIndigo: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    fontWeight: "500",
    color: "#93C5FD",
  },
  mockupTagEmerald: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "600",
    color: "#A7F3D0",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  mockupTagSky: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "600",
    color: "#BAE6FD",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  escrowIconBadge: {
    fontFamily: FONTS.bodyRegular,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(167, 243, 208, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  mockupAmount: {
    fontFamily: FONTS.displayBold,
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.3,
    marginVertical: 4,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  mockupTrendIndigo: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "400",
  },
  mockupTrendEmerald: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "400",
    marginBottom: 12,
  },
  mockupTrendSky: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "400",
    marginBottom: 12,
  },
  mockupMiniPillIndigo: {
    fontFamily: FONTS.bodyRegular,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  mockupMiniPillEmerald: {
    fontFamily: FONTS.bodyRegular,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  mockupMiniPillSky: {
    fontFamily: FONTS.bodyRegular,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  mockupMiniTextIndigo: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  mockupMiniTextEmerald: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  mockupMiniTextSky: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  mockupDotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
  },
  mockupDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  mockupDotActive: {
    width: 16,
    backgroundColor: "#FFFFFF",
  },
  bottomSheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    ...SHADOWS.lg,
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: 18,
  },
  pagerDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.borderDark,
  },
  pagerDotActive: {
    width: 22,
    backgroundColor: COLORS.brandIndigo,
  },
  headline: {
    fontFamily: FONTS.displayBold,
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    letterSpacing: -0.3,
    lineHeight: 30,
    marginBottom: 10,
  },
  subheadline: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    fontWeight: "400",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 26,
    paddingHorizontal: 12,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  skipBtn: {
    flex: 1,
    backgroundColor: COLORS.canvasSoft,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  skipBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  nextBtn: {
    flex: 1.5,
  },
});
