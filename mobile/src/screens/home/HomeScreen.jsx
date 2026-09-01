import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { TalentBentoCard } from "../../components/features/TalentBentoCard";
import { ProjectCard } from "../../components/features/ProjectCard";
import { NotificationModal } from "../../components/features/NotificationModal";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";
import { projectApi, walletApi, proposalApi } from "../../api";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  Sparkles,
  ShieldCheck,
  Wallet,
  Compass,
  ArrowRight,
  Briefcase,
  Layers,
  Palette,
  Smartphone,
  Code2,
  Video,
  BarChart3,
  FileText,
  Lock,
  Bell,
  Star,
  Clock,
  Search,
  ChevronRight,
  ArrowUpRight,
  Plus,
} from "lucide-react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(width * 0.84, 340);

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

  // Modern 6 Bento Categories (Interactive Hub)
  const categoryTiles = [
    {
      id: "DESAIN",
      title: "Desain UI/UX",
      sub: "Figma & Logo",
      icon: Palette,
      color: "#6366F1",
      bgColor: "rgba(99, 102, 241, 0.08)",
      borderColor: "rgba(99, 102, 241, 0.2)",
    },
    {
      id: "WEB",
      title: "Web & Coding",
      sub: "React & API",
      icon: Code2,
      color: "#0EA5E9",
      bgColor: "rgba(14, 165, 233, 0.08)",
      borderColor: "rgba(14, 165, 233, 0.2)",
    },
    {
      id: "MOBILE",
      title: "App Mobile",
      sub: "Flutter & RN",
      icon: Smartphone,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.08)",
      borderColor: "rgba(16, 185, 129, 0.2)",
    },
    {
      id: "VIDEO",
      title: "Video & Reels",
      sub: "Editing Promosi",
      icon: Video,
      color: "#F43F5E",
      bgColor: "rgba(244, 63, 94, 0.08)",
      borderColor: "rgba(244, 63, 94, 0.2)",
    },
    {
      id: "MARKETING",
      title: "Pemasaran & Ads",
      sub: "SEO & Sosmed",
      icon: BarChart3,
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.08)",
      borderColor: "rgba(245, 158, 11, 0.2)",
    },
    {
      id: "WRITING",
      title: "Riset & Penulisan",
      sub: "Copy & Proposal",
      icon: FileText,
      color: "#64748B",
      bgColor: "rgba(100, 116, 139, 0.08)",
      borderColor: "rgba(100, 116, 139, 0.2)",
    },
  ];

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

  const displayName = isMahasiswa
    ? user?.nama_lengkap || "Darell Rangga"
    : user?.nama_usaha || "Pengusaha UMKM";

  const initialLetter = displayName.charAt(0).toUpperCase() || "M";

  return (
    <View style={styles.container}>
      {/* 1. Ultra-Clean Modern Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.avatarPill}
            onPress={() => navigation.navigate("ProfileTab")}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.userAvatarCircle,
                isMahasiswa ? styles.avatarMhs : styles.avatarUmkm,
              ]}
            >
              <Text style={styles.avatarInitial}>{initialLetter}</Text>
            </View>
            <View style={styles.greetingTextGroup}>
              <View style={styles.greetingRow}>
                <Text style={styles.greetingTitle} numberOfLines={1}>
                  {displayName}
                </Text>
                <Sparkles size={12} color="#F59E0B" fill="#F59E0B" />
              </View>
              <Text style={styles.greetingRole}>
                {isMahasiswa
                  ? "Talenta Mahasiswa • UBSI"
                  : "Klien UMKM Terverifikasi"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => navigation.navigate("ProjectsTab")}
            activeOpacity={0.8}
          >
            <Search size={18} color={COLORS.textDark} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setIsNotificationOpen(true)}
            activeOpacity={0.8}
          >
            <Bell size={18} color={COLORS.textDark} />
            {unreadNotifications > 0 && <View style={styles.notifBadgeDot} />}
          </TouchableOpacity>
        </View>
      </View>

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
        {/* 2. Hero Financial & Trust Bento Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.escrowSecurityBadge}>
              <View style={styles.liveGreenDot} />
              <ShieldCheck size={13} color="#10B981" />
              <Text style={styles.escrowSecurityText}>Escrow 100% Aman</Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("WalletTab")}
              style={styles.heroDetailsBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.heroDetailsText}>Rincian Dompet</Text>
              <ChevronRight size={13} color="rgba(255, 255, 255, 0.8)" />
            </TouchableOpacity>
          </View>

          {/* Large Saldo Display */}
          <View style={styles.heroBalanceWrapper}>
            <Text style={styles.heroBalanceLabel}>
              {isMahasiswa ? "Saldo Honor Tersedia" : "Total Saldo Usaha"}
            </Text>
            <Text style={styles.heroBalanceValue}>
              {formatCurrency(wallet?.saldo_aktif || 0)}
            </Text>
          </View>

          {/* Sub Metrics Grid */}
          <View style={styles.heroMetricsGrid}>
            <View style={styles.heroMetricItem}>
              <View style={styles.metricIconWrap}>
                <Lock size={12} color="#818CF8" />
              </View>
              <View>
                <Text style={styles.metricLabel}>
                  {isMahasiswa ? "Sedang Dikerjakan" : "Dana di Escrow"}
                </Text>
                <Text style={styles.metricValue}>
                  {formatCurrency(wallet?.saldo_escrow || 0)}
                </Text>
              </View>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroMetricItem}>
              <View style={styles.metricIconWrap}>
                <Star size={12} color="#FBBF24" fill="#FBBF24" />
              </View>
              <View>
                <Text style={styles.metricLabel}>Reputasi Kampus</Text>
                <Text style={styles.metricValue}>5.0 / 5.0 ★</Text>
              </View>
            </View>
          </View>

          {/* Hero Action Quick Row */}
          <View style={styles.heroActionRow}>
            {isMahasiswa ? (
              <TouchableOpacity
                style={styles.heroActionBtnPrimary}
                onPress={() => navigation.navigate("WalletTab")}
                activeOpacity={0.85}
              >
                <Wallet size={14} color="#4F46E5" />
                <Text style={styles.heroActionBtnPrimaryText}>Tarik Saldo</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.heroActionBtnPrimary}
                onPress={() => navigation.navigate("PostProject")}
                activeOpacity={0.85}
              >
                <Plus size={14} color="#4F46E5" />
                <Text style={styles.heroActionBtnPrimaryText}>Pasang Proyek</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.heroActionBtnSecondary}
              onPress={() => navigation.navigate("TrackerTab")}
              activeOpacity={0.85}
            >
              <Layers size={14} color="#FFFFFF" />
              <Text style={styles.heroActionBtnSecondaryText}>Papan Kerja</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Modern Category Hub (Bento 2-Col Grid, No Clunky Pills!) */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionMainTitle}>Kategori Keahlian</Text>
              <Text style={styles.sectionSubTitle}>
                Jelajahi talenta & proyek berdasarkan bidang
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProjectsTab")}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllLink}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoryBentoGrid}>
            {categoryTiles.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryBentoTile,
                    { backgroundColor: cat.bgColor, borderColor: cat.borderColor },
                    isSelected && styles.categoryBentoTileActive,
                  ]}
                  onPress={() => {
                    setSelectedCategory(isSelected ? "ALL" : cat.id);
                    navigation.navigate("ProjectsTab", { category: cat.id });
                  }}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.categoryTileIconWrap,
                      { backgroundColor: "#FFFFFF" },
                    ]}
                  >
                    <Icon size={18} color={cat.color} />
                  </View>
                  <View style={styles.categoryTileTextGroup}>
                    <Text style={styles.categoryTileTitle}>{cat.title}</Text>
                    <Text style={styles.categoryTileSub}>{cat.sub}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 4. Active Milestone Tracker (If Any) */}
        {isMahasiswa && myProposals.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionMainTitle}>Pekerjaan Aktif</Text>
                <Text style={styles.sectionSubTitle}>
                  Proyek dalam tahap pengerjaan & review
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("TrackerTab")}
                activeOpacity={0.7}
              >
                <Text style={styles.seeAllLink}>Riwayat</Text>
              </TouchableOpacity>
            </View>

            {myProposals.slice(0, 2).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.activeProjectCard}
                activeOpacity={0.88}
                onPress={() =>
                  navigation.navigate("ProjectDetail", {
                    id: item.project_id,
                    projectId: item.project_id,
                  })
                }
              >
                <View style={styles.activeCardHeader}>
                  <View style={styles.activeIconCircle}>
                    <Briefcase size={16} color={COLORS.brandIndigo} />
                  </View>
                  <View style={styles.activeCardTitleWrap}>
                    <Text style={styles.activeCardTitle} numberOfLines={1}>
                      {item.project_judul || "Pengembangan Solusi UMKM"}
                    </Text>
                    <Text style={styles.activeCardClient}>
                      {item.project_umkm_nama || "Mitra UMKM"}
                    </Text>
                  </View>
                  <Text style={styles.activeCardBudget}>
                    {formatCurrency(item.harga_tawar)}
                  </Text>
                </View>

                <View style={styles.activeCardFooter}>
                  <View style={styles.activeStatusTag}>
                    <View style={styles.activeStatusDot} />
                    <Text style={styles.activeStatusText}>
                      {item.status === "ACCEPTED"
                        ? "Pengerjaan Berjalan"
                        : "Review Proposal"}
                    </Text>
                  </View>

                  <View style={styles.activeDeadlineRow}>
                    <Clock size={12} color={COLORS.textMuted} />
                    <Text style={styles.activeDeadlineText}>
                      {item.estimasi_hari || 5} Hari Pengerjaan
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 5. Recommended Feed (Curated Projects / Talents) */}
        {isMahasiswa ? (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionMainTitle}>
                  Rekomendasi Proyek
                </Text>
                <Text style={styles.sectionSubTitle}>
                  Peluang kerja baru dari UMKM terverifikasi
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("ProjectsTab")}
                style={styles.seeAllWithArrow}
                activeOpacity={0.7}
              >
                <Text style={styles.seeAllLink}>Eksplor</Text>
                <ArrowRight size={13} color={COLORS.brandIndigo} />
              </TouchableOpacity>
            </View>

            {browseProjects.length === 0 ? (
              <View style={styles.emptyCardBox}>
                <Briefcase size={32} color={COLORS.textDim} />
                <Text style={styles.emptyCardTitle}>Belum Ada Proyek</Text>
                <Text style={styles.emptyCardSubtitle}>
                  Periksa kembali beberapa saat lagi untuk tawaran terbaru.
                </Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalFeedList}
                snapToInterval={CARD_WIDTH + 14}
                decelerationRate="fast"
              >
                {browseProjects.slice(0, 5).map((p) => (
                  <View
                    key={p.id}
                    style={{ width: CARD_WIDTH, marginRight: 14 }}
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

                {/* Explore More Cap */}
                <TouchableOpacity
                  style={[styles.endCapCard, { width: CARD_WIDTH * 0.72 }]}
                  onPress={() => navigation.navigate("ProjectsTab")}
                  activeOpacity={0.85}
                >
                  <View style={styles.endCapIconBox}>
                    <Compass size={22} color={COLORS.brandIndigo} />
                  </View>
                  <Text style={styles.endCapMainText}>
                    Jelajahi Semua Proyek
                  </Text>
                  <Text style={styles.endCapSubText}>
                    Buka katalog lengkap dengan filter pagu anggaran
                  </Text>
                  <View style={styles.endCapPillBtn}>
                    <Text style={styles.endCapPillText}>Buka Katalog</Text>
                    <ArrowRight size={12} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        ) : (
          /* UMKM View: Featured Student Talents */
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionMainTitle}>
                  Talenta Mahasiswa Unggulan
                </Text>
                <Text style={styles.sectionSubTitle}>
                  Akademisi berprestasi Universitas BSI siap membantu usaha Anda
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

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Notification Modal */}
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
    backgroundColor: "#F8FAFC",
  },
  // 1. Top Header
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 54 : 44,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(226, 232, 240, 0.8)",
  },
  headerLeft: {
    flex: 1,
  },
  avatarPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarMhs: {
    backgroundColor: "#4F46E5",
  },
  avatarUmkm: {
    backgroundColor: "#0EA5E9",
  },
  avatarInitial: {
    fontFamily: FONTS.displayBold,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  greetingTextGroup: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  greetingTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  greetingRole: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notifBadgeDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },

  // Scroll Content
  scrollArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // 2. Hero Card
  heroCard: {
    backgroundColor: "#1E1B4B",
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#312E81",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  escrowSecurityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 999,
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  escrowSecurityText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: "#34D399",
    fontWeight: "700",
  },
  heroDetailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  heroDetailsText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
  },
  heroBalanceWrapper: {
    marginBottom: 16,
  },
  heroBalanceLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  heroBalanceValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  heroMetricsGrid: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderRadius: 14,
    padding: 10,
    marginBottom: 16,
  },
  heroMetricItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  heroDivider: {
    width: 1,
    height: 26,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    marginHorizontal: 8,
  },
  metricIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  metricLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.6)",
  },
  metricValue: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 1,
  },
  heroActionRow: {
    flexDirection: "row",
    gap: 10,
  },
  heroActionBtnPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderRadius: 12,
  },
  heroActionBtnPrimaryText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#4F46E5",
  },
  heroActionBtnSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 10,
    borderRadius: 12,
  },
  heroActionBtnSecondaryText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // 3. Sections & Category Bento Hub
  sectionContainer: {
    marginBottom: 22,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionMainTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  sectionSubTitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  seeAllLink: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: "#4F46E5",
    fontWeight: "700",
  },
  seeAllWithArrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  // Category Bento 2x3 Grid
  categoryBentoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryBentoTile: {
    width: (width - 32 - 10) / 2,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  categoryBentoTileActive: {
    borderColor: "#4F46E5",
    borderWidth: 1.5,
    backgroundColor: "#EEF2FF",
  },
  categoryTileIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryTileTextGroup: {
    flex: 1,
  },
  categoryTileTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  categoryTileSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "#64748B",
    marginTop: 1,
  },

  // 4. Active Project Card
  activeProjectCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  activeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  activeIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  activeCardTitleWrap: {
    flex: 1,
  },
  activeCardTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  activeCardClient: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  activeCardBudget: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: "#4F46E5",
  },
  activeCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  activeStatusTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  activeStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3B82F6",
  },
  activeStatusText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: "#3B82F6",
    fontWeight: "600",
  },
  activeDeadlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  activeDeadlineText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
  },

  // 5. Feed & End Cap
  horizontalFeedList: {
    paddingRight: 16,
  },
  endCapCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 180,
  },
  endCapIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  endCapMainText: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 4,
  },
  endCapSubText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 14,
  },
  endCapPillBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  endCapPillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  emptyCardBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyCardTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 8,
  },
  emptyCardSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
    marginTop: 3,
  },
});
