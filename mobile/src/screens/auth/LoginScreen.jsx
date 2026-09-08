import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
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
  Store,
  ArrowRight,
} from "lucide-react-native";
import { styles as s } from "./LoginScreen.styles";

const { height } = Dimensions.get("window");

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
    <View style={s.screen}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* 1. TOP HERO IMAGE & AMBIENT GLOW */}
      <View style={[s.heroSection, { height: height * 0.38 }]}>
        <Image
          source={require("../../../assets/login_hero.jpg")}
          style={s.heroImage}
          resizeMode="cover"
        />
        <View style={s.heroOverlay} />

        <View style={s.heroContent}>
          <View style={s.heroBadge}>
            <ShieldCheck size={11} color="#6EE7B7" />
            <Text style={s.heroBadgeText}>
              Platform Kolaborasi Terverifikasi
            </Text>
          </View>

          <Text style={s.welcomeText}>Masuk ke Akun Anda</Text>
          <Text style={s.subtitle}>
            Akses dashboard proyek, proposal kerja, dan transaksi escrow aman.
          </Text>
        </View>
      </View>

      {/* 2. ELEVATED BOTTOM SHEET (Seamless Curve) */}
      <View style={s.bottomSheet}>
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Quick Fill Test Accounts Chips */}
          <View style={s.quickFillHeader}>
            <View style={s.quickFillTitleRow}>
              <Sparkles size={12} color={COLORS.brandIndigo} />
              <Text style={s.quickFillTitle}>Uji Coba Cepat</Text>
            </View>
            <Text style={s.quickFillNotice}>Sandi: password123</Text>
          </View>

          <View style={s.chipContainer}>
            <TouchableOpacity
              style={[
                s.chipItem,
                email === "darell@ubsi.ac.id" && s.chipItemActiveMhs,
              ]}
              onPress={() => fillTestAccount("darell@ubsi.ac.id")}
              activeOpacity={0.75}
            >
              <GraduationCap
                size={14}
                color={
                  email === "darell@ubsi.ac.id"
                    ? COLORS.brandIndigo
                    : COLORS.textMuted
                }
              />
              <Text
                style={[
                  s.chipText,
                  email === "darell@ubsi.ac.id" && s.chipTextActiveMhs,
                ]}
              >
                Mahasiswa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                s.chipItem,
                email === "kopi.nusantara@gmail.com" && s.chipItemActiveUmkm,
              ]}
              onPress={() => fillTestAccount("kopi.nusantara@gmail.com")}
              activeOpacity={0.75}
            >
              <Store
                size={14}
                color={
                  email === "kopi.nusantara@gmail.com"
                    ? COLORS.success
                    : COLORS.textMuted
                }
              />
              <Text
                style={[
                  s.chipText,
                  email === "kopi.nusantara@gmail.com" && s.chipTextActiveUmkm,
                ]}
              >
                Klien UMKM
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Input Area */}
          <View style={s.formArea}>
            <Input
              label="Email Akun / Kampus"
              placeholder="Contoh: darell@ubsi.ac.id"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Mail size={18} color={COLORS.textMuted} />}
            />

            <Input
              label="Kata Sandi"
              placeholder="Masukkan kata sandi Anda"
              value={password}
              onChangeText={setPassword}
              isPassword={true}
              icon={<Lock size={18} color={COLORS.textMuted} />}
            />

            <View style={s.forgotPasswordRow}>
              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
                activeOpacity={0.7}
              >
                <Text style={s.forgotPasswordLink}>Lupa Kata Sandi?</Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Masuk Sekarang"
              variant="brand"
              size="lg"
              onPress={handleLogin}
              loading={loading}
              iconRight={<ArrowRight size={18} color="#FFFFFF" />}
              style={s.loginBtn}
            />

            {/* Divider */}
            <View style={s.dividerRow}>
              <View style={s.dividerLine} />
              <Text style={s.dividerText}>atau</Text>
              <View style={s.dividerLine} />
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
          <View style={s.registerRow}>
            <Text style={s.registerText}>Belum memiliki akun Makarya? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.7}
            >
              <Text style={s.registerLink}>Daftar Sekarang</Text>
            </TouchableOpacity>
          </View>

          {/* Security Trust Footnote */}
          <View style={s.securityBadge}>
            <ShieldCheck size={14} color={COLORS.brandIndigo} />
            <Text style={s.securityText}>
              Dilindungi Enkripsi & Garansi Rekening Bersama (Escrow)
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
