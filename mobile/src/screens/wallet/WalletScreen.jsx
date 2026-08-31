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
import { Badge } from "../../components/ui/Badge";
import { walletApi } from "../../api";
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
} from "lucide-react-native";

export function WalletScreen() {
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topUpModal, setTopUpModal] = useState(false);
  const [nominal, setNominal] = useState("500000");
  const [topUpLoading, setTopUpLoading] = useState(false);

  const { showToast } = useToastStore();

  const loadWallet = async () => {
    try {
      setLoading(true);
      const [wRes, hRes] = await Promise.all([
        walletApi.getMe(),
        walletApi.getHistory(),
      ]);
      setWallet(wRes.data);
      setHistory(hRes.data);
    } catch (e) {
      // fallback
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
      showToast("Minimal deposit saldo adalah Rp 50.000", "danger");
      return;
    }

    try {
      setTopUpLoading(true);
      const res = await walletApi.topUp(num);
      showToast(
        `Deposit Rp ${formatCurrency(num)} berhasil diproses!`,
        "success",
      );
      setTopUpModal(false);
      loadWallet();
    } catch (e) {
      showToast("Gagal memproses deposit", "danger");
    } finally {
      setTopUpLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Dompet & Rekening Bersama"
        subtitle="Audit saldo aktif dan proteksi dana escrow proyek Anda"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadWallet}
            tintColor={COLORS.accentLime}
          />
        }
      >
        {/* Card Saldo Aktif */}
        <View style={styles.cardActive}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircleLime}>
              <Wallet size={18} color="#000" />
            </View>
            <Text style={styles.cardLabelLime}>Saldo Aktif UMKM</Text>
          </View>
          <Text style={styles.cardAmountLime}>
            {formatCurrency(wallet?.saldo_aktif || 0)}
          </Text>
          <Text style={styles.cardDescLime}>
            Saldo siap digunakan untuk mengunci pembayaran proyek mahasiswa
            (*Escrow Deposit*).
          </Text>

          <Button
            title="Deposit Saldo UMKM"
            variant="dark"
            size="md"
            icon={<Plus size={16} color={COLORS.textWhite} />}
            onPress={() => setTopUpModal(true)}
            style={{ marginTop: 14 }}
          />
        </View>

        {/* Card Saldo Escrow */}
        <View style={styles.cardEscrow}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircleCyan}>
              <Lock size={18} color="#000" />
            </View>
            <Text style={styles.cardLabelCyan}>Saldo Terkunci di Escrow</Text>
          </View>
          <Text style={styles.cardAmountCyan}>
            {formatCurrency(wallet?.saldo_escrow || 0)}
          </Text>
          <Text style={styles.cardDescCyan}>
            Dana aman tersimpan di rekening bersama dan hanya cair setelah Anda
            menyetujui hasil deliverable.
          </Text>
        </View>

        {/* Audit Trail History */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Riwayat Mutasi Saldo</Text>

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
                    {tx.tipe === "TOPUP" ? (
                      <ArrowDownLeft size={16} color={COLORS.accentLime} />
                    ) : (
                      <ArrowUpRight size={16} color={COLORS.accentCyan} />
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
                      tx.tipe === "HOLD" && { color: COLORS.textMuted },
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

      {/* Modal Top-Up */}
      <Modal visible={topUpModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Deposit Saldo UMKM</Text>
            <Text style={styles.modalSub}>
              Pilih atau masukkan nominal top-up saldo
            </Text>

            <Input
              label="Nominal Deposit (Rp)"
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
    padding: 20,
    paddingBottom: 100,
  },
  cardActive: {
    backgroundColor: COLORS.accentLime,
    borderRadius: 26,
    padding: 20,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  iconCircleLime: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabelLime: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(0,0,0,0.6)",
    textTransform: "uppercase",
  },
  cardAmountLime: {
    fontSize: 30,
    fontWeight: "900",
    color: "#000",
    letterSpacing: -0.5,
  },
  cardDescLime: {
    fontSize: 11,
    color: "rgba(0,0,0,0.7)",
    marginTop: 4,
    lineHeight: 16,
  },
  cardEscrow: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 24,
  },
  iconCircleCyan: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(123, 252, 236, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabelCyan: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textMuted,
    textTransform: "uppercase",
  },
  cardAmountCyan: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.accentCyan,
    letterSpacing: -0.5,
  },
  cardDescCyan: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },
  historySection: {
    marginTop: 6,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textWhite,
    marginBottom: 14,
  },
  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.cardDark,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 10,
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
    backgroundColor: COLORS.bgDark,
    alignItems: "center",
    justifyContent: "center",
  },
  txType: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textWhite,
  },
  txDate: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  txNominal: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.accentLime,
  },
  txDesc: {
    fontSize: 10,
    color: COLORS.textMuted,
    maxWidth: 120,
    marginTop: 1,
  },
  emptyBox: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.cardDark,
    borderRadius: 20,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.textWhite,
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
    backgroundColor: COLORS.cardDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  nomChipActive: {
    backgroundColor: COLORS.accentLime,
    borderColor: COLORS.accentLime,
  },
  nomText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "700",
  },
  nomTextActive: {
    color: "#000",
    fontWeight: "800",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
  },
});
