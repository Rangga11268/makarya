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
import { TalentFilterModal } from "../../components/features/talents/TalentFilterModal";
import { TalentDetailModal } from "../../components/features/talents/TalentDetailModal";
import { TalentInviteModal } from "../../components/features/talents/TalentInviteModal";
import { Button } from "../../components/ui/Button";
import { PebbleButton } from "../../components/ui/PebbleButton";
import { OrganicRibbonBackground } from "../../components/ui/OrganicRibbonBackground";
import { TalentCardSkeleton } from "../../components/ui/Skeleton";
import { talentApi, projectApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";
import { formatStatus } from "../../utils/formatStatus";
import { formatCurrency } from "../../utils/formatCurrency";
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
    skills: [
      "Figma",
      "Adobe Illustrator",
      "Brand Identity",
      "Packaging",
      "Typography",
    ],
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
        komentar:
          "Rebranding packaging produk sangat menarik, omset offline kami langsung naik.",
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
    skills: [
      "React Native",
      "Flutter",
      "REST API",
      "Firebase",
      "State Management",
    ],
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
        komentar:
          "Aplikasi kasir mobile berjalan sangat enteng di handphone operasional toko.",
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
      if (selectedMinRating !== "ALL")
        params.min_rating = parseFloat(selectedMinRating);
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
    const ratingScore =
      item.rating_avg != null ? Number(item.rating_avg).toFixed(1) : "-";
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

        {/* 5. Card Actions with PebbleButton */}
        <View style={styles.cardActionsRow}>
          <PebbleButton
            variant="ice"
            size="sm"
            label="Portofolio"
            onPress={() => handleOpenDetail(item)}
            style={{ flex: 1, marginRight: 8 }}
          />
          <PebbleButton
            variant="sapphire"
            size="sm"
            label="Ajak Kolaborasi"
            icon={MessageSquare}
            onPress={() => handleOpenContact(item)}
            style={{ flex: 1.2 }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <OrganicRibbonBackground height={320} />
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

      {/* 3. Apple Glass Capsule Segmented Navigation Tabs */}
      <View style={styles.segmentedContainer}>
        {segmentedTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.segmentedTabItem,
                isActive && styles.segmentedTabItemActive,
              ]}
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
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          <TalentCardSkeleton />
          <TalentCardSkeleton />
          <TalentCardSkeleton />
        </ScrollView>
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
      <TalentFilterModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedProdi={selectedProdi}
        setSelectedProdi={setSelectedProdi}
        selectedMinRating={selectedMinRating}
        setSelectedMinRating={setSelectedMinRating}
        selectedMinProjects={selectedMinProjects}
        setSelectedMinProjects={setSelectedMinProjects}
        resetAllFilters={resetAllFilters}
        prodiOptions={PRODI_OPTIONS}
        ratingOptions={RATING_OPTIONS}
        projectOptions={PROJECT_OPTIONS}
      />

      {/* Detail Modal (Portofolio & Resume) */}
      <TalentDetailModal
        visible={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        talent={selectedTalent}
        openUrl={openUrl}
        onInvite={(talent) => handleOpenContact(talent)}
      />

      {/* Invite Collaboration Modal */}
      <TalentInviteModal
        visible={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        talent={selectedTalent}
        myProjects={myProjects}
        loadingProjects={loadingProjects}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        onInvite={handleInviteToProject}
        navigation={navigation}
      />

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
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: "transparent",
  },

  // Segmented Tabs (Apple Glass Capsule Style)
  segmentedContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    marginHorizontal: 20,
    marginTop: 2,
    marginBottom: 6,
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  segmentedTabItem: {
    flex: 1,
    paddingVertical: 7,
    alignItems: "center",
    borderRadius: 11,
  },
  segmentedTabItemActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentedTabText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  segmentedTabTextActive: {
    fontFamily: FONTS.displaySemiBold,
    color: COLORS.brandIndigo,
  },

  // Active Filter Bar
  activeFilterBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 6,
    backgroundColor: "transparent",
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
    backgroundColor: "rgba(255, 255, 255, 0.90)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
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
    paddingTop: 8,
    paddingBottom: 24,
    gap: 10,
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
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
});
