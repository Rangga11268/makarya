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
  Image,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { SearchBar } from "../../components/ui/SearchBar";
import { Header } from "../../components/ui/Header";
import { NotificationModal } from "../../components/features/NotificationModal";
import { Button } from "../../components/ui/Button";
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
  X,
  Plus,
  MessageSquare,
  Compass,
  SlidersHorizontal,
  ChevronRight,
  Briefcase,
  Layers,
} from "lucide-react-native";

const PRODI_OPTIONS = [
  { id: "ALL", label: "Semua Prodi" },
  { id: "Sistem Informasi", label: "Sistem Informasi" },
  { id: "Teknologi Informasi", label: "Teknologi Informasi" },
  { id: "Komunikasi Visual", label: "Desain (DKV)" },
  { id: "Komunikasi", label: "Ilmu Komunikasi" },
  { id: "Manajemen", label: "Manajemen" },
];

const RATING_OPTIONS = [
  { id: "ALL", label: "Semua Rating" },
  { id: "4.5", label: "Rating ≥ 4.5" },
  { id: "4.8", label: "Rating ≥ 4.8" },
  { id: "5.0", label: "Rating 5.0 (Sempurna)" },
];

const PROJECT_OPTIONS = [
  { id: "ALL", label: "Semua Riwayat" },
  { id: "1", label: "Min. 1 Proyek Tuntas" },
  { id: "3", label: "Min. 3 Proyek Tuntas" },
];

const FALLBACK_TALENTS = [
  {
    id: "darell-1",
    nama_lengkap: "Darell Rangga Putra",
    nim: "12210001",
    prodi: "Sistem Informasi",
    semester: 6,
    email: "darell@ubsi.ac.id",
    bio: "Mahasiswa Sistem Informasi spesialisasi Fullstack Web (FastAPI, React.js, PostgreSQL) dan antarmuka UI/UX modern responsif.",
    rating_avg: 5.0,
    total_proyek_selesai: 3,
    escrow_success_rate: "100%",
    status_badge: "Mahasiswa Berprestasi & Terverifikasi",
    skills: ["FastAPI", "React.js", "PostgreSQL", "Tailwind CSS", "Figma"],
    github_url: "https://github.com/darell",
    figma_url: "https://figma.com/@darell",
    website_url: "https://darell.dev",
    linkedin_url: "https://linkedin.com/in/darell",
    reviews_count: 1,
    recent_reviews: [
      {
        id: "rev-1",
        reviewer_name: "Kopi Kenangan Nusantara",
        rating: 5,
        komentar:
          "Pengerjaan landing page & sistem reservasi meja sangat cepat, rapi, dan brief diikuti dengan sempurna.",
        project_title: "Pembuatan Website Landing Page Menu & Reservasi",
        created_at: "2026-08-20T10:00:00",
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
    skills: ["Figma", "Adobe Illustrator", "Brand Identity", "Packaging", "Typography"],
    github_url: "",
    figma_url: "https://figma.com/@adeliaputri",
    website_url: "",
    linkedin_url: "https://linkedin.com/in/adeliaputri",
    reviews_count: 4,
    recent_reviews: [
      {
        id: "rev-3",
        reviewer_name: "Keripik Singkong Barokah",
        rating: 5,
        komentar: "Rebranding packaging produk sangat menarik, omset offline kami langsung naik.",
        project_title: "Redesign Kemasan & Label Keripik Singkong",
        created_at: "2026-08-15T11:00:00",
      },
    ],
  },
  {
    id: "fajar-3",
    nama_lengkap: "Fajar Nugraha",
    nim: "12210088",
    prodi: "Teknologi Informasi",
    semester: 6,
    email: "fajar.ti@ubsi.ac.id",
    bio: "Spesialisasi mobile app Flutter & React Native dengan integrasi REST API backend, push notification, serta payment gateway.",
    rating_avg: 5.0,
    total_proyek_selesai: 2,
    escrow_success_rate: "100%",
    status_badge: "Mahasiswa Berprestasi & Terverifikasi",
    skills: ["React Native", "Flutter", "REST API", "Firebase", "State Management"],
    github_url: "https://github.com/fajarnugraha",
    figma_url: "",
    website_url: "",
    linkedin_url: "https://linkedin.com/in/fajarnugraha",
    reviews_count: 2,
    recent_reviews: [
      {
        id: "rev-4",
        reviewer_name: "Toko Sembako Berkah Jaya",
        rating: 5,
        komentar: "Aplikasi kasir mobile berjalan sangat enteng di handphone operasional toko.",
        project_title: "Aplikasi Kasir Toko Sembako",
        created_at: "2026-08-01T09:00:00",
      },
    ],
  },
];

export function TalentListScreen({ navigation }) {
  const { user } = useAuthStore();
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("MATCH"); // 'MATCH' | 'RECENT' | 'TOP_RATED'

  // Filter States
  const [selectedProdi, setSelectedProdi] = useState("ALL");
  const [selectedMinRating, setSelectedMinRating] = useState("ALL");
  const [selectedMinProjects, setSelectedMinProjects] = useState("ALL");

  // Modals
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Invite collaboration state
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
      if (selectedMinRating !== "ALL") params.min_rating = parseFloat(selectedMinRating);
      if (selectedMinProjects !== "ALL") params.only_completed = true;

      const res = await talentApi.getTalents(params);
      const items = Array.isArray(res.data) ? res.data : [];
      if (items.length > 0) {
        setTalents(items);
      } else {
        if (
          !searchQuery &&
          selectedProdi === "ALL" &&
          selectedMinRating === "ALL" &&
          selectedMinProjects === "ALL"
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
  }, [searchQuery, selectedProdi, selectedMinRating, selectedMinProjects]);

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
    setSelectedMinRating("ALL");
    setSelectedMinProjects("ALL");
  };

  const activeFilterCount =
    (selectedProdi !== "ALL" ? 1 : 0) +
    (selectedMinRating !== "ALL" ? 1 : 0) +
    (selectedMinProjects !== "ALL" ? 1 : 0);

  const segmentedTabs = [
    { id: "MATCH", label: "Best Match" },
    { id: "RECENT", label: "Recent" },
    { id: "TOP_RATED", label: "Top Rated" },
  ];

  // Sorting based on active tab
  const sortedTalents = [...talents].sort((a, b) => {
    if (activeTab === "TOP_RATED") {
      const ratingA = Number(a.rating_avg) || 0;
      const ratingB = Number(b.rating_avg) || 0;
      return ratingB - ratingA;
    }
    if (activeTab === "RECENT") {
      const doneA = a.total_proyek_selesai ?? 0;
      const doneB = b.total_proyek_selesai ?? 0;
      return doneB - doneA;
    }
    return 0; // Best match default
  });

  const renderTalentItem = ({ item }) => {
    const initial = item.nama_lengkap
      ? item.nama_lengkap.charAt(0).toUpperCase()
      : "M";
    const ratingScore = item.rating_avg != null ? Number(item.rating_avg).toFixed(1) : "-";
    const completedCount = item.total_proyek_selesai ?? 0;
    const skillsList = Array.isArray(item.skills)
      ? item.skills.slice(0, 4)
      : [];

    return (
      <View style={styles.talentCard}>
        {/* 1. Header: Avatar + Name & Prodi + Status Tag */}
        <View style={styles.cardHeaderRow}>
          {item.url_foto ? (
            <Image
              source={{ uri: item.url_foto }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarBox}>
              <Text style={styles.avatarLetter}>{initial}</Text>
            </View>
          )}

          <View style={styles.headerInfoCol}>
            <View style={styles.nameRow}>
              <Text style={styles.talentName} numberOfLines={1}>
                {item.nama_lengkap}
              </Text>
              <CheckCircle2 size={14} color={COLORS.success} />
            </View>

            <View style={styles.prodiRow}>
              <ProdiVectorIcon size={12} color={COLORS.brandCyan} />
              <Text style={styles.prodiText} numberOfLines={1}>
                {item.prodi || "Sistem Informasi"}
                {item.semester ? ` • Smt ${item.semester}` : ""}
              </Text>
            </View>
          </View>

          <View style={styles.statusBadgePill}>
            <Text style={styles.statusBadgeText}>Terverifikasi</Text>
          </View>
        </View>

        {/* 2. Short Professional Bio */}
        {item.bio ? (
          <Text style={styles.bioText} numberOfLines={2}>
            {item.bio}
          </Text>
        ) : null}

        {/* 3. Specs Grid (Rating, Projects Done, Escrow Rate) */}
        <View style={styles.specsGrid}>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Reputasi Skor</Text>
            <View style={styles.specMetricRow}>
              <Star size={13} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.specMetricValue}>{ratingScore}</Text>
              {item.reviews_count ? (
                <Text style={styles.specMetricSub}>({item.reviews_count})</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.specDivider} />

          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Proyek Tuntas</Text>
            <View style={styles.specMetricRow}>
              <Award size={13} color={COLORS.brandIndigo} />
              <Text style={styles.specMetricValue}>{completedCount}</Text>
              <Text style={styles.specMetricSub}>Proyek</Text>
            </View>
          </View>

          <View style={styles.specDivider} />

          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Sukses Escrow</Text>
            <View style={styles.specMetricRow}>
              <ShieldCheck size={13} color={COLORS.success} />
              <Text style={[styles.specMetricValue, { color: COLORS.success }]}>
                {item.escrow_success_rate || "100%"}
              </Text>
            </View>
          </View>
        </View>

        {/* 4. Skills Pills */}
        {skillsList.length > 0 && (
          <View style={styles.skillsRow}>
            {skillsList.map((skill, idx) => (
              <View key={idx} style={styles.skillPill}>
                <Text style={styles.skillPillText}>{skill}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 5. Card Actions */}
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
            activeOpacity={0.85}
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
        category="DIREKTORI TALENTA KAMPUS"
        title="Eksplorasi Mahasiswa"
        subtitle="Temukan talenta muda terverifikasi untuk proyek usaha Anda"
        showBell={true}
        onBellPress={() => setIsNotificationOpen(true)}
        unreadCount={unreadNotifications}
      />

      {/* 2. Search Bar with Filter Tuning Button */}
      <View style={styles.searchSection}>
        <SearchBar
          placeholder="Cari nama talenta, keahlian, atau prodi..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery("")}
          showFilterBtn={true}
          onFilterPress={() => setIsFilterModalOpen(true)}
          activeFilterCount={activeFilterCount}
        />
      </View>

      {/* 3. Underline Segmented Navigation Tabs */}
      <View style={styles.segmentedContainer}>
        {segmentedTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={styles.segmentedTabItem}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.segmentedTabText,
                  isActive && styles.segmentedTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeUnderlineBar} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 4. Active Filter Bar */}
      {activeFilterCount > 0 && (
        <View style={styles.activeFilterBar}>
          <Text style={styles.activeFilterLabel}>Filter Aktif:</Text>
          {selectedProdi !== "ALL" && (
            <View style={styles.activeFilterPill}>
              <Text style={styles.activeFilterPillText}>{selectedProdi}</Text>
              <TouchableOpacity
                onPress={() => setSelectedProdi("ALL")}
                activeOpacity={0.7}
              >
                <X size={12} color={COLORS.brandIndigo} />
              </TouchableOpacity>
            </View>
          )}
          {selectedMinRating !== "ALL" && (
            <View style={styles.activeFilterPill}>
              <Text style={styles.activeFilterPillText}>
                Rating ≥ {selectedMinRating}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedMinRating("ALL")}
                activeOpacity={0.7}
              >
                <X size={12} color={COLORS.brandIndigo} />
              </TouchableOpacity>
            </View>
          )}
          {selectedMinProjects !== "ALL" && (
            <View style={styles.activeFilterPill}>
              <Text style={styles.activeFilterPillText}>
                ≥ {selectedMinProjects} Proyek Selesai
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedMinProjects("ALL")}
                activeOpacity={0.7}
              >
                <X size={12} color={COLORS.brandIndigo} />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            onPress={resetAllFilters}
            style={styles.resetFilterTextBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.resetFilterText}>Reset</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 5. Main Feed */}
      {loading && !refreshing ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={COLORS.brandIndigo} />
          <Text style={styles.loadingText}>Memuat direktori talenta...</Text>
        </View>
      ) : (
        <FlatList
          data={sortedTalents}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderTalentItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.brandIndigo}
              colors={[COLORS.brandIndigo]}
            />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Compass size={40} color={COLORS.brandIndigo} />
              <Text style={styles.emptyTitle}>
                {searchQuery || activeFilterCount > 0
                  ? "Talenta Tidak Ditemukan"
                  : "Belum Ada Talenta"}
              </Text>
              <Text style={styles.emptyDesc}>
                {searchQuery || activeFilterCount > 0
                  ? "Coba sesuaikan kata kunci pencarian atau reset filter Anda."
                  : "Katalog mahasiswa terverifikasi akan segera ditampilkan di sini."}
              </Text>
              {activeFilterCount > 0 && (
                <Button
                  title="Reset Filter"
                  variant="secondary"
                  size="sm"
                  icon={<RotateCcw size={14} color={COLORS.textDark} />}
                  onPress={resetAllFilters}
                  style={styles.emptyBtn}
                />
              )}
            </View>
          }
          ListFooterComponent={<View style={{ height: 90 }} />}
        />
      )}

      {/* Filter Bottom Sheet Modal */}
      <Modal
        visible={isFilterModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModalSheet}>
            <View style={styles.filterModalHeader}>
              <View>
                <Text style={styles.filterModalTitle}>Filter Direktori Talenta</Text>
                <Text style={styles.filterModalSub}>
                  Saring berdasarkan program studi, rating, dan pengalaman
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsFilterModalOpen(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <X size={18} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              {/* Prodi Section */}
              <Text style={styles.filterSectionTitle}>Program Studi</Text>
              <View style={styles.filterChipGrid}>
                {PRODI_OPTIONS.map((opt) => {
                  const isSelected = selectedProdi === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      onPress={() => setSelectedProdi(opt.id)}
                      style={[
                        styles.modalOptionChip,
                        isSelected && styles.modalOptionChipActive,
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.modalOptionChipText,
                          isSelected && styles.modalOptionChipTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Minimal Rating Section */}
              <Text style={styles.filterSectionTitle}>Minimal Reputasi Skor</Text>
              <View style={styles.filterChipGrid}>
                {RATING_OPTIONS.map((opt) => {
                  const isSelected = selectedMinRating === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      onPress={() => setSelectedMinRating(opt.id)}
                      style={[
                        styles.modalOptionChip,
                        isSelected && styles.modalOptionChipActive,
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.modalOptionChipText,
                          isSelected && styles.modalOptionChipTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Proyek Selesai Section */}
              <Text style={styles.filterSectionTitle}>Pengalaman Proyek Tuntas</Text>
              <View style={styles.filterChipGrid}>
                {PROJECT_OPTIONS.map((opt) => {
                  const isSelected = selectedMinProjects === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      onPress={() => setSelectedMinProjects(opt.id)}
                      style={[
                        styles.modalOptionChip,
                        isSelected && styles.modalOptionChipActive,
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.modalOptionChipText,
                          isSelected && styles.modalOptionChipTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.modalActionButtons}>
              <TouchableOpacity
                onPress={resetAllFilters}
                style={styles.modalResetBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.modalResetBtnText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsFilterModalOpen(false)}
                style={styles.modalApplyBtn}
                activeOpacity={0.85}
              >
                <Text style={styles.modalApplyBtnText}>Terapkan Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Detail Modal (Portofolio & Resume) */}
      <Modal
        visible={isDetailModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDetailModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalCard}>
            <View style={styles.detailModalHeader}>
              <Text style={styles.detailModalTitle}>Portofolio & Kredensial</Text>
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
                    <View style={styles.nameRow}>
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

                {/* Metrics Summary in Modal */}
                <View style={styles.detailBadgesRow}>
                  <View style={styles.detailBadgeItem}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.detailBadgeValue}>
                      {selectedTalent.rating_avg != null
                        ? Number(selectedTalent.rating_avg).toFixed(1)
                        : "-"}
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
                      {selectedTalent.escrow_success_rate || "100%"}
                    </Text>
                    <Text style={styles.detailBadgeLabel}>Sukses Escrow</Text>
                  </View>
                </View>

                {/* Bio Summary */}
                <View style={styles.detailSectionBox}>
                  <Text style={styles.detailSectionHeading}>
                    Ringkasan Profesional
                  </Text>
                  <Text style={styles.detailBioBody}>
                    {selectedTalent.bio ||
                      "Mahasiswa aktif berfokus pada pengembangan produk digital & desain solutif untuk kemitraan UMKM."}
                  </Text>
                </View>

                {/* Skills */}
                {Array.isArray(selectedTalent.skills) &&
                  selectedTalent.skills.length > 0 && (
                    <View style={styles.detailSectionBox}>
                      <Text style={styles.detailSectionHeading}>
                        Keahlian & Kemampuan
                      </Text>
                      <View style={styles.skillsRow}>
                        {selectedTalent.skills.map((skill, idx) => (
                          <View key={idx} style={styles.detailSkillPill}>
                            <Text style={styles.detailSkillText}>{skill}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                {/* Portfolio Links */}
                <View style={styles.detailSectionBox}>
                  <Text style={styles.detailSectionHeading}>
                    Tautan Karya & Portofolio
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
                          GitHub Profile
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
                          Figma Portofolio
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
                          Website Portofolio
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
                          Tautan portofolio publik belum dicantumkan.
                        </Text>
                      )}
                  </View>
                </View>

                {/* Recent Reviews */}
                {Array.isArray(selectedTalent.recent_reviews) &&
                  selectedTalent.recent_reviews.length > 0 && (
                    <View style={styles.detailSectionBox}>
                      <Text style={styles.detailSectionHeading}>
                        Ulasan Kepuasan Klien ({selectedTalent.recent_reviews.length})
                      </Text>
                      <View style={styles.reviewsListWrap}>
                        {selectedTalent.recent_reviews.map((rev, idx) => (
                          <View key={idx} style={styles.reviewItemCard}>
                            <View style={styles.reviewTopRow}>
                              <Text style={styles.reviewClientName}>
                                {rev.reviewer_name || "Klien UMKM Terverifikasi"}
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

            {/* Modal Bottom CTA */}
            <View style={styles.detailModalFooter}>
              <TouchableOpacity
                style={styles.modalPrimaryActionBtn}
                onPress={() => {
                  setIsDetailModalOpen(false);
                  if (selectedTalent) handleOpenContact(selectedTalent);
                }}
                activeOpacity={0.85}
              >
                <MessageSquare size={16} color="#FFFFFF" />
                <Text style={styles.modalPrimaryActionBtnText}>
                  Ajak Kolaborasi Proyek
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Invite Collaboration Modal */}
      <Modal
        visible={isContactModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsContactModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.inviteModalCard}>
            <View style={styles.detailModalHeader}>
              <Text style={styles.detailModalTitle}>Ajak Kolaborasi Proyek</Text>
              <TouchableOpacity
                onPress={() => setIsContactModalOpen(false)}
                style={styles.closeCircleBtn}
                activeOpacity={0.7}
              >
                <X size={18} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inviteSubText}>
              Pilih salah satu proyek aktif Anda untuk menghubungkan brief pengerjaan dengan{" "}
              <Text style={{ fontFamily: FONTS.bodyBold, color: COLORS.textDark }}>
                {selectedTalent?.nama_lengkap}
              </Text>
              .
            </Text>

            {loadingProjects ? (
              <View style={{ padding: 24, alignItems: "center" }}>
                <ActivityIndicator size="small" color={COLORS.brandIndigo} />
                <Text style={styles.loadingText}>Memuat daftar proyek Anda...</Text>
              </View>
            ) : myProjects.length > 0 ? (
              <View style={styles.projectSelectList}>
                {myProjects.map((p) => {
                  const isChecked = selectedProjectId === p.id;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[
                        styles.projectOptionRow,
                        isChecked && styles.projectOptionRowActive,
                      ]}
                      onPress={() => setSelectedProjectId(p.id)}
                      activeOpacity={0.8}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.projectOptionTitle} numberOfLines={1}>
                          {p.judul}
                        </Text>
                        <Text style={styles.projectOptionMeta}>
                          Status: {p.status}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.radioCircle,
                          isChecked && styles.radioCircleActive,
                        ]}
                      >
                        {isChecked && <View style={styles.radioDot} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={styles.noProjectsNotice}>
                <Briefcase size={28} color={COLORS.brandIndigo} style={{ marginBottom: 8 }} />
                <Text style={styles.noProjectsNoticeTitle}>
                  Belum Ada Proyek Aktif
                </Text>
                <Text style={styles.noProjectsNoticeDesc}>
                  Anda dapat membuat deskripsi proyek baru sekarang agar talenta ini langsung dapat meninjau dan menerima penawaran Anda.
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

      {/* Notification Center */}
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

  // Search Section
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: COLORS.bgSurface,
  },

  // Segmented Tabs (Underline Style)
  segmentedContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.bgSurface,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  segmentedTabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  segmentedTabText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textMuted,
  },
  segmentedTabTextActive: {
    fontFamily: FONTS.bodyBold,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  activeUnderlineBar: {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    height: 2.5,
    backgroundColor: COLORS.brandIndigo,
    borderRadius: 2,
  },

  // Active Filter Bar
  activeFilterBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: COLORS.canvasSoft,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
    gap: 8,
    flexWrap: "wrap",
  },
  activeFilterLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  activeFilterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.2)",
  },
  activeFilterPillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  resetFilterTextBtn: {
    marginLeft: "auto",
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  resetFilterText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.danger,
    fontWeight: "700",
  },

  // List & Cards
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },
  loadingCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
  },
  loadingText: {
    fontSize: 13,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
    marginTop: 12,
  },

  talentCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    ...SHADOWS.sm,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarLetter: {
    fontSize: 16,
    fontFamily: FONTS.displayBold,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  headerInfoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  talentName: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  prodiRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  prodiText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  statusBadgePill: {
    backgroundColor: COLORS.brandCyanLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.brandCyan,
  },

  bioText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },

  // Specs Grid
  specsGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  specItem: {
    flex: 1,
    alignItems: "center",
  },
  specDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.borderDark,
  },
  specLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  specMetricRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  specMetricValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  specMetricSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
  },

  // Skills
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  skillPill: {
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  skillPillText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.brandIndigo,
  },

  // Card Action Buttons
  cardActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    paddingTop: 12,
  },
  detailBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    backgroundColor: COLORS.bgSurface,
  },
  detailBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  contactBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: COLORS.brandIndigo,
  },
  contactBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginTop: 12,
  },
  emptyTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
    marginTop: 12,
    marginBottom: 4,
    textAlign: "center",
  },
  emptyDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 16,
  },
  emptyBtn: {
    minWidth: 140,
  },

  // Modal Common Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "flex-end",
  },

  // Filter Modal Sheet
  filterModalSheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
  },
  filterModalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  filterModalTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  filterModalSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  filterSectionTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
    marginTop: 12,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  filterChipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },
  modalOptionChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  modalOptionChipActive: {
    backgroundColor: COLORS.brandIndigoLight,
    borderColor: COLORS.brandIndigo,
  },
  modalOptionChipText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  modalOptionChipTextActive: {
    fontFamily: FONTS.bodyBold,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  modalActionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  modalResetBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    alignItems: "center",
    justifyContent: "center",
  },
  modalResetBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  modalApplyBtn: {
    flex: 1,
    backgroundColor: COLORS.brandIndigo,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modalApplyBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Detail Modal
  detailModalCard: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "88%",
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 20,
  },
  detailModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  detailModalTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  closeCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  detailScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  detailProfileTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  detailAvatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.brandIndigo,
    alignItems: "center",
    justifyContent: "center",
  },
  detailAvatarLetter: {
    fontSize: 22,
    fontFamily: FONTS.displayBold,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  detailInfoCol: {
    flex: 1,
  },
  detailNameText: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  detailProdiText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.brandCyan,
    marginTop: 2,
  },
  detailNimText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  detailBadgesRow: {
    flexDirection: "row",
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  detailBadgeItem: {
    flex: 1,
    alignItems: "center",
  },
  detailBadgeValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
    marginVertical: 2,
  },
  detailBadgeLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  detailSectionBox: {
    marginBottom: 16,
  },
  detailSectionHeading: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  detailBioBody: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  detailSkillPill: {
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  detailSkillText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.brandIndigo,
  },
  portfolioLinksGrid: {
    gap: 8,
  },
  portfolioLinkCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.canvasSoft,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  portfolioLinkLabel: {
    flex: 1,
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  emptyMetaText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  reviewsListWrap: {
    gap: 8,
  },
  reviewItemCard: {
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  reviewTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  reviewClientName: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  reviewStarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  reviewScoreText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
    color: "#F59E0B",
  },
  reviewProjectTitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.brandIndigo,
    marginBottom: 4,
  },
  reviewCommentText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  detailModalFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark,
  },
  modalPrimaryActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.brandIndigo,
    paddingVertical: 13,
    borderRadius: 14,
  },
  modalPrimaryActionBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Invite Modal
  inviteModalCard: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
  },
  inviteSubText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 10,
    marginBottom: 14,
  },
  projectSelectList: {
    gap: 8,
    maxHeight: 250,
  },
  projectOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  projectOptionRowActive: {
    backgroundColor: COLORS.brandIndigoLight,
    borderColor: COLORS.brandIndigo,
  },
  projectOptionTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  projectOptionMeta: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.textMuted,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  radioCircleActive: {
    borderColor: COLORS.brandIndigo,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.brandIndigo,
  },
  noProjectsNotice: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 12,
  },
  noProjectsNoticeTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  noProjectsNoticeDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 16,
  },
  contactActionButtons: {
    marginTop: 16,
  },
  primaryInviteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.brandIndigo,
    paddingVertical: 13,
    borderRadius: 14,
  },
  primaryInviteBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
