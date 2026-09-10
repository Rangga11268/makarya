import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { FONTS } from "../../theme/fonts";
import { COLORS, SHADOWS } from "../../theme/colors";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { CurrencyInput } from "../../components/ui/CurrencyInput";
import { DatePickerInput } from "../../components/ui/DatePickerInput";
import { Header } from "../../components/ui/Header";
import { PricingSuggester } from "../../components/features/PricingSuggester";
import { CategoryChip } from "../../components/ui/CategoryChip";
import { CATEGORIES } from "../../constants/categories";
import { projectApi } from "../../api";
import { useToastStore } from "../../store/toastStore";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  ShieldCheck,
  Users,
  User,
  Plus,
  Trash2,
  AlertTriangle,
  Layers,
  CheckCircle2,
} from "lucide-react-native";

export function PostProjectScreen({ navigation }) {
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("DESIGN");
  const [deskripsi, setDeskripsi] = useState("");
  const [budgetMax, setBudgetMax] = useState("300000");
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
  );
  const [loading, setLoading] = useState(false);

  // Model Kolaborasi: INDIVIDU vs TIM
  const [tipeKolaborasi, setTipeKolaborasi] = useState("INDIVIDU");
  const [slots, setSlots] = useState([
    {
      nama_peran: "UI/UX Designer",
      deskripsi_tugas: "Rancang wireframe & prototype di Figma",
      alokasi_budget: "150000",
    },
    {
      nama_peran: "Frontend Developer",
      deskripsi_tugas: "Implementasi antarmuka responsive",
      alokasi_budget: "150000",
    },
  ]);

  const { showToast } = useToastStore();

  const selectableCategories = CATEGORIES.filter((c) => c.id !== "ALL");

  const handleAddSlot = () => {
    if (slots.length >= 5) {
      showToast("Maksimal 5 peran dalam satu proyek tim", "danger");
      return;
    }
    setSlots((prev) => [
      ...prev,
      { nama_peran: "", deskripsi_tugas: "", alokasi_budget: "" },
    ]);
  };

  const handleRemoveSlot = (index) => {
    if (slots.length <= 1) {
      showToast("Proyek tim harus memiliki minimal 1 formasi peran", "danger");
      return;
    }
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSlot = (index, field, value) => {
    setSlots((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  const totalSlotBudget = slots.reduce(
    (acc, s) => acc + (parseInt(s.alokasi_budget, 10) || 0),
    0,
  );

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

    if (tipeKolaborasi === "TIM") {
      if (slots.length === 0) {
        showToast("Proyek tim membutuhkan minimal 1 formasi peran", "danger");
        return;
      }
      for (let i = 0; i < slots.length; i++) {
        if (!slots[i].nama_peran.trim()) {
          showToast(`Nama peran pada Posisi #${i + 1} wajib diisi`, "danger");
          return;
        }
        const b = parseInt(slots[i].alokasi_budget, 10) || 0;
        if (b <= 0) {
          showToast(
            `Alokasi honor pada Posisi #${i + 1} harus lebih dari 0`,
            "danger",
          );
          return;
        }
      }
      if (totalSlotBudget > numBudget) {
        showToast(
          `Total alokasi peran (${formatCurrency(
            totalSlotBudget,
          )}) melebihi pagu proyek (${formatCurrency(numBudget)})`,
          "danger",
        );
        return;
      }
    }

    try {
      setLoading(true);
      await projectApi.create({
        judul: judul.trim(),
        deskripsi_raw: deskripsi.trim(),
        kategori,
        budget_max: numBudget,
        deadline,
        tipe_kolaborasi: tipeKolaborasi,
        slots:
          tipeKolaborasi === "TIM"
            ? slots.map((s) => ({
                nama_peran: s.nama_peran.trim(),
                deskripsi_tugas: s.deskripsi_tugas.trim() || undefined,
                alokasi_budget: parseInt(s.alokasi_budget, 10) || 0,
              }))
            : undefined,
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header
        category="PASANG PROYEK"
        title="Pasang Proyek UMKM"
        subtitle="Dapatkan penawaran proposal dari mahasiswa kampus"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
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
            {selectableCategories.map((c) => (
              <CategoryChip
                key={c.code}
                category={c}
                isSelected={kategori === c.code}
                onPress={() => setKategori(c.code)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Inputs */}
        <Input
          label="Judul Kebutuhan Proyek"
          placeholder="Contoh: Desain Kemasan Botol Kopi & Logo Stiker"
          value={judul}
          onChangeText={setJudul}
          required
        />

        <Input
          label="Deskripsi Rincian Brief"
          placeholder="Tuliskan kebutuhan Anda: konsep warna, jumlah revisi, referensi gaya, dan output file yang diinginkan..."
          value={deskripsi}
          onChangeText={setDeskripsi}
          multiline
          numberOfLines={4}
          required
        />

        <CurrencyInput
          label="Maksimal Anggaran Honor"
          placeholder="300.000"
          value={budgetMax}
          onChangeValue={(val) => setBudgetMax(String(val))}
          quickNominals={[100000, 250000, 500000, 1000000, 2000000]}
          helperText="Maksimal anggaran proyek platform: Rp 2.000.000"
          required
        />

        {/* Smart Pricing Suggester */}
        <PricingSuggester category={kategori} budget={budgetMax} />

        {/* Mode Kolaborasi: Individu vs Tim Multi-Talenta */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Model Penugasan & Kolaborasi</Text>
          <View style={styles.collabToggleContainer}>
            <TouchableOpacity
              style={[
                styles.collabToggleBtn,
                tipeKolaborasi === "INDIVIDU" && styles.collabToggleBtnActive,
              ]}
              onPress={() => setTipeKolaborasi("INDIVIDU")}
              activeOpacity={0.85}
            >
              <User
                size={16}
                color={
                  tipeKolaborasi === "INDIVIDU" ? "#FFFFFF" : COLORS.textMuted
                }
              />
              <Text
                style={[
                  styles.collabToggleText,
                  tipeKolaborasi === "INDIVIDU" && styles.collabToggleTextActive,
                ]}
              >
                Individu (1 Orang)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.collabToggleBtn,
                tipeKolaborasi === "TIM" && styles.collabToggleBtnActive,
              ]}
              onPress={() => setTipeKolaborasi("TIM")}
              activeOpacity={0.85}
            >
              <Users
                size={16}
                color={tipeKolaborasi === "TIM" ? "#FFFFFF" : COLORS.textMuted}
              />
              <Text
                style={[
                  styles.collabToggleText,
                  tipeKolaborasi === "TIM" && styles.collabToggleTextActive,
                ]}
              >
                Tim Multi-Talenta
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Slot Builder for Team Projects */}
        {tipeKolaborasi === "TIM" && (
          <View style={styles.teamSectionCard}>
            <View style={styles.teamSectionHeader}>
              <View style={styles.teamHeaderIcon}>
                <Layers size={16} color={COLORS.brandIndigo} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.teamSectionTitle}>
                  Formasi Peran & Pembagian Tugas
                </Text>
                <Text style={styles.teamSectionSub}>
                  Tentukan posisi keahlian dan alokasi honor untuk tiap talenta
                </Text>
              </View>
            </View>

            {/* Slots List */}
            {slots.map((s, idx) => (
              <View key={idx} style={styles.slotItemCard}>
                <View style={styles.slotItemHeader}>
                  <Text style={styles.slotItemNumber}>Posisi #{idx + 1}</Text>
                  {slots.length > 1 && (
                    <TouchableOpacity
                      onPress={() => handleRemoveSlot(idx)}
                      style={styles.slotRemoveBtn}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Trash2 size={13} color="#DC2626" />
                      <Text style={styles.slotRemoveText}>Hapus Posisi</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Input
                  label="Nama Peran / Posisi"
                  placeholder="Contoh: UI/UX Designer, Frontend Developer"
                  value={s.nama_peran}
                  onChangeText={(val) =>
                    handleUpdateSlot(idx, "nama_peran", val)
                  }
                  required
                />

                <Input
                  label="Rincian Tugas Peran"
                  placeholder="Contoh: Rancang mockup Figma dan desain kemasan"
                  value={s.deskripsi_tugas}
                  onChangeText={(val) =>
                    handleUpdateSlot(idx, "deskripsi_tugas", val)
                  }
                />

                <CurrencyInput
                  label="Pagu Honor Peran"
                  placeholder="150.000"
                  value={s.alokasi_budget}
                  onChangeValue={(val) =>
                    handleUpdateSlot(idx, "alokasi_budget", String(val))
                  }
                  required
                />
              </View>
            ))}

            {/* Add Slot Button */}
            {slots.length < 5 && (
              <TouchableOpacity
                style={styles.addSlotBtn}
                onPress={handleAddSlot}
                activeOpacity={0.8}
              >
                <Plus size={15} color={COLORS.brandIndigo} />
                <Text style={styles.addSlotBtnText}>
                  + Tambah Posisi / Peran Tim
                </Text>
              </TouchableOpacity>
            )}

            {/* Allocation Summary Box */}
            <View
              style={[
                styles.slotSummaryBox,
                totalSlotBudget > parseInt(budgetMax, 10) &&
                  styles.slotSummaryBoxError,
              ]}
            >
              <View style={styles.slotSummaryRow}>
                <Text style={styles.slotSummaryLabel}>Total Alokasi Tim:</Text>
                <Text
                  style={[
                    styles.slotSummaryValue,
                    totalSlotBudget > parseInt(budgetMax, 10) &&
                      styles.slotSummaryValueError,
                  ]}
                >
                  {formatCurrency(totalSlotBudget)}
                </Text>
              </View>
              <View style={styles.slotSummaryRow}>
                <Text style={styles.slotSummaryLabel}>
                  Pagu Anggaran Proyek:
                </Text>
                <Text style={styles.slotSummaryValue}>
                  {formatCurrency(parseInt(budgetMax, 10) || 0)}
                </Text>
              </View>
              {totalSlotBudget > parseInt(budgetMax, 10) ? (
                <View style={styles.slotSummaryAlertRow}>
                  <AlertTriangle size={13} color="#DC2626" />
                  <Text style={styles.slotSummaryAlertText}>
                    Total alokasi peran melebihi anggaran maksimal proyek.
                  </Text>
                </View>
              ) : (
                <View style={styles.slotSummarySuccessRow}>
                  <CheckCircle2 size={13} color="#059669" />
                  <Text style={styles.slotSummarySuccessText}>
                    Alokasi anggaran tim valid & sesuai pagu.
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        <DatePickerInput
          label="Tenggat Waktu Pengerjaan (Batas Deadline)"
          value={deadline}
          onChangeDate={setDeadline}
          helperText="Pilih waktu yang realistis agar mahasiswa menghasilkan karya berkualitas."
          required
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
          disabled={
            tipeKolaborasi === "TIM" &&
            totalSlotBudget > parseInt(budgetMax, 10)
          }
          style={styles.submitBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
    fontFamily: FONTS.bodyBold,
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
    fontFamily: FONTS.bodyRegular,
    backgroundColor: COLORS.brandIndigo,
    borderColor: COLORS.brandIndigo,
  },
  categoryText: {
    fontFamily: FONTS.bodyBold,
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
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textMuted,
    flex: 1,
    lineHeight: 16,
    fontWeight: "500",
  },
  submitBtn: {
    marginBottom: 20,
  },
  collabToggleContainer: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: COLORS.bgSurface,
    padding: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  collabToggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  collabToggleBtnActive: {
    backgroundColor: COLORS.brandIndigo,
    ...SHADOWS.sm,
  },
  collabToggleText: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textMuted,
  },
  collabToggleTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  teamSectionCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 16,
    ...SHADOWS.sm,
  },
  teamSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  teamHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  teamSectionTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  teamSectionSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
  },
  slotItemCard: {
    backgroundColor: COLORS.bgDark,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 10,
  },
  slotItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  slotItemNumber: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  slotRemoveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "#FEE2E2",
  },
  slotRemoveText: {
    fontFamily: FONTS.displayBold,
    fontSize: 10,
    color: "#DC2626",
  },
  addSlotBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: COLORS.brandIndigo,
    backgroundColor: "#EEF2FF",
    marginBottom: 14,
  },
  addSlotBtnText: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.brandIndigo,
  },
  slotSummaryBox: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    gap: 6,
  },
  slotSummaryBoxError: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  slotSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  slotSummaryLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  slotSummaryValue: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  slotSummaryValueError: {
    color: "#DC2626",
  },
  slotSummaryAlertRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#FECACA",
  },
  slotSummaryAlertText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "#DC2626",
    flex: 1,
  },
  slotSummarySuccessRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#BBF7D0",
  },
  slotSummarySuccessText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: "#166534",
    flex: 1,
  },
});
