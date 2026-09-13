import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { FONTS } from "../../../theme/fonts";
import { COLORS } from "../../../theme/colors";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { CurrencyInput } from "../../../components/ui/CurrencyInput";
import { X, Building2, ShieldCheck } from "lucide-react-native";

export function WalletTransactionModal({
  visible,
  onClose,
  txType,
  isMahasiswa,
  destBank,
  setDestBank,
  destAccount,
  setDestAccount,
  destOwner,
  setDestOwner,
  nominal,
  setNominal,
  onSubmit,
  loading,
}) {
  const isWithdraw = txType === "WITHDRAW";
  const title = isWithdraw
    ? "Tarik Saldo ke Rekening"
    : isMahasiswa
      ? "Isi Saldo Dompet"
      : "Deposit Saldo Proyek";

  const subtitle = isWithdraw
    ? `Dana ditransfer langsung ke rekening ${destBank || "bank"} Anda`
    : "Deposit tersimpan aman di rekening bersama Makarya (Garansi 100% Escrow)";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity
          style={styles.backdropPressable}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheetContainer}>
          {/* Grabber indicator */}
          <View style={styles.sheetGrabber} />

          {/* Header Row */}
          <View style={styles.sheetHeader}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.sheetTitle}>{title}</Text>
              <Text style={styles.sheetSub}>{subtitle}</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.sheetBody}
          >
            {/* Withdraw: Rekening Tujuan Inset Card */}
            {isWithdraw && (
              <View style={styles.bankSection}>
                <View style={styles.bankSectionHeader}>
                  <Building2 size={16} color="#2563EB" />
                  <Text style={styles.bankSectionTitle}>
                    Rekening Tujuan Pencairan
                  </Text>
                </View>

                <View style={styles.bankInputsGroup}>
                  <Input
                    label="Nama Bank"
                    value={destBank}
                    onChangeText={setDestBank}
                    placeholder="Contoh: BCA / Mandiri / BNI / BRI"
                  />
                  <Input
                    label="Nomor Rekening"
                    value={destAccount}
                    onChangeText={setDestAccount}
                    placeholder="Contoh: 8270-3491-8821"
                    keyboardType="numeric"
                  />
                  <Input
                    label="Nama Pemilik Rekening"
                    value={destOwner}
                    onChangeText={setDestOwner}
                    placeholder="Nama sesuai buku tabungan"
                  />
                </View>
              </View>
            )}

            {/* Deposit Escrow Badge Info */}
            {!isWithdraw && (
              <View style={styles.escrowNoticeBox}>
                <ShieldCheck size={18} color="#16A34A" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.escrowNoticeTitle}>
                    Proteksi Escrow Penuh
                  </Text>
                  <Text style={styles.escrowNoticeText}>
                    Dana ditahan di rekening penampung resmi Makarya dan hanya
                    dicairkan ke mahasiswa jika milestone proyek selesai Anda
                    setujui.
                  </Text>
                </View>
              </View>
            )}

            {/* Currency Input & Presets */}
            <CurrencyInput
              label={`Nominal ${isWithdraw ? "Penarikan" : "Deposit"}`}
              placeholder="100.000"
              value={nominal}
              onChangeValue={(val) => setNominal(String(val))}
              quickNominals={[50000, 100000, 250000, 500000, 1000000]}
              helperText={`Minimal transaksi: Rp ${isWithdraw ? "25.000" : "50.000"}`}
              required
            />

            {/* Actions */}
            <View style={styles.sheetActionsRow}>
              <Button
                title="Batal"
                variant="secondary"
                size="md"
                onPress={onClose}
                style={{ flex: 1 }}
              />
              <Button
                title={isWithdraw ? "Konfirmasi Tarik" : "Konfirmasi Deposit"}
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
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "flex-end",
  },
  backdropPressable: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "88%",
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  sheetGrabber: {
    width: 36,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  sheetSub: {
    fontSize: 12.5,
    fontFamily: FONTS.regular,
    color: "#64748B",
    marginTop: 3,
    lineHeight: 18,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetBody: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 16,
  },
  bankSection: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  bankSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  bankSectionTitle: {
    fontSize: 13.5,
    fontFamily: FONTS.semiBold,
    color: "#1E293B",
  },
  bankInputsGroup: {
    gap: 10,
  },
  escrowNoticeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(236, 253, 245, 0.85)",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 16,
    padding: 14,
  },
  escrowNoticeTitle: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: "#065F46",
    marginBottom: 2,
  },
  escrowNoticeText: {
    fontSize: 11.5,
    fontFamily: FONTS.regular,
    color: "#047857",
    lineHeight: 16,
  },
  sheetActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
});
