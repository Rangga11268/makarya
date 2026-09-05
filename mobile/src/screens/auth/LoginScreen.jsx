import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { GoogleIcon } from "../../components/icons/GoogleIcon";
import { initiateGoogleSignIn } from "../../services/googleAuth";
import {
  Sparkles,
  ShieldCheck,
  Mail,
  Lock,
  GraduationCap,
  UserCheck,
  ArrowRight,
} from "lucide-react-native";

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, loginWithGoogle } = useAuthStore();
  const { showToast } = useToastStore();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showToast("Email dan kata sandi wajib diisi", "danger");
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
      showToast("Selamat datang kembali!", "success");
    } catch (err) {
      console.warn("Login error:", err);
      const isNetworkError =
        !err.response ||
        err.message === "Network Error" ||
        err.code === "ERR_NETWORK";
      const errorMsg = isNetworkError
        ? "Koneksi ke backend gagal. Pastikan uvicorn berjalan dengan --host 0.0.0.0"
        : err.response?.data?.detail ||
          "Gagal masuk. Periksa email/kata sandi.";
      showToast(errorMsg, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const googleUser = await initiateGoogleSignIn();
      await loginWithGoogle({
        id_token: googleUser.idToken,
        email: googleUser.email,
        name: googleUser.name,
        avatar_url: googleUser.avatarUrl,
      });
      showToast("Berhasil masuk dengan Google!", "success");
    } catch (err) {
      if (err.message?.includes("dibatalkan")) return;
      console.warn("Google sign-in error:", err);
      showToast(err.response?.data?.detail || "Gagal masuk dengan Google", "danger");
    } finally {
      setGoogleLoading(false);
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
      showsVerticalScrollIndicator={false}
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

        <Input
          label="Kata Sandi"
          placeholder="Masukkan kata sandi akun"
          value={password}
          onChangeText={setPassword}
          isPassword={true}
          icon={<Lock size={18} color={COLORS.textMuted} />}
        />

        <View style={styles.forgotPasswordRow}>
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={styles.forgotPasswordLink}>Lupa Kata Sandi?</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Masuk Sekarang"
          variant="brand"
          size="lg"
          onPress={handleLogin}
          loading={loading}
          iconRight={<ArrowRight size={18} color="#FFFFFF" />}
          style={styles.loginBtn}
        />

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>atau</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google Sign In Button */}
        <TouchableOpacity
          style={styles.googleBtn}
          onPress={handleGoogleLogin}
          disabled={googleLoading || loading}
          activeOpacity={0.8}
        >
          {googleLoading ? (
            <ActivityIndicator size="small" color={COLORS.brandIndigo} />
          ) : (
            <>
              <GoogleIcon size={18} />
              <Text style={styles.googleBtnText}>Masuk dengan Google</Text>
            </>
          )}
        </TouchableOpacity>

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
          Garansi Rekening Bersama (Escrow) & Keamanan Data Pengguna Makarya.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.bgDark,
    paddingHorizontal: 22,
    paddingTop: 54,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 20,
  },
  brandLogo: {
    width: 130,
    height: 38,
    marginBottom: 14,
    alignSelf: "flex-start",
  },
  welcomeText: {
    fontFamily: FONTS.displayBold,
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    lineHeight: 21,
  },
  testAccountBox: {
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 18,
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
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  testPassNotice: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
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
    gap: 6,
    backgroundColor: COLORS.bgSurface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  chipText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  formContainer: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 18,
  },
  loginBtn: {
    marginTop: 6,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  registerText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  registerLink: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  forgotPasswordRow: {
    alignItems: "flex-end",
    marginBottom: 14,
    marginTop: -4,
  },
  forgotPasswordLink: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.brandIndigo,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.borderDark,
  },
  dividerText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  googleBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
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
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    flex: 1,
    lineHeight: 16,
  },
});
