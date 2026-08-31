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
import { COLORS } from "../../theme/colors";
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
  Briefcase,
  Users,
  Compass,
  GraduationCap,
  Activity,
  ArrowRight,
} from "lucide-react-native";

export function HomeScreen({ navigation }) {
  const { user } = useAuthStore();
  const [wallet, setWallet] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [browseProjects, setBrowseProjects] = useState([]);
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
            .browse({ limit: 4 })
            .catch(() => ({ data: { items: [] } })),
        ]);
        setWallet(walletRes.data);
        const pItems = Array.isArray(browseRes.data)
          ? browseRes.data
          : browseRes.data?.items || [];
        setBrowseProjects(pItems);
      } else {
        const [walletRes, projRes] = await Promise.all([
          walletApi
            .getMe()
            .catch(() => ({ data: { saldo_aktif: 0, saldo_escrow: 0 } })),
          projectApi.getMyProjects({ limit: 5 }).catch(() => ({ data: [] })),
        ]);
        setWallet(walletRes.data);
        setMyProjects(Array.isArray(projRes.data) ? projRes.data : []);
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.role]);

  const talents = [
    {
      id: "1",
      name: "Darell Rangga Putra",
      prodi: "Sistem Informasi • UBSI",
      rating: 5.0,
      totalJobs: 8,
      skills: ["FastAPI", "React Native", "PostgreSQL"],
    },
    {
      id: "2",
      name: "Adelia Putri",
      prodi: "DKV • UBSI",
      rating: 4.9,
      totalJobs: 11,
      skills: ["Branding", "Logo Design", "Packaging"],
    },
    {
      id: "3",
      name: "Bima Arya",
      prodi: "Teknologi Informasi • UBSI",
      rating: 5.0,
      totalJobs: 6,
      skills: ["Landing Page", "Next.js", "WordPress"],
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={loadData}
          tintColor={COLORS.brandCyan}
          colors={[COLORS.brandIndigo]}
        />
      }
    >
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.headerTitleRow}>
          <Image
            source={require("../../../assets/logo.webp")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {isMahasiswa ? (
              <View style={styles.verifiedTag}>
                <GraduationCap size={13} color={COLORS.brandIndigo} />
                <Text style={styles.verifiedText}>Mahasiswa</Text>
              </View>
            ) : (
              <View style={styles.verifiedTag}>
                <ShieldCheck size={13} color={COLORS.brandCyan} />
                <Text style={styles.verifiedText}>UMKM Escrow</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              style={styles.headerAvatarBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.headerAvatarText}>
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
            ? user?.nama_lengkap ||
              user?.email?.split("@")[0] ||
              "Mahasiswa UBSI"
            : user?.nama_usaha || "Pemilik UMKM"}
        </Text>
        <Text style={styles.headerSubtitle}>
          {isMahasiswa
            ? "Jelajahi proyek digital UMKM dan cairkan honor hasil karyamu."
            : "Temukan talenta mahasiswa terbaik untuk kebutuhan usaha Anda."}
        </Text>
      </View>

      {/* Saldo & Quick Action Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <View style={styles.walletIcon}>
            <Wallet size={18} color={COLORS.brandCyan} />
          </View>
          <Text style={styles.balanceLabel}>
            {isMahasiswa ? "Saldo Dompet Mahasiswa" : "Saldo Aktif UMKM"}
          </Text>
        </View>

        <Text style={styles.balanceAmount}>
          {formatCurrency(wallet?.saldo_aktif || 0)}
        </Text>

        <View style={styles.escrowRow}>
          <Text style={styles.escrowText}>
            {isMahasiswa
              ? "Terkunci dalam Pengerjaan: "
              : "Terkunci di Escrow: "}
            <Text style={styles.escrowAmount}>
              {formatCurrency(wallet?.saldo_escrow || 0)}
            </Text>
          </Text>
        </View>

        <View style={styles.quickActions}>
          {isMahasiswa ? (
            <>
              <Button
                title="Cari Proyek Digital"
                variant="lime"
                size="md"
                icon={<Compass size={16} color="#FFF" />}
                onPress={() => navigation.navigate("ProjectsTab")}
                style={styles.actionBtn}
              />
              <Button
                title="Tarik Dana"
                variant="dark"
                size="md"
                onPress={() => navigation.navigate("WalletTab")}
                style={styles.topUpBtn}
              />
            </>
          ) : (
            <>
              <Button
                title="Pasang Proyek Baru"
                variant="lime"
                size="md"
                icon={<Plus size={16} color="#FFF" strokeWidth={3} />}
                onPress={() => navigation.navigate("PostProject")}
                style={styles.actionBtn}
              />
              <Button
                title="Top-Up"
                variant="dark"
                size="md"
                onPress={() => navigation.navigate("WalletTab")}
                style={styles.topUpBtn}
              />
            </>
          )}
        </View>
      </View>

      {/* Quick Summary Grid */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryBox}>
          <Briefcase size={18} color={COLORS.brandCyan} />
          <Text style={styles.summaryCount}>
            {isMahasiswa ? browseProjects.length : myProjects.length}
          </Text>
          <Text style={styles.summaryLabel}>
            {isMahasiswa ? "Proyek Tersedia" : "Proyek Berjalan"}
          </Text>
        </View>

        <View style={styles.summaryBox}>
          <Activity size={18} color={COLORS.brandIndigo} />
          <Text style={styles.summaryCount}>
            {isMahasiswa
              ? wallet?.saldo_escrow
                ? 1
                : 0
              : myProjects.reduce((acc, p) => acc + (p.total_pelamar || 0), 0)}
          </Text>
          <Text style={styles.summaryLabel}>
            {isMahasiswa ? "Kontrak Aktif" : "Proposal Masuk"}
          </Text>
        </View>
      </View>

      {/* Main Section per Role */}
      {isMahasiswa ? (
        <View>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Rekomendasi Proyek UMKM</Text>
              <Text style={styles.sectionSubtitle}>
                Pilih proyek yang cocok & ajukan penawaran proposal Anda
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProjectsTab")}
              style={styles.seeAllBtn}
            >
              <Text style={styles.seeAllText}>Lihat Semua</Text>
              <ArrowRight size={13} color={COLORS.brandIndigo} />
            </TouchableOpacity>
          </View>

          <View style={styles.projectList}>
            {browseProjects.slice(0, 4).map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onPress={() =>
                  navigation.navigate("ProjectDetail", { projectId: p.id })
                }
              />
            ))}
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Talenta Mahasiswa Unggulan
              </Text>
              <Text style={styles.sectionSubtitle}>
                Mahasiswa terverifikasi kampus dengan rekam jejak prima
              </Text>
            </View>
          </View>

          <View style={styles.talentList}>
            {talents.map((t, idx) => (
              <TalentBentoCard
                key={t.id}
                talent={t}
                variant={idx === 0 ? "lime" : "dark"}
                onPress={() => navigation.navigate("PostProject")}
              />
            ))}
          </View>
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
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 110,
  },
  topHeader: {
    marginBottom: 20,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  headerLogo: {
    width: 145,
    height: 44,
    marginLeft: -4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.6,
  },
  verifiedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(79, 70, 229, 0.08)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.2)",
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.brandIndigo,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 3,
  },
  balanceCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  walletIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(14, 165, 233, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  escrowRow: {
    marginTop: 6,
    marginBottom: 16,
  },
  escrowText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  escrowAmount: {
    color: COLORS.brandCyan,
    fontWeight: "800",
  },
  quickActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 2,
  },
  topUpBtn: {
    flex: 1,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    elevation: 1,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  summaryCount: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.textDark,
    marginTop: 8,
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
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
    gap: 4,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  talentList: {
    gap: 2,
  },
  projectList: {
    gap: 2,
  },
  headerAvatarBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.brandIndigo,
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
