import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { formatCurrency } from "../../../utils/formatCurrency";
import * as ImagePicker from "expo-image-picker";
import {
  X,
  Edit3,
  Upload,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Trash2,
} from "lucide-react-native";

const CATEGORIES = [
  { id: "DESIGN", label: "Desain Grafis" },
  { id: "UIUX", label: "UI/UX Design" },
  { id: "PEMROGRAMAN", label: "Web & Coding" },
  { id: "VIDEO", label: "Video & Animasi" },
  { id: "COPYWRITING", label: "Copywriting" },
  { id: "ADMIN_DATA", label: "Admin & Data" },
];

const PRESETS = [
  {
    label: "Modern Tech",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  },
  {
    label: "Creative Design",
    url: "https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=800&q=80",
  },
  {
    label: "Studio Brand",
    url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
  },
  {
    label: "Bakery / Kuliner",
    url: "https://images.unsplash.com/photo-1556742049-0a67e557b6f3?w=800&q=80",
  },
];

export function MobileEditProjectModal({
  visible,
  onClose,
  project,
  onConfirmUpdate,
}) {
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("DESIGN");
  const [deskripsi, setDeskripsi] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [deadline, setDeadline] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (project) {
      setJudul(project.judul || "");
      setKategori(project.kategori || "DESIGN");
      setDeskripsi(project.deskripsi_raw || project.deskripsi || "");
      setBudgetMax(project.budget_max ? String(project.budget_max) : "");
      setBudgetMin(project.budget_min ? String(project.budget_min) : "");
      setDeadline(
        project.deadline ? String(project.deadline).split("T")[0] : "",
      );
      setBannerUrl(project.banner_url || "");
      setErrorMsg("");
    }
  }, [project, visible]);

  if (!visible || !project) return null;

  const handlePickBanner = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Izin galeri diperlukan untuk memilih foto cover banner");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const base64Data = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;
        setBannerUrl(base64Data);
      }
    } catch (err) {
      setErrorMsg("Gagal memilih gambar dari galeri");
    }
  };

  const handleSave = async () => {
    if (!judul.trim() || judul.trim().length < 5) {
      setErrorMsg("Judul proyek minimal 5 karakter");
      return;
    }
    if (!deskripsi.trim() || deskripsi.trim().length < 15) {
      setErrorMsg("Deskripsi brief minimal 15 karakter");
      return;
    }
    const numMax = parseFloat(budgetMax) || 0;
    if (numMax <= 0 || numMax > 2000000) {
      setErrorMsg("Anggaran maksimal harus di antara Rp 50.000 s/d Rp 2.000.000");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const payload = {
        judul: judul.trim(),
        kategori,
        deskripsi_raw: deskripsi.trim(),
        budget_max: numMax,
        budget_min: budgetMin ? parseFloat(budgetMin) : undefined,
        deadline: deadline || undefined,
        banner_url: bannerUrl ? bannerUrl.trim() : null,
      };

      await onConfirmUpdate(project.id, payload);
      onClose();
    } catch (err) {
      setErrorMsg(
        err.response?.data?.detail ||
          "Gagal memperbarui proyek. Silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modalSheet}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Edit3 size={16} color={COLORS.brandIndigo} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Edit Kebutuhan Proyek</Text>
                <Text style={styles.headerSubtitle}>
                  Perbarui spesifikasi & batas anggaran
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              disabled={loading}
              style={styles.closeBtn}
            >
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Form Scroll Content */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {errorMsg ? (
              <View style={styles.errorBanner}>
                <AlertCircle size={16} color="#DC2626" />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            {/* Judul Input */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Judul Proyek</Text>
              <TextInput
                style={styles.textInput}
                value={judul}
                onChangeText={setJudul}
                placeholder="Contoh: Desain Menu Resto & Feed Instagram"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Kategori Selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Kategori Keahlian</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryRow}
              >
                {CATEGORIES.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setKategori(c.id)}
                    style={[
                      styles.categoryChip,
                      kategori === c.id && styles.categoryChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        kategori === c.id && styles.categoryChipTextActive,
                      ]}
                    >
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Budget Row */}
            <View style={styles.rowTwoCols}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Anggaran Maksimal (Rp)</Text>
                <TextInput
                  style={[styles.textInput, styles.textInputBold]}
                  value={budgetMax}
                  onChangeText={setBudgetMax}
                  keyboardType="numeric"
                  placeholder="500000"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Anggaran Minimal (Opsional)</Text>
                <TextInput
                  style={styles.textInput}
                  value={budgetMin}
                  onChangeText={setBudgetMin}
                  keyboardType="numeric"
                  placeholder="200000"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Deadline Input */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Tenggat Waktu (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.textInput}
                value={deadline}
                onChangeText={setDeadline}
                placeholder="2026-10-30"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Deskripsi Brief */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Deskripsi Brief Kebutuhan</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={deskripsi}
                onChangeText={setDeskripsi}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholder="Jelaskan kebutuhan spesifik Anda..."
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Banner Cover Section */}
            <View style={styles.fieldGroup}>
              <View style={styles.bannerHeaderRow}>
                <Text style={styles.fieldLabel}>Cover Banner Proyek</Text>
                {bannerUrl ? (
                  <TouchableOpacity onPress={() => setBannerUrl("")}>
                    <Text style={styles.removeBannerText}>Hapus Banner</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {bannerUrl ? (
                <View style={styles.bannerPreviewContainer}>
                  <Image
                    source={{ uri: bannerUrl }}
                    style={styles.bannerPreviewImage}
                    resizeMode="cover"
                  />
                </View>
              ) : null}

              <View style={styles.bannerActionRow}>
                <TouchableOpacity
                  onPress={handlePickBanner}
                  style={styles.uploadBtn}
                >
                  <Upload size={14} color="#FFFFFF" />
                  <Text style={styles.uploadBtnText}>
                    {bannerUrl ? "Ganti dari Galeri" : "Pilih dari Galeri"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Presets */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.presetRow}
              >
                {PRESETS.map((p, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setBannerUrl(p.url)}
                    style={[
                      styles.presetChip,
                      bannerUrl === p.url && styles.presetChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        bannerUrl === p.url && styles.presetChipTextActive,
                      ]}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              onPress={onClose}
              disabled={loading}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              disabled={loading}
              style={[styles.saveBtn, loading && styles.btnDisabled]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <CheckCircle2 size={16} color="#FFFFFF" />
                  <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "90%",
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: "#64748B",
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
  },
  scrollBody: {
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingVertical: 16,
    gap: 16,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: "#DC2626",
    flex: 1,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: "#0F172A",
  },
  textInputBold: {
    fontFamily: FONTS.bold,
  },
  textArea: {
    minHeight: 88,
    paddingTop: 10,
  },
  rowTwoCols: {
    flexDirection: "row",
    gap: 12,
  },
  categoryRow: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryChipActive: {
    backgroundColor: COLORS.brandIndigo,
    borderColor: COLORS.brandIndigo,
  },
  categoryChipText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: "#475569",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
    fontFamily: FONTS.bold,
  },
  bannerHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  removeBannerText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: "#E11D48",
  },
  bannerPreviewContainer: {
    height: 110,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  bannerPreviewImage: {
    width: "100%",
    height: "100%",
  },
  bannerActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0F172A",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  uploadBtnText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: "#FFFFFF",
  },
  presetRow: {
    gap: 6,
    paddingTop: 4,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  presetChipActive: {
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    borderColor: COLORS.brandIndigo,
  },
  presetChipText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: "#64748B",
  },
  presetChipTextActive: {
    color: COLORS.brandIndigo,
    fontFamily: FONTS.bold,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cancelBtnText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: "#64748B",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.brandIndigo,
  },
  saveBtnText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: "#FFFFFF",
  },
  btnDisabled: {
    opacity: 0.6,
  },
});

