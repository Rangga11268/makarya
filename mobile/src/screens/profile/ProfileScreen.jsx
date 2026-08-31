import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { COLORS } from "../../theme/colors";
import { Header } from "../../components/ui/Header";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";
import { Building2, Mail, ShieldCheck, LogOut, Phone, MapPin } from "lucide-react-native";

export function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      "Konfirmasi Keluar",
      "Apakah Anda yakin ingin keluar dari akun UMKM?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Ya, Keluar", style: "destructive", onPress: logout },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Profil Akun UMKM" subtitle="Informasi bisnis dan pengaturan akun" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>
              {user?.nama_usaha ? user.nama_usaha.charAt(0) : "U"}
            </Text>
          </View>

          <Text style={styles.businessName}>{user?.nama_usaha || "Brand UMKM Anda"}</Text>
          <Text style={styles.businessEmail}>{user?.email}</Text>

          <View style={styles.roleTag}>
            <ShieldCheck size={12} color="#000" />
            <Text style={styles.roleText}>Klien UMKM Terverifikasi</Text>
          </View>
        </View>

        {/* Business Details */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Rincian Informasi Usaha</Text>

          <View style={styles.detailRow}>
            <Building2 size={16} color={COLORS.textMuted} />
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailLabel}>Nama Usaha</Text>
              <Text style={styles.detailValue}>{user?.nama_usaha || "-"}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Mail size={16} color={COLORS.textMuted} />
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailLabel}>Email Terdaftar</Text>
              <Text style={styles.detailValue}>{user?.email || "-"}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <ShieldCheck size={16} color={COLORS.accentCyan} />
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailLabel}>Perlindungan Transaksi</Text>
              <Text style={[styles.detailValue, { color: COLORS.accentCyan }]}>
                100% Escrow Holding
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
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 26,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.accentLime,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: "900",
    color: "#000",
  },
  businessName: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.textWhite,
  },
  businessEmail: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  roleTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.accentLime,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#000",
  },
  sectionBox: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 24,
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
    color: COLORS.textWhite,
    marginTop: 1,
  },
  logoutBtn: {
    marginBottom: 20,
  },
});