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

export function EditProfileModal({
  visible,
  onClose,
  editForm,
  setEditForm,
  onSave,
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
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
            >
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

                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View style={{ flex: 2 }}>
                    <Input
                      label="Program Studi"
                      value={editForm.prodi}
                      onChangeText={(v) =>
                        setEditForm((prev) => ({ ...prev, prodi: v }))
                      }
                      placeholder="Cth: Sistem Informasi"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input
                      label="Semester"
                      value={editForm.semester}
                      onChangeText={(v) =>
                        setEditForm((prev) => ({ ...prev, semester: v }))
                      }
                      keyboardType="numeric"
                      placeholder="6"
                    />
                  </View>
                </View>

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

                <Input
                  label="Nama Bank"
                  value={editForm.nama_bank}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, nama_bank: v }))
                  }
                  placeholder="Contoh: Bank Central Asia (BCA) / Mandiri"
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

                <Input
                  label="Bidang Industri"
                  value={editForm.bidang_industri}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, bidang_industri: v }))
                  }
                  placeholder="Contoh: Food & Beverage, Fashion, Jasa"
                />

                <Input
                  label="Kota / Lokasi Operasional"
                  value={editForm.kota}
                  onChangeText={(v) =>
                    setEditForm((prev) => ({ ...prev, kota: v }))
                  }
                  placeholder="Contoh: Jakarta Selatan"
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
});
