import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { Header } from "../../components/ui/Header";
import { TalentBentoCard } from "../../components/features/TalentBentoCard";
import { ProjectCard } from "../../components/features/ProjectCard";
import { CategoryChip } from "../../components/ui/CategoryChip";
import { NotificationModal } from "../../components/features/NotificationModal";
import { CATEGORIES } from "../../constants/categories";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";
import { projectApi, walletApi, proposalApi } from "../../api";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import {
  Sparkles,
  Plus,
  ShieldCheck,
  Wallet,
  Compass,
  GraduationCap,
  ArrowRight,
  Briefcase,
  Layers,
  Banknote,
  Palette,
  Smartphone,
  Code2,
  Video,
  PenTool,
  FileSpreadsheet,
  Lock,
  Bell,
  Star,
  CheckCircle2,
  Clock,
  Award,
  Search,
} from "lucide-react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(width * 0.82, 330);

export function HomeScreen({ navigation }) {
  const { user } = useAuthStore();
  const [wallet, setWallet] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [browseProjects, setBrowseProjects] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [refreshing, setRefreshing] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { getUnreadCount } = useNotificationStore();
  const unreadNotifications = getUnreadCount(user?.role);

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

  const loadData = async () => {
    try {
      setRefreshing(true);
      if (isMahasiswa) {
        const [walletRes, browseRes, propRes] = await Promise.all([
          walletApi
            .getMe()
            .catch(() => ({ data: { saldo_aktif: 0, saldo_escrow: 0 } })),
          projectApi
            .browse({ limit: 6 })
            .catch(() => ({ data: { items: [] } })),
          proposalApi.getMyProposals().catch(() => ({ data: [] })),
        ]);
        setWallet(walletRes.data);
        const pItems = Array.isArray(browseRes.data)
          ? browseRes.data
          : browseRes.data?.items || [];
        setBrowseProjects(pItems);
        setMyProposals(Array.isArray(propRes.data) ? propRes.data : []);
      } else {
        const [walletRes, myProjRes] = await Promise.all([
          walletApi
            .getMe()
            .catch(() => ({ data: { saldo_aktif: 0, saldo_escrow: 0 } })),
          projectApi.getMyProjects().catch(() => ({ data: [] })),
        ]);
        setWallet(walletRes.data);
        setMyProjects(Array.isArray(myProjRes.data) ? myProjRes.data : []);
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.role]);

  const featuredTalents = [
    {
      id: "1",
      name: "Darell Rangga Putra",
      prodi: "Sistem Informasi • UBSI",
      rating: 5.0,
      totalJobs: 14,
      skills: ["Fullstack Web", "React & FastAPI", "UI Design"],
    },
    {
      id: "2",
      name: "Adelia Putri",
      prodi: "DKV • UBSI",
      rating: 4.9,
      totalJobs: 11,
      skills: ["Branding", "Packaging", "Logo Vector"],
    },
    {
      id: "3",
      name: "Bima Arya",
      prodi: "Teknologi Informasi • UBSI",
      rating: 5.0,
      totalJobs: 8,
      skills: ["Landing Page", "Next.js", "WordPress"],
    },
  ];

  const filteredBrowseProjects = browseProjects.filter((p) => {
    if (selectedCategory === "ALL") return true;
    return p.kategori === selectedCategory;
  });

  return (
    <View style={styles.container}>
      {/* Universal Consistent Header */}
      <Header
        userProfile={{
          initial: isMahasiswa
            ? user?.nama_lengkap?.charAt(0) || "D"
            : user?.nama_usaha?.charAt(0) || "U",
          name: isMahasiswa
            ? user?.nama_lengkap || "Darell Rangga"
            : user?.nama_usaha || "Brand UMKM Anda",
          roleText: isMahasiswa
            ? "UI/UX & Web Developer • UBSI"
            : "Klien UMKM Terverifikasi",
          isMahasiswa,
        }}
        onProfilePress={() => navigation.navigate("ProfileTab")}
        showBell={true}
        onBellPress={() => setIsNotificationOpen(true)}
        unreadCount={unreadNotifications}
      />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadData}
            tintColor={COLORS.brandIndigo}
            colors={[COLORS.brandIndigo]}
          />
        }
      >
        {/* 2. Hero Bento Grid Section (Reference Mockup Style) */}
        <View style={styles.bentoSection}>
        <View style={styles.bentoHeaderRow}>
          <Text style={styles.bentoSectionTitle}>
            {isMahasiswa ? "Dashboard Mahasiswa" : "Dashboard Klien UMKM"}
          </Text>
          <Text style={styles.bentoDateText}>31 Agu 2026</Text>
        </View>

        <View style={styles.bentoGridRow}>
          {/* Left Large Bento Card: Earnings / Saldo */}
          <TouchableOpacity
            style={styles.bentoEarningsCard}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("WalletTab")}
          >
            <View style={styles.earningsTopRow}>
              <Text style={styles.earningsLabel}>
                {isMahasiswa ? "Saldo Honor" : "Saldo Escrow"}
              </Text>
              <Text style={styles.earningsDetailsLink}>Rincian</Text>
            </View>

            <Text style={styles.earningsAmount}>
              {formatCurrency(wallet?.saldo_aktif || 0)}
            </Text>
            <Text style={styles.earningsSub}>
              {wallet?.saldo_aktif > 0
                ? "+12% dari bulan lalu"
                : "Siap dicairkan ke rekening"}
            </Text>

            {/* Nested Mini Target / Escrow Card */}
            <View style={styles.nestedEscrowCard}>
              <View style={styles.nestedIconCircle}>
                <Lock size={12} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.nestedEscrowLabel}>
                  {isMahasiswa ? "Escrow Pengerjaan" : "Escrow Terkunci"}
                </Text>
                <Text style={styles.nestedEscrowValue}>
                  {formatCurrency(wallet?.saldo_escrow || 0)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Right Column Stack (2 Metric Cards) */}
          <View style={styles.bentoRightColumn}>
            {/* Top Metric: 100% On-Time / Escrow Safe */}
            <View style={styles.bentoMiniCard}>
              <View style={styles.progressRingRow}>
                <View style={styles.progressRingCircle}>
                  <Text style={styles.progressRingText}>100%</Text>
                </View>
              </View>
              <Text style={styles.miniCardLabel}>Jaminan Escrow Aman</Text>
            </View>

            {/* Bottom Metric: Star Rating */}
            <View style={styles.bentoMiniCard}>
              <View style={styles.ratingRow}>
                <Star size={15} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingValue}>5.0</Text>
                <Text style={styles.ratingMax}>/5.0</Text>
              </View>
              <Text style={styles.miniCardLabel}>Rating Positif</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. Ongoing Projects Section (Matching Mockup "Ongoing Project") */}
      {isMahasiswa && myProposals.length > 0 && (
        <View style={styles.ongoingSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Proyek Berjalan</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("TrackerTab")}
              activeOpacity={0.7}
            >
              <Text style={styles.seeMoreLink}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {myProposals.slice(0, 2).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.ongoingProjectCard}
              activeOpacity={0.88}
              onPress={() =>
                navigation.navigate("ProjectDetail", {
                  id: item.project_id,
                  projectId: item.project_id,
                })
              }
            >
              <View style={styles.ongoingHeader}>
                <View style={styles.ongoingCategoryIconBox}>
                  <Palette size={16} color={COLORS.brandIndigo} />
                </View>

                <View style={styles.ongoingTitleWrapper}>
                  <Text style={styles.ongoingTitle} numberOfLines={1}>
                    {item.project_judul || "Pengembangan Web UMKM"}
                  </Text>
                  <Text style={styles.ongoingClientName}>
                    {item.project_umkm_nama || "Klien UMKM"}
                  </Text>
                </View>

                <Text style={styles.ongoingPrice}>
                  {formatCurrency(item.harga_tawar)}
                </Text>
              </View>

              <View style={styles.ongoingFooter}>
                <View
                  style={[
                    styles.statusPill,
                    item.status === "ACCEPTED"
                      ? styles.statusPillActive
                      : styles.statusPillPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      item.status === "ACCEPTED"
                        ? styles.statusTextActive
                        : styles.statusTextPending,
                    ]}
                  >
                    {item.status === "ACCEPTED"
                      ? "Sedang Dikerjakan"
                      : "Review Proposal"}
                  </Text>
                </View>

                <View style={styles.ongoingDateRow}>
                  <Clock size={11} color={COLORS.textMuted} />
                  <Text style={styles.ongoingDateText}>
                    {item.estimasi_hari || 5} Hari Kerja
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 4. Category Selector Chips */}
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {CATEGORIES.map((c) => (
            <CategoryChip
              key={c.id}
              category={c}
              isSelected={selectedCategory === c.id}
              onPress={() => setSelectedCategory(c.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* 5. Discover Projects (Eksplor Proyek UMKM) */}
      {isMahasiswa ? (
        <View style={styles.feedSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>
                {selectedCategory === "ALL"
                  ? "Rekomendasi Proyek Terbaru"
                  : `Kategori ${CATEGORIES.find((c) => c.id === selectedCategory)?.label}`}
              </Text>
              <Text style={styles.sectionSubtitle}>
                Geser ke samping untuk melihat proyek pilihan
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("ProjectsTab")}
              style={styles.seeAllBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllText}>Lihat Semua</Text>
              <ArrowRight size={14} color={COLORS.brandIndigo} />
            </TouchableOpacity>
          </View>

          {filteredBrowseProjects.length === 0 ? (
            <View style={styles.emptyBox}>
              <Briefcase size={36} color={COLORS.textDim} />
              <Text style={styles.emptyTitle}>Belum Ada Proyek</Text>
              <Text style={styles.emptySubtitle}>
                Coba pilih kategori lain atau periksa kembali nanti.
              </Text>
            </View>
          ) : (
            <>
              {/* 1. Horizontal Snap Carousel */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalProjectList}
                snapToInterval={CARD_WIDTH + 12}
                decelerationRate="fast"
              >
                {filteredBrowseProjects.slice(0, 5).map((p) => (
                  <View
                    key={p.id}
                    style={{ width: CARD_WIDTH, marginRight: 12 }}
                  >
                    <ProjectCard
                      project={p}
                      onPress={() =>
                        navigation.navigate("ProjectDetail", {
                          id: p.id,
                          projectId: p.id,
                        })
                      }
                    />
                  </View>
                ))}

                {/* Carousel End-Cap Action Card */}
                <TouchableOpacity
                  style={[
                    styles.carouselEndCapCard,
                    { width: CARD_WIDTH * 0.75 },
                  ]}
                  onPress={() => navigation.navigate("ProjectsTab")}
                  activeOpacity={0.85}
                >
                  <View style={styles.endCapIconCircle}>
                    <Compass size={24} color={COLORS.brandIndigo} />
                  </View>
                  <Text style={styles.endCapTitle}>Jelajahi Semua Proyek</Text>
                  <Text style={styles.endCapSubtitle}>
                    Buka katalog lengkap dengan filter keahlian & pagu anggaran
                  </Text>
                  <View style={styles.endCapBtn}>
                    <Text style={styles.endCapBtnText}>Buka Eksplor</Text>
                    <ArrowRight size={14} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </ScrollView>

              {/* 2. Quick Search Banner */}
              <TouchableOpacity
                style={styles.exploreBanner}
                onPress={() => navigation.navigate("ProjectsTab")}
                activeOpacity={0.88}
              >
                <View style={styles.exploreBannerLeft}>
                  <View style={styles.exploreBannerIcon}>
                    <Search size={18} color={COLORS.brandIndigo} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exploreBannerTitle}>
                      Cari Kebutuhan Spesifik?
                    </Text>
                    <Text style={styles.exploreBannerSub}>
                      Gunakan filter kategori & kata kunci di tab Eksplor
                    </Text>
                  </View>
                </View>
                <ArrowRight size={18} color={COLORS.brandIndigo} />
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        /* UMKM Feed */
        <View style={styles.feedSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>
                Talenta Mahasiswa Unggulan
              </Text>
              <Text style={styles.sectionSubtitle}>
                Mahasiswa terverifikasi dengan portofolio & ulasan terbaik
              </Text>
            </View>
          </View>

          <TalentBentoCard
            talent={featuredTalents[0]}
            variant="featured"
            onPress={() => navigation.navigate("ProjectsTab")}
          />

          {featuredTalents.slice(1).map((t) => (
            <TalentBentoCard
              key={t.id}
              talent={t}
              variant="standard"
              onPress={() => navigation.navigate("ProjectsTab")}
            />
          ))}
        </View>
      )}

        {/* Working Notification Modal */}
        <NotificationModal
          visible={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 50,
    paddingBottom: 110,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  userProfileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarMhs: {
    backgroundColor: COLORS.brandIndigo,
  },
  avatarUmkm: {
    backgroundColor: COLORS.brandCyan,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  verifiedCheckBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  userRole: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: "600",
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bgSurface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    position: "relative",
    ...SHADOWS.sm,
  },
  unreadDot: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F43F5E", // Vibrant pink/red notification dot
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  bentoSection: {
    marginBottom: 22,
  },
  bentoHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  bentoSectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.2,
  },
  bentoDateText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  bentoGridRow: {
    flexDirection: "row",
    gap: 12,
  },
  bentoEarningsCard: {
    flex: 1.35,
    backgroundColor: "#2563EB", // Vibrant Royal Blue / Indigo gradient look
    borderRadius: 22,
    padding: 16,
    justifyContent: "space-between",
    ...SHADOWS.md,
  },
  earningsTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  earningsLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.8)",
  },
  earningsDetailsLink: {
    fontSize: 11,
    fontWeight: "700",
    color: "#93C5FD",
  },
  earningsAmount: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginTop: 8,
  },
  earningsSub: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.75)",
    marginTop: 2,
    marginBottom: 12,
  },
  nestedEscrowCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    padding: 10,
    borderRadius: 14,
  },
  nestedIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  nestedEscrowLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.8)",
    textTransform: "uppercase",
  },
  nestedEscrowValue: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  bentoRightColumn: {
    flex: 0.95,
    gap: 12,
  },
  bentoMiniCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 14,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    ...SHADOWS.sm,
  },
  progressRingRow: {
    alignItems: "flex-start",
    marginBottom: 6,
  },
  progressRingCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 3,
    borderColor: COLORS.success,
    alignItems: "center",
    justifyContent: "center",
  },
  progressRingText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.success,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  ratingValue: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.textDark,
  },
  ratingMax: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "700",
  },
  miniCardLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "700",
  },
  ongoingSection: {
    marginBottom: 22,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  seeMoreLink: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  ongoingProjectCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 10,
    ...SHADOWS.sm,
  },
  ongoingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ongoingCategoryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  ongoingTitleWrapper: {
    flex: 1,
  },
  ongoingTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  ongoingClientName: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  ongoingPrice: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.success,
  },
  ongoingFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusPillActive: {
    backgroundColor: COLORS.brandIndigoLight,
  },
  statusPillPending: {
    backgroundColor: COLORS.warningBg,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: "700",
  },
  statusTextActive: {
    color: COLORS.brandIndigo,
  },
  statusTextPending: {
    color: COLORS.warning,
  },
  ongoingDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ongoingDateText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  categoriesSection: {
    marginBottom: 20,
  },
  categoryList: {
    gap: 8,
  },
  feedSection: {
    marginBottom: 20,
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.brandIndigo,
  },
  emptyBox: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    ...SHADOWS.sm,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textDark,
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: "center",
  },
  horizontalProjectList: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  carouselEndCapCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.sm,
  },
  endCapIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  endCapTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textDark,
    textAlign: "center",
  },
  endCapSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 16,
  },
  endCapBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.brandIndigo,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
  },
  endCapBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  exploreBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.bgSurface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginTop: 14,
    ...SHADOWS.sm,
  },
  exploreBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  exploreBannerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  exploreBannerTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  exploreBannerSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
