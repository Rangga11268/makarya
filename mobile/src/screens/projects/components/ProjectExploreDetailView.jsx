import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { FONTS } from "../../../theme/fonts";
import { PebbleButton } from "../../../components/ui/PebbleButton";
import { ProposalCard } from "../../../components/features/ProposalCard";
import { Avatar } from "../../../components/ui/Avatar";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  FileCheck,
  Link2,
  Users,
  Send,
  Clock,
  Briefcase,
  Check,
  Award,
  Layers,
  Star,
  GraduationCap,
  Sparkles,
  Edit3,
  Trash2,
  MessageSquare,
  MapPin,
  Calendar,
} from "lucide-react-native";
import { projectApi } from "../../../api";
import { MobileEditProjectModal } from "./MobileEditProjectModal";
import { ProjectCoverBanner } from "../../../components/ui/ProjectCoverBanner";

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
  fetchProject,
  showToast,
}) {
  if (!project) return null;

  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleEditPress = () => {
    setEditModalVisible(true);
  };

  const handleDeletePress = () => {
    if (showConfirm) {
      showConfirm({
        title: "Hapus Proyek Ini?",
        message: `Apakah Anda yakin ingin menghapus proyek "${project.judul}"? Tindakan ini permanen dan akan membatalkan seluruh lamaran yang masuk.`,
        confirmText: "Hapus Proyek",
        cancelText: "Batal",
        onConfirm: async () => {
          try {
            await projectApi.delete(project.id);
            if (showToast) showToast("Proyek berhasil dihapus", "success");
            navigation.goBack();
          } catch (err) {
            if (showToast)
              showToast(
                err.response?.data?.detail || "Gagal menghapus proyek",
                "danger",
              );
          }
        },
      });
    }
  };

  const handleConfirmUpdateProject = async (projId, payload) => {
    await projectApi.update(projId, payload);
    if (showToast)
      showToast("Spesifikasi proyek berhasil diperbarui!", "success");
    if (fetchProject) fetchProject();
  };

  const isTeam = project.tipe_kolaborasi === "TIM";
  const slots = Array.isArray(project.slots) ? project.slots : [];
  const rawDescription =
    project.deskripsi_formatted ||
    project.deskripsi_raw ||
    project.deskripsi ||
    "";

  const isLongDescription = rawDescription.length > 220;

  // 1. Budget
  const budgetMax = Number(project.budget_max || 0);

  // 2. Skills Fallback Helper
  const getCategorySkills = (cat) => {
    const c = String(cat || "").toUpperCase();
    switch (c) {
      case "DESIGN":
      case "DESAIN":
        return ["Figma", "Adobe Illustrator", "Branding Visual", "Canva"];
      case "UIUX":
        return ["Figma", "Wireframing", "User Flow", "Prototyping"];
      case "PEMROGRAMAN":
      case "WEB":
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
      case "ADMIN":
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
    Array.isArray(project.skills_required) && project.skills_required.length > 0
      ? project.skills_required
      : Array.isArray(project.skills) && project.skills.length > 0
        ? project.skills
        : getCategorySkills(project.kategori);

  // 3. Rating & Reviews Data (Warm Amber Palette)
  const ratingAvgScore =
    project.umkm_profile?.rating_avg != null &&
    !isNaN(Number(project.umkm_profile.rating_avg))
      ? Number(project.umkm_profile.rating_avg).toFixed(1)
      : project.client_rating != null && !isNaN(Number(project.client_rating))
        ? Number(project.client_rating).toFixed(1)
        : project.rating_avg != null && !isNaN(Number(project.rating_avg))
          ? Number(project.rating_avg).toFixed(1)
          : "5.0";

  const totalReviewsCount =
    typeof project.total_reviews === "number"
      ? project.total_reviews
      : Array.isArray(project.client_reviews)
        ? project.client_reviews.length
        : 0;

  const studentReviews =
    Array.isArray(project.client_reviews) && project.client_reviews.length > 0
      ? project.client_reviews
      : [];

  const handleOpenChat = () => {
    navigation.navigate("Chat", {
      projectId: project.id,
      projectTitle: project.judul,
      partnerName: activePartnerName || clientDisplayName || "Mitra Klien UMKM",
      partnerPhoto: activePartnerPhoto || clientPhoto,
      partnerRole: isUmkmOwner ? "MHS" : "UMKM",
    });
  };

  const handleApplyPress = () => {
    if (isMahasiswa && (!user?.nim || (!user?.prodi_id && !user?.prodi))) {
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
  };

  return (
    <View style={styles.rootContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isCompact && { paddingHorizontal: 14 },
          isLandscape && { paddingVertical: 12 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={responsiveContainerStyle}>
          {/* ================================================================= */}
          {/* BENTO MODULE 1: PROJECT IDENTITY & KEY METRICS                    */}
          {/* ================================================================= */}
          <View style={styles.bentoModule}>
            {/* Compact 135px Media Cover Banner */}
            <ProjectCoverBanner
              src={
                project.banner_url ||
                project.url_banner ||
                project.thumbnail_url ||
                project.umkm_profile?.banner_url ||
                project.umkm_profile?.url_foto_usaha
              }
              category={project.kategori}
              title={project.judul}
              height={135}
              style={styles.coverBanner}
            />

            {/* Project Title & Category */}
            <View style={styles.bentoHeaderInner}>
              <Text style={styles.projectTitle}>{project.judul}</Text>
            </View>

            {/* 2x2 Clean Structured Metrics Grid */}
            <View style={styles.metricsGrid}>
              {/* Metric 1: Budget & 0% Cut */}
              <View style={[styles.metricCell, styles.metricCellEmerald]}>
                <Text style={styles.metricCellLabel}>Pagu Proyek</Text>
                <Text style={styles.metricCellBudget}>
                  {formatCurrency(budgetMax)}
                </Text>
                <View style={styles.escrowInlineBadge}>
                  <ShieldCheck size={11} color="#059669" strokeWidth={2.4} />
                  <Text style={styles.escrowInlineText}>0% Potongan Mahasiswa</Text>
                </View>
              </View>

              {/* Metric 2: Deadline */}
              <View style={styles.metricCell}>
                <Text style={styles.metricCellLabel}>Tenggat Waktu</Text>
                <Text
                  style={[
                    styles.metricCellValue,
                    isProjectExpired && { color: "#DC2626" },
                  ]}
                  numberOfLines={1}
                >
                  {formatDate(project.deadline)}
                </Text>
                <View style={styles.metricSubInfoRow}>
                  <Calendar size={11} color="#94A3B8" />
                  <Text style={styles.metricCellSubLabel}>
                    {isProjectExpired ? "Sudah Berakhir" : "Batas Pengiriman"}
                  </Text>
                </View>
              </View>

              {/* Metric 3: Collaboration Model */}
              <View style={styles.metricCell}>
                <Text style={styles.metricCellLabel}>Format Kerja</Text>
                <Text style={styles.metricCellValue} numberOfLines={1}>
                  {isTeam ? `Tim (${slots.length} Slot)` : "Individu (1 Orang)"}
                </Text>
                <View style={styles.metricSubInfoRow}>
                  <Users size={11} color="#94A3B8" />
                  <Text style={styles.metricCellSubLabel}>
                    {isTeam ? "Multi-Talenta Kolaboratif" : "Single Freelancer"}
                  </Text>
                </View>
              </View>

              {/* Metric 4: 100% Escrow Protection */}
              <View style={[styles.metricCell, styles.metricCellEscrow]}>
                <Text style={styles.metricCellLabel}>Proteksi Finansial</Text>
                <Text style={styles.metricCellEscrowVal} numberOfLines={1}>
                  100% Escrow
                </Text>
                <View style={styles.metricSubInfoRow}>
                  <ShieldCheck size={11} color="#059669" strokeWidth={2.4} />
                  <Text style={styles.metricCellSubLabelEscrow}>
                    Dana Terkunci Sistem
                  </Text>
                </View>
              </View>
            </View>

            {/* Owner Actions (if UMKM owner) */}
            {isUmkmOwner &&
              (project.status === "OPEN" || project.status === "BIDDING") && (
                <View style={styles.ownerActionsWrapper}>
                  <PebbleButton
                    variant="sapphire"
                    size="md"
                    label="Edit Spesifikasi Proyek"
                    icon={Edit3}
                    onPress={handleEditPress}
                    style={{ flex: 1 }}
                  />
                  <TouchableOpacity
                    onPress={handleDeletePress}
                    style={styles.deleteProjectBtn}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={16} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              )}
          </View>

          {/* ================================================================= */}
          {/* BENTO MODULE 2: CLIENT REPUTATION & TRUST SPOTLIGHT               */}
          {/* ================================================================= */}
          <View style={styles.bentoModule}>
            <View style={styles.moduleHeaderRow}>
              <Building2 size={15} color="#0F172A" strokeWidth={2.2} />
              <Text style={styles.moduleTitle}>Mitra Klien UMKM</Text>
              <View style={styles.ratingHeaderPill}>
                <Star size={12} color="#D97706" fill="#F59E0B" />
                <Text style={styles.ratingHeaderScore}>{ratingAvgScore}</Text>
              </View>
            </View>

            <View style={styles.clientProfileWell}>
              <Avatar
                src={clientPhoto}
                name={clientDisplayName || "Klien UMKM"}
                role="UMKM"
                size={44}
                rounded={12}
                showOnlineDot={true}
                isOnline={true}
                style={{ marginRight: 12 }}
              />

              <View style={styles.clientInfoCol}>
                <View style={styles.clientNameRow}>
                  <Text
                    style={styles.clientNameText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {clientDisplayName || "Mitra Klien UMKM"}
                  </Text>
                  <CheckCircle2
                    size={15}
                    color="#2563EB"
                    fill="#2563EB"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    style={{ marginLeft: 5 }}
                  />
                </View>

                <View style={styles.clientMetaRow}>
                  <MapPin size={11} color="#64748B" />
                  <Text style={styles.clientLocationText} numberOfLines={1}>
                    {project.lokasi || project.umkm_profile?.kota || "Indonesia"} • {project.umkm_profile?.bidang_industri || "Mitra UMKM"}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleOpenChat}
                style={styles.clientChatBtn}
                activeOpacity={0.8}
              >
                <MessageSquare size={14} color="#0F172A" />
                <Text style={styles.clientChatBtnText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ================================================================= */}
          {/* BENTO MODULE 3: BRIEF & STRUCTURED DELIVERABLES                   */}
          {/* ================================================================= */}
          <View style={styles.bentoModule}>
            <View style={styles.moduleHeaderRow}>
              <Layers size={15} color="#0F172A" strokeWidth={2.2} />
              <Text style={styles.moduleTitle}>Rincian Kebutuhan & Brief</Text>
            </View>

            {/* Description Body */}
            <View style={styles.briefContentWell}>
              <Text
                style={styles.gigDescription}
                numberOfLines={
                  isLongDescription && !isBriefExpanded ? 5 : undefined
                }
              >
                {rawDescription ||
                  "Deskripsi spesifikasi proyek belum diisi oleh mitra UMKM."}
              </Text>

              {isLongDescription && (
                <TouchableOpacity
                  onPress={() => setIsBriefExpanded(!isBriefExpanded)}
                  style={styles.moreToggleBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.moreToggleText}>
                    {isBriefExpanded ? "Tutup ringkasan ▲" : "Baca selengkapnya ▼"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Required Skills Chips */}
            <View style={styles.skillsSection}>
              <Text style={styles.sectionSubTitle}>Keahlian yang Dibutuhkan</Text>
              <View style={styles.skillsWrapper}>
                {skillsList.map((skill, sIdx) => (
                  <View key={sIdx} style={styles.skillPill}>
                    <Check size={11} color="#0F172A" strokeWidth={2.5} />
                    <Text style={styles.skillPillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* BENTO MODULE 4: TEAM FORMATION & ESCROW GUARANTEE                 */}
          {/* ================================================================= */}
          {isTeam && slots.length > 0 && (
            <View style={styles.bentoModule}>
              <View style={styles.moduleHeaderRow}>
                <Users size={15} color="#0F172A" strokeWidth={2.2} />
                <Text style={styles.moduleTitle}>
                  Formasi Tim ({slots.length} Posisi)
                </Text>
              </View>

              <View style={styles.slotsListWrap}>
                {slots.map((s, idx) => {
                  const isSlotOpen = s.status === "OPEN";
                  const isSlotDone = s.status === "COMPLETED";

                  return (
                    <TouchableOpacity
                      key={s.id || idx}
                      activeOpacity={isSlotOpen && canApply ? 0.75 : 1}
                      onPress={() => {
                        if (isSlotOpen && canApply) {
                          handleApplyPress();
                        }
                      }}
                      style={[
                        styles.slotCardItem,
                        isSlotOpen && canApply && styles.slotCardItemClickable,
                      ]}
                    >
                      <View style={styles.slotHeaderRow}>
                        <View style={{ flex: 1, paddingRight: 8 }}>
                          <Text style={styles.slotItemTitle}>
                            {s.nama_peran}
                          </Text>
                          <Text style={styles.slotItemBudget}>
                            Alokasi: {formatCurrency(s.alokasi_budget)}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.slotBadge,
                            isSlotOpen
                              ? styles.slotBadgeOpen
                              : isSlotDone
                                ? styles.slotBadgeDone
                                : styles.slotBadgeFilled,
                          ]}
                        >
                          <Text
                            style={[
                              styles.slotBadgeText,
                              isSlotOpen
                                ? styles.slotBadgeTextOpen
                                : isSlotDone
                                  ? styles.slotBadgeTextDone
                                  : styles.slotBadgeTextFilled,
                            ]}
                          >
                            {isSlotOpen
                              ? canApply
                                ? "Lamar Posisi Ini →"
                                : "Terbuka"
                              : isSlotDone
                                ? "Selesai"
                                : "Terisi"}
                          </Text>
                        </View>
                      </View>

                      {s.deskripsi_tugas || s.deskripsi ? (
                        <Text style={styles.slotItemDesc}>
                          {s.deskripsi_tugas || s.deskripsi}
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Guarantees & Student Benefits */}
          <View style={styles.bentoModule}>
            <View style={styles.moduleHeaderRow}>
              <Award size={15} color="#0F172A" strokeWidth={2.2} />
              <Text style={styles.moduleTitle}>
                Jaminan & Keuntungan Mahasiswa
              </Text>
            </View>

            <View style={styles.benefitItemsWrap}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIconBoxEmerald}>
                  <ShieldCheck size={16} color="#059669" strokeWidth={2.2} />
                </View>
                <View style={styles.benefitTextBox}>
                  <Text style={styles.benefitItemTitle}>
                    100% Proteksi Rekening Escrow
                  </Text>
                  <Text style={styles.benefitItemDesc}>
                    Dana honor diamankan penuh di sistem Makarya sebelum pengerjaan dimulai dan dicairkan 100% tanpa potongan setelah pekerjaan disetujui.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <View style={styles.benefitIconBoxBlue}>
                  <Award size={16} color="#2563EB" strokeWidth={2.2} />
                </View>
                <View style={styles.benefitTextBox}>
                  <Text style={styles.benefitItemTitle}>
                    E-Sertifikat Digital & SKPI Resmi
                  </Text>
                  <Text style={styles.benefitItemDesc}>
                    Otomatis mendapatkan sertifikat ber-QR terverifikasi bertanda tangan digital mitra UMKM untuk portofolio dan klaim SKPI kampus.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* BENTO MODULE 5: CLIENT REPUTATION & VERIFIED REVIEWS              */}
          {/* ================================================================= */}
          <View style={styles.bentoModule}>
            <View style={styles.moduleHeaderRow}>
              <Star size={15} color="#D97706" fill="#F59E0B" strokeWidth={1} />
              <Text style={styles.moduleTitle}>Ulasan & Reputasi Klien</Text>
              <Text style={styles.reviewsCountBadge}>{totalReviewsCount} Ulasan</Text>
            </View>

            {/* Scorecard Hero with Warm Amber Palette */}
            <View style={styles.ratingScorecardHero}>
              <View style={styles.scoreHeroLeft}>
                <Text style={styles.ratingBigScore}>{ratingAvgScore}</Text>
                <View style={styles.starRowAmber}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={15}
                      color="#D97706"
                      fill="#F59E0B"
                      strokeWidth={1}
                    />
                  ))}
                </View>
                <Text style={styles.scoreScaleSub}>dari skala 5.0</Text>
              </View>

              <View style={styles.scoreCriteriaCol}>
                <View style={styles.criteriaRow}>
                  <Text style={styles.criteriaLabel}>Kelancaran Komunikasi</Text>
                  <View style={styles.criteriaScorePill}>
                    <Star size={11} color="#D97706" fill="#F59E0B" />
                    <Text style={styles.criteriaScoreVal}>{ratingAvgScore}</Text>
                  </View>
                </View>

                <View style={styles.criteriaRow}>
                  <Text style={styles.criteriaLabel}>Kualitas Brief & Arahan</Text>
                  <View style={styles.criteriaScorePill}>
                    <Star size={11} color="#D97706" fill="#F59E0B" />
                    <Text style={styles.criteriaScoreVal}>{ratingAvgScore}</Text>
                  </View>
                </View>

                <View style={styles.criteriaRow}>
                  <Text style={styles.criteriaLabel}>Pencairan Escrow</Text>
                  <View style={styles.criteriaScorePill}>
                    <Star size={11} color="#D97706" fill="#F59E0B" />
                    <Text style={styles.criteriaScoreVal}>5.0</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Horizontal Review Cards Carousel */}
            {studentReviews.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.reviewsScrollContainer}
              >
                {studentReviews.map((rev, idx) => {
                  const reviewerName =
                    rev.reviewer_nama ||
                    rev.dari_nama ||
                    rev.nama ||
                    "Mahasiswa Terverifikasi";
                  const reviewerCampus =
                    rev.reviewer_kampus ||
                    rev.institusi ||
                    rev.kampus ||
                    "Perguruan Tinggi Indonesia";
                  const reviewComment =
                    rev.ulasan ||
                    rev.komentar ||
                    rev.pesan ||
                    rev.catatan ||
                    "Penyelesaian kerja tuntas dan komunikasi dengan mitra berjalan sangat lancar.";
                  const reviewScore =
                    rev.skor != null && !isNaN(Number(rev.skor))
                      ? Number(rev.skor).toFixed(1)
                      : rev.rating != null && !isNaN(Number(rev.rating))
                        ? Number(rev.rating).toFixed(1)
                        : "5.0";
                  const reviewDate = rev.created_at
                    ? formatDate(rev.created_at)
                    : rev.waktu || "Baru saja";

                  return (
                    <View
                      key={rev.id || `rev-${idx}`}
                      style={styles.reviewCardItem}
                    >
                      <View style={styles.reviewerHeader}>
                        <View style={styles.reviewerAvatarBox}>
                          <GraduationCap size={15} color="#2563EB" />
                        </View>
                        <View style={styles.reviewerMeta}>
                          <Text
                            style={styles.reviewerName}
                            numberOfLines={1}
                          >
                            {reviewerName}
                          </Text>
                          <Text
                            style={styles.reviewerCampus}
                            numberOfLines={1}
                          >
                            🇮🇩 {reviewerCampus}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.reviewText} numberOfLines={3}>
                        "{reviewComment}"
                      </Text>

                      <View style={styles.reviewBottomRow}>
                        <View style={styles.reviewScorePill}>
                          <Star size={11} color="#D97706" fill="#F59E0B" />
                          <Text style={styles.reviewScoreVal}>
                            {reviewScore}
                          </Text>
                        </View>
                        <Text style={styles.reviewDateText}>
                          {reviewDate}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            ) : (
              <View style={styles.emptyReviewBox}>
                <Text style={styles.emptyReviewText}>
                  Belum ada ulasan untuk proyek ini. Ulasan akan otomatis diverifikasi dan tampil setelah proyek selesai disetujui.
                </Text>
              </View>
            )}
          </View>

          {/* ================================================================= */}
          {/* MANAGEMENT FOR UMKM OWNER (Proposal Review & Submissions)         */}
          {/* ================================================================= */}
          {isUmkmOwner && (
            <View style={styles.bentoModule}>
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
                    <View style={styles.emptyTabBox}>
                      <Clock size={24} color="#94A3B8" />
                      <Text style={styles.emptyTabText}>
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
                    <View style={styles.emptyTabBox}>
                      <FileCheck size={24} color="#94A3B8" />
                      <Text style={styles.emptyTabText}>
                        Mahasiswa belum mengirimkan berkas deliverable pengerjaan.
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

          {/* Bottom Spacer for Docked Action Bar */}
          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      {/* ===================================================================== */}
      {/* DOCKED UNIFIED BOTTOM ACTION BAR (Zero-Collision & HIG Compliant)     */}
      {/* ===================================================================== */}
      <View style={styles.stickyBottomBar}>
        <View style={styles.stickyContentRow}>
          <View style={styles.stickyPriceCol}>
            <Text style={styles.stickyPriceLabel}>PAGU ANGGARAN</Text>
            <Text
              style={styles.stickyPriceValue}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {formatCurrency(budgetMax)}
            </Text>
            <View style={styles.dockedEscrowRow}>
              <ShieldCheck size={11} color="#059669" strokeWidth={2.4} />
              <Text style={styles.dockedEscrowText}>0% Potongan Mahasiswa</Text>
            </View>
          </View>

          <View style={styles.stickyActionCol}>
            <TouchableOpacity
              style={styles.dockedChatBtn}
              onPress={handleOpenChat}
              activeOpacity={0.8}
            >
              <MessageSquare size={16} color="#0F172A" />
              <Text style={styles.dockedChatBtnText}>Chat</Text>
            </TouchableOpacity>

            {canApply ? (
              <PebbleButton
                variant="sapphire"
                size="md"
                label="Lamar Proyek"
                icon={Send}
                onPress={handleApplyPress}
              />
            ) : myExistingProposal ? (
              <View style={styles.appliedPill}>
                <CheckCircle2 size={13} color="#059669" />
                <Text style={styles.appliedPillText}>
                  {isAcceptedProposal
                    ? "Lamaran Disetujui"
                    : myExistingProposal.status === "REJECTED"
                      ? "Lamaran Ditolak"
                      : "Lamaran Terkirim"}
                </Text>
              </View>
            ) : isUmkmOwner ? (
              <View
                style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
              >
                {(project.status === "OPEN" ||
                  project.status === "BIDDING") && (
                  <PebbleButton
                    variant="sapphire"
                    size="sm"
                    label="Edit"
                    icon={Edit3}
                    onPress={handleEditPress}
                  />
                )}
                <PebbleButton
                  variant="pearl"
                  size="sm"
                  label={`${proposals.length} Pelamar`}
                  icon={Users}
                  onPress={() => setActiveTab("proposals")}
                />
              </View>
            ) : null}
          </View>
        </View>
      </View>

      {/* Edit Project Modal */}
      {editModalVisible && (
        <MobileEditProjectModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          project={project}
          onConfirmUpdate={handleConfirmUpdateProject}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  /* 60% Canvas Background */
  rootContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  /* Bento Modular Card Container (30% Clean White Surfaces) */
  bentoModule: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  moduleHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 12,
  },
  moduleTitle: {
    fontSize: 13.5,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "800",
    letterSpacing: -0.2,
    flex: 1,
  },
  ratingHeaderPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  ratingHeaderScore: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: "#92400E",
    fontWeight: "800",
  },
  reviewsCountBadge: {
    fontSize: 11,
    fontFamily: FONTS.bodyMedium,
    color: "#64748B",
  },

  /* Bento Module 1: Cover, Title & Metrics */
  coverBanner: {
    marginBottom: 12,
    borderRadius: 12,
  },
  bentoHeaderInner: {
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 17,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "900",
    lineHeight: 23,
    letterSpacing: -0.3,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metricCell: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 3,
  },
  metricCellEmerald: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  metricCellEscrow: {
    backgroundColor: "#F8FAFC",
    borderColor: "#F1F5F9",
  },
  metricCellLabel: {
    fontSize: 10,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
  },
  metricCellBudget: {
    fontSize: 14.5,
    fontFamily: FONTS.displayBold,
    color: "#059669",
    fontWeight: "900",
    marginTop: 1,
  },
  metricCellValue: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "800",
    marginTop: 1,
  },
  metricCellEscrowVal: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "800",
    marginTop: 1,
  },
  metricSubInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
    marginTop: 1,
  },
  metricCellSubLabel: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyRegular,
    color: "#94A3B8",
  },
  metricCellSubLabelEscrow: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyMedium,
    color: "#059669",
  },
  escrowInlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
    marginTop: 2,
  },
  escrowInlineText: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyBold,
    color: "#059669",
    fontWeight: "700",
  },
  ownerActionsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  deleteProjectBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Bento Module 2: Client Reputation Well */
  clientProfileWell: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  clientInfoCol: {
    flex: 1,
    gap: 2,
  },
  clientNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  clientNameText: {
    fontSize: 13.5,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "800",
  },
  clientMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 1,
  },
  clientLocationText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
    flex: 1,
  },
  clientChatBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clientChatBtnText: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },

  /* Bento Module 3: Brief & Skills */
  briefContentWell: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 4,
  },
  gigDescription: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyRegular,
    color: "#334155",
    lineHeight: 19,
  },
  moreToggleBtn: {
    alignSelf: "flex-start",
    marginTop: 6,
  },
  moreToggleText: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyBold,
    color: "#2563EB",
    fontWeight: "700",
  },
  skillsSection: {
    marginTop: 12,
    gap: 8,
  },
  sectionSubTitle: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyBold,
    color: "#475569",
    fontWeight: "700",
  },
  skillsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 8,
  },
  skillPillText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },

  /* Bento Module 4: Team Slots */
  slotsListWrap: {
    gap: 8,
  },
  slotCardItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 11,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 4,
  },
  slotCardItemClickable: {
    borderColor: "#BFDBFE",
    backgroundColor: "#EFF6FF",
  },
  slotHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  slotItemTitle: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "800",
  },
  slotItemBudget: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: "#2563EB",
    fontWeight: "700",
    marginTop: 1,
  },
  slotItemDesc: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 16,
  },
  slotBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 5,
  },
  slotBadgeOpen: {
    backgroundColor: "#ECFDF5",
  },
  slotBadgeDone: {
    backgroundColor: "#EFF6FF",
  },
  slotBadgeFilled: {
    backgroundColor: "#F1F5F9",
  },
  slotBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    fontWeight: "700",
  },
  slotBadgeTextOpen: {
    color: "#059669",
  },
  slotBadgeTextDone: {
    color: "#2563EB",
  },
  slotBadgeTextFilled: {
    color: "#64748B",
  },

  /* Benefits / Jaminan */
  benefitItemsWrap: {
    gap: 10,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  benefitIconBoxEmerald: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  benefitIconBoxBlue: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  benefitTextBox: {
    flex: 1,
  },
  benefitItemTitle: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "800",
  },
  benefitItemDesc: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
    lineHeight: 16,
    marginTop: 2,
  },

  /* Bento Module 5: Ratings & Reviews */
  ratingScorecardHero: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 12,
    gap: 14,
  },
  scoreHeroLeft: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
    minWidth: 80,
  },
  ratingBigScore: {
    fontSize: 26,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "900",
  },
  starRowAmber: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 2,
  },
  scoreScaleSub: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyRegular,
    color: "#94A3B8",
    marginTop: 2,
  },
  scoreCriteriaCol: {
    flex: 1,
    gap: 6,
  },
  criteriaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  criteriaLabel: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#475569",
  },
  criteriaScorePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  criteriaScoreVal: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: "#92400E",
    fontWeight: "800",
  },
  reviewsScrollContainer: {
    paddingRight: 14,
    gap: 10,
  },
  reviewCardItem: {
    width: 250,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 6,
  },
  reviewerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reviewerAvatarBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewerMeta: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "800",
  },
  reviewerCampus: {
    fontSize: 10,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
    marginTop: 1,
  },
  reviewText: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyRegular,
    color: "#334155",
    lineHeight: 16.5,
  },
  reviewBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 2,
  },
  reviewScorePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  reviewScoreVal: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyBold,
    color: "#92400E",
    fontWeight: "800",
  },
  reviewDateText: {
    fontSize: 10,
    fontFamily: FONTS.bodyRegular,
    color: "#94A3B8",
  },
  emptyReviewBox: {
    padding: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyReviewText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 17,
  },

  /* UMKM Management Tab */
  tabContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  tabButtonActive: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#93C5FD",
  },
  tabText: {
    fontSize: 11,
    fontFamily: FONTS.bodyMedium,
    color: "#64748B",
  },
  tabTextActive: {
    fontFamily: FONTS.bodyBold,
    color: "#2563EB",
    fontWeight: "700",
  },
  tabContent: {
    gap: 8,
  },
  emptyTabBox: {
    padding: 16,
    alignItems: "center",
    gap: 6,
  },
  emptyTabText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#94A3B8",
    textAlign: "center",
  },
  submissionCard: {
    backgroundColor: "#F8FAFC",
    padding: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  submissionTitle: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
  },
  submittedLinkBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
  },
  submittedLinkText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#2563EB",
    flex: 1,
  },

  /* Docked Unified Bottom Action Bar */
  stickyBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    ...Platform.select({
      ios: {
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  stickyContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  stickyPriceCol: {
    flex: 1,
  },
  stickyPriceLabel: {
    fontSize: 9,
    fontFamily: FONTS.bodyBold,
    color: "#94A3B8",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  stickyPriceValue: {
    fontSize: 15.5,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "900",
    marginTop: 0.5,
  },
  dockedEscrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
    marginTop: 1,
  },
  dockedEscrowText: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyBold,
    color: "#059669",
    fontWeight: "700",
  },
  stickyActionCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  dockedChatBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 10,
  },
  dockedChatBtnText: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  appliedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
  },
  appliedPillText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: "#059669",
    fontWeight: "700",
  },
});
