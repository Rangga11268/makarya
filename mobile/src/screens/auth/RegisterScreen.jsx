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
  Building2,
  Mail,
  Lock,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from "lucide-react-native";
import { styles } from "./RegisterScreen.styles";

export function RegisterScreen({ navigation }) {
  const [namaUsaha, setNamaUsaha] = useState("");
  const [bidangIndustri, setBidangIndustri] = useState("Kuliner & F&B");
  const [kota, setKota] = useState("");
  const [noKontak, setNoKontak] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { registerUmkm, loginWithGoogle } = useAuthStore();
  const { showToast } = useToastStore();

  const handleRegister = async () => {
    if (!namaUsaha.trim() || !email.trim() || !password.trim()) {
      showToast("Nama usaha, email, dan password wajib diisi", "danger");
      return;
    }

    try {
      setLoading(true);
      await registerUmkm({
        nama_usaha: namaUsaha.trim(),
        bidang_industri: bidangIndustri,
        kota: kota.trim() || "Bekasi",
        no_kontak: noKontak.trim() || "081234567890",
        email: email.trim(),
        password,
      });
      showToast("Kode verifikasi OTP telah dikirimkan!", "success");
      navigation.navigate("Verification", {
        email: email.trim(),
        role: "CLIENT_UMKM",
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
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={require("../../../assets/logo.webp")}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Daftar Akun UMKM</Text>
          <Text style={styles.subtitle}>
            Pasang proyek digital dan temukan mahasiswa bertalenta terbaik untuk bisnis Anda.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Input
            label="Nama Brand / Usaha UMKM"
            placeholder="Contoh: Kopi Nusantara"
            value={namaUsaha}
            onChangeText={setNamaUsaha}
            icon={<Building2 size={18} color={COLORS.textMuted} />}
          />

          {/* Bidang Industri Chips */}
          <View style={styles.industryContainer}>
            <Text style={styles.label}>Bidang Industri</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.industryScroll}
            >
              {industries.map((ind) => {
                const selected = bidangIndustri === ind;
                return (
                  <TouchableOpacity
                    key={ind}
                    onPress={() => setBidangIndustri(ind)}
                    style={[
                      styles.industryChip,
                      selected && styles.industryChipActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.industryText,
                        selected && styles.industryTextActive,
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
            placeholder="08123456789"
            value={noKontak}
            onChangeText={setNoKontak}
            keyboardType="phone-pad"
            icon={<Phone size={18} color={COLORS.textMuted} />}
          />

          <Input
            label="Email Resmi Akun"
            placeholder="kontak@usahaanda.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Mail size={18} color={COLORS.textMuted} />}
          />

          <Input
            label="Kata Sandi"
            placeholder="Minimal 6 karakter"
            value={password}
            onChangeText={setPassword}
            isPassword={true}
            icon={<Lock size={18} color={COLORS.textMuted} />}
          />

          <Button
            title="Buat Akun UMKM Baru"
            variant="brand"
            size="lg"
            onPress={handleRegister}
            loading={loading}
            iconRight={<ArrowRight size={18} color="#FFFFFF" />}
            style={styles.registerBtn}
          />

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
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

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Sudah memiliki akun Makarya? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.7}
          >
            <Text style={styles.loginLink}>Masuk di Sini</Text>
          </TouchableOpacity>
        </View>

        {/* Security Trust Footnote */}
        <View style={styles.securityBadge}>
          <ShieldCheck size={15} color={COLORS.brandIndigo} />
          <Text style={styles.securityText}>
            Pendaftaran aman, data terverifikasi, dan bebas biaya pendaftaran awal.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
