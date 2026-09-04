import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  G,
} from "react-native-svg";
import { FONTS } from "../../theme/fonts";
import { COLORS } from "../../theme/colors";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BANNER_WIDTH = SCREEN_WIDTH - 40;

const BANNER_DATA = [
  {
    id: "banner-1",
    tag: "100% GARANSI ESCROW",
    tagColor: "#818CF8",
    title: "Dana Aman Terjamin di Setiap Proyek",
    desc: "Honor tersimpan aman di escrow & cair langsung setelah deliverable disetujui.",
    cta: "Eksplor Proyek",
    gradStart: "#312E81",
    gradMid: "#3730A3",
    gradEnd: "#4F46E5",
    accentColor: "#A5B4FC",
    type: "shield",
  },
  {
    id: "banner-2",
    tag: "KAMPUS MERDEKA & UMKM",
    tagColor: "#34D399",
    title: "Kolaborasi Nyata Talenta Digital",
    desc: "Bantu UMKM lokal bertransformasi dengan solusi website, desain, & mobile app.",
    cta: "Temukan Klien",
    gradStart: "#064E3B",
    gradMid: "#065F46",
    gradEnd: "#059669",
    accentColor: "#6EE7B7",
    type: "sparkle",
  },
  {
    id: "banner-3",
    tag: "PORTFOLIO & CUAN CEPAT",
    tagColor: "#FBBF24",
    title: "Skill Kuliah Jadi Portofolio Nyata",
    desc: "Buktikan keahlianmu, kumpulkan ulasan bintang 5, dan bangun karier profesional.",
    cta: "Cari Lowongan",
    gradStart: "#78350F",
    gradMid: "#92400E",
    gradEnd: "#D97706",
    accentColor: "#FDE68A",
    type: "zap",
  },
];

function BannerGraphic({ type, accentColor }) {
  if (type === "shield") {
    return (
      <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
        <Circle cx="44" cy="38" r="32" fill="#FFFFFF" fillOpacity="0.06" />
        <Circle cx="44" cy="38" r="22" fill="#FFFFFF" fillOpacity="0.08" />
        {/* Shield */}
        <Path
          d="M44 20 L58 26 V40 C58 50 44 57 44 57 C44 57 30 50 30 40 V26 Z"
          fill="url(#shieldGrad)"
          stroke={accentColor}
          strokeWidth="2"
        />
        {/* Checkmark */}
        <Path
          d="M38 39 L42 43 L50 33"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Defs>
          <LinearGradient id="shieldGrad" x1="30" y1="20" x2="58" y2="57">
            <Stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
          </LinearGradient>
        </Defs>
      </Svg>
    );
  }

  if (type === "sparkle") {
    return (
      <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
        <Circle cx="44" cy="38" r="32" fill="#FFFFFF" fillOpacity="0.06" />
        {/* Diamond Star 1 */}
        <Path
          d="M44 18 L47 31 L60 34 L47 37 L44 50 L41 37 L28 34 L41 31 Z"
          fill={accentColor}
          fillOpacity="0.75"
        />
        {/* Diamond Star 2 */}
        <Path
          d="M58 46 L60 52 L66 54 L60 56 L58 62 L56 56 L50 54 L56 52 Z"
          fill="#FFFFFF"
          fillOpacity="0.9"
        />
        <Circle cx="30" cy="24" r="2" fill="#FFFFFF" fillOpacity="0.6" />
      </Svg>
    );
  }

  // zap
  return (
    <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
      <Circle cx="44" cy="38" r="32" fill="#FFFFFF" fillOpacity="0.06" />
      {/* Lightning Bolt */}
      <Path
        d="M47 18 L32 40 H45 L41 58 L58 34 H44 Z"
        fill={accentColor}
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PromoBanner({ onBannerPress }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % BANNER_DATA.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / BANNER_WIDTH);
    if (index !== activeIndex && index >= 0 && index < BANNER_DATA.length) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={BANNER_DATA}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={BANNER_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.bannerCard, { width: BANNER_WIDTH }]}
            activeOpacity={0.92}
            onPress={() => onBannerPress?.(item)}
          >
            {/* SVG Background Gradient & Patterns */}
            <View style={StyleSheet.absoluteFill}>
              <Svg width="100%" height="100%">
                <Defs>
                  <LinearGradient id={`grad-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={item.gradStart} />
                    <Stop offset="55%" stopColor={item.gradMid} />
                    <Stop offset="100%" stopColor={item.gradEnd} />
                  </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" rx={20} fill={`url(#grad-${item.id})`} />
                {/* Micro mesh circles */}
                <Circle cx={BANNER_WIDTH - 20} cy={10} r={65} fill="#FFFFFF" fillOpacity="0.05" />
                <Circle cx={BANNER_WIDTH - 50} cy={80} r={40} fill="#FFFFFF" fillOpacity="0.04" />
              </Svg>
            </View>

            {/* Card Content Row */}
            <View style={styles.cardInner}>
              <View style={styles.textContent}>
                {/* Pill Tag */}
                <View style={[styles.tagPill, { borderColor: item.tagColor + "40" }]}>
                  <Sparkles size={10} color={item.tagColor} />
                  <Text style={[styles.tagText, { color: item.tagColor }]}>
                    {item.tag}
                  </Text>
                </View>

                {/* Title */}
                <Text style={styles.titleText} numberOfLines={2}>
                  {item.title}
                </Text>

                {/* Subtitle */}
                <Text style={styles.descText} numberOfLines={2}>
                  {item.desc}
                </Text>

                {/* Micro CTA Button */}
                <View style={styles.ctaButton}>
                  <Text style={styles.ctaText}>{item.cta}</Text>
                  <ArrowRight size={11} color="#FFFFFF" strokeWidth={2.5} />
                </View>
              </View>

              {/* Right Decorative Graphic */}
              <View style={styles.graphicBox}>
                <BannerGraphic type={item.type} accentColor={item.accentColor} />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Pagination Dots */}
      <View style={styles.paginationRow}>
        {BANNER_DATA.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              idx === activeIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
  },
  bannerCard: {
    height: 148,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#1E1B4B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  },
  cardInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  textContent: {
    flex: 1,
    paddingRight: 6,
    justifyContent: "center",
  },
  tagPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    marginBottom: 6,
  },
  tagText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  titleText: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 18,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  descText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 14,
    marginBottom: 8,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  ctaText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  graphicBox: {
    width: 76,
    alignItems: "center",
    justifyContent: "center",
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 16,
    backgroundColor: COLORS.brandIndigo,
  },
  dotInactive: {
    width: 5,
    backgroundColor: "#CBD5E1",
  },
});
