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
  Award,
} from "lucide-react-native";
import { SystemUsabilityScaleModal } from "./SystemUsabilityScaleModal";

export function UsabilityEvaluationCard({ style, userName, userRole }) {
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
      {/* 1. Header Row */}
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

      {/* 2. Description */}
      <Text style={styles.cardText}>
        Bantu riset & evaluasi platform Makarya. Berikan penilaian objektif Anda mengenai seberapa mudah dan nyaman aplikasi ini digunakan.
      </Text>

      {/* 3. 3 Pillar Chips */}
      <View style={styles.pillarsRow}>
        <View style={styles.pillarChip}>
          <Text style={styles.pillarText}>🧭 Navigasi & Tampilan</Text>
        </View>
        <View style={styles.pillarChip}>
          <Text style={styles.pillarText}>⚡ Alur Kerja Proyek</Text>
        </View>
        <View style={styles.pillarChip}>
          <Text style={styles.pillarText}>🔒 Keamanan Transaksi</Text>
        </View>
      </View>

      {/* 4. Live Saved Score Banner */}
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

      {/* 5. Footer Row with Apple Button */}
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

      {/* Modal */}
      <SystemUsabilityScaleModal
        visible={modalOpen}
        onClose={() => {
          setModalOpen(false);
          loadEvaluation();
        }}
        onSave={(res) => setSavedEval(res)}
        currentUserName={userName || "Pengguna"}
        currentUserRole={userRole || "Pengguna"}
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
    borderColor: "rgba(226, 232, 240, 0.85)",
    marginVertical: 8,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: Platform.OS === "android" ? 1 : 2,
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
    marginRight: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontFamily: FONTS.displayBold || FONTS.headingBold || FONTS.bold,
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  cardSubtitle: {
    fontFamily: FONTS.bodyRegular || FONTS.regular,
    fontSize: 10.5,
    color: "#64748B",
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
    fontFamily: FONTS.bodyBold || FONTS.bold,
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
    fontFamily: FONTS.bodyMedium || FONTS.medium,
    fontSize: 10,
    color: "#64748B",
    fontWeight: "600",
  },
  cardText: {
    fontFamily: FONTS.bodyRegular || FONTS.regular,
    fontSize: 11.5,
    color: "#475569",
    lineHeight: 16.5,
    marginBottom: 10,
  },
  pillarsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  pillarChip: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pillarText: {
    fontFamily: FONTS.bodyMedium || FONTS.medium,
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
    fontFamily: FONTS.bodyMedium || FONTS.medium,
    fontSize: 10,
    color: "#166534",
    marginBottom: 1,
  },
  savedScoreValue: {
    fontFamily: FONTS.displayBold || FONTS.bold,
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
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 232, 240, 0.7)",
  },
  footerMetaText: {
    fontFamily: FONTS.bodyRegular || FONTS.regular,
    fontSize: 10.5,
    color: "#94A3B8",
  },
  actionBtn: {
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
  actionBtnText: {
    fontFamily: FONTS.bodyBold || FONTS.bold,
    fontSize: 11.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
