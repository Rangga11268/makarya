import React from "react";
import { View, Text, StyleSheet, Modal, Platform } from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { Input } from "../../ui/Input";
import { CurrencyInput } from "../../ui/CurrencyInput";
import { Button } from "../../ui/Button";
import { formatNumberDots } from "../../../utils/terbilang";

export function ProposalSubmitModal({
  visible,
  onClose,
  hargaTawar,
  setHargaTawar,
  estimasiHari,
  setEstimasiHari,
  coverLetter,
  setCoverLetter,
  budgetMax,
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
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>Kirim Proposal Lamaran</Text>
          <Text style={styles.modalSub}>
            Tawarkan harga dan rencana kerja terbaik Anda untuk proyek ini
          </Text>

          <Input
            label="Tawaran Honor (Rp)"
          <CurrencyInput
            label="Tawaran Honor Pengerjaan"
            placeholder={String(budgetMax || "")}
            value={hargaTawar}
            onChangeText={setHargaTawar}
            keyboardType="numeric"
            onChangeValue={(val) => setHargaTawar(String(val))}
            helperText={budgetMax ? `Batas budget maksimal klien: Rp ${formatNumberDots(budgetMax)}` : undefined}
            required
          />

          <Input
            label="Estimasi Waktu Pengerjaan (Hari)"
            label="Estimasi Waktu Pengerjaan"
            placeholder="5"
            value={estimasiHari}
            onChangeText={setEstimasiHari}
            keyboardType="numeric"
            suffix="Hari Kerja"
            required
          />

          <Input
            label="Cover Letter / Rencana Kerja"
            placeholder="Jelaskan keahlian relevan dan bagaimana Anda akan menyelesaikan proyek ini..."
            value={coverLetter}
            onChangeText={setCoverLetter}
            multiline
            numberOfLines={4}
            required
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
              title="Kirim Lamaran"
              variant="brand"
              size="md"
              onPress={onSubmit}
              loading={loading}
              style={{ flex: 2 }}
            />
          </View>
        </View>
      </View>
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
