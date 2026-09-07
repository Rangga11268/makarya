import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { Button } from "../../components/ui/Button";
import { ShieldCheck, ArrowRight } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    badge: "Platform Mahasiswa #1",
    title: "Hasilkan Uang Nyata\nSelagi Kuliah",
    subtitle:
      "Gabung ribuan mahasiswa yang sudah mengerjakan proyek UMKM nyata \u2014 bangun portofolio, raih honor, mulai dari laptop-mu.",
    image: require("../../../assets/onboarding_1.jpg"),
  },
  {
    id: "2",
    badge: "Proteksi Pembayaran",
    title: "Honormu Aman,\n100% Terjamin",
    subtitle:
      "Dana proyek dikunci di rekening bersama escrow sebelum kerjaan dimulai. Selesai & disetujui \u2014 langsung cair ke dompetmu.",
    image: require("../../../assets/onboarding_2.jpg"),
  },
  {
    id: "3",
    badge: "Kolaborasi Real-Time",
    title: "Pantau Proyek\ndari Genggamanmu",
    subtitle:
      "Kirim proposal, lacak milestone, chat langsung dengan klien UMKM \u2014 semua tersentralisasi dalam satu platform.",
    image: require("../../../assets/onboarding_3.jpg"),
  },
];

export function OnboardingScreen({ navigation, onComplete }) {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef(null);

  const goToSlide = (index) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setCurrent(index);
  };

  const goNext = () => {
    if (current < slides.length - 1) {
      goToSlide(current + 1);
    } else {
      onComplete ? onComplete() : navigation.navigate("Login");
    }
  };

  const goSkip = () => {
    onComplete ? onComplete() : navigation.navigate("Login");
  };

  const handleScroll = (e) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / width);
    if (page !== current) setCurrent(page);
  };

  const slide = slides[current];

  return (
    <View style={s.container}>
      {/* Full-bleed swipeable illustration area */}
      <View style={s.imageWrapper}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          style={s.scrollView}
        >
          {slides.map((sl, i) => (
            <View key={sl.id} style={s.slidePage}>
              <Image
                source={sl.image}
                style={s.illustration}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>

        {/* Dark scrim at top so logo & badge are readable */}
        <View style={s.topScrim} />

        {/* Top logo bar */}
        <View style={s.topBar}>
          <View style={s.logoPill}>
            <Image
              source={require("../../../assets/logo.webp")}
              style={s.logo}
              resizeMode="contain"
            />
          </View>
          <View style={s.platformBadge}>
            <ShieldCheck size={11} color={COLORS.brandIndigo} />
            <Text style={s.platformBadgeText}>Terverifikasi Kampus</Text>
          </View>
        </View>
      </View>

      {/* Bottom content sheet — content changes with current slide */}
      <View style={s.sheet}>
        <View style={s.slideBadge}>
          <Text style={s.slideBadgeText}>{slide.badge}</Text>
        </View>

        {/* Pagination dots — tappable */}
        <View style={s.dots}>
          {slides.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => goToSlide(i)}
              style={[s.dot, i === current && s.dotActive]}
            />
          ))}
        </View>

        <Text style={s.headline}>{slide.title}</Text>
        <Text style={s.sub}>{slide.subtitle}</Text>

        <View style={s.btnRow}>
          <Button
            title="Lewati"
            variant="secondary"
            size="md"
            onPress={goSkip}
            style={s.skipBtn}
          />
          <Button
            title={current === slides.length - 1 ? "Mulai Sekarang" : "Lanjut"}
            variant="brand"
            size="md"
            iconRight={<ArrowRight size={16} color="#FFFFFF" />}
            onPress={goNext}
            style={s.nextBtn}
          />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C1A2E",
  },
  imageWrapper: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  slidePage: {
    width,
    height: "100%",
  },
  illustration: {
    width: "100%",
    height: "100%",
  },
  topScrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: "rgba(0,0,0,0.38)",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 54,
  },
  logoPill: {
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  logo: {
    width: 110,
    height: 30,
  },
  platformBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(238,242,255,0.92)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  platformBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.brandIndigo,
  },
  sheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 44,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    ...SHADOWS.lg,
    marginTop: -36,
  },
  slideBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    marginBottom: 12,
  },
  slideBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.brandIndigo,
    letterSpacing: 0.3,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 14,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.borderDark,
  },
  dotActive: {
    width: 22,
    backgroundColor: COLORS.brandIndigo,
  },
  headline: {
    fontFamily: FONTS.displayBold,
    fontSize: 24,
    color: COLORS.textDark,
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 10,
  },
  sub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 22,
    marginBottom: 24,
  },
  btnRow: {
    flexDirection: "row",
    gap: 12,
  },
  skipBtn: { flex: 1 },
  nextBtn: { flex: 1.5 },
});
