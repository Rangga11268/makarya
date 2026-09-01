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
import { FONTS } from "../../theme/fonts";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import {
  Building2,
  Mail,
  Lock,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react-native";

export function RegisterScreen({ navigation }) {
  const [namaUsaha, setNamaUsaha] = useState("");
  const [bidangIndustri, setBidangIndustri] = useState("Kuliner & F&B");
  const [kota, setKota] = useState("");
  const [noKontak, setNoKontak] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { registerUmkm } = useAuthStore();
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
      showToast("Akun UMKM berhasil terdaftar!", "success");
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Pendaftaran gagal. Silakan coba lagi.",
        "danger",
      );
    } finally {
      setLoading(false);
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
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Image
          source={require("../../../assets/logo.webp")}
          style={styles.brandLogo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Daftar Akun UMKM</Text>
        <Text style={styles.subtitle}>
          Mulai pasang proyek digital dan temukan mahasiswa bertalenta untuk
          bisnis Anda.
        </Text>
      </View>

      <View style={styles.formContainer}>
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
          variant="lime"
          size="lg"
          onPress={handleRegister}
          loading={loading}
          iconRight={<ArrowRight size={18} color="#FFFFFF" />}
          style={styles.registerBtn}
        />

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Masuk di Sini</Text>
          </TouchableOpacity>
        </View>
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
    fontFamily: FONTS.bodyRegular,
    marginBottom: 20,
  },
  brandLogo: {
    width: 150,
    height: 46,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  title: {
    fontFamily: FONTS.displayBold,
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 6,
    lineHeight: 19,
  },
  formContainer: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  industryContainer: {
    marginBottom: 16,
  },
  label: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  industryScroll: {
    flexDirection: "row",
  },
  industryChip: {
    fontFamily: FONTS.bodyRegular,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginRight: 8,
  },
  industryChipActive: {
    fontFamily: FONTS.bodyRegular,
    backgroundColor: COLORS.brandIndigo,
    borderColor: COLORS.brandIndigo,
  },
  industryText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textMuted,
  },
  industryTextActive: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.textInverse,
    fontWeight: "800",
  },
  registerBtn: {
    marginTop: 8,
    backgroundColor: COLORS.brandIndigo,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  loginText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  loginLink: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.brandIndigo,
  },
});
