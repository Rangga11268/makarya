import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { COLORS } from "../../theme/colors";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { Sparkles, ShieldCheck, Mail, Lock } from "lucide-react-native";

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const { showToast } = useToastStore();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showToast("Email dan password wajib diisi", "danger");
      return;
    }

    try {
      setLoading(true);
      const user = await login(email.trim(), password);
      showToast(`Selamat datang kembali!`, "success");
    } catch (err) {
      showToast(err.response?.data?.detail || "Gagal masuk. Periksa email/password.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Top Header & Branding */}
      <View style={styles.header}>
        <View style={styles.topLogoRow}>
          <Image
            source={require("../../../assets/logo.webp")}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <View style={styles.badge}>
            <Sparkles size={12} color={COLORS.brandCyan} />
            <Text style={styles.badgeText}>Portal UMKM</Text>
          </View>
        </View>

        <Text style={styles.welcomeText}>Masuk ke Akun</Text>
        <Text style={styles.subtitle}>
          Akses dashboard manajemen proyek & kolaborasi mahasiswa bertalenta.
        </Text>
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <Input
          label="Email Terdaftar"
          placeholder="nama@usahaanda.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          icon={<Mail size={18} color={COLORS.textMuted} />}
        />

        <Input
          label="Kata Sandi"
          placeholder="Masukkan password akun"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          icon={<Lock size={18} color={COLORS.textMuted} />}
        />

        <Button
          title="Masuk ke Akun UMKM"
          variant="lime"
          size="lg"
          onPress={handleLogin}
          loading={loading}
          style={styles.loginBtn}
        />

        {/* Register link */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Belum memiliki akun UMKM? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Daftar Sekarang</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Security Footer Notice */}
      <View style={styles.footerNotice}>
        <ShieldCheck size={16} color={COLORS.accentCyan} />
        <Text style={styles.footerText}>
          Seluruh transaksi proyek dilindungi 100% oleh Rekening Bersama (Escrow) resmi Makarya.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.bgDark,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  header: {
    marginBottom: 28,
  },
  topLogoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  brandLogo: {
    width: 140,
    height: 42,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(14, 165, 233, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(14, 165, 233, 0.25)",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.brandCyan,
    letterSpacing: 0.2,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.textWhite,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 6,
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 24,
  },
  loginBtn: {
    marginTop: 8,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  registerText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  registerLink: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.brandCyan,
  },
  footerNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.cardDark,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textMuted,
    flex: 1,
    lineHeight: 16,
  },
});