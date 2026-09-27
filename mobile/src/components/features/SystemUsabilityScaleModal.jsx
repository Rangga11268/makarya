import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import {
  ClipboardCheck,
  Award,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  X,
  Info,
} from "lucide-react-native";

const SUS_QUESTIONS = [
  {
    id: 1,
    text: "Saya merasa ingin sering menggunakan aplikasi Makarya ini untuk mencari atau mengelola proyek.",
    type: "positive",
  },
  {
    id: 2,
    text: "Saya merasa aplikasi Makarya ini terlalu rumit atau sulit dipahami.",
    type: "negative",
  },
  {
    id: 3,
    text: "Saya merasa aplikasi Makarya ini mudah dan praktis digunakan.",
    type: "positive",
  },
  {
    id: 4,
    text: "Saya merasa membutuhkan panduan atau bantuan orang lain untuk bisa menggunakan aplikasi ini.",
    type: "negative",
  },
  {
    id: 5,
    text: "Saya merasa fitur-fitur di dalam aplikasi ini tersusun dan bekerja sama dengan sangat baik.",
    type: "positive",
  },
  {
    id: 6,
    text: "Saya merasa ada hal-hal yang tidak konsisten atau membingungkan di aplikasi ini.",
    type: "negative",
  },
  {
    id: 7,
    text: "Saya yakin kebanyakan orang akan bisa mempelajari aplikasi ini dengan cepat.",
    type: "positive",
  },
  {
    id: 8,
    text: "Saya merasa alur penggunaan aplikasi ini membingungkan.",
    type: "negative",
  },
  {
    id: 9,
    text: "Saya merasa percaya diri dan nyaman saat bernavigasi di aplikasi ini.",
    type: "positive",
  },
  {
    id: 10,
    text: "Saya harus banyak belajar terlebih dahulu sebelum bisa lancar menggunakan aplikasi ini.",
    type: "negative",
  },
];

export function SystemUsabilityScaleModal({
  visible,
  onClose,
  currentUserRole = "Pengguna",
  currentUserName = "Responden Pengujian",
}) {
  const [answers, setAnswers] = useState({
    1: 4,
    2: 2,
    3: 5,
    4: 1,
    5: 5,
    6: 1,
    7: 5,
    8: 1,
    9: 5,
    10: 1,
  });

  const handleSelect = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleReset = () => {
    setAnswers({
      1: 3,
      2: 3,
      3: 3,
      4: 3,
      5: 3,
      6: 3,
      7: 3,
      8: 3,
      9: 3,
      10: 3,
    });
  };

  // SUS Calculation (John Brooke, 1986 Formula)
  const calculateSUS = () => {
    let oddSum = 0;
    let evenSum = 0;

    for (let i = 1; i <= 10; i++) {
      const val = answers[i] || 3;
      if (i % 2 === 1) {
        oddSum += val - 1;
      } else {
        evenSum += 5 - val;
      }
    }

    const finalScore = Math.min(100, Math.max(0, (oddSum + evenSum) * 2.5));

    let grade = "F";
    let gradeLabel = "Perlu Banyak Perbaikan";
    let acceptability = "Belum Memuaskan";
    let scoreColor = "#DC2626"; // red
    let bgScoreColor = "#FEF2F2";

    if (finalScore >= 80.3) {
      grade = "A";
      gradeLabel = "Sangat Baik (Mudah Digunakan)";
      acceptability = "Sangat Memuaskan";
      scoreColor = "#059669";
      bgScoreColor = "#ECFDF5";
    } else if (finalScore >= 68) {
      grade = "B";
      gradeLabel = "Baik (Di Atas Rata-rata)";
      acceptability = "Layak & Nyaman";
      scoreColor = "#2563EB";
      bgScoreColor = "#EFF6FF";
    } else if (finalScore >= 51) {
      grade = "C";
      gradeLabel = "Cukup (Bisa Digunakan)";
      acceptability = "Cukup Baik";
      scoreColor = "#D97706";
      bgScoreColor = "#FFFBEB";
    }

    return {
      finalScore: finalScore.toFixed(1),
      grade,
      gradeLabel,
      acceptability,
      scoreColor,
      bgScoreColor,
    };
  };

  const result = calculateSUS();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconBox}>
                <ClipboardCheck size={20} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>
                  Penilaian Kemudahan Aplikasi
                </Text>
                <Text style={styles.modalSubtitle}>
                  Kuesioner 10 pertanyaan singkat (Standar SUS)
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Simple Explanation Note */}
          <View style={styles.infoBanner}>
            <Info size={14} color="#0369A1" style={{ marginTop: 1 }} />
            <Text style={styles.infoBannerText}>
              Bantu evaluasi aplikasi Makarya. Pilih nilai dari angka <Text style={{ fontWeight: "700" }}>1 (Sangat Tidak Setuju)</Text> hingga <Text style={{ fontWeight: "700" }}>5 (Sangat Setuju)</Text>.
            </Text>
          </View>

          {/* Respondent Tag */}
          <View style={styles.respondentBar}>
            <Text style={styles.respondentText}>
              Pengisi: <Text style={styles.respondentBold}>{currentUserName}</Text> ({currentUserRole})
            </Text>
          </View>

          {/* Question List */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {SUS_QUESTIONS.map((q) => (
              <View key={q.id} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <View style={styles.qNumberBadge}>
                    <Text style={styles.qNumberText}>{q.id}</Text>
                  </View>
                  <Text style={styles.questionText}>{q.text}</Text>
                </View>

                {/* Likert 1-5 Pills */}
                <View style={styles.likertRow}>
                  <Text style={styles.likertGuideText}>Tidak Setuju (1)</Text>
                  <View style={styles.pillsContainer}>
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isSelected = answers[q.id] === val;
                      return (
                        <TouchableOpacity
                          key={val}
                          onPress={() => handleSelect(q.id, val)}
                          style={[
                            styles.likertPill,
                            isSelected && styles.likertPillActive,
                          ]}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.likertPillText,
                              isSelected && styles.likertPillTextActive,
                            ]}
                          >
                            {val}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <Text style={styles.likertGuideText}>Sangat Setuju (5)</Text>
                </View>
              </View>
            ))}

            {/* Live Score Summary Result Box */}
            <View
              style={[
                styles.resultCard,
                {
                  backgroundColor: result.bgScoreColor,
                  borderColor: result.scoreColor + "40",
                },
              ]}
            >
              <View style={styles.resultHeader}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Award size={18} color={result.scoreColor} />
                  <Text
                    style={[
                      styles.resultHeaderTitle,
                      { color: result.scoreColor },
                    ]}
                  >
                    Hasil Skor Penilaian
                  </Text>
                </View>
                <Text
                  style={[
                    styles.resultScoreBig,
                    { color: result.scoreColor },
                  ]}
                >
                  {result.finalScore} <Text style={styles.resultScoreMax}>/ 100</Text>
                </Text>
              </View>

              <View style={styles.resultDetailsRow}>
                <View style={styles.resultDetailCol}>
                  <Text style={styles.resultLabel}>Peringkat:</Text>
                  <Text style={[styles.resultValue, { color: result.scoreColor }]}>
                    Grade {result.grade}
                  </Text>
                </View>
                <View style={styles.resultDetailCol}>
                  <Text style={styles.resultLabel}>Keterangan:</Text>
                  <Text style={styles.resultValueText}>
                    {result.gradeLabel}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              onPress={handleReset}
              style={styles.resetBtn}
              activeOpacity={0.7}
            >
              <RotateCcw size={14} color="#64748B" />
              <Text style={styles.resetBtnText}>Atur Ulang</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={styles.saveBtn}
              activeOpacity={0.8}
            >
              <CheckCircle2 size={15} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Selesai & Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  headerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 15,
    fontFamily: FONTS.headingBold || FONTS.bold,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalSubtitle: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular || FONTS.regular,
    color: "#64748B",
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#F0F9FF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0F2FE",
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 11,
    fontFamily: FONTS.bodyRegular || FONTS.regular,
    color: "#0369A1",
    lineHeight: 16,
  },
  respondentBar: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  respondentText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular || FONTS.regular,
    color: "#475569",
  },
  respondentBold: {
    fontFamily: FONTS.bodyBold || FONTS.bold,
    fontWeight: "700",
    color: "#0F172A",
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  questionCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 12,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 10,
  },
  qNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  qNumberText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#475569",
  },
  questionText: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: FONTS.bodyMedium || FONTS.medium,
    color: "#1E293B",
    lineHeight: 18,
  },
  likertRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  likertGuideText: {
    fontSize: 9.5,
    color: "#94A3B8",
    fontWeight: "500",
  },
  pillsContainer: {
    flexDirection: "row",
    gap: 6,
  },
  likertPill: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  likertPillActive: {
    backgroundColor: "#2563EB",
    borderColor: "#1D4ED8",
  },
  likertPillText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#475569",
  },
  likertPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  resultCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginTop: 4,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  resultHeaderTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  resultScoreBig: {
    fontSize: 18,
    fontWeight: "800",
  },
  resultScoreMax: {
    fontSize: 11,
    fontWeight: "400",
    color: "#64748B",
  },
  resultDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resultDetailCol: {
    gap: 2,
  },
  resultLabel: {
    fontSize: 10.5,
    color: "#64748B",
  },
  resultValue: {
    fontSize: 12.5,
    fontWeight: "700",
  },
  resultValueText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "#2563EB",
  },
  saveBtnText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
