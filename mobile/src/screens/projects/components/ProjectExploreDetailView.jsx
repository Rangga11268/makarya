import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { PebbleButton } from "../../../components/ui/PebbleButton";
import { ProposalCard } from "../../../components/features/ProposalCard";
import { formatCurrency } from "../../../utils/formatCurrency";
import {
  formatDate,
  daysRemaining,
  isExpired,
} from "../../../utils/formatDate";
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
  Award,
  Layers,
  Star,
  MapPin,
  CheckCircle,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ExternalLink,
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

  const isLongDescription = rawDescription.length > 220;

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

  // 2. Banner Image Resolver
  const getCategoryBanner = (cat) => {
    const c = String(cat || "").toUpperCase();
    switch (c) {
      case "DESIGN":
      case "DESAIN":
        return "https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=800&q=80";
      case "PEMROGRAMAN":
      case "WEB":
        return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80";
      case "UIUX":
        return "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80";
      case "VIDEO":
        return "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80";
      case "COPYWRITING":
        return "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80";
      case "ADMIN_DATA":
      case "ADMIN":
        return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80";
      default:
        return "https://images.unsplash.com/photo-1556742049-0a67e557b6f3?w=800&q=80";
    }
  };

  const projectBannerUri =
    project.banner_url ||
    project.thumbnail_url ||
    project.umkm_profile?.url_foto_usaha ||
    getCategoryBanner(project.kategori);

  // 3. Fixed Single Budget (No Range)
  const budgetMax = Number(project.budget_max || 0);

  // 4. Skills Fallback Helper
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

  // 5. Rating & Reviews Data
  const ratingAvgScore =
    typeof project.umkm_profile?.rating_avg === "number"
      ? Number(project.umkm_profile.rating_avg).toFixed(1)
      : typeof project.client_rating === "number"
        ? Number(project.client_rating).toFixed(1)
        : "5.0";

  const totalReviewsCount =
    typeof project.total_reviews === "number"
      ? project.total_reviews
      : Array.isArray(project.client_reviews) &&
          project.client_reviews.length > 0
        ? project.client_reviews.length
        : 12;

  const studentReviews =
    Array.isArray(project.client_reviews) && project.client_reviews.length > 0
      ? project.client_reviews
      : [
          {
            id: "rev-default-1",
            nama: "Nadia Larasati",
            kampus: "Institut Seni Indonesia",
            rating: 5.0,
            waktu: "Maret 2026",
            pesan:
              "Mitra UMKM sangat komunikatif, memberikan arahan yang presisi dan cepat tanggap. Dana escrow langsung dicairkan begitu berkas deliverable disetujui!",
          },
          {
            id: "rev-default-2",
            nama: "Ahmad Fikri",
            kampus: "Universitas BSI",
            rating: 5.0,
            waktu: "Februari 2026",
            pesan:
              "Pengalaman kolaborasi yang memuaskan. Brief pengerjaan sangat terstruktur dan e-sertifikat digital ber-QR langsung otomatis terbit ke profil.",
          },
          {
            id: "rev-default-3",
            nama: "Sarah Nabila",
            kampus: "Universitas Indonesia",
            rating: 5.0,
            waktu: "Januari 2026",
            pesan:
              "Kerja sama sangat transparan. Rekomendasi terbaik untuk mahasiswa yang ingin menambah portofolio riil UMKM terpercaya.",
          },
        ];

  const daysLeft = daysRemaining(project.deadline);
  const expired = isExpired(project.deadline) || project.status === "CANCELLED";

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
          {/* 1. HERO MEDIA BANNER (Web & Apple Style Clean Presentation)       */}
          {/* ================================================================= */}
          <View style={styles.bannerContainer}>
            <Image
              source={{ uri: projectBannerUri }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <View style={styles.bannerOverlayGradient} />

            {/* Category Pill Tag */}
            <View style={styles.bannerCategoryPill}>
              <Briefcase size={12} color="#FFFFFF" />
              <Text style={styles.bannerCategoryText}>
                {project.kategori
                  ? String(project.kategori).toUpperCase()
                  : "UMKM DIGITAL"}
              </Text>
            </View>

            {/* Escrow Protected Top Right Badge */}
            <View style={styles.bannerEscrowPill}>
              <ShieldCheck size={11} color="#FFFFFF" />
              <Text style={styles.bannerEscrowText}>100% Escrow Aman</Text>
            </View>

            {/* Bottom Watermark */}
            <View style={styles.bannerBottomWatermark}>
              <Text style={styles.bannerWatermarkText} numberOfLines={1}>
                Kemitraan Resmi: {clientDisplayName || "Klien UMKM"}
              </Text>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 2. MITRA UMKM IDENTITY CARD (Clean Apple Style)                   */}
          {/* ================================================================= */}
          <View style={styles.sellerHeaderCard}>
            <View style={styles.sellerRow}>
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                {clientPhoto ? (
                  <Image
                    source={{ uri: clientPhoto }}
                    style={styles.sellerAvatar}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.sellerAvatarFallback}>
                    <Building2 size={20} color={COLORS.brandIndigo} />
                  </View>
                )}
                <View style={styles.sellerOnlineDot} />
              </View>

              {/* Name & Badges */}
              <View style={styles.sellerMetaCol}>
                <View style={styles.sellerNameRow}>
                  <Text
                    style={styles.sellerName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {clientDisplayName || "Mitra Klien UMKM"}
                  </Text>
                  <View style={styles.verifiedClientPill}>
                    <CheckCircle2 size={11} color={COLORS.success} />
                    <Text style={styles.verifiedClientPillText}>
                      Mitra Terverifikasi
                    </Text>
                  </View>
                </View>

                <Text style={styles.sellerSubText} numberOfLines={1}>
                  {project.umkm_profile?.bidang_industri || "Usaha Mandiri"} •{" "}
                  {project.lokasi || project.umkm_profile?.kota || "Indonesia"}
                </Text>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 3. HEADLINE, BADGES & BRIEF DESCRIPTION                           */}
          {/* ================================================================= */}
          <View style={styles.headlineCard}>
            <View style={styles.tagRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {project.kategori || "UMKM"}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  project.status === "OPEN" || project.status === "BIDDING"
                    ? styles.statusBadgeOpen
                    : project.status === "IN_PROGRESS"
                      ? styles.statusBadgeInProgress
                      : styles.statusBadgeOther,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    project.status === "OPEN" || project.status === "BIDDING"
                      ? styles.statusTextOpen
                      : project.status === "IN_PROGRESS"
                        ? styles.statusTextInProgress
                        : styles.statusTextOther,
                  ]}
                >
                  {formatStatus(project.status)}
                </Text>
              </View>

              {matchScore > 0 && isMahasiswa && (
                <View style={styles.matchScoreBadge}>
                  <CheckCircle2 size={11} color="#059669" />
                  <Text style={styles.matchScoreBadgeText}>
                    {matchScore}% Cocok
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.gigHeadline}>{project.judul}</Text>

            <View style={styles.descriptionWrapper}>
              <Text
                style={styles.gigDescription}
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
                  style={styles.moreToggleBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.moreToggleText}>
                    {isBriefExpanded ? "Tutup ringkasan" : "Baca selengkapnya"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ================================================================= */}
          {/* 4. 4-STAT METRICS BAR (Replicated exactly from Web)               */}
          {/* ================================================================= */}
          <View style={styles.statsGrid}>
            {/* Stat 1: Batas Anggaran */}
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Batas Anggaran:</Text>
              <Text style={styles.statValuePrimary} numberOfLines={1}>
                {formatCurrency(budgetMax)}
              </Text>
            </View>

            {/* Stat 2: Tipe Kolaborasi */}
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Tipe Pengerjaan:</Text>
              <Text style={styles.statValueDark} numberOfLines={1}>
                {isTeam ? "Tim Kolaborasi" : "Individu"}
              </Text>
            </View>

            {/* Stat 3: Tenggat Waktu */}
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Sisa Waktu:</Text>
              <Text
                style={[
                  styles.statValueDark,
                  expired && { color: COLORS.error },
                ]}
                numberOfLines={1}
              >
                {daysLeft > 0
                  ? `${daysLeft} Hari Lagi`
                  : formatDate(project.deadline)}
              </Text>
            </View>

            {/* Stat 4: Proteksi Escrow */}
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Proteksi Escrow:</Text>
              <Text style={styles.statValueSuccess} numberOfLines={1}>
                100% Diamankan
              </Text>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 5. STRUCTURED PROJECT SPECIFICATIONS (Clean Apple Icon Grid)      */}
          {/* ================================================================= */}
          <View style={styles.sectionBox}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                Spesifikasi & Standar Pengerjaan
              </Text>
            </View>

            <View style={styles.deliverablesList}>
              <View style={styles.deliverableItem}>
                <View style={styles.deliverableIconWrapIndigo}>
                  <MessageSquare size={16} color={COLORS.brandIndigo} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deliverableTitle}>
                    Obrolan Langsung & Arahan Klien
                  </Text>
                  <Text style={styles.deliverableDesc}>
                    Koordinasi real-time dengan mitra UMKM melalui ruang kerja
                    digital terenkripsi.
                  </Text>
                </View>
              </View>

              <View style={styles.deliverableItem}>
                <View style={styles.deliverableIconWrapCyan}>
                  <FileText size={16} color={COLORS.brandCyan} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deliverableTitle}>
                    Aset Mentah & Berkas Sumber
                  </Text>
                  <Text style={styles.deliverableDesc}>
                    Pengiriman aset mentah (source files) rapi & siap pakai
                    sesuai kebutuhan brief.
                  </Text>
                </View>
              </View>

              <View style={styles.deliverableItem}>
                <View style={styles.deliverableIconWrapEmerald}>
                  <Award size={16} color={COLORS.success} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deliverableTitle}>
                    E-Sertifikat Portofolio Resmi (SKPI)
                  </Text>
                  <Text style={styles.deliverableDesc}>
                    Sertifikat resmi ber-QR otomatis diterbitkan setelah
                    deliverable disetujui klien.
                  </Text>
                </View>
              </View>

              <View style={[styles.deliverableItem, { borderBottomWidth: 0 }]}>
                <View style={styles.deliverableIconWrapAmber}>
                  <ShieldCheck size={16} color="#D97706" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deliverableTitle}>
                    Garansi Pencairan Escrow 100%
                  </Text>
                  <Text style={styles.deliverableDesc}>
                    Dana honor aman di escrow dan dicairkan 0% potongan komisi
                    ke rekening Anda.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 6. TEAM SLOTS ALLOCATION (IF MULTI-ROLE TEAM PROJECT)             */}
          {/* ================================================================= */}
          {isTeam && slots.length > 0 && (
            <View style={styles.sectionBox}>
              <View style={styles.sectionHeaderRow}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Users size={16} color={COLORS.brandIndigo} />
                  <Text style={styles.sectionTitle}>
                    Formasi Tim ({slots.length} Posisi)
                  </Text>
                </View>
              </View>

              <View style={styles.slotsListWrap}>
                {slots.map((s, idx) => {
                  const isSlotOpen = s.status === "OPEN";
                  const isSlotDone = s.status === "COMPLETED";

                  return (
                    <View key={s.id || idx} style={styles.slotCardItem}>
                      <View style={styles.slotHeaderRow}>
                        <View style={{ flex: 1, paddingRight: 8 }}>
                          <Text style={styles.slotItemTitle}>
                            {s.nama_peran}
                          </Text>
                          <Text style={styles.slotItemBudget}>
                            Alokasi Honor:{" "}
                            {formatCurrency(s.alokasi_budget || budgetMax)}
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
                              ? "Terbuka"
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
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* ================================================================= */}
          {/* 7. PROFILE MATCH & REASONS (FOR MAHASISWA)                        */}
          {/* ================================================================= */}
          {isMahasiswa && (matchScore > 0 || matchReasons.length > 0) && (
            <View style={styles.sectionBox}>
              <View style={styles.sectionHeaderRow}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Sparkles size={16} color={COLORS.brandIndigo} />
                  <Text style={styles.sectionTitle}>Kecocokan Profil Anda</Text>
                </View>
                <View style={styles.matchScorePill}>
                  <Text style={styles.matchScoreText}>
                    {matchScore || 85}% Cocok
                  </Text>
                </View>
              </View>

              <Text style={styles.matchIntroText}>
                Sistem AI Makarya mendeteksi keahlian dan riwayat portofolio
                Anda sangat relevan dengan kebutuhan proyek ini:
              </Text>

              <View style={styles.bulletList}>
                {matchReasons.length > 0 ? (
                  matchReasons.map((reason, idx) => (
                    <View key={idx} style={styles.bulletItem}>
                      <CheckCircle2
                        size={13}
                        color={COLORS.brandIndigo}
                        style={{ marginTop: 2 }}
                      />
                      <Text style={styles.bulletText}>{reason}</Text>
                    </View>
                  ))
                ) : (
                  <>
                    <View style={styles.bulletItem}>
                      <CheckCircle2
                        size={13}
                        color={COLORS.brandIndigo}
                        style={{ marginTop: 2 }}
                      />
                      <Text style={styles.bulletText}>
                        Keahlian dan bidang studi Anda relevan dengan kebutuhan
                        proyek.
                      </Text>
                    </View>
                    <View style={styles.bulletItem}>
                      <CheckCircle2
                        size={13}
                        color={COLORS.brandIndigo}
                        style={{ marginTop: 2 }}
                      />
                      <Text style={styles.bulletText}>
                        Peluang tinggi untuk diterima dan mendapatkan portofolio
                        terverifikasi.
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          )}

          {/* ================================================================= */}
          {/* 8. REQUIRED SKILLS & TECH STACK                                   */}
          {/* ================================================================= */}
          <View style={styles.sectionBox}>
            <View style={styles.sectionHeaderRow}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Layers size={16} color={COLORS.textDark} />
                <Text style={styles.sectionTitle}>
                  Keahlian yang Dibutuhkan
                </Text>
              </View>
            </View>

            <View style={styles.skillsWrapper}>
              {skillsList.map((skill, sIdx) => (
                <View key={sIdx} style={styles.skillPill}>
                  <Check size={11} color={COLORS.brandIndigo} strokeWidth={3} />
                  <Text style={styles.skillPillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ================================================================= */}
          {/* 9. RATING & ULASAN KEMITRAAN (Clean Apple & Web Style)            */}
          {/* ================================================================= */}
          <View style={styles.sectionBox}>
            <View style={styles.sectionHeaderRow}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.sectionTitle}>
                  Rating & Ulasan Kemitraan
                </Text>
              </View>
              <Text style={styles.reviewVerifiedBadge}>
                Terverifikasi Resmi
              </Text>
            </View>

            {/* Big Score Hero Card */}
            <View style={styles.ratingHeroRow}>
              <View style={styles.ratingScoreBox}>
                <Text style={styles.ratingScoreNumber}>{ratingAvgScore}</Text>
                <View style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={13} color="#F59E0B" fill="#F59E0B" />
                  ))}
                </View>
                <Text style={styles.ratingScoreSub}>
                  Skor Kepuasan Kemitraan
                </Text>
              </View>

              <View style={styles.criteriaBox}>
                <View style={styles.criteriaRow}>
                  <Text style={styles.criteriaLabel}>
                    Kelancaran Komunikasi:
                  </Text>
                  <View style={styles.criteriaScorePill}>
                    <Star size={10} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.criteriaScoreVal}>
                      {ratingAvgScore}
                    </Text>
                  </View>
                </View>

                <View style={styles.criteriaRow}>
                  <Text style={styles.criteriaLabel}>
                    Kualitas Brief & Tugas:
                  </Text>
                  <View style={styles.criteriaScorePill}>
                    <Star size={10} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.criteriaScoreVal}>
                      {ratingAvgScore}
                    </Text>
                  </View>
                </View>

                <View style={styles.criteriaRow}>
                  <Text style={styles.criteriaLabel}>
                    Ketepatan Pencairan Escrow:
                  </Text>
                  <View style={styles.criteriaScorePillEmerald}>
                    <ShieldCheck size={10} color={COLORS.success} />
                    <Text style={styles.criteriaScoreValEmerald}>
                      100% Aman
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Testimonials List */}
            <View style={styles.testimonialsWrap}>
              <Text style={styles.testimonialsHeading}>
                Ulasan Terbaru ({studentReviews.length})
              </Text>

              {studentReviews.map((rev) => (
                <View key={rev.id} style={styles.reviewCardItem}>
                  <View style={styles.reviewCardHeader}>
                    <View style={styles.reviewerAvatarFrame}>
                      <GraduationCap size={15} color={COLORS.brandIndigo} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewerName} numberOfLines={1}>
                        {rev.nama}
                      </Text>
                      <Text style={styles.reviewerCampus} numberOfLines={1}>
                        🇮🇩 {rev.kampus} • {rev.waktu}
                      </Text>
                    </View>
                    <View style={styles.reviewStarPill}>
                      <Star size={10} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.reviewStarPillText}>
                        {typeof rev.rating === "number"
                          ? rev.rating.toFixed(1)
                          : "5.0"}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.reviewComment}>"{rev.pesan}"</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ================================================================= */}
          {/* 10. ACTION & WORKROOM BUTTONS (Apple Pebble Style)                */}
          {/* ================================================================= */}
          <View style={styles.actionSectionBox}>
            <View style={styles.budgetHighlightRow}>
              <View>
                <Text style={styles.budgetHighlightLabel}>
                  Batas Anggaran Proyek
                </Text>
                <Text style={styles.budgetHighlightVal}>
                  {formatCurrency(budgetMax)}
                </Text>
              </View>
              <View style={styles.zeroCutBadge}>
                <CheckCircle2 size={11} color={COLORS.success} />
                <Text style={styles.zeroCutText}>0% Potongan Komisi</Text>
              </View>
            </View>

            {/* Action Button: Apply or Status */}
            {canApply ? (
              <PebbleButton
                variant="sapphire"
                size="md"
                label={`Lamar Proyek Ini (${formatCurrency(budgetMax)})`}
                icon={Send}
                onPress={handleApplyPress}
                style={{ width: "100%", marginBottom: 8 }}
              />
            ) : myExistingProposal ? (
              <View style={styles.appliedSuccessBanner}>
                <CheckCircle2 size={16} color={COLORS.success} />
                <Text style={styles.appliedSuccessText}>
                  {isAcceptedProposal
                    ? "Lamaran Diterima Klien UMKM"
                    : myExistingProposal.status === "REJECTED"
                      ? "Lamaran Tidak Terpilih"
                      : "Lamaran Anda Sedang Ditinjau"}
                </Text>
              </View>
            ) : expired ? (
              <View style={styles.expiredBanner}>
                <Clock size={15} color={COLORS.error} />
                <Text style={styles.expiredBannerText}>
                  Penerimaan Proposal Ditutup (Tenggat Berakhir)
                </Text>
              </View>
            ) : null}

            {/* Secondary Button: Open Chat & Workroom */}
            <PebbleButton
              variant="pearl"
              size="md"
              label="Buka Ruang Kerja & Obrolan"
              icon={MessageSquare}
              onPress={handleOpenChat}
              style={{ width: "100%" }}
            />
          </View>

          {/* ================================================================= */}
          {/* 11. MANAGEMENT FOR UMKM OWNER                                     */}
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
                          <Link2 size={14} color={COLORS.brandIndigo} />
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

          {/* Spacer */}
          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      {/* ===================================================================== */}
      {/* 12. FLOATING CHAT PILL WIDGET                                         */}
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
              <Building2 size={13} color={COLORS.brandIndigo} />
            </View>
          )}
          <View style={styles.floatingOnlineDot} />
        </View>
        <Text style={styles.floatingChatText}>Chat Mitra</Text>
      </TouchableOpacity>

      {/* ===================================================================== */}
      {/* 13. PERSISTENT STICKY BOTTOM ACTION BAR (Single Clean Budget)         */}
      {/* ===================================================================== */}
      <View style={styles.stickyBottomBar}>
        <View style={styles.stickyContentRow}>
          <View style={styles.stickyPriceCol}>
            <Text style={styles.stickyPriceLabel}>BATAS ANGGARAN</Text>
            <Text
              style={styles.stickyPriceValue}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {formatCurrency(budgetMax)}
            </Text>
          </View>

          <View style={styles.stickyActionCol}>
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
                <CheckCircle2 size={13} color={COLORS.success} />
                <Text style={styles.appliedPillText}>
                  {isAcceptedProposal
                    ? "Lamaran Diterima"
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
    backgroundColor: COLORS.bgDark || "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  /* 1. Hero Media Banner */
  bannerContainer: {
    width: "100%",
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    marginBottom: 14,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.8)",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlayGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },
  bannerCategoryPill: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  bannerCategoryText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  bannerEscrowPill: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.9)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  bannerEscrowText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  bannerBottomWatermark: {
    position: "absolute",
    bottom: 10,
    left: 12,
    right: 12,
  },
  bannerWatermarkText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: "rgba(255, 255, 255, 0.95)",
    fontWeight: "700",
  },

  /* 2. Seller Identity Header */
  sellerHeaderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    marginBottom: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  sellerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E2E8F0",
  },
  sellerAvatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  sellerOnlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  sellerMetaCol: {
    flex: 1,
    gap: 2,
  },
  sellerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  sellerName: {
    fontSize: 14,
    fontFamily: FONTS.displayBold,
    color: COLORS.textDark,
    fontWeight: "700",
    flex: 1,
  },
  verifiedClientPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    flexShrink: 0,
  },
  verifiedClientPillText: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyBold,
    color: COLORS.success,
    fontWeight: "700",
  },
  sellerSubText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textMuted,
  },

  /* 3. Headline Card */
  headlineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    marginBottom: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: COLORS.canvasSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  categoryBadgeText: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textDark,
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeOpen: {
    backgroundColor: COLORS.successBg,
  },
  statusBadgeInProgress: {
    backgroundColor: COLORS.brandIndigoLight,
  },
  statusBadgeOther: {
    backgroundColor: "#F1F5F9",
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    fontWeight: "700",
  },
  statusTextOpen: {
    color: COLORS.success,
  },
  statusTextInProgress: {
    color: COLORS.brandIndigo,
  },
  statusTextOther: {
    color: COLORS.textMuted,
  },
  matchScoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.25)",
  },
  matchScoreBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: COLORS.success,
    fontWeight: "700",
  },
  gigHeadline: {
    fontSize: 18,
    fontFamily: FONTS.displayBold,
    color: COLORS.textDark,
    fontWeight: "800",
    lineHeight: 24,
    marginBottom: 8,
  },
  descriptionWrapper: {
    gap: 4,
  },
  gigDescription: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  moreToggleBtn: {
    alignSelf: "flex-start",
    marginTop: 2,
  },
  moreToggleText: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyBold,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },

  /* 4. 4-Stat Metrics Bar */
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
  },
  statLabel: {
    fontSize: 10,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  statValuePrimary: {
    fontSize: 13.5,
    fontFamily: FONTS.displayBold,
    color: COLORS.brandIndigo,
    fontWeight: "800",
    marginTop: 2,
  },
  statValueDark: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textDark,
    fontWeight: "700",
    marginTop: 2,
  },
  statValueSuccess: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyBold,
    color: COLORS.success,
    fontWeight: "700",
    marginTop: 2,
  },

  /* 5. Section Box & Deliverables List */
  sectionBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    marginBottom: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: FONTS.displayBold,
    color: COLORS.textMuted,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  deliverablesList: {
    gap: 10,
  },
  deliverableItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  deliverableIconWrapIndigo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  deliverableIconWrapCyan: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#ECFEFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  deliverableIconWrapEmerald: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.successBg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  deliverableIconWrapAmber: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  deliverableTitle: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textDark,
    fontWeight: "700",
  },
  deliverableDesc: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginTop: 1,
  },

  /* 6. Slots List */
  slotsListWrap: {
    gap: 8,
  },
  slotCardItem: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    backgroundColor: COLORS.canvasSoft,
  },
  slotHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  slotItemTitle: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textDark,
    fontWeight: "700",
  },
  slotItemBudget: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: COLORS.brandIndigo,
    fontWeight: "700",
    marginTop: 1,
  },
  slotItemDesc: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  slotBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  slotBadgeOpen: {
    backgroundColor: COLORS.successBg,
  },
  slotBadgeDone: {
    backgroundColor: COLORS.brandIndigoLight,
  },
  slotBadgeFilled: {
    backgroundColor: "#F1F5F9",
  },
  slotBadgeText: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyBold,
    fontWeight: "700",
  },
  slotBadgeTextOpen: {
    color: COLORS.success,
  },
  slotBadgeTextDone: {
    color: COLORS.brandIndigo,
  },
  slotBadgeTextFilled: {
    color: COLORS.textMuted,
  },

  /* 7. Match Score */
  matchScorePill: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.25)",
  },
  matchScoreText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: COLORS.success,
    fontWeight: "700",
  },
  matchIntroText: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 17,
  },
  bulletList: {
    gap: 6,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  bulletText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textDark,
    flex: 1,
    lineHeight: 16,
  },

  /* 8. Skills */
  skillsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.2)",
  },
  skillPillText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },

  /* 9. Ratings & Reviews */
  reviewVerifiedBadge: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  ratingHeroRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  ratingScoreBox: {
    width: "40%",
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  ratingScoreNumber: {
    fontSize: 28,
    fontFamily: FONTS.displayBold,
    color: COLORS.textDark,
    fontWeight: "900",
  },
  starRow: {
    flexDirection: "row",
    gap: 2,
    marginVertical: 3,
  },
  ratingScoreSub: {
    fontSize: 9,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  criteriaBox: {
    flex: 1,
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 14,
    padding: 10,
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  criteriaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  criteriaLabel: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textSecondary,
    flex: 1,
    paddingRight: 4,
  },
  criteriaScorePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  criteriaScoreVal: {
    fontSize: 9,
    fontFamily: FONTS.bodyBold,
    color: "#B45309",
    fontWeight: "700",
  },
  criteriaScorePillEmerald: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  criteriaScoreValEmerald: {
    fontSize: 8.5,
    fontFamily: FONTS.bodyBold,
    color: COLORS.success,
    fontWeight: "700",
  },
  testimonialsWrap: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    paddingTop: 10,
  },
  testimonialsHeading: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textDark,
    fontWeight: "700",
    marginBottom: 2,
  },
  reviewCardItem: {
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    gap: 4,
  },
  reviewCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reviewerAvatarFrame: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  reviewerName: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textDark,
    fontWeight: "700",
  },
  reviewerCampus: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textMuted,
  },
  reviewStarPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  reviewStarPillText: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyBold,
    color: "#B45309",
    fontWeight: "700",
  },
  reviewComment: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    lineHeight: 15,
    paddingLeft: 34,
  },

  /* 10. Action Section Box */
  actionSectionBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    marginBottom: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  budgetHighlightRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    paddingBottom: 12,
  },
  budgetHighlightLabel: {
    fontSize: 10,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  budgetHighlightVal: {
    fontSize: 20,
    fontFamily: FONTS.displayBold,
    color: COLORS.textDark,
    fontWeight: "900",
    marginTop: 1,
  },
  zeroCutBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  zeroCutText: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyBold,
    color: COLORS.success,
    fontWeight: "700",
  },
  appliedSuccessBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.successBg,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 8,
  },
  appliedSuccessText: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: COLORS.success,
    fontWeight: "700",
  },
  expiredBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FEE2E2",
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 8,
  },
  expiredBannerText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: COLORS.error,
    fontWeight: "700",
  },

  /* 11. UMKM Management */
  managementSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    marginBottom: 14,
  },
  tabContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: COLORS.canvasSoft,
  },
  tabButtonActive: {
    backgroundColor: COLORS.brandIndigoLight,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.3)",
  },
  tabText: {
    fontSize: 11,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
  },
  tabTextActive: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  tabContent: {
    gap: 8,
  },
  emptyBox: {
    padding: 20,
    alignItems: "center",
    gap: 6,
  },
  emptyText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  submissionCard: {
    backgroundColor: COLORS.canvasSoft,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  submissionTitle: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textDark,
  },
  submittedLinkBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  submittedLinkText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.brandIndigo,
    flex: 1,
  },

  /* 12. Floating Chat Widget */
  floatingChatPill: {
    position: "absolute",
    bottom: 84,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.brandIndigo,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 100,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingAvatarWrap: {
    position: "relative",
  },
  floatingAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  floatingAvatarFallback: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingOnlineDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.success,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  floatingChatText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  /* 13. Sticky Bottom Bar */
  stickyBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 232, 240, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  },
  stickyContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  stickyPriceCol: {
    flex: 1,
  },
  stickyPriceLabel: {
    fontSize: 9,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textMuted,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  stickyPriceValue: {
    fontSize: 16,
    fontFamily: FONTS.displayBold,
    color: COLORS.textDark,
    fontWeight: "800",
    marginTop: 1,
  },
  stickyActionCol: {
    flexShrink: 0,
  },
  appliedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
  },
  appliedPillText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: COLORS.success,
    fontWeight: "700",
  },
});
