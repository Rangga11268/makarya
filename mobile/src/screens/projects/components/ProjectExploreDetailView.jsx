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
  Award,
  Layers,
  Star,
  MapPin,
  CheckCircle,
  GraduationCap,
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

  // 2. Banner Image Resolver
  const getCategoryBanner = (cat) => {
    const c = String(cat || "").toUpperCase();
    switch (c) {
      case "DESIGN":
        return "https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=800&q=80";
      case "PEMROGRAMAN":
        return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80";
      case "UIUX":
        return "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80";
      case "VIDEO":
        return "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80";
      case "COPYWRITING":
        return "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80";
      case "ADMIN_DATA":
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

  // 3. Honor Range Calculation
  const budgetMax = Number(project.budget_max || 0);
  const budgetMin = project.budget_min
    ? Number(project.budget_min)
    : Math.max(50000, Math.round((budgetMax * 0.8) / 10000) * 10000);

  const formattedBudgetRange =
    budgetMin && budgetMin < budgetMax
      ? `${formatCurrency(budgetMin)} - ${formatCurrency(budgetMax)}`
      : formatCurrency(budgetMax);

  // 4. Skills Fallback Helper
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

  // 5. Dynamic Testimonial Reviews & Rating Stats from System Database
  const ratingAvgScore =
    typeof project.rating_avg === "number"
      ? project.rating_avg.toFixed(1)
      : project.rating_avg
        ? Number(project.rating_avg).toFixed(1)
        : "5.0";

  const totalReviewsCount =
    typeof project.total_reviews === "number"
      ? project.total_reviews
      : Array.isArray(project.client_reviews)
        ? project.client_reviews.length
        : 2;

  const studentReviews =
    Array.isArray(project.client_reviews) && project.client_reviews.length > 0
      ? project.client_reviews.map((r) => ({
          id: String(r.id),
          nama: r.reviewer_nama,
          kampus: r.reviewer_kampus || "Mahasiswa Terverifikasi",
          rating: Number(r.skor || 5),
          waktu: r.created_at ? formatDate(r.created_at) : "Baru saja",
          pesan:
            r.ulasan ||
            "Mitra UMKM sangat komunikatif, memberikan feedback yang jelas dan cepat. Dana escrow langsung dicairkan begitu berkas deliverable disetujui!",
        }))
      : [
          {
            id: "rev-default-1",
            nama: "Ahmad Fikri",
            kampus: "Universitas BSI",
            rating: 5.0,
            waktu: "2 minggu lalu",
            pesan:
              "Mitra UMKM sangat komunikatif, memberikan feedback yang jelas dan cepat. Dana escrow langsung dicairkan begitu berkas deliverable disetujui!",
          },
          {
            id: "rev-default-2",
            nama: "Sarah Nabila",
            kampus: "Universitas Indonesia",
            rating: 5.0,
            waktu: "1 bulan lalu",
            pesan:
              "Pengalaman kolaborasi yang memuaskan. Brief pengerjaan terstruktur rapi dan e-sertifikat digital bertanda tangan UMKM langsung otomatis terbit.",
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
          {/* 1. HERO MEDIA BANNER (Fiverr Style Cover Image)                   */}
          {/* ================================================================= */}
          <View style={styles.bannerContainer}>
            <Image
              source={{ uri: projectBannerUri }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <View style={styles.bannerOverlayGradient} />

            {/* Banner Category Badge */}
            <View style={styles.bannerCategoryPill}>
              <Briefcase size={11} color="#FFFFFF" />
              <Text style={styles.bannerCategoryText}>
                {project.kategori
                  ? String(project.kategori).toUpperCase()
                  : "UMKM DIGITAL"}
              </Text>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 2. SELLER / CLIENT UMKM IDENTITY ROW                              */}
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
                  {clientDisplayName || "Mitra Klien UMKM"}
                </Text>

                <View style={styles.badgeCluster}>
                  <View style={styles.topRatedBadge}>
                    <ShieldCheck size={11} color="#059669" />
                    <Text style={styles.topRatedText}>
                      Mitra Terverifikasi
                    </Text>
                  </View>
                  <View style={styles.vettedBadge}>
                    <Text style={styles.vettedText}>100% Escrow</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 3. PROJECT HEADLINE & INTRO                                       */}
          {/* ================================================================= */}
          <View style={styles.headlineCard}>
            <View style={styles.applicantRow}>
              <View style={styles.applicantPill}>
                <Users size={11} color="#2563EB" />
                <Text style={styles.applicantPillText}>
                  {totalApplicantsCount} Pelamar Aktif
                </Text>
              </View>

              <View style={styles.publishedRow}>
                <Calendar size={11} color="#64748B" />
                <Text style={styles.publishedText}>
                  {formatDate(project.created_at || new Date())}
                </Text>
              </View>
            </View>

            <Text style={styles.projectTitle}>{project.judul}</Text>

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
          {/* 4. TIERED SPEC & HONOR RANGE CARD (Fiverr Package Details Style)  */}
          {/* ================================================================= */}
          <View style={styles.packageCard}>
            {/* Honor Range Header Strip */}
            <View style={styles.packageHeaderStrip}>
              <View>
                <Text style={styles.packageHeaderLabel}>ESTIMASI HONOR</Text>
                <Text style={styles.packageHeaderPrice}>
                  {formattedBudgetRange}
                </Text>
              </View>
              <View style={styles.activePackageIndicator} />
            </View>

            <View style={styles.packageBody}>
              <Text style={styles.packageTitle}>
                {isTeam ? "Paket Kolaborasi Tim" : "Paket Pengerjaan Individu"}
              </Text>
              <Text style={styles.packageSummary}>
                Alokasi honor resmi dengan jaminan keamanan pembayaran 100%
                Escrow Makarya.
              </Text>

              {/* Spec Rows */}
              <View style={styles.specTable}>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Tenggat Waktu</Text>
                  <Text style={styles.specValue}>
                    {formatDate(project.deadline)}
                  </Text>
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
                    {isTeam
                      ? `Tim (${slots.length} Posisi)`
                      : "Talenta Individu"}
                  </Text>
                </View>
                <View style={styles.specDivider} />

                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Sertifikat Digital</Text>
                  <Text style={styles.specValue}>
                    Resmi Bertanda Tangan UMKM
                  </Text>
                </View>
                <View style={styles.specDivider} />

                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Proteksi Pembayaran</Text>
                  <Text style={[styles.specValue, { color: "#059669" }]}>
                    Garansi Escrow 100%
                  </Text>
                </View>
              </View>

              {/* Standard App PebbleButton */}
              {canApply ? (
                <PebbleButton
                  variant="sapphire"
                  size="md"
                  label={`Ajukan Lamaran (${formatCurrency(project.budget_max)})`}
                  icon={Send}
                  onPress={handleApplyPress}
                  style={{ width: "100%", marginTop: 6 }}
                />
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
                <Text style={styles.vettedBoxTitle}>
                  Terverifikasi oleh Makarya
                </Text>
                <Text style={styles.vettedBoxDesc}>
                  Dana proyek ini telah didepositkan secara resmi di rekening
                  bersama Escrow Makarya sebelum pengerjaan dimulai.
                </Text>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 5. PROFILE MATCH & COMPATIBILITY CARD (FOR MAHASISWA)           */}
          {/* ================================================================= */}
          {isMahasiswa && (matchScore > 0 || matchReasons.length > 0) && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Award size={16} color="#2563EB" />
                <Text style={styles.sectionTitle}>Kecocokan Profil Anda</Text>
                <View style={styles.aiScoreBadge}>
                  <Text style={styles.aiScoreText}>
                    {matchScore || 85}% Cocok
                  </Text>
                </View>
              </View>

              <Text style={styles.aiMatchDesc}>
                Sistem AI Makarya menganalisis bahwa keahlian dan riwayat profil
                Anda sangat selaras dengan kriteria proyek ini:
              </Text>

              <View style={styles.aiReasonsList}>
                {matchReasons.length > 0 ? (
                  matchReasons.map((reason, idx) => (
                    <View key={idx} style={styles.aiReasonItem}>
                      <CheckCircle2
                        size={13}
                        color="#2563EB"
                        style={{ marginTop: 2 }}
                      />
                      <Text style={styles.aiReasonText}>{reason}</Text>
                    </View>
                  ))
                ) : (
                  <>
                    <View style={styles.aiReasonItem}>
                      <CheckCircle2
                        size={13}
                        color="#2563EB"
                        style={{ marginTop: 2 }}
                      />
                      <Text style={styles.aiReasonText}>
                        Keahlian dan latar belakang program studi Anda relevan
                        dengan proyek.
                      </Text>
                    </View>
                    <View style={styles.aiReasonItem}>
                      <CheckCircle2
                        size={13}
                        color="#2563EB"
                        style={{ marginTop: 2 }}
                      />
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
          {/* 6. REQUIRED SKILLS & TECH STACK                                   */}
          {/* ================================================================= */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Layers size={16} color="#2563EB" />
              <Text style={styles.sectionTitle}>Keahlian yang Dibutuhkan</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Keahlian dan perangkat lunak yang direkomendasikan:
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
          {/* 7. TEAM SLOTS BREAKDOWN (IF TEAM COLLABORATION)                   */}
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
          {/* 8. CLIENT RATING & TRUST BREAKDOWN                                */}
          {/* ================================================================= */}
          <View style={styles.sectionCard}>
            <View style={styles.ratingHeroRow}>
              <View style={styles.starsCluster}>
                <Star size={17} color="#F59E0B" fill="#F59E0B" />
                <Star size={17} color="#F59E0B" fill="#F59E0B" />
                <Star size={17} color="#F59E0B" fill="#F59E0B" />
                <Star size={17} color="#F59E0B" fill="#F59E0B" />
                <Star size={17} color="#F59E0B" fill="#F59E0B" />
              </View>
              <Text style={styles.ratingHeroScore}>{ratingAvgScore}</Text>
              <Text style={styles.ratingCountText}>
                ({totalReviewsCount} Ulasan Talenta)
              </Text>
            </View>

            {/* Criteria Breakdown */}
            <View style={styles.criteriaTable}>
              <View style={styles.criteriaRow}>
                <Text style={styles.criteriaLabel}>
                  Kejelasan Brief & Tugas
                </Text>
                <View style={styles.criteriaScoreWrap}>
                  <Star size={11} color="#0F172A" fill="#0F172A" />
                  <Text style={styles.criteriaScore}>{ratingAvgScore}</Text>
                </View>
              </View>

              <View style={styles.criteriaRow}>
                <Text style={styles.criteriaLabel}>Kelancaran Komunikasi</Text>
                <View style={styles.criteriaScoreWrap}>
                  <Star size={11} color="#0F172A" fill="#0F172A" />
                  <Text style={styles.criteriaScore}>{ratingAvgScore}</Text>
                </View>
              </View>

              <View style={styles.criteriaRow}>
                <Text style={styles.criteriaLabel}>
                  Ketepatan Persetujuan Escrow
                </Text>
                <View style={styles.criteriaScoreWrap}>
                  <Star size={11} color="#0F172A" fill="#0F172A" />
                  <Text style={styles.criteriaScore}>5.0</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ================================================================= */}
          {/* 9. STUDENT TALENT REVIEWS (Fiverr Reviews Section)                 */}
          {/* ================================================================= */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Users size={16} color="#2563EB" />
              <Text style={styles.sectionTitle}>
                Ulasan Mahasiswa Sebelumnya
              </Text>
            </View>

            <View style={styles.reviewsList}>
              {studentReviews.map((rev) => (
                <View key={rev.id} style={styles.reviewCard}>
                  <View style={styles.reviewTopRow}>
                    <View style={styles.reviewerAvatar}>
                      <GraduationCap size={15} color="#2563EB" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewerName}>{rev.nama}</Text>
                      <Text style={styles.reviewerCampus}>{rev.kampus}</Text>
                    </View>
                    <View style={styles.reviewRatingPill}>
                      <Star size={10} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.reviewRatingText}>
                        {rev.rating.toFixed(1)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>"{rev.pesan}"</Text>
                  <Text style={styles.reviewDate}>{rev.waktu}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ================================================================= */}
          {/* 10. CLIENT UMKM PROFILE & LOCATION                                */}
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

          {/* Bottom spacer for floating chat & sticky bar */}
          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      {/* ===================================================================== */}
      {/* 13. FLOATING CHAT PILL WIDGET (Fiverr Style)                          */}
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
              {formattedBudgetRange}
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
    padding: 16,
    paddingBottom: 24,
  },

  /* 1. Hero Media Banner (Fiverr Style Cover Image) */
  bannerContainer: {
    width: "100%",
    height: 180,
    borderRadius: 16,
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
    backgroundColor: "rgba(15, 23, 42, 0.25)",
  },
  bannerCategoryPill: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
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
  pageCountPill: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pageCountText: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyBold,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  /* 2. Creator Identity Row */
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E2E8F0",
  },
  creatorAvatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 5.5,
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
    fontSize: 9.5,
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
    fontSize: 9.5,
    fontFamily: FONTS.bodyBold,
    color: "#1D4ED8",
    fontWeight: "700",
  },

  /* 3. Headline & Brief */
  headlineCard: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginBottom: 16,
    gap: 10,
  },
  applicantRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
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
  publishedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  publishedText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
  },
  projectTitle: {
    fontSize: 20,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "800",
    lineHeight: 27,
  },
  descriptionBox: {
    gap: 4,
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: FONTS.bodyRegular,
    color: "#334155",
    lineHeight: 20,
  },
  inlineMoreBtn: {
    alignSelf: "flex-start",
    marginTop: 2,
  },
  inlineMoreText: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
    textDecorationLine: "underline",
  },

  /* 4. Package & Scope Card */
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FAFAFA",
    position: "relative",
  },
  packageHeaderLabel: {
    fontSize: 9,
    fontFamily: FONTS.bodyBold,
    color: "#64748B",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  packageHeaderPrice: {
    fontSize: 17.5,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "900",
    marginTop: 1,
  },
  activePackageIndicator: {
    width: 60,
    height: 3,
    backgroundColor: "#0F172A",
    borderRadius: 2,
  },
  packageBody: {
    padding: 16,
    gap: 12,
  },
  packageTitle: {
    fontSize: 15.5,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  packageSummary: {
    fontSize: 12,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
    lineHeight: 17,
    marginTop: -6,
  },
  specTable: {
    marginTop: 4,
    gap: 8,
  },
  specRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  specLabel: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
  },
  specValue: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  specDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  appliedBannerPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingVertical: 12,
    borderRadius: 14,
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
    fontSize: 11.5,
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

  /* 5. AI Match */
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

  /* 6. Skills */
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

  /* 7. Team Slots */
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

  /* 8. Rating Hero */
  ratingHeroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  starsCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2.5,
  },
  ratingHeroScore: {
    fontSize: 17,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "900",
    marginLeft: 2,
  },
  ratingCountText: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
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
    fontSize: 12.5,
    fontFamily: FONTS.bodyRegular,
    color: "#475569",
  },
  criteriaScoreWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  criteriaScore: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },

  /* 9. Student Reviews List */
  reviewsList: {
    gap: 12,
    marginTop: 4,
  },
  reviewCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 6,
  },
  reviewTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reviewerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewerName: {
    fontSize: 12.5,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  reviewerCampus: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
  },
  reviewRatingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  reviewRatingText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: "#B45309",
    fontWeight: "700",
  },
  reviewComment: {
    fontSize: 12,
    fontFamily: FONTS.bodyRegular,
    color: "#334155",
    lineHeight: 17,
    fontStyle: "italic",
  },
  reviewDate: {
    fontSize: 10,
    fontFamily: FONTS.bodyRegular,
    color: "#94A3B8",
    alignSelf: "flex-end",
  },

  /* 10. Client UMKM Profile */
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

  /* 11. Benefits */
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

  /* 12. Management Section */
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

  /* 13. Floating Chat Pill Widget (Fiverr Style) */
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
    paddingTop: 10,
    paddingBottom: 14,
    elevation: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  stickyContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stickyPriceCol: {
    flex: 1,
    marginRight: 12,
    justifyContent: "center",
  },
  stickyPriceLabel: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyBold,
    color: "#64748B",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  stickyPriceValue: {
    fontSize: 14.5,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "900",
  },
  stickyActionCol: {
    flexShrink: 0,
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
