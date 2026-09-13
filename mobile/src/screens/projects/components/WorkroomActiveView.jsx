import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  Linking,
} from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { PebbleButton } from "../../../components/ui/PebbleButton";
import { Button } from "../../../components/ui/Button";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate, isExpired } from "../../../utils/formatDate";
import {
  MessageSquare,
  ShieldCheck,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Link2,
  UploadCloud,
  RotateCcw,
  XCircle,
  FileCheck,
  FileText,
  Check,
  ExternalLink,
  ChevronRight,
  Users,
} from "lucide-react-native";
import { useResponsiveLayout } from "../../../hooks/useResponsiveLayout";

export function WorkroomActiveView({
  project,
  isUmkmOwner,
  isMahasiswa,
  submissions = [],
  myExistingProposal,
  activePartnerName,
  activePartnerPhoto,
  navigation,
  onOpenSubmissionModal,
  onOpenApproveModal,
  onOpenRevisionModal,
  onOpenInvoiceModal,
  onOpenReopenModal,
  onOpenTerminateModal,
  onOpenResignModal,
  actionLoading = false,
  selectedSubmissionToApprove,
}) {
  const [activeTab, setActiveTab] = useState("deliverable"); // 'deliverable' | 'brief' | 'escrow'
  const { isLandscape, isCompact, responsiveContainerStyle } = useResponsiveLayout();

  const isProjectExpired =
    Boolean(project?.deadline && isExpired(project.deadline)) ||
    project?.status === "CANCELLED";

  const renderSubmissionNote = (note) => {
    if (!note) return null;
    const lines = note.split("\n");
    const checklistItems = lines
      .filter(
        (l) => l.trim().startsWith("- [ ]") || l.trim().startsWith("- [x]"),
      )
      .map((l) => l.replace(/^-\s*\[[ x]\]\s*/i, "").trim());
    const generalNote = lines
      .filter(
        (l) =>
          !l.trim().startsWith("- [ ]") &&
          !l.trim().startsWith("- [x]") &&
          !l.trim().toLowerCase().startsWith("daftar poin perbaikan"),
      )
      .join("\n")
      .trim();

    return (
      <View style={{ marginTop: 8, gap: 6 }}>
        {generalNote ? (
          <View style={styles.noteContainer}>
            <Text style={styles.noteLabel}>Catatan:</Text>
            <Text style={styles.noteBody}>"{generalNote}"</Text>
          </View>
        ) : null}
        {checklistItems.length > 0 ? (
          <View style={styles.checklistCard}>
            <Text style={styles.checklistTitle}>
              Poin Perbaikan yang Dikerjakan:
            </Text>
            {checklistItems.map((it, cIdx) => (
              <View key={cIdx} style={styles.checklistItemRow}>
                <Check
                  size={12}
                  color="#059669"
                  strokeWidth={2.5}
                  style={{ marginTop: 2 }}
                />
                <Text style={styles.checklistItemText}>{it}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        isCompact && { paddingHorizontal: 12 },
        isLandscape && { paddingVertical: 10 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={responsiveContainerStyle}>
        {/* 1. Unified Partner & Project Hero Card (Flat, zero card-ception) */}
        <View style={styles.heroCard}>
        {/* Top: Partner Profile & Clean Chat Shortcut */}
        <View style={styles.partnerHeaderRow}>
          <View style={styles.partnerAvatarWrap}>
            {activePartnerPhoto ? (
              <Image
                source={{ uri: activePartnerPhoto }}
                style={styles.partnerAvatar}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.partnerAvatarPlaceholder}>
                <Text style={styles.partnerAvatarText}>
                  {(activePartnerName || "M").charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.onlineBadge}>
              <CheckCircle2 size={10} color="#FFFFFF" fill="#10B981" />
            </View>
          </View>

          <View style={styles.partnerInfoCol}>
            <Text style={styles.partnerRoleLabel} numberOfLines={1}>
              {isUmkmOwner ? "Mahasiswa Pelaksana" : "Klien Pemilik Proyek"}
            </Text>
            <Text style={styles.partnerName} numberOfLines={1}>
              {activePartnerName || (isUmkmOwner ? "Mahasiswa" : "Klien UMKM")}
            </Text>
          </View>

          {/* Quick Chat Shortcut (isolated on the right, no overlapping badges) */}
          <TouchableOpacity
            style={styles.heroChatBtn}
            onPress={() =>
              navigation.navigate("Chat", {
                projectId: project.id,
                projectTitle: project.judul,
                partnerName: activePartnerName,
                partnerPhoto: activePartnerPhoto,
                partnerRole: isUmkmOwner ? "MHS" : "UMKM",
              })
            }
            activeOpacity={0.8}
          >
            <MessageSquare size={14} color="#2563EB" />
            <Text style={styles.heroChatBtnText}>Chat</Text>
          </TouchableOpacity>
        </View>

        {/* Project Title & Metadata Row (with Kontrak Berjalan badge placed safely here) */}
        <View style={styles.projectSnapshotBox}>
          <Text style={styles.projectTitleText} numberOfLines={2}>
            {project.judul}
          </Text>

          <View style={styles.metaRow}>
            {/* Active Status Badge */}
            <View style={styles.activePill}>
              <View style={styles.pulseDot} />
              <Text style={styles.activePillText}>Kontrak Berjalan</Text>
            </View>

            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>
                {project.kategori || "UMKM DIGITAL"}
              </Text>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaItem}>
              <Calendar size={11} color="#64748B" />
              <Text style={styles.metaItemText}>
                Tenggat: {formatDate(project.deadline)}
              </Text>
            </View>

            <Text style={styles.metaBudgetText}>
              {formatCurrency(project.budget_max)}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. Apple Segmented Workroom Navigation Switcher */}
      <View style={styles.segmentedTabsContainer}>
        <TouchableOpacity
          style={[
            styles.segmentedTab,
            activeTab === "deliverable" && styles.segmentedTabActive,
          ]}
          onPress={() => setActiveTab("deliverable")}
          activeOpacity={0.75}
        >
          <FileCheck
            size={13}
            color={activeTab === "deliverable" ? "#0F172A" : "#64748B"}
          />
          <Text
            style={[
              styles.segmentedTabText,
              activeTab === "deliverable" && styles.segmentedTabTextActive,
            ]}
          >
            Deliverable ({submissions.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentedTab,
            activeTab === "brief" && styles.segmentedTabActive,
          ]}
          onPress={() => setActiveTab("brief")}
          activeOpacity={0.75}
        >
          <FileText
            size={13}
            color={activeTab === "brief" ? "#0F172A" : "#64748B"}
          />
          <Text
            style={[
              styles.segmentedTabText,
              activeTab === "brief" && styles.segmentedTabTextActive,
            ]}
          >
            Instruksi Brief
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentedTab,
            activeTab === "escrow" && styles.segmentedTabActive,
          ]}
          onPress={() => setActiveTab("escrow")}
          activeOpacity={0.75}
        >
          <ShieldCheck
            size={13}
            color={activeTab === "escrow" ? "#0F172A" : "#64748B"}
          />
          <Text
            style={[
              styles.segmentedTabText,
              activeTab === "escrow" && styles.segmentedTabTextActive,
            ]}
          >
            Escrow 100%
          </Text>
        </TouchableOpacity>
      </View>

      {/* 3. TAB CONTENT (Direct Flat Layout - No Inner Nesting Cards) */}

      {/* TAB 1: DELIVERABLE & REVISI */}
      {activeTab === "deliverable" && (
        <View style={styles.tabContentWrap}>
          {submissions.length === 0 ? (
            <View style={styles.emptySubmissionCard}>
              <Clock size={30} color="#94A3B8" />
              <Text style={styles.emptyTitle}>
                {isMahasiswa
                  ? "Belum Mengunggah Hasil Kerja"
                  : "Menunggu Pengiriman Deliverable"}
              </Text>
              <Text style={styles.emptySub}>
                {isMahasiswa
                  ? "Unggah tautan berkas pengerjaan (Google Drive, Figma, atau repositori GitHub) agar klien UMKM dapat meninjau hasil kerja Anda."
                  : "Mahasiswa sedang menyelesaikan tugas. Berkas hasil kerja akan muncul otomatis di sini begitu dikirimkan."}
              </Text>

              {isProjectExpired && (
                <View style={styles.overdueCallout}>
                  <AlertTriangle size={14} color="#DC2626" />
                  <Text style={styles.overdueCalloutText}>
                    Tenggat waktu pengerjaan telah lewat. Anda dapat
                    berkoordinasi via ruang chat.
                  </Text>
                </View>
              )}

              {isMahasiswa ? (
                <View style={{ marginTop: 16, width: "100%", gap: 8 }}>
                  <PebbleButton
                    variant="sapphire"
                    label="Unggah Deliverable Sekarang"
                    icon={UploadCloud}
                    onPress={onOpenSubmissionModal}
                  />
                  <Button
                    title="Ajukan Pengunduran Diri"
                    variant="outline"
                    size="sm"
                    icon={<XCircle size={14} color="#BE123C" />}
                    textStyle={{ color: "#BE123C" }}
                    style={{ borderColor: "#FECACA" }}
                    onPress={onOpenResignModal}
                  />
                </View>
              ) : (
                isProjectExpired && (
                  <View style={{ marginTop: 14, width: "100%", gap: 8 }}>
                    <Button
                      title="Ganti Mahasiswa & Buka ke Eksplorasi"
                      variant="brand"
                      size="sm"
                      icon={<RotateCcw size={14} color="#FFF" />}
                      onPress={onOpenReopenModal}
                    />
                    <Button
                      title="Batalkan Proyek (Refund Escrow)"
                      variant="outline"
                      size="sm"
                      icon={<XCircle size={14} color="#BE123C" />}
                      textStyle={{ color: "#BE123C" }}
                      style={{ borderColor: "#FECACA" }}
                      onPress={onOpenTerminateModal}
                    />
                  </View>
                )
              )}
            </View>
          ) : (
            submissions.map((sub) => (
              <View key={sub.id} style={styles.deliverableCard}>
                {/* Header: Title, Date, and Status */}
                <View style={styles.deliverableHeaderRow}>
                  <View style={styles.deliverableIconCircle}>
                    <FileCheck size={18} color="#2563EB" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.deliverableCardTitle}>
                      Berkas Deliverable Terkirim
                    </Text>
                    <Text style={styles.deliverableCardDate}>
                      Dikirim pada{" "}
                      {formatDate(
                        sub.submitted_at || sub.created_at || new Date(),
                      )}
                    </Text>
                  </View>
                  <View style={styles.submittedPill}>
                    <Text style={styles.submittedPillText}>Terkirim</Text>
                  </View>
                </View>

                {/* Direct Link Row */}
                <TouchableOpacity
                  style={styles.fileLinkRow}
                  onPress={() => {
                    if (sub.url_berkas) {
                      Linking.openURL(sub.url_berkas).catch(() => {});
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Link2 size={15} color="#2563EB" />
                  <Text style={styles.fileLinkText} numberOfLines={1}>
                    {sub.url_berkas}
                  </Text>
                  <ExternalLink size={13} color="#64748B" />
                </TouchableOpacity>

                {/* Clean Note Content */}
                {renderSubmissionNote(sub.catatan_pengiriman)}

                {/* Action Buttons */}
                {isUmkmOwner ? (
                  <View style={styles.actionRow}>
                    <PebbleButton
                      variant="emerald"
                      size="md"
                      label="Setujui & Lepas Escrow"
                      icon={CheckCircle2}
                      onPress={() => onOpenApproveModal(sub)}
                      loading={
                        actionLoading &&
                        selectedSubmissionToApprove?.id === sub.id
                      }
                    />
                  </View>
                ) : (
                  <View style={styles.actionRow}>
                    <PebbleButton
                      variant="sapphire"
                      size="md"
                      label="Perbarui Tautan Deliverable"
                      icon={UploadCloud}
                      onPress={onOpenSubmissionModal}
                    />
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      )}

      {/* TAB 2: INSTRUKSI BRIEF & SPESIFIKASI */}
      {activeTab === "brief" && (
        <View style={styles.cleanSectionCard}>
          <Text style={styles.sectionHeaderTitle}>Rincian Kebutuhan Brief</Text>
          <Text style={styles.descriptionBody}>{project.deskripsi_raw}</Text>

          {/* Rincian Deliverable Luaran */}
          {Array.isArray(project.deliverables) &&
            project.deliverables.length > 0 && (
              <View style={{ marginTop: 14 }}>
                <Text style={styles.subSectionTitle}>
                  Luaran Deliverable Wajib
                </Text>
                {project.deliverables.map((item, idx) => (
                  <View key={idx} style={styles.checkItemRow}>
                    <CheckCircle2 size={13} color="#10B981" />
                    <Text style={styles.checkItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

          {/* Komposisi Tim (jika proyek TIM) */}
          {project.tipe_kolaborasi === "TIM" &&
            Array.isArray(project.slots) &&
            project.slots.length > 0 && (
              <View style={{ marginTop: 14 }}>
                <Text style={styles.subSectionTitle}>Peran Tim Proyek</Text>
                {project.slots.map((slot) => (
                  <View key={slot.id} style={styles.slotRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.slotRoleName}>{slot.nama_peran}</Text>
                      <Text style={styles.slotBudget}>
                        Alokasi: {formatCurrency(slot.alokasi_budget)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.slotBadge,
                        slot.status === "TAKEN" && styles.slotBadgeTaken,
                      ]}
                    >
                      <Text style={styles.slotBadgeText}>
                        {slot.status === "TAKEN" ? "Terisi" : "Terbuka"}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
        </View>
      )}

      {/* TAB 3: KONTRAK & ESCROW */}
      {activeTab === "escrow" && (
        <View style={styles.cleanSectionCard}>
          <View style={styles.escrowBannerRow}>
            <View style={styles.escrowShieldCircle}>
              <ShieldCheck size={22} color="#059669" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.escrowShieldTitle}>
                Dana Tersimpan di Rekening Bersama
              </Text>
              <Text style={styles.escrowShieldSub}>
                {isMahasiswa
                  ? "Honor Anda 100% aman dan akan cair otomatis ke saldo dompet setelah Klien menyetujui hasil deliverable."
                  : "Dana Anda baru ditransfer ke mahasiswa setelah hasil deliverable Anda terima dan setujui."}
              </Text>
            </View>
          </View>

          <View style={styles.escrowDivider} />

          <View style={styles.escrowDetailGrid}>
            <View style={styles.escrowMetricBox}>
              <Text style={styles.escrowMetricLabel}>Total Nilai Kontrak</Text>
              <Text style={styles.escrowMetricValue}>
                {formatCurrency(project.budget_max)}
              </Text>
            </View>
            <View style={styles.escrowMetricBox}>
              <Text style={styles.escrowMetricLabel}>Status Garansi</Text>
              <Text style={[styles.escrowMetricValue, { color: "#059669" }]}>
                100% Terlindungi
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.invoiceTriggerBtn}
            onPress={onOpenInvoiceModal}
            activeOpacity={0.8}
          >
            <FileCheck size={15} color="#2563EB" />
            <Text style={styles.invoiceTriggerText}>
              Buka Faktur Resmi Escrow
            </Text>
            <ChevronRight size={15} color="#64748B" />
          </TouchableOpacity>
        </View>
      )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  // 1. Unified Hero Surface (Clean, no nested boxes)
  heroCard: {
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    marginBottom: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  partnerHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  partnerAvatarWrap: {
    position: "relative",
  },
  partnerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  partnerAvatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  partnerAvatarText: {
    fontFamily: FONTS.displayBold,
    fontSize: 17,
    color: "#FFFFFF",
  },
  onlineBadge: {
    position: "absolute",
    bottom: -1,
    right: -1,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
  },
  partnerInfoCol: {
    flex: 1,
    marginLeft: 11,
    justifyContent: "center",
  },
  partnerRoleLabel: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 10,
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  partnerName: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 1,
  },
  heroChatBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(37, 99, 235, 0.08)",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "rgba(37, 99, 235, 0.2)",
    marginLeft: 8,
  },
  heroChatBtnText: {
    fontFamily: FONTS.displayBold,
    fontSize: 11.5,
    fontWeight: "700",
    color: "#2563EB",
  },
  projectSnapshotBox: {
    marginTop: 12,
    paddingTop: 11,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  projectTitleText: {
    fontFamily: FONTS.displayBold,
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    flexWrap: "wrap",
    gap: 7,
  },
  activePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#10B981",
  },
  activePillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9.5,
    color: "#059669",
    fontWeight: "700",
  },
  metaBadge: {
    backgroundColor: "rgba(15, 23, 42, 0.04)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  metaBadgeText: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 9.5,
    color: "#475569",
    fontWeight: "600",
  },
  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#CBD5E1",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
  },
  metaItemText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
  },
  metaBudgetText: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
    marginLeft: "auto",
  },

  // 2. Segmented Tabs
  segmentedTabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(15, 23, 42, 0.05)",
    padding: 3,
    borderRadius: 13,
    marginBottom: 12,
  },
  segmentedTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 7.5,
    borderRadius: 10,
  },
  segmentedTabActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentedTabText: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  segmentedTabTextActive: {
    color: "#0F172A",
    fontWeight: "700",
  },

  // 3. Tab Content - Direct Single Layer Cards
  tabContentWrap: {
    gap: 10,
  },
  emptySubmissionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
  },
  emptyTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 8,
    textAlign: "center",
  },
  emptySub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 5,
    lineHeight: 18,
  },
  overdueCallout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  overdueCalloutText: {
    flex: 1,
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: "#BE123C",
    lineHeight: 15,
  },

  // Clean Deliverable Card (Only 1 outer border, clean flat interior)
  deliverableCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  deliverableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliverableIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(37, 99, 235, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  deliverableCardTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  deliverableCardDate: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  submittedPill: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  submittedPillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: "#059669",
    fontWeight: "700",
  },
  fileLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 12,
  },
  fileLinkText: {
    flex: 1,
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: "#2563EB",
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 2,
  },
  noteLabel: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  noteBody: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: "#334155",
    fontStyle: "italic",
    lineHeight: 16,
  },
  checklistCard: {
    backgroundColor: "#ECFDF5",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    marginTop: 4,
  },
  checklistTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 11,
    color: "#065F46",
    fontWeight: "700",
    marginBottom: 3,
  },
  checklistItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 3,
  },
  checklistItemText: {
    flex: 1,
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: "#047857",
    lineHeight: 15,
  },
  actionRow: {
    marginTop: 14,
  },

  // 4. Clean Section Card (for Brief and Escrow)
  cleanSectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionHeaderTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  descriptionBody: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12.5,
    color: "#334155",
    lineHeight: 19,
  },
  subSectionTitle: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 12,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 6,
  },
  checkItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  checkItemText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11.5,
    color: "#475569",
  },
  slotRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    marginBottom: 6,
  },
  slotRoleName: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  slotBudget: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10.5,
    color: "#64748B",
    marginTop: 1,
  },
  slotBadge: {
    backgroundColor: "rgba(37, 99, 235, 0.08)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  slotBadgeTaken: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  slotBadgeText: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 10,
    color: "#2563EB",
    fontWeight: "600",
  },

  // Escrow Details
  escrowBannerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  escrowShieldCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  escrowShieldTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13.5,
    fontWeight: "700",
    color: "#065F46",
  },
  escrowShieldSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: "#475569",
    marginTop: 3,
    lineHeight: 16,
  },
  escrowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E2E8F0",
    marginVertical: 14,
  },
  escrowDetailGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  escrowMetricBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 10,
  },
  escrowMetricLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10.5,
    color: "#64748B",
  },
  escrowMetricValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 2,
  },
  invoiceTriggerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  invoiceTriggerText: {
    flex: 1,
    fontFamily: FONTS.displaySemiBold,
    fontSize: 11.5,
    fontWeight: "600",
    color: "#0F172A",
    marginLeft: 8,
  },
});
