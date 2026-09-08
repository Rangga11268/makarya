import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";

export function DeliverableUploadModal({
  visible,
  onClose,
  urlBerkas,
  setUrlBerkas,
  catatanPengiriman,
  setCatatanPengiriman,
  onSubmit,
  loading = false,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalSheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.modalTitle}>Unggah Hasil Pekerjaan</Text>
            <Text style={styles.modalSub}>
              Sertakan link berkas proyek (Google Drive, Figma, GitHub, atau Loom
              video)
            </Text>

            <Input
              label="Tautan Berkas Deliverable"
              placeholder="https://figma.com/file/... atau https://drive.google.com/..."
              value={urlBerkas}
              onChangeText={setUrlBerkas}
              autoCapitalize="none"
            />

            <Input
              label="Catatan Pengiriman & Ringkasan Hasil"
              placeholder="Jelaskan apa saja yang telah selesai dikerjakan sesuai brief..."
              value={catatanPengiriman}
              onChangeText={setCatatanPengiriman}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActions}>
              <Button
                title="Batal"
                variant="secondary"
                size="md"
                onPress={onClose}
                style={{ flex: 1 }}
              />
              <Button
                title="Kirim Hasil Kerja"
                variant="brand"
                size="md"
                onPress={onSubmit}
                loading={loading}
                style={{ flex: 2 }}
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
  modalSheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "88%",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
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
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
});
