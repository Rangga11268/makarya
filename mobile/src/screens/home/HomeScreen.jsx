import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { TalentBentoCard } from "../../components/features/TalentBentoCard";
import { ProjectCard } from "../../components/features/ProjectCard";
import { NotificationModal } from "../../components/features/NotificationModal";
import { PromoBanner } from "../../components/features/PromoBanner";
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
  MessageSquare,
  Building2,
  Search,
  SlidersHorizontal,
} from "lucide-react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(width * 0.84, 340);

export function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
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
  // 6 Bespoke Vector Categories with Luxury Color Palettes
  const categoryTiles = [
    {
      id: "DESAIN",
      title: "Desain UI/UX",
      sub: "Figma & Branding",
      iconComponent: UiUxVectorIcon,
      accentColor: "#4F46E5",
      bgTint: "#EEF2FF",
    },
    {
      id: "WEB",
      title: "Web & Coding",
      sub: "React, Vue & API",
      iconComponent: WebCodingVectorIcon,
      accentColor: "#0284C7",
      bgTint: "#F0F9FF",
    },
    {
      id: "MOBILE",
      title: "App Mobile",
      sub: "Flutter & React Native",
      iconComponent: MobileAppVectorIcon,
      accentColor: "#10B981",
      bgTint: "#ECFDF5",
    },
    {
      id: "VIDEO",
      title: "Video & Reels",
      sub: "Motion & Editing",
      iconComponent: VideoMotionVectorIcon,
      accentColor: "#F59E0B",
      bgTint: "#FFFBEB",
    },
    {
      id: "MARKETING",
      title: "Pemasaran & Ads",
      sub: "SEO & Sosmed",
      iconComponent: MarketingVectorIcon,
      accentColor: "#EC4899",
      bgTint: "#FDF2F8",
    },
    {
      id: "WRITING",
      title: "Riset & Penulisan",
      sub: "Copywriting & Artikel",
      iconComponent: WritingVectorIcon,
      accentColor: "#8B5CF6",
      bgTint: "#FAF5FF",
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

  // Ongoing Projects (prioritize in-progress / accepted, then pending)
  const ongoingProjectsList = isMahasiswa
    ? [...myProposals]
        .filter(
          (p) =>
            (p.status === "ACCEPTED" &&
              p.project_status !== "DONE" &&
              p.project_status !== "COMPLETED") ||
            p.status === "PENDING",
        )
        .sort((a, b) => (a.status === "ACCEPTED" ? -1 : 1))
        .slice(0, 2)
    : [...myProjects]
        .filter(
          (p) =>
            p.status === "IN_PROGRESS" ||
            p.status === "REVIEW" ||
            p.status === "OPEN",
        )
        .sort((a, b) => (a.status === "IN_PROGRESS" ? -1 : 1))
        .slice(0, 2);

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
      <StatusBar barStyle="light-content" backgroundColor="#0B132B" />

      {/* 1. Dedicated Clean Top App Bar (Profile & Notification) */}
      <View
        style={[
          styles.topAppBar,
          {
            paddingTop:
              Platform.OS === "ios"
                ? Math.max(insets.top, 44)
                : (StatusBar.currentHeight || 24) + 6,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.topProfileButton}
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
                size={10}
                color="#FFFFFF"
                fill={COLORS.brandIndigo}
              />
            </View>
          </View>

          <View style={styles.profileTextInfo}>
            <Text style={styles.topProfileGreeting} numberOfLines={1}>
              Halo, {displayName}
            </Text>
            <Text style={styles.topProfileRole} numberOfLines={1}>
              {isMahasiswa
                ? "UI/UX & Web Dev • UBSI"
                : "Klien UMKM Terverifikasi"}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.topBellButton}
          onPress={() => setIsNotificationOpen(true)}
          activeOpacity={0.8}
        >
          <Bell size={19} color="#FFFFFF" />
          {unreadNotifications > 0 && <View style={styles.bellRedDot} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadData}
            tintColor="#FFFFFF"
            colors={[COLORS.brandIndigo]}
          />
        }
      >
        {/* 2. Curved Hero Header Banner (100% Clean Artwork Showcase - Zero Overlapping Elements) */}
        <View style={styles.curvedHeaderBanner}>
          {/* Full Background Artwork with Makarya Logo & Digital Creative Ornaments */}
          <Image
            source={require("../../../assets/header-banner.jpg")}
            style={styles.headerBannerImage}
            resizeMode="cover"
          />

          {/* Organic Curved Bottom Wave */}
          <View style={styles.curveContainer}>
            <Svg
              width="100%"
              height={26}
              viewBox="0 0 375 26"
              preserveAspectRatio="none"
            >
              <Path
                d="M0,0 C125,26 250,26 375,0 L375,26 L0,26 Z"
                fill={COLORS.bgDark}
              />
            </Svg>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.content}>
          {/* Quick Interactive Search Affordance */}
          <TouchableOpacity
            style={styles.heroSearchPill}
            onPress={() => navigation.navigate("ProjectsTab")}
            activeOpacity={0.88}
          >
            <Search size={16} color={COLORS.textMuted} />
            <Text style={styles.heroSearchPlaceholder}>
              Cari proyek, keahlian, atau UMKM...
            </Text>
            <View style={styles.searchFilterIconWrap}>
              <SlidersHorizontal size={13} color={COLORS.brandIndigo} />
            </View>
          </TouchableOpacity>

          {/* 2. Dashboard Title & Date Row */}
          <View style={styles.dashboardTitleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashboardMainTitle}>
                {isMahasiswa ? "Top Freelance Talent" : "Client Dashboard"}
              </Text>
              <Text style={styles.dashboardMottoText}>
                {isMahasiswa
                  ? "Wujudkan Solusi Digital & Raih Peluang Nyata"
                  : "Akselerasi Bisnis dengan Talenta Muda Terbaik"}
              </Text>
            </View>
            <Text style={styles.dashboardDateText}>{currentDateFormatted}</Text>
          </View>

          {/* 3. Executive Financial Overview & Balanced Quick Metrics */}
          <View style={styles.executiveSection}>
            {/* A. Full-Width Executive Wallet Card */}
            <TouchableOpacity
              style={styles.executiveWalletCard}
              onPress={() => navigation.navigate("WalletTab")}
              activeOpacity={0.92}
            >
              {/* Top Row: Escrow Badge & Action Pill */}
              <View style={styles.walletTopRow}>
                <View style={styles.walletBadgeChip}>
                  <ShieldCheck size={14} color="#38BDF8" />
                  <Text style={styles.walletBadgeText}>
                    {isMahasiswa ? "Saldo Dompet Aktif" : "Escrow Balance UMKM"}
                  </Text>
                </View>
                <View style={styles.walletActionBtn}>
                  <Text style={styles.walletActionBtnText}>
                    {isMahasiswa ? "Tarik Saldo" : "Detail Escrow"}
                  </Text>
                  <ArrowRight size={12} color="#FFFFFF" strokeWidth={2.5} />
                </View>
              </View>

              {/* Main Balance Display */}
              <View style={styles.walletAmountRow}>
                <Text style={styles.walletCurrencyPrefix}>Rp</Text>
                <Text style={styles.walletAmountNumber}>
                  {new Intl.NumberFormat("id-ID").format(
                    wallet?.saldo_aktif || 0,
                  )}
                </Text>
              </View>

              {/* Bottom Reassurance Strip */}
              <View style={styles.walletBottomStrip}>
                <View style={styles.walletLiveDot} />
                <Text style={styles.walletBottomText} numberOfLines={1}>
                  {wallet?.saldo_escrow > 0
                    ? `🛡️ ${formatCurrency(wallet?.saldo_escrow)} ditahan di Escrow`
                    : "Dana aman terenkripsi • Tarik kapan saja"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* B. Balanced 3-Column Metrics Bar (Reflow Friendly) */}
            <View style={styles.metricsBalancedRow}>
              {/* Metric 1: Active Projects / Proposals */}
              <TouchableOpacity
                style={styles.metricTile}
                onPress={() => navigation.navigate("TrackerTab")}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.metricTileIconWrap,
                    { backgroundColor: "#EEF2FF" },
                  ]}
                >
                  <Briefcase size={16} color={COLORS.brandIndigo} />
                </View>
                <Text style={styles.metricTileValue}>
                  {ongoingProjectsList.length > 0
                    ? ongoingProjectsList.length
                    : "0"}
                </Text>
                <Text style={styles.metricTileLabel} numberOfLines={1}>
                  {isMahasiswa ? "Proyek Aktif" : "Order Aktif"}
                </Text>
              </TouchableOpacity>

              {/* Metric 2: On-Time Rate */}
              <View style={styles.metricTile}>
                <View
                  style={[
                    styles.metricTileIconWrap,
                    { backgroundColor: "#ECFDF5" },
                  ]}
                >
                  <Clock size={16} color="#10B981" />
                </View>
                <Text style={[styles.metricTileValue, { color: "#065F46" }]}>
                  100%
                </Text>
                <Text style={styles.metricTileLabel} numberOfLines={1}>
                  On-Time
                </Text>
              </View>

              {/* Metric 3: Rating Kepuasan */}
              <View style={styles.metricTile}>
                <View
                  style={[
                    styles.metricTileIconWrap,
                    { backgroundColor: "#FFFBEB" },
                  ]}
                >
                  <Star size={16} color="#F59E0B" fill="#F59E0B" />
                </View>
                <Text style={[styles.metricTileValue, { color: "#92400E" }]}>
                  5.0
                </Text>
                <Text style={styles.metricTileLabel} numberOfLines={1}>
                  Rating
                </Text>
              </View>
            </View>
          </View>

          {/* 4. Modern Ongoing Projects Showcase */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionMainTitle}>Ongoing Projects</Text>
                <Text style={styles.sectionSubTitle}>
                  {isMahasiswa
                    ? "Proyek aktif & proposal dalam seleksi"
                    : "Status pengerjaan proyek bisnis Anda"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("TrackerTab")}
                activeOpacity={0.7}
              >
                <Text style={styles.seeMoreLink}>Workspace →</Text>
              </TouchableOpacity>
            </View>

            {ongoingProjectsList.length > 0 ? (
              ongoingProjectsList.map((item) => {
                const pId = isMahasiswa ? item.project_id || item.id : item.id;
                const pTitle = isMahasiswa
                  ? item.project_judul || "Pengembangan Solusi UMKM"
                  : item.judul || "Proyek Digital UMKM";
                const pCategory = isMahasiswa
                  ? item.project_kategori || item.kategori || "UMKM"
                  : item.kategori || "UMKM";
                const pPartner = isMahasiswa
                  ? item.project_umkm_nama || "Mitra UMKM"
                  : item.mahasiswa_nama || "Talenta Mahasiswa";
                const pBudget = isMahasiswa
                  ? item.harga_tawar || item.budget || 0
                  : item.budget || item.budget_max || 0;
                const pDays = item.estimasi_hari || (isMahasiswa ? 5 : 7);

                const isAccepted =
                  item.status === "ACCEPTED" || item.status === "IN_PROGRESS";
                const isReview = item.status === "REVIEW";

                const statusLabel = isAccepted
                  ? "In Progress"
                  : isReview
                    ? "Under Review"
                    : isMahasiswa
                      ? "Proposal Sent"
                      : "Open Proposals";

                const statusDotColor = isAccepted
                  ? "#10B981"
                  : isReview
                    ? "#F59E0B"
                    : "#6366F1";
                const statusBg = isAccepted
                  ? "#ECFDF5"
                  : isReview
                    ? "#FFFBEB"
                    : "#EEF2FF";
                const statusTextColor = isAccepted
                  ? "#065F46"
                  : isReview
                    ? "#92400E"
                    : "#3730A3";
                const progressPercent = isAccepted
                  ? "70%"
                  : isReview
                    ? "90%"
                    : "25%";
                const milestoneLabel = isAccepted
                  ? "Milestone 1 • Pengerjaan Deliverable"
                  : isReview
                    ? "Milestone Final • Menunggu Persetujuan"
                    : "Tahap Evaluasi & Seleksi Proposal";

                return (
                  <View key={item.id || pId} style={styles.modernOngoingCard}>
                    {/* Top Meta: Status Pill & Delivery Days */}
                    <View style={styles.ongoingTopMeta}>
                      <View
                        style={[
                          styles.ongoingStatusPill,
                          { backgroundColor: statusBg },
                        ]}
                      >
                        <View
                          style={[
                            styles.pulseLiveDot,
                            { backgroundColor: statusDotColor },
                          ]}
                        />
                        <Text
                          style={[
                            styles.ongoingStatusText,
                            { color: statusTextColor },
                          ]}
                        >
                          {statusLabel}
                        </Text>
                      </View>

                      <View style={styles.ongoingDaysBadge}>
                        <Clock size={11} color={COLORS.textMuted} />
                        <Text style={styles.ongoingDaysText}>
                          {pDays} Hari Kerja
                        </Text>
                      </View>
                    </View>

                    {/* Main Info: Category Icon + Title + Partner Name */}
                    <TouchableOpacity
                      style={styles.ongoingMainBody}
                      activeOpacity={0.88}
                      onPress={() =>
                        navigation.navigate("ProjectDetail", {
                          id: pId,
                          projectId: pId,
                        })
                      }
                    >
                      <View style={styles.ongoingCategoryIconSquare}>
                        {renderProjectCategoryVectorIcon(pCategory, pTitle, 26)}
                      </View>

                      <View style={styles.ongoingMetaColumn}>
                        <Text style={styles.ongoingCategoryMicroText}>
                          {pCategory.toUpperCase()}
                        </Text>
                        <Text style={styles.ongoingMainTitle} numberOfLines={2}>
                          {pTitle}
                        </Text>
                        <View style={styles.ongoingPartnerMetaRow}>
                          <Building2 size={12} color={COLORS.textMuted} />
                          <Text
                            style={styles.ongoingPartnerMetaText}
                            numberOfLines={1}
                          >
                            {pPartner}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Milestone & Budget Gauge */}
                    <View style={styles.ongoingMilestoneBox}>
                      <View style={styles.milestoneGaugeLabels}>
                        <Text style={styles.milestonePhaseText}>
                          {milestoneLabel}
                        </Text>
                        <Text style={styles.milestoneBudgetText}>
                          {formatCurrency(pBudget)}
                        </Text>
                      </View>
                      <View style={styles.milestoneTrackOuter}>
                        <View
                          style={[
                            styles.milestoneTrackInner,
                            {
                              width: progressPercent,
                              backgroundColor: isAccepted
                                ? COLORS.brandIndigo
                                : statusDotColor,
                            },
                          ]}
                        />
                      </View>
                    </View>

                    {/* Action Footer: Quick Chat + Open Workspace */}
                    <View style={styles.ongoingActionRow}>
                      <TouchableOpacity
                        style={styles.ongoingChatBtn}
                        onPress={() =>
                          navigation.navigate("Chat", {
                            projectId: pId,
                            projectTitle: pTitle,
                            partnerName: pPartner,
                            partnerRole: isMahasiswa ? "UMKM" : "MHS",
                          })
                        }
                        activeOpacity={0.8}
                      >
                        <MessageSquare size={13} color={COLORS.brandIndigo} />
                        <Text style={styles.ongoingChatBtnText}>
                          Chat {isMahasiswa ? "Klien" : "Talenta"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.ongoingWorkspaceBtn}
                        onPress={() => navigation.navigate("TrackerTab")}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.ongoingWorkspaceBtnText}>
                          Workspace
                        </Text>
                        <ArrowRight
                          size={12}
                          color="#FFFFFF"
                          strokeWidth={2.5}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyOngoingCard}>
                <View style={styles.emptyOngoingIcon}>
                  <Briefcase size={20} color={COLORS.brandIndigo} />
                </View>
                <View style={styles.emptyOngoingInfo}>
                  <Text style={styles.emptyOngoingTitle}>
                    Belum Ada Proyek Aktif
                  </Text>
                  <Text style={styles.emptyOngoingSubtitle}>
                    {isMahasiswa
                      ? "Jelajahi proyek UMKM & kirim proposal pertamamu."
                      : "Buat proyek baru untuk merekrut talenta mahasiswa."}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.emptyOngoingCta}
                  onPress={() => navigation.navigate("ProjectsTab")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.emptyOngoingCtaText}>Eksplor</Text>
                  <ArrowRight
                    size={11}
                    color={COLORS.brandIndigo}
                    strokeWidth={2.5}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

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
                    <View
                      style={[
                        styles.categoryTileIconWrap,
                        cat.bgTint ? { backgroundColor: cat.bgTint } : null,
                      ]}
                    >
                      <IconComp
                        size={28}
                        color={cat.accentColor || COLORS.brandIndigo}
                      />
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
                    Akademisi berprestasi Universitas BSI siap membantu usaha
                    Anda
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
        </View>

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

  // Dedicated Top App Bar (Profile & Notification)
  topAppBar: {
    backgroundColor: "#0B132B",
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingRight: 12,
  },
  topProfileGreeting: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    color: "#FFFFFF",
    letterSpacing: -0.4,
  },
  topProfileRole: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.72)",
    marginTop: 2,
  },
  topBellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  // 2. Curved Hero Header Banner (100% Pure Artwork Showcase)
  curvedHeaderBanner: {
    height: 145,
    width: "100%",
    position: "relative",
    backgroundColor: "#0B132B",
    overflow: "hidden",
  },
  headerBannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  dashboardMottoText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  curveContainer: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    width: "100%",
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
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.85)",
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
    fontSize: 16,
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
  bellRedDot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
    borderWidth: 1.5,
    borderColor: "#0B132B",
  },

  // Scroll Content
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },

  // Quick Interactive Search Affordance
  heroSearchPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.95)",
    marginBottom: 18,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  heroSearchPlaceholder: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: COLORS.textDim,
  },
  searchFilterIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 18,
    color: COLORS.textDark,
    letterSpacing: -0.4,
  },
  dashboardDateText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11.5,
    color: COLORS.textMuted,
  },

  // 3. Executive Financial Overview & Balanced Quick Metrics
  executiveSection: {
    marginBottom: 24,
    gap: 12,
  },
  executiveWalletCard: {
    backgroundColor: "#0B132B",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.28)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 5,
  },
  walletTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  walletBadgeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(56, 189, 248, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.22)",
  },
  walletBadgeText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11.5,
    color: "#38BDF8",
    letterSpacing: 0.2,
  },
  walletActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.brandIndigo,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    minHeight: 32,
  },
  walletActionBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#FFFFFF",
  },
  walletAmountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginBottom: 12,
  },
  walletCurrencyPrefix: {
    fontFamily: FONTS.displayMedium,
    fontSize: 17,
    color: "#94A3B8",
  },
  walletAmountNumber: {
    fontFamily: FONTS.displayBold,
    fontSize: 29,
    color: "#FFFFFF",
    letterSpacing: -0.8,
    fontVariant: ["tabular-nums"],
  },
  walletBottomStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  walletLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  walletBottomText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.72)",
    flex: 1,
  },

  // Balanced 3-Column Metrics Row
  metricsBalancedRow: {
    flexDirection: "row",
    gap: 10,
  },
  metricTile: {
    flex: 1,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
    minHeight: 88,
  },
  metricTileIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  metricTileValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    color: COLORS.textDark,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  metricTileLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10.5,
    color: COLORS.textMuted,
    textAlign: "center",
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
    fontSize: 16.5,
    color: COLORS.textDark,
    letterSpacing: -0.35,
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
  },
  seeAllWithArrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  // 4. Modern Ongoing Projects Showcase Styles
  modernOngoingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.2,
    borderColor: "rgba(226, 232, 240, 0.9)",
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  ongoingTopMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  ongoingStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 20,
  },
  pulseLiveDot: {
    width: 6.5,
    height: 6.5,
    borderRadius: 3.5,
    marginRight: 6,
  },
  ongoingStatusText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    letterSpacing: 0.2,
  },
  ongoingDaysBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  ongoingDaysText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10.5,
    color: COLORS.textMuted,
  },
  ongoingMainBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  ongoingCategoryIconSquare: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  ongoingMetaColumn: {
    flex: 1,
  },
  ongoingCategoryMicroText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9.5,
    color: COLORS.brandIndigo,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  ongoingMainTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 14.5,
    color: COLORS.textDark,
    lineHeight: 19,
    letterSpacing: -0.2,
  },
  ongoingPartnerMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 3,
  },
  ongoingPartnerMetaText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  ongoingMilestoneBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 12,
  },
  milestoneGaugeLabels: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  milestonePhaseText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: "#64748B",
  },
  milestoneBudgetText: {
    fontFamily: FONTS.displayBold,
    fontSize: 12.5,
    color: COLORS.brandIndigo,
    fontVariant: ["tabular-nums"],
  },
  milestoneTrackOuter: {
    height: 5,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  milestoneTrackInner: {
    height: "100%",
    borderRadius: 3,
  },
  ongoingActionRow: {
    flexDirection: "row",
    gap: 10,
  },
  ongoingChatBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    paddingVertical: 9,
    borderRadius: 12,
  },
  ongoingChatBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.brandIndigo,
  },
  ongoingWorkspaceBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#0F172A",
    paddingVertical: 9,
    borderRadius: 12,
  },
  ongoingWorkspaceBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#FFFFFF",
  },
  emptyOngoingCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.2,
    borderColor: "rgba(226, 232, 240, 0.9)",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  emptyOngoingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyOngoingInfo: {
    flex: 1,
  },
  emptyOngoingTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    color: COLORS.textDark,
  },
  emptyOngoingSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10.5,
    color: COLORS.textMuted,
    marginTop: 2,
    lineHeight: 14,
  },
  emptyOngoingCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
  },
  emptyOngoingCtaText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10.5,
    color: COLORS.brandIndigo,
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
    borderRadius: 18,
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1.5,
    minHeight: 66,
  },
  categoryBentoTileActive: {
    borderColor: COLORS.brandIndigo,
    borderWidth: 1.5,
    backgroundColor: "#EEF2FF",
  },
  categoryTileIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTileTextGroup: {
    flex: 1,
  },
  categoryTileTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    color: COLORS.textDark,
    letterSpacing: -0.2,
  },
  categoryTileSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10.5,
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
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: -0.2,
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
