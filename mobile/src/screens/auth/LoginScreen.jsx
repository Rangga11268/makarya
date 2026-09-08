import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { COLORS } from "../../theme/colors";
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
  Store,
  ArrowRight,
} from "lucide-react-native";
import { styles } from "./LoginScreen.styles";

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
      showToast(
        err.response?.data?.detail || "Gagal masuk dengan Google",
        "danger",
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const fillTestAccount = (testEmail, testPass = "password123") => {
    setEmail(testEmail);
    setPassword(testPass);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
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
          <Text style={styles.welcomeText}>Selamat Datang Kembali</Text>
          <Text style={styles.subtitle}>
            Masuk untuk mengelola proyek, proposal kerja, dan transaksi escrow aman.
          </Text>
        </View>

        {/* Quick Fill Test Accounts Section */}
        <View style={styles.testAccountBox}>
          <View style={styles.testHeader}>
            <View style={styles.testTitleRow}>
              <Sparkles size={13} color={COLORS.brandIndigo} />
              <Text style={styles.testTitle}>Akses Cepat Uji Coba</Text>
            </View>
            <Text style={styles.testPassNotice}>Kata sandi: password123</Text>
          </View>

          <View style={styles.chipRow}>
            <TouchableOpacity
              style={[
                styles.chip,
                email === "darell@ubsi.ac.id" && styles.chipActiveMhs,
              ]}
              onPress={() => fillTestAccount("darell@ubsi.ac.id")}
              activeOpacity={0.75}
            >
              <View style={styles.chipIconBgIndigo}>
                <GraduationCap size={12} color={COLORS.brandIndigo} />
              </View>
              <View>
                <Text style={styles.chipLabel}>Mahasiswa</Text>
                <Text style={styles.chipEmail}>darell@ubsi.ac.id</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.chip,
                email === "kopi.nusantara@gmail.com" && styles.chipActiveUmkm,
              ]}
              onPress={() => fillTestAccount("kopi.nusantara@gmail.com")}
              activeOpacity={0.75}
            >
              <View style={styles.chipIconBgGreen}>
                <Store size={12} color={COLORS.success} />
              </View>
              <View>
                <Text style={styles.chipLabel}>Klien UMKM</Text>
                <Text style={styles.chipEmail}>kopi.nusantara@...</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Login Form Container */}
        <View style={styles.formCard}>
          <Input
            label="Email Akun / Kampus"
            placeholder="nama@kampus.ac.id atau email usaha"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
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
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
              activeOpacity={0.7}
            >
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

          {/* Google Sign In */}
          <Button
            title="Masuk dengan Akun Google"
            variant="google"
            size="lg"
            onPress={handleGoogleLogin}
            loading={googleLoading}
            disabled={loading}
            icon={<GoogleIcon size={18} />}
          />
        </View>

        {/* Register footer link */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Belum memiliki akun Makarya? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.7}
          >
            <Text style={styles.registerLink}>Daftar Sekarang</Text>
          </TouchableOpacity>
        </View>

        {/* Security Trust Footnote */}
        <View style={styles.securityBadge}>
          <ShieldCheck size={15} color={COLORS.brandIndigo} />
          <Text style={styles.securityText}>
            Dilindungi oleh Sistem Rekening Bersama Escrow & Enkripsi Data
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
