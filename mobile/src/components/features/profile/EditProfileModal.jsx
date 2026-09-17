import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { X, Check } from "lucide-react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { SelectWithOther } from "../../ui/SelectWithOther";
import {
  PRODI_OPTIONS,
  SEMESTER_OPTIONS,
  BANK_OPTIONS,
  INDUSTRI_OPTIONS,
  KOTA_OPTIONS,
} from "../../../constants/formOptions";

export function EditProfileModal({
  visible,
  onClose,
  editForm,
  setEditForm,
  onSave,
  onPickSignature,
  isSaving = false,
  isMahasiswa = false,
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.editModalSheet}>
          {/* Modal Header */}
          <View style={styles.modalHeaderRow}>
            <View>
              <Text style={styles.modalTitle}>
                {isMahasiswa
                  ? "Edit Profil & Portofolio"
                  : "Edit Informasi Bisnis"}
              </Text>
              <Text style={styles.modalSub}>
                Perbarui informasi agar profilmu selalu mutakhir
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {isMahasiswa ? (
              <>
                <Input
                  label="Nama Lengkap"
                  value={editForm.nama_lengkap}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, nama_lengkap: v }))
                  }
                  placeholder="Masukkan nama lengkap Anda"
                />

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Bio & Pengantar Profil</Text>
                  <TextInput
                    style={styles.textArea}
                    value={editForm.bio}
                    onChangeText={(v) =>
                      setEditForm((prev) => ({ ...prev, bio: v }))
                    }
                    placeholder="Tuliskan pengalaman singkat atau keahlian utama Anda..."
                    placeholderTextColor={COLORS.textDim}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                <SelectWithOther
                  label="Program Studi"
                  title="Pilih Program Studi"
                  options={PRODI_OPTIONS}
                  value={editForm.prodi}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, prodi: v }))
                  }
                  placeholder="Pilih Program Studi"
                  otherPlaceholder="Ketik nama Program Studi..."
                />

                <SelectWithOther
                  label="Semester Aktif"
                  title="Pilih Semester"
                  options={SEMESTER_OPTIONS}
                  value={
                    editForm.semester
                      ? editForm.semester.toString().startsWith("Semester")
                        ? editForm.semester
                        : `Semester ${editForm.semester}`
                      : ""
                  }
                  onChangeText={(v) =>
                    setEditForm((prev) => ({
                      ...prev,
                      semester: v.replace(/^Semester\s*/i, ""),
                    }))
                  }
                  placeholder="Pilih Semester"
                  otherPlaceholder="Cth: Semester 9"
                />

                <Input
                  label="NIM (Nomor Induk Mahasiswa)"
                  value={editForm.nim}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, nim: v }))
                  }
                  placeholder="Cth: 12210001"
                />

                {/* Portfolio Links Group */}
                <View style={styles.portfolioSectionHeader}>
                  <Text style={styles.portfolioSectionTitle}>
                    Tautan Portofolio & Sosial
                  </Text>
                  <Text style={styles.portfolioSectionDesc}>
                    Dapat langsung dibuka oleh klien UMKM untuk melihat
                    portofoliomu
                  </Text>
                </View>

                <Input
                  label="GitHub Profile / Repository URL"
                  value={editForm.github_url}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, github_url: v }))
                  }
                  placeholder="https://github.com/username"
                  autoCapitalize="none"
                />

                <Input
                  label="Figma Community / Portfolio URL"
                  value={editForm.figma_url}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, figma_url: v }))
                  }
                  placeholder="https://figma.com/@username"
                  autoCapitalize="none"
                />

                <Input
                  label="Website Portofolio Pribadi"
                  value={editForm.website_url}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, website_url: v }))
                  }
                  placeholder="https://portofolio-anda.com"
                  autoCapitalize="none"
                />

                <Input
                  label="LinkedIn Profile URL"
                  value={editForm.linkedin_url}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, linkedin_url: v }))
                  }
                  placeholder="https://linkedin.com/in/username"
                  autoCapitalize="none"
                />

                {/* Rekening Pencairan Section */}
                <View style={styles.portfolioSectionHeader}>
                  <Text style={styles.portfolioSectionTitle}>
                    Rekening Pencairan Honor
                  </Text>
                  <Text style={styles.portfolioSectionDesc}>
                    Nomor rekening untuk pencairan saldo honor escrow
                  </Text>
                </View>

                <SelectWithOther
                  label="Nama Bank / E-Wallet"
                  title="Pilih Bank / E-Wallet"
                  options={BANK_OPTIONS}
                  value={editForm.nama_bank}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, nama_bank: v }))
                  }
                  placeholder="Pilih Bank / E-Wallet"
                  otherPlaceholder="Ketik nama bank/e-wallet..."
                  otherLabel="Bank Lainnya (Ketik Manual)"
                />

                <Input
                  label="Nomor Rekening"
                  value={editForm.nomor_rekening}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, nomor_rekening: v }))
                  }
                  placeholder="Contoh: 8270-3491-8821"
                  keyboardType="numeric"
                />

                <Input
                  label="Nama Pemilik Rekening"
                  value={editForm.nama_pemilik_rekening}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({
                      ...prev,
                      nama_pemilik_rekening: v,
                    }))
                  }
                  placeholder="Contoh: Nama sesuai buku tabungan"
                />
              </>
            ) : (
              <>
                <Input
                  label="Nama Usaha / Brand"
                  value={editForm.nama_usaha}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, nama_usaha: v }))
                  }
                  placeholder="Contoh: Kopi Senja Nusantara"
                />

                <SelectWithOther
                  label="Bidang Industri"
                  title="Pilih Bidang Industri"
                  options={INDUSTRI_OPTIONS}
                  value={editForm.bidang_industri}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, bidang_industri: v }))
                  }
                  placeholder="Pilih Bidang Industri"
                  otherPlaceholder="Ketik bidang industri..."
                />

                <SelectWithOther
                  label="Kota / Lokasi Operasional"
                  title="Pilih Kota / Lokasi"
                  options={KOTA_OPTIONS}
                  value={editForm.kota}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, kota: v }))
                  }
                  placeholder="Pilih Kota"
                  otherPlaceholder="Ketik nama kota..."
                  otherLabel="Kota Lainnya (Ketik Manual)"
                />

                <Input
                  label="No. Kontak Bisnis (WhatsApp)"
                  value={editForm.no_kontak}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, no_kontak: v }))
                  }
                  placeholder="Contoh: 081298765432"
                  keyboardType="phone-pad"
                />

                {/* Rekening Refund / Pencairan Section */}
                <View style={styles.portfolioSectionHeader}>
                  <Text style={styles.portfolioSectionTitle}>
                    Rekening Pengembalian / Pencairan Dana
                  </Text>
                  <Text style={styles.portfolioSectionDesc}>
                    Digunakan untuk refund proyek atau pencairan saldo aktif
                    usaha
                  </Text>
                </View>

                <SelectWithOther
                  label="Nama Bank / E-Wallet"
                  title="Pilih Bank / E-Wallet"
                  options={BANK_OPTIONS}
                  value={editForm.nama_bank}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, nama_bank: v }))
                  }
                  placeholder="Pilih Bank / E-Wallet"
                  otherPlaceholder="Ketik nama bank/e-wallet..."
                  otherLabel="Bank Lainnya (Ketik Manual)"
                />

                <Input
                  label="Nomor Rekening"
                  value={editForm.nomor_rekening}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, nomor_rekening: v }))
                  }
                  placeholder="Contoh: 8270-3491-8821"
                  keyboardType="numeric"
                />

                <Input
                  label="Nama Pemilik Rekening"
                  value={editForm.nama_pemilik_rekening}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({
                      ...prev,
                      nama_pemilik_rekening: v,
                    }))
                  }
                  placeholder="Contoh: Nama Pemilik / Nama Usaha"
                />

                {/* Tanda Tangan Digital Resmi UMKM */}
                <View style={styles.portfolioSectionHeader}>
                  <Text style={styles.portfolioSectionTitle}>
                    Tanda Tangan Digital Resmi (Otorisasi Sertifikat)
                  </Text>
                  <Text style={styles.portfolioSectionDesc}>
                    Otomatis dicantumkan pada sertifikat mahasiswa yang
                    menyelesaikan proyek Anda
                  </Text>
                </View>

                <View style={styles.signatureCardBox}>
                  {editForm.url_ttd ? (
                    <View style={styles.signaturePreviewWrap}>
                      <Image
                        source={{ uri: editForm.url_ttd }}
                        style={styles.signaturePreviewImg}
                        resizeMode="contain"
                      />
                      <View style={styles.signatureActionsRow}>
                        {onPickSignature && (
                          <TouchableOpacity
                            style={styles.changeSigBtn}
                            onPress={onPickSignature}
                          >
                            <Text style={styles.changeSigBtnText}>
                              Ganti TTD
                            </Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={styles.deleteSigBtn}
                          onPress={() =>
                            setEditForm((prev) => ({ ...prev, url_ttd: null }))
                          }
                        >
                          <Text style={styles.deleteSigBtnText}>Hapus</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.uploadSigPlaceholder}
                      onPress={onPickSignature}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.uploadSigTitle}>
                        + Unggah Gambar Tanda Tangan
                      </Text>
                      <Text style={styles.uploadSigSubtitle}>
                        Pilih foto atau hasil scan tanda tangan dari galeri
                        ponsel Anda
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}

            <View style={styles.modalActions}>
              <Button
                title="Batal"
                variant="secondary"
                size="md"
                onPress={onClose}
                style={{ flex: 1 }}
                disabled={isSaving}
              />
              <Button
                title={isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                variant="brand"
                size="md"
                onPress={onSave}
                style={{ flex: 2 }}
                disabled={isSaving}
                icon={
                  isSaving ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Check size={16} color="#FFF" />
                  )
                }
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  editModalSheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: "88%",
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  modalSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: COLORS.canvasSoft,
  },
  formGroup: {
    marginBottom: 14,
  },
  formLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  textArea: {
    backgroundColor: COLORS.bgSurfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: COLORS.textDark,
    minHeight: 74,
  },
  portfolioSectionHeader: {
    marginTop: 6,
    marginBottom: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  portfolioSectionTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  portfolioSectionDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  signatureCardBox: {
    marginBottom: 16,
    backgroundColor: COLORS.bgSurfaceSubtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    overflow: "hidden",
  },
  signaturePreviewWrap: {
    padding: 14,
    alignItems: "center",
  },
  signaturePreviewImg: {
    width: "100%",
    height: 70,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: 10,
  },
  signatureActionsRow: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  changeSigBtn: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: COLORS.brandIndigo,
    borderRadius: 8,
    alignItems: "center",
  },
  changeSigBtnText: {
    color: "#FFFFFF",
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
  },
  deleteSigBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    alignItems: "center",
  },
  deleteSigBtnText: {
    color: "#DC2626",
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
  },
  uploadSigPlaceholder: {
    padding: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: COLORS.brandIndigo,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
    margin: 8,
  },
  uploadSigTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  uploadSigSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 3,
  },
});
