import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import {
  ClipboardCheck,
  CheckCircle2,
  ArrowUpRight,
  Check,
} from "lucide-react-native";
import { SystemUsabilityScaleModal } from "./SystemUsabilityScaleModal";

export function UsabilityEvaluationCard({ style }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [savedEval, setSavedEval] = useState(null);

  useEffect(() => {
    loadEvaluation();
  }, []);

  const loadEvaluation = async () => {
    try {
      const data = await AsyncStorage.getItem("makarya_sus_evaluation");
      if (data) {
        setSavedEval(JSON.parse(data));
      }
    } catch (e) {}
  };

  return (
    <View style={[styles.cardBox, style]}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCircle}>
            <ClipboardCheck size={18} color="#0F172A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>
              Penilaian Kemudahan Aplikasi
            </Text>
            <Text style={styles.cardSubtitle}>
              Kuesioner Evaluasi Usability (Standar SUS)
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

      {/* Description */}
      <Text style={styles.cardText}>
        Bantu riset & evaluasi platform Makarya. Berikan tanggapan objektif Anda mengenai kemudahan navigasi dan pengalaman penggunaan aplikasi.
      </Text>

      {/* Saved Score Banner (If Already Evaluated) */}
      {savedEval && (
        <View style={styles.savedScoreBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.savedScoreLabel}>Hasil Penilaian Anda:</Text>
            <Text style={styles.savedScoreValue}>
              Skor {savedEval.score} / 100 • Grade {savedEval.grade} ({savedEval.gradeLabel})
            </Text>
          </View>
          <CheckCircle2 size={16} color="#059669" />
        </View>
      )}

      {/* Footer Row */}
      <View style={styles.footerRow}>
        <Text style={styles.footerMetaText}>
          10 Pertanyaan • Skala 1–5
        </Text>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setModalOpen(true)}
          activeOpacity={0.88}
        >
          <Text style={styles.actionBtnText}>
            {savedEval ? "Ubah Penilaian" : "Beri Penilaian"}
          </Text>
          <ArrowUpRight size={12} color="#FFFFFF" strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      {/* Evaluation Modal */}
      <SystemUsabilityScaleModal
        visible={modalOpen}
        onClose={() => {
          setModalOpen(false);
          loadEvaluation();
        }}
        onSave={(res) => setSavedEval(res)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    marginVertical: 4,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 13.5,
    fontFamily: FONTS.headingBold || FONTS.bold,
    fontWeight: "700",
    color: "#0F172A",
  },
  cardSubtitle: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular || FONTS.regular,
    color: "#64748B",
    marginTop: 1,
  },
  savedBadgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  savedBadgePillText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#059669",
  },
  pendingBadgePill: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pendingBadgePillText: {
    fontSize: 10.5,
    fontWeight: "600",
    color: "#64748B",
  },
  cardText: {
    fontSize: 12,
    fontFamily: FONTS.bodyRegular || FONTS.regular,
    color: "#475569",
    lineHeight: 18,
    marginBottom: 12,
  },
  savedScoreBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  savedScoreLabel: {
    fontSize: 10.5,
    color: "#64748B",
    marginBottom: 2,
  },
  savedScoreValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  footerMetaText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular || FONTS.regular,
    color: "#94A3B8",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0F172A",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
