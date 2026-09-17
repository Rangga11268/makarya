import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { PebbleButton } from "../../../components/ui/PebbleButton";
import { ProposalCard } from "../../../components/features/ProposalCard";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import { formatStatus } from "../../../utils/formatStatus";
import {
  ShieldCheck,
  Calendar,
  Building2,
  CheckCircle2,
  FileCheck,
  Link2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Users,
  Send,
  Clock,
  Briefcase,
  Coins,
  Check,
  FileText,
  XCircle,
  Sparkles,
  Award,
  Layers,
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
  submissions = [],
  proposals = [],
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
  if (!project) return null;

  const isTeam = project.tipe_kolaborasi === "TIM";
  const slots = Array.isArray(project.slots) ? project.slots : [];
  const rawDescription =
    project.deskripsi_formatted ||
    project.deskripsi_raw ||
    project.deskripsi ||
    "";

  const isLongDescription = rawDescription.length > 280;

  // 1. AI Match Calculations & Reasons
  const matchScore =
    typeof project.match_score === "number"
      ? Math.round(project.match_score)
      : project.match_score
        ? Math.round(Number(project.match_score))
        : 0;

  const matchReasons = Array.isArray(project.match_reasons)
    ? project.match_reasons
    : [];

  // 2. Skills Fallback Helper
  const getCategorySkills = (cat) => {
    const c = String(cat || "").toUpperCase();
    switch (c) {
      case "DESIGN":
        return ["Figma", "Adobe Illustrator", "Branding Visual", "Canva"];
      case "UIUX":
        return ["Figma", "Wireframing", "User Flow", "Prototyping"];
      case "PEMROGRAMAN":
        return [
          "React Native",
          "API Integration",
          "JavaScript / TypeScript",
          "Git Workflow",
        ];
      case "VIDEO":
        return [
          "CapCut / Premiere",
          "Video Editing",
          "Reels & TikTok",
          "Storyboarding",
        ];
      case "COPYWRITING":
        return [
          "SEO Writing",
          "Copywriting Produk",
          "Social Media Content",
          "Bahasa Indonesia",
        ];
      case "ADMIN_DATA":
        return [
          "Microsoft Excel",
          "Google Sheets",
          "Data Entry",
          "Ketelitian Data",
        ];
      default:
        return [
          "Komunikasi Tim",
          "Manajemen Waktu",
          "Kreativitas",
          "Eksekusi Tepat Waktu",
        ];
    }
  };

  const skillsList =
    Array.isArray(project.ai_requirements) && project.ai_requirements.length > 0
      ? project.ai_requirements
          .map((r) => r?.skill?.nama_skill || r?.nama_skill)
          .filter(Boolean)
      : Array.isArray(project.skills) && project.skills.length > 0
        ? project.skills
            .map((s) => (typeof s === "string" ? s : s?.nama_skill || s?.name))
            .filter(Boolean)
        : getCategorySkills(project.kategori);

  const totalApplicantsCount =
    typeof project.total_pelamar === "number"
      ? project.total_pelamar
      : proposals.length || 0;

  const handleOpenChat = () => {
    navigation.navigate("Chat", {
      projectId: project.id,
      projectTitle: project.judul,
      partnerName: activePartnerName || clientDisplayName || "Mitra Klien UMKM",
      partnerPhoto: activePartnerPhoto || clientPhoto,
      partnerRole: isUmkmOwner ? "MHS" : "UMKM",
    });
  };

  return (
    <View style={styles.rootContainer}>
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
          {/* 1. PROJECT HERO CARD                                              */}
          {/* ================================================================= */}
          <View style={styles.headerCard}>
            {/* Category & Status Badges */}
            <View style={styles.badgeRow}>
              <View style={styles.categoryPill}>
                <Briefcase size={11} color="#475569" />
                <Text style={styles.categoryPillText}>
                  {project.kategori
                    ? String(project.kategori).toUpperCase()
                    : "UMKM DIGITAL"}
                </Text>
              </View>

              <View
                style={[
                  styles.statusPill,
                  project.status === "IN_PROGRESS"
                    ? styles.statusPillProgress
                    : project.status === "COMPLETED" ||
                        project.status === "DONE"
                      ? styles.statusPillDone
                      : styles.statusPillOpen,
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    project.status === "IN_PROGRESS"
                      ? styles.statusDotProgress
                      : project.status === "COMPLETED" ||
                          project.status === "DONE"
                        ? styles.statusDotDone
                        : styles.statusDotOpen,
                  ]}
                />
                <Text
                  style={[
                    styles.statusPillText,
                    project.status === "IN_PROGRESS"
                      ? styles.statusPillTextProgress
                      : project.status === "COMPLETED" ||
                          project.status === "DONE"
                        ? styles.statusPillTextDone
                        : styles.statusPillTextOpen,
                  ]}
                >
                  {project.status === "OPEN" || project.status === "BIDDING"
                    ? isTeam
                      ? "Merekrut Tim"
                      : "Merekrut Talenta"
                    : formatStatus(project.status || "OPEN")}
                </Text>
              </View>
            </View>

            {/* Project Title */}
            <Text style={styles.projectTitle}>{project.judul}</Text>

            {/* Meta Row: Published Date & Total Applicants */}
            <View style={styles.metaSubRow}>
              <View style={styles.publishedRow}>
                <Calendar size={12} color="#64748B" />
                <Text style={styles.publishedText}>
                  Diterbitkan {formatDate(project.created_at || new Date())}
                </Text>
              </View>

              <View style={styles.applicantBadge}>
                <Users size={11} color="#2563EB" />
                <Text style={styles.applicantBadgeText}>
                  {totalApplicantsCount} Pelamar
                </Text>
              </View>
            </View>

            {/* Responsive 2-Row Key Metrics Container */}
            <View style={styles.metricsContainer}>
              {/* Highlight Row: Budget */}
              <View style={styles.metricHighlightRow}>
                <View style={styles.metricIconWrapperEmerald}>
                  <Coins size={15} color="#059669" />
                </View>
                <View style={styles.metricHighlightContent}>
                  <Text style={styles.metricHighlightLabel}>PAGU ANGGARAN</Text>
                  <Text style={styles.metricHighlightValue} numberOfLines={1}>
                    {formatCurrency(project.budget_max)}
                  </Text>
                </View>
              </View>

              {/* Sub-row: Deadline & Collaboration */}
              <View style={styles.metricSubRow}>
                <View style={styles.metricSubItem}>
                  <View style={styles.metricIconWrapperBlue}>
                    <Calendar size={13} color="#2563EB" />
                  </View>
                  <View style={styles.metricSubTextWrap}>
                    <Text style={styles.metricSubLabel}>TENGGAT WAKTU</Text>
                    <Text style={styles.metricSubValue} numberOfLines={1}>
                      {formatDate(project.deadline)}
                    </Text>
                  </View>
                </View>

                <View style={styles.metricSubDivider} />

                <View style={styles.metricSubItem}>
                  <View style={styles.metricIconWrapperSlate}>
                    <Users size={13} color="#475569" />
                  </View>
                  <View style={styles.metricSubTextWrap}>
                    <Text style={styles.metricSubLabel}>KOLABORASI</Text>
                    <Text style={styles.metricSubValue} numberOfLines={1}>
                      {isTeam ? `Tim (${slots.length})` : "Individu"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Escrow Guarantee Banner */}
            <View style={styles.escrowBanner}>
              <ShieldCheck size={16} color="#059669" />
              <Text style={styles.escrowBannerText}>
                Garansi Escrow 100%. Dana honor tersimpan aman di rekening resmi
                Makarya.
              </Text>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 2. AI MATCH & COMPATIBILITY CARD (FOR MAHASISWA)                  */}
          {/* ================================================================= */}
          {isMahasiswa && (matchScore > 0 || matchReasons.length > 0) && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Sparkles size={16} color="#2563EB" />
                <Text style={styles.sectionTitle}>Kecocokan Profil Anda</Text>
                <View style={styles.aiScoreBadge}>
                  <Text style={styles.aiScoreText}>{matchScore || 85}% Cocok</Text>
                </View>
              </View>

              <Text style={styles.aiMatchDesc}>
                Sistem analisis Makarya mencocokkan profil dan bidang keahlian Anda
                dengan spesifikasi proyek ini:
              </Text>

              <View style={styles.aiReasonsList}>
                {matchReasons.length > 0 ? (
                  matchReasons.map((reason, idx) => (
                    <View key={idx} style={styles.aiReasonItem}>
                      <CheckCircle2 size={13} color="#2563EB" style={{ marginTop: 2 }} />
                      <Text style={styles.aiReasonText}>{reason}</Text>
                    </View>
                  ))
                ) : (
                  <>
                    <View style={styles.aiReasonItem}>
                      <CheckCircle2 size={13} color="#2563EB" style={{ marginTop: 2 }} />
                      <Text style={styles.aiReasonText}>
                        Keahlian dan program studi Anda relevan dengan lingkup proyek ini.
                      </Text>
                    </View>
                    <View style={styles.aiReasonItem}>
                      <CheckCircle2 size={13} color="#2563EB" style={{ marginTop: 2 }} />
                      <Text style={styles.aiReasonText}>
                        Peluang optimal diterima sebagai mitra talenta digital UMKM.
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          )}

          {/* ================================================================= */}
          {/* 3. REQUIRED SKILLS & TECH STACK                                   */}
          {/* ================================================================= */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Layers size={16} color="#2563EB" />
              <Text style={styles.sectionTitle}>Keahlian yang Dibutuhkan</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Keahlian dan perangkat lunak pendukung yang direkomendasikan:
            </Text>

            <View style={styles.skillsWrapper}>
              {skillsList.map((skill, sIdx) => (
                <View key={sIdx} style={styles.skillChip}>
                  <Check size={11} color="#2563EB" />
                  <Text style={styles.skillChipText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ================================================================= */}
          {/* 4. SCOPE OF WORK & EXPECTED DELIVERABLES                          */}
          {/* ================================================================= */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <FileText size={16} color="#2563EB" />
              <Text style={styles.sectionTitle}>
                Deskripsi & Lingkup Pengerjaan
              </Text>
            </View>

            <View style={styles.descriptionWrap}>
              <Text
                style={styles.descriptionText}
                numberOfLines={
                  isLongDescription && !isBriefExpanded ? 6 : undefined
                }
              >
                {rawDescription ||
                  "Tidak ada rincian catatan tambahan dari klien."}
              </Text>

              {isLongDescription && (
                <TouchableOpacity
                  onPress={() => setIsBriefExpanded(!isBriefExpanded)}
                  style={styles.expandBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.expandBtnText}>
                    {isBriefExpanded
                      ? "Tampilkan Lebih Sedikit"
                      : "Baca Selengkapnya"}
                  </Text>
                  {isBriefExpanded ? (
                    <ChevronUp size={14} color="#2563EB" />
                  ) : (
                    <ChevronDown size={14} color="#2563EB" />
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Expected Output & Collaboration Guidelines */}
            <View style={styles.guidelineBox}>
              <Text style={styles.guidelineTitle}>Ketentuan & Format Luaran:</Text>
              <View style={styles.guidelineRow}>
                <CheckCircle2 size={13} color="#059669" style={{ marginTop: 2 }} />
                <Text style={styles.guidelineText}>
                  Format Berkas: Tautan Google Drive, Figma, GitHub, atau Dokumen resmi.
                </Text>
              </View>
              <View style={styles.guidelineRow}>
                <CheckCircle2 size={13} color="#059669" style={{ marginTop: 2 }} />
                <Text style={styles.guidelineText}>
                  Batas Revisi: Maksimal 2x penyesuaian minor setelah draft pertama dikirim.
                </Text>
              </View>
              <View style={styles.guidelineRow}>
                <CheckCircle2 size={13} color="#059669" style={{ marginTop: 2 }} />
                <Text style={styles.guidelineText}>
                  Komunikasi Terbuka: Koordinasi langsung melalui fitur Chat in-app Makarya.
                </Text>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 5. TEAM SLOTS BREAKDOWN (IF TEAM COLLABORATION)                   */}
          {/* ================================================================= */}
          {isTeam && slots.length > 0 && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Users size={16} color="#2563EB" />
                <Text style={styles.sectionTitle}>
                  Formasi Peran Tim ({slots.length} Posisi)
                </Text>
              </View>
              <Text style={styles.sectionSubtitle}>
                Pilih peran spesifik yang sesuai dengan keahlian Anda:
              </Text>

              <View style={styles.slotsContainer}>
                {slots.map((s, idx) => {
                  const isSlotOpen = s.status === "OPEN";
                  const isSlotDone = s.status === "COMPLETED";

                  return (
                    <View key={s.id || idx} style={styles.slotCard}>
                      <View style={styles.slotTopRow}>
                        <View style={{ flex: 1, paddingRight: 8 }}>
                          <Text style={styles.slotRoleName}>
                            {s.nama_peran}
                          </Text>
                          <Text style={styles.slotBudgetText}>
                            Alokasi Honor: {formatCurrency(s.alokasi_budget)}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.slotStatusBadge,
                            isSlotOpen
                              ? styles.slotStatusBadgeOpen
                              : isSlotDone
                                ? styles.slotStatusBadgeDone
                                : styles.slotStatusBadgeFilled,
                          ]}
                        >
                          <Text
                            style={[
                              styles.slotStatusText,
                              isSlotOpen
                                ? styles.slotStatusTextOpen
                                : isSlotDone
                                  ? styles.slotStatusTextDone
                                  : styles.slotStatusTextFilled,
                            ]}
                          >
                            {isSlotOpen
                              ? "Posisi Terbuka"
                              : isSlotDone
                                ? "Selesai"
                                : "Terisi"}
                          </Text>
                        </View>
                      </View>

                      {s.deskripsi_tugas || s.deskripsi ? (
                        <Text style={styles.slotDescriptionText}>
                          {s.deskripsi_tugas || s.deskripsi}
                        </Text>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* ================================================================= */}
          {/* 6. CLIENT UMKM PROFILE & REPUTATION CARD                          */}
          {/* ================================================================= */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Building2 size={16} color="#2563EB" />
              <Text style={styles.sectionTitle}>Tentang Klien UMKM</Text>
            </View>

            <View style={styles.clientProfileRow}>
              {clientPhoto ? (
                <Image
                  source={{ uri: clientPhoto }}
                  style={styles.clientAvatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.clientAvatarFallback}>
                  <Building2
                    size={20}
                    color="#2563EB"
                  />
                </View>
              )}

              <View style={styles.clientInfoCol}>
                <Text
                  style={styles.clientNameText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {clientDisplayName}
                </Text>
                <View style={styles.clientMetaRow}>
                  <View style={styles.verifiedTag}>
                    <ShieldCheck size={10} color="#059669" strokeWidth={2.5} />
                    <Text style={styles.verifiedTagText}>Terverifikasi</Text>
                  </View>
                  <Text style={styles.clientMetaDot}>•</Text>
                  <Text
                    style={styles.locationText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {project.umkm_profile?.bidang_industri || "Mitra UMKM"} • {project.lokasi || project.umkm_profile?.kota || "Indonesia"}
                  </Text>
                </View>
              </View>

              <PebbleButton
                variant="ice"
                size="sm"
                label="Tanya"
                icon={MessageSquare}
                onPress={handleOpenChat}
              />
            </View>

            {/* Client Trust Indicator Pills */}
            <View style={styles.clientTrustRow}>
              <View style={styles.trustItem}>
                <ShieldCheck size={12} color="#059669" />
                <Text style={styles.trustItemText}>Dana Escrow 100% Didanai</Text>
              </View>
              <View style={styles.trustItem}>
                <Clock size={12} color="#2563EB" />
                <Text style={styles.trustItemText}>Komunikasi Responsif</Text>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 7. TALENT BENEFITS & VERIFIED CERTIFICATION                       */}
          {/* ================================================================= */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Award size={16} color="#2563EB" />
              <Text style={styles.sectionTitle}>
                Jaminan & Keuntungan Mahasiswa
              </Text>
            </View>

            <View style={styles.benefitItemsWrap}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIconBoxEmerald}>
                  <ShieldCheck size={15} color="#059669" />
                </View>
                <View style={styles.benefitTextBox}>
                  <Text style={styles.benefitItemTitle}>100% Jaminan Escrow</Text>
                  <Text style={styles.benefitItemDesc}>
                    Dana honor Anda telah diamankan di sistem Makarya sebelum pengerjaan dimulai dan dicairkan segera setelah pekerjaan disetujui.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <View style={styles.benefitIconBoxBlue}>
                  <Award size={15} color="#2563EB" />
                </View>
                <View style={styles.benefitTextBox}>
                  <Text style={styles.benefitItemTitle}>E-Sertifikat Digital Resmi</Text>
                  <Text style={styles.benefitItemDesc}>
                    Otomatis mendapatkan sertifikat ber-QR terverifikasi bertanda tangan digital UMKM untuk portofolio & konversi SKPI kampus.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 8. CANCELLATION DETAILS (IF CANCELLED)                            */}
          {/* ================================================================= */}
          {project.status === "CANCELLED" && (
            <View style={styles.cancelledCard}>
              <View style={styles.cancelledHeader}>
                <XCircle size={16} color="#DC2626" />
                <Text style={styles.cancelledTitle}>
                  Proyek Telah Dibatalkan
                </Text>
              </View>
              <Text style={styles.cancelledDesc}>
                {project.cancel_reason
                  ? `Catatan: "${project.cancel_reason}"`
                  : "Proyek ini telah dibatalkan secara resmi dan 100% saldo escrow telah dikembalikan ke rekening pemilik."}
              </Text>
            </View>
          )}

          {/* ================================================================= */}
          {/* 9. MANAGEMENT FOR UMKM OWNER                                      */}
          {/* ================================================================= */}
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
                    Deliverable ({submissions.length})
                  </Text>
                </TouchableOpacity>
              </View>

              {activeTab === "proposals" && (
                <View style={styles.tabContent}>
                  {proposals.length === 0 ? (
                    <View style={styles.emptyBox}>
                      <Clock size={28} color="#94A3B8" />
                      <Text style={styles.emptyText}>
                        Belum ada proposal lamaran yang masuk dari mahasiswa.
                      </Text>
                    </View>
                  ) : (
                    proposals.map((prop) => (
                      <ProposalCard
                        key={prop.id}
                        proposal={prop}
                        projectSlots={project.slots}
                        isMultiSlot={isTeam}
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

              {activeTab === "submission" && (
                <View style={styles.tabContent}>
                  {submissions.length === 0 ? (
                    <View style={styles.emptyBox}>
                      <FileCheck size={28} color="#94A3B8" />
                      <Text style={styles.emptyText}>
                        Mahasiswa belum mengirimkan berkas deliverable
                        pengerjaan.
                      </Text>
                    </View>
                  ) : (
                    submissions.map((sub) => (
                      <View key={sub.id} style={styles.submissionCard}>
                        <Text style={styles.submissionTitle}>
                          Berkas Deliverable Proyek
                        </Text>
                        <View style={styles.submittedLinkBox}>
                          <Link2 size={14} color="#2563EB" />
                          <Text
                            style={styles.submittedLinkText}
                            numberOfLines={1}
                          >
                            {sub.url_berkas}
                          </Text>
                        </View>
                        {renderSubmissionNote &&
                          renderSubmissionNote(sub.catatan_pengiriman)}
                        <PebbleButton
                          variant="emerald"
                          size="sm"
                          label="Setujui & Lepas Escrow"
                          icon={CheckCircle2}
                          onPress={() => handleOpenApproveModal(sub)}
                          loading={
                            actionLoading &&
                            selectedSubmissionToApprove?.id === sub.id
                          }
                          style={{ marginTop: 10 }}
                        />
                      </View>
                    ))
                  )}
                </View>
              )}
            </View>
          )}

          {/* ================================================================= */}
          {/* 10. MAHASISWA APPLIED STATUS BANNER                               */}
          {/* ================================================================= */}
          {isMahasiswa && myExistingProposal && (
            <View style={styles.appliedStatusCard}>
              <View style={styles.appliedStatusHeader}>
                <CheckCircle2 size={16} color="#059669" />
                <Text style={styles.appliedStatusTitle}>
                  Status Lamaran Anda
                </Text>
              </View>

              <Text style={styles.appliedCoverLetterText}>
                "{myExistingProposal.cover_letter}"
              </Text>

              <View style={styles.appliedMetaRow}>
                <Text style={styles.appliedMetaLabel}>Tawaran Harga:</Text>
                <Text style={styles.appliedMetaValue}>
                  {formatCurrency(myExistingProposal.harga_tawar)}
                </Text>
              </View>

              <View style={styles.appliedMetaRow}>
                <Text style={styles.appliedMetaLabel}>Status:</Text>
                <Text style={styles.appliedStatusBadgeText}>
                  {myExistingProposal.status === "PENDING"
                    ? "Menunggu Keputusan Klien"
                    : myExistingProposal.status === "ACCEPTED"
                      ? "Lamaran Diterima"
                      : myExistingProposal.status === "REJECTED"
                        ? "Lamaran Ditolak"
                        : formatStatus(myExistingProposal.status)}
                </Text>
              </View>
            </View>
          )}

          {/* Bottom spacer for sticky bar */}
          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      {/* ===================================================================== */}
      {/* 11. PERSISTENT STICKY BOTTOM ACTION BAR                               */}
      {/* ===================================================================== */}
      <View style={styles.stickyBottomBar}>
        <View style={styles.stickyContentRow}>
          <View style={styles.stickyPriceCol}>
            <Text style={styles.stickyPriceLabel}>PAGU ANGGARAN</Text>
            <Text style={styles.stickyPriceValue}>
              {formatCurrency(project.budget_max)}
            </Text>
          </View>

          <View style={styles.stickyActionCol}>
            {canApply ? (
              <PebbleButton
                variant="sapphire"
                size="md"
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
                        "Tambahkan NIM dan Program Studi pada profil Anda terlebih dahulu agar klien UMKM dapat meninjau data Anda.",
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
              <View style={styles.appliedPill}>
                <CheckCircle2 size={14} color="#059669" />
                <Text style={styles.appliedPillText}>
                  {isAcceptedProposal
                    ? "Lamaran Disetujui"
                    : myExistingProposal.status === "REJECTED"
                      ? "Lamaran Ditolak"
                      : "Lamaran Terkirim"}
                </Text>
              </View>
            ) : isUmkmOwner ? (
              <PebbleButton
                variant="pearl"
                size="sm"
                label={`${proposals.length} Pelamar`}
                icon={Users}
                onPress={() => setActiveTab("proposals")}
              />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },

  /* 1. Header Card */
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 18,
    marginBottom: 14,
    gap: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 8,
  },
  categoryPillText: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyBold,
    color: "#334155",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 8,
  },
  statusPillOpen: {
    backgroundColor: "#ECFDF5",
  },
  statusPillProgress: {
    backgroundColor: "#EFF6FF",
  },
  statusPillDone: {
    backgroundColor: "#F1F5F9",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotOpen: {
    backgroundColor: "#059669",
  },
  statusDotProgress: {
    backgroundColor: "#2563EB",
  },
  statusDotDone: {
    backgroundColor: "#64748B",
  },
  statusPillText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    fontWeight: "600",
  },
  statusPillTextOpen: {
    color: "#059669",
  },
  statusPillTextProgress: {
    color: "#2563EB",
  },
  statusPillTextDone: {
    color: "#64748B",
  },
  projectTitle: {
    fontSize: 18.5,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "800",
    lineHeight: 25,
    marginTop: 2,
  },
  metaSubRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  publishedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  publishedText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
  },
  applicantBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  applicantBadgeText: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyBold,
    color: "#2563EB",
    fontWeight: "700",
  },

  /* Metrics Grid */
  metricsContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 10,
    gap: 8,
    marginTop: 2,
  },
  metricHighlightRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
  },
  metricIconWrapperEmerald: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  metricHighlightContent: {
    flex: 1,
  },
  metricHighlightLabel: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyBold,
    color: "#64748B",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  metricHighlightValue: {
    fontSize: 16,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "800",
    marginTop: 1,
  },
  metricSubRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  metricSubItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  },
  metricIconWrapperBlue: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  metricIconWrapperSlate: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  metricSubTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  metricSubLabel: {
    fontSize: 9,
    fontFamily: FONTS.bodyBold,
    color: "#64748B",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  metricSubValue: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: "#334155",
    fontWeight: "700",
    marginTop: 1,
  },
  metricSubDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 8,
  },
  escrowBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  escrowBannerText: {
    flex: 1,
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#166534",
    lineHeight: 15,
  },

  /* 2. AI Match Card */
  aiScoreBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: "auto",
  },
  aiScoreText: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyBold,
    color: "#2563EB",
    fontWeight: "800",
  },
  aiMatchDesc: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyRegular,
    color: "#475569",
    lineHeight: 17,
  },
  aiReasonsList: {
    gap: 6,
    marginTop: 2,
  },
  aiReasonItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  aiReasonText: {
    flex: 1,
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#334155",
    lineHeight: 16,
  },

  /* Common Section Card */
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 14,
    gap: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
    marginTop: -4,
  },

  /* 3. Skills Chips */
  skillsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 2,
  },
  skillChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  skillChipText: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyBold,
    color: "#334155",
    fontWeight: "600",
  },

  /* 4. Description & Guidelines */
  descriptionWrap: {
    gap: 8,
  },
  descriptionText: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyRegular,
    color: "#334155",
    lineHeight: 20,
  },
  expandBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingVertical: 4,
  },
  expandBtnText: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: "#2563EB",
    fontWeight: "700",
  },
  guidelineBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 6,
    marginTop: 4,
  },
  guidelineTitle: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
    marginBottom: 2,
  },
  guidelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  guidelineText: {
    flex: 1,
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#475569",
    lineHeight: 16,
  },

  /* 5. Team Slots */
  slotsContainer: {
    gap: 10,
    marginTop: 4,
  },
  slotCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    gap: 6,
  },
  slotTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  slotRoleName: {
    fontSize: 13.5,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  slotBudgetText: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyRegular,
    color: "#059669",
    fontWeight: "600",
    marginTop: 2,
  },
  slotStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  slotStatusBadgeOpen: {
    backgroundColor: "#ECFDF5",
  },
  slotStatusBadgeFilled: {
    backgroundColor: "#EFF6FF",
  },
  slotStatusBadgeDone: {
    backgroundColor: "#F1F5F9",
  },
  slotStatusText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    fontWeight: "700",
  },
  slotStatusTextOpen: {
    color: "#059669",
  },
  slotStatusTextFilled: {
    color: "#2563EB",
  },
  slotStatusTextDone: {
    color: "#64748B",
  },
  slotDescriptionText: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyRegular,
    color: "#475569",
    lineHeight: 17,
  },

  /* 6. Client UMKM Profile */
  clientProfileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  clientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
  },
  clientAvatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  clientInfoCol: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  clientNameText: {
    fontSize: 14.5,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  clientMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 3,
  },
  verifiedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedTagText: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyBold,
    color: "#059669",
    fontWeight: "700",
  },
  clientMetaDot: {
    fontSize: 10,
    color: "#94A3B8",
  },
  locationText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
    flexShrink: 1,
  },
  clientTrustRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  trustItemText: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyBold,
    color: "#475569",
    fontWeight: "600",
  },

  /* 7. Benefits Card */
  benefitItemsWrap: {
    gap: 10,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  benefitIconBoxEmerald: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  benefitIconBoxBlue: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  benefitTextBox: {
    flex: 1,
  },
  benefitItemTitle: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  benefitItemDesc: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#475569",
    lineHeight: 16,
    marginTop: 2,
  },

  /* 8. Cancelled Card */
  cancelledCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    padding: 16,
    marginBottom: 14,
    gap: 6,
  },
  cancelledHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cancelledTitle: {
    fontSize: 13.5,
    fontFamily: FONTS.displayBold,
    color: "#991B1B",
    fontWeight: "700",
  },
  cancelledDesc: {
    fontSize: 12,
    fontFamily: FONTS.bodyRegular,
    color: "#B91C1C",
    lineHeight: 17,
  },

  /* 9. Management Section */
  managementSection: {
    gap: 12,
    marginBottom: 14,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 14,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 11,
  },
  tabButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  tabText: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: "#64748B",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#0F172A",
    fontWeight: "700",
  },
  tabContent: {
    gap: 10,
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyText: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
    textAlign: "center",
  },
  submissionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 10,
  },
  submissionTitle: {
    fontSize: 13.5,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  submittedLinkBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  submittedLinkText: {
    flex: 1,
    fontSize: 11.5,
    fontFamily: FONTS.bodyRegular,
    color: "#2563EB",
  },

  /* 10. Applied Status Card */
  appliedStatusCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    padding: 18,
    marginBottom: 14,
    gap: 10,
  },
  appliedStatusHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  appliedStatusTitle: {
    fontSize: 14,
    fontFamily: FONTS.displayBold,
    color: "#166534",
    fontWeight: "700",
  },
  appliedCoverLetterText: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyRegular,
    color: "#15803D",
    fontStyle: "italic",
    lineHeight: 19,
  },
  appliedMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#DCFCE7",
  },
  appliedMetaLabel: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyRegular,
    color: "#166534",
  },
  appliedMetaValue: {
    fontSize: 12.5,
    fontFamily: FONTS.displayBold,
    color: "#14532D",
    fontWeight: "800",
  },
  appliedStatusBadgeText: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyBold,
    color: "#15803D",
    fontWeight: "700",
  },

  /* 11. Sticky Bottom Action Bar */
  stickyBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    elevation: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  stickyContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stickyPriceCol: {
    gap: 2,
  },
  stickyPriceLabel: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyBold,
    color: "#64748B",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  stickyPriceValue: {
    fontSize: 17,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "900",
  },
  stickyActionCol: {
    flexDirection: "row",
    alignItems: "center",
  },
  appliedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  appliedPillText: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyBold,
    color: "#059669",
    fontWeight: "700",
  },
});
