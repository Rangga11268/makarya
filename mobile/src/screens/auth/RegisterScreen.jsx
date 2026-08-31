import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { COLORS } from "../../theme/colors";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { Building2, Mail, Lock, Phone, MapPin } from "lucide-react-native";

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
      showToast(err.response?.data?.detail || "Pendaftaran gagal. Silakan coba lagi.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const industries = ["Kuliner & F&B", "Fashion & Retail", "Jasa & Layanan", "Teknologi", "Kerajinan & Kriya"];

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>Daftar Akun UMKM</Text>
        <Text style={styles.subtitle}>
          Mulai pasang proyek digital dan temukan mahasiswa berbakat untuk bisnis Anda.
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.industryScroll}>
            {industries.map((ind) => {
              const selected = bidangIndustri === ind;
              return (
                <TouchableOpacity
                  key={ind}
                  onPress={() => setBidangIndustri(ind)}
                  style={[styles.industryChip, selected && styles.industryChipActive]}
                >
                  <Text style={[styles.industryText, selected && styles.industryTextActive]}>
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
          secureTextEntry
          icon={<Lock size={18} color={COLORS.textMuted} />}
        />

        <Button
          title="Buat Akun UMKM Baru"
          variant="lime"
          size="lg"
          onPress={handleRegister}
          loading={loading}
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
    backgroundColor: COLORS.bgDark,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.textWhite,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 6,
    lineHeight: 19,
  },
  formContainer: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  industryContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textWhite,
    marginBottom: 8,
  },
  industryScroll: {
    flexDirection: "row",
  },
  industryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.cardDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginRight: 8,
  },
  industryChipActive: {
    backgroundColor: COLORS.accentLime,
    borderColor: COLORS.accentLime,
  },
  industryText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textMuted,
  },
  industryTextActive: {
    color: COLORS.textDark,
    fontWeight: "800",
  },
  registerBtn: {
    marginTop: 8,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  loginText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  loginLink: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.accentLime,
  },
});