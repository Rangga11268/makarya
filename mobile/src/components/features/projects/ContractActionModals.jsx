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
  XCircle,
  X,
  CheckCircle2,
  Lock,
} from "lucide-react-native";
import { PebbleButton } from "../../ui/PebbleButton";

/**
 * Bottom Sheet Modal: Ganti Mahasiswa & Buka ke Eksplorasi (UMKM)
 */
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
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdropDismiss}
          onPress={onClose}
        />
        <View style={styles.bottomSheet}>
          <View style={styles.dragPill} />

          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Buka Kembali Proyek</Text>
              <Text style={styles.modalSub}>
                Ganti mahasiswa dan buka kembali ke katalog eksplorasi
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* Warning Callout */}
            <View style={styles.alertBox}>
              <AlertTriangle
                size={18}
                color="#D97706"
                style={{ marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle}>
                  Pembatalan Kontrak & Refund Escrow
                </Text>
                <Text style={styles.alertDesc}>
                  Penugasan mahasiswa saat ini akan dihentikan. Seluruh dana
                  escrow sebesar{" "}
                  <Text style={styles.boldHighlight}>
                    {formatCurrency(project.budget_max)}
                  </Text>{" "}
                  akan otomatis dikembalikan ke Saldo Aktif Anda.
                </Text>
              </View>
            </View>

            {/* Input Deadline Baru */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Tenggat Waktu Baru (YYYY-MM-DD){" "}
                <Text style={{ color: COLORS.danger }}>*</Text>
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

            {/* Input Alasan */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Alasan Penggantian Mahasiswa</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={reason}
                onChangeText={setReason}
                placeholder="Contoh: Mahasiswa melewati batas waktu dan tidak ada respon..."
                placeholderTextColor={COLORS.textDim}
                multiline
                numberOfLines={3}
              />
              <Text style={styles.helperText}>
                Alasan ini akan dicatat dalam riwayat proyek dan dapat dibaca
                oleh mahasiswa terkait.
              </Text>
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

/**
 * Bottom Sheet Modal: Batalkan Proyek Permanen (UMKM)
 */
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
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdropDismiss}
          onPress={onClose}
        />
        <View style={styles.bottomSheet}>
          <View style={styles.dragPill} />

          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Batalkan Proyek Permanen</Text>
              <Text style={styles.modalSub}>
                Tutup proyek dan kembalikan seluruh dana escrow
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <View style={[styles.alertBox, styles.alertBoxDanger]}>
              <XCircle size={18} color="#DC2626" style={{ marginTop: 2 }} />
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
              <Text style={styles.label}>
                Alasan Pembatalan Proyek{" "}
                <Text style={{ color: COLORS.danger }}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={reason}
                onChangeText={setReason}
                placeholder="Jelaskan alasan pembatalan proyek ini..."
                placeholderTextColor={COLORS.textDim}
                multiline
                numberOfLines={3}
              />
              <Text style={styles.helperText}>
                Alasan ini akan dicatat dalam audit pembatalan proyek dan dapat
                dilihat oleh mahasiswa pelamar/publik.
              </Text>
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
                title="Ya, Batalkan Proyek"
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

/**
 * Bottom Sheet Modal: Pengunduran Diri Mahasiswa
 */
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
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdropDismiss}
          onPress={onClose}
        />
        <View style={styles.bottomSheet}>
          <View style={styles.dragPill} />

          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Pengunduran Diri Proyek</Text>
              <Text style={styles.modalSub}>
                Akhiri penugasan dan kembalikan escrow ke klien
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <View style={[styles.alertBox, styles.alertBoxDanger]}>
              <AlertTriangle
                size={18}
                color="#DC2626"
                style={{ marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.alertTitle, { color: "#991B1B" }]}>
                  Perhatian Sebelum Mengundurkan Diri
                </Text>
                <Text style={[styles.alertDesc, { color: "#B91C1C" }]}>
                  Penugasan Anda pada proyek ini akan dihentikan. Dana escrow
                  akan dikembalikan ke klien UMKM dan proyek dibuka kembali
                  untuk mahasiswa lain.
                </Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Alasan Pengunduran Diri{" "}
                <Text style={{ color: COLORS.danger }}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={reason}
                onChangeText={(t) => {
                  setReason(t);
                  if (error) setError("");
                }}
                placeholder="Jelaskan kendala pengerjaan yang dihadapi secara jujur..."
                placeholderTextColor={COLORS.textDim}
                multiline
                numberOfLines={3}
              />
              <Text style={styles.helperText}>
                Alasan pengunduran diri akan dicatat dan dapat dilihat oleh
                pihak klien UMKM.
              </Text>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
                title="Konfirmasi Resign"
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

/**
 * Bottom Sheet Modal: Terima Proposal & Kunci Escrow (UMKM)
 */
export function AcceptProposalModal({
  visible,
  onClose,
  proposal,
  project,
  onConfirm,
  loading = false,
}) {
  if (!proposal) return null;
  const mhs = proposal.mhs_profile || proposal.mahasiswa || {};

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
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdropDismiss}
          onPress={onClose}
        />
        <View style={styles.bottomSheet}>
          <View style={styles.dragPill} />

          <View style={styles.modalHeader}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <View style={styles.badgeLabelRow}>
                <ShieldCheck size={13} color="#059669" />
                <Text style={styles.badgeLabelText}>GARANSI 100% ESCROW</Text>
              </View>
              <Text style={styles.modalTitle}>Terima & Kunci Escrow</Text>
              <Text style={styles.modalSub}>
                Persetujuan proposal dan komitmen pembayaran aman
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeCircleBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Mahasiswa Summary Card */}
            <View style={styles.mhsCard}>
              <View style={styles.mhsAvatarCircle}>
                <Text style={styles.mhsAvatarInitial}>
                  {mhs.nama_lengkap
                    ? mhs.nama_lengkap.charAt(0).toUpperCase()
                    : "M"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.mhsNameText} numberOfLines={1}>
                  {mhs.nama_lengkap || "Mahasiswa Freelancer"}
                </Text>
                <Text style={styles.mhsMetaText} numberOfLines={1}>
                  {mhs.prodi || "Talenta Terverifikasi"} •{" "}
                  {proposal.estimasi_hari || 7} Hari Kerja
                </Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.priceMetaLabel}>Nilai Penawaran</Text>
                <Text style={styles.priceValueText}>
                  {formatCurrency(proposal.harga_tawar)}
                </Text>
              </View>
            </View>

            {/* Escrow Callout */}
            <View style={[styles.alertBox, styles.alertBoxSuccess]}>
              <ShieldCheck
                size={20}
                color="#059669"
                style={{ marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.alertTitle, { color: "#065F46" }]}>
                  Proteksi Rekening Bersama (Escrow)
                </Text>
                <Text style={[styles.alertDesc, { color: "#047857" }]}>
                  Dana proyek sebesar{" "}
                  <Text
                    style={{ fontFamily: FONTS.displayBold, color: "#065F46" }}
                  >
                    {formatCurrency(proposal.harga_tawar)}
                  </Text>{" "}
                  akan dikunci di Escrow Makarya. Saldo TIDAK langsung dikirim ke
                  mahasiswa, melainkan baru dicairkan setelah Anda puas dan
                  menyetujui hasil deliverable pekerjaan.
                </Text>
              </View>
            </View>

            {/* What Happens Next Checklist */}
            <View style={styles.checklistContainer}>
              <View style={styles.checkItem}>
                <CheckCircle2 size={15} color="#2563EB" />
                <Text style={styles.checkItemText}>
                  Status proyek resmi beralih ke Sedang Dikerjakan
                </Text>
              </View>
              <View style={styles.checkItem}>
                <CheckCircle2 size={15} color="#2563EB" />
                <Text style={styles.checkItemText}>
                  Ruang kerja, chat terenkripsi, & berkas deliverable aktif
                </Text>
              </View>
              <View style={styles.checkItem}>
                <CheckCircle2 size={15} color="#2563EB" />
                <Text style={styles.checkItemText}>
                  Garansi pengembalian dana 100% jika terjadi wanprestasi
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <PebbleButton
                variant="pearl"
                size="md"
                label="Batal"
                onPress={onClose}
                disabled={loading}
                style={{ flex: 1 }}
              />
              <PebbleButton
                variant="emerald"
                size="md"
                label="Ya, Setujui & Kunci"
                icon={Lock}
                onPress={onConfirm}
                loading={loading}
                style={{ flex: 1.8 }}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/**
 * Bottom Sheet Modal: Selesaikan Proyek & Lepas Escrow (UMKM)
 */
export function ApproveSubmissionModal({
  visible,
  onClose,
  submission,
  project,
  onConfirm,
  loading = false,
}) {
  if (!submission) return null;

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
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdropDismiss}
          onPress={onClose}
        />
        <View style={styles.bottomSheet}>
          <View style={styles.dragPill} />

          <View style={styles.modalHeader}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <View style={styles.badgeLabelRow}>
                <CheckCircle2 size={13} color="#059669" />
                <Text style={styles.badgeLabelText}>PENYELESAIAN PROYEK</Text>
              </View>
              <Text style={styles.modalTitle}>Setujui & Lepas Escrow</Text>
              <Text style={styles.modalSub}>
                Konfirmasi penerimaan deliverable dan pencairan honor
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeCircleBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Success Callout */}
            <View style={[styles.alertBox, styles.alertBoxSuccess]}>
              <CheckCircle2
                size={20}
                color="#059669"
                style={{ marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.alertTitle, { color: "#065F46" }]}>
                  Pencairan 100% Saldo Escrow
                </Text>
                <Text style={[styles.alertDesc, { color: "#047857" }]}>
                  Dengan menyetujui hasil kerja ini, dana escrow proyek akan
                  otomatis diteruskan 100% ke saldo honor dompet mahasiswa, dan
                  status proyek beralih menjadi Selesai (COMPLETED).
                </Text>
              </View>
            </View>

            {/* Deliverable Notes */}
            {submission.catatan ? (
              <View style={styles.deliverableNoteBox}>
                <Text style={styles.deliverableNoteLabel}>
                  Catatan Pengiriman Mahasiswa:
                </Text>
                <Text style={styles.deliverableNoteText}>
                  "{submission.catatan}"
                </Text>
              </View>
            ) : null}

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <PebbleButton
                variant="pearl"
                size="md"
                label="Periksa Lagi"
                onPress={onClose}
                disabled={loading}
                style={{ flex: 1 }}
              />
              <PebbleButton
                variant="emerald"
                size="md"
                label="Setujui & Lepas Escrow"
                icon={CheckCircle2}
                onPress={onConfirm}
                loading={loading}
                style={{ flex: 1.8 }}
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
  backdropDismiss: {
    flex: 1,
  },
  bottomSheet: {
    width: "100%",
    backgroundColor: COLORS.bgSurface, // Solid White #FFFFFF (Never transparent!)
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    maxHeight: "88%",
    ...SHADOWS.card,
  },
  dragPill: {
    width: 44,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: COLORS.borderDark,
    alignSelf: "center",
    marginBottom: 14,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    paddingBottom: 14,
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 2,
  },
  modalSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  closeBtn: {
    padding: 4,
    borderRadius: 12,
  },
  scrollContent: {
    gap: 14,
  },
  alertBox: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#FFFBEB", // Amber 50
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  alertBoxDanger: {
    backgroundColor: "#FEF2F2", // Red 50
    borderColor: "#FECACA",
  },
  alertTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 3,
  },
  alertDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#B45309",
    lineHeight: 16,
  },
  boldHighlight: {
    fontWeight: "700",
    color: "#78350F",
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    backgroundColor: COLORS.canvasSoft, // Solid light slate #F1F5F9 (Never transparent!)
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13,
    color: COLORS.textDark,
  },
  textArea: {
    minHeight: 75,
    textAlignVertical: "top",
  },
  helperText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  errorText: {
    fontFamily: FONTS.bodyRegular,
    color: COLORS.danger,
    fontSize: 11,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  badgeLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  badgeLabelText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    fontWeight: "700",
    color: "#059669",
    letterSpacing: 0.5,
  },
  closeCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(241, 245, 249, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  mhsCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
  },
  mhsAvatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  mhsAvatarInitial: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  mhsNameText: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  mhsMetaText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  priceMetaLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 9.5,
    color: "#64748B",
  },
  priceValueText: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "800",
    color: "#059669",
    marginTop: 1,
  },
  alertBoxSuccess: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  checklistContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkItemText: {
    flex: 1,
    fontFamily: FONTS.bodyMedium,
    fontSize: 11.5,
    color: "#334155",
    lineHeight: 16,
  },
  deliverableNoteBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  deliverableNoteLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#64748B",
    marginBottom: 4,
  },
  deliverableNoteText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "#0F172A",
    fontStyle: "italic",
    lineHeight: 17,
  },
});
