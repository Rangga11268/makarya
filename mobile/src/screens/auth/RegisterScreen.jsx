import React, { useState, useEffect } from "react";
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
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  GraduationCap,
  ArrowLeft,
  Check,
  Briefcase,
  Store,
} from "lucide-react-native";

export function RegisterScreen({ route, navigation }) {
  // Role passed from RoleSelectionScreen or default to 'MAHASISWA'
  const initialRole = route.params?.role || "MAHASISWA";
  const [role, setRole] = useState(initialRole);

  const [fullName, setFullName] = useState("");
  const [nim, setNim] = useState("");
  const [namaUsaha, setNamaUsaha] = useState("");
  const [bidangIndustri, setBidangIndustri] = useState("Kuliner & F&B");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { registerUmkm, registerMhs } = useAuthStore();
  const { showToast } = useToastStore();

  useEffect(() => {
    if (route.params?.role) {
      setRole(route.params.role);
    }
  }, [route.params?.role]);

  const handleRegister = async () => {
    if (!agreeTerms) {
      showToast("Anda wajib menyetujui syarat & ketentuan layanan", "danger");
      return;
    }

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      showToast("Email dan kata sandi wajib diisi", "danger");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Konfirmasi kata sandi tidak cocok", "danger");
      return;
    }

    if (role === "UMKM") {
      const name = namaUsaha.trim() || fullName.trim();
      if (!name) {
        showToast("Nama usaha / nama lengkap wajib diisi", "danger");
        return;
      }

      try {
        setLoading(true);
        await registerUmkm({
          nama_usaha: name,
          bidang_industri: bidangIndustri,
          kota: "Bekasi",
          no_kontak: "081234567890",
          email: email.trim(),
          password,
        });

        showToast("Kode OTP berhasil dikirimkan!", "success");
        navigation.navigate("Verification", {
          email: email.trim(),
          role: "CLIENT_UMKM",
        });
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Pendaftaran gagal. Periksa kembali data.",
          "danger",
        );
      } finally {
        setLoading(false);
      }
    } else {
      if (!fullName.trim()) {
        showToast("Nama lengkap wajib diisi", "danger");
        return;
      }

      const lowerEmail = email.trim().toLowerCase();
      if (!lowerEmail.endsWith(".ac.id") && !lowerEmail.endsWith(".edu")) {
        showToast(
          "Email mahasiswa wajib berakhiran .ac.id atau .edu",
          "danger",
        );
        return;
      }

      try {
        setLoading(true);
        await registerMhs({
          nama_lengkap: fullName.trim(),
          nim: nim.trim() || "2021001",
          prodi_id: 1,
          email: email.trim(),
          password,
        });

        showToast("Kode OTP berhasil dikirimkan!", "success");
        navigation.navigate("Verification", {
          email: email.trim(),
          role: "MAHASISWA",
        });
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Pendaftaran gagal. Periksa kembali data.",
          "danger",
        );
      } finally {
        setLoading(false);
      }
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
            {/* Top Bar with Logo & Back */}
            <View style={styles.topBar}>
              <View style={styles.logoRow}>
                <View style={styles.logoIcon}>
                  <View style={styles.logoInnerDot} />
                </View>
                <Text style={styles.logoText}>Makarya</Text>
              </View>

              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <ArrowLeft size={18} color="#0F172A" />
              </TouchableOpacity>
            </View>

            {/* Header Text matching mockup */}
            <View style={styles.headerBlock}>
              <Text style={styles.titleText}>Create account</Text>
              <Text style={styles.subtitleText}>
                {role === "UMKM"
                  ? "Daftar sebagai Klien UMKM untuk pasang proyek"
                  : "Daftar sebagai Mahasiswa untuk raih honor proyek"}
              </Text>
            </View>

            {/* Role Switcher Pill */}
            <View style={styles.roleSwitcherRow}>
              <TouchableOpacity
                style={[
                  styles.roleSwitchBtn,
                  role === "MAHASISWA" && styles.roleSwitchBtnActive,
                ]}
                onPress={() => setRole("MAHASISWA")}
                activeOpacity={0.8}
              >
                <GraduationCap
                  size={14}
                  color={role === "MAHASISWA" ? "#FFFFFF" : "#64748B"}
                />
                <Text
                  style={[
                    styles.roleSwitchText,
                    role === "MAHASISWA" && styles.roleSwitchTextActive,
                  ]}
                >
                  Mahasiswa
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleSwitchBtn,
                  role === "UMKM" && styles.roleSwitchBtnActive,
                ]}
                onPress={() => setRole("UMKM")}
                activeOpacity={0.8}
              >
                <Store
                  size={14}
                  color={role === "UMKM" ? "#FFFFFF" : "#64748B"}
                />
                <Text
                  style={[
                    styles.roleSwitchText,
                    role === "UMKM" && styles.roleSwitchTextActive,
                  ]}
                >
                  Klien UMKM
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields matching mockup */}
            <View style={styles.formBlock}>
              {/* Full Name / Nama Usaha */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {role === "UMKM" ? "Nama Usaha / Klien *" : "Full name *"}
                </Text>
                <View style={styles.inputWrapper}>
                  {role === "UMKM" ? (
                    <Building2 size={18} color="#94A3B8" style={styles.inputLeftIcon} />
                  ) : (
                    <User size={18} color="#94A3B8" style={styles.inputLeftIcon} />
                  )}
                  <TextInput
                    value={role === "UMKM" ? namaUsaha : fullName}
                    onChangeText={role === "UMKM" ? setNamaUsaha : setFullName}
                    placeholder={
                      role === "UMKM" ? "Contoh: Kopi Nusantara" : "Shirley Raj"
                    }
                    placeholderTextColor="#94A3B8"
                    style={styles.textInput}
                  />
                </View>
              </View>

              {/* NIM (for Mahasiswa) */}
              {role === "MAHASISWA" && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>NIM Kampus *</Text>
                  <View style={styles.inputWrapper}>
                    <GraduationCap size={18} color="#94A3B8" style={styles.inputLeftIcon} />
                    <TextInput
                      value={nim}
                      onChangeText={setNim}
                      placeholder="Contoh: 202100123"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      style={styles.textInput}
                    />
                  </View>
                </View>
              )}

              {/* Email Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email *</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={18} color="#94A3B8" style={styles.inputLeftIcon} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder={
                      role === "MAHASISWA"
                        ? "nama@kampus.ac.id"
                        : "email@example.com"
                    }
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.textInput}
                  />
                </View>
                {role === "MAHASISWA" && (
                  <Text style={styles.inputHelperText}>
                    Wajib gunakan email kampus (.ac.id / .edu)
                  </Text>
                )}
              </View>

              {/* Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password *</Text>
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

              {/* Confirm Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm password *</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={18} color="#94A3B8" style={styles.inputLeftIcon} />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showConfirmPassword}
                    style={styles.textInput}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeBtn}
                    activeOpacity={0.7}
                  >
                    {showConfirmPassword ? (
                      <Eye size={18} color="#64748B" />
                    ) : (
                      <EyeOff size={18} color="#94A3B8" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms Checkbox */}
              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => setAgreeTerms(!agreeTerms)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    agreeTerms && styles.checkboxActive,
                  ]}
                >
                  {agreeTerms && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                </View>
                <Text style={styles.termsLabelText}>
                  I agree with the terms and conditions
                </Text>
              </TouchableOpacity>

              {/* Create account button */}
              <TouchableOpacity
                style={[styles.createBtn, loading && { opacity: 0.7 }]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.88}
              >
                <Text style={styles.createBtnText}>
                  {loading ? "Mendaftarkan..." : "Create account"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Footer Link */}
            <View style={styles.footerBlock}>
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text
                  style={styles.footerLink}
                  onPress={() => navigation.navigate("Login")}
                >
                  Sign in
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
    paddingBottom: 36,
    flexGrow: 1,
  },

  // Top Bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
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
    marginBottom: 16,
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

  // Role Switcher Pill
  roleSwitcherRow: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    padding: 3,
    marginBottom: 20,
    gap: 4,
  },
  roleSwitchBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 11,
  },
  roleSwitchBtnActive: {
    backgroundColor: "#6366F1",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  roleSwitchText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  roleSwitchTextActive: {
    color: "#FFFFFF",
  },

  // Form Fields
  formBlock: {
    gap: 14,
  },
  inputGroup: {
    gap: 5,
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
  inputHelperText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#6366F1",
    marginTop: 2,
  },
  eyeBtn: {
    padding: 6,
  },

  // Terms Checkbox
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
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
  termsLabelText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "#475569",
  },

  // Button
  createBtn: {
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
  createBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
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
