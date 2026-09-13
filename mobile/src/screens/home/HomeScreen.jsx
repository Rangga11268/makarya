import React, { useState, useEffect, useCallback } from "react";
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
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { TalentBentoCard } from "../../components/features/TalentBentoCard";
import { TalentDeckCard } from "../../components/features/TalentDeckCard";
import { OrganicRibbonBackground } from "../../components/ui/OrganicRibbonBackground";
import { ProjectCard } from "../../components/features/ProjectCard";
import { NotificationModal } from "../../components/features/NotificationModal";
import { PromoBanner } from "../../components/features/PromoBanner";
import { PebbleButton } from "../../components/ui/PebbleButton";
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
import {
  projectApi,
  walletApi,
  proposalApi,
  talentApi,
  authApi,
} from "../../api";
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
  ArrowDownToLine,
  Send,
  CircleHelp,
  Plus,
  Users,
  Eye,
  EyeOff,
  UserCheck,
  LayoutGrid,
  X,
} from "lucide-react-native";
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";

export function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuthStore();
  const { width, isLandscape, isTablet, responsiveContainerStyle } =
    useResponsiveLayout();
  const CARD_WIDTH = isTablet ? 360 : Math.min(width * 0.84, 340);
  const TALENT_DECK_WIDTH = isTablet ? 340 : Math.min(width * 0.82, 320);

  const [wallet, setWallet] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [browseProjects, setBrowseProjects] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [featuredTalents, setFeaturedTalents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [refreshing, setRefreshing] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [dismissProfileBanner, setDismissProfileBanner] = useState(false);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const { getUnreadCount, fetchNotifications } = useNotificationStore();
  const unreadNotifications = getUnreadCount(user?.role);

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

  // Evaluasi kelengkapan profil untuk akun yang mendaftar via Google / cepat
  const profileCompleteness = (() => {
    if (!user) return { percent: 100, isComplete: true, missing: [] };
    const missing = [];
    if (isMahasiswa) {
      if (!user?.nim) missing.push("NIM");
      if (!user?.prodi && !user?.prodi_id) missing.push("Program Studi");
      if (!user?.bio) missing.push("Bio Profil");
      const totalFields = 3;
      const filledFields = totalFields - missing.length;
      const percent = Math.round(35 + (filledFields / totalFields) * 65);
      return {
        percent: missing.length === 0 ? 100 : Math.min(percent, 85),
        isComplete: missing.length === 0,
        missing,
      };
    } else {
      if (!user?.no_kontak) missing.push("No. WhatsApp");
      if (!user?.bidang_industri || user?.bidang_industri === "F&B / Kuliner")
        missing.push("Bidang Industri");
      if (!user?.kota) missing.push("Kota");
      const totalFields = 3;
      const filledFields = totalFields - missing.length;
      const percent = Math.round(35 + (filledFields / totalFields) * 65);
      return {
        percent: missing.length === 0 ? 100 : Math.min(percent, 85),
        isComplete: missing.length === 0,
        missing,
      };
    }
  })();

  const loadData = async () => {
    try {
      setRefreshing(true);
      fetchNotifications().catch(() => {});
      authApi
        .getMe()
        .then((meRes) => {
          if (meRes?.data) {
            updateUser(meRes.data);
          }
        })
        .catch(() => {});
      if (isMahasiswa) {
        const [walletRes, browseRes, propRes] = await Promise.all([
          walletApi
            .getMe()
            .catch(() => ({ data: { saldo_aktif: 0, saldo_escrow: 0 } })),
          projectApi
            .browse({ limit: 6, status: "OPEN" })
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
        const [walletRes, myProjRes, talentsRes] = await Promise.all([
          walletApi
            .getMe()
            .catch(() => ({ data: { saldo_aktif: 0, saldo_escrow: 0 } })),
          projectApi.getMyProjects().catch(() => ({ data: [] })),
          talentApi.getTalents({ limit: 4 }).catch(() => ({ data: [] })),
        ]);
        setWallet(walletRes.data);
        setMyProjects(Array.isArray(myProjRes.data) ? myProjRes.data : []);
        const tItems = Array.isArray(talentsRes.data)
          ? talentsRes.data
          : talentsRes.data?.items || [];
        setFeaturedTalents(tItems);
      }
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user?.role]),
  );

  // All 6 Categories for the Full Sheet Modal
  const allCategories = [
    {
      id: "DESAIN",
      title: "Desain UI/UX",
      sub: "Figma, Branding, Visual & Logo",
      iconComponent: UiUxVectorIcon,
    },
    {
      id: "WEB",
      title: "Web & Coding",
      sub: "React, Vue, Node.js & REST API",
      iconComponent: WebCodingVectorIcon,
    },
    {
      id: "MOBILE",
      title: "App Mobile",
      sub: "React Native, Flutter, iOS & Android",
      iconComponent: MobileAppVectorIcon,
    },
    {
      id: "VIDEO",
      title: "Video & Reels",
      sub: "Motion Graphic, Reels & Editing",
      iconComponent: VideoMotionVectorIcon,
    },
    {
      id: "MARKETING",
      title: "Pemasaran & Ads",
      sub: "SEO, Meta Ads & Social Media",
      iconComponent: MarketingVectorIcon,
    },
    {
      id: "WRITING",
      title: "Riset & Penulisan",
      sub: "Copywriting, Content & Artikel",
      iconComponent: WritingVectorIcon,
    },
  ];

  // 4 Featured Service Categories (Executive Services Row)
  const serviceCategories = [
    {
      id: "DESAIN",
      title: "Desain",
      iconComponent: UiUxVectorIcon,
      onPress: () => {
        setSelectedCategory("DESAIN");
        navigation.navigate("ProjectsTab", { category: "DESAIN" });
      },
    },
    {
      id: "WEB",
      title: "Website",
      iconComponent: WebCodingVectorIcon,
      onPress: () => {
        setSelectedCategory("WEB");
        navigation.navigate("ProjectsTab", { category: "WEB" });
      },
    },
    {
      id: "MOBILE",
      title: "App Mobile",
      iconComponent: MobileAppVectorIcon,
      onPress: () => {
        setSelectedCategory("MOBILE");
        navigation.navigate("ProjectsTab", { category: "MOBILE" });
      },
    },
    {
      id: "MORE",
      title: "Lainnya",
      iconComponent: ({ size, color }) => (
        <LayoutGrid size={size || 19} color={color || COLORS.brandIndigo} />
      ),
      onPress: () => {
        setIsCategoryModalOpen(true);
      },
    },
  ];

  // 4 Primary Quick Action Pills (Fintech & Workflow Shortcuts)
  const actionItems = isMahasiswa
    ? [
        {
          id: "tarik",
          label: "Tarik Saldo",
          icon: ArrowDownToLine,
          onPress: () => navigation.navigate("WalletTab"),
        },
        {
          id: "eksplor",
          label: "Eksplor",
          icon: Compass,
          onPress: () => navigation.navigate("ProjectsTab"),
        },
        {
          id: "proposal",
          label: "Proposal",
          icon: Send,
          onPress: () => navigation.navigate("TrackerTab"),
        },
        {
          id: "bantuan",
          label: "Bantuan",
          icon: CircleHelp,
          onPress: () => navigation.navigate("Help"),
        },
      ]
    : [
        {
          id: "pasang",
          label: "Pasang Proyek",
          icon: Plus,
          onPress: () => {
            try {
              navigation.navigate("PostProject");
            } catch (_) {
              navigation.navigate("ProjectsTab");
            }
          },
        },
        {
          id: "topup",
          label: "Top Up Escrow",
          icon: ShieldCheck,
          onPress: () => navigation.navigate("WalletTab"),
        },
        {
          id: "talenta",
          label: "Cari Talenta",
          icon: Users,
          onPress: () => navigation.navigate("ProjectsTab"),
        },
        {
          id: "bantuan",
          label: "Bantuan",
          icon: CircleHelp,
          onPress: () => navigation.navigate("Help"),
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
    ? user?.nama_lengkap ||
      user?.nama ||
      user?.email?.split("@")[0] ||
      "Darell Rangga"
    : user?.nama_usaha ||
      user?.nama ||
      user?.email?.split("@")[0] ||
      "Brand UMKM Anda";

  const initialLetter = displayName.charAt(0).toUpperCase() || "D";

  const currentDateFormatted = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <OrganicRibbonBackground height={600} />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top + 6, 22) },
        ]}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={true}
        overScrollMode="always"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadData}
            tintColor={COLORS.brandIndigo}
            colors={[COLORS.brandIndigo]}
          />
        }
      >
        <View style={[styles.content, responsiveContainerStyle]}>
          {/* 1. Apple Frosted Executive Unified Hero Card (Identity + Finance Island) */}
          <View style={styles.appleGlassHeroCard}>
            {/* Top Identity & Notification Row */}
            <View style={styles.heroCardHeaderRow}>
              <TouchableOpacity
                style={styles.profileUserGroup}
                onPress={() => navigation.navigate("ProfileTab")}
                activeOpacity={0.85}
              >
                <View style={styles.avatarWrapper}>
                  {user?.url_foto ? (
                    <Image
                      source={{ uri: user.url_foto }}
                      style={styles.userAvatarImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.userAvatarCircle,
                        isMahasiswa ? styles.avatarMhs : styles.avatarUmkm,
                      ]}
                    >
                      <Text style={styles.avatarInitial}>{initialLetter}</Text>
                    </View>
                  )}
                  <View style={styles.verifiedTickBadge}>
                    <CheckCircle2
                      size={11}
                      color="#FFFFFF"
                      fill={COLORS.success}
                    />
                  </View>
                </View>

                <View style={styles.profileTextInfo}>
                  <Text style={styles.profileGreetingText} numberOfLines={1}>
                    Halo, {displayName}
                  </Text>
                  <View style={styles.roleChipPill}>
                    <Text style={styles.roleChipPillText}>
                      {isMahasiswa ? "Talenta Digital" : "Mitra UMKM"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.bellButton}
                onPress={() => setIsNotificationOpen(true)}
                activeOpacity={0.8}
              >
                <Bell size={18} color="#0F172A" />
                {unreadNotifications > 0 && <View style={styles.bellRedDot} />}
              </TouchableOpacity>
            </View>

            {/* Subtle Internal Divider */}
            <View style={styles.heroCardDivider} />

            {/* Middle Balance & Protection Row */}
            <TouchableOpacity
              onPress={() => navigation.navigate("WalletTab")}
              activeOpacity={0.9}
            >
              <View style={styles.walletTopRow}>
                <TouchableOpacity
                  style={styles.walletBalanceLabelGroup}
                  onPress={() => setIsBalanceHidden((prev) => !prev)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Text style={styles.walletBalanceTitle}>
                    {isMahasiswa ? "Saldo Dompet Aktif" : "Saldo Escrow Bisnis"}
                  </Text>
                  {isBalanceHidden ? (
                    <EyeOff size={13} color="#64748B" />
                  ) : (
                    <Eye size={13} color="#64748B" />
                  )}
                </TouchableOpacity>

                <View style={styles.walletEscrowChip}>
                  <ShieldCheck size={11} color="#0284C7" />
                  <Text style={styles.walletEscrowChipText}>
                    Escrow Protected
                  </Text>
                </View>
              </View>

              {/* Amount Display */}
              <View style={styles.walletAmountRow}>
                <Text style={styles.walletCurrencyPrefix}>Rp</Text>
                <Text style={styles.walletAmountNumber}>
                  {isBalanceHidden
                    ? "••••••••"
                    : new Intl.NumberFormat("id-ID").format(
                        wallet?.saldo_aktif || 0,
                      )}
                </Text>
              </View>

              <Text style={styles.walletAvailableSub} numberOfLines={1}>
                {wallet?.saldo_escrow > 0
                  ? `${formatCurrency(wallet?.saldo_escrow)} tersimpan di Escrow aman`
                  : "Tersedia untuk dicairkan • Dilindungi Rekening Bersama"}
              </Text>
            </TouchableOpacity>

            {/* Apple Glass Divider */}
            <View style={styles.glassDivider} />

            {/* 4 Quick Action PebbleButtons */}
            <View style={styles.quickActionPillsRow}>
              {actionItems.map((action, idx) => {
                const IconComp = action.icon;
                const isFirst = idx === 0;
                return (
                  <View key={action.id} style={styles.quickActionPillCol}>
                    <PebbleButton
                      size="circle-sm"
                      variant={isFirst ? "sapphire" : "ice"}
                      icon={IconComp}
                      onPress={action.onPress}
                      style={{ marginBottom: 4 }}
                    />
                    <Text style={styles.quickActionLabel} numberOfLines={1}>
                      {action.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* 2. Apple Glossy Quick Search Bar */}
          <TouchableOpacity
            style={styles.appleGlassSearchPill}
            onPress={() => navigation.navigate("ProjectsTab")}
            activeOpacity={0.88}
          >
            <Search size={15} color="#64748B" />
            <Text style={styles.heroSearchPlaceholder}>
              Cari proyek, keahlian, atau UMKM...
            </Text>
            <View style={styles.searchFilterIconWrap}>
              <SlidersHorizontal size={12} color={COLORS.brandIndigo} />
            </View>
          </TouchableOpacity>

          {/* 2b. Apple Frosted Profile Completion Banner */}
          {!profileCompleteness.isComplete && !dismissProfileBanner && (
            <View style={styles.profileCompletionCard}>
              <View style={styles.completionCardHeader}>
                <View style={styles.completionBadgeRow}>
                  <View style={styles.userIconCircle}>
                    <UserCheck size={16} color="#2563EB" strokeWidth={2.2} />
                  </View>
                  <View style={styles.completionTitleCol}>
                    <View style={styles.completionTitleRow}>
                      <Text style={styles.completionTitle}>
                        Lengkapi Profil Anda
                      </Text>
                      <View style={styles.completionPercentPill}>
                        <Text style={styles.completionPercentText}>
                          {profileCompleteness.percent}% Selesai
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={styles.completionMissingFieldsText}
                      numberOfLines={1}
                    >
                      Belum diisi: {profileCompleteness.missing.join(" • ")}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setDismissProfileBanner(true)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.completionCloseBtn}
                >
                  <X size={14} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <Text style={styles.completionDesc}>
                {isMahasiswa
                  ? "Tambahkan NIM & Program Studi agar profil Anda terverifikasi dan meyakinkan klien UMKM."
                  : "Lengkapi No. WhatsApp bisnis & bidang industri agar talenta mahasiswa dapat berkoordinasi langsung."}
              </Text>

              {/* iOS Thin Progress Bar Track */}
              <View style={styles.completionProgressBarTrack}>
                <View
                  style={[
                    styles.completionProgressBarFill,
                    { width: `${profileCompleteness.percent}%` },
                  ]}
                />
              </View>

              <View style={styles.completionFooterRow}>
                <Text style={styles.completionHintText}>
                  Tinggal {profileCompleteness.missing.length} langkah lagi
                </Text>
                <PebbleButton
                  variant="sapphire"
                  size="xs"
                  label="Lengkapi"
                  icon={ArrowRight}
                  onPress={() => navigation.navigate("ProfileTab")}
                />
              </View>
            </View>
          )}

          {/* 4. Apple Glass Services / Category Card (4-Column Circular Layout) */}
          <View style={styles.appleGlassServicesCard}>
            <View style={styles.servicesHeaderRow}>
              <Text style={styles.servicesTitle}>Kategori Layanan</Text>
              <TouchableOpacity
                onPress={() => setIsCategoryModalOpen(true)}
                style={styles.servicesSeeAllBtn}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.servicesSeeAllText}>Lihat Semua</Text>
                <ArrowRight size={11} color={COLORS.brandIndigo} />
              </TouchableOpacity>
            </View>

            <View style={styles.servicesGridRow}>
              {serviceCategories.map((cat) => {
                const IconComp = cat.iconComponent;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.serviceItemCol}
                    onPress={cat.onPress}
                    activeOpacity={0.8}
                  >
                    <View style={styles.serviceIconCircle}>
                      <IconComp size={20} color={COLORS.brandIndigo} />
                    </View>
                    <Text style={styles.serviceItemLabel}>{cat.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 5. Ongoing Projects (Compact Apple Glass Card, if any) */}
          {ongoingProjectsList.length > 0 && (
            <View style={[styles.sectionContainer, { marginBottom: 14 }]}>
              <View style={styles.sectionHeaderRowCompact}>
                <Text style={styles.sectionMainTitleCompact}>
                  {isMahasiswa ? "Proyek Berjalan" : "Pesanan Berjalan"}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("TrackerTab")}
                  style={styles.seeAllPillCompact}
                  activeOpacity={0.7}
                >
                  <Text style={styles.seeAllPillText}>Workspace</Text>
                  <ArrowRight size={10} color={COLORS.brandIndigo} />
                </TouchableOpacity>
              </View>

              {ongoingProjectsList.slice(0, 1).map((item) => {
                const pId = isMahasiswa ? item.project_id || item.id : item.id;
                const pTitle = isMahasiswa
                  ? item.project_judul || "Pengembangan Solusi UMKM"
                  : item.judul || "Proyek Digital UMKM";
                const pCategory = isMahasiswa
                  ? item.project_kategori || item.kategori || "UMKM"
                  : item.kategori || "UMKM";
                const rawPartner = isMahasiswa
                  ? item.project_umkm_nama ||
                    item.umkm_nama ||
                    item.client_name ||
                    item.nama_usaha
                  : item.mahasiswa_nama || item.student_name;
                const pPartner =
                  rawPartner && rawPartner.toLowerCase() !== "string"
                    ? rawPartner
                    : isMahasiswa
                      ? "Mitra UMKM"
                      : "Talenta Mahasiswa";
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
                    : "#64748B";
                const statusBg = isAccepted
                  ? "#ECFDF5"
                  : isReview
                    ? "#FFFBEB"
                    : "#F1F5F9";
                const statusTextColor = isAccepted
                  ? "#065F46"
                  : isReview
                    ? "#92400E"
                    : "#334155";

                return (
                  <View
                    key={item.id || pId}
                    style={styles.appleGlassOngoingCard}
                  >
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
                        {renderProjectCategoryVectorIcon(pCategory, pTitle, 22)}
                      </View>

                      <View style={styles.ongoingMetaColumn}>
                        <Text style={styles.ongoingMainTitle} numberOfLines={1}>
                          {pTitle}
                        </Text>
                        <Text
                          style={styles.ongoingPartnerMetaText}
                          numberOfLines={1}
                        >
                          {pPartner} • {formatCurrency(pBudget)}
                        </Text>
                      </View>

                      <PebbleButton
                        size="circle-sm"
                        variant="ice"
                        icon={ArrowRight}
                        onPress={() =>
                          navigation.navigate("ProjectDetail", {
                            id: pId,
                            projectId: pId,
                          })
                        }
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          {/* 6. Curated Projects Feed */}
          {isMahasiswa ? (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionHeaderTitleCol}>
                  <Text style={styles.sectionMainTitle}>
                    Peluang Proyek Terbaru
                  </Text>
                  <Text style={styles.sectionSubTitle} numberOfLines={1}>
                    Peluang kerja baru dari UMKM terverifikasi
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ProjectsTab")}
                  style={styles.seeAllPill}
                  activeOpacity={0.7}
                >
                  <Text style={styles.seeAllPillText}>Eksplor</Text>
                  <ArrowRight size={11} color={COLORS.brandIndigo} />
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
                  nestedScrollEnabled={true}
                  contentContainerStyle={styles.horizontalFeedList}
                  snapToInterval={CARD_WIDTH + 14}
                  decelerationRate="fast"
                >
                  {browseProjects.slice(0, 6).map((p) => (
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
            /* UMKM View: Featured Student Talents in FlyHire Discovery Deck (Client Only) */
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionHeaderTitleCol}>
                  <Text style={styles.sectionMainTitle}>
                    Talenta Mahasiswa Unggulan
                  </Text>
                  <Text style={styles.sectionSubTitle} numberOfLines={1}>
                    Mahasiswa terverifikasi siap membantu akselerasi bisnis
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ProjectsTab")}
                  style={styles.seeAllPill}
                  activeOpacity={0.7}
                >
                  <Text style={styles.seeAllPillText}>Eksplor</Text>
                  <ArrowRight size={11} color={COLORS.brandIndigo} />
                </TouchableOpacity>
              </View>

              {featuredTalents.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  contentContainerStyle={styles.talentHorizontalFeed}
                  snapToInterval={TALENT_DECK_WIDTH + 18}
                  decelerationRate="fast"
                >
                  {featuredTalents.map((t, idx) => (
                    <View
                      key={t.id || idx}
                      style={{ width: TALENT_DECK_WIDTH, marginRight: 18 }}
                    >
                      <TalentDeckCard
                        talent={t}
                        onPress={() => navigation.navigate("ProjectsTab")}
                      />
                    </View>
                  ))}

                  {/* Explore More Talents Cap */}
                  <TouchableOpacity
                    style={[
                      styles.endCapCard,
                      { width: TALENT_DECK_WIDTH * 0.72, marginRight: 12 },
                    ]}
                    onPress={() => navigation.navigate("ProjectsTab")}
                    activeOpacity={0.85}
                  >
                    <View style={styles.endCapIconBox}>
                      <Users size={22} color={COLORS.brandIndigo} />
                    </View>
                    <Text style={styles.endCapMainText}>Direktori Talenta</Text>
                    <Text style={styles.endCapSubText}>
                      Filter talenta berdasarkan universitas & keahlian
                    </Text>
                    <View style={styles.endCapPillBtn}>
                      <Text style={styles.endCapPillText}>Lihat Semua</Text>
                      <ArrowRight size={12} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              ) : (
                <View style={styles.emptyCardBox}>
                  <Users size={32} color={COLORS.textDim} />
                  <Text style={styles.emptyCardTitle}>Belum Ada Talenta</Text>
                  <Text style={styles.emptyCardSubtitle}>
                    Buka direktori untuk melihat profil mahasiswa terverifikasi.
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Notification Modal */}
      <NotificationModal
        visible={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Apple Glass All Categories Bottom Sheet Modal */}
      <Modal
        visible={isCategoryModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCategoryModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={styles.modalBackdropDismiss}
            activeOpacity={1}
            onPress={() => setIsCategoryModalOpen(false)}
          />

          <View style={styles.categoryBottomSheetCard}>
            {/* iOS Handle Pill */}
            <View style={styles.sheetHandleBar} />

            {/* Header */}
            <View style={styles.categoryModalHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.categoryModalTitle}>Semua Kategori</Text>
                <Text style={styles.categoryModalSubtitle}>
                  Pilih spesialisasi keahlian untuk menemukan proyek & talenta
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsCategoryModalOpen(false)}
                style={styles.categoryModalCloseBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              {/* 6 Category Items in a 2-Column Grid */}
              <View style={styles.allCategoriesGrid}>
                {allCategories.map((cat) => {
                  const IconComp = cat.iconComponent;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={styles.categoryGridCard}
                      activeOpacity={0.75}
                      onPress={() => {
                        setIsCategoryModalOpen(false);
                        setSelectedCategory(cat.id);
                        navigation.navigate("ProjectsTab", {
                          category: cat.id,
                        });
                      }}
                    >
                      <View style={styles.categoryGridIconCircle}>
                        <IconComp size={22} color={COLORS.brandIndigo} />
                      </View>
                      <View style={styles.categoryGridTextWrap}>
                        <Text style={styles.categoryGridTitle}>
                          {cat.title}
                        </Text>
                        <Text style={styles.categoryGridSub}>{cat.sub}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* View All Without Filter Option */}
              <TouchableOpacity
                style={styles.viewAllWithoutFilterBtn}
                activeOpacity={0.8}
                onPress={() => {
                  setIsCategoryModalOpen(false);
                  setSelectedCategory("ALL");
                  navigation.navigate("ProjectsTab");
                }}
              >
                <Text style={styles.viewAllWithoutFilterText}>
                  Eksplor Semua Kategori di Proyek
                </Text>
                <ArrowRight size={14} color={COLORS.brandIndigo} />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },

  // Apple Frosted Executive Unified Hero Card (Identity + Finance Island)
  appleGlassHeroCard: {
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.94)",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.95)"
        : "rgba(255, 255, 255, 0.95)",
    marginBottom: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: Platform.OS === "android" ? 0 : 3,
  },
  heroCardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  heroCardDivider: {
    height: 1,
    backgroundColor: "rgba(226, 232, 240, 0.65)",
    marginBottom: 12,
  },
  roleChipPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(79, 70, 229, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  roleChipPillText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10.5,
    color: COLORS.brandIndigo,
    letterSpacing: 0.1,
  },

  // Apple Glossy Quick Search Bar
  appleGlassSearchPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.88)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.9)"
        : "rgba(255, 255, 255, 0.95)",
    marginBottom: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: Platform.OS === "android" ? 0 : 2,
    gap: 10,
  },
  glassDivider: {
    height: 1,
    backgroundColor: "rgba(226, 232, 240, 0.75)",
    marginVertical: 12,
  },

  // Apple Glass Compact Section Headers
  sectionHeaderRowCompact: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionMainTitleCompact: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  seeAllPillCompact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: "rgba(79, 70, 229, 0.06)",
  },

  // Apple Glass Services Card (4-Column Circular Layout)
  appleGlassServicesCard: {
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.94)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    borderWidth: 1,
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.95)"
        : "rgba(255, 255, 255, 0.95)",
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: Platform.OS === "android" ? 0 : 2,
  },
  servicesHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  servicesTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
    includeFontPadding: false,
  },
  servicesSeeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  servicesSeeAllText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11.5,
    fontWeight: "600",
    color: COLORS.brandIndigo,
    includeFontPadding: false,
  },
  servicesGridRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  serviceItemCol: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  serviceIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: Platform.OS === "android" ? 0 : 1,
  },
  serviceItemLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11.5,
    fontWeight: "600",
    color: "#0F172A",
    textAlign: "center",
    includeFontPadding: false,
  },

  // Apple Glass Ongoing Card
  appleGlassOngoingCard: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.92)",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.9)"
        : "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    elevation: Platform.OS === "android" ? 0 : 2,
    gap: 8,
  },
  profileGreetingText: {
    fontFamily: FONTS.displayBold,
    fontSize: 15.5,
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  profileRoleText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
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
    borderWidth: 2,
    borderColor: "rgba(79, 70, 229, 0.15)",
  },
  userAvatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "rgba(79, 70, 229, 0.15)",
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
  },
  verifiedTickBadge: {
    position: "absolute",
    bottom: -1,
    right: -1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  profileTextInfo: {
    flex: 1,
  },

  // Scroll Content
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 88,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
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
    elevation: Platform.OS === "android" ? 0 : 2,
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
    backgroundColor: "#F1F5F9",
    backgroundColor: "rgba(15, 23, 42, 0.04)",
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
  dashboardMottoText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  dashboardDateText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: COLORS.textMuted,
  },

  // 3. Executive Financial Overview & Balanced Quick Metrics
  executiveSection: {
    marginBottom: 24,
    gap: 12,
  },
  cardAuraWrapper: {
    position: "relative",
    marginBottom: 4,
  },
  cardAtmosphericGlow: {
    position: "absolute",
    top: -12,
    left: 14,
    right: 14,
    bottom: -8,
    borderRadius: 28,
    backgroundColor: "rgba(15, 23, 42, 0.04)",
  },
  floatingWalletCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
    elevation: Platform.OS === "android" ? 0 : 3,
  },
  walletTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  walletBalanceLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  walletBalanceTitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  walletEscrowChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  walletEscrowChipText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: "#334155",
  },
  walletAmountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
    marginBottom: 6,
  },
  walletCurrencyPrefix: {
    fontFamily: FONTS.displayMedium,
    fontSize: 17,
    color: COLORS.textMuted,
  },
  walletAmountNumber: {
    fontFamily: FONTS.displayBold,
    fontSize: 30,
    color: COLORS.textDark,
    letterSpacing: -0.8,
    fontVariant: ["tabular-nums"],
  },
  walletAvailableSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 14,
  },
  walletCardBottomMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 232, 240, 0.8)",
  },
  walletMaskedId: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10.5,
    color: COLORS.textDim,
    letterSpacing: 0.3,
  },
  walletBrandMark: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  walletBrandMarkText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 9.5,
    color: COLORS.brandIndigo,
    letterSpacing: 0.6,
  },

  // 4 Circular Quick-Action Pills Row (Direct Fintech Reference)
  quickActionPillsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  quickActionPillCol: {
    alignItems: "center",
    flex: 1,
  },
  quickActionCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    elevation: Platform.OS === "android" ? 0 : 2,
    marginBottom: 6,
  },
  quickActionLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#334155",
    textAlign: "center",
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
    elevation: Platform.OS === "android" ? 0 : 2,
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
    fontFamily: FONTS.bodyRegular,
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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionHeaderTitleCol: {
    flex: 1,
    marginRight: 10,
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
  seeAllPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 11,
    paddingVertical: 5.5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexShrink: 0,
  },
  seeAllPillText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11.5,
    color: COLORS.brandIndigo,
  },
  seeMoreLink: {
    fontFamily: FONTS.bodyMedium,
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
    elevation: Platform.OS === "android" ? 0 : 3,
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
    fontFamily: FONTS.bodyMedium,
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
    fontFamily: FONTS.bodyRegular,
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
    fontFamily: FONTS.bodyMedium,
    fontSize: 9.5,
    color: COLORS.brandIndigo,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  ongoingMainTitle: {
    fontFamily: FONTS.headingBold,
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
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "#64748B",
  },
  milestoneBudgetText: {
    fontFamily: FONTS.bodyBold,
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
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 9,
    borderRadius: 12,
  },
  ongoingChatBtnText: {
    fontFamily: FONTS.bodyMedium,
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
    fontFamily: FONTS.bodyMedium,
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
    elevation: Platform.OS === "android" ? 0 : 2,
  },
  emptyOngoingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyOngoingInfo: {
    flex: 1,
  },
  emptyOngoingTitle: {
    fontFamily: FONTS.headingBold,
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
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
  },
  emptyOngoingCtaText: {
    fontFamily: FONTS.bodyMedium,
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
    elevation: Platform.OS === "android" ? 0 : 1.5,
    minHeight: 66,
  },
  categoryBentoTileActive: {
    borderColor: COLORS.brandIndigo,
    borderWidth: 1.5,
    backgroundColor: "#F8FAFC",
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
    fontFamily: FONTS.bodyMedium,
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
  talentHorizontalFeed: {
    paddingRight: 24,
    paddingVertical: 4,
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
    minHeight: 230,
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
    fontFamily: FONTS.headingBold,
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
    fontFamily: FONTS.bodyMedium,
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
  // Apple Frosted Profile Completion Banner Styles
  profileCompletionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.85)",
    ...Platform.select({
      ios: {
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  completionCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  completionBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    flex: 1,
  },
  userIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(37, 99, 235, 0.12)",
  },
  completionTitleCol: {
    flex: 1,
    gap: 1.5,
  },
  completionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  completionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 12.5,
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  completionPercentPill: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 9999,
  },
  completionPercentText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: "#2563EB",
  },
  completionMissingFieldsText: {
    fontFamily: FONTS.medium,
    fontSize: 10.5,
    color: "#64748B",
  },
  completionCloseBtn: {
    padding: 3,
    marginTop: -2,
    marginRight: -2,
  },
  completionDesc: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#64748B",
    lineHeight: 15,
    marginBottom: 8,
  },
  completionProgressBarTrack: {
    height: 3.5,
    backgroundColor: "#F1F5F9",
    borderRadius: 9999,
    overflow: "hidden",
    marginBottom: 10,
  },
  completionProgressBarFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 9999,
  },
  completionFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  completionHintText: {
    fontFamily: FONTS.medium,
    fontSize: 10.5,
    color: "#94A3B8",
  },
  completionPebbleBtn: {
    minHeight: 34,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },

  // All Categories Apple Glass Bottom Sheet Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  modalBackdropDismiss: {
    flex: 1,
  },
  categoryBottomSheetCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    maxHeight: "88%",
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  sheetHandleBar: {
    width: 38,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 16,
  },
  categoryModalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoryModalTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
    includeFontPadding: false,
  },
  categoryModalSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 16,
    includeFontPadding: false,
  },
  categoryModalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  allCategoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginBottom: 16,
  },
  categoryGridCard: {
    width: "48.5%",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryGridIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryGridTextWrap: {
    width: "100%",
  },
  categoryGridTitle: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
    marginBottom: 2,
    includeFontPadding: false,
  },
  categoryGridSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10.5,
    color: "#64748B",
    lineHeight: 14,
    includeFontPadding: false,
  },
  viewAllWithoutFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(79, 70, 229, 0.08)",
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.15)",
  },
  viewAllWithoutFilterText: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 12.5,
    color: COLORS.brandIndigo,
  },
});
