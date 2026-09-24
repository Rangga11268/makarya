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
import { Button } from "../ui/Button";
import {
  GraduationCap,
  Award,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  X,
  HelpCircle,
} from "lucide-react-native";

const SUS_QUESTIONS = [
  {
    id: 1,
    text: "Saya merasa akan sering menggunakan aplikasi Makarya ini dalam berkolaborasi proyek.",
    type: "positive",
  },
  {
    id: 2,
    text: "Saya merasa aplikasi Makarya ini terlalu rumit untuk digunakan.",
    type: "negative",
  },
  {
    id: 3,
    text: "Saya merasa aplikasi Makarya ini mudah dan intuitif untuk digunakan.",
    type: "positive",
  },
  {
    id: 4,
    text: "Saya merasa membutuhkan bantuan teknis untuk dapat menggunakan aplikasi ini.",
    type: "negative",
  },
  {
    id: 5,
    text: "Saya merasa berbagai fitur pada aplikasi ini terintegrasi dengan sangat baik.",
    type: "positive",
  },
  {
    id: 6,
    text: "Saya merasa ada terlalu banyak ketidakkonsistenan pada sistem aplikasi ini.",
    type: "negative",
  },
  {
    id: 7,
    text: "Saya merasa sebagian besar orang akan dapat mempelajari aplikasi ini dengan sangat cepat.",
    type: "positive",
  },
  {
    id: 8,
    text: "Saya merasa aplikasi ini sangat membingungkan ketika digunakan.",
    type: "negative",
  },
  {
    id: 9,
    text: "Saya merasa sangat percaya diri saat bernavigasi dan menggunakan aplikasi ini.",
    type: "positive",
  },
  {
    id: 10,
    text: "Saya harus mempelajari banyak hal terlebih dahulu sebelum dapat menggunakan aplikasi ini secara mandiri.",
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
    let gradeLabel = "Perlu Perbaikan Mendalam";
    let acceptability = "Tidak Diterima (Not Acceptable)";
    let scoreColor = "#DC2626"; // red
    let bgScoreColor = "#FEF2F2";

    if (finalScore >= 80.3) {
      grade = "A";
      gradeLabel = "Sangat Memuaskan (Excellent)";
      acceptability = "Sangat Diterima (Acceptable)";
      scoreColor = "#059669";
      bgScoreColor = "#ECFDF5";
    } else if (finalScore >= 68) {
      grade = "B";
      gradeLabel = "Di Atas Rata-Rata Industri (Good)";
      acceptability = "Diterima (Acceptable)";
      scoreColor = "#2563EB";
      bgScoreColor = "#EFF6FF";
    } else if (finalScore >= 51) {
      grade = "C";
      gradeLabel = "Cukup / Rata-Rata (OK)";
      acceptability = "Marginal (Cukup Diterima)";
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
                <GraduationCap size={20} color={COLORS.brandIndigo} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>
                  Uji Usability Sistem (SUS)
                </Text>
                <Text style={styles.modalSubtitle}>
                  Standar Evaluasi Akademik Skripsi (John Brooke, 1986)
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

          {/* Respondent Tag */}
          <View style={styles.respondentBar}>
            <Text style={styles.respondentText}>
              Responden: <Text style={styles.respondentBold}>{currentUserName}</Text> ({currentUserRole})
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
                  <Text style={styles.likertGuideText}>Sangat Tidak Setuju (1)</Text>
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
                    Kalkulasi Skor SUS
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
                  <Text style={styles.resultLabel}>Grade Skala:</Text>
                  <Text style={[styles.resultValue, { color: result.scoreColor }]}>
                    Grade {result.grade}
                  </Text>
                </View>
                <View style={styles.resultDetailCol}>
                  <Text style={styles.resultLabel}>Kategori:</Text>
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
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={styles.saveBtn}
              activeOpacity={0.8}
            >
              <CheckCircle2 size={15} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Selesai & Simpan Skor</Text>
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
    borderRadius: 28,
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
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.brandIndigo + "15",
    borderWidth: 1,
    borderColor: COLORS.brandIndigo + "30",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  modalSubtitle: {
    fontSize: 10,
    fontFamily: FONTS.regular,
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
  respondentBar: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  respondentText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: "#475569",
  },
  respondentBold: {
    fontFamily: FONTS.bold,
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
    borderRadius: 18,
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
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: "#334155",
  },
  questionText: {
    flex: 1,
    fontSize: 11.5,
    fontFamily: FONTS.medium,
    color: "#1E293B",
    lineHeight: 16,
  },
  likertRow: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 8,
    alignItems: "center",
    gap: 6,
  },
  likertGuideText: {
    fontSize: 9.5,
    fontFamily: FONTS.regular,
    color: "#94A3B8",
  },
  pillsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  likertPill: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  likertPillActive: {
    backgroundColor: COLORS.brandIndigo,
    borderColor: COLORS.brandIndigo,
    shadowColor: COLORS.brandIndigo,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  likertPillText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: "#334155",
  },
  likertPillTextActive: {
    color: "#FFFFFF",
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    marginTop: 4,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
    paddingBottom: 8,
  },
  resultHeaderTitle: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  resultScoreBig: {
    fontSize: 22,
    fontFamily: FONTS.bold,
  },
  resultScoreMax: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: "#64748B",
  },
  resultDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  resultDetailCol: {
    gap: 2,
  },
  resultLabel: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    color: "#64748B",
  },
  resultValue: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  resultValueText: {
    fontSize: 11.5,
    fontFamily: FONTS.medium,
    color: "#1E293B",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    gap: 10,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    minHeight: 44,
    justifyContent: "center",
  },
  resetBtnText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: "#64748B",
  },
  saveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.brandIndigo,
    minHeight: 44,
    shadowColor: COLORS.brandIndigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 12.5,
    fontFamily: FONTS.bold,
    color: "#FFFFFF",
  },
});
