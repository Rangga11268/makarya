import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { X, Briefcase, Plus } from "lucide-react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { formatStatus } from "../../../utils/formatStatus";
import { formatCurrency } from "../../../utils/formatCurrency";
import { PebbleButton } from "../../ui/PebbleButton";

export function TalentInviteModal({
  visible,
  onClose,
  talent,
  myProjects = [],
  loadingProjects = false,
  selectedProjectId,
  setSelectedProjectId,
  onInvite,
  navigation,
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.inviteModalCard}>
          {/* Apple BottomSheet Grabber Handle */}
          <View style={styles.grabberHandle} />

          <View style={styles.detailModalHeader}>
            <Text style={styles.detailModalTitle}>Ajak Kolaborasi Proyek</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeCircleBtn}
              activeOpacity={0.7}
            >
              <X size={18} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <Text style={styles.inviteSubText}>
            Pilih salah satu proyek aktif Anda untuk menghubungkan brief
            pengerjaan dengan{" "}
            <Text
              style={{ fontFamily: FONTS.bodyBold, color: COLORS.textDark }}
            >
              {talent?.nama_lengkap}
            </Text>
            .
          </Text>

          {loadingProjects ? (
            <View style={{ padding: 24, alignItems: "center" }}>
              <ActivityIndicator size="small" color={COLORS.brandIndigo} />
              <Text style={styles.loadingText}>
                Memuat daftar proyek Anda...
              </Text>
            </View>
          ) : myProjects.length > 0 ? (
            <ScrollView
              style={styles.projectScrollView}
              contentContainerStyle={styles.projectScrollContent}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              bounces={true}
            >
              {myProjects.map((p) => {
                const isChecked = selectedProjectId === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.projectOptionRow,
                      isChecked && styles.projectOptionRowActive,
                    ]}
                    onPress={() => setSelectedProjectId(p.id)}
                    activeOpacity={0.8}
                  >
                    <View style={{ flex: 1 }}>
                      <View style={styles.projectOptionTopRow}>
                        <Text
                          style={[
                            styles.projectOptionTitle,
                            isChecked && { color: "#2563EB" },
                          ]}
                          numberOfLines={1}
                        >
                          {p.judul}
                        </Text>
                        <View
                          style={[
                            styles.statusPillSmall,
                            p.status === "OPEN" || p.status === "BIDDING"
                              ? styles.statusPillOpen
                              : p.status === "IN_PROGRESS"
                                ? styles.statusPillInProgress
                                : styles.statusPillDone,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusPillSmallText,
                              p.status === "OPEN" || p.status === "BIDDING"
                                ? styles.statusTextOpen
                                : p.status === "IN_PROGRESS"
                                  ? styles.statusTextInProgress
                                  : styles.statusTextDone,
                            ]}
                          >
                            {formatStatus(p.status)}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.projectOptionMetaRow}>
                        <Text style={styles.projectOptionBudgetText}>
                          Pagu: {formatCurrency(p.budget_max)}
                        </Text>
                        <Text style={styles.projectOptionDot}>•</Text>
                        <Text style={styles.projectOptionCategoryText}>
                          {p.kategori || "UMKM Digital"}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.radioCircle,
                        isChecked && styles.radioCircleActive,
                      ]}
                    >
                      {isChecked && <View style={styles.radioDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.noProjectsNotice}>
              <Briefcase
                size={28}
                color={COLORS.brandIndigo}
                style={{ marginBottom: 8 }}
              />
              <Text style={styles.noProjectsNoticeTitle}>
                Belum Ada Proyek Aktif
              </Text>
              <Text style={styles.noProjectsNoticeDesc}>
                Anda dapat membuat deskripsi proyek baru sekarang agar talenta
                ini langsung dapat meninjau dan menerima penawaran Anda.
              </Text>
            </View>
          )}

          <View style={styles.contactActionButtons}>
            {myProjects.length > 0 ? (
              <PebbleButton
                variant="sapphire"
                size="lg"
                label="Buka Halaman Proyek & Hubungi"
                onPress={onInvite}
                style={{ width: "100%" }}
              />
            ) : (
              <PebbleButton
                variant="sapphire"
                size="lg"
                label="Pasang Kebutuhan Proyek Baru"
                icon={Plus}
                onPress={() => {
                  onClose();
                  navigation.navigate("PostProject");
                }}
                style={{ width: "100%" }}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  inviteModalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: "82%",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 24,
  },
  grabberHandle: {
    width: 38,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 14,
  },
  detailModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(226, 232, 240, 0.7)",
  },
  detailModalTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  closeCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(241, 245, 249, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  inviteSubText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12.5,
    color: "#475569",
    lineHeight: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  loadingText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  projectScrollView: {
    maxHeight: 330,
  },
  projectScrollContent: {
    paddingVertical: 4,
    gap: 10,
  },
  projectOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  projectOptionRowActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2563EB",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  projectOptionTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  projectOptionTitle: {
    flex: 1,
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  projectOptionMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  projectOptionBudgetText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#2563EB",
  },
  projectOptionDot: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  projectOptionCategoryText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  statusPillSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  statusPillOpen: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  statusPillInProgress: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  statusPillDone: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  statusPillSmallText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9.5,
  },
  statusTextOpen: {
    color: "#065F46",
  },
  statusTextInProgress: {
    color: "#1D4ED8",
  },
  statusTextDone: {
    color: "#475569",
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.8,
    borderColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  radioCircleActive: {
    borderColor: "#2563EB",
  },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: "#2563EB",
  },
  noProjectsNotice: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  noProjectsNoticeTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  noProjectsNoticeDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 16,
  },
  contactActionButtons: {
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 232, 240, 0.7)",
    marginTop: 6,
  },
});
