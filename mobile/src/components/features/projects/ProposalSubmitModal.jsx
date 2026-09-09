import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { Input } from "../../ui/Input";
import { CurrencyInput } from "../../ui/CurrencyInput";
import { Button } from "../../ui/Button";
import { formatNumberDots } from "../../../utils/terbilang";
import { formatCurrency } from "../../../utils/formatCurrency";
import { Users, CheckCircle2 } from "lucide-react-native";

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
  slots = [],
  selectedSlotId = null,
  onSelectSlot = () => {},
}) {
  const isTeam = Array.isArray(slots) && slots.length > 0;

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
            <Text style={styles.modalTitle}>Kirim Proposal Lamaran</Text>
            <Text style={styles.modalSub}>
              Tawarkan harga dan rencana kerja terbaik Anda untuk proyek ini
            </Text>

            {/* Team Slot Selection */}
            {isTeam && (
              <View style={styles.slotSection}>
                <View style={styles.slotHeaderRow}>
                  <Users size={15} color={COLORS.brandIndigo} />
                  <Text style={styles.slotSectionTitle}>
                    Pilih Peran Tim yang Dilamar <Text style={{ color: COLORS.danger }}>*</Text>
                  </Text>
                </View>
                <Text style={styles.slotSectionSub}>
                  Proyek ini membutuhkan formasi tim. Pilih salah satu peran yang sesuai keahlian Anda:
                </Text>

                <View style={styles.slotList}>
                  {slots.map((s) => {
                    const isSelected = String(s.id) === String(selectedSlotId);
                    const isTaken = s.status !== "OPEN";
                    return (
                      <TouchableOpacity
                        key={s.id}
                        disabled={isTaken}
                        onPress={() => onSelectSlot(s)}
                        style={[
                          styles.slotCard,
                          isSelected && styles.slotCardSelected,
                          isTaken && styles.slotCardDisabled,
                        ]}
                        activeOpacity={0.85}
                      >
                        <View style={styles.slotCardTop}>
                          <Text
                            style={[
                              styles.slotCardRole,
                              isSelected && styles.slotCardRoleSelected,
                              isTaken && styles.slotCardRoleDisabled,
                            ]}
                          >
                            {s.nama_peran}
                          </Text>
                          {isSelected ? (
                            <CheckCircle2 size={16} color={COLORS.brandIndigo} />
                          ) : (
                            <View
                              style={[
                                styles.slotStatusTag,
                                isTaken ? styles.slotStatusTagTaken : styles.slotStatusTagOpen,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.slotStatusTagText,
                                  isTaken
                                    ? styles.slotStatusTagTextTaken
                                    : styles.slotStatusTagTextOpen,
                                ]}
                              >
                                {isTaken ? "Terisi" : "Terbuka"}
                              </Text>
                            </View>
                          )}
                        </View>
                        {s.deskripsi_tugas ? (
                          <Text style={styles.slotCardDesc} numberOfLines={2}>
                            {s.deskripsi_tugas}
                          </Text>
                        ) : null}
                        <Text style={styles.slotCardBudget}>
                          Pagu Peran: {formatCurrency(s.alokasi_budget)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            <CurrencyInput
              label="Tawaran Honor Pengerjaan"
              placeholder={String(budgetMax || "")}
              value={hargaTawar}
              onChangeValue={(val) => setHargaTawar(String(val))}
              helperText={
                budgetMax
                  ? `Batas budget maksimal: Rp ${formatNumberDots(budgetMax)}`
                  : undefined
              }
              required
            />

            <Input
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
  slotSection: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 16,
    backgroundColor: COLORS.bgDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  slotHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  slotSectionTitle: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  slotSectionSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 10,
    lineHeight: 15,
  },
  slotList: {
    gap: 8,
  },
  slotCard: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
  },
  slotCardSelected: {
    borderColor: COLORS.brandIndigo,
    backgroundColor: "#EEF2FF",
  },
  slotCardDisabled: {
    opacity: 0.5,
    backgroundColor: "#F8FAFC",
  },
  slotCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  slotCardRole: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  slotCardRoleSelected: {
    color: COLORS.brandIndigo,
  },
  slotCardRoleDisabled: {
    color: COLORS.textMuted,
  },
  slotStatusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  slotStatusTagOpen: {
    backgroundColor: "#ECFDF5",
  },
  slotStatusTagTaken: {
    backgroundColor: "#F1F5F9",
  },
  slotStatusTagText: {
    fontSize: 10,
    fontWeight: "600",
  },
  slotStatusTagTextOpen: {
    color: "#059669",
  },
  slotStatusTagTextTaken: {
    color: "#64748B",
  },
  slotCardDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 6,
    lineHeight: 15,
  },
  slotCardBudget: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
});
