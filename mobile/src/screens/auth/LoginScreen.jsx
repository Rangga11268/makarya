import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import {
  Sparkles,
  ShieldCheck,
  Mail,
  Lock,
  GraduationCap,
  UserCheck,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react-native";

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      const loggedUser = await login(email.trim(), password);
      if (loggedUser?.role === "ADMIN") {
        useAuthStore.getState().logout();
        showToast(
          "Akun Administrator hanya dapat diakses melalui portal web.",
          "danger",
        );
        return;
      }
      showToast(`Selamat datang kembali!`, "success");
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Gagal masuk. Periksa email/password.",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  };

  const fillTestAccount = (testEmail, testPass = "password123") => {
    setEmail(testEmail);
    setPassword(testPass);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Top Header & Branding */}
      <View style={styles.header}>
        <Image
          source={require("../../../assets/logo.webp")}
          style={styles.brandLogo}
          resizeMode="contain"
        />
        <Text style={styles.welcomeText}>Masuk ke Akun Anda</Text>
        <Text style={styles.subtitle}>
          Akses dashboard proyek, proposal, dan dompet pencairan dana escrow.
        </Text>
      </View>

      {/* Quick Fill Test Accounts Chips (Mahasiswa & Klien UMKM Only) */}
      <View style={styles.testAccountBox}>
        <View style={styles.testHeader}>
          <View style={styles.testTitleRow}>
            <Sparkles size={14} color={COLORS.brandIndigo} />
            <Text style={styles.testTitle}>Pilih Akun Uji Coba Cepat:</Text>
          </View>
          <Text style={styles.testPassNotice}>Pass: password123</Text>
        </View>

        <View style={styles.chipRow}>
          <TouchableOpacity
            style={styles.chip}
            onPress={() => fillTestAccount("darell@ubsi.ac.id")}
            activeOpacity={0.7}
          >
            <GraduationCap size={13} color={COLORS.brandIndigo} />
            <Text style={styles.chipText}>Mahasiswa (Darell)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chip}
            onPress={() => fillTestAccount("kopi.nusantara@gmail.com")}
            activeOpacity={0.7}
          >
            <UserCheck size={13} color={COLORS.success} />
            <Text style={styles.chipText}>Klien UMKM (Kopi)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Form Container */}
      <View style={styles.formContainer}>
        <Input
          label="Email Akun / Kampus"
          placeholder="nama@kampus.ac.id atau email UMKM"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          icon={<Mail size={18} color={COLORS.textMuted} />}
        />

        <View style={styles.passwordWrapper}>
          <Input
            label="Kata Sandi"
            placeholder="Masukkan password akun"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            icon={<Lock size={18} color={COLORS.textMuted} />}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={18} color={COLORS.textMuted} />
            ) : (
              <Eye size={18} color={COLORS.textMuted} />
            )}
          </TouchableOpacity>
        </View>

        <Button
          title="Masuk Sekarang"
          variant="lime"
          size="lg"
          onPress={handleLogin}
          loading={loading}
          iconRight={<ArrowRight size={18} color="#FFFFFF" />}
          style={styles.loginBtn}
        />

        {/* Register link */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Belum memiliki akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Daftar Sekarang</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Security Trust Badge */}
      <View style={styles.footerNotice}>
        <ShieldCheck size={16} color={COLORS.success} />
        <Text style={styles.footerText}>
          Garansi Rekening Bersama (Escrow) & Keamanan Data Resmi Makarya.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.bgDark, // Clean light canvas #F8FAFC
    paddingHorizontal: 22,
    paddingTop: 50,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 20,
  },
  brandLogo: {
    width: 150,
    height: 46,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 6,
    lineHeight: 19,
  },
  hiddenH1: {
    display: "none",
  },
  testAccountBox: {
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 20,
  },
  testHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  testTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  testTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  testPassNotice: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.bgSurface,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    elevation: 1,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  formContainer: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: 38,
    padding: 4,
  },
  loginBtn: {
    marginTop: 6,
    backgroundColor: COLORS.brandIndigo,
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
    color: COLORS.brandIndigo,
  },
  footerNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.canvasSoft,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    alignSelf: "center",
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textMuted,
    flex: 1,
    lineHeight: 16,
  },
});
