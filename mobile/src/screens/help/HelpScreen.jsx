import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { Header } from "../../components/ui/Header";
import { PebbleButton } from "../../components/ui/PebbleButton";
import { OrganicRibbonBackground } from "../../components/ui/OrganicRibbonBackground";
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import {
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  Lock,
  Wallet,
  BookOpen,
  Sparkles,
  ClipboardCheck,
  ArrowUpRight,
  Check,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SystemUsabilityScaleModal } from "../../components/features/SystemUsabilityScaleModal";

const FAQ_ITEMS = [
  {
    id: "escrow",
    category: "Keamanan Finansial",
    icon: ShieldCheck,
    iconColor: "#059669",
    iconBg: "#ECFDF5",
    question: "Bagaimana sistem Escrow melindungi honor mahasiswa?",
    answer:
      "Sebelum proyek dimulai, klien UMKM wajib menyetorkan 100% pagu anggaran ke Rekening Bersama (Escrow) Makarya. Dana dikunci secara legal dan dijamin aman. Klien tidak bisa membatalkan sepihak tanpa persetujuan Anda, dan dana otomatis dicairkan ke saldo dompet setelah deliverable disetujui.",
  },
  {
    id: "proposal",
    category: "Pelamaran Proyek",
    icon: FileCheck,
    iconColor: "#2563EB",
    iconBg: "#EFF6FF",
    question: "Bagaimana cara agar proposal penawaran diterima klien?",
    answer:
      "Tulis cover letter yang spesifik menjawab kebutuhan UMKM, sertakan tautan portofolio (Figma/GitHub/Website) yang relevan, serta tawarkan durasi kerja yang realistis. Mahasiswa dengan profil lengkap dan reputasi skor tinggi diprioritaskan algoritma.",
  },
  {
    id: "payout",
    category: "Pencairan Saldo",
    icon: Wallet,
    iconColor: "#D97706",
    iconBg: "#FFFBEB",
    question: "Berapa lama proses pencairan saldo dompet ke rekening bank?",
    answer:
      "Pencairan dana yang diajukan sebelum pukul 15.00 WIB akan diproses pada hari kerja yang sama (1-3 jam). Pastikan nama pemilik rekening bank Anda sesuai dengan nama profil akun Makarya untuk kelancaran verifikasi BI-FAST.",
  },
  {
    id: "revision",
    category: "Revisi & Sengketa",
    icon: AlertCircle,
    iconColor: "#DC2626",
    iconBg: "#FEF2F2",
    question:
      "Apa yang harus dilakukan jika klien meminta revisi di luar kesepakatan awal?",
    answer:
      "Revisi yang dilayani adalah revisi minor yang tercantum dalam brief proyek. Jika klien meminta fitur atau pekerjaan baru di luar kesepakatan, gunakan fitur 'Ajukan Penyesuaian Anggaran' atau laporkan ke tim mediasi Makarya via WhatsApp Dukungan.",
  },
  {
    id: "team",
    category: "Kolaborasi Tim",
    icon: BookOpen,
    iconColor: "#7C3AED",
    iconBg: "#F5F3FF",
    question: "Bagaimana cara kerja proyek beregu/multi-slot?",
    answer:
      "Proyek bertanda 'Tim' membuka beberapa peran spesifik (misal: UI/UX Designer dan Frontend Dev). Anda dapat melamar peran yang sesuai keahlian. Setiap anggota tim menerima porsi honor escrow masing-masing sesuai slot yang disetujui.",
  },
];

export function HelpScreen({ navigation }) {
  const [expandedId, setExpandedId] = useState("escrow");
  const [susModalOpen, setSusModalOpen] = useState(false);
  const [savedEval, setSavedEval] = useState(null);

  useEffect(() => {
    loadSavedEvaluation();
  }, []);

  const loadSavedEvaluation = async () => {
    try {
      const data = await AsyncStorage.getItem("makarya_sus_evaluation");
      if (data) {
        setSavedEval(JSON.parse(data));
      }
    } catch (e) {}
  };

  const toggleAccordion = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleOpenWhatsApp = async () => {
    const phone = "6281234567890";
    const text = encodeURIComponent(
      "Halo Tim Bantuan Makarya, saya butuh bantuan terkait penggunaan aplikasi freelance kampus.",
    );
    const url = `https://wa.me/${phone}?text=${text}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        handleOpenEmail();
      }
    } catch {
      handleOpenEmail();
    }
  };

  const handleOpenEmail = () => {
    Linking.openURL(
      "mailto:bantuan@makarya.id?subject=Permintaan%20Bantuan%20Pengguna%20Makarya",
    );
  };

  const canGoBack = navigation?.canGoBack && navigation.canGoBack();
  const { responsiveContainerStyle, isCompact, isLandscape } =
    useResponsiveLayout();

  return (
    <View style={styles.container}>
      <OrganicRibbonBackground height={320} />

      {/* 1. Header (Standar Desain Makarya Mobile) */}
      <Header
        category="PUSAT BANTUAN"
        title="Bantuan & Dukungan"
        subtitle="Panduan & Solusi Cepat"
        onBack={canGoBack ? () => navigation.goBack() : null}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isCompact && { paddingHorizontal: 12 },
          isLandscape && { paddingVertical: 10 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={responsiveContainerStyle}>
          {/* 2. Escrow Protection Trust Banner */}
          <View style={styles.glassBanner}>
            <View style={styles.bannerIconCircle}>
              <Lock size={20} color="#059669" strokeWidth={2.4} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>
                Garansi 100% Escrow Makarya
              </Text>
              <Text style={styles.bannerText}>
                Setiap transaksi proyek mahasiswa dilindungi rekening bersama
                resmi. Jangan pernah bertransaksi di luar aplikasi demi keamanan
                dana Anda.
              </Text>
            </View>
          </View>

          {/* 3. Direct Support Cards (WhatsApp & Email) */}
          <Text style={styles.sectionHeading}>Saluran Bantuan Langsung</Text>
          <View style={styles.contactRow}>
            <View style={styles.contactCard}>
              <View
                style={[
                  styles.contactIconCircle,
                  { backgroundColor: "#ECFDF5" },
                ]}
              >
                <MessageCircle size={20} color="#059669" />
              </View>
              <Text style={styles.contactTitle}>WhatsApp CS</Text>
              <Text style={styles.contactSubtitle}>
                Respon cepat (08.00 - 21.00)
              </Text>
              <PebbleButton
                variant="emerald"
                size="xs"
                label="Chat Sekarang"
                onPress={handleOpenWhatsApp}
                style={{ width: "100%", marginTop: 8 }}
              />
            </View>

            <View style={styles.contactCard}>
              <View
                style={[
                  styles.contactIconCircle,
                  { backgroundColor: "#EFF6FF" },
                ]}
              >
                <Mail size={20} color="#2563EB" />
              </View>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactSubtitle}>
                Untuk kendala teknis & akun
              </Text>
              <PebbleButton
                variant="sapphire"
                size="xs"
                label="Kirim Email"
                onPress={handleOpenEmail}
                style={{ width: "100%", marginTop: 8 }}
              />
            </View>
          </View>

          {/* 4. Frequently Asked Questions (FAQ) */}
          <View style={styles.faqSectionHeader}>
            <HelpCircle size={16} color={COLORS.brandIndigo} />
            <Text style={styles.sectionHeadingFaq}>
              Pertanyaan yang Sering Diajukan
            </Text>
          </View>

          {FAQ_ITEMS.map((item) => {
            const isExpanded = expandedId === item.id;
            const IconComp = item.icon;

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.faqCard, isExpanded && styles.faqCardExpanded]}
                onPress={() => toggleAccordion(item.id)}
                activeOpacity={0.88}
              >
                <View style={styles.faqHeaderRow}>
                  <View
                    style={[
                      styles.faqIconBox,
                      { backgroundColor: item.iconBg },
                    ]}
                  >
                    <IconComp
                      size={16}
                      color={item.iconColor}
                      strokeWidth={2.2}
                    />
                  </View>

                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={styles.faqCategoryLabel}>{item.category}</Text>
                    <Text style={styles.faqQuestionText}>{item.question}</Text>
                  </View>

                  {isExpanded ? (
                    <ChevronUp size={18} color={COLORS.brandIndigo} />
                  ) : (
                    <ChevronDown size={18} color={COLORS.textMuted} />
                  )}
                </View>

                {isExpanded && (
                  <View style={styles.faqAnswerContainer}>
                    <View style={styles.faqDivider} />
                    <Text style={styles.faqAnswerText}>{item.answer}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {/* 5. Usability Evaluation Card (Rich & Informative) */}
          <View style={styles.susCardBox}>
            {/* Header: Icon + Titles + Status Badge */}
            <View style={styles.susHeaderRow}>
              <View style={styles.susHeaderLeft}>
                <View style={styles.susIconCircle}>
                  <ClipboardCheck size={18} color="#0F172A" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.susCardTitle}>
                    Penilaian Kemudahan Aplikasi
                  </Text>
                  <Text style={styles.susCardSubtitle}>
                    Evaluasi Kenyamanan Pengguna (Standar SUS)
                  </Text>
                </View>
              </View>

              {savedEval ? (
                <View style={styles.savedBadgePill}>
                  <Check size={10} color="#059669" strokeWidth={3} />
                  <Text style={styles.savedBadgePillText}>Sudah Diisi</Text>
                </View>
              ) : (
                <View style={styles.pendingBadgePill}>
                  <Text style={styles.pendingBadgePillText}>~2 Menit</Text>
                </View>
              )}
            </View>

            {/* Description Text */}
            <Text style={styles.susCardText}>
              Bantu riset & evaluasi platform Makarya. Berikan tanggapan Anda mengenai seberapa mudah dan praktis aplikasi ini digunakan.
            </Text>

            {/* 3 Pillar Feature Chips */}
            <View style={styles.susPillarsRow}>
              <View style={styles.susPillarChip}>
                <Text style={styles.susPillarText}>🧭 Navigasi & Tampilan</Text>
              </View>
              <View style={styles.susPillarChip}>
                <Text style={styles.susPillarText}>⚡ Alur Kerja Proyek</Text>
              </View>
              <View style={styles.susPillarChip}>
                <Text style={styles.susPillarText}>🔒 Keamanan & Transaksi</Text>
              </View>
            </View>

            {/* Live Score Display Banner (If user already submitted) */}
            {savedEval && (
              <View style={styles.savedScoreBanner}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.savedScoreLabel}>Hasil Penilaian Terakhir Anda:</Text>
                  <Text style={styles.savedScoreValue}>
                    Skor {savedEval.score} / 100 • Grade {savedEval.grade} ({savedEval.gradeLabel})
                  </Text>
                </View>
                <View style={styles.savedCheckCircle}>
                  <CheckCircle2 size={16} color="#059669" />
                </View>
              </View>
            )}

            {/* Action Footer */}
            <View style={styles.susFooterRow}>
              <Text style={styles.susFooterMetaText}>
                10 Pertanyaan • Skala 1–5
              </Text>

              <TouchableOpacity
                style={styles.openSusBtn}
                onPress={() => setSusModalOpen(true)}
                activeOpacity={0.88}
              >
                <Text style={styles.openSusBtnText}>
                  {savedEval ? "Ubah Penilaian" : "Beri Penilaian"}
                </Text>
                <ArrowUpRight size={12} color="#FFFFFF" strokeWidth={2.4} />
              </TouchableOpacity>
            </View>
          </View>

          {/* 6. Footer Safe Note */}
          <View style={styles.footerNote}>
            <CheckCircle2 size={13} color="#059669" />
            <Text style={styles.footerNoteText}>
              Layanan pengaduan & bantuan Makarya beroperasi 7 hari seminggu.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* SUS Modal */}
      <SystemUsabilityScaleModal
        visible={susModalOpen}
        onClose={() => {
          setSusModalOpen(false);
          loadSavedEvaluation();
        }}
        onSave={(evalResult) => setSavedEval(evalResult)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 40,
  },
  glassBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.92)",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.9)"
        : "rgba(255, 255, 255, 0.95)",
    marginBottom: 16,
    gap: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    elevation: Platform.OS === "android" ? 0 : 2,
  },
  bannerIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13.5,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 2,
  },
  bannerText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  sectionHeading: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  contactRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  contactCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.92)",
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.9)"
        : "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    elevation: Platform.OS === "android" ? 0 : 2,
  },
  contactIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  contactTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  contactSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
    textAlign: "center",
  },
  faqSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
    marginTop: 4,
  },
  sectionHeadingFaq: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.2,
  },
  faqCard: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.92)",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.9)"
        : "rgba(255, 255, 255, 0.95)",
    marginBottom: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    elevation: Platform.OS === "android" ? 0 : 1,
  },
  faqCardExpanded: {
    borderColor: "rgba(37, 99, 235, 0.2)",
    shadowOpacity: 0.06,
  },
  faqHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  faqIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  faqCategoryLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9.5,
    color: COLORS.brandIndigo,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 1,
  },
  faqQuestionText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12.5,
    fontWeight: "700",
    color: COLORS.textDark,
    lineHeight: 17,
  },
  faqAnswerContainer: {
    marginTop: 10,
  },
  faqDivider: {
    height: 1,
    backgroundColor: "rgba(226, 232, 240, 0.7)",
    marginBottom: 10,
  },
  faqAnswerText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
    paddingVertical: 8,
  },
  footerNoteText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  susCardBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.85)",
    marginTop: 8,
    marginBottom: 6,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  susHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  susHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  susIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  susCardTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13.5,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  susCardSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10.5,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  savedBadgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    paddingHorizontal: 7.5,
    paddingVertical: 3,
    borderRadius: 6,
  },
  savedBadgePillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: "#059669",
    fontWeight: "700",
  },
  pendingBadgePill: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 7.5,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pendingBadgePillText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: "#64748B",
    fontWeight: "600",
  },
  susCardText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: COLORS.textSecondary,
    lineHeight: 16.5,
    marginBottom: 10,
  },
  susPillarsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  susPillarChip: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  susPillarText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10.5,
    color: "#475569",
    fontWeight: "500",
  },
  savedScoreBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 12,
  },
  savedScoreLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: "#166534",
    marginBottom: 1,
  },
  savedScoreValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#15803D",
  },
  savedCheckCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  susFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 232, 240, 0.7)",
  },
  susFooterMetaText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10.5,
    color: "#94A3B8",
  },
  openSusBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4.5,
    backgroundColor: "#0F172A",
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  openSusBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
