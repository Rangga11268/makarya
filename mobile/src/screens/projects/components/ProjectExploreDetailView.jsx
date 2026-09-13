import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { Badge } from "../../../components/ui/Badge";
import { PebbleButton } from "../../../components/ui/PebbleButton";
import { Button } from "../../../components/ui/Button";
import { ProposalCard } from "../../../components/features/ProposalCard";
import { ProjectStatusBar } from "../../../components/features/ProjectStatusBar";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import { formatStatus } from "../../../utils/formatStatus";
import {
  ShieldCheck,
  Calendar,
  Building2,
  CheckCircle2,
  FileCheck,
  Briefcase,
  UploadCloud,
  Link2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  MessageSquare,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Users,
  Palette,
  Smartphone,
  Send,
  Clock,
} from "lucide-react-native";

export function ProjectExploreDetailView({
  project,
  user,
  isMahasiswa,
  isUmkmOwner,
  clientPhoto,
  clientDisplayName,
  hasAcceptedStudent,
  activePartnerName,
  activePartnerPhoto,
  isBriefExpanded,
  setIsBriefExpanded,
  submissions,
  proposals,
  myExistingProposal,
  isAcceptedProposal,
  isProjectExpired,
  actionLoading,
  selectedProposalToAccept,
  selectedSubmissionToApprove,
  activeTab,
  setActiveTab,
  responsiveContainerStyle,
  isCompact,
  isLandscape,
  canApply,
  navigation,
  showConfirm,
  setInvoiceModal,
  setSubmissionModal,
  setProposalModal,
  setReopenModal,
  setTerminateModal,
  setResignModal,
  handleOpenAcceptModal,
  handleRejectProposal,
  handleOpenApproveModal,
  renderSubmissionNote,
}) {
  return (
    <>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isCompact && { paddingHorizontal: 16 },
          isLandscape && { paddingVertical: 12 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={responsiveContainerStyle}>
          {/* ================================================================= */}
          {/* 1. APPLE GLOSSY HERO CARD                                        */}
          {/* Unifies Meta, Title, Client Info, Metrics, & Escrow without clutter*/}
          {/* ================================================================= */}
          <View style={styles.appleHeroCard}>
            {/* Top Row: Meta Badges (Left) & Faktur Button (Right) - Zero Collision */}
            <View style={styles.appleTopRow}>
              <View style={styles.appleBadgeGroup}>
                <View style={styles.categoryChip}>
                  <Text style={styles.categoryChipText}>
                    {project.kategori
                      ? project.kategori.toUpperCase()
                      : "UMKM DIGITAL"}
                  </Text>
                </View>
                <View style={styles.statusChip}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          project.status === "OPEN" ||
                          project.status === "BIDDING"
                            ? "#059669"
                            : project.status === "IN_PROGRESS"
                              ? "#2563EB"
                              : "#64748B",
                      },
                    ]}
                  />
                  <Text style={styles.statusChipText}>
                    {formatStatus(project.status || "OPEN")}
                  </Text>
                </View>
              </View>

              {/* Dedicated Non-colliding Faktur Action */}
              <TouchableOpacity
                style={styles.appleInvoiceBtn}
                onPress={() => setInvoiceModal(true)}
                activeOpacity={0.75}
              >
                <FileCheck size={13} color="#2563EB" />
                <Text style={styles.appleInvoiceBtnText}>Faktur</Text>
              </TouchableOpacity>
            </View>

            {/* Project Main Headline */}
            <Text style={styles.projectHeadline}>{project.judul}</Text>

            {/* Client Profile Byline (Full Width, Safe from Overlap) */}
            <View style={styles.clientBylineRow}>
              {clientPhoto ? (
                <Image
                  source={{ uri: clientPhoto }}
                  style={styles.clientAvatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.clientAvatarPlaceholder}>
                  <Building2 size={18} color={COLORS.brandIndigo} />
                </View>
              )}
              <View style={styles.clientInfoCol}>
                <View style={styles.clientNameVerifiedRow}>
                  <Text
                    style={styles.clientNameText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {clientDisplayName}
                  </Text>
                  <View style={styles.verifiedBadge}>
                    <Check size={9} color="#059669" strokeWidth={3} />
                    <Text style={styles.verifiedBadgeText}>Terverifikasi</Text>
                  </View>
                </View>
                <Text style={styles.clientLocationText}>
                  {project.lokasi || "Indonesia"} • Mitra Klien UMKM
                </Text>
              </View>
            </View>

            {/* Subtle Divider Inside Card */}
            <View style={styles.cardInternalDivider} />

            {/* Key Metrics: Budget & Deadline in 2-Column Apple Stat Display */}
            <View style={styles.keyMetricsGrid}>
              <View style={styles.metricColumn}>
                <Text style={styles.metricLabel}>PAGU MAKSIMAL</Text>
                <Text style={styles.metricValuePrimary}>
                  {formatCurrency(project.budget_max)}
                </Text>
              </View>
              <View style={styles.metricDividerVertical} />
              <View style={styles.metricColumn}>
                <Text style={styles.metricLabel}>BATAS WAKTU</Text>
                <View style={styles.metricValueRow}>
                  <Calendar size={13} color="#475569" />
                  <Text style={styles.metricValueSecondary}>
                    {formatDate(project.deadline)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Escrow Guarantee Trust Banner (Integrated at bottom of hero) */}
            <View style={styles.escrowTrustStrip}>
              <ShieldCheck size={14} color="#059669" />
              <Text style={styles.escrowTrustText}>
                Garansi Escrow 100% • Dana honor tersimpan aman di rekening bersama
              </Text>
            </View>

            {/* Match Score Indicator (For Mahasiswa) */}
            {project.match_score && isMahasiswa ? (
              <View style={styles.matchScoreRow}>
                <CheckCircle2 size={13} color="#059669" />
                <Text style={styles.matchScoreText}>
                  <Text style={styles.matchScoreBold}>
                    {project.match_score}% Cocok
                  </Text>{" "}
                  dengan keahlian profil Anda
                </Text>
              </View>
            ) : null}
          </View>

          {/* ================================================================= */}
          {/* 2. ESCROW STEPPER (FLAT)                                          */}
          {/* ================================================================= */}
          <View style={styles.stepperWrapper}>
            <ProjectStatusBar currentStatus={project.status} flat />
          </View>

          {/* Cancellation / Expiry Notice (if cancelled) */}
          {project.status === "CANCELLED" && (
            <View style={styles.cancellationAuditCard}>
              <View style={styles.cancellationAuditHeader}>
                <View style={styles.cancellationAuditBadgeRow}>
                  <View style={styles.cancellationBadge}>
                    <XCircle size={14} color="#DC2626" />
                    <Text style={styles.cancellationBadgeText}>
                      {project.cancelled_by_role === "MAHASISWA"
                        ? "Mahasiswa Mengundurkan Diri"
                        : project.cancelled_by_role === "UMKM"
                          ? "Dibatalkan Klien UMKM"
                          : project.cancelled_by_role === "SYSTEM_EXPIRED"
                            ? "Kedaluwarsa Otomatis"
                            : "Proyek Dibatalkan"}
                    </Text>
                  </View>
                  <View style={styles.refundEscrowBadge}>
                    <ShieldCheck size={12} color="#059669" />
                    <Text style={styles.refundEscrowBadgeText}>
                      100% Escrow Dikembalikan
                    </Text>
                  </View>
                </View>
                {project.cancelled_at ? (
                  <Text style={styles.cancellationTimeText}>
                    Waktu: {formatDate(project.cancelled_at)}
                  </Text>
                ) : null}
              </View>
              <View style={styles.cancellationReasonBox}>
                <Text style={styles.cancellationReasonLabel}>
                  Alasan Pembatalan:
                </Text>
                <Text style={styles.cancellationReasonQuote}>
                  "{project.cancel_reason || "Tidak ada catatan alasan tertulis."}"
                </Text>
              </View>
            </View>
          )}

          {/* Team Collaboration Slots (If multi-role team) */}
          {project.tipe_kolaborasi === "TIM" &&
            Array.isArray(project.slots) &&
            project.slots.length > 0 && (
              <View style={styles.contentSection}>
                <View style={styles.sectionHeaderWithIcon}>
                  <Users size={16} color={COLORS.brandIndigo} />
                  <Text style={styles.sectionHeading}>
                    Formasi Tim Proyek ({project.slots.length} Talenta)
                  </Text>
                </View>
                <Text style={styles.sectionSubHeading}>
                  Alokasi peran & pagu anggaran independen tiap posisi.
                </Text>
                <View style={styles.teamSlotsList}>
                  {project.slots.map((s, idx) => {
                    const isSlotOpen = s.status === "OPEN";
                    const isSlotDone = s.status === "COMPLETED";
                    return (
                      <View key={s.id || idx} style={styles.teamSlotItem}>
                        <View style={styles.teamSlotItemTop}>
                          <View style={{ flex: 1, marginRight: 8 }}>
                            <Text style={styles.teamSlotItemRole}>
                              {s.nama_peran}
                            </Text>
                            <Text style={styles.teamSlotItemBudget}>
                              Pagu: {formatCurrency(s.alokasi_budget)}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.teamSlotStatusTag,
                              isSlotOpen
                                ? styles.teamSlotStatusTagOpen
                                : isSlotDone
                                  ? styles.teamSlotStatusTagDone
                                  : styles.teamSlotStatusTagActive,
                            ]}
                          >
                            <Text
                              style={[
                                styles.teamSlotStatusText,
                                isSlotOpen
                                  ? styles.teamSlotStatusTextOpen
                                  : isSlotDone
                                    ? styles.teamSlotStatusTextDone
                                    : styles.teamSlotStatusTextActive,
                              ]}
                            >
                              {isSlotOpen
                                ? "Mencari Talenta"
                                : isSlotDone
                                  ? "Selesai"
                                  : "Dikerjakan"}
                            </Text>
                          </View>
                        </View>
                        {s.deskripsi_tugas ? (
                          <Text style={styles.teamSlotItemDesc}>
                            {s.deskripsi_tugas}
                          </Text>
                        ) : null}
                        {s.mahasiswa_nama ? (
                          <View style={styles.assignedMhsRow}>
                            <CheckCircle2 size={12} color="#059669" />
                            <Text style={styles.assignedMhsText}>
                              Talenta: {s.mahasiswa_nama}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
                <View style={styles.hairlineDivider} />
              </View>
            )}

          {/* Active Chat Entry Point (Clean Action Strip) */}
          {hasAcceptedStudent && (
            <View style={{ marginBottom: 14 }}>
              <TouchableOpacity
                style={styles.openChatBar}
                onPress={() =>
                  navigation.navigate("Chat", {
                    projectId: project.id,
                    projectTitle: project.judul,
                    partnerName: activePartnerName,
                    partnerPhoto: activePartnerPhoto,
                    partnerRole: isUmkmOwner ? "MHS" : "UMKM",
                  })
                }
                activeOpacity={0.85}
              >
                <View style={styles.openChatBarLeft}>
                  {activePartnerPhoto ? (
                    <Image
                      source={{ uri: activePartnerPhoto }}
                      style={styles.chatPartnerAvatar}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.chatIconBadge}>
                      <MessageSquare size={15} color="#FFFFFF" />
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.openChatTitle}>
                      Ruang Diskusi & Kerja{" "}
                      {activePartnerName ? `(${activePartnerName})` : ""}
                    </Text>
                    <Text style={styles.openChatSub}>
                      Kirim pesan, feedback, dan koordinasi secara langsung
                    </Text>
                  </View>
                </View>
                <ChevronRight size={16} color={COLORS.brandIndigo} />
              </TouchableOpacity>
              <View style={styles.hairlineDivider} />
            </View>
          )}

          {/* ================================================================= */}
          {/* 3. RINCIAN BRIEF KEBUTUHAN PROYEK (DOCUMENT FLOW)                 */}
          {/* ================================================================= */}
          <View style={styles.contentSection}>
            <Text style={styles.sectionHeading}>Rincian Kebutuhan Proyek</Text>
            <Text
              style={styles.briefParagraph}
              numberOfLines={
                !isBriefExpanded &&
                (project.deskripsi_raw?.length || 0) > 280
                  ? 6
                  : undefined
              }
            >
              {project.deskripsi_raw}
            </Text>
            {(project.deskripsi_raw?.length || 0) > 280 ? (
              <TouchableOpacity
                style={styles.expandBriefBtn}
                onPress={() => setIsBriefExpanded(!isBriefExpanded)}
                activeOpacity={0.7}
              >
                <Text style={styles.expandBriefBtnText}>
                  {isBriefExpanded
                    ? "Sembunyikan Sebagian"
                    : "Baca Selengkapnya"}
                </Text>
                {isBriefExpanded ? (
                  <ChevronUp size={14} color={COLORS.brandIndigo} />
                ) : (
                  <ChevronDown size={14} color={COLORS.brandIndigo} />
                )}
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Standar Deliverable Scope Chips */}
          <View style={styles.deliverablesSection}>
            <Text style={styles.deliverablesSmallHeading}>
              STANDAR DELIVERABLE:
            </Text>
            <View style={styles.deliverablePillsRow}>
              <View style={styles.specChip}>
                <Palette size={12} color="#2563EB" />
                <Text style={styles.specChipText}>Aset / Berkas Sumber</Text>
              </View>
              <View style={styles.specChip}>
                <Smartphone size={12} color="#2563EB" />
                <Text style={styles.specChipText}>Deliverable Siap Pakai</Text>
              </View>
              <View style={styles.specChip}>
                <MessageSquare size={12} color="#2563EB" />
                <Text style={styles.specChipText}>Revisi Terstruktur</Text>
              </View>
            </View>
          </View>

          <View style={styles.hairlineDivider} />

          {/* Deliverable Upload Section (If Mahasiswa is Accepted Worker) */}
          {isMahasiswa && isAcceptedProposal && (
            <View style={styles.contentSection}>
              <View style={styles.submissionHeader}>
                <View style={styles.submissionIconBox}>
                  <UploadCloud size={20} color={COLORS.brandIndigo} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.submissionHeaderTitle}>
                    Hasil Pekerjaan (Deliverable)
                  </Text>
                  <Text style={styles.submissionHeaderSub}>
                    {submissions.length > 0
                      ? "Berkas berhasil diunggah & sedang direview klien"
                      : "Unggah tautan Figma, GitHub, atau Google Drive hasil karyamu"}
                  </Text>
                </View>
              </View>

              {submissions.length > 0 ? (
                <View style={styles.submittedFileList}>
                  {submissions.map((sub, idx) => (
                    <View key={sub.id || idx} style={styles.submittedFileCard}>
                      <View style={styles.fileCardTop}>
                        <Link2 size={16} color={COLORS.brandIndigo} />
                        <Text style={styles.fileUrlText} numberOfLines={1}>
                          {sub.url_berkas || "Tautan Deliverable"}
                        </Text>
                        <View style={styles.subStatusBadge}>
                          <Text style={styles.subStatusBadgeText}>
                            {formatStatus(sub.status || "SUBMITTED")}
                          </Text>
                        </View>
                      </View>
                      {renderSubmissionNote(sub.catatan_pengiriman)}
                    </View>
                  ))}

                  <TouchableOpacity
                    style={styles.reuploadBtn}
                    onPress={() => setSubmissionModal(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.reuploadBtnText}>
                      Perbarui Tautan Berkas
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadCtaBox}
                  onPress={() => setSubmissionModal(true)}
                  activeOpacity={0.88}
                >
                  <UploadCloud size={24} color={COLORS.brandIndigo} />
                  <Text style={styles.uploadCtaMain}>
                    Unggah Berkas Deliverable Sekarang
                  </Text>
                  <Text style={styles.uploadCtaSub}>
                    Kirim hasil pengerjaan untuk membuka pencairan dana escrow
                  </Text>
                </TouchableOpacity>
              )}
              <View style={styles.hairlineDivider} />
            </View>
          )}

          {/* Escrow Protection Summary Footer Note */}
          <View style={styles.escrowFooterCard}>
            <ShieldCheck size={16} color="#059669" />
            <View style={{ flex: 1 }}>
              <Text style={styles.escrowFooterTitle}>
                Proteksi Rekening Bersama (Escrow)
              </Text>
              <Text style={styles.escrowFooterDesc}>
                {isMahasiswa
                  ? "Honor Anda dijamin 100% aman tersimpan di platform dan cair otomatis setelah deliverable disetujui."
                  : "Dana Anda baru cair ke mahasiswa setelah hasil pengerjaan proyek disetujui."}
              </Text>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 4. MANAGEMENT SECTIONS                                            */}
          {/* ================================================================= */}
          {/* UMKM Owner Management */}
          {isUmkmOwner && (
            <View style={styles.managementSection}>
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  onPress={() => setActiveTab("proposals")}
                  style={[
                    styles.tabButton,
                    activeTab === "proposals" && styles.tabButtonActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "proposals" && styles.tabTextActive,
                    ]}
                  >
                    Proposal Masuk ({proposals.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setActiveTab("submission")}
                  style={[
                    styles.tabButton,
                    activeTab === "submission" && styles.tabButtonActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "submission" && styles.tabTextActive,
                    ]}
                  >
                    Hasil Deliverable ({submissions.length})
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Tab 1: Proposals List */}
              {activeTab === "proposals" && (
                <View style={styles.tabContent}>
                  {proposals.length === 0 ? (
                    <View style={styles.emptyBox}>
                      <Briefcase size={32} color={COLORS.textDim} />
                      <Text style={styles.emptyText}>
                        Belum ada proposal masuk dari mahasiswa.
                      </Text>
                    </View>
                  ) : (
                    proposals.map((prop) => (
                      <ProposalCard
                        key={prop.id}
                        proposal={prop}
                        projectSlots={project.slots}
                        isMultiSlot={
                          Boolean(project.slots && project.slots.length > 1) ||
                          project.tipe_kolaborasi === "TIM"
                        }
                        onAccept={() => handleOpenAcceptModal(prop)}
                        onReject={() => handleRejectProposal(prop.id)}
                        loadingAccept={
                          actionLoading &&
                          selectedProposalToAccept?.id === prop.id
                        }
                        loadingReject={actionLoading}
                      />
                    ))
                  )}
                </View>
              )}

              {/* Tab 2: Submission Deliverable */}
              {activeTab === "submission" && (
                <View style={styles.tabContent}>
                  {submissions.length === 0 ? (
                    <View style={styles.emptyBox}>
                      <FileCheck size={32} color={COLORS.textDim} />
                      <Text style={styles.emptyText}>
                        Mahasiswa belum mengunggah hasil deliverable.
                      </Text>
                      {isProjectExpired && (
                        <View style={styles.overdueCallout}>
                          <AlertTriangle size={14} color="#BE123C" />
                          <Text style={styles.overdueCalloutText}>
                            Tenggat pengerjaan telah terlewati. Anda dapat
                            mengganti mahasiswa dan membuka kembali proyek ke
                            katalog eksplorasi, atau membatalkan proyek.
                          </Text>
                        </View>
                      )}

                      {project?.status === "IN_PROGRESS" && (
                        <View style={{ marginTop: 14, width: "100%", gap: 8 }}>
                          <Button
                            title="Ganti Mahasiswa & Buka ke Eksplorasi"
                            variant="brand"
                            size="sm"
                            icon={<RotateCcw size={14} color="#FFF" />}
                            onPress={() => setReopenModal(true)}
                          />
                          <Button
                            title="Batalkan Proyek (Refund Escrow)"
                            variant="outline"
                            size="sm"
                            icon={<XCircle size={14} color="#BE123C" />}
                            textStyle={{ color: "#BE123C" }}
                            style={{ borderColor: "#FECACA" }}
                            onPress={() => setTerminateModal(true)}
                          />
                        </View>
                      )}
                    </View>
                  ) : (
                    submissions.map((sub) => (
                      <View key={sub.id} style={styles.submissionCard}>
                        <Text style={styles.submissionTitle}>
                          File Deliverable Proyek
                        </Text>
                        <TouchableOpacity
                          style={styles.submittedLinkBox}
                          activeOpacity={0.7}
                        >
                          <Link2 size={15} color={COLORS.brandIndigo} />
                          <Text
                            style={styles.submittedLinkText}
                            numberOfLines={1}
                          >
                            {sub.url_berkas}
                          </Text>
                        </TouchableOpacity>
                        {renderSubmissionNote(sub.catatan_pengiriman)}
                        <PebbleButton
                          variant="emerald"
                          size="md"
                          label="Setujui & Lepas Escrow"
                          icon={CheckCircle2}
                          onPress={() => handleOpenApproveModal(sub)}
                          loading={
                            actionLoading &&
                            selectedSubmissionToApprove?.id === sub.id
                          }
                          style={{ marginTop: 12, width: "100%" }}
                        />
                      </View>
                    ))
                  )}
                </View>
              )}
            </View>
          )}

          {/* Mahasiswa's Own Proposal Status */}
          {isMahasiswa && myExistingProposal && (
            <View style={styles.managementSection}>
              <View style={styles.tabContainer}>
                <View style={[styles.tabButton, styles.tabButtonActive]}>
                  <Text style={[styles.tabText, styles.tabTextActive]}>
                    {isAcceptedProposal
                      ? "Deliverable & Hasil Kerja"
                      : "Status Lamaran Anda"}
                  </Text>
                </View>
              </View>

              <View style={styles.tabContent}>
                {isAcceptedProposal ? (
                  <View style={styles.submissionCard}>
                    <Text style={styles.submissionTitle}>
                      {submissions.length > 0
                        ? "Berkas Deliverable Terkirim"
                        : "Unggah Berkas Deliverable"}
                    </Text>
                    {submissions.length > 0 ? (
                      <>
                        <TouchableOpacity
                          style={styles.submittedLinkBox}
                          activeOpacity={0.7}
                        >
                          <Link2 size={15} color={COLORS.brandIndigo} />
                          <Text
                            style={styles.submittedLinkText}
                            numberOfLines={1}
                          >
                            {submissions[0].url_berkas}
                          </Text>
                        </TouchableOpacity>
                        {renderSubmissionNote(
                          submissions[0].catatan_pengiriman,
                        )}
                        <View style={{ marginTop: 10, gap: 8 }}>
                          <Button
                            title="Perbarui Berkas Deliverable"
                            variant="outline"
                            size="sm"
                            icon={
                              <UploadCloud
                                size={15}
                                color={COLORS.brandIndigo}
                              />
                            }
                            onPress={() => setSubmissionModal(true)}
                          />
                          <Button
                            title="Ajukan Pengunduran Diri"
                            variant="outline"
                            size="sm"
                            icon={<XCircle size={14} color="#BE123C" />}
                            textStyle={{ color: "#BE123C" }}
                            style={{ borderColor: "#FECACA" }}
                            onPress={() => setResignModal(true)}
                          />
                        </View>
                      </>
                    ) : (
                      <View style={styles.emptyBox}>
                        <Clock size={28} color={COLORS.brandIndigo} />
                        <Text style={styles.emptyText}>
                          Proyek disetujui! Silakan kerjakan dan unggah tautan
                          hasil kerja (Figma / Drive) Anda.
                        </Text>
                        {isProjectExpired && (
                          <View style={styles.overdueCallout}>
                            <AlertTriangle size={14} color="#BE123C" />
                            <Text style={styles.overdueCalloutText}>
                              Tenggat pengerjaan telah terlewati. Harap segera
                              unggah hasil deliverable Anda atau ajukan
                              pengunduran diri jika Anda berhalangan melanjutkan.
                            </Text>
                          </View>
                        )}
                        <Button
                          title="Unggah Deliverable Sekarang"
                          variant="brand"
                          size="md"
                          icon={<UploadCloud size={16} color="#FFF" />}
                          onPress={() => setSubmissionModal(true)}
                          style={{ marginTop: 12 }}
                        />
                        <Button
                          title="Ajukan Pengunduran Diri"
                          variant="outline"
                          size="sm"
                          icon={<XCircle size={14} color="#BE123C" />}
                          textStyle={{ color: "#BE123C" }}
                          style={{ borderColor: "#FECACA", marginTop: 8 }}
                          onPress={() => setResignModal(true)}
                        />
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={styles.submissionCard}>
                    <Text style={styles.submissionTitle}>
                      Rencana Kerja yang Diajukan
                    </Text>
                    <Text style={styles.submissionDesc}>
                      "{myExistingProposal.cover_letter}"
                    </Text>
                    <View style={styles.proposalOfferRow}>
                      <Text style={styles.proposalOfferLabel}>
                        Tawaran Anda:
                      </Text>
                      <Text style={styles.proposalOfferValue}>
                        {formatCurrency(myExistingProposal.harga_tawar)}
                      </Text>
                    </View>
                    <View style={styles.proposalStatusRow}>
                      <Text style={styles.proposalOfferLabel}>
                        Status Seleksi:
                      </Text>
                      <Badge
                        label={
                          myExistingProposal.status === "PENDING"
                            ? "Menunggu Keputusan Klien"
                            : myExistingProposal.status === "WITHDRAWN"
                              ? "Mengundurkan Diri (Batal)"
                              : myExistingProposal.status === "REJECTED"
                                ? "Lamaran Ditolak"
                                : "Disetujui"
                        }
                        variant={
                          myExistingProposal.status === "PENDING"
                            ? "warning"
                            : myExistingProposal.status === "WITHDRAWN"
                              ? "neutral"
                              : myExistingProposal.status === "REJECTED"
                                ? "danger"
                                : "success"
                        }
                      />
                    </View>
                    {myExistingProposal.status === "WITHDRAWN" &&
                      myExistingProposal.withdraw_reason && (
                        <View style={styles.withdrawnDetailBox}>
                          <Text style={styles.withdrawnDetailLabel}>
                            Alasan Pengunduran Diri:
                          </Text>
                          <Text style={styles.withdrawnDetailText}>
                            "{myExistingProposal.withdraw_reason}"
                          </Text>
                        </View>
                      )}
                  </View>
                )}
              </View>
            </View>
          )}

          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      {/* ================================================================= */}
      {/* 5. PERSISTENT STICKY BOTTOM ACTION DOCK                           */}
      {/* ================================================================= */}
      <View style={styles.stickyBottomBar}>
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            },
            responsiveContainerStyle,
          ]}
        >
          <View style={styles.stickyPriceCol}>
            <Text style={styles.stickyPriceLabel}>PAGU ANGGARAN</Text>
            <Text style={styles.stickyPriceValue}>
              {formatCurrency(project.budget_max)}
            </Text>
          </View>

          {hasAcceptedStudent && (
            <TouchableOpacity
              style={styles.stickyChatBtn}
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
              <MessageSquare size={18} color={COLORS.brandIndigo} />
            </TouchableOpacity>
          )}

          <View style={styles.stickyActionCol}>
            {canApply ? (
              <PebbleButton
                variant="sapphire"
                label="Ajukan Lamaran"
                icon={Send}
                onPress={() => {
                  if (
                    isMahasiswa &&
                    (!user?.nim || (!user?.prodi_id && !user?.prodi))
                  ) {
                    showConfirm({
                      title: "Lengkapi Profil Anda",
                      message:
                        "Tambahkan NIM dan Program Studi pada profil Anda terlebih dahulu agar klien UMKM dapat meninjau keabsahan dan keahlian Anda.",
                      confirmText: "Lengkapi Sekarang",
                      cancelText: "Nanti Saja",
                      onConfirm: () => navigation.navigate("Profile"),
                    });
                    return;
                  }
                  setProposalModal(true);
                }}
              />
            ) : myExistingProposal ? (
              <View style={styles.alreadyAppliedPill}>
                <CheckCircle2 size={15} color={COLORS.success} />
                <Text style={styles.alreadyAppliedText}>
                  {isAcceptedProposal
                    ? "Lamaran Disetujui"
                    : myExistingProposal.status === "WITHDRAWN"
                      ? "Lamaran Dibatalkan"
                      : myExistingProposal.status === "REJECTED"
                        ? "Lamaran Ditolak"
                        : "Lamaran Terkirim"}
                </Text>
              </View>
            ) : isUmkmOwner ? (
              <TouchableOpacity
                style={styles.umkmManageBtn}
                onPress={() => setActiveTab("proposals")}
                activeOpacity={0.8}
              >
                <Users size={16} color="#FFFFFF" />
                <Text style={styles.primaryApplyBtnText}>
                  Kelola ({proposals.length})
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.closedStatusPill}>
                <Clock size={14} color={COLORS.textMuted} />
                <Text style={styles.closedStatusText}>
                  {formatStatus(project.status || "CLOSED")}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },

  // Apple Glossy Hero Card
  appleHeroCard: {
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.95)",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.9)"
        : "rgba(255, 255, 255, 0.95)",
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  appleTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  appleBadgeGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    flex: 1,
    marginRight: 8,
  },
  categoryChip: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  categoryChipText: {
    fontFamily: FONTS.displayBold,
    fontSize: 10.5,
    color: "#4338CA",
    letterSpacing: 0.4,
    fontWeight: "700",
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5.5,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statusDot: {
    width: 6.5,
    height: 6.5,
    borderRadius: 3.25,
  },
  statusChipText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10.5,
    color: "#1E293B",
    fontWeight: "700",
  },
  appleInvoiceBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4.5,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 11,
    paddingVertical: 5.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(37, 99, 235, 0.15)",
    flexShrink: 0,
  },
  appleInvoiceBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#2563EB",
    fontWeight: "700",
  },

  projectHeadline: {
    fontFamily: FONTS.displayBold,
    fontSize: 21,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 29,
    letterSpacing: -0.4,
    marginBottom: 14,
  },

  // Client Profile Byline
  clientBylineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  clientAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  clientInfoCol: {
    flex: 1,
  },
  clientNameVerifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  clientNameText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
    flexShrink: 1,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6.5,
    paddingVertical: 1.5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  verifiedBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    color: "#059669",
    fontWeight: "700",
  },
  clientLocationText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
  },

  cardInternalDivider: {
    height: 1,
    backgroundColor: "rgba(226, 232, 240, 0.7)",
    marginVertical: 14,
  },

  keyMetricsGrid: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
  },
  metricColumn: {
    flex: 1,
  },
  metricDividerVertical: {
    width: 1,
    height: 36,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 16,
  },
  metricLabel: {
    fontFamily: FONTS.displayBold,
    fontSize: 9.5,
    color: "#64748B",
    letterSpacing: 0.6,
    fontWeight: "700",
    marginBottom: 4,
  },
  metricValuePrimary: {
    fontFamily: FONTS.displayBold,
    fontSize: 19,
    color: "#1E40AF",
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  metricValueSecondary: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "700",
  },
  metricValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  escrowTrustStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 14,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 11,
    paddingVertical: 7.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  escrowTrustText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11.5,
    color: "#15803D",
    flex: 1,
    lineHeight: 16,
  },
  matchScoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 8,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 11,
    paddingVertical: 7.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  matchScoreText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: "#065F46",
    flex: 1,
  },
  matchScoreBold: {
    fontWeight: "700",
    color: "#047857",
  },

  stepperWrapper: {
    marginBottom: 12,
  },

  hairlineDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 16,
  },

  contentSection: {
    marginBottom: 12,
  },
  sectionHeading: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 9,
    letterSpacing: -0.2,
  },
  sectionSubHeading: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: "#64748B",
    marginBottom: 10,
  },
  sectionHeaderWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  briefParagraph: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    color: "#334155",
    lineHeight: 23,
  },
  expandBriefBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
    alignSelf: "flex-start",
    paddingVertical: 5,
  },
  expandBriefBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },

  deliverablesSection: {
    marginTop: 4,
  },
  deliverablesSmallHeading: {
    fontFamily: FONTS.displayBold,
    fontSize: 10,
    color: "#64748B",
    letterSpacing: 0.6,
    fontWeight: "700",
    marginBottom: 8,
  },
  deliverablePillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  specChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5.5,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  specChipText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11.5,
    color: "#334155",
    fontWeight: "600",
  },

  // Team Slots
  teamSlotsList: {
    gap: 8,
  },
  teamSlotItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  teamSlotItemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  teamSlotItemRole: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  teamSlotItemBudget: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.brandIndigo,
    marginTop: 1,
  },
  teamSlotStatusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  teamSlotStatusTagOpen: {
    backgroundColor: "#ECFDF5",
  },
  teamSlotStatusTagActive: {
    backgroundColor: "#EFF6FF",
  },
  teamSlotStatusTagDone: {
    backgroundColor: "#F1F5F9",
  },
  teamSlotStatusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  teamSlotStatusTextOpen: {
    color: "#059669",
  },
  teamSlotStatusTextActive: {
    color: "#2563EB",
  },
  teamSlotStatusTextDone: {
    color: "#64748B",
  },
  teamSlotItemDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
    marginTop: 2,
  },
  assignedMhsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  assignedMhsText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    fontWeight: "600",
    color: "#065F46",
  },

  // Open Chat Bar
  openChatBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.brandIndigoLight,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.2)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  openChatBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  chatPartnerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.2)",
  },
  chatIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.brandIndigo,
    alignItems: "center",
    justifyContent: "center",
  },
  openChatTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  openChatSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },

  // Deliverable Submissions
  submissionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  submissionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  submissionHeaderTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  submissionHeaderSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  uploadCtaBox: {
    borderWidth: 1.5,
    borderColor: COLORS.brandIndigo,
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.brandIndigoLight,
  },
  uploadCtaMain: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.brandIndigo,
    marginTop: 6,
  },
  uploadCtaSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 2,
  },
  submittedFileList: {
    gap: 8,
  },
  submittedFileCard: {
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  fileCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fileUrlText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.brandIndigo,
    flex: 1,
  },
  subStatusBadge: {
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  subStatusBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.brandIndigo,
  },
  reuploadBtn: {
    paddingVertical: 8,
    alignItems: "center",
  },
  reuploadBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.brandIndigo,
  },

  // Escrow Footer Card
  escrowFooterCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
  },
  escrowFooterTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12.5,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 3,
  },
  escrowFooterDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: "#475569",
    lineHeight: 17,
  },

  // Cancellation Audit Card
  cancellationAuditCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 14,
    gap: 10,
  },
  cancellationAuditHeader: {
    gap: 6,
  },
  cancellationAuditBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  cancellationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cancellationBadgeText: {
    fontFamily: FONTS.displayBold,
    fontSize: 11,
    fontWeight: "700",
    color: "#991B1B",
  },
  refundEscrowBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  refundEscrowBadgeText: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 11,
    fontWeight: "600",
    color: "#065F46",
  },
  cancellationTimeText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "#991B1B",
  },
  cancellationReasonBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  cancellationReasonLabel: {
    fontFamily: FONTS.displayBold,
    fontSize: 10,
    fontWeight: "700",
    color: "#7F1D1D",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cancellationReasonQuote: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "#450A0A",
    fontStyle: "italic",
    lineHeight: 17,
  },

  // Management Section
  managementSection: {
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.bgSurfaceSubtle,
    borderRadius: 14,
    padding: 3,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 11,
  },
  tabButtonActive: {
    backgroundColor: COLORS.bgSurface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textMuted,
  },
  tabTextActive: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.textDark,
    fontWeight: "700",
  },
  tabContent: {
    gap: 10,
  },
  emptyBox: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.bgSurface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  emptyText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
    textAlign: "center",
  },
  submissionCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  submissionTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 6,
  },
  submissionDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  submittedLinkBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.canvasSoft,
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  submittedLinkText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.brandIndigo,
    flex: 1,
  },
  proposalOfferRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark,
  },
  proposalOfferLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  proposalOfferValue: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  proposalStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  withdrawnDetailBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  withdrawnDetailLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 2,
  },
  withdrawnDetailText: {
    fontSize: 11,
    fontStyle: "italic",
    color: "#334155",
  },
  overdueCallout: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#FFF1F2",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FECDD3",
    marginTop: 10,
    marginBottom: 6,
    width: "100%",
  },
  overdueCalloutText: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#9F1239",
    lineHeight: 16,
  },

  // Persistent Sticky Bottom Action Bar
  stickyBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.97)",
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 232, 240, 0.85)",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  stickyPriceCol: {
    flex: 1,
  },
  stickyPriceLabel: {
    fontFamily: FONTS.displayBold,
    fontSize: 10,
    color: "#64748B",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  stickyPriceValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    fontWeight: "800",
    color: "#1E40AF",
    letterSpacing: -0.3,
  },
  stickyActionCol: {
    flex: 1.4,
    alignItems: "flex-end",
  },
  stickyChatBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.brandIndigoLight,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  alreadyAppliedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.successBg,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  alreadyAppliedText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.success,
    fontWeight: "700",
  },
  umkmManageBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.brandIndigoDark,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    width: "100%",
  },
  primaryApplyBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  closedStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.canvasSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  closedStatusText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
