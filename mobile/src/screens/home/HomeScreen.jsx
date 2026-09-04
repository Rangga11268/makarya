import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Platform,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { TalentBentoCard } from "../../components/features/TalentBentoCard";
import { ProjectCard } from "../../components/features/ProjectCard";
import { NotificationModal } from "../../components/features/NotificationModal";
import {
  UiUxVectorIcon,
  WebCodingVectorIcon,
  MobileAppVectorIcon,
  VideoMotionVectorIcon,
  MarketingVectorIcon,
  WritingVectorIcon,
  renderProjectCategoryVectorIcon,
} from "../../components/icons/CategoryIcons";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";
import { projectApi, walletApi, proposalApi } from "../../api";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  ShieldCheck,
  Compass,
  ArrowRight,
  Briefcase,
  Lock,
  Bell,
  Star,
  Clock,
  CheckCircle2,
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

  // 6 Bespoke Vector Categories
  const categoryTiles = [
    {
      id: "DESAIN",
      title: "Desain UI/UX",
      sub: "Figma & Branding",
      iconComponent: UiUxVectorIcon,
    },
    {
      id: "WEB",
      title: "Web & Coding",
      sub: "React, Vue & API",
      iconComponent: WebCodingVectorIcon,
    },
    {
      id: "MOBILE",
      title: "App Mobile",
      sub: "Flutter & React Native",
      iconComponent: MobileAppVectorIcon,
    },
    {
      id: "VIDEO",
      title: "Video & Reels",
      sub: "Motion & Editing",
      iconComponent: VideoMotionVectorIcon,
    },
    {
      id: "MARKETING",
      title: "Pemasaran & Ads",
      sub: "SEO & Sosmed",
      iconComponent: MarketingVectorIcon,
    },
    {
      id: "WRITING",
      title: "Riset & Penulisan",
      sub: "Copywriting & Artikel",
      iconComponent: WritingVectorIcon,
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
    : user?.nama_usaha || "Brand UMKM Anda";

  const initialLetter = displayName.charAt(0).toUpperCase() || "D";

  const currentDateFormatted = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <View style={styles.container}>
      {/* 1. Top Profile Bar */}
      <View style={styles.profileTopBar}>
        <TouchableOpacity
          style={styles.profileUserGroup}
          onPress={() => navigation.navigate("ProfileTab")}
          activeOpacity={0.85}
        >
          <View style={styles.avatarWrapper}>
            <View
              style={[
                styles.userAvatarCircle,
                isMahasiswa ? styles.avatarMhs : styles.avatarUmkm,
              ]}
            >
              <Text style={styles.avatarInitial}>{initialLetter}</Text>
            </View>
            <View style={styles.verifiedTickBadge}>
              <CheckCircle2
                size={11}
                color="#FFFFFF"
                fill={COLORS.brandIndigo}
              />
            </View>
          </View>

          <View style={styles.profileTextInfo}>
            <Text style={styles.profileName} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={styles.profileRole} numberOfLines={1}>
              {isMahasiswa
                ? "UI/UX & Web Developer • UBSI"
                : "Klien UMKM Terverifikasi"}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bellIconButton}
          onPress={() => setIsNotificationOpen(true)}
          activeOpacity={0.8}
        >
          <Bell size={20} color={COLORS.textDark} />
          {unreadNotifications > 0 && <View style={styles.bellRedDot} />}
        </TouchableOpacity>
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
        {/* 2. Dashboard Title & Date Row */}
        <View style={styles.dashboardTitleRow}>
          <Text style={styles.dashboardMainTitle}>
            {isMahasiswa ? "Top Freelance Talent" : "Client Dashboard"}
          </Text>
          <Text style={styles.dashboardDateText}>{currentDateFormatted}</Text>
        </View>

        {/* 3. Exact 2-Column Hero Bento Grid (Brand Palette) */}
        <View style={styles.heroBentoRow}>
          {/* Left: Large Glowing Earnings Card */}
          <TouchableOpacity
            style={styles.earningsBlueCard}
            onPress={() => navigation.navigate("WalletTab")}
            activeOpacity={0.92}
          >
            <View style={styles.earningsTopRow}>
              <Text style={styles.earningsTitleLabel}>
                {isMahasiswa ? "Earnings" : "Escrow Balance"}
              </Text>
              <Text style={styles.earningsDetailsLink}>Details</Text>
            </View>

            <Text style={styles.earningsAmountText}>
              {formatCurrency(wallet?.saldo_aktif || 0)}
            </Text>
            <Text style={styles.earningsGrowthSub}>
              {wallet?.saldo_aktif > 0
                ? "+12% from last month"
                : "Available for withdrawal"}
            </Text>

            {/* Nested Mini Target Card */}
            <View style={styles.nestedTargetCard}>
              <View style={styles.targetIconCircle}>
                <Lock size={12} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.targetLabelText}>
                  {isMahasiswa ? "Escrow Locked" : "Escrow Held"}
                </Text>
                <Text style={styles.targetAmountText}>
                  {formatCurrency(wallet?.saldo_escrow || 0)}
                </Text>
              </View>
            </View>

            {/* Carousel Dots */}
            <View style={styles.carouselDotsRow}>
              <View style={styles.dotActive} />
              <View style={styles.dotInactive} />
              <View style={styles.dotInactive} />
              <View style={styles.dotInactive} />
            </View>
          </TouchableOpacity>

          {/* Right: Stacked 2 White Metric Cards */}
          <View style={styles.metricsRightColumn}>
            {/* Top Metric: Response On-time Rate */}
            <View style={styles.metricWhiteCard}>
              <View style={styles.greenProgressRing}>
                <Text style={styles.greenProgressText}>100%</Text>
              </View>
              <Text style={styles.metricCardLabel}>
                Response{"\n"}Rate 100%
              </Text>
            </View>

            {/* Bottom Metric: Positive Rating */}
            <View style={styles.metricWhiteCard}>
              <View style={styles.starRow}>
                <Star size={15} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.starValueText}>5.0</Text>
                <Text style={styles.starMaxText}>/5.0</Text>
              </View>
              <Text style={styles.metricCardLabel}>Positive{"\n"}Rating</Text>
            </View>
          </View>
        </View>

        {/* 4. Ongoing Project Section */}
        {isMahasiswa && myProposals.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionMainTitle}>Ongoing Projects</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("TrackerTab")}
                activeOpacity={0.7}
              >
                <Text style={styles.seeMoreLink}>See All</Text>
              </TouchableOpacity>
            </View>

            {myProposals.slice(0, 2).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.ongoingCardMockup}
                activeOpacity={0.88}
                onPress={() =>
                  navigation.navigate("ProjectDetail", {
                    id: item.project_id,
                    projectId: item.project_id,
                  })
                }
              >
                <View style={styles.ongoingCardTop}>
                  <View style={styles.ongoingThumbnail}>
                    {renderProjectCategoryVectorIcon(
                      item.kategori,
                      item.project_judul,
                      24,
                      COLORS.brandIndigo,
                    )}
                  </View>

                  <View style={styles.ongoingCardInfo}>
                    <Text style={styles.ongoingProjectTitle} numberOfLines={1}>
                      {item.project_judul || "Pengembangan Solusi UMKM"}
                    </Text>
                    <Text style={styles.ongoingClientText}>
                      {item.project_umkm_nama || "Mitra UMKM"}
                    </Text>
                  </View>

                  <Text style={styles.ongoingBudgetText}>
                    {formatCurrency(item.harga_tawar)}
                  </Text>
                </View>

                <View style={styles.ongoingCardBottom}>
                  <View
                    style={[
                      styles.revisionBadge,
                      item.status === "ACCEPTED"
                        ? styles.revisionBadgeActive
                        : styles.revisionBadgePending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.revisionBadgeText,
                        item.status === "ACCEPTED"
                          ? styles.revisionTextActive
                          : styles.revisionTextPending,
                      ]}
                    >
                      {item.status === "ACCEPTED"
                        ? "Pengerjaan"
                        : "Menunggu Seleksi"}
                    </Text>
                  </View>

                  <View style={styles.ongoingDateWrap}>
                    <Clock size={11} color={COLORS.textMuted} />
                    <Text style={styles.ongoingDateString}>
                      {item.estimasi_hari || 5} Hari Kerja
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 5. Modern Bespoke Vector Category Hub */}
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
              <Text style={styles.seeMoreLink}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoryBentoGrid}>
            {categoryTiles.map((cat) => {
              const IconComp = cat.iconComponent;
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryBentoTile,
                    isSelected && styles.categoryBentoTileActive,
                  ]}
                  onPress={() => {
                    setSelectedCategory(isSelected ? "ALL" : cat.id);
                    navigation.navigate("ProjectsTab", { category: cat.id });
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.categoryTileIconWrap}>
                    <IconComp size={24} color={COLORS.brandIndigo} />
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

        {/* 6. Curated Projects Feed */}
        {isMahasiswa ? (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionMainTitle}>
                  Peluang Proyek Terbaru
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
                <Text style={styles.seeMoreLink}>Eksplor</Text>
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
    backgroundColor: COLORS.bgDark,
  },

  // 1. Top Profile Bar
  profileTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 54 : 44,
    paddingBottom: 12,
    backgroundColor: COLORS.bgSurface,
  },
  profileUserGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatarWrapper: {
    position: "relative",
  },
  userAvatarCircle: {
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
  avatarInitial: {
    fontFamily: FONTS.displayBold,
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  verifiedTickBadge: {
    position: "absolute",
    bottom: -1,
    right: -1,
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
  },
  profileTextInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  profileRole: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  bellIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bellRedDot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },

  // Scroll Content
  scrollArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },

  // 2. Dashboard Title Row
  dashboardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dashboardMainTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  dashboardDateText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
  },

  // 3. Exact Mockup 2-Column Hero Bento Grid
  heroBentoRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 24,
  },
  earningsBlueCard: {
    flex: 1.28,
    backgroundColor: COLORS.brandIndigo,
    borderRadius: 22,
    padding: 16,
    shadowColor: COLORS.brandIndigo,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 8,
  },
  earningsTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  earningsTitleLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.85)",
  },
  earningsDetailsLink: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },
  earningsAmountText: {
    fontFamily: FONTS.displayBold,
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginTop: 8,
  },
  earningsGrowthSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.75)",
    marginTop: 2,
    marginBottom: 14,
  },
  nestedTargetCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 14,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  targetIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  targetLabelText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.85)",
  },
  targetAmountText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 1,
  },
  carouselDotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  dotActive: {
    width: 14,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },
  dotInactive: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },

  // Right Column (2 Metric Cards)
  metricsRightColumn: {
    flex: 0.82,
    gap: 12,
  },
  metricWhiteCard: {
    flex: 1,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: "center",
  },
  greenProgressRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 3.5,
    borderColor: COLORS.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  greenProgressText: {
    fontFamily: FONTS.displayBold,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  metricCardLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 14,
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 6,
  },
  starValueText: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  starMaxText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textDim,
  },

  // 4. Ongoing Projects Section
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
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  sectionSubTitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  seeMoreLink: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  seeAllWithArrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  ongoingCardMockup: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  ongoingCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  ongoingThumbnail: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  ongoingCardInfo: {
    flex: 1,
  },
  ongoingProjectTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  ongoingClientText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  ongoingBudgetText: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  ongoingCardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.canvasSoft,
  },
  revisionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  revisionBadgePending: {
    backgroundColor: COLORS.warningBg,
  },
  revisionBadgeActive: {
    backgroundColor: COLORS.successBg,
  },
  revisionBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    fontWeight: "700",
  },
  revisionTextPending: {
    color: COLORS.warning,
  },
  revisionTextActive: {
    color: COLORS.success,
  },
  ongoingDateWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ongoingDateString: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
  },

  // 5. Bespoke Vector Category Bento Grid
  categoryBentoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryBentoTile: {
    width: (width - 40 - 10) / 2,
    padding: 12,
    borderRadius: 16,
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryBentoTileActive: {
    borderColor: COLORS.brandIndigo,
    borderWidth: 1.5,
    backgroundColor: COLORS.cardDarkHover,
  },
  categoryTileIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTileTextGroup: {
    flex: 1,
  },
  categoryTileTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  categoryTileSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },

  // 6. Feed & End Cap
  horizontalFeedList: {
    paddingRight: 16,
  },
  endCapCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
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
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  endCapMainText: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: 4,
  },
  endCapSubText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 14,
  },
  endCapPillBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.brandIndigo,
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
    backgroundColor: COLORS.bgSurface,
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  emptyCardTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    marginTop: 8,
  },
  emptyCardSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 3,
  },
});
