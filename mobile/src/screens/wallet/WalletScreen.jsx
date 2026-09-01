import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { Header } from "../../components/ui/Header";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { walletApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { formatStatus } from "../../utils/formatStatus";
import {
  Wallet,
  ShieldCheck,
  Lock,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Banknote,
  Eye,
  EyeOff,
  History,
  TrendingUp,
} from "lucide-react-native";

export function WalletScreen() {
  const { user } = useAuthStore();
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [topUpModal, setTopUpModal] = useState(false);
  const [nominal, setNominal] = useState("500000");
  const [topUpLoading, setTopUpLoading] = useState(false);

  const { showToast } = useToastStore();

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

  const loadWallet = async () => {
    try {
      setLoading(true);
      const [wRes, hRes] = await Promise.all([
        walletApi
          .getMe()
          .catch(() => ({ data: { saldo_aktif: 0, saldo_escrow: 0 } })),
        walletApi.getHistory().catch(() => ({ data: [] })),
      ]);
      setWallet(wRes.data);
      setHistory(Array.isArray(hRes.data) ? hRes.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const handleTransaction = async () => {
    const num = parseInt(nominal, 10);
    if (!num || num < 50000) {
      showToast("Minimal transaksi adalah Rp 50.000", "danger");
      return;
    }

    try {
      setTopUpLoading(true);
      await walletApi.topUp(num);
      showToast(
        isMahasiswa
          ? `Permintaan pencairan honor Rp ${formatCurrency(num)} diproses!`
          : `Deposit Rp ${formatCurrency(num)} berhasil!`,
        "success",
      );
      setTopUpModal(false);
      loadWallet();
    } catch (e) {
      showToast("Gagal memproses transaksi", "danger");
    } finally {
      setTopUpLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={
          isMahasiswa ? "Dompet Honor Mahasiswa" : "Dompet & Rekening Escrow"
        }
        subtitle={
          isMahasiswa
            ? "Saldo honor pengerjaan & audit pencairan rekening escrow"
            : "Manajemen saldo deposit dan proteksi pembayaran proyek"
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadWallet}
            tintColor={COLORS.brandIndigo}
            colors={[COLORS.brandIndigo]}
          />
        }
      >
        {/* 1. Main Fintech Balance Card */}
        <View style={styles.heroBalanceCard}>
          <View style={styles.balanceHeader}>
            <View style={styles.balanceTag}>
              <Wallet size={14} color="#FFFFFF" />
              <Text style={styles.balanceTagText}>
                {isMahasiswa ? "Saldo Siap Ditarik" : "Saldo Aktif UMKM"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowBalance(!showBalance)}
              style={styles.eyeBtn}
              activeOpacity={0.7}
            >
              {showBalance ? (
                <Eye size={16} color="rgba(255, 255, 255, 0.7)" />
              ) : (
                <EyeOff size={16} color="rgba(255, 255, 255, 0.7)" />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.balanceAmount}>
            {showBalance
              ? formatCurrency(wallet?.saldo_aktif || 0)
              : "Rp ••••••••"}
          </Text>

          <Text style={styles.balanceSubtitle}>
            {isMahasiswa
              ? "Honor yang telah disetujui klien dan siap ditransfer ke rekening Anda."
              : "Saldo aktif siap dialokasikan untuk mengunci pesanan proyek mahasiswa."}
          </Text>

          <TouchableOpacity
            style={styles.heroActionBtn}
            onPress={() => setTopUpModal(true)}
            activeOpacity={0.85}
          >
            {isMahasiswa ? (
              <Banknote size={18} color={COLORS.brandIndigo} />
            ) : (
              <Plus size={18} color={COLORS.brandIndigo} strokeWidth={3} />
            )}
            <Text style={styles.heroActionBtnText}>
              {isMahasiswa ? "Tarik Honor ke Rekening" : "Deposit Saldo UMKM"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 2. Escrow Protection Holding Card */}
        <View style={styles.escrowCard}>
          <View style={styles.escrowHeader}>
            <View style={styles.iconCircleCyan}>
              <Lock size={15} color={COLORS.brandCyan} />
            </View>
            <Text style={styles.escrowLabel}>Saldo Terkunci di Escrow</Text>
          </View>

          <Text style={styles.escrowAmount}>
            {showBalance
              ? formatCurrency(wallet?.saldo_escrow || 0)
              : "Rp ••••••••"}
          </Text>

          <Text style={styles.escrowDesc}>
            {isMahasiswa
              ? "Honor proyek dalam pengerjaan, aman di rekening bersama dan cair otomatis saat disetujui."
              : "Dana aman tersimpan di pihak ketiga dan hanya cair setelah Anda menyetujui hasil deliverable."}
          </Text>
        </View>

        {/* 3. Transaction History Section */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Riwayat Mutasi Saldo</Text>
            <History size={16} color={COLORS.textMuted} />
          </View>

          {history.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                Belum ada riwayat mutasi transaksi keuangan.
              </Text>
            </View>
          ) : (
            history.map((tx) => (
              <View key={tx.id} style={styles.txRow}>
                <View style={styles.txLeft}>
                  <View
                    style={[
                      styles.txIcon,
                      tx.tipe === "TOPUP" || tx.tipe === "PAYOUT"
                        ? styles.txIconGreen
                        : styles.txIconRed,
                    ]}
                  >
                    {tx.tipe === "TOPUP" || tx.tipe === "PAYOUT" ? (
                      <ArrowDownLeft size={16} color={COLORS.success} />
                    ) : (
                      <ArrowUpRight size={16} color={COLORS.danger} />
                    )}
                  </View>
                  <View>
                    <Text style={styles.txType}>{formatStatus(tx.tipe)}</Text>
                    <Text style={styles.txDate}>
                      {formatDate(tx.created_at)}
                    </Text>
                  </View>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={[
                      styles.txNominal,
                      tx.tipe === "HOLD" || tx.tipe === "WITHDRAW"
                        ? { color: COLORS.danger }
                        : { color: COLORS.success },
                    ]}
                  >
                    {tx.tipe === "HOLD" || tx.tipe === "WITHDRAW" ? "-" : "+"}{" "}
                    {formatCurrency(tx.nominal)}
                  </Text>
                  <Text style={styles.txDesc} numberOfLines={1}>
                    {tx.keterangan || "-"}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal Transaksi Top-Up / Penarikan */}
      <Modal visible={topUpModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>
              {isMahasiswa ? "Tarik Honor Mahasiswa" : "Deposit Saldo UMKM"}
            </Text>
            <Text style={styles.modalSub}>
              {isMahasiswa
                ? "Masukkan nominal honor yang ingin dicairkan ke bank Anda"
                : "Pilih atau masukkan nominal top-up saldo escrow proyek"}
            </Text>

            <Input
              label="Nominal Transaksi (Rp)"
              placeholder="500000"
              value={nominal}
              onChangeText={setNominal}
              keyboardType="numeric"
            />

            <View style={styles.quickNominals}>
              {["100000", "250000", "500000", "1000000"].map((n) => (
                <TouchableOpacity
                  key={n}
                  onPress={() => setNominal(n)}
                  style={[
                    styles.nomChip,
                    nominal === n && styles.nomChipActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.nomText,
                      nominal === n && styles.nomTextActive,
                    ]}
                  >
                    {formatCurrency(parseInt(n, 10))}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Batal"
                variant="secondary"
                size="md"
                onPress={() => setTopUpModal(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Konfirmasi"
                variant="brand"
                size="md"
                onPress={handleTransaction}
                loading={topUpLoading}
                style={{ flex: 2 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  heroBalanceCard: {
    backgroundColor: "#1E1B4B", // High-tech Deep Indigo card
    borderRadius: 24,
    padding: 22,
    marginBottom: 14,
    ...SHADOWS.md,
  },
  balanceHeader: {
    fontFamily: FONTS.bodyRegular,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  balanceTag: {
    fontFamily: FONTS.bodyRegular,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  balanceTagText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.75)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  eyeBtn: {
    padding: 4,
  },
  balanceAmount: {
    fontFamily: FONTS.displayBold,
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.8,
    marginVertical: 4,
  },
  balanceSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 18,
    marginBottom: 16,
  },
  heroActionBtn: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 999,
    marginTop: 6,
    ...SHADOWS.sm,
  },
  heroActionBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.brandIndigo,
  },
  escrowCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 20,
    ...SHADOWS.sm,
  },
  escrowHeader: {
    fontFamily: FONTS.bodyRegular,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  iconCircleCyan: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.brandCyanLight,
    alignItems: "center",
    justifyContent: "center",
  },
  escrowLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  escrowAmount: {
    fontFamily: FONTS.displayBold,
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.brandCyan,
    letterSpacing: -0.5,
    marginVertical: 2,
  },
  escrowDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  historySection: {
    marginTop: 4,
  },
  historyHeader: {
    fontFamily: FONTS.bodyRegular,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  historyTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.bgSurface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 10,
    ...SHADOWS.sm,
  },
  txLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  txIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  txIconGreen: {
    backgroundColor: COLORS.successBg,
  },
  txIconRed: {
    backgroundColor: COLORS.dangerBg,
  },
  txType: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  txDate: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  txNominal: {
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
    fontWeight: "800",
  },
  txDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
    maxWidth: 130,
    marginTop: 1,
  },
  emptyBox: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  emptyText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    ...SHADOWS.lg,
  },
  modalTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.textDark,
  },
  modalSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 18,
  },
  quickNominals: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  nomChip: {
    fontFamily: FONTS.bodyRegular,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  nomChipActive: {
    fontFamily: FONTS.bodyRegular,
    backgroundColor: COLORS.brandIndigo,
    borderColor: COLORS.brandIndigo,
  },
  nomText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "700",
  },
  nomTextActive: {
    fontFamily: FONTS.bodyBold,
    color: "#FFFFFF",
    fontWeight: "800",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
  },
});
