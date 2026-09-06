import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  ScrollView,
  Linking,
  ActivityIndicator,
  Platform,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { SearchBar } from "../../components/ui/SearchBar";
import { Header } from "../../components/ui/Header";
import { NotificationModal } from "../../components/features/NotificationModal";
import { talentApi, projectApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";
import {
  ProdiVectorIcon,
  GithubVectorIcon,
  FigmaVectorIcon,
  GlobeVectorIcon,
  LinkedinVectorIcon,
} from "../../components/icons/ProfileVectorIcons";
import {
  Star,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  Award,
  Bell,
  X,
  Plus,
  MessageSquare,
  User,
} from "lucide-react-native";

const PRODI_OPTIONS = [
  { id: "ALL", label: "Semua Prodi" },
  { id: "Sistem Informasi", label: "Sistem Informasi" },
  { id: "Teknologi Informasi", label: "Teknologi Informasi" },
  { id: "Komunikasi Visual", label: "Desain (DKV)" },
  { id: "Komunikasi", label: "Ilmu Komunikasi" },
  { id: "Manajemen", label: "Manajemen" },
];

const FALLBACK_TALENTS = [
  {
    id: "darell-1",
    nama_lengkap: "Darell Rangga Putra",
    nim: "12210001",
    prodi: "Sistem Informasi",
    semester: 6,
    email: "darell@ubsi.ac.id",
    bio: "Mahasiswa Sistem Informasi aktif spesialisasi Fullstack Web (FastAPI, React.js, PostgreSQL) dan antarmuka UI/UX modern responsif.",
    rating_avg: 5.0,
    total_proyek_selesai: 3,
    escrow_success_rate: "100%",
    status_badge: "Mahasiswa Berprestasi & Terverifikasi",
    skills: ["FastAPI", "React.js", "PostgreSQL", "Tailwind CSS", "Figma"],
    github_url: "https://github.com/darell",
    figma_url: "https://figma.com/@darell",
    website_url: "https://darell.dev",
    linkedin_url: "https://linkedin.com/in/darell",
    reviews_count: 3,
    recent_reviews: [
      {
        id: "rev-1",
        reviewer_name: "Kopi Kenangan Senja UMKM",
        rating: 5,
        komentar:
          "Pengerjaan sistem POS & landing page sangat cepat, rapi, dan sesuai spesifikasi.",
        project_title: "Pengembangan Landing Page & Web Order Kopi",
        created_at: "2026-08-20T10:00:00",
      },
      {
        id: "rev-2",
        reviewer_name: "Batik Canting Solo",
        rating: 5,
        komentar:
          "Website katalog produk selesai sebelum deadline. Sangat puas!",
        project_title: "Desain & Katalog Interaktif Produk Batik",
        created_at: "2026-08-10T14:30:00",
      },
    ],
  },
  {
    id: "adelia-2",
    nama_lengkap: "Adelia Putri",
    nim: "12210045",
    prodi: "Desain Komunikasi Visual",
    semester: 4,
    email: "adelia.dkv@ubsi.ac.id",
    bio: "Fokus pada visual branding UMKM, desain kemasan produk ramah cetak, serta pembuatan logo vector berkarakter kuat.",
    rating_avg: 4.9,
    total_proyek_selesai: 4,
    escrow_success_rate: "100%",
    status_badge: "Mahasiswa Berprestasi & Terverifikasi",
    skills: [
      "Logo Design",
      "Packaging",
      "Branding",
      "Adobe Illustrator",
      "Figma",
    ],
    github_url: "",
    figma_url: "https://figma.com/@adeliaputri",
    website_url: "",
    linkedin_url: "https://linkedin.com/in/adeliaputri",
    reviews_count: 2,
    recent_reviews: [
      {
        id: "rev-3",
        reviewer_name: "Keripik Singkong Renyah",
        rating: 5,
        komentar:
          "Desain packaging modern membuat produk kami tembus masuk supermarket lokal!",
        project_title: "Redesain Kemasan Pouch Keripik Singkong",
        created_at: "2026-08-15T09:00:00",
      },
    ],
  },
  {
    id: "bima-3",
    nama_lengkap: "Bima Arya",
    nim: "12210088",
    prodi: "Teknologi Informasi",
    semester: 6,
    email: "bima.ti@ubsi.ac.id",
    bio: "Spesialis landing page konversi tinggi dan integrasi CMS untuk UMKM lokal.",
    rating_avg: 5.0,
    total_proyek_selesai: 2,
    escrow_success_rate: "100%",
    status_badge: "Mahasiswa Berprestasi & Terverifikasi",
    skills: ["Next.js", "Landing Page", "REST API", "Tailwind CSS"],
    github_url: "https://github.com/bimaarya",
    figma_url: "",
    website_url: "https://bima.dev",
    linkedin_url: "https://linkedin.com/in/bimaarya",
    reviews_count: 1,
    recent_reviews: [],
  },
];

export function TalentListScreen({ navigation }) {
  const { user } = useAuthStore();
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("ALL");
  const [minRatingFilter, setMinRatingFilter] = useState(false);
  const [onlyCompletedFilter, setOnlyCompletedFilter] = useState(false);

  const [selectedTalent, setSelectedTalent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [myProjects, setMyProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const { getUnreadCount } = useNotificationStore();
  const unreadNotifications = getUnreadCount(user?.role);

  const loadTalents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery.trim()) params.keyword = searchQuery.trim();
      if (selectedProdi !== "ALL") params.prodi = selectedProdi;
      if (minRatingFilter) params.min_rating = 4.8;
      if (onlyCompletedFilter) params.only_completed = true;

      const res = await talentApi.getTalents(params);
      const items = Array.isArray(res.data) ? res.data : [];
      if (items.length > 0) {
        setTalents(items);
      } else {
        if (
          !searchQuery &&
          selectedProdi === "ALL" &&
          !minRatingFilter &&
          !onlyCompletedFilter
        ) {
          setTalents(FALLBACK_TALENTS);
        } else {
          setTalents([]);
        }
      }
    } catch (err) {
      setTalents(FALLBACK_TALENTS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTalents();
  }, [searchQuery, selectedProdi, minRatingFilter, onlyCompletedFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTalents();
  };

  const handleOpenDetail = (talent) => {
    setSelectedTalent(talent);
    setIsDetailModalOpen(true);
  };

  const handleOpenContact = async (talent) => {
    setSelectedTalent(talent);
    setIsContactModalOpen(true);
    try {
      setLoadingProjects(true);
      const res = await projectApi.getMyProjects();
      const list = Array.isArray(res.data) ? res.data : [];
      setMyProjects(list);
      if (list.length > 0) {
        setSelectedProjectId(list[0].id);
      }
    } catch (err) {
      setMyProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleInviteToProject = () => {
    if (!selectedProjectId) {
      setIsContactModalOpen(false);
      navigation.navigate("PostProject");
      return;
    }
    setIsContactModalOpen(false);
    navigation.navigate("ProjectDetail", { id: selectedProjectId });
  };

  const openUrl = (url) => {
    if (!url) return;
    const cleanUrl = url.startsWith("http") ? url : `https://${url}`;
    Linking.openURL(cleanUrl).catch(() => {});
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedProdi("ALL");
    setMinRatingFilter(false);
    setOnlyCompletedFilter(false);
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedProdi !== "ALL" ||
    minRatingFilter ||
    onlyCompletedFilter;

  const renderTalentItem = ({ item }) => {
    const initial = item.nama_lengkap
      ? item.nama_lengkap.charAt(0).toUpperCase()
      : "M";
    const ratingScore = Number(item.rating_avg) || 5.0;
    const completedCount = item.total_proyek_selesai ?? 0;
    const skillsList = Array.isArray(item.skills)
      ? item.skills.slice(0, 4)
      : [];

    return (
      <View style={styles.talentCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarLetter}>{initial}</Text>
          </View>

          <View style={styles.headerInfoCol}>
            <View style={styles.nameBadgeRow}>
              <Text style={styles.talentName} numberOfLines={1}>
                {item.nama_lengkap}
              </Text>
              <CheckCircle2 size={15} color={COLORS.success} />
            </View>

            <View style={styles.prodiMetaRow}>
              <ProdiVectorIcon size={13} color={COLORS.brandCyan} />
              <Text style={styles.prodiText} numberOfLines={1}>
                {item.prodi || "Sistem Informasi"}
                {item.semester ? ` • Smt ${item.semester}` : ""}
              </Text>
            </View>
          </View>
        </View>

        {item.bio ? (
          <Text style={styles.bioText} numberOfLines={2}>
            {item.bio}
          </Text>
        ) : null}

        <View style={styles.metricsBar}>
          <View style={styles.metricItem}>
            <Star size={13} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.metricValueText}>{ratingScore.toFixed(1)}</Text>
            <Text style={styles.metricLabelText}>
              ({item.reviews_count ?? completedCount} ulasan)
            </Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricItem}>
            <Award size={13} color={COLORS.brandIndigo} />
            <Text style={styles.metricValueText}>{completedCount}</Text>
            <Text style={styles.metricLabelText}>Proyek Tuntas</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricItem}>
            <ShieldCheck size={13} color={COLORS.success} />
            <Text style={[styles.metricValueText, { color: COLORS.success }]}>
              100%
            </Text>
            <Text style={styles.metricLabelText}>Escrow</Text>
          </View>
        </View>

        {skillsList.length > 0 && (
          <View style={styles.skillsWrap}>
            {skillsList.map((skill, idx) => (
              <View key={idx} style={styles.skillPill}>
                <Text style={styles.skillPillText}>{skill}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.cardActionsRow}>
          <TouchableOpacity
            style={styles.detailBtn}
            onPress={() => handleOpenDetail(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.detailBtnText}>Lihat Portofolio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactBtn}
            onPress={() => handleOpenContact(item)}
            activeOpacity={0.8}
          >
            <MessageSquare size={14} color="#FFFFFF" />
            <Text style={styles.contactBtnText}>Ajak Kolaborasi</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. Standardized Unified Header */}
      <Header
        category="DIREKTORI KAMPUS RESMI"
        title="Eksplorasi Mahasiswa"
        subtitle="Temukan talenta muda terverifikasi untuk proyek usaha Anda"
        showBell={true}
        onBellPress={() => setIsNotificationOpen(true)}
        unreadCount={unreadNotifications}
      />

      <View style={styles.searchWrapper}>
        <SearchBar
          placeholder="Cari nama talenta, keahlian, atau prodi..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />
      </View>

      <View style={styles.prodiPillsWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.prodiPillsContainer}
        >
          {PRODI_OPTIONS.map((item) => {
            const isSelected = selectedProdi === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedProdi(item.id)}
                activeOpacity={0.8}
                style={[styles.prodiPill, isSelected && styles.prodiPillActive]}
              >
                <Text
                  style={[
                    styles.prodiPillText,
                    isSelected && styles.prodiPillTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.chipsRow}>
        <TouchableOpacity
          onPress={() => setMinRatingFilter(!minRatingFilter)}
          activeOpacity={0.8}
          style={[styles.chipBtn, minRatingFilter && styles.chipBtnActive]}
        >
          <Star
            size={12}
            color={minRatingFilter ? COLORS.brandIndigo : "#94A3B8"}
            fill={minRatingFilter ? COLORS.brandIndigo : "none"}
          />
          <Text
            style={[
              styles.chipBtnText,
              minRatingFilter && styles.chipBtnTextActive,
            ]}
          >
            Rating 4.8+
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setOnlyCompletedFilter(!onlyCompletedFilter)}
          activeOpacity={0.8}
          style={[styles.chipBtn, onlyCompletedFilter && styles.chipBtnActive]}
        >
          <Award
            size={12}
            color={onlyCompletedFilter ? COLORS.brandIndigo : "#94A3B8"}
          />
          <Text
            style={[
              styles.chipBtnText,
              onlyCompletedFilter && styles.chipBtnTextActive,
            ]}
          >
            Proyek Tuntas
          </Text>
        </TouchableOpacity>

        {hasActiveFilters && (
          <TouchableOpacity
            onPress={resetAllFilters}
            activeOpacity={0.8}
            style={styles.resetBtn}
          >
            <RotateCcw size={12} color={COLORS.textMuted} />
            <Text style={styles.resetBtnText}>Reset</Text>
          </TouchableOpacity>
        )}

        <View style={{ flex: 1 }} />
        <Text style={styles.countSummaryText}>{talents.length} Talenta</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={COLORS.brandIndigo} />
          <Text style={styles.loadingText}>Memuat talenta mahasiswa...</Text>
        </View>
      ) : (
        <FlatList
          data={talents}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderTalentItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.brandIndigo}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconBox}>
                <User size={32} color={COLORS.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>Tidak ada talenta ditemukan</Text>
              <Text style={styles.emptyDesc}>
                {hasActiveFilters
                  ? "Coba sesuaikan kata kunci pencarian atau reset filter program studi Anda."
                  : "Belum ada talenta mahasiswa yang sesuai kriteria ini."}
              </Text>
              {hasActiveFilters && (
                <TouchableOpacity
                  style={styles.emptyResetBtn}
                  onPress={resetAllFilters}
                  activeOpacity={0.8}
                >
                  <RotateCcw size={13} color="#FFFFFF" />
                  <Text style={styles.emptyResetText}>Reset Semua Filter</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}

      {/* Detail Modal */}
      <Modal
        visible={isDetailModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDetailModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalCard}>
            <View style={styles.detailModalHeader}>
              <Text style={styles.detailModalTitle}>Profil & Portofolio</Text>
              <TouchableOpacity
                onPress={() => setIsDetailModalOpen(false)}
                style={styles.closeCircleBtn}
                activeOpacity={0.7}
              >
                <X size={18} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            {selectedTalent && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.detailScrollContent}
              >
                <View style={styles.detailProfileTop}>
                  <View style={styles.detailAvatarBox}>
                    <Text style={styles.detailAvatarLetter}>
                      {selectedTalent.nama_lengkap
                        ? selectedTalent.nama_lengkap.charAt(0).toUpperCase()
                        : "M"}
                    </Text>
                  </View>

                  <View style={styles.detailInfoCol}>
                    <View style={styles.nameBadgeRow}>
                      <Text style={styles.detailNameText}>
                        {selectedTalent.nama_lengkap}
                      </Text>
                      <CheckCircle2 size={16} color={COLORS.success} />
                    </View>
                    <Text style={styles.detailProdiText}>
                      {selectedTalent.prodi || "Sistem Informasi"}
                      {selectedTalent.semester
                        ? ` • Semester ${selectedTalent.semester}`
                        : ""}
                    </Text>
                    {selectedTalent.nim ? (
                      <Text style={styles.detailNimText}>
                        NIM: {selectedTalent.nim} • Universitas BSI
                      </Text>
                    ) : null}
                  </View>
                </View>

                <View style={styles.detailBadgesRow}>
                  <View style={styles.detailBadgeItem}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.detailBadgeValue}>
                      {Number(selectedTalent.rating_avg || 5.0).toFixed(1)}
                    </Text>
                    <Text style={styles.detailBadgeLabel}>Skor Reputasi</Text>
                  </View>

                  <View style={styles.detailBadgeItem}>
                    <Award size={14} color={COLORS.brandIndigo} />
                    <Text style={styles.detailBadgeValue}>
                      {selectedTalent.total_proyek_selesai ?? 0}
                    </Text>
                    <Text style={styles.detailBadgeLabel}>Proyek Tuntas</Text>
                  </View>

                  <View style={styles.detailBadgeItem}>
                    <ShieldCheck size={14} color={COLORS.success} />
                    <Text
                      style={[
                        styles.detailBadgeValue,
                        { color: COLORS.success },
                      ]}
                    >
                      100%
                    </Text>
                    <Text style={styles.detailBadgeLabel}>Sukses Escrow</Text>
                  </View>
                </View>

                <View style={styles.detailSectionBox}>
                  <Text style={styles.detailSectionHeading}>
                    Ringkasan Talenta
                  </Text>
                  <Text style={styles.detailBioBody}>
                    {selectedTalent.bio ||
                      "Mahasiswa aktif berfokus pada pengembangan produk digital & desain UI/UX solutif untuk UMKM lokal."}
                  </Text>
                </View>

                {Array.isArray(selectedTalent.skills) &&
                  selectedTalent.skills.length > 0 && (
                    <View style={styles.detailSectionBox}>
                      <Text style={styles.detailSectionHeading}>
                        Keahlian Teknis
                      </Text>
                      <View style={styles.skillsWrap}>
                        {selectedTalent.skills.map((skill, idx) => (
                          <View key={idx} style={styles.detailSkillPill}>
                            <Text style={styles.detailSkillText}>{skill}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                <View style={styles.detailSectionBox}>
                  <Text style={styles.detailSectionHeading}>
                    Tautan Portofolio & Karya
                  </Text>
                  <View style={styles.portfolioLinksGrid}>
                    {selectedTalent.github_url ? (
                      <TouchableOpacity
                        style={styles.portfolioLinkCard}
                        onPress={() => openUrl(selectedTalent.github_url)}
                        activeOpacity={0.7}
                      >
                        <GithubVectorIcon size={18} color={COLORS.textDark} />
                        <Text style={styles.portfolioLinkLabel}>
                          GitHub Repository
                        </Text>
                        <ExternalLink size={12} color={COLORS.textMuted} />
                      </TouchableOpacity>
                    ) : null}

                    {selectedTalent.figma_url ? (
                      <TouchableOpacity
                        style={styles.portfolioLinkCard}
                        onPress={() => openUrl(selectedTalent.figma_url)}
                        activeOpacity={0.7}
                      >
                        <FigmaVectorIcon size={18} color={COLORS.brandIndigo} />
                        <Text style={styles.portfolioLinkLabel}>
                          Figma Workspace
                        </Text>
                        <ExternalLink size={12} color={COLORS.textMuted} />
                      </TouchableOpacity>
                    ) : null}

                    {selectedTalent.website_url ? (
                      <TouchableOpacity
                        style={styles.portfolioLinkCard}
                        onPress={() => openUrl(selectedTalent.website_url)}
                        activeOpacity={0.7}
                      >
                        <GlobeVectorIcon size={18} color={COLORS.brandCyan} />
                        <Text style={styles.portfolioLinkLabel}>
                          Live Website / Demo
                        </Text>
                        <ExternalLink size={12} color={COLORS.textMuted} />
                      </TouchableOpacity>
                    ) : null}

                    {selectedTalent.linkedin_url ? (
                      <TouchableOpacity
                        style={styles.portfolioLinkCard}
                        onPress={() => openUrl(selectedTalent.linkedin_url)}
                        activeOpacity={0.7}
                      >
                        <LinkedinVectorIcon size={18} color="#0A66C2" />
                        <Text style={styles.portfolioLinkLabel}>
                          LinkedIn Profile
                        </Text>
                        <ExternalLink size={12} color={COLORS.textMuted} />
                      </TouchableOpacity>
                    ) : null}

                    {!selectedTalent.github_url &&
                      !selectedTalent.figma_url &&
                      !selectedTalent.website_url &&
                      !selectedTalent.linkedin_url && (
                        <Text style={styles.emptyMetaText}>
                          Portofolio live belum dicantumkan.
                        </Text>
                      )}
                  </View>
                </View>

                {Array.isArray(selectedTalent.recent_reviews) &&
                  selectedTalent.recent_reviews.length > 0 && (
                    <View style={styles.detailSectionBox}>
                      <Text style={styles.detailSectionHeading}>
                        Ulasan Klien UMKM (
                        {selectedTalent.recent_reviews.length})
                      </Text>
                      <View style={styles.reviewsListWrap}>
                        {selectedTalent.recent_reviews.map((rev, idx) => (
                          <View key={idx} style={styles.reviewItemCard}>
                            <View style={styles.reviewTopRow}>
                              <Text style={styles.reviewClientName}>
                                {rev.reviewer_name ||
                                  "Klien UMKM Terverifikasi"}
                              </Text>
                              <View style={styles.reviewStarRow}>
                                <Star
                                  size={12}
                                  color="#F59E0B"
                                  fill="#F59E0B"
                                />
                                <Text style={styles.reviewScoreText}>
                                  {rev.rating || 5}.0
                                </Text>
                              </View>
                            </View>
                            {rev.project_title && (
                              <Text style={styles.reviewProjectTitle}>
                                Proyek: {rev.project_title}
                              </Text>
                            )}
                            <Text style={styles.reviewCommentText}>
                              "{rev.komentar}"
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
              </ScrollView>
            )}

            <View style={styles.detailFooterBar}>
              <TouchableOpacity
                style={styles.modalCtaBtn}
                onPress={() => {
                  setIsDetailModalOpen(false);
                  handleOpenContact(selectedTalent);
                }}
                activeOpacity={0.85}
              >
                <MessageSquare size={16} color="#FFFFFF" />
                <Text style={styles.modalCtaBtnText}>
                  Ajak Kolaborasi Proyek
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Contact / Invite Modal */}
      <Modal
        visible={isContactModalOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsContactModalOpen(false)}
      >
        <View style={styles.contactOverlay}>
          <View style={styles.contactCard}>
            <View style={styles.contactHeader}>
              <Text style={styles.contactTitle}>Ajak Talenta Bekerja Sama</Text>
              <TouchableOpacity
                onPress={() => setIsContactModalOpen(false)}
                activeOpacity={0.7}
              >
                <X size={18} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            {selectedTalent && (
              <View style={styles.contactTargetRow}>
                <View style={styles.contactTargetAvatar}>
                  <Text style={styles.contactTargetLetter}>
                    {selectedTalent.nama_lengkap?.charAt(0) || "M"}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactTargetName} numberOfLines={1}>
                    {selectedTalent.nama_lengkap}
                  </Text>
                  <Text style={styles.contactTargetProdi} numberOfLines={1}>
                    {selectedTalent.prodi} • Terverifikasi
                  </Text>
                </View>
              </View>
            )}

            <Text style={styles.contactBodyLabel}>
              Pilih proyek kebutuhan Anda yang ingin ditawarkan kepada mahasiswa
              ini:
            </Text>

            {loadingProjects ? (
              <ActivityIndicator
                size="small"
                color={COLORS.brandIndigo}
                style={{ marginVertical: 20 }}
              />
            ) : myProjects.length > 0 ? (
              <View style={styles.projectsSelectorWrap}>
                {myProjects.map((p) => {
                  const isSelected = selectedProjectId === p.id;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() => setSelectedProjectId(p.id)}
                      activeOpacity={0.8}
                      style={[
                        styles.projectSelectOption,
                        isSelected && styles.projectSelectOptionActive,
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.projectSelectTitle,
                            isSelected && {
                              color: COLORS.brandIndigo,
                              fontWeight: "700",
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {p.title}
                        </Text>
                        <Text style={styles.projectSelectMeta}>
                          Status: {p.status}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && styles.radioCircleActive,
                        ]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={styles.noProjectsNotice}>
                <Text style={styles.noProjectsNoticeTitle}>
                  Belum Ada Proyek Aktif
                </Text>
                <Text style={styles.noProjectsNoticeDesc}>
                  Anda dapat membuat deskripsi proyek baru sekarang agar talenta
                  ini langsung dapat meninjau dan menerima penawaran Anda.
                </Text>
              </View>
            )}

            <View style={styles.contactActionButtons}>
              {myProjects.length > 0 ? (
                <TouchableOpacity
                  style={styles.primaryInviteBtn}
                  onPress={handleInviteToProject}
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
                    setIsContactModalOpen(false);
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

      <NotificationModal
        visible={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 54 : 32,
    paddingBottom: 14,
    backgroundColor: COLORS.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  titleArea: {
    flex: 1,
    paddingRight: 12,
  },
  badgeCategory: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.brandIndigo,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  screenTitle: {
    fontSize: 22,
    fontFamily: FONTS.serifBold,
    color: COLORS.textDark,
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.bgDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  bellRedDot: {
    position: "absolute",
    top: 7,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  searchWrapper: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: COLORS.bgSurface,
  },
  prodiPillsWrap: {
    backgroundColor: COLORS.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
    paddingBottom: 12,
  },
  prodiPillsContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  prodiPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.bgDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  prodiPillActive: {
    backgroundColor: COLORS.brandIndigo,
    borderColor: COLORS.brandIndigo,
  },
  prodiPillText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  prodiPillTextActive: {
    color: "#FFFFFF",
    fontFamily: FONTS.bold,
  },
  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  chipBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  chipBtnActive: {
    backgroundColor: COLORS.brandIndigoLight,
    borderColor: COLORS.brandIndigo,
  },
  chipBtnText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  chipBtnTextActive: {
    color: COLORS.brandIndigo,
    fontFamily: FONTS.bold,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resetBtnText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.textMuted,
  },
  countSummaryText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.textMuted,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    gap: 14,
  },
  loadingCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
  },
  loadingText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.textMuted,
    marginTop: 12,
  },
  talentCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    padding: 16,
    gap: 12,
    ...SHADOWS.card,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.brandIndigo,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: 20,
    fontFamily: FONTS.serifBold,
    color: "#FFFFFF",
  },
  headerInfoCol: {
    flex: 1,
    gap: 2,
  },
  nameBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  talentName: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.textDark,
  },
  prodiMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  prodiText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
  },
  bioText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  metricsBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgDark,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    justifyContent: "space-between",
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricDivider: {
    width: 1,
    height: 14,
    backgroundColor: COLORS.borderDark,
  },
  metricValueText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.textDark,
  },
  metricLabelText: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.bgDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  skillPillText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  cardActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 4,
  },
  detailBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: COLORS.bgDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    alignItems: "center",
    justifyContent: "center",
  },
  detailBtnText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.textDark,
  },
  contactBtn: {
    flex: 1.2,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: COLORS.brandIndigo,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  contactBtnText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: "#FFFFFF",
  },
  emptyCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  emptyIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.bgDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.textDark,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 280,
    marginBottom: 16,
  },
  emptyResetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: COLORS.brandIndigo,
  },
  emptyResetText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  detailModalCard: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "88%",
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  detailModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  detailModalTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.textDark,
  },
  closeCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bgDark,
    alignItems: "center",
    justifyContent: "center",
  },
  detailScrollContent: {
    padding: 20,
    gap: 18,
  },
  detailProfileTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  detailAvatarBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.brandIndigo,
    alignItems: "center",
    justifyContent: "center",
  },
  detailAvatarLetter: {
    fontSize: 26,
    fontFamily: FONTS.serifBold,
    color: "#FFFFFF",
  },
  detailInfoCol: {
    flex: 1,
    gap: 3,
  },
  detailNameText: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    color: COLORS.textDark,
  },
  detailProdiText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.brandCyan,
  },
  detailNimText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
  },
  detailBadgesRow: {
    flexDirection: "row",
    backgroundColor: COLORS.bgDark,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    justifyContent: "space-around",
  },
  detailBadgeItem: {
    alignItems: "center",
    gap: 3,
  },
  detailBadgeValue: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.textDark,
  },
  detailBadgeLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: COLORS.textMuted,
  },
  detailSectionBox: {
    gap: 8,
  },
  detailSectionHeading: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.textDark,
  },
  detailBioBody: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  detailSkillPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: COLORS.brandIndigoLight,
  },
  detailSkillText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.brandIndigo,
  },
  portfolioLinksGrid: {
    gap: 8,
  },
  portfolioLinkCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.bgDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    gap: 10,
  },
  portfolioLinkLabel: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.textDark,
  },
  emptyMetaText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    fontStyle: "italic",
  },
  reviewsListWrap: {
    gap: 10,
  },
  reviewItemCard: {
    backgroundColor: COLORS.bgDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    padding: 12,
    gap: 4,
  },
  reviewTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reviewClientName: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.textDark,
  },
  reviewStarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  reviewScoreText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: COLORS.textDark,
  },
  reviewProjectTitle: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.brandIndigo,
  },
  reviewCommentText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
    fontStyle: "italic",
  },
  detailFooterBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark,
  },
  modalCtaBtn: {
    backgroundColor: COLORS.brandIndigo,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  modalCtaBtnText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: "#FFFFFF",
  },
  contactOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  contactCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 24,
    padding: 20,
    gap: 14,
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.textDark,
  },
  contactTargetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.bgDark,
    borderRadius: 14,
    padding: 10,
  },
  contactTargetAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.brandIndigo,
    alignItems: "center",
    justifyContent: "center",
  },
  contactTargetLetter: {
    fontSize: 16,
    fontFamily: FONTS.serifBold,
    color: "#FFFFFF",
  },
  contactTargetName: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.textDark,
  },
  contactTargetProdi: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
  },
  contactBodyLabel: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  projectsSelectorWrap: {
    gap: 8,
    maxHeight: 200,
  },
  projectSelectOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.bgDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    gap: 10,
  },
  projectSelectOptionActive: {
    borderColor: COLORS.brandIndigo,
    backgroundColor: COLORS.brandIndigoLight,
  },
  projectSelectTitle: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.textDark,
  },
  projectSelectMeta: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleActive: {
    borderColor: COLORS.brandIndigo,
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: COLORS.brandIndigo,
  },
  noProjectsNotice: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: COLORS.bgDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    gap: 4,
  },
  noProjectsNoticeTitle: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.textDark,
  },
  noProjectsNoticeDesc: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  contactActionButtons: {
    marginTop: 4,
  },
  primaryInviteBtn: {
    backgroundColor: COLORS.brandIndigo,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryInviteBtnText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: "#FFFFFF",
  },
});
