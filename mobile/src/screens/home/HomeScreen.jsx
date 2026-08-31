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
import { Card } from "../../components/ui/Card";
import { TalentBentoCard } from "../../components/features/TalentBentoCard";
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
  ArrowUpRight,
  TrendingUp,
  Activity,
} from "lucide-react-native";

export function HomeScreen({ navigation }) {
  const { user } = useAuthStore();
  const [wallet, setWallet] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [walletRes, projRes] = await Promise.all([
        walletApi
          .getMe()
          .catch(() => ({ data: { saldo_aktif: 0, saldo_escrow: 0 } })),
        projectApi.getMyProjects({ limit: 5 }).catch(() => ({ data: [] })),
      ]);
      setWallet(walletRes.data);
      setMyProjects(projRes.data);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
          <View style={styles.verifiedTag}>
            <ShieldCheck size={12} color={COLORS.brandCyan} />
            <Text style={styles.verifiedText}>Escrow Protected</Text>
          </View>
        </View>

        <Text style={styles.greeting}>
          Halo, {user?.nama_usaha || "Pemilik UMKM"}
        </Text>
        <Text style={styles.headerSubtitle}>
          Temukan talenta mahasiswa terbaik untuk kebutuhan usaha Anda.
        </Text>
      </View>

      {/* Saldo & Quick Action Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <View style={styles.walletIcon}>
            <Wallet size={18} color={COLORS.brandCyan} />
          </View>
          <Text style={styles.balanceLabel}>Saldo Aktif UMKM</Text>
        </View>

        <Text style={styles.balanceAmount}>
          {formatCurrency(wallet?.saldo_aktif || 0)}
        </Text>

        <View style={styles.escrowRow}>
          <Text style={styles.escrowText}>
            Terkunci di Escrow:{" "}
            <Text style={styles.escrowAmount}>
              {formatCurrency(wallet?.saldo_escrow || 0)}
            </Text>
          </Text>
        </View>

        <View style={styles.quickActions}>
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
        </View>
      </View>

      {/* Quick Summary Grid */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryBox}>
          <Briefcase size={18} color={COLORS.accentCyan} />
          <Text style={styles.summaryCount}>{myProjects.length}</Text>
          <Text style={styles.summaryLabel}>Proyek Berjalan</Text>
        </View>

        <View style={styles.summaryBox}>
          <Activity size={18} color={COLORS.accentLime} />
          <Text style={styles.summaryCount}>
            {myProjects.reduce((acc, p) => acc + (p.total_pelamar || 0), 0)}
          </Text>
          <Text style={styles.summaryLabel}>Proposal Masuk</Text>
        </View>
      </View>

      {/* Featured Talents Section (Dribbble Bento UI) */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Talenta Mahasiswa Unggulan</Text>
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
    marginBottom: 12,
  },
  headerLogo: {
    width: 120,
    height: 36,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  verifiedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(14, 165, 233, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(14, 165, 233, 0.25)",
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.brandCyan,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
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
  talentList: {
    gap: 2,
  },
});
