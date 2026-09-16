import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform,
} from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Share2,
  X,
  GraduationCap,
  Building2,
  Calendar,
  Users,
  Coins,
} from "lucide-react-native";
import { formatCurrency } from "../../../utils/formatCurrency";
import { useToastStore } from "../../../store/toastStore";

export function MobileCertificateModal({ visible, certificate, onClose }) {
  const { showToast } = useToastStore();
  const [copied, setCopied] = useState(false);

  if (!certificate) return null;

  const verificationUrl = `https://makarya.id/certificates/verify/${certificate.credential_id}`;

  const handleCopy = async () => {
    try {
      await Share.share({
        message: verificationUrl,
        title: "Tautan Verifikasi Sertifikat",
      });
      setCopied(true);
      showToast("Tautan verifikasi dibuka untuk disalin!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast("Gagal membagikan tautan", "error");
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Sertifikat Penyelesaian Proyek Makarya: ${certificate.project_title} (${certificate.role_name}) oleh ${certificate.recipient_name}. Verifikasi resmi di: ${verificationUrl}`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTitleRow}>
              <ShieldCheck size={18} color={COLORS.success} />
              <Text style={styles.headerTitle}>Sertifikat Terverifikasi</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Certificate Frame */}
            <View style={styles.certCard}>
              <View style={styles.emblemContainer}>
                <Award size={32} color={COLORS.primary} />
              </View>

              <Text style={styles.brandSubtitle}>
                PLATFORM MAKARYA INDONESIA
              </Text>
              <Text style={styles.certTitle}>
                Sertifikat Penyelesaian Proyek
              </Text>
              <Text style={styles.certDescEnglish}>
                Certificate of Project Completion
              </Text>

              <View style={styles.divider} />

              <Text style={styles.introText}>
                Dengan bangga menyatakan bahwa mahasiswa:
              </Text>

              <Text style={styles.recipientName}>
                {certificate.recipient_name}
              </Text>

              <View style={styles.campusRow}>
                <GraduationCap size={14} color={COLORS.primary} />
                <Text style={styles.campusText}>
                  {certificate.recipient_kampus}, {certificate.recipient_prodi}
                </Text>
              </View>

              <Text style={styles.completionText}>
                Telah menuntaskan seluruh penugasan kerja industri dengan
                standar profesional sebagai:
              </Text>

              {/* Project & Role Info Box */}
              <View style={styles.infoBox}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={styles.roleTag}>
                    <Text style={styles.roleTagText}>
                      {certificate.role_name}
                    </Text>
                  </View>
                  <Text style={styles.collabTypeText}>
                    {certificate.collaboration_type === "TIM" ||
                    (certificate.team_breakdown &&
                      certificate.team_breakdown.length > 0)
                      ? `Tim (${certificate.team_breakdown?.length || 0} Peran)`
                      : "Individu"}
                  </Text>
                </View>

                <Text style={styles.projectTitleText}>
                  {certificate.project_title}
                </Text>

                {/* Verified Honor Amount */}
                <View style={styles.honorRow}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Coins size={13} color="#059669" />
                    <Text style={styles.honorLabel}>Honor Terverifikasi:</Text>
                  </View>
                  <Text style={styles.honorValue}>
                    {certificate.honor_amount || certificate.slot_budget
                      ? formatCurrency(
                          certificate.honor_amount || certificate.slot_budget,
                        )
                      : "Sesuai Kontrak"}
                  </Text>
                </View>

                <View style={styles.clientRow}>
                  <Building2 size={13} color={COLORS.textSecondary} />
                  <Text style={styles.clientText}>
                    Mitra UMKM:{" "}
                    <Text style={styles.boldText}>
                      {certificate.client_name}
                    </Text>
                  </Text>
                </View>

                {/* Team Breakdown if team project */}
                {certificate.team_breakdown &&
                  certificate.team_breakdown.length > 0 && (
                    <View style={styles.teamBreakdownContainer}>
                      <View style={styles.teamBreakdownHeader}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Users size={12} color={COLORS.primary} />
                          <Text style={styles.teamBreakdownTitle}>
                            Pagu Formasi Tim Klien:
                          </Text>
                        </View>
                        {certificate.total_project_budget ? (
                          <Text style={styles.teamTotalBudget}>
                            Total{" "}
                            {formatCurrency(certificate.total_project_budget)}
                          </Text>
                        ) : null}
                      </View>

                      <View style={styles.teamSlotsList}>
                        {certificate.team_breakdown.map((member, mIdx) => {
                          const isCurrentRole =
                            member.nama_peran?.toLowerCase() ===
                            certificate.role_name?.toLowerCase();
                          return (
                            <View
                              key={mIdx}
                              style={[
                                styles.teamSlotItem,
                                isCurrentRole && styles.teamSlotItemActive,
                              ]}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: 4,
                                  flex: 1,
                                }}
                              >
                                <View
                                  style={[
                                    styles.teamSlotDot,
                                    isCurrentRole && {
                                      backgroundColor: COLORS.primary,
                                    },
                                  ]}
                                />
                                <Text
                                  style={[
                                    styles.teamSlotRoleName,
                                    isCurrentRole &&
                                      styles.teamSlotRoleNameActive,
                                  ]}
                                  numberOfLines={1}
                                >
                                  {member.nama_peran}
                                  {member.mhs_nama
                                    ? ` (${member.mhs_nama})`
                                    : ""}
                                </Text>
                              </View>
                              <Text
                                style={[
                                  styles.teamSlotBudget,
                                  isCurrentRole && styles.teamSlotBudgetActive,
                                ]}
                              >
                                {formatCurrency(member.alokasi_budget)}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  )}
              </View>

              {/* Credential ID and Date */}
              <View style={styles.credRow}>
                <View style={styles.credCol}>
                  <Text style={styles.credLabel}>ID KREDENSIAL RESMI</Text>
                  <Text style={styles.credId}>{certificate.credential_id}</Text>
                </View>

                <View style={styles.verifiedBadge}>
                  <CheckCircle2 size={14} color={COLORS.success} />
                  <Text style={styles.verifiedText}>Valid Resmi</Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={handleCopy}
                activeOpacity={0.8}
              >
                <Copy size={16} color={COLORS.text} />
                <Text style={styles.outlineBtnText}>
                  {copied ? "Tersalin!" : "Salin Link"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleShare}
                activeOpacity={0.8}
              >
                <Share2 size={16} color="#FFF" />
                <Text style={styles.primaryBtnText}>Bagikan Sertifikat</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "90%",
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  certCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  emblemContainer: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(79, 70, 229, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  certTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    textAlign: "center",
    textTransform: "uppercase",
  },
  certDescEnglish: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginVertical: 6,
  },
  introText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  recipientName: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    textAlign: "center",
  },
  campusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  campusText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  completionText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 12,
    gap: 6,
    marginVertical: 6,
  },
  roleTag: {
    backgroundColor: "rgba(79, 70, 229, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  roleTagText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  collabTypeText: {
    fontSize: 10.5,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    backgroundColor: "rgba(79, 70, 229, 0.08)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  honorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  honorLabel: {
    fontSize: 10.5,
    fontFamily: FONTS.bold,
    color: "#065F46",
  },
  honorValue: {
    fontSize: 11.5,
    fontFamily: FONTS.bold,
    color: "#047857",
  },
  teamBreakdownContainer: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 6,
  },
  teamBreakdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamBreakdownTitle: {
    fontSize: 10.5,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  teamTotalBudget: {
    fontSize: 10.5,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  teamSlotsList: {
    gap: 4,
    backgroundColor: "#F8FAFC",
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  teamSlotItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  teamSlotItemActive: {
    backgroundColor: "rgba(79, 70, 229, 0.08)",
  },
  teamSlotDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#94A3B8",
  },
  teamSlotRoleName: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  teamSlotRoleNameActive: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  teamSlotBudget: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  teamSlotBudgetActive: {
    color: COLORS.primary,
  },
  projectTitleText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  clientText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  boldText: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  credRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginTop: 4,
  },
  credCol: {
    gap: 2,
  },
  credLabel: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
  },
  credId: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.success,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  outlineBtnText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  primaryBtn: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  primaryBtnText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: "#FFF",
  },
});
