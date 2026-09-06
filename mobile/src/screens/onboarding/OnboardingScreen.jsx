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
  Wallet,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Zap,
  Star,
  Clock,
  BadgeCheck,
  Coins,
  Lock,
  Rocket,
  BarChart3,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

// ─── Slide 1: Earnings Dashboard ─────────────────────────────────────────────
function EarningsVisual() {
  return (
    <View style={vis.root}>
      <View style={[vis.card, vis.cardIndigo]}>
        <View style={vis.cardHeader}>
          <View style={vis.iconPill}>
            <Wallet size={13} color="#C7D2FE" />
            <Text style={vis.iconPillText}>Honor Bulan Ini</Text>
          </View>
          <View style={vis.trendBadge}>
            <TrendingUp size={11} color="#6EE7B7" />
            <Text style={vis.trendText}>+24%</Text>
          </View>
        </View>

        <Text style={vis.bigAmount}>Rp 2.400.000</Text>
        <Text style={vis.bigAmountSub}>dari 3 proyek aktif</Text>

        <View style={vis.barRow}>
          {[40, 65, 50, 80, 100, 75, 90].map((h, i) => (
            <View
              key={i}
              style={[
                vis.bar,
                {
                  height: h * 0.4 + 8,
                  opacity: i === 4 ? 1 : 0.3 + i * 0.1,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={vis.miniRow}>
        <View style={[vis.miniCard, vis.miniCardA]}>
          <Rocket size={16} color="#818CF8" />
          <Text style={vis.miniTitle}>3 Aktif</Text>
          <Text style={vis.miniSub}>Proyek berjalan</Text>
        </View>
        <View style={[vis.miniCard, vis.miniCardB]}>
          <Star size={16} color="#F59E0B" fill="#F59E0B" />
          <Text style={vis.miniTitle}>4.9 ★</Text>
          <Text style={vis.miniSub}>Rating klien</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Slide 2: Escrow Protection ───────────────────────────────────────────────
function EscrowVisual() {
  const steps = [
    { icon: Lock,         label: "Dana Dikunci Escrow",    done: true  },
    { icon: Zap,          label: "Pengerjaan Berlangsung",  done: true  },
    { icon: CheckCircle2, label: "Deliverable Disetujui",   done: true  },
    { icon: Coins,        label: "Honor Cair Otomatis",     done: false },
  ];

  return (
    <View style={vis.root}>
      <View style={[vis.card, vis.cardEmerald]}>
        <View style={vis.shieldCenter}>
          <View style={vis.shieldRing}>
            <ShieldCheck size={30} color="#6EE7B7" />
          </View>
          <Text style={vis.shieldTitle}>100% Rekening Bersama</Text>
          <Text style={vis.shieldSub}>
            Dana terproteksi — tidak bisa dicairkan sebelum hasil disetujui
          </Text>
        </View>

        <View style={vis.stepList}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <View key={i} style={vis.stepRow}>
                <View style={[vis.stepDot, step.done && vis.stepDotDone]}>
                  <Icon
                    size={11}
                    color={
                      step.done ? "#052E16" : "rgba(255,255,255,0.35)"
                    }
                  />
                </View>
                <Text
                  style={[
                    vis.stepLabel,
                    step.done && vis.stepLabelDone,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={vis.guaranteePill}>
        <BadgeCheck size={14} color={COLORS.success} />
        <Text style={vis.guaranteeText}>
          Garansi resmi kampus · Anti gagal bayar
        </Text>
      </View>
    </View>
  );
}

// ─── Slide 3: Live Collaboration ──────────────────────────────────────────────
function CollabVisual() {
  const milestones = [
    { label: "Brief & Desain Awal",  pct: 100, color: "#6EE7B7" },
    { label: "Revisi & Finalisasi",  pct: 70,  color: "#93C5FD" },
    { label: "Serah Terima Aset",    pct: 35,  color: "#C7D2FE" },
  ];

  return (
    <View style={vis.root}>
      <View style={[vis.card, vis.cardSky]}>
        <View style={vis.cardHeader}>
          <View style={vis.iconPill}>
            <BarChart3 size={13} color="#BAE6FD" />
            <Text style={vis.iconPillText}>Progress Proyek</Text>
          </View>
          <View
            style={[
              vis.trendBadge,
              { backgroundColor: "rgba(14,165,233,0.22)" },
            ]}
          >
            <Clock size={11} color="#7DD3FC" />
            <Text style={[vis.trendText, { color: "#7DD3FC" }]}>Real-time</Text>
          </View>
        </View>

        {milestones.map((m, i) => (
          <View key={i} style={vis.milestoneRow}>
            <Text style={vis.milestoneLabel}>{m.label}</Text>
            <View style={vis.progressTrack}>
              <View
                style={[
                  vis.progressFill,
                  { width: `${m.pct}%`, backgroundColor: m.color },
                ]}
              />
            </View>
            <Text style={vis.milestonePct}>{m.pct}%</Text>
          </View>
        ))}
      </View>

      <View style={vis.collabFooter}>
        <View style={vis.avatarStack}>
          {[
            ["D", "#4F46E5"],
            ["R", "#0EA5E9"],
            ["A", "#10B981"],
          ].map(([letter, bg], i) => (
            <View
              key={i}
              style={[
                vis.avatar,
                {
                  marginLeft: i === 0 ? 0 : -8,
                  backgroundColor: bg,
                },
              ]}
            >
              <Text style={vis.avatarLetter}>{letter}</Text>
            </View>
          ))}
        </View>
        <Text style={vis.collabMsg}>
          3 talenta aktif · Respon{" "}
          <Text style={{ color: COLORS.success }}>cepat</Text>
        </Text>
      </View>
    </View>
  );
}

// ─── Slide data ───────────────────────────────────────────────────────────────
const slides = [
  {
    id: "1",
    badge: "Platform Mahasiswa #1",
    title: "Hasilkan Uang Nyata\nSelagi Kuliah",
    subtitle:
      "Gabung ribuan mahasiswa yang sudah mengerjakan proyek UMKM nyata — bangun portofolio, raih honor, mulai dari laptop-mu.",
    visual: "earnings",
  },
  {
    id: "2",
    badge: "Proteksi Pembayaran",
    title: "Honormu Aman,\n100% Terjamin",
    subtitle:
      "Dana proyek dikunci di rekening bersama escrow sebelum kerjaan dimulai. Selesai & disetujui — langsung cair ke dompetmu.",
    visual: "escrow",
  },
  {
    id: "3",
    badge: "Kolaborasi Real-Time",
    title: "Pantau Proyek\ndari Genggamanmu",
    subtitle:
      "Kirim proposal, lacak milestone, chat langsung dengan klien UMKM — semua tersentralisasi dalam satu platform.",
    visual: "collab",
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export function OnboardingScreen({ navigation, onComplete }) {
  const [current, setCurrent] = useState(0);

  const goNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      onComplete ? onComplete() : navigation.navigate("Login");
    }
  };

  const goSkip = () => {
    onComplete ? onComplete() : navigation.navigate("Login");
  };

  const slide = slides[current];

  return (
    <View style={s.container}>
      {/* Top bar */}
      <View style={s.topBar}>
        <Image
          source={require("../../../assets/logo.webp")}
          style={s.logo}
          resizeMode="contain"
        />
        <View style={s.platformBadge}>
          <ShieldCheck size={11} color={COLORS.brandIndigo} />
          <Text style={s.platformBadgeText}>Terverifikasi Kampus</Text>
        </View>
      </View>

      {/* Visual area */}
      <View style={s.visualArea}>
        {slide.visual === "earnings" && <EarningsVisual />}
        {slide.visual === "escrow" && <EscrowVisual />}
        {slide.visual === "collab" && <CollabVisual />}
      </View>

      {/* Bottom sheet */}
      <View style={s.sheet}>
        <View style={s.slideBadge}>
          <Text style={s.slideBadgeText}>{slide.badge}</Text>
        </View>

        <View style={s.dots}>
          {slides.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setCurrent(i)}
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

// ─── Visual Styles ────────────────────────────────────────────────────────────
const vis = StyleSheet.create({
  root: {
    width: width * 0.82,
    gap: 10,
  },
  card: {
    borderRadius: 24,
    padding: 20,
  },
  cardIndigo:  { backgroundColor: "#1E1B4B" },
  cardEmerald: { backgroundColor: "#052E16" },
  cardSky:     { backgroundColor: "#0C1A2E" },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  iconPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
  },
  iconPillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(110,231,183,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
  },
  trendText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#6EE7B7",
  },

  // Earnings slide
  bigAmount: {
    fontFamily: FONTS.displayBold,
    fontSize: 30,
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  bigAmountSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
    marginBottom: 14,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 5,
    height: 48,
  },
  bar: {
    flex: 1,
    backgroundColor: "#818CF8",
    borderRadius: 4,
  },
  miniRow: {
    flexDirection: "row",
    gap: 10,
  },
  miniCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    gap: 4,
  },
  miniCardA: { backgroundColor: "#1E1B4B" },
  miniCardB: { backgroundColor: "#1C1917" },
  miniTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: 6,
  },
  miniSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
  },

  // Escrow slide
  shieldCenter: {
    alignItems: "center",
    marginBottom: 16,
  },
  shieldRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "rgba(110,231,183,0.15)",
    borderWidth: 1,
    borderColor: "rgba(110,231,183,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  shieldTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 17,
    color: "#FFFFFF",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  shieldSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 4,
    paddingHorizontal: 8,
  },
  stepList: { gap: 8 },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotDone: {
    backgroundColor: "#6EE7B7",
  },
  stepLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
  },
  stepLabelDone: {
    color: "rgba(255,255,255,0.9)",
  },
  guaranteePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.successBg,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  guaranteeText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.success,
  },

  // Collab slide
  milestoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  milestoneLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    width: 130,
  },
  progressTrack: {
    flex: 1,
    height: 5,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 99,
  },
  milestonePct: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    width: 30,
    textAlign: "right",
  },
  collabFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  avatarStack: {
    flexDirection: "row",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.bgSurface,
  },
  avatarLetter: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#FFFFFF",
  },
  collabMsg: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.textMuted,
    flex: 1,
  },
});

// ─── Screen Styles ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    justifyContent: "space-between",
  },
  topBar: {
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
  platformBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  platformBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.brandIndigo,
  },
  visualArea: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 10,
  },
  sheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    ...SHADOWS.lg,
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
    marginBottom: 12,
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
