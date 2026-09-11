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
  Image,
} from "react-native";
import { FONTS } from "../../theme/fonts";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { initiateGoogleSignIn } from "../../services/googleAuth";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Check } from "lucide-react-native";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import { PebbleButton } from "../../components/ui/PebbleButton";
import { GoogleIcon } from "../../components/icons/GoogleIcon";

const { width, height } = Dimensions.get("window");
const STATUSBAR_OFFSET =
  Platform.OS === "android" ? (StatusBar.currentHeight || 28) + 14 : 14;

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
      const googleUser = await initiateGoogleSignIn({
        preferredEmail: email.trim() || undefined,
        role: "UMKM",
      });
      await loginWithGoogle({
        email: googleUser.email,
        name: googleUser.name,
        photo_url: googleUser.photo_url || googleUser.avatarUrl,
        role: googleUser.role || "UMKM",
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

      {/* Apple Soft Ambient Background (Fluentify / iOS style) */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Svg width={width} height={height}>
          <Defs>
            <RadialGradient
              id="loginAtmosphereTop"
              cx="78%"
              cy="8%"
              rx="65%"
              ry="35%"
              fx="78%"
              fy="8%"
            >
              <Stop offset="0%" stopColor="#DBEAFE" stopOpacity="0.75" />
              <Stop offset="55%" stopColor="#E0E7FF" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient
              id="loginAtmosphereMid"
              cx="15%"
              cy="26%"
              rx="55%"
              ry="30%"
              fx="15%"
              fy="26%"
            >
              <Stop offset="0%" stopColor="#E0EAFF" stopOpacity="0.5" />
              <Stop offset="60%" stopColor="#F1F5F9" stopOpacity="0.2" />
              <Stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={width} height={height} fill="#F8FAFC" />
          <Rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="url(#loginAtmosphereTop)"
          />
          <Rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="url(#loginAtmosphereMid)"
          />
        </Svg>
      </View>

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
                <Image
                  source={require("../../../assets/logo-icon.webp")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
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
                  <Mail
                    size={18}
                    color="#94A3B8"
                    style={styles.inputLeftIcon}
                  />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="nama@email.com"
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
                  <Lock
                    size={18}
                    color="#94A3B8"
                    style={styles.inputLeftIcon}
                  />
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
                    {rememberMe && (
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    )}
                  </View>
                  <Text style={styles.rememberMeText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotPasswordText}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Sign in Button (3D Glossy Pebble) */}
              <PebbleButton
                variant="midnight"
                size="lg"
                title={loading ? "Memproses..." : "Sign in"}
                onPress={handleLogin}
                loading={loading}
                style={{ marginTop: 8 }}
              />

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Sign In Button (Pearl Glossy Pebble) */}
              <PebbleButton
                variant="pearl"
                size="lg"
                label={
                  googleLoading ? "Menghubungkan..." : "Continue with Google"
                }
                icon={GoogleIcon}
                onPress={handleGoogleLogin}
                loading={googleLoading}
              />
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
    paddingTop: STATUSBAR_OFFSET,
    paddingBottom: 32,
    flexGrow: 1,
    justifyContent: "space-between",
  },

  // Top Bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 24,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoImage: {
    width: 30,
    height: 30,
    borderRadius: 8,
  },
  logoText: {
    fontFamily: FONTS.displayBold,
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.2,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
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
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    height: 54,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
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
    backgroundColor: "#0F172A",
    borderColor: "#0F172A",
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
    color: "#0F172A",
  },

  // Buttons (Apple Pill Style)
  signInBtn: {
    backgroundColor: "#0F172A",
    height: 54,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  signInBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.2,
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

  // Google (Apple Secondary Pill Style)
  googleBtn: {
    backgroundColor: "#FFFFFF",
    height: 54,
    borderRadius: 999,
    borderWidth: 1.2,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  googleBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    letterSpacing: -0.1,
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
    color: "#0F172A",
  },
});
