import React, { useState } from "react";
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
  Star,
  MapPin,
  CheckCircle,
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

  const isLongDescription = rawDescription.length > 240;

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
          isCompact && { paddingHorizontal: 16 },
          isLandscape && { paddingVertical: 12 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={responsiveContainerStyle}>
          {/* ================================================================= */}
          {/* 1. SELLER / CLIENT UMKM IDENTITY ROW (Fiverr Style)               */}
          {/* ================================================================= */}
          <View style={styles.creatorCard}>
            <View style={styles.creatorRow}>
              <View style={styles.avatarWrapper}>
                {clientPhoto ? (
                  <Image
                    source={{ uri: clientPhoto }}
                    style={styles.creatorAvatar}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.creatorAvatarFallback}>
                    <Building2 size={22} color="#2563EB" />
                  </View>
                )}
                <View style={styles.onlineDot} />
              </View>

              <View style={styles.creatorMetaCol}>
                <Text style={styles.creatorName} numberOfLines={1}>
                  {clientDisplayName || "Mitra UMKM"}
                </Text>

                <View style={styles.badgeCluster}>
                  <View style={styles.topRatedBadge}>
                    <Text style={styles.topRatedText}>Mitra Terverifikasi ◆◆◆</Text>
                  </View>
                  <View style={styles.vettedBadge}>
                    <Text style={styles.vettedText}>100% Escrow</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 2. PROJECT HEADLINE & INTRO (Fiverr Pro Style)                    */}
          {/* ================================================================= */}
          <View style={styles.headlineCard}>
            {/* Category Tag */}
            <View style={styles.categoryRow}>
              <View style={styles.categoryPill}>
                <Briefcase size={11} color="#475569" />
                <Text style={styles.categoryPillText}>
                  {project.kategori
                    ? String(project.kategori).toUpperCase()
                    : "UMKM DIGITAL"}
                </Text>
              </View>

              <View style={styles.applicantPill}>
                <Users size={11} color="#2563EB" />
                <Text style={styles.applicantPillText}>
                  {totalApplicantsCount} Pelamar
                </Text>
              </View>
            </View>

            {/* Big Bold Title */}
            <Text style={styles.projectTitle}>{project.judul}</Text>

            {/* Description Body with Inline More Toggle */}
            <View style={styles.descriptionBox}>
              <Text
                style={styles.descriptionText}
                numberOfLines={
                  isLongDescription && !isBriefExpanded ? 4 : undefined
                }
              >
                {rawDescription ||
                  "Deskripsi spesifikasi proyek belum diisi oleh mitra UMKM."}
              </Text>

              {isLongDescription && (
                <TouchableOpacity
                  onPress={() => setIsBriefExpanded(!isBriefExpanded)}
                  style={styles.inlineMoreBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.inlineMoreText}>
                    {isBriefExpanded ? "Tutup kembali" : "Baca selengkapnya..."}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ================================================================= */}
          {/* 3. TIERED SPEC & SCOPE CARD (Fiverr Package Details Style)         */}
          {/* ================================================================= */}
          <View style={styles.packageCard}>
            {/* Price Header Strip */}
            <View style={styles.packageHeaderStrip}>
              <Text style={styles.packageHeaderPrice}>
                {formatCurrency(project.budget_max)}
              </Text>
              <View style={styles.activePackageIndicator} />
            </View>

            <View style={styles.packageBody}>
              <Text style={styles.packageTitle}>
                {isTeam ? "Paket Kolaborasi Tim" : "Paket Proyek Individu"}
              </Text>
              <Text style={styles.packageSummary}>
                Pagu honor teralokasi penuh dengan garansi pembayaran resmi Makarya.
              </Text>

              {/* Spec Rows */}
              <View style={styles.specTable}>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Tenggat Pengerjaan</Text>
                  <Text style={styles.specValue}>{formatDate(project.deadline)}</Text>
                </View>
                <View style={styles.specDivider} />

                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Batas Revisi</Text>
                  <Text style={styles.specValue}>Maksimal 2x Revisi Minor</Text>
                </View>
                <View style={styles.specDivider} />

                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Tipe Kolaborasi</Text>
                  <Text style={styles.specValue}>
                    {isTeam ? `Tim (${slots.length} Posisi)` : "Talenta Individu"}
                  </Text>
                </View>
                <View style={styles.specDivider} />

                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Sertifikat Digital</Text>
                  <Text style={styles.specValue}>Resmi Bertanda Tangan UMKM</Text>
                </View>
                <View style={styles.specDivider} />

                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Proteksi Pembayaran</Text>
                  <Text style={[styles.specValue, { color: "#059669" }]}>
                    Garansi Escrow 100%
                  </Text>
                </View>
              </View>

              {/* Package CTA Button */}
              {canApply ? (
                <TouchableOpacity
                  style={styles.packageCtaBtn}
                  onPress={handleApplyPress}
                  activeOpacity={0.85}
                >
                  <Send size={16} color="#FFFFFF" />
                  <Text style={styles.packageCtaText}>
                    Ajukan Lamaran ({formatCurrency(project.budget_max)})
                  </Text>
                </TouchableOpacity>
              ) : myExistingProposal ? (
                <View style={styles.appliedBannerPill}>
                  <CheckCircle2 size={16} color="#059669" />
                  <Text style={styles.appliedBannerText}>
                    {isAcceptedProposal
                      ? "Lamaran Diterima Klien"
                      : myExistingProposal.status === "REJECTED"
                        ? "Lamaran Ditolak"
                        : "Lamaran Terkirim"}
                  </Text>
                </View>
              ) : null}

              {/* Vetted By Makarya Box */}
              <View style={styles.vettedBox}>
                <Text style={styles.vettedBoxTitle}>Terverifikasi oleh Makarya</Text>
                <Text style={styles.vettedBoxDesc}>
                  Dana proyek ini telah didepositkan secara resmi di sistem Escrow Makarya sebelum pengerjaan dimulai.
                </Text>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 4. AI MATCH & COMPATIBILITY CARD (FOR MAHASISWA)                  */}
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
                Sistem AI Makarya menganalisis bahwa profil Anda sangat selaras dengan kriteria proyek ini:
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
                        Keahlian dan latar belakang program studi Anda relevan dengan proyek.
                      </Text>
                    </View>
                    <View style={styles.aiReasonItem}>
                      <CheckCircle2 size={13} color="#2563EB" style={{ marginTop: 2 }} />
                      <Text style={styles.aiReasonText}>
                        Peluang optimal terpilih sebagai mitra talenta UMKM ini.
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          )}

          {/* ================================================================= */}
          {/* 5. REQUIRED SKILLS & TECH STACK                                   */}
          {/* ================================================================= */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Layers size={16} color="#2563EB" />
              <Text style={styles.sectionTitle}>Keahlian yang Dibutuhkan</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Keahlian dan perangkat lunak yang direkomendasikan untuk proyek ini:
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
          {/* 6. TEAM SLOTS BREAKDOWN (IF TEAM COLLABORATION)                   */}
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
          {/* 7. CLIENT RATING & TRUST BREAKDOWN (Fiverr Rating Style)          */}
          {/* ================================================================= */}
          <View style={styles.sectionCard}>
            <View style={styles.ratingHeroRow}>
              <View style={styles.starsCluster}>
                <Star size={18} color="#F59E0B" fill="#F59E0B" />
                <Star size={18} color="#F59E0B" fill="#F59E0B" />
                <Star size={18} color="#F59E0B" fill="#F59E0B" />
                <Star size={18} color="#F59E0B" fill="#F59E0B" />
                <Star size={18} color="#F59E0B" fill="#F59E0B" />
              </View>
              <Text style={styles.ratingHeroScore}>5.0</Text>
            </View>

            {/* Criteria Breakdown */}
            <View style={styles.criteriaTable}>
              <View style={styles.criteriaRow}>
                <Text style={styles.criteriaLabel}>Tingkat Komunikasi Klien</Text>
                <View style={styles.criteriaScoreWrap}>
                  <Star size={12} color="#0F172A" fill="#0F172A" />
                  <Text style={styles.criteriaScore}>5.0</Text>
                </View>
              </View>

              <View style={styles.criteriaRow}>
                <Text style={styles.criteriaLabel}>Kejelasan Brief & Tugas</Text>
                <View style={styles.criteriaScoreWrap}>
                  <Star size={12} color="#0F172A" fill="#0F172A" />
                  <Text style={styles.criteriaScore}>5.0</Text>
                </View>
              </View>

              <View style={styles.criteriaRow}>
                <Text style={styles.criteriaLabel}>Kecepatan Pencairan Honor</Text>
                <View style={styles.criteriaScoreWrap}>
                  <Star size={12} color="#0F172A" fill="#0F172A" />
                  <Text style={styles.criteriaScore}>5.0</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 8. CLIENT UMKM PROFILE CARD                                       */}
          {/* ================================================================= */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Building2 size={16} color="#2563EB" />
              <Text style={styles.sectionTitle}>Profil Usaha Klien</Text>
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
                  <Building2 size={20} color="#2563EB" />
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
            </View>
          </View>

          {/* ================================================================= */}
          {/* 9. TALENT BENEFITS & VERIFIED CERTIFICATION                       */}
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
          {/* 10. MANAGEMENT FOR UMKM OWNER                                     */}
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

          {/* Bottom spacer for floating chat & sticky bar */}
          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      {/* ===================================================================== */}
      {/* 11. FLOATING CHAT PILL WIDGET (Fiverr Style)                          */}
      {/* ===================================================================== */}
      <TouchableOpacity
        style={styles.floatingChatPill}
        onPress={handleOpenChat}
        activeOpacity={0.85}
      >
        <View style={styles.floatingAvatarWrap}>
          {clientPhoto ? (
            <Image
              source={{ uri: clientPhoto }}
              style={styles.floatingAvatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.floatingAvatarFallback}>
              <Building2 size={14} color="#2563EB" />
            </View>
          )}
          <View style={styles.floatingOnlineDot} />
        </View>
        <Text style={styles.floatingChatText}>Chat</Text>
      </TouchableOpacity>

      {/* ===================================================================== */}
      {/* 12. PERSISTENT STICKY BOTTOM ACTION BAR                               */}
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
                onPress={handleApplyPress}
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
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },

  /* 1. Creator Identity Card (Fiverr Seller Header) */
  creatorCard: {
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginBottom: 14,
  },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarWrapper: {
    position: "relative",
  },
  creatorAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E2E8F0",
  },
  creatorAvatarFallback: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  creatorMetaCol: {
    flex: 1,
    gap: 4,
  },
  creatorName: {
    fontSize: 15,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  badgeCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  topRatedBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  topRatedText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: "#B45309",
    fontWeight: "700",
  },
  vettedBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  vettedText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: "#1D4ED8",
    fontWeight: "700",
  },

  /* 2. Headline & Brief */
  headlineCard: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginBottom: 16,
    gap: 10,
  },
  categoryRow: {
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
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryPillText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: "#475569",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  applicantPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  applicantPillText: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyBold,
    color: "#2563EB",
    fontWeight: "700",
  },
  projectTitle: {
    fontSize: 21,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "800",
    lineHeight: 28,
  },
  descriptionBox: {
    gap: 4,
  },
  descriptionText: {
    fontSize: 13.5,
    fontFamily: FONTS.bodyRegular,
    color: "#334155",
    lineHeight: 21,
  },
  inlineMoreBtn: {
    alignSelf: "flex-start",
    marginTop: 2,
  },
  inlineMoreText: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
    textDecorationLine: "underline",
  },

  /* 3. Package & Scope Card (Fiverr Pricing Block) */
  packageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  packageHeaderStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FAFAFA",
    position: "relative",
  },
  packageHeaderPrice: {
    fontSize: 19,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "900",
  },
  activePackageIndicator: {
    position: "absolute",
    bottom: 0,
    right: 16,
    width: 90,
    height: 3,
    backgroundColor: "#0F172A",
    borderRadius: 2,
  },
  packageBody: {
    padding: 16,
    gap: 12,
  },
  packageTitle: {
    fontSize: 16,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  packageSummary: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
    lineHeight: 18,
    marginTop: -6,
  },
  specTable: {
    marginTop: 6,
    gap: 8,
  },
  specRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  specLabel: {
    fontSize: 13,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
  },
  specValue: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  specDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  packageCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0F172A",
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 6,
  },
  packageCtaText: {
    fontSize: 14,
    fontFamily: FONTS.bodyBold,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  appliedBannerPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    marginTop: 6,
  },
  appliedBannerText: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: "#059669",
    fontWeight: "700",
  },
  vettedBox: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 4,
    marginTop: 4,
  },
  vettedBoxTitle: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  vettedBoxDesc: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
    lineHeight: 16,
  },

  /* Common Section Card */
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 14,
    gap: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
    marginTop: -4,
  },

  /* 4. AI Match */
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
    fontSize: 12,
    fontFamily: FONTS.bodyRegular,
    color: "#475569",
    lineHeight: 18,
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
    fontSize: 11.5,
    fontFamily: FONTS.bodyRegular,
    color: "#334155",
    lineHeight: 17,
  },

  /* 5. Skills */
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

  /* 6. Team Slots */
  slotsContainer: {
    gap: 10,
    marginTop: 4,
  },
  slotCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    gap: 6,
  },
  slotTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  slotRoleName: {
    fontSize: 13,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  slotBudgetText: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyRegular,
    color: "#059669",
    fontWeight: "600",
    marginTop: 1,
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
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#475569",
    lineHeight: 16,
  },

  /* 7. Rating Hero (Fiverr Style) */
  ratingHeroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  starsCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingHeroScore: {
    fontSize: 18,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "900",
  },
  criteriaTable: {
    gap: 8,
    marginTop: 4,
  },
  criteriaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  criteriaLabel: {
    fontSize: 13,
    fontFamily: FONTS.bodyRegular,
    color: "#475569",
  },
  criteriaScoreWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  criteriaScore: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },

  /* 8. Client Profile */
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

  /* 9. Benefits */
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

  /* 10. Management Section */
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
    borderRadius: 16,
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
    borderRadius: 16,
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

  /* 11. Floating Chat Pill Widget (Fiverr Style) */
  floatingChatPill: {
    position: "absolute",
    bottom: 84,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 99,
  },
  floatingAvatarWrap: {
    position: "relative",
  },
  floatingAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E2E8F0",
  },
  floatingAvatarFallback: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingOnlineDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#10B981",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  floatingChatText: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },

  /* 12. Sticky Bottom Action Bar */
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
