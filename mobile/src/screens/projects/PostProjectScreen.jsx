import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Header } from "../../components/ui/Header";
import { PricingSuggester } from "../../components/features/PricingSuggester";
import { projectApi } from "../../api";
import { useToastStore } from "../../store/toastStore";
import {
  ShieldCheck,
  Calendar,
  Sparkles,
  Palette,
  Smartphone,
  Code2,
  Video,
  PenTool,
  FileSpreadsheet,
} from "lucide-react-native";

export function PostProjectScreen({ navigation }) {
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("DESIGN");
  const [deskripsi, setDeskripsi] = useState("");
  const [budgetMax, setBudgetMax] = useState("300000");
  const [deadline, setDeadline] = useState("2026-09-30");
  const [loading, setLoading] = useState(false);

  const { showToast } = useToastStore();

  const categories = [
    { code: "DESIGN", label: "Desain & Logo", Icon: Palette },
    { code: "UIUX", label: "UI/UX App", Icon: Smartphone },
    { code: "PEMROGRAMAN", label: "Web & Coding", Icon: Code2 },
    { code: "VIDEO", label: "Video Reels", Icon: Video },
    { code: "COPYWRITING", label: "Copywriting", Icon: PenTool },
    { code: "ADMIN_DATA", label: "Admin Data", Icon: FileSpreadsheet },
  ];

  const handlePost = async () => {
    if (!judul.trim() || !deskripsi.trim() || !budgetMax) {
      showToast("Judul, deskripsi, dan budget wajib diisi", "danger");
      return;
    }

    const numBudget = parseInt(budgetMax, 10);
    if (numBudget > 2000000) {
      showToast("Batas maksimal anggaran proyek adalah Rp 2.000.000", "danger");
      return;
    }

    try {
      setLoading(true);
      await projectApi.create({
        judul: judul.trim(),
        deskripsi_raw: deskripsi.trim(),
        kategori,
        budget_max: numBudget,
        deadline,
      });

      showToast("Proyek berhasil diterbitkan!", "success");
      navigation.navigate("ProjectsTab");
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Gagal menerbitkan proyek",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Pasang Proyek UMKM"
        subtitle="Dapatkan penawaran proposal dari mahasiswa kampus"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Kategori Selector Pills */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Pilih Kategori Keahlian</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesRow}
          >
            {categories.map((c) => {
              const selected = kategori === c.code;
              const IconComp = c.Icon;
              return (
                <TouchableOpacity
                  key={c.code}
                  onPress={() => setKategori(c.code)}
                  style={[
                    styles.categoryChip,
                    selected && styles.categoryChipActive,
                  ]}
                  activeOpacity={0.75}
                >
                  <IconComp
                    size={14}
                    color={selected ? "#FFFFFF" : COLORS.brandIndigo}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      selected && styles.categoryTextActive,
                    ]}
                  >
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Inputs */}
        <Input
          label="Judul Kebutuhan Proyek"
          placeholder="Contoh: Desain Kemasan Botol Kopi & Logo Stiker"
          value={judul}
          onChangeText={setJudul}
        />

        <Input
          label="Deskripsi Rincian Brief"
          placeholder="Tuliskan kebutuhan Anda: konsep warna, jumlah revisi, referensi gaya, dan output file yang diinginkan..."
          value={deskripsi}
          onChangeText={setDeskripsi}
          multiline
          numberOfLines={4}
        />

        <Input
          label="Maksimal Anggaran (Maks Rp 2.000.000)"
          placeholder="300000"
          value={budgetMax}
          onChangeText={setBudgetMax}
          keyboardType="numeric"
        />

        {/* Smart Pricing Suggester */}
        <PricingSuggester category={kategori} budget={budgetMax} />

        <Input
          label="Tenggat Waktu Pengerjaan (YYYY-MM-DD)"
          placeholder="2026-09-30"
          value={deadline}
          onChangeText={setDeadline}
          icon={<Calendar size={18} color={COLORS.textMuted} />}
        />

        {/* Escrow Guarantee Seal */}
        <View style={styles.guaranteeBox}>
          <ShieldCheck size={18} color={COLORS.brandCyan} />
          <Text style={styles.guaranteeText}>
            Dana proyek Anda hanya akan dikunci di rekening bersama (escrow)
            saat Anda menyetujui salah satu proposal mahasiswa.
          </Text>
        </View>

        <Button
          title="Terbitkan Proyek Sekarang"
          variant="brand"
          size="lg"
          onPress={handlePost}
          loading={loading}
          style={styles.submitBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    padding: 16,
    paddingBottom: 60,
  },
  formSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  categoriesRow: {
    flexDirection: "row",
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginRight: 8,
    ...SHADOWS.sm,
  },
  categoryChipActive: {
    backgroundColor: COLORS.brandIndigo,
    borderColor: COLORS.brandIndigo,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  guaranteeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.bgSurface,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 20,
    ...SHADOWS.sm,
  },
  guaranteeText: {
    fontSize: 11,
    color: COLORS.textMuted,
    flex: 1,
    lineHeight: 16,
    fontWeight: "500",
  },
  submitBtn: {
    marginBottom: 20,
  },
});
