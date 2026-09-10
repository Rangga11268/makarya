import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FONTS } from "../../theme/fonts";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { initiateGoogleSignIn } from "../../services/googleAuth";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
} from "lucide-react-native";

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
      const isNetworkError =
        !err.response ||
        err.message === "Network Error" ||
        err.code === "ERR_NETWORK";
      const errorMsg = isNetworkError
        ? "Koneksi backend terputus. Pastikan server aktif."
        : err.response?.data?.detail || "Email atau password tidak sesuai.";
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
      showToast(
        err.response?.data?.detail || "Gagal masuk dengan Google",
        "danger",
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Top Bar with Logo & Optional Back */}
            <View style={styles.topBar}>
              <View style={styles.logoRow}>
                <View style={styles.logoIcon}>
                  <View style={styles.logoInnerDot} />
                </View>
                <Text style={styles.logoText}>Makarya</Text>
              </View>

              {navigation?.canGoBack && navigation.canGoBack() && (
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}
                >
                  <ArrowLeft size={18} color="#0F172A" />
                </TouchableOpacity>
              )}
            </View>

            {/* Header Text matching mockup */}
            <View style={styles.headerBlock}>
              <Text style={styles.titleText}>Let's Sign in</Text>
              <Text style={styles.subtitleText}>
                Get started with a registered account
              </Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formBlock}>
              {/* Email Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={18} color="#94A3B8" style={styles.inputLeftIcon} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="glow@lumeburg.studio"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.textInput}
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={18} color="#94A3B8" style={styles.inputLeftIcon} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showPassword}
                    style={styles.textInput}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                    activeOpacity={0.7}
                  >
                    {showPassword ? (
                      <Eye size={18} color="#64748B" />
                    ) : (
                      <EyeOff size={18} color="#94A3B8" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Remember me & Forgot password row */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberMeRow}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxActive,
                    ]}
                  >
                    {rememberMe && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                  </View>
                  <Text style={styles.rememberMeText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              {/* Sign in Button (Vibrant Indigo/Purple) */}
              <TouchableOpacity
                style={[styles.signInBtn, loading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.88}
              >
                <Text style={styles.signInBtnText}>
                  {loading ? "Memproses..." : "Sign in"}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Sign In Button */}
              <TouchableOpacity
                style={styles.googleBtn}
                onPress={handleGoogleLogin}
                disabled={googleLoading}
                activeOpacity={0.85}
              >
                <Text style={styles.googleBtnText}>
                  {googleLoading ? "Menghubungkan..." : "Continue with Google"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Footer Link */}
            <View style={styles.footerBlock}>
              <Text style={styles.footerText}>
                Don't have an account?{" "}
                <Text
                  style={styles.footerLink}
                  onPress={() => navigation.navigate("RoleSelection")}
                >
                  Create account
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
    flexGrow: 1,
    justifyContent: "space-between",
  },

  // Top Bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
  },
  logoInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6366F1",
  },
  logoText: {
    fontFamily: FONTS.displayBold,
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },

  // Header Block
  headerBlock: {
    marginBottom: 24,
  },
  titleText: {
    fontFamily: FONTS.displayBold,
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitleText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: "#64748B",
  },

  // Form Fields
  formBlock: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "600",
    color: "#0F172A",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    height: 52,
  },
  inputLeftIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    color: "#0F172A",
    height: "100%",
  },
  eyeBtn: {
    padding: 6,
  },

  // Options (Remember me & Forgot password)
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  rememberMeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxActive: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  rememberMeText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "#475569",
  },
  forgotPasswordText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "600",
    color: "#6366F1",
  },

  // Buttons
  signInBtn: {
    backgroundColor: "#6366F1",
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 3,
  },
  signInBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#94A3B8",
  },

  // Google
  googleBtn: {
    backgroundColor: "#FFFFFF",
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  googleBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },

  // Footer
  footerBlock: {
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: "#64748B",
  },
  footerLink: {
    fontFamily: FONTS.bodyBold,
    fontWeight: "700",
    color: "#6366F1",
  },
});
