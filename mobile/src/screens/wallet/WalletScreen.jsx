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
import { COLORS } from "../../theme/colors";
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
} from "lucide-react-native";

export function WalletScreen() {
  const { user } = useAuthStore();
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
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
        walletApi.getMe().catch(() => ({ data: { saldo_aktif: 0, saldo_escrow: 0 } })),
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

  const handleTopUp = async () => {
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
        "success"
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
        title={isMahasiswa ? "Dompet Honor Mahasiswa" : "Dompet & Rekening Bersama"}
        subtitle={
          isMahasiswa
            ? "Saldo honor pengerjaan & pencairan dana rekening escrow"
            : "Audit saldo aktif dan proteksi dana escrow proyek Anda"
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadWallet}
            tintColor={COLORS.brandIndigo}
            colors={[COLORS.brandIndigo]}
          />
        }
      >
        {/* Card Saldo Aktif */}
        <View style={styles.cardActive}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircleIndigo}>
              <Wallet size={18} color={COLORS.brandIndigo} />
            </View>
            <Text style={styles.cardLabel}>
              {isMahasiswa ? "Saldo Siap Ditarik" : "Saldo Aktif UMKM"}
            </Text>
          </View>

          <Text style={styles.cardAmount}>
            {formatCurrency(wallet?.saldo_aktif || 0)}
          </Text>
          <Text style={styles.cardDesc}>
            {isMahasiswa
              ? "Honor yang telah disetujui klien dan siap dicairkan ke rekening bank Anda."
              : "Saldo siap dialokasikan untuk mengunci pembayaran proyek mahasiswa (Escrow Deposit)."}
          </Text>

          <Button
            title={isMahasiswa ? "Tarik Honor ke Rekening" : "Deposit Saldo UMKM"}
            variant="lime"
            size="md"
            icon={
              isMahasiswa ? (
                <Banknote size={16} color="#FFF" />
              ) : (
                <Plus size={16} color="#FFF" />
              )
            }
            onPress={() => setTopUpModal(true)}
            style={{ marginTop: 14 }}
          />
        </View>

        {/* Card Saldo Escrow */}
        <View style={styles.cardEscrow}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircleCyan}>
              <Lock size={18} color={COLORS.brandCyan} />
            </View>
            <Text style={styles.cardLabelCyan}>Saldo Terkunci di Escrow</Text>
          </View>
          <Text style={styles.cardAmountCyan}>
            {formatCurrency(wallet?.saldo_escrow || 0)}
          </Text>
          <Text style={styles.cardDesc}>
            {isMahasiswa
              ? "Honor proyek yang sedang berjalan, tersimpan aman di rekening bersama dan cair otomatis saat disetujui."
              : "Dana aman tersimpan di rekening bersama dan hanya cair setelah Anda menyetujui hasil pengerjaan."}
          </Text>
        </View>

        {/* Audit Trail History */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Riwayat Mutasi Transaksi</Text>

          {history.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                Belum ada riwayat transaksi keuangan.
              </Text>
            </View>
          ) : (
            history.map((tx) => (
              <View key={tx.id} style={styles.txRow}>
                <View style={styles.txLeft}>
                  <View style={styles.txIcon}>
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

      {/* Modal Transaksi */}
      <Modal visible={topUpModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>
              {isMahasiswa ? "Tarik Honor Mahasiswa" : "Deposit Saldo UMKM"}
            </Text>
            <Text style={styles.modalSub}>
              {isMahasiswa
                ? "Masukkan nominal honor yang ingin dicairkan"
                : "Pilih atau masukkan nominal top-up saldo escrow"}
            </Text>

            <Input
              label="Nominal (Rp)"
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
                variant="dark"
                size="md"
                onPress={() => setTopUpModal(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Konfirmasi"
                variant="lime"
                size="md"
                onPress={handleTopUp}
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
  cardActive: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  iconCircleIndigo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(79, 70, 229, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardAmount: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  cardDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },
  cardEscrow: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  iconCircleCyan: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(14, 165, 233, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabelCyan: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardAmountCyan: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.brandCyan,
    letterSpacing: -0.5,
  },
  historySection: {
    marginTop: 6,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 12,
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
    elevation: 1,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  txLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  txIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  txType: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  txDate: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  txNominal: {
    fontSize: 14,
    fontWeight: "800",
  },
  txDesc: {
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
    fontSize: 12,
    color: COLORS.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.textDark,
  },
  modalSub: {
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  nomChipActive: {
    backgroundColor: COLORS.brandIndigo,
    borderColor: COLORS.brandIndigo,
  },
  nomText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "700",
  },
  nomTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
  },
});
