import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import {
  Award,
  CheckCircle2,
  RotateCcw,
  X,
  Sparkles,
} from "lucide-react-native";

const SUS_QUESTIONS = [
  {
    id: 1,
    text: "Saya merasa ingin sering menggunakan aplikasi Makarya untuk mencari atau mengelola proyek.",
  },
  {
    id: 2,
    text: "Saya merasa aplikasi Makarya terlalu rumit atau sulit dipahami.",
  },
  {
    id: 3,
    text: "Saya merasa aplikasi Makarya mudah dan praktis digunakan.",
  },
  {
    id: 4,
    text: "Saya merasa membutuhkan bantuan orang lain agar dapat menggunakan aplikasi ini.",
  },
  {
    id: 5,
    text: "Saya merasa berbagai fitur dalam aplikasi Makarya terintegrasi dengan baik.",
  },
  {
    id: 6,
    text: "Saya merasa banyak hal yang tidak konsisten atau membingungkan di aplikasi ini.",
  },
  {
    id: 7,
    text: "Saya yakin kebanyakan orang dapat mempelajari aplikasi ini dengan cepat.",
  },
  {
    id: 8,
    text: "Saya merasa alur penggunaan aplikasi Makarya terlalu membingungkan.",
  },
  {
    id: 9,
    text: "Saya merasa percaya diri saat menggunakan berbagai fitur di aplikasi ini.",
  },
  {
    id: 10,
    text: "Saya harus belajar banyak hal terlebih dahulu sebelum lancar menggunakan aplikasi ini.",
  },
];

const LIKERT_OPTIONS = [
  { val: 1, label: "Sangat Tidak Setuju" },
  { val: 2, label: "Tidak Setuju" },
  { val: 3, label: "Netral" },
  { val: 4, label: "Setuju" },
  { val: 5, label: "Sangat Setuju" },
];

export function SystemUsabilityScaleModal({
  visible,
  onClose,
  onSave,
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

  // Standard SUS Calculation Formula (John Brooke, 1986)
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
    let gradeLabel = "Perlu Perbaikan";
    let scoreColor = "#DC2626";
    let bgScoreColor = "#FEF2F2";

    if (finalScore >= 80.3) {
      grade = "A";
      gradeLabel = "Sangat Baik (Mudah Digunakan)";
      scoreColor = "#059669";
      bgScoreColor = "#ECFDF5";
    } else if (finalScore >= 68) {
      grade = "B";
      gradeLabel = "Baik (Di Atas Rata-rata)";
      scoreColor = "#0F172A";
      bgScoreColor = "#F8FAFC";
    } else if (finalScore >= 51) {
      grade = "C";
      gradeLabel = "Cukup (Bisa Digunakan)";
      scoreColor = "#D97706";
      bgScoreColor = "#FFFBEB";
    }

    return {
      finalScore: finalScore.toFixed(1),
      grade,
      gradeLabel,
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

  const windowHeight = Dimensions.get("window").height;
  const cardHeight = Math.min(680, windowHeight * 0.88);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { height: cardHeight }]}>
          {/* 1. Header */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.modalTitle}>
                Penilaian Kemudahan Aplikasi
              </Text>
              <Text style={styles.modalSubtitle}>
                Skala 1 (Sangat Tidak Setuju) s/d 5 (Sangat Setuju)
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* 2. Questions List (Scrollable) */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            bounces={false}
          >
            {SUS_QUESTIONS.map((q) => {
              const currentVal = answers[q.id];
              return (
                <View key={q.id} style={styles.questionCard}>
                  <View style={styles.questionHeader}>
                    <View style={styles.qNumberBadge}>
                      <Text style={styles.qNumberText}>{q.id}</Text>
                    </View>
                    <Text style={styles.questionText}>{q.text}</Text>
                  </View>

                  {/* Likert 1-5 Segmented Buttons */}
                  <View style={styles.likertContainer}>
                    <View style={styles.likertLabelsRow}>
                      <Text style={styles.likertGuideLabel}>1 = Sangat Tidak Setuju</Text>
                      <Text style={styles.likertGuideLabel}>5 = Sangat Setuju</Text>
                    </View>

                    <View style={styles.pillsContainer}>
                      {LIKERT_OPTIONS.map((opt) => {
                        const isSelected = currentVal === opt.val;
                        return (
                          <TouchableOpacity
                            key={opt.val}
                            onPress={() => handleSelect(q.id, opt.val)}
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
                              {opt.val}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </View>
              );
            })}

            {/* 3. Live Score Calculation Summary */}
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
                    Estimasi Skor SUS
                  </Text>
                </View>
                <Text
                  style={[
                    styles.resultScoreBig,
                    { color: result.scoreColor },
                  ]}
                >
                  {result.finalScore}{" "}
                  <Text style={styles.resultScoreMax}>/ 100</Text>
                </Text>
              </View>

              <View style={styles.resultDetailsRow}>
                <View style={styles.resultDetailCol}>
                  <Text style={styles.resultLabel}>Grade Kategori:</Text>
                  <Text style={[styles.resultValue, { color: result.scoreColor }]}>
                    Grade {result.grade}
                  </Text>
                </View>
                <View style={[styles.resultDetailCol, { flex: 1.5 }]}>
                  <Text style={styles.resultLabel}>Keterangan:</Text>
                  <Text style={styles.resultValueText}>
                    {result.gradeLabel}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ height: 16 }} />
          </ScrollView>

          {/* 4. Footer Actions (Apple Minimalist Solid Buttons) */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              onPress={handleReset}
              style={styles.resetBtn}
              activeOpacity={0.75}
            >
              <RotateCcw size={14} color="#64748B" />
              <Text style={styles.resetBtnText}>Atur Ulang</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              style={styles.saveBtn}
              activeOpacity={0.88}
            >
              <CheckCircle2 size={15} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.saveBtnText}>Simpan Penilaian</Text>
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
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
    display: "flex",
    flexDirection: "column",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: FONTS.headingBold || FONTS.bold,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalSubtitle: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyRegular || FONTS.regular,
    color: "#64748B",
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollBody: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
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
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
  },
  questionText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.bodyMedium || FONTS.medium,
    fontWeight: "500",
    color: "#0F172A",
    lineHeight: 19,
  },
  likertContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  likertLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  likertGuideLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "500",
  },
  pillsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  likertPill: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  likertPillActive: {
    backgroundColor: "#0F172A",
    borderColor: "#0F172A",
  },
  likertPillText: {
    fontSize: 14,
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
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  resultHeaderTitle: {
    fontSize: 12.5,
    fontWeight: "700",
  },
  resultScoreBig: {
    fontSize: 17,
    fontWeight: "800",
  },
  resultScoreMax: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
  },
  resultDetailsRow: {
    flexDirection: "row",
    gap: 16,
  },
  resultDetailCol: {
    gap: 2,
  },
  resultLabel: {
    fontSize: 10.5,
    color: "#64748B",
  },
  resultValue: {
    fontSize: 12,
    fontWeight: "700",
  },
  resultValueText: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "500",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  resetBtnText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#475569",
  },
  saveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#0F172A",
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
