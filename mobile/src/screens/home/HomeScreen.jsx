import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { Button } from "../../components/ui/Button";
import { TalentBentoCard } from "../../components/features/TalentBentoCard";
import { ProjectCard } from "../../components/features/ProjectCard";
import { useAuthStore } from "../../store/authStore";
import { projectApi, walletApi } from "../../api";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  Sparkles,
  Plus,
  ShieldCheck,
  Wallet,
  Compass,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Layers,
  Banknote,
  Search,
  Palette,
  Smartphone,
  Code2,
  Video,
  PenTool,
  FileSpreadsheet,
  Lock,
} from "lucide-react-native";

export function HomeScreen({ navigation }) {
  const { user } = useAuthStore();
  const [wallet, setWallet] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [browseProjects, setBrowseProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [refreshing, setRefreshing] = useState(false);

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

  const loadData = async () => {
    try {
      setRefreshing(true);
      if (isMahasiswa) {
        const [walletRes, browseRes] = await Promise.all([
          walletApi
            .getMe()
            .catch(() => ({ data: { saldo_aktif: 0, saldo_escrow: 0 } })),
          projectApi
            .browse({ limit: 6 })
            .catch(() => ({ data: { items: [] } })),
        ]);
        setWallet(walletRes.data);
        const pItems = Array.isArray(browseRes.data)
          ? browseRes.data
          : browseRes.data?.items || [];
        setBrowseProjects(pItems);
      } else {
        const [walletRes, myProjRes] = await Promise.all([
          walletApi
            .getMe()
            .catch(() => ({ data: { saldo_aktif: 0, saldo_escrow: 0 } })),
          projectApi
            .getMyProjects()
            .catch(() => ({ data: [] })),
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

  const categories = [
    { id: "ALL", label: "Semua", Icon: Sparkles },
    { id: "DESIGN", label: "Desain & Logo", Icon: Palette },
    { id: "UIUX", label: "UI/UX App", Icon: Smartphone },
    { id: "PEMROGRAMAN", label: "Web & Coding", Icon: Code2 },
    { id: "VIDEO", label: "Video Reels", Icon: Video },
    { id: "COPYWRITING", label: "Copywriting", Icon: PenTool },
    { id: "ADMIN_DATA", label: "Admin & Data", Icon: FileSpreadsheet },
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

  const filteredBrowseProjects = browseProjects.filter((p) => {
    if (selectedCategory === "ALL") return true;
    return p.kategori === selectedCategory;
  });

  return (
    <ScrollView
      style={styles.container}
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
      {/* 1. Header Bar: Logo + Verified Pill + User Avatar */}
      <View style={styles.topHeader}>
        <View style={styles.headerTitleRow}>
          <Image
            source={require("../../../assets/logo.webp")}
            style={styles.headerLogo}
            resizeMode="contain"
          />

          <View style={styles.headerRight}>
            <View
              style={[
                styles.verifiedTag,
                isMahasiswa ? styles.verifiedTagMhs : styles.verifiedTagUmkm,
              ]}
            >
              {isMahasiswa ? (
                <GraduationCap size={12} color={COLORS.brandIndigo} />
              ) : (
                <ShieldCheck size={12} color={COLORS.brandCyan} />
              )}
              <Text
                style={[
                  styles.verifiedText,
                  isMahasiswa
                    ? styles.verifiedTextMhs
                    : styles.verifiedTextUmkm,
                ]}
              >
                {isMahasiswa ? "Mahasiswa UBSI" : "UMKM Terverifikasi"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              style={styles.avatarBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.avatarText}>
                {isMahasiswa
                  ? user?.nama_lengkap?.charAt(0) || "D"
                  : user?.nama_usaha?.charAt(0) || "U"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.greeting}>
          Halo,{" "}
          {isMahasiswa
            ? user?.nama_lengkap?.split(" ")[0] || "Darell"
            : user?.nama_usaha || "Pemilik UMKM"}
        </Text>
        <Text style={styles.headerSubtitle}>
          {isMahasiswa
            ? "Raih penghasilan & pengalaman nyata dari proyek digital UMKM."
            : "Temukan talenta mahasiswa terbaik dengan jaminan rekening bersama (Escrow)."}
        </Text>
      </View>

      {/* 2. Hero Fintech Wallet & Stats Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroCardHeader}>
          <View style={styles.walletBadge}>
            <Wallet size={15} color="#FFFFFF" />
            <Text style={styles.walletBadgeText}>
              {isMahasiswa ? "Dompet Honor Mahasiswa" : "Saldo Escrow Aktif"}
            </Text>
          </View>

          <View style={styles.escrowProtectedPill}>
            <ShieldCheck size={12} color="#A7F3D0" />
            <Text style={styles.escrowProtectedText}>100% Escrow</Text>
          </View>
        </View>

        <Text style={styles.heroBalanceLabel}>Saldo Siap Dicairkan</Text>
        <Text style={styles.heroBalanceAmount}>
          {formatCurrency(wallet?.saldo_aktif || 0)}
        </Text>

        {wallet?.saldo_escrow > 0 && (
          <View style={styles.escrowHoldingRow}>
            <Lock size={12} color="#CBD5E1" />
            <Text style={styles.escrowHoldingText}>
              {formatCurrency(wallet?.saldo_escrow)} terkunci di escrow
            </Text>
          </View>
        )}

        {/* Quick Action Buttons */}
        <View style={styles.heroActionsRow}>
          {isMahasiswa ? (
            <>
              <TouchableOpacity
                onPress={() => navigation.navigate("ProjectsTab")}
                style={[styles.heroBtn, styles.heroBtnPrimary]}
                activeOpacity={0.85}
              >
                <Compass size={16} color={COLORS.brandIndigo} />
                <Text style={styles.heroBtnPrimaryText}>Cari Proyek</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("WalletTab")}
                style={[styles.heroBtn, styles.heroBtnSecondary]}
                activeOpacity={0.85}
              >
                <Banknote size={16} color="#FFFFFF" />
                <Text style={styles.heroBtnSecondaryText}>Tarik Dana</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => navigation.navigate("PostProject")}
                style={[styles.heroBtn, styles.heroBtnPrimary]}
                activeOpacity={0.85}
              >
                <Plus size={16} color={COLORS.brandIndigo} strokeWidth={3} />
                <Text style={styles.heroBtnPrimaryText}>Pasang Proyek</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("WalletTab")}
                style={[styles.heroBtn, styles.heroBtnSecondary]}
                activeOpacity={0.85}
              >
                <Banknote size={16} color="#FFFFFF" />
                <Text style={styles.heroBtnSecondaryText}>Top-Up</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* 3. Category Selector Chips Carousel */}
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((c) => {
            const isSelected = selectedCategory === c.id;
            const IconComp = c.Icon;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setSelectedCategory(c.id)}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipActive,
                ]}
                activeOpacity={0.75}
              >
                <IconComp
                  size={14}
                  color={isSelected ? "#FFFFFF" : COLORS.brandIndigo}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextActive,
                  ]}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 4. Dynamic Feed per Role */}
      {isMahasiswa ? (
        /* Mahasiswa Feed: Rekomendasi Proyek UMKM Siap Dilamar */
        <View style={styles.feedSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                {selectedCategory === "ALL"
                  ? "Rekomendasi Proyek Terbaru"
                  : `Proyek ${categories.find((c) => c.id === selectedCategory)?.label}`}
              </Text>
              <Text style={styles.sectionSubtitle}>
                Pilih proyek UMKM dan ajukan penawaran terbaikmu
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("ProjectsTab")}
              style={styles.seeAllBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllText}>Semua</Text>
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
            filteredBrowseProjects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onPress={() =>
                  navigation.navigate("ProjectDetail", {
                    id: p.id,
                    projectId: p.id,
                  })
                }
              />
            ))
          )}
        </View>
      ) : (
        /* UMKM Feed: Proyek Saya & Talenta Mahasiswa */
        <View style={styles.feedSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Talenta Mahasiswa Unggulan</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 110,
  },
  topHeader: {
    marginBottom: 18,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerLogo: {
    width: 145,
    height: 44,
    marginLeft: -4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  verifiedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  verifiedTagMhs: {
    backgroundColor: COLORS.brandIndigoLight,
    borderColor: "rgba(79, 70, 229, 0.2)",
  },
  verifiedTagUmkm: {
    backgroundColor: COLORS.brandCyanLight,
    borderColor: "rgba(14, 165, 233, 0.2)",
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: "800",
  },
  verifiedTextMhs: {
    color: COLORS.brandIndigo,
  },
  verifiedTextUmkm: {
    color: COLORS.brandCyan,
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.brandIndigo,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: COLORS.brandIndigo,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.6,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 3,
    lineHeight: 18,
  },
  heroCard: {
    backgroundColor: "#1E1B4B", // Deep Royal Indigo background for high-tech fintech look
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    ...SHADOWS.md,
  },
  heroCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  walletBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  walletBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.8)",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  escrowProtectedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  escrowProtectedText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#A7F3D0",
  },
  heroBalanceLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.65)",
    fontWeight: "600",
  },
  heroBalanceAmount: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.8,
    marginTop: 2,
  },
  escrowHoldingRow: {
    marginTop: 6,
  },
  escrowHoldingText: {
    fontSize: 11,
    color: "#CBD5E1",
    fontWeight: "600",
  },
  heroActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  heroBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: 14,
  },
  heroBtnPrimary: {
    backgroundColor: "#FFFFFF",
  },
  heroBtnPrimaryText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.brandIndigo,
  },
  heroBtnSecondary: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  heroBtnSecondaryText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  categoriesSection: {
    marginBottom: 20,
  },
  categoryList: {
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.bgSurface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    ...SHADOWS.sm,
  },
  categoryChipActive: {
    backgroundColor: COLORS.brandIndigo,
    borderColor: COLORS.brandIndigo,
  },
  categoryIcon: {
    fontSize: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  feedSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
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
});
