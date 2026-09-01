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
      badge: "Escrow Holding Protected",
      visual: "escrow",
    },
    {
      id: "3",
      title: "Kolaborasi Cepat & Terpercaya",
      subtitle:
        "Kirim proposal penawaran, pantau progres milestone pengerjaan secara real-time langsung dari genggamanmu.",
      badge: "Real-time Tracker",
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
          <Text style={styles.topTagText}>UBSI Verified</Text>
        </View>
      </View>

      {/* Hero Visual Presentation (Matching Reference Mockup Phone 1) */}
      <View style={styles.visualContainer}>
        {activeSlide.visual === "earnings" && (
          <View style={styles.mockupFloatingCard}>
            <View style={styles.mockupInnerHeader}>
              <Text style={styles.mockupEarningsTitle}>Saldo Honor</Text>
              <Text style={styles.mockupDetails}>Rincian</Text>
            </View>

            <Text style={styles.mockupAmount}>Rp 850.000</Text>
            <Text style={styles.mockupTrend}>+12% dari bulan lalu</Text>

            <View style={styles.mockupMiniPill}>
              <Wallet size={12} color="#FFFFFF" />
              <Text style={styles.mockupMiniText}>Target: Rp 1.000.000</Text>
            </View>

            <View style={styles.mockupDotsRow}>
              <View style={[styles.mockupDot, styles.mockupDotActive]} />
              <View style={styles.mockupDot} />
              <View style={styles.mockupDot} />
            </View>
          </View>
        )}

        {activeSlide.visual === "escrow" && (
          <View style={[styles.mockupFloatingCard, styles.mockupCardEmerald]}>
            <View style={styles.mockupInnerHeader}>
              <View style={styles.escrowIconBadge}>
                <ShieldCheck size={18} color="#065F46" />
              </View>
              <Text style={styles.escrowStatusTitle}>Rekening Bersama Aktif</Text>
            </View>

            <Text style={styles.mockupAmount}>100% Proteksi</Text>
            <Text style={styles.mockupTrend}>
              Dana aman & anti gagal bayar
            </Text>

            <View style={[styles.mockupMiniPill, styles.mockupMiniPillEmerald]}>
              <CheckCircle2 size={12} color="#065F46" />
              <Text style={styles.mockupMiniTextEmerald}>
                Terverifikasi Lembaga Kampus
              </Text>
            </View>
          </View>
        )}

        {activeSlide.visual === "collaboration" && (
          <View style={[styles.mockupFloatingCard, styles.mockupCardSky]}>
            <View style={styles.mockupInnerHeader}>
              <Compass size={18} color="#0369A1" />
              <Text style={styles.mockupDetailsSky}>Live Milestone</Text>
            </View>

            <Text style={styles.mockupAmount}>Pengerjaan Cepat</Text>
            <Text style={styles.mockupTrend}>
              Review & serah terima otomatis
            </Text>

            <View style={[styles.mockupMiniPill, styles.mockupMiniPillSky]}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.mockupMiniTextSky}>
                Rating 5.0 Kepuasan Klien
              </Text>
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
            title={currentSlide === slides.length - 1 ? "Mulai Sekarang" : "Lanjut"}
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
    width: 140,
    height: 42,
  },
  topTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  topTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.brandIndigo,
  },
  visualContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  mockupFloatingCard: {
    width: width * 0.76,
    backgroundColor: "#2563EB", // Royal Blue
    borderRadius: 24,
    padding: 20,
    ...SHADOWS.lg,
  },
  mockupCardEmerald: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  mockupCardSky: {
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  mockupInnerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mockupEarningsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.8)",
  },
  mockupDetails: {
    fontSize: 11,
    fontWeight: "700",
    color: "#93C5FD",
  },
  mockupDetailsSky: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0284C7",
  },
  escrowIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
  },
  escrowStatusTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#065F46",
  },
  mockupAmount: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 10,
    letterSpacing: -0.5,
  },
  mockupTrend: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
    marginBottom: 14,
  },
  mockupMiniPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  mockupMiniPillEmerald: {
    backgroundColor: "#D1FAE5",
  },
  mockupMiniPillSky: {
    backgroundColor: "#E0F2FE",
  },
  mockupMiniText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  mockupMiniTextEmerald: {
    fontSize: 11,
    fontWeight: "800",
    color: "#065F46",
  },
  mockupMiniTextSky: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0369A1",
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
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.textDark,
    textAlign: "center",
    letterSpacing: -0.6,
    lineHeight: 32,
    marginBottom: 10,
  },
  subheadline: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 26,
    paddingHorizontal: 10,
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
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textSecondary,
  },
  nextBtn: {
    flex: 1.5,
  },
});
