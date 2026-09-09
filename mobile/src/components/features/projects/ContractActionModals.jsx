import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { COLORS, SHADOWS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { Button } from "../../ui/Button";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import {
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  XCircle,
  X,
} from "lucide-react-native";

export function ReopenProjectModal({
  visible,
  onClose,
  project,
  onConfirm,
  loading = false,
}) {
  const defaultNewDeadline = new Date(Date.now() + 7 * 86400000)
    .toISOString()
    .split("T")[0];

  const [newDeadline, setNewDeadline] = useState(defaultNewDeadline);
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!newDeadline.trim()) return;
    onConfirm({
      new_deadline: newDeadline.trim(),
      reason: reason.trim() || null,
    });
  };

  if (!project) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalBackdrop} />
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Buka Kembali Proyek</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.alertBox}>
              <AlertTriangle size={18} color="#D97706" />
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle}>
                  Ganti Mahasiswa & Buka ke Eksplorasi
                </Text>
                <Text style={styles.alertDesc}>
                  Penugasan mahasiswa saat ini akan dihentikan. Seluruh dana
                  escrow sebesar{" "}
                  <Text style={{ fontWeight: "700" }}>
                    {formatCurrency(project.budget_max)}
                  </Text>{" "}
                  akan langsung dikembalikan ke Saldo Aktif Anda.
                </Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Tenggat Waktu Baru (YYYY-MM-DD){" "}
                <Text style={{ color: "#EF4444" }}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={newDeadline}
                onChangeText={setNewDeadline}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={COLORS.textDim}
              />
              <Text style={styles.helperText}>
                Tenggat sebelumnya: {formatDate(project.deadline)}.
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Alasan Pembatalan Kontrak</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={reason}
                onChangeText={setReason}
                placeholder="Contoh: Mahasiswa melewati batas waktu pengerjaan..."
                placeholderTextColor={COLORS.textDim}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.actionRow}>
              <Button
                title="Batal"
                variant="outline"
                size="md"
                onPress={onClose}
                disabled={loading}
                style={{ flex: 1 }}
              />
              <Button
                title="Buka Kembali"
                variant="brand"
                size="md"
                icon={<RotateCcw size={16} color="#FFF" />}
                onPress={handleConfirm}
                loading={loading}
                style={{ flex: 1.5 }}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function TerminateProjectModal({
  visible,
  onClose,
  project,
  onConfirm,
  loading = false,
}) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm({ reason: reason.trim() || null });
  };

  if (!project) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalBackdrop} />
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Batalkan Proyek Permanen</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={[styles.alertBox, styles.alertBoxDanger]}>
              <XCircle size={18} color="#DC2626" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.alertTitle, { color: "#991B1B" }]}>
                  Konfirmasi Pembatalan Proyek
                </Text>
                <Text style={[styles.alertDesc, { color: "#B91C1C" }]}>
                  Proyek akan dibatalkan secara permanen (CANCELLED). Seluruh
                  saldo escrow akan dikembalikan ke Saldo Aktif Anda.
                </Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Alasan Pembatalan</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={reason}
                onChangeText={setReason}
                placeholder="Contoh: Rencana kebutuhan proyek berubah..."
                placeholderTextColor={COLORS.textDim}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.actionRow}>
              <Button
                title="Kembali"
                variant="outline"
                size="md"
                onPress={onClose}
                disabled={loading}
                style={{ flex: 1 }}
              />
              <Button
                title="Ya, Batalkan"
                variant="outline"
                size="md"
                textStyle={{ color: "#DC2626" }}
                style={{
                  flex: 1.5,
                  borderColor: "#FECACA",
                  backgroundColor: "#FEF2F2",
                }}
                onPress={handleConfirm}
                loading={loading}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function ResignProposalModal({
  visible,
  onClose,
  proposal,
  onConfirm,
  loading = false,
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim() || reason.trim().length < 5) {
      setError("Alasan pengunduran diri minimal 5 karakter");
      return;
    }
    setError("");
    onConfirm({ reason: reason.trim() });
  };

  if (!proposal) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalBackdrop} />
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Pengunduran Diri</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={[styles.alertBox, styles.alertBoxDanger]}>
              <AlertTriangle size={18} color="#DC2626" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.alertTitle, { color: "#991B1B" }]}>
                  Perhatian Sebelum Mengundurkan Diri
                </Text>
                <Text style={[styles.alertDesc, { color: "#B91C1C" }]}>
                  Penugasan Anda pada proyek ini akan berakhir. Dana escrow akan
                  dikembalikan ke klien UMKM dan proyek dibuka kembali.
                </Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Alasan Pengunduran Diri{" "}
                <Text style={{ color: "#EF4444" }}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={reason}
                onChangeText={(t) => {
                  setReason(t);
                  if (error) setError("");
                }}
                placeholder="Sebutkan kendala pengerjaan yang dihadapi secara jujur..."
                placeholderTextColor={COLORS.textDim}
                multiline
                numberOfLines={3}
              />
              {error ? (
                <Text style={{ color: "#DC2626", fontSize: 11, marginTop: 4 }}>
                  {error}
                </Text>
              ) : null}
            </View>

            <View style={styles.actionRow}>
              <Button
                title="Batal"
                variant="outline"
                size="md"
                onPress={onClose}
                disabled={loading}
                style={{ flex: 1 }}
              />
              <Button
                title="Konfirmasi"
                variant="outline"
                size="md"
                textStyle={{ color: "#DC2626" }}
                style={{
                  flex: 1.5,
                  borderColor: "#FECACA",
                  backgroundColor: "#FEF2F2",
                }}
                onPress={handleConfirm}
                loading={loading}
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    maxHeight: "85%",
    ...SHADOWS.card,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 14,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    gap: 14,
  },
  alertBox: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  alertBoxDanger: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 3,
  },
  alertDesc: {
    fontSize: 11,
    color: "#B45309",
    lineHeight: 16,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.canvas,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.textDark,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  helperText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
});
