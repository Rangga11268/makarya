import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { Button } from "../../components/ui/Button";
import { ArrowRight } from "lucide-react-native";
import { styles as s } from "./OnboardingScreen.styles";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    badge: "Platform Mahasiswa #1",
    title: "Hasilkan Uang Nyata\nSelagi Kuliah",
    subtitle:
      "Gabung ribuan mahasiswa yang sudah mengerjakan proyek UMKM nyata, bangun portofolio dan raih honor langsung dari laptop-mu.",
    image: require("../../../assets/onboarding_1.jpg"),
    bgColor: "#091424", // Deep Midnight Navy
    accentColor: "#4F46E5", // Brand Indigo
    badgeBg: "rgba(79, 70, 229, 0.22)",
    badgeBorder: "rgba(129, 140, 248, 0.4)",
    badgeText: "#A5B4FC",
  },
  {
    id: "2",
    badge: "Proteksi Pembayaran",
    title: "Honormu Aman,\n100% Terjamin",
    subtitle:
      "Dana proyek dikunci di rekening bersama escrow sebelum kerjaan dimulai. Selesai dan disetujui, langsung cair ke dompetmu.",
    image: require("../../../assets/onboarding_2.jpg"),
    bgColor: "#091424", // Deep Midnight Navy (Unified)
    accentColor: "#4F46E5", // Brand Indigo (Unified)
    badgeBg: "rgba(79, 70, 229, 0.22)",
    badgeBorder: "rgba(129, 140, 248, 0.4)",
    badgeText: "#A5B4FC",
  },
  {
    id: "3",
    badge: "Kolaborasi Real-Time",
    title: "Pantau Proyek\ndari Genggamanmu",
    subtitle:
      "Kirim proposal, lacak milestone, chat langsung dengan klien UMKM dalam satu platform terpadu.",
    image: require("../../../assets/onboarding_3.jpg"),
    bgColor: "#091424", // Deep Midnight Navy (Unified)
    accentColor: "#4F46E5", // Brand Indigo (Unified)
    badgeBg: "rgba(79, 70, 229, 0.22)",
    badgeBorder: "rgba(129, 140, 248, 0.4)",
    badgeText: "#A5B4FC",
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
    <View style={[s.container, { backgroundColor: slide.bgColor }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Swipeable Full-Screen Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={s.scrollView}
      >
        {slides.map((sl) => (
          <View
            key={sl.id}
            style={[s.slidePage, { backgroundColor: sl.bgColor }]}
          >
            {/* Background Illustration covering top 60% */}
            <Image
              source={sl.image}
              style={s.bgImage}
              resizeMode="cover"
            />

            {/* Smooth SVG Multi-stop Gradient Blend from Image into Solid Canvas */}
            <View style={s.gradientOverlay} pointerEvents="none">
              <Svg height="100%" width="100%">
                <Defs>
                  <LinearGradient id={`grad-${sl.id}`} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor={sl.bgColor} stopOpacity="0" />
                    <Stop offset="30%" stopColor={sl.bgColor} stopOpacity="0.25" />
                    <Stop offset="65%" stopColor={sl.bgColor} stopOpacity="0.8" />
                    <Stop offset="90%" stopColor={sl.bgColor} stopOpacity="1" />
                    <Stop offset="100%" stopColor={sl.bgColor} stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill={`url(#grad-${sl.id})`} />
              </Svg>
            </View>

            {/* Content Section - Flowing naturally over the blend */}
            <View style={s.contentArea}>
              <View
                style={[
                  s.slideBadge,
                  {
                    backgroundColor: sl.badgeBg,
                    borderColor: sl.badgeBorder,
                  },
                ]}
              >
                <Text style={[s.slideBadgeText, { color: sl.badgeText }]}>
                  {sl.badge}
                </Text>
              </View>

              <Text style={s.headline}>{sl.title}</Text>
              <Text style={s.sub}>{sl.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Top Skip Button */}
      {current < slides.length - 1 && (
        <TouchableOpacity
          style={s.topSkipBtn}
          activeOpacity={0.7}
          onPress={goSkip}
        >
          <Text style={s.topSkipText}>Lewati</Text>
        </TouchableOpacity>
      )}

      {/* Bottom Controls */}
      <View style={s.bottomBar}>
        <View style={s.dots}>
          {slides.map((sl, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => goToSlide(i)}
              style={[
                s.dot,
                i === current && [
                  s.dotActive,
                  { backgroundColor: slide.accentColor },
                ],
              ]}
            />
          ))}
        </View>

        <Button
          title={current === slides.length - 1 ? "Mulai Sekarang" : "Lanjut"}
          size="lg"
          iconRight={<ArrowRight size={18} color="#FFFFFF" />}
          onPress={goNext}
          style={[s.nextBtn, { backgroundColor: slide.accentColor }]}
        />
      </View>
    </View>
  );
}
