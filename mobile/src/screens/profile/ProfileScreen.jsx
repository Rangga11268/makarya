import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { Header } from "../../components/ui/Header";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";
import { showConfirm } from "../../store/dialogStore";
import {
  Building2,
  Mail,
  ShieldCheck,
  LogOut,
  GraduationCap,
  Sparkles,
  Star,
  CheckCircle2,
  Award,
  ChevronRight,
} from "lucide-react-native";

export function ProfileScreen({ navigation }) {
  const { user, logout } = useAuthStore();

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

  const handleLogout = () => {
    showConfirm({
      title: "Konfirmasi Keluar",
      message:
        "Apakah Anda yakin ingin mengakhiri sesi dan keluar dari akun Makarya?",
      type: "danger",
      confirmText: "Ya, Keluar",
      cancelText: "Batal",
      onConfirm: logout,
    });
  };

  const canGoBack = navigation?.canGoBack && navigation.canGoBack();

  return (
    <View style={styles.container}>
      <Header
        title={isMahasiswa ? "Profil Mahasiswa" : "Profil Akun UMKM"}
        subtitle={
          isMahasiswa
            ? "Identitas talenta & portofolio kampus terverifikasi"
            : "Informasi bisnis & manajemen akun UMKM"
        }
        onBack={canGoBack ? () => navigation.goBack() : undefined}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Profile Hero Card */}
        <View style={styles.profileCard}>
          <View
            style={[
              styles.avatarCircle,
              isMahasiswa ? styles.avatarMhs : styles.avatarUmkm,
            ]}
          >
            <Text style={styles.avatarInitial}>
              {isMahasiswa
                ? user?.nama_lengkap?.charAt(0) || "D"
                : user?.nama_usaha?.charAt(0) || "U"}
            </Text>
          </View>

          <Text style={styles.userName}>
            {isMahasiswa
              ? user?.nama_lengkap || "Darell Rangga Putra"
              : user?.nama_usaha || "Brand UMKM Anda"}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          <View style={styles.roleTag}>
            {isMahasiswa ? (
              <GraduationCap size={13} color={COLORS.brandIndigo} />
            ) : (
              <ShieldCheck size={13} color={COLORS.brandCyan} />
            )}
            <Text
              style={[
                styles.roleText,
                isMahasiswa
                  ? { color: COLORS.brandIndigo }
                  : { color: COLORS.brandCyan },
              ]}
            >
              {isMahasiswa
                ? "Mahasiswa Terverifikasi • UBSI"
                : "Klien UMKM Terverifikasi"}
            </Text>
          </View>

          {/* Quick Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <View style={styles.metricIconRow}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.metricValue}>5.0</Text>
              </View>
              <Text style={styles.metricLabel}>Reputasi Skor</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{isMahasiswa ? "14" : "8"}</Text>
              <Text style={styles.metricLabel}>
                {isMahasiswa ? "Proyek Tuntas" : "Proyek Diterbitkan"}
              </Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: COLORS.success }]}>
                100%
              </Text>
              <Text style={styles.metricLabel}>Sukses Escrow</Text>
            </View>
          </View>
        </View>

        {/* 2. Account Details Section */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>
            {isMahasiswa ? "Informasi Akademik" : "Rincian Identitas Usaha"}
          </Text>

          {isMahasiswa ? (
            <>
              <View style={styles.detailRow}>
                <GraduationCap size={16} color={COLORS.brandIndigo} />
                <View style={styles.detailTextWrapper}>
                  <Text style={styles.detailLabel}>Perguruan Tinggi</Text>
                  <Text style={styles.detailValue}>
                    Universitas Bina Sarana Informatika
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Sparkles size={16} color={COLORS.brandCyan} />
                <View style={styles.detailTextWrapper}>
                  <Text style={styles.detailLabel}>Program Studi</Text>
                  <Text style={styles.detailValue}>Sistem Informasi (S1)</Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.detailRow}>
              <Building2 size={16} color={COLORS.brandIndigo} />
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Nama Usaha</Text>
                <Text style={styles.detailValue}>
                  {user?.nama_usaha || "-"}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.detailRow}>
            <Mail size={16} color={COLORS.textMuted} />
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailLabel}>Email Akun</Text>
              <Text style={styles.detailValue}>{user?.email || "-"}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <ShieldCheck size={16} color={COLORS.success} />
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailLabel}>Perlindungan Transaksi</Text>
              <Text style={[styles.detailValue, { color: COLORS.success }]}>
                100% Rekening Bersama (Escrow Holding)
              </Text>
            </View>
          </View>
        </View>

        {/* 3. Makarya Official Brand Footer Card */}
        <View style={styles.brandCard}>
          <Image
            source={require("../../../assets/logo.webp")}
            style={styles.brandLogoImage}
            resizeMode="contain"
          />
          <Text style={styles.brandAppTitle}>Makarya Mobile v2.0</Text>
          <Text style={styles.brandAppSubtitle}>
            Platform Kolaborasi Mahasiswa & Klien UMKM Terverifikasi UBSI
          </Text>
          <View style={styles.brandShieldPill}>
            <ShieldCheck size={13} color={COLORS.success} />
            <Text style={styles.brandShieldText}>
              Dilindungi Sistem Escrow Pintar
            </Text>
          </View>
        </View>

        {/* 4. Logout Action */}
        <Button
          title="Keluar dari Akun"
          variant="danger"
          size="lg"
          icon={<LogOut size={18} color="#FFF" />}
          onPress={handleLogout}
          style={styles.logoutBtn}
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
    padding: 16,
    paddingBottom: 110,
  },
  profileCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 16,
    ...SHADOWS.sm,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    ...SHADOWS.brandGlow,
  },
  avatarMhs: {
    backgroundColor: COLORS.brandIndigo,
  },
  avatarUmkm: {
    backgroundColor: COLORS.brandCyan,
  },
  avatarInitial: {
    fontFamily: FONTS.displayBold,
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  userName: {
    fontFamily: FONTS.displayBold,
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.4,
  },
  userEmail: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 10,
  },
  roleTag: {
    fontFamily: FONTS.bodyRegular,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.2)",
    marginBottom: 18,
  },
  roleText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "800",
  },
  metricsGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.textDark,
  },
  metricLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.borderDark,
  },
  sectionBox: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 20,
    ...SHADOWS.sm,
  },
  sectionTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  detailTextWrapper: {
    fontFamily: FONTS.bodyRegular,
    flex: 1,
  },
  detailLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  detailValue: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
    marginTop: 1,
  },
  logoutBtn: {
    marginBottom: 20,
  },
  brandCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 16,
    ...SHADOWS.sm,
  },
  brandLogoImage: {
    width: 140,
    height: 38,
    marginBottom: 8,
  },
  brandAppTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.textDark,
  },
  brandAppSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 3,
    marginBottom: 12,
    lineHeight: 16,
  },
  brandShieldPill: {
    fontFamily: FONTS.bodyRegular,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  brandShieldText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.success,
  },
});
