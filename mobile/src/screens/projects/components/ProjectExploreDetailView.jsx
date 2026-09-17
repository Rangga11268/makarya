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
  Building2,
  CheckCircle2,
  FileCheck,
  Link2,
  ChevronDown,
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
            waktu: "Maret 27",
            pesan:
              "Mitra UMKM sangat komunikatif, memberikan arahan yang presisi dan cepat tanggap. Dana escrow langsung dicairkan begitu berkas deliverable disetujui!",
          },
          {
            id: "rev-default-2",
            nama: "Ahmad Fikri",
            kampus: "Universitas BSI",
            rating: 5.0,
            waktu: "Februari 14",
            pesan:
              "Pengalaman kolaborasi yang memuaskan. Brief pengerjaan sangat terstruktur dan e-sertifikat digital ber-QR langsung otomatis terbit ke profil.",
          },
          {
            id: "rev-default-3",
            nama: "Sarah Nabila",
            kampus: "Universitas Indonesia",
            rating: 5.0,
            waktu: "Januari 29",
            pesan:
              "Kerja sama sangat transparan. Rekomendasi terbaik untuk mahasiswa yang ingin menambah portofolio riil UMKM terpercaya.",
          },
        ];

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
          {/* 1. HERO MEDIA BANNER (Edge-to-Edge Fiverr Style Cover Image)      */}
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
              <Briefcase size={11} color="#FFFFFF" />
              <Text style={styles.bannerCategoryText}>
                {project.kategori
                  ? String(project.kategori).toUpperCase()
                  : "UMKM DIGITAL"}
              </Text>
            </View>

            {/* Carousel Page Counter Indicator (Fiverr Pro 1/2) */}
            <View style={styles.bannerPageBadge}>
              <Text style={styles.bannerPageText}>1/2</Text>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 2. SELLER / MITRA UMKM IDENTITY (Forensic Fiverr Pro Header)      */}
          {/* ================================================================= */}
          <View style={styles.sellerHeaderCard}>
            <View style={styles.sellerRow}>
              {/* Avatar with Status Dot */}
              <View style={styles.avatarContainer}>
                {clientPhoto ? (
                  <Image
                    source={{ uri: clientPhoto }}
                    style={styles.sellerAvatar}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.sellerAvatarFallback}>
                    <Building2 size={20} color="#2563EB" />
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
                  <ChevronDown
                    size={18}
                    color="#0F172A"
                    style={styles.chevronIcon}
                  />
                </View>

                {/* Fiverr Style Badges Row */}
                <View style={styles.badgesWrapper}>
                  {/* Amber Badge: Top Rated / Mitra Terpilih ◆◆◆ */}
                  <View style={styles.topRatedPill}>
                    <Text style={styles.topRatedText}>
                      Mitra Terpilih{" "}
                      <Text style={styles.diamondSymbols}>◆◆◆</Text>
                    </Text>
                  </View>

                  {/* Indigo Badge: Vetted Pro / 100% Escrow */}
                  <View style={styles.vettedProPill}>
                    <Text style={styles.vettedProText}>100% Escrow</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 3. HEADLINE & BRIEF SECTION                                       */}
          {/* ================================================================= */}
          <View style={styles.headlineSection}>
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
                    {isBriefExpanded ? "tutup ringkasan" : "more"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ================================================================= */}
          {/* 4. SINGLE PACKAGE PRICING & SPECS (Forensic Fiverr Screen 4)      */}
          {/* ================================================================= */}
          <View style={styles.packageSection}>
            <View style={styles.packageDetailBody}>
              <View style={styles.packageHeaderRow}>
                <Text style={styles.packageDetailTitle}>
                  {isTeam ? "Paket Kolaborasi Tim" : "Paket Pengerjaan Tuntas"}
                </Text>
                <Text style={styles.packagePriceHighlight}>
                  {formatCurrency(budgetMax)}
                </Text>
              </View>

              <Text style={styles.packageDetailDesc}>
                Pengerjaan deliverable tuntas bergaransi escrow dengan proteksi
                0% komisi bagi talenta mahasiswa.
              </Text>

              {/* Spec Key-Value Table (Forensic to Fiverr Screen 4) */}
              <View style={styles.specKeyValues}>
                <View style={styles.specKeyValueRow}>
                  <Text style={styles.specKeyText}>Batas Revisi</Text>
                  <Text style={styles.specValueText}>
                    2x Revisi Terstruktur
                  </Text>
                </View>

                <View style={styles.specKeyValueRow}>
                  <Text style={styles.specKeyText}>Tenggat Pengerjaan</Text>
                  <Text style={styles.specValueText}>
                    {formatDate(project.deadline)}
                  </Text>
                </View>

                <View style={styles.specKeyValueRow}>
                  <Text style={styles.specKeyText}>Cakupan Kerja</Text>
                  <Text style={styles.specValueText}>
                    {isTeam
                      ? "Formasi Tim Kolaborasi"
                      : "Pengerjaan Mandiri Tuntas"}
                  </Text>
                </View>

                <View style={styles.specKeyValueRow}>
                  <Text style={styles.specKeyText}>Sertifikat Portofolio</Text>
                  <Text style={styles.specValueText}>Resmi Ber-QR (SKPI)</Text>
                </View>

                <View style={styles.specKeyValueRow}>
                  <Text style={styles.specKeyText}>Proteksi Pembayaran</Text>
                  <Text style={[styles.specValueText, { color: "#059669" }]}>
                    Garansi Escrow 100% Aman
                  </Text>
                </View>
              </View>

              {/* Apply / CTA Button (Apple-Style Signature PebbleButton) */}
              <View style={styles.packageCtaWrapper}>
                {canApply ? (
                  <PebbleButton
                    variant="sapphire"
                    size="md"
                    label={`Lamar Proyek (${formatCurrency(budgetMax)})`}
                    icon={Send}
                    onPress={handleApplyPress}
                    style={{ width: "100%" }}
                  />
                ) : myExistingProposal ? (
                  <View style={styles.appliedSuccessBanner}>
                    <CheckCircle2 size={16} color="#059669" />
                    <Text style={styles.appliedSuccessText}>
                      {isAcceptedProposal
                        ? "Lamaran Diterima Klien UMKM"
                        : myExistingProposal.status === "REJECTED"
                          ? "Lamaran Tidak Terpilih"
                          : "Lamaran Berhasil Dikirim"}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Vetted By Fiverr / Makarya Pro Box */}
              <View style={styles.vettedProBox}>
                <Text style={styles.vettedProBoxTitle}>
                  Terverifikasi oleh Makarya Pro
                </Text>
                <Text style={styles.vettedProBoxDesc}>
                  {clientDisplayName || "Mitra UMKM"} telah melewati verifikasi
                  kelayakan usaha dan dana honor diamankan sepenuhnya di Escrow
                  Makarya.
                </Text>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 5. PROFILE MATCH (FOR MAHASISWA)                                  */}
          {/* ================================================================= */}
          {isMahasiswa && (matchScore > 0 || matchReasons.length > 0) && (
            <View style={styles.editorialCard}>
              <View style={styles.editorialHeaderRow}>
                <Sparkles size={16} color="#2563EB" />
                <Text style={styles.editorialTitle}>Kecocokan Profil Anda</Text>
                <View style={styles.matchScorePill}>
                  <Text style={styles.matchScoreText}>
                    {matchScore || 85}% Cocok
                  </Text>
                </View>
              </View>

              <Text style={styles.editorialBody}>
                Sistem AI Makarya mendeteksi bahwa keahlian Anda sangat sesuai
                dengan kriteria deliverable proyek ini:
              </Text>

              <View style={styles.bulletList}>
                {matchReasons.length > 0 ? (
                  matchReasons.map((reason, idx) => (
                    <View key={idx} style={styles.bulletItem}>
                      <CheckCircle2
                        size={13}
                        color="#2563EB"
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
                        color="#2563EB"
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
                        color="#2563EB"
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
          {/* 6. REQUIRED SKILLS & TECH STACK                                   */}
          {/* ================================================================= */}
          <View style={styles.editorialCard}>
            <View style={styles.editorialHeaderRow}>
              <Layers size={16} color="#0F172A" />
              <Text style={styles.editorialTitle}>
                Keahlian yang Dibutuhkan
              </Text>
            </View>

            <View style={styles.skillsWrapper}>
              {skillsList.map((skill, sIdx) => (
                <View key={sIdx} style={styles.skillPill}>
                  <Check size={11} color="#0F172A" />
                  <Text style={styles.skillPillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ================================================================= */}
          {/* 7. TEAM SLOTS BREAKDOWN (IF TEAM COLLABORATION)                   */}
          {/* ================================================================= */}
          {isTeam && slots.length > 0 && (
            <View style={styles.editorialCard}>
              <View style={styles.editorialHeaderRow}>
                <Users size={16} color="#0F172A" />
                <Text style={styles.editorialTitle}>
                  Formasi Tim ({slots.length} Posisi)
                </Text>
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
          {/* 8. CLIENT RATING & TRUST BREAKDOWN (Forensic to Fiverr Screen 3)  */}
          {/* ================================================================= */}
          <View style={styles.fiverrRatingSection}>
            {/* 5-Star Hero & Big Score */}
            <View style={styles.fiverrRatingHero}>
              <View style={styles.fiverrStarRow}>
                <Star size={18} color="#0F172A" fill="#0F172A" />
                <Star size={18} color="#0F172A" fill="#0F172A" />
                <Star size={18} color="#0F172A" fill="#0F172A" />
                <Star size={18} color="#0F172A" fill="#0F172A" />
                <Star size={18} color="#0F172A" fill="#0F172A" />
              </View>
              <Text style={styles.fiverrBigScore}>{ratingAvgScore}</Text>
            </View>

            {/* Criteria Key-Value Breakdown */}
            <View style={styles.fiverrCriteriaList}>
              <View style={styles.fiverrCriteriaRow}>
                <Text style={styles.fiverrCriteriaLabel}>
                  Kelancaran komunikasi mitra
                </Text>
                <View style={styles.fiverrCriteriaScoreBox}>
                  <Star size={12} color="#0F172A" fill="#0F172A" />
                  <Text style={styles.fiverrCriteriaScoreVal}>
                    {ratingAvgScore}
                  </Text>
                </View>
              </View>

              <View style={styles.fiverrCriteriaRow}>
                <Text style={styles.fiverrCriteriaLabel}>
                  Kualitas brief & penugasan
                </Text>
                <View style={styles.fiverrCriteriaScoreBox}>
                  <Star size={12} color="#0F172A" fill="#0F172A" />
                  <Text style={styles.fiverrCriteriaScoreVal}>
                    {ratingAvgScore}
                  </Text>
                </View>
              </View>

              <View style={styles.fiverrCriteriaRow}>
                <Text style={styles.fiverrCriteriaLabel}>
                  Ketepatan pencairan escrow
                </Text>
                <View style={styles.fiverrCriteriaScoreBox}>
                  <Star size={12} color="#0F172A" fill="#0F172A" />
                  <Text style={styles.fiverrCriteriaScoreVal}>5.0</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 9. HORIZONTAL REVIEWS CAROUSEL (Forensic to Fiverr Screen 2 & 3)  */}
          {/* ================================================================= */}
          <View style={styles.fiverrReviewsSection}>
            <View style={styles.fiverrReviewsHeaderRow}>
              <Text style={styles.fiverrReviewsTitle}>
                {totalReviewsCount} ulasan
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.fiverrSeeAllText}>Lihat Semua</Text>
              </TouchableOpacity>
            </View>

            {/* Horizontal Scrollable Carousel */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.reviewsScrollContainer}
            >
              {studentReviews.map((rev) => (
                <View key={rev.id} style={styles.fiverrReviewCard}>
                  {/* Top Reviewer Info */}
                  <View style={styles.fiverrReviewerHeader}>
                    <View style={styles.fiverrReviewerAvatarBox}>
                      <GraduationCap size={16} color="#2563EB" />
                    </View>
                    <View style={styles.fiverrReviewerMeta}>
                      <Text style={styles.fiverrReviewerName} numberOfLines={1}>
                        {rev.nama}
                      </Text>
                      <Text
                        style={styles.fiverrReviewerCampus}
                        numberOfLines={1}
                      >
                        🇮🇩 {rev.kampus}
                      </Text>
                    </View>
                  </View>

                  {/* Review Text Body */}
                  <Text style={styles.fiverrReviewText} numberOfLines={3}>
                    {rev.pesan}
                  </Text>

                  {/* Bottom Score & Date */}
                  <View style={styles.fiverrReviewBottomRow}>
                    <View style={styles.fiverrReviewScoreBox}>
                      <Star size={11} color="#0F172A" fill="#0F172A" />
                      <Text style={styles.fiverrReviewScoreText}>
                        {rev.rating.toFixed(1)}
                      </Text>
                    </View>
                    <Text style={styles.fiverrReviewDateText}>{rev.waktu}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* ================================================================= */}
          {/* 10. CLIENT UMKM PROFILE & LOCATION                                */}
          {/* ================================================================= */}
          <View style={styles.editorialCard}>
            <View style={styles.editorialHeaderRow}>
              <Building2 size={16} color="#0F172A" />
              <Text style={styles.editorialTitle}>Profil Usaha Klien</Text>
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
                    {project.umkm_profile?.bidang_industri || "Mitra UMKM"} •{" "}
                    {project.lokasi ||
                      project.umkm_profile?.kota ||
                      "Indonesia"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 11. TALENT BENEFITS & VERIFIED CERTIFICATION                      */}
          {/* ================================================================= */}
          <View style={styles.editorialCard}>
            <View style={styles.editorialHeaderRow}>
              <Award size={16} color="#0F172A" />
              <Text style={styles.editorialTitle}>
                Jaminan & Keuntungan Mahasiswa
              </Text>
            </View>

            <View style={styles.benefitItemsWrap}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIconBoxEmerald}>
                  <ShieldCheck size={15} color="#059669" />
                </View>
                <View style={styles.benefitTextBox}>
                  <Text style={styles.benefitItemTitle}>
                    100% Jaminan Escrow
                  </Text>
                  <Text style={styles.benefitItemDesc}>
                    Dana honor Anda telah diamankan di sistem Makarya sebelum
                    pengerjaan dimulai dan dicairkan segera setelah pekerjaan
                    disetujui.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <View style={styles.benefitIconBoxBlue}>
                  <Award size={15} color="#2563EB" />
                </View>
                <View style={styles.benefitTextBox}>
                  <Text style={styles.benefitItemTitle}>
                    E-Sertifikat Digital Resmi
                  </Text>
                  <Text style={styles.benefitItemDesc}>
                    Otomatis mendapatkan sertifikat ber-QR terverifikasi
                    bertanda tangan digital UMKM untuk portofolio & konversi
                    SKPI kampus.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 12. MANAGEMENT FOR UMKM OWNER                                     */}
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

          {/* Bottom spacer */}
          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      {/* ===================================================================== */}
      {/* 13. FLOATING CHAT PILL WIDGET (Forensic Fiverr Pro Widget)            */}
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
              <Building2 size={13} color="#2563EB" />
            </View>
          )}
          <View style={styles.floatingOnlineDot} />
        </View>
        <Text style={styles.floatingChatText}>Chat</Text>
      </TouchableOpacity>

      {/* ===================================================================== */}
      {/* 14. PERSISTENT STICKY BOTTOM ACTION BAR                               */}
      {/* ===================================================================== */}
      <View style={styles.stickyBottomBar}>
        <View style={styles.stickyContentRow}>
          <View style={styles.stickyPriceCol}>
            <Text style={styles.stickyPriceLabel}>ESTIMASI HONOR</Text>
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
                label="Ajukan Lamaran"
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  /* 1. Hero Media Banner */
  bannerContainer: {
    width: "100%",
    height: 195,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    marginBottom: 16,
    backgroundColor: "#0F172A",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlayGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.15)",
  },
  bannerCategoryPill: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 6,
  },
  bannerCategoryText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  bannerPageBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  bannerPageText: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyBold,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  /* 2. Seller Identity Header (Forensic Fiverr Pro) */
  sellerHeaderCard: {
    paddingBottom: 14,
    marginBottom: 14,
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
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E2E8F0",
  },
  sellerAvatarFallback: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  sellerOnlineDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#94A3B8",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  sellerMetaCol: {
    flex: 1,
    gap: 4,
  },
  sellerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sellerName: {
    fontSize: 15.5,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "800",
    flex: 1,
    paddingRight: 6,
  },
  chevronIcon: {
    marginLeft: "auto",
  },
  badgesWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  topRatedPill: {
    backgroundColor: "#FFF1DB",
    paddingHorizontal: 7.5,
    paddingVertical: 3,
    borderRadius: 5,
  },
  topRatedText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: "#B45309",
    fontWeight: "800",
  },
  diamondSymbols: {
    fontSize: 8.5,
    color: "#B45309",
    letterSpacing: 1.5,
  },
  vettedProPill: {
    backgroundColor: "#ECECFF",
    paddingHorizontal: 7.5,
    paddingVertical: 3,
    borderRadius: 5,
  },
  vettedProText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: "#4F46E5",
    fontWeight: "800",
  },

  /* 3. Headline & Description */
  headlineSection: {
    paddingBottom: 16,
    gap: 10,
  },
  gigHeadline: {
    fontSize: 21,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "900",
    lineHeight: 28,
  },
  descriptionWrapper: {
    gap: 4,
  },
  gigDescription: {
    fontSize: 13.5,
    fontFamily: FONTS.bodyRegular,
    color: "#334155",
    lineHeight: 21,
  },
  moreToggleBtn: {
    alignSelf: "flex-start",
    marginTop: 2,
  },
  moreToggleText: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "800",
    textDecorationLine: "underline",
  },

  /* 4. Single Package Price & Specs */
  packageSection: {
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 16,
  },
  packageDetailBody: {
    gap: 14,
  },
  packageHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  packageDetailTitle: {
    fontSize: 16,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "800",
    flex: 1,
  },
  packagePriceHighlight: {
    fontSize: 18,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "900",
  },
  packageDetailDesc: {
    fontSize: 13,
    fontFamily: FONTS.bodyRegular,
    color: "#475569",
    lineHeight: 19,
    marginTop: -4,
  },
  specKeyValues: {
    gap: 12,
    marginTop: 4,
  },
  specKeyValueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  specKeyText: {
    fontSize: 13,
    fontFamily: FONTS.bodyRegular,
    color: "#475569",
  },
  specValueText: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  packageCtaWrapper: {
    marginTop: 6,
  },
  appliedSuccessBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  appliedSuccessText: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: "#059669",
    fontWeight: "700",
  },
  vettedProBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 4,
    marginTop: 4,
  },
  vettedProBoxTitle: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "800",
  },
  vettedProBoxDesc: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
    lineHeight: 16.5,
  },

  /* 5. Editorial Cards (Profile Match, Skills, Team) */
  editorialCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
  },
  editorialHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  editorialTitle: {
    fontSize: 14,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "800",
    flex: 1,
  },
  matchScorePill: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  matchScoreText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: "#2563EB",
    fontWeight: "800",
  },
  editorialBody: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyRegular,
    color: "#475569",
    lineHeight: 18,
    marginBottom: 10,
  },
  bulletList: {
    gap: 8,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  bulletText: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyRegular,
    color: "#334155",
    flex: 1,
    lineHeight: 18,
  },

  /* 6. Skills Wrapper */
  skillsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  skillPillText: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },

  /* 7. Slots Formasi Tim */
  slotsListWrap: {
    gap: 8,
  },
  slotCardItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 4,
  },
  slotHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  slotItemTitle: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "800",
  },
  slotItemBudget: {
    fontSize: 11.5,
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

  /* 8. Fiverr Forensic Rating Section (Screen 3) */
  fiverrRatingSection: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginBottom: 16,
    gap: 14,
  },
  fiverrRatingHero: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fiverrStarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  fiverrBigScore: {
    fontSize: 22,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "900",
  },
  fiverrCriteriaList: {
    gap: 10,
  },
  fiverrCriteriaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fiverrCriteriaLabel: {
    fontSize: 13,
    fontFamily: FONTS.bodyRegular,
    color: "#475569",
  },
  fiverrCriteriaScoreBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  fiverrCriteriaScoreVal: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "800",
  },

  /* 9. Horizontal Reviews Carousel (Screen 2 & 3) */
  fiverrReviewsSection: {
    marginBottom: 18,
  },
  fiverrReviewsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  fiverrReviewsTitle: {
    fontSize: 16,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "900",
  },
  fiverrSeeAllText: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "800",
  },
  reviewsScrollContainer: {
    paddingRight: 16,
    gap: 12,
  },
  fiverrReviewCard: {
    width: 260,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },
  fiverrReviewerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fiverrReviewerAvatarBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  fiverrReviewerMeta: {
    flex: 1,
  },
  fiverrReviewerName: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "800",
  },
  fiverrReviewerCampus: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
    marginTop: 1,
  },
  fiverrReviewText: {
    fontSize: 12,
    fontFamily: FONTS.bodyRegular,
    color: "#334155",
    lineHeight: 17,
  },
  fiverrReviewBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  fiverrReviewScoreBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  fiverrReviewScoreText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "800",
  },
  fiverrReviewDateText: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyRegular,
    color: "#94A3B8",
  },

  /* 10. Client Profile Row */
  clientProfileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  clientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E2E8F0",
  },
  clientAvatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  clientInfoCol: {
    flex: 1,
    gap: 3,
  },
  clientNameText: {
    fontSize: 14.5,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "800",
  },
  clientMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  verifiedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  verifiedTagText: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyBold,
    color: "#059669",
    fontWeight: "800",
  },
  clientMetaDot: {
    fontSize: 10,
    color: "#94A3B8",
  },
  locationText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
    flex: 1,
  },

  /* 11. Benefits */
  benefitItemsWrap: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  benefitIconBoxEmerald: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  benefitIconBoxBlue: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  benefitTextBox: {
    flex: 1,
  },
  benefitItemTitle: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "800",
  },
  benefitItemDesc: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
    lineHeight: 16.5,
    marginTop: 2,
  },

  /* 12. Management Section */
  managementSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
  },
  tabContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  tabButtonActive: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#6366F1",
  },
  tabText: {
    fontSize: 11,
    fontFamily: FONTS.bodyMedium,
    color: "#64748B",
  },
  tabTextActive: {
    fontFamily: FONTS.bodyBold,
    color: "#4F46E5",
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
    color: "#94A3B8",
    textAlign: "center",
  },
  submissionCard: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
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

  /* 13. Floating Chat Widget */
  floatingChatPill: {
    position: "absolute",
    bottom: 84,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0F172A",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
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
    backgroundColor: "#EFF6FF",
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
    backgroundColor: "#10B981",
    borderWidth: 1,
    borderColor: "#0F172A",
  },
  floatingChatText: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  /* 14. Sticky Bottom Action Bar */
  stickyBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
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
    color: "#94A3B8",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  stickyPriceValue: {
    fontSize: 16,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "900",
    marginTop: 1,
  },
  stickyActionCol: {
    flexShrink: 0,
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
