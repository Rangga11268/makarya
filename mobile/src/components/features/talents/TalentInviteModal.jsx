import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { X, Briefcase, Plus } from 'lucide-react-native';
import { COLORS } from '../../../theme/colors';
import { FONTS } from '../../../theme/fonts';
import { formatStatus } from '../../../utils/formatStatus';
import { formatCurrency } from '../../../utils/formatCurrency';

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
        <View style={styles.inviteModalCard}>
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
            <Text style={{ fontFamily: FONTS.bodyBold, color: COLORS.textDark }}>
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
            <View style={styles.projectSelectList}>
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
                            isChecked && { color: COLORS.brandIndigo },
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
            </View>
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
                Anda dapat membuat deskripsi proyek baru sekarang agar talenta ini
                langsung dapat meninjau dan menerima penawaran Anda.
              </Text>
            </View>
          )}

          <View style={styles.contactActionButtons}>
            {myProjects.length > 0 ? (
              <TouchableOpacity
                style={styles.primaryInviteBtn}
                onPress={onInvite}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryInviteBtnText}>
                  Buka Halaman Proyek & Hubungi
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.primaryInviteBtn}
                onPress={() => {
                  onClose();
                  navigation.navigate("PostProject");
                }}
                activeOpacity={0.85}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.primaryInviteBtnText}>
                  Pasang Kebutuhan Proyek Baru
                </Text>
              </TouchableOpacity>
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
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "flex-end",
  },
  inviteModalCard: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
  },
  detailModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  detailModalTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  closeCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  inviteSubText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 10,
    marginBottom: 14,
  },
  loadingText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  projectSelectList: {
    gap: 8,
    maxHeight: 250,
  },
  projectOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  projectOptionRowActive: {
    backgroundColor: COLORS.brandIndigoLight,
    borderColor: COLORS.brandIndigo,
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
    color: COLORS.brandIndigo,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.textMuted,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  radioCircleActive: {
    borderColor: COLORS.brandIndigo,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.brandIndigo,
  },
  noProjectsNotice: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
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
    marginTop: 16,
  },
  primaryInviteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.brandIndigo,
    paddingVertical: 13,
    borderRadius: 14,
  },
  primaryInviteBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
