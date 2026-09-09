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
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { GoogleIcon } from "../../components/icons/GoogleIcon";
import { initiateGoogleSignIn } from "../../services/googleAuth";
import {
  Building2,
  Mail,
  Lock,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  User,
  GraduationCap,
} from "lucide-react-native";
import { styles as s } from "./LoginScreen.styles"; // Reuse base layout logic

const { height } = Dimensions.get("window");

export function RegisterScreen({ navigation }) {
  const [role, setRole] = useState("UMKM"); // Default mobile = UMKM
  const [namaLengkap, setNamaLengkap] = useState("");
  const [nim, setNim] = useState("");

  const [namaUsaha, setNamaUsaha] = useState("");
  const [bidangIndustri, setBidangIndustri] = useState("Kuliner & F&B");
  const [kota, setKota] = useState("");
  const [noKontak, setNoKontak] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { registerUmkm, registerMhs, loginWithGoogle } = useAuthStore();
  const { showToast } = useToastStore();

  const handleRegister = async () => {
    if (role === "UMKM") {
      if (!namaUsaha.trim() || !email.trim() || !password.trim()) {
        showToast("Nama usaha, email, dan password wajib diisi", "danger");
        return;
      }
    } else {
      if (
        !namaLengkap.trim() ||
        !nim.trim() ||
        !email.trim() ||
        !password.trim()
      ) {
        showToast(
          "Nama lengkap, NIM, email, dan password wajib diisi",
          "danger",
        );
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
    }

    try {
      setLoading(true);
      if (role === "UMKM") {
        await registerUmkm({
          nama_usaha: namaUsaha.trim(),
          bidang_industri: bidangIndustri,
          kota: kota.trim() || "Bekasi",
          no_kontak: noKontak.trim() || "081234567890",
          email: email.trim(),
          password,
        });
      } else {
        await registerMhs({
          nama_lengkap: namaLengkap.trim(),
          nim: nim.trim(),
          prodi_id: 1,
          email: email.trim(),
          password,
        });
      }

      showToast("Kode verifikasi OTP telah dikirimkan!", "success");
      navigation.navigate("Verification", {
        email: email.trim(),
        role: role === "UMKM" ? "CLIENT_UMKM" : "MAHASISWA",
      });
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Pendaftaran gagal. Silakan coba lagi.",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setGoogleLoading(true);
      const googleUser = await initiateGoogleSignIn();
      await loginWithGoogle({
        id_token: googleUser.idToken,
        email: googleUser.email,
        name: googleUser.name,
        avatar_url: googleUser.avatarUrl,
      });
      showToast("Pendaftaran Google berhasil!", "success");
    } catch (err) {
      if (err.message?.includes("dibatalkan")) return;
      console.warn("Google registration error:", err);
      showToast(
        err.response?.data?.detail || "Gagal mendaftar dengan Google",
        "danger",
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const industries = [
    "Kuliner & F&B",
    "Fashion & Retail",
    "Jasa & Layanan",
    "Teknologi",
    "Kerajinan & Kriya",
  ];

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
          source={require("../../../assets/register_hero.jpg")}
          style={s.heroImage}
          resizeMode="cover"
        />
        <View style={s.heroOverlay} />

        <View style={s.heroContent}>
          <View style={s.heroBadge}>
            <ShieldCheck size={11} color="#6EE7B7" />
            <Text style={s.heroBadgeText}>
              {role === "UMKM"
                ? "Akses Talenta Kampus Terverifikasi"
                : "Eksklusif Mahasiswa Kampus"}
            </Text>
          </View>

          <Text style={s.welcomeText}>
            {role === "UMKM" ? "Daftar Akun UMKM" : "Daftar Akun Mahasiswa"}
          </Text>
          <Text style={s.subtitle}>
            {role === "UMKM"
              ? "Pasang proyek dan temukan mahasiswa bertalenta terbaik untuk bisnis Anda."
              : "Dapatkan proyek berbayar, validasi keterampilan, dan bangun portofolio impian."}
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
          {/* Role Switcher Segment */}
          <View style={s.roleSelectorWrapper}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setRole("UMKM")}
              style={[s.roleTabItem, role === "UMKM" && s.roleTabItemActive]}
            >
              <Building2
                size={16}
                color={role === "UMKM" ? "#0F172A" : "#64748B"}
              />
              <Text
                style={[s.roleTabText, role === "UMKM" && s.roleTabTextActive]}
              >
                Pelaku UMKM
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setRole("MAHASISWA")}
              style={[
                s.roleTabItem,
                role === "MAHASISWA" && s.roleTabItemActive,
              ]}
            >
              <GraduationCap
                size={16}
                color={role === "MAHASISWA" ? "#0F172A" : "#64748B"}
              />
              <Text
                style={[
                  s.roleTabText,
                  role === "MAHASISWA" && s.roleTabTextActive,
                ]}
              >
                Mahasiswa
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Input Area */}
          <View style={s.formArea}>
            {role === "UMKM" ? (
              <>
                <Input
                  label="Nama Brand / Usaha UMKM"
                  placeholder="Contoh: Kopi Nusantara"
                  value={namaUsaha}
                  onChangeText={setNamaUsaha}
                  icon={<Building2 size={18} color={COLORS.textMuted} />}
                />

                {/* Bidang Industri Chips */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.bodyMedium,
                      fontSize: 12,
                      color: COLORS.textDark,
                      marginBottom: 8,
                    }}
                  >
                    Bidang Industri
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexDirection: "row" }}
                  >
                    {industries.map((ind) => {
                      const selected = bidangIndustri === ind;
                      return (
                        <TouchableOpacity
                          key={ind}
                          onPress={() => setBidangIndustri(ind)}
                          style={[
                            {
                              paddingHorizontal: 14,
                              paddingVertical: 7,
                              borderRadius: 999,
                              backgroundColor: "#F1F5F9",
                              borderWidth: 1,
                              borderColor: "#E2E8F0",
                              marginRight: 8,
                            },
                            selected && {
                              backgroundColor: COLORS.brandIndigo,
                              borderColor: COLORS.brandIndigo,
                            },
                          ]}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              {
                                fontFamily: FONTS.bodyMedium,
                                fontSize: 12,
                                color: "#64748B",
                              },
                              selected && {
                                fontFamily: FONTS.bodyBold,
                                color: "#FFFFFF",
                              },
                            ]}
                          >
                            {ind}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                <Input
                  label="Kota / Lokasi Usaha"
                  placeholder="Contoh: Bekasi"
                  value={kota}
                  onChangeText={setKota}
                  icon={<MapPin size={18} color={COLORS.textMuted} />}
                />

                <Input
                  label="Nomor WhatsApp"
                  placeholder="Contoh: 081234567890"
                  value={noKontak}
                  onChangeText={setNoKontak}
                  keyboardType="phone-pad"
                  icon={<Phone size={18} color={COLORS.textMuted} />}
                />

                <Input
                  label="Email Resmi Akun"
                  placeholder="Contoh: kontak@usahaanda.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={<Mail size={18} color={COLORS.textMuted} />}
                />

                <Input
                  label="Kata Sandi"
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChangeText={setPassword}
                  isPassword={true}
                  icon={<Lock size={18} color={COLORS.textMuted} />}
                />
              </>
            ) : (
              <>
                <Input
                  label="Nama Lengkap Mahasiswa"
                  placeholder="Contoh: Darell Radhitya"
                  value={namaLengkap}
                  onChangeText={setNamaLengkap}
                  icon={<User size={18} color={COLORS.textMuted} />}
                />

                <Input
                  label="NIM (Nomor Induk Mahasiswa)"
                  placeholder="Contoh: 12201088"
                  value={nim}
                  onChangeText={setNim}
                  keyboardType="numeric"
                  icon={<GraduationCap size={18} color={COLORS.textMuted} />}
                />

                <Input
                  label="Email Kampus Resmi"
                  placeholder="Contoh: darell@ubsi.ac.id"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  helperText="Wajib berakhiran .ac.id atau .edu untuk verifikasi status mahasiswa"
                  icon={<Mail size={18} color={COLORS.textMuted} />}
                />

                <Input
                  label="Kata Sandi"
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChangeText={setPassword}
                  isPassword={true}
                  icon={<Lock size={18} color={COLORS.textMuted} />}
                />
              </>
            )}

            <Button
              title={
                role === "UMKM"
                  ? "Buat Akun UMKM Baru"
                  : "Daftar Sebagai Mahasiswa"
              }
              variant="brand"
              size="lg"
              onPress={handleRegister}
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

            {/* Google Sign Up Button */}
            <Button
              title="Daftar Cepat dengan Google"
              variant="google"
              size="lg"
              onPress={handleGoogleRegister}
              loading={googleLoading}
              disabled={loading}
              icon={<GoogleIcon size={18} />}
            />
          </View>

          {/* Login footer link */}
          <View style={s.registerRow}>
            <Text style={s.registerText}>Sudah memiliki akun Makarya? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.7}
            >
              <Text style={s.registerLink}>Masuk di Sini</Text>
            </TouchableOpacity>
          </View>

          {/* Security Trust Badge */}
          <View style={[s.securityBadge, { marginTop: 10 }]}>
            <ShieldCheck size={14} color={COLORS.brandIndigo} />
            <Text style={s.securityText}>
              Pendaftaran Gratis • Verifikasi Otomatis • Keamanan Data Terjamin
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
