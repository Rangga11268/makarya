import React, { useState, useRef } from "react";
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
import { OrganicRibbonBackground } from "../../components/ui/OrganicRibbonBackground";
import { PricingSuggester } from "../../components/features/PricingSuggester";
import { CategoryChip } from "../../components/ui/CategoryChip";
import { CATEGORIES } from "../../constants/categories";
import { ProjectCard } from "../../components/features/ProjectCard";
import { projectApi } from "../../api";
import { useToastStore } from "../../store/toastStore";
import { useAuthStore } from "../../store/authStore";
import { showConfirm } from "../../store/dialogStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import {
  ShieldCheck,
  Users,
  User,
  Plus,
  Trash2,
  AlertTriangle,
  Layers,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Check,
  Eye,
  DollarSign,
} from "lucide-react-native";

const STEPS = [
  { id: 1, title: "Brief Kebutuhan" },
  { id: 2, title: "Anggaran & Tim" },
  { id: 3, title: "Pratinjau" },
];

export function PostProjectScreen({ navigation }) {
  const scrollViewRef = useRef(null);
  const { user } = useAuthStore();
  const { showToast } = useToastStore();

  // Multi-step state: 1, 2, 3
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("DESIGN");
  const [deskripsi, setDeskripsi] = useState("");
  const [budgetMax, setBudgetMax] = useState("300000");
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
  );

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

  const numBudget = parseInt(budgetMax, 10) || 0;

  // Navigation between steps
  const goToStep = (step) => {
    setCurrentStep(step);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleStep1Next = () => {
    if (!judul.trim()) {
      showToast("Judul proyek wajib diisi", "danger");
      return;
    }
    if (judul.trim().length < 5) {
      showToast("Judul proyek minimal 5 karakter", "danger");
      return;
    }
    if (!deskripsi.trim()) {
      showToast("Deskripsi rincian brief wajib diisi", "danger");
      return;
    }
    if (deskripsi.trim().length < 15) {
      showToast("Ceritakan kebutuhan minimal 15 karakter agar jelas", "danger");
      return;
    }
    goToStep(2);
  };

  const handleStep2Next = () => {
    if (!budgetMax || numBudget <= 0) {
      showToast("Maksimal anggaran honor wajib diisi", "danger");
      return;
    }
    if (numBudget < 50000) {
      showToast("Batas minimal anggaran proyek adalah Rp 50.000", "danger");
      return;
    }
    if (numBudget > 2000000) {
      showToast("Batas maksimal anggaran proyek adalah Rp 2.000.000", "danger");
      return;
    }
    if (!deadline) {
      showToast("Tenggat waktu deadline wajib ditentukan", "danger");
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

    goToStep(3);
  };

  const handlePost = async () => {
    if (!user?.no_kontak) {
      showConfirm({
        title: "Lengkapi Kontak Bisnis",
        message:
          "Tambahkan nomor WhatsApp bisnis Anda di menu Profil terlebih dahulu agar mahasiswa dapat berkoordinasi saat proyek berjalan.",
        confirmText: "Lengkapi Sekarang",
        cancelText: "Nanti Saja",
        onConfirm: () => navigation.navigate("ProfileTab"),
      });
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

      showToast("Selamat! Proyek berhasil diterbitkan", "success");
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

  // Simulated project object for live preview
  const previewProject = {
    id: "preview-mock-id",
    judul: judul.trim() || "Judul Proyek UMKM Anda",
    kategori,
    deskripsi_raw: deskripsi.trim() || "Belum ada rincian brief.",
    budget_max: numBudget || 300000,
    deadline,
    tipe_kolaborasi: tipeKolaborasi,
    total_slots: tipeKolaborasi === "TIM" ? slots.length : 1,
    filled_slots: 0,
    status: "OPEN",
    umkm_nama:
      user?.umkm_profile?.nama_usaha || user?.nama_lengkap || "Usaha Anda",
    client_name:
      user?.umkm_profile?.nama_usaha || user?.nama_lengkap || "Usaha Anda",
    created_at: new Date().toISOString(),
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <OrganicRibbonBackground height={360} />
      <Header
        category="PASANG PROYEK"
        title="Pasang Proyek UMKM"
        subtitle={`Langkah ${currentStep} dari 3: ${STEPS[currentStep - 1].title}`}
        onBack={() => {
          if (currentStep > 1) {
            goToStep(currentStep - 1);
          } else {
            navigation.goBack();
          }
        }}
      />

      {/* Step Tracker Indicator */}
      <View style={styles.stepTrackerContainer}>
        {STEPS.map((s, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;

          return (
            <React.Fragment key={s.id}>
              {idx > 0 && (
                <View
                  style={[
                    styles.stepConnector,
                    currentStep >= stepNum && styles.stepConnectorActive,
                  ]}
                />
              )}
              <TouchableOpacity
                onPress={() => {
                  if (isCompleted) goToStep(stepNum);
                }}
                disabled={!isCompleted}
                style={styles.stepItem}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.stepBadge,
                    isActive && styles.stepBadgeActive,
                    isCompleted && styles.stepBadgeCompleted,
                  ]}
                >
                  {isCompleted ? (
                    <Check size={13} color="#FFFFFF" strokeWidth={3} />
                  ) : (
                    <Text
                      style={[
                        styles.stepBadgeText,
                        isActive && styles.stepBadgeTextActive,
                      ]}
                    >
                      {stepNum}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isActive && styles.stepLabelActive,
                    isCompleted && styles.stepLabelCompleted,
                  ]}
                  numberOfLines={1}
                >
                  {s.title}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {/* ==================== STEP 1: BRIEF KEBUTUHAN ==================== */}
        {currentStep === 1 && (
          <View>
            <View style={styles.stepIntroCard}>
              <FileText size={18} color={COLORS.brandIndigo} />
              <View style={{ flex: 1 }}>
                <Text style={styles.stepIntroTitle}>
                  Informasi & Brief Kebutuhan
                </Text>
                <Text style={styles.stepIntroSub}>
                  Pilih bidang keahlian yang dibutuhkan serta jelaskan
                  ekspektasi hasil kerja.
                </Text>
              </View>
            </View>

            {/* Kategori Selector */}
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

            {/* Judul Input */}
            <Input
              label="Judul Kebutuhan Proyek"
              placeholder="Contoh: Desain Kemasan Botol Kopi & Logo Stiker"
              value={judul}
              onChangeText={setJudul}
              helperText="Tuliskan judul singkat yang langsung mendeskripsikan kebutuhan."
              required
            />

            {/* Deskripsi Brief Input */}
            <Input
              label="Deskripsi Rincian Brief"
              placeholder="Tuliskan kebutuhan Anda: konsep warna, jumlah revisi, referensi gaya, dan output file yang diinginkan..."
              value={deskripsi}
              onChangeText={setDeskripsi}
              multiline
              numberOfLines={5}
              helperText="Semakin detail brief Anda, semakin akurat proposal penawaran mahasiswa."
              required
            />

            {/* Next Button */}
            <Button
              title="Lanjut ke Anggaran & Tim"
              variant="brand"
              size="lg"
              iconRight={<ArrowRight size={18} color="#FFFFFF" />}
              onPress={handleStep1Next}
              style={styles.stepNextBtn}
            />
          </View>
        )}

        {/* ==================== STEP 2: ANGGARAN & TIM ==================== */}
        {currentStep === 2 && (
          <View>
            <View style={styles.stepIntroCard}>
              <DollarSign size={18} color={COLORS.brandIndigo} />
              <View style={{ flex: 1 }}>
                <Text style={styles.stepIntroTitle}>
                  Alokasi Anggaran & Formasi Tim
                </Text>
                <Text style={styles.stepIntroSub}>
                  Tentukan pagu honor dan sesuaikan apakah proyek ini untuk 1
                  orang atau tim multi-talenta.
                </Text>
              </View>
            </View>

            {/* Currency Input */}
            <CurrencyInput
              label="Maksimal Anggaran Honor"
              placeholder="300.000"
              value={budgetMax}
              onChangeValue={(val) => setBudgetMax(String(val))}
              quickNominals={[100000, 250000, 500000, 1000000, 2000000]}
              helperText="Pagu anggaran proyek platform: Rp 50.000 - Rp 2.000.000"
              required
            />

            {/* Smart Pricing Suggester */}
            <PricingSuggester category={kategori} budget={budgetMax} />

            {/* Mode Kolaborasi: Individu vs Tim Multi-Talenta */}
            <View style={styles.formSection}>
              <Text style={styles.sectionLabel}>
                Model Penugasan & Kolaborasi
              </Text>
              <View style={styles.collabToggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.collabToggleBtn,
                    tipeKolaborasi === "INDIVIDU" &&
                      styles.collabToggleBtnActive,
                  ]}
                  onPress={() => setTipeKolaborasi("INDIVIDU")}
                  activeOpacity={0.85}
                >
                  <User
                    size={16}
                    color={
                      tipeKolaborasi === "INDIVIDU"
                        ? "#FFFFFF"
                        : COLORS.textMuted
                    }
                  />
                  <Text
                    style={[
                      styles.collabToggleText,
                      tipeKolaborasi === "INDIVIDU" &&
                        styles.collabToggleTextActive,
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
                    color={
                      tipeKolaborasi === "TIM" ? "#FFFFFF" : COLORS.textMuted
                    }
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
                      Tentukan posisi keahlian dan alokasi honor untuk tiap
                      talenta
                    </Text>
                  </View>
                </View>

                {/* Slots List */}
                {slots.map((s, idx) => (
                  <View key={idx} style={styles.slotItemCard}>
                    <View style={styles.slotItemHeader}>
                      <Text style={styles.slotItemNumber}>
                        Posisi #{idx + 1}
                      </Text>
                      {slots.length > 1 && (
                        <TouchableOpacity
                          onPress={() => handleRemoveSlot(idx)}
                          style={styles.slotRemoveBtn}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Trash2 size={13} color="#DC2626" />
                          <Text style={styles.slotRemoveText}>
                            Hapus Posisi
                          </Text>
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
                    totalSlotBudget > numBudget && styles.slotSummaryBoxError,
                  ]}
                >
                  <View style={styles.slotSummaryRow}>
                    <Text style={styles.slotSummaryLabel}>
                      Total Alokasi Tim:
                    </Text>
                    <Text
                      style={[
                        styles.slotSummaryValue,
                        totalSlotBudget > numBudget &&
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
                      {formatCurrency(numBudget)}
                    </Text>
                  </View>
                  {totalSlotBudget > numBudget ? (
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

            {/* DatePicker */}
            <DatePickerInput
              label="Tenggat Waktu Pengerjaan (Batas Deadline)"
              value={deadline}
              onChangeDate={setDeadline}
              helperText="Pilih waktu yang realistis agar mahasiswa menghasilkan karya berkualitas."
              required
            />

            {/* Step 2 Buttons */}
            <View style={styles.buttonRow}>
              <Button
                title="Kembali"
                variant="secondary"
                size="lg"
                icon={<ArrowLeft size={18} color={COLORS.textDark} />}
                onPress={() => goToStep(1)}
                style={styles.backBtn}
              />
              <Button
                title="Lanjut ke Pratinjau"
                variant="brand"
                size="lg"
                iconRight={<ArrowRight size={18} color="#FFFFFF" />}
                onPress={handleStep2Next}
                disabled={
                  tipeKolaborasi === "TIM" && totalSlotBudget > numBudget
                }
                style={styles.forwardBtn}
              />
            </View>
          </View>
        )}

        {/* ==================== STEP 3: PRATINJAU & PUBLIKASI ==================== */}
        {currentStep === 3 && (
          <View>
            <View style={styles.stepIntroCard}>
              <Eye size={18} color={COLORS.brandIndigo} />
              <View style={{ flex: 1 }}>
                <Text style={styles.stepIntroTitle}>
                  Pratinjau & Konfirmasi Publikasi
                </Text>
                <Text style={styles.stepIntroSub}>
                  Periksa tampilan proyek sebelum dipublikasikan ke mahasiswa.
                </Text>
              </View>
            </View>

            {/* Live Project Card Preview */}
            <View style={styles.previewCardWrapper}>
              <View style={styles.previewLabelBadge}>
                <Eye size={12} color="#FFFFFF" />
                <Text style={styles.previewLabelText}>
                  TAMPILAN DI BERANDA MAHASISWA
                </Text>
              </View>
              <ProjectCard project={previewProject} onPress={() => {}} />
            </View>

            {/* Summary Details Spec Box */}
            <View style={styles.summarySpecCard}>
              <Text style={styles.summarySpecTitle}>
                Ringkasan Spesifikasi Proyek
              </Text>

              <View style={styles.summarySpecRow}>
                <Text style={styles.summarySpecKey}>Model Kolaborasi:</Text>
                <View style={styles.summaryBadgePill}>
                  {tipeKolaborasi === "TIM" ? (
                    <Users size={12} color={COLORS.brandIndigo} />
                  ) : (
                    <User size={12} color={COLORS.brandIndigo} />
                  )}
                  <Text style={styles.summaryBadgePillText}>
                    {tipeKolaborasi === "TIM"
                      ? `Tim Multi-Talenta (${slots.length} Posisi)`
                      : "Individu (1 Orang)"}
                  </Text>
                </View>
              </View>

              <View style={styles.summarySpecRow}>
                <Text style={styles.summarySpecKey}>Pagu Honor:</Text>
                <Text style={styles.summarySpecValBudget}>
                  {formatCurrency(numBudget)}
                </Text>
              </View>

              <View style={styles.summarySpecRow}>
                <Text style={styles.summarySpecKey}>Tenggat Deadline:</Text>
                <Text style={styles.summarySpecVal}>
                  {formatDate(deadline)}
                </Text>
              </View>

              {/* If Team, list roles */}
              {tipeKolaborasi === "TIM" && (
                <View style={styles.summaryRolesBox}>
                  <Text style={styles.summaryRolesTitle}>
                    Formasi Peran Tim:
                  </Text>
                  {slots.map((s, i) => (
                    <View key={i} style={styles.summaryRoleItem}>
                      <View style={styles.summaryRoleLeft}>
                        <Text style={styles.summaryRoleName}>
                          #{i + 1} {s.nama_peran || "Posisi " + (i + 1)}
                        </Text>
                        {Boolean(s.deskripsi_tugas) && (
                          <Text
                            style={styles.summaryRoleDesc}
                            numberOfLines={1}
                          >
                            {s.deskripsi_tugas}
                          </Text>
                        )}
                      </View>
                      <Text style={styles.summaryRoleHonor}>
                        {formatCurrency(parseInt(s.alokasi_budget, 10) || 0)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Escrow Guarantee Seal */}
            <View style={styles.guaranteeBox}>
              <ShieldCheck size={20} color={COLORS.brandCyan} />
              <View style={{ flex: 1 }}>
                <Text style={styles.guaranteeTitle}>
                  Garansi Rekening Escrow
                </Text>
                <Text style={styles.guaranteeText}>
                  Dana proyek aman di rekening bersama Makarya dan baru akan
                  dikunci saat Anda menyetujui proposal mahasiswa terpilih.
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <Button
                title="Ubah Detail"
                variant="secondary"
                size="lg"
                icon={<ArrowLeft size={18} color={COLORS.textDark} />}
                onPress={() => goToStep(2)}
                style={styles.backBtn}
              />
              <Button
                title="Terbitkan Sekarang"
                variant="brand"
                size="lg"
                iconRight={<CheckCircle2 size={18} color="#FFFFFF" />}
                onPress={handlePost}
                loading={loading}
                style={styles.forwardBtn}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  stepTrackerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  stepItem: {
    alignItems: "center",
    gap: 4,
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.borderDark,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  stepConnectorActive: {
    backgroundColor: COLORS.brandIndigo,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.bgDark,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    justifyContent: "center",
    alignItems: "center",
  },
  stepBadgeActive: {
    backgroundColor: COLORS.brandIndigo,
    borderColor: COLORS.brandIndigo,
    ...SHADOWS.sm,
  },
  stepBadgeCompleted: {
    backgroundColor: "#059669",
    borderColor: "#059669",
  },
  stepBadgeText: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  stepBadgeTextActive: {
    color: "#FFFFFF",
  },
  stepLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textMuted,
  },
  stepLabelActive: {
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  stepLabelCompleted: {
    color: "#059669",
    fontWeight: "600",
  },
  content: {
    padding: 16,
    paddingBottom: 60,
  },
  stepIntroCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  stepIntroTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  stepIntroSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
    marginTop: 2,
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
  stepNextBtn: {
    marginTop: 8,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  backBtn: {
    flex: 1,
  },
  forwardBtn: {
    flex: 1.8,
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
  previewCardWrapper: {
    marginBottom: 16,
  },
  previewLabelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.brandIndigo,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  previewLabelText: {
    fontFamily: FONTS.displayBold,
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  summarySpecCard: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  summarySpecTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 12,
  },
  summarySpecRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  summarySpecKey: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  summarySpecVal: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  summarySpecValBudget: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  summaryBadgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  summaryBadgePillText: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 11,
    color: COLORS.brandIndigo,
    fontWeight: "600",
  },
  summaryRolesBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark,
  },
  summaryRolesTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  summaryRoleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.bgDark,
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  summaryRoleLeft: {
    flex: 1,
    marginRight: 8,
  },
  summaryRoleName: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  summaryRoleDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  summaryRoleHonor: {
    fontFamily: FONTS.displayBold,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  guaranteeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.bgSurface,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 16,
    ...SHADOWS.sm,
  },
  guaranteeTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 2,
  },
  guaranteeText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
    fontWeight: "500",
  },
});
