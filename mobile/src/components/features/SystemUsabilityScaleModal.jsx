import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  onSave,
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

  useEffect(() => {
    if (visible) {
      AsyncStorage.getItem("makarya_sus_evaluation").then((saved) => {
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.answers) {
              setAnswers(parsed.answers);
            }
          } catch (e) {}
        }
      });
    }
  }, [visible]);

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
      scoreColor = "#0F172A";
      bgScoreColor = "#F8FAFC";
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

  const handleSave = async () => {
    try {
      const payload = {
        score: result.finalScore,
        grade: result.grade,
        gradeLabel: result.gradeLabel,
        acceptability: result.acceptability,
        date: new Date().toISOString(),
        answers,
      };
      await AsyncStorage.setItem(
        "makarya_sus_evaluation",
        JSON.stringify(payload)
      );
      onSave?.(payload);
    } catch (e) {}
    onClose();
  };

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
                <ClipboardCheck size={19} color="#0F172A" />
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
              <X size={17} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Simple Explanation Note */}
          <View style={styles.infoBanner}>
            <Info size={14} color="#475569" style={{ marginTop: 1 }} />
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

                {/* Likert 1-5 Apple Pill Segmented Buttons */}
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
                          activeOpacity={0.75}
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
                  borderColor: result.scoreColor + "30",
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

          {/* Footer Actions (Apple Style Buttons) */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              onPress={handleReset}
              style={styles.resetBtn}
              activeOpacity={0.75}
            >
              <RotateCcw size={13.5} color="#64748B" />
              <Text style={styles.resetBtnText}>Atur Ulang</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              style={styles.saveBtn}
              activeOpacity={0.88}
            >
              <CheckCircle2 size={14.5} color="#FFFFFF" strokeWidth={2.4} />
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
    backgroundColor: "rgba(15, 23, 42, 0.65)",
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
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    flex: 1,
  },
  headerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 11,
    fontFamily: FONTS.bodyRegular || FONTS.regular,
    color: "#475569",
    lineHeight: 16,
  },
  respondentBar: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  respondentText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular || FONTS.regular,
    color: "#64748B",
  },
  respondentBold: {
    fontFamily: FONTS.bodyBold || FONTS.bold,
    fontWeight: "700",
    color: "#0F172A",
  },
  scrollBody: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    marginBottom: 11,
  },
  qNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  qNumberText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#334155",
  },
  questionText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.bodyMedium || FONTS.medium,
    fontWeight: "500",
    color: "#0F172A",
    lineHeight: 18.5,
  },
  likertRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 8,
    borderRadius: 14,
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
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  likertPillActive: {
    backgroundColor: "#0F172A", // Apple Dark Solid Active
    borderColor: "#0F172A",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  likertPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  likertPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  resultCard: {
    borderRadius: 18,
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    paddingHorizontal: 18,
    paddingVertical: 10.5,
    borderRadius: 14,
    backgroundColor: "#0F172A", // Apple Dark Slate Pill Button
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  saveBtnText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
