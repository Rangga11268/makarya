import React from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { COLORS } from "../../theme/colors";
import { Header } from "../../components/ui/Header";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";
import {
  Building2,
  Mail,
  ShieldCheck,
  LogOut,
  GraduationCap,
  Sparkles,
} from "lucide-react-native";

export function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

  const handleLogout = () => {
    Alert.alert(
      "Konfirmasi Keluar",
      "Apakah Anda yakin ingin keluar dari akun ini?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Ya, Keluar", style: "destructive", onPress: logout },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={isMahasiswa ? "Profil Mahasiswa" : "Profil Akun UMKM"}
        subtitle={
          isMahasiswa
            ? "Identitas talenta & portofolio kampus"
            : "Informasi bisnis & manajemen akun"
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View
            style={[
              styles.avatarCircle,
              isMahasiswa ? styles.avatarMhs : styles.avatarUmkm,
            ]}
          >
            <Text
              style={[
                styles.avatarInitial,
                isMahasiswa ? styles.textWhite : styles.textDark,
              ]}
            >
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
            <Text style={styles.roleText}>
              {isMahasiswa
                ? "Mahasiswa Terverifikasi • UBSI"
                : "Klien UMKM Terverifikasi"}
            </Text>
          </View>
        </View>

        {/* Account Details */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>
            {isMahasiswa ? "Rincian Profil Akademik" : "Rincian Informasi Usaha"}
          </Text>

          {isMahasiswa ? (
            <>
              <View style={styles.detailRow}>
                <GraduationCap size={16} color={COLORS.textMuted} />
                <View style={styles.detailTextWrapper}>
                  <Text style={styles.detailLabel}>Perguruan Tinggi</Text>
                  <Text style={styles.detailValue}>
                    Universitas Bina Sarana Informatika
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Sparkles size={16} color={COLORS.textMuted} />
                <View style={styles.detailTextWrapper}>
                  <Text style={styles.detailLabel}>Program Studi</Text>
                  <Text style={styles.detailValue}>Sistem Informasi</Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.detailRow}>
              <Building2 size={16} color={COLORS.textMuted} />
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Nama Usaha</Text>
                <Text style={styles.detailValue}>{user?.nama_usaha || "-"}</Text>
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
                100% Rekening Bersama (Escrow)
              </Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
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
    padding: 20,
    paddingBottom: 110,
  },
  profileCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarMhs: {
    backgroundColor: COLORS.brandIndigo,
  },
  avatarUmkm: {
    backgroundColor: COLORS.canvasSoft,
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: "900",
  },
  userName: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.textDark,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  roleTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.canvasSoft,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  sectionBox: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 24,
    elevation: 1,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  detailTextWrapper: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
    marginTop: 1,
  },
  textWhite: {
    color: "#FFFFFF",
  },
  textDark: {
    color: COLORS.textDark,
  },
  logoutBtn: {
    marginBottom: 20,
  },
});