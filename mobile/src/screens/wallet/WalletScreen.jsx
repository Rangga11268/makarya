import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Platform,
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
  Building2,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  CreditCard,
} from "lucide-react-native";

export function WalletScreen({ navigation }) {
  const { user } = useAuthStore();
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [txModal, setTxModal] = useState(false);
  const [txType, setTxType] = useState("WITHDRAW"); // 'WITHDRAW' | 'TOPUP'
  const [nominal, setNominal] = useState("500000");
  const [txLoading, setTxLoading] = useState(false);
  const [historyTab, setHistoryTab] = useState("ALL"); // 'ALL' | 'IN' | 'OUT'

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

    if (txType === "WITHDRAW" && num > (wallet?.saldo_aktif || 0)) {
      showToast("Saldo aktif tidak mencukupi untuk penarikan ini", "danger");
      return;
    }

    try {
      setTxLoading(true);
      await walletApi.topUp(num);
      showToast(
        txType === "WITHDRAW"
          ? `Permintaan pencairan honor Rp ${formatCurrency(num)} berhasil diproses!`
          : `Deposit saldo proyek Rp ${formatCurrency(num)} berhasil!`,
        "success"
      );
      setTxModal(false);
      loadWallet();
    } catch (e) {
      showToast("Gagal memproses transaksi", "danger");
    } finally {
      setTxLoading(false);
    }
  };

  const filteredHistory = history.filter((tx) => {
    if (historyTab === "IN")
      return tx.tipe === "TOPUP" || tx.tipe === "PAYOUT";
    if (historyTab === "OUT")
      return tx.tipe === "HOLD" || tx.tipe === "WITHDRAW";
    return true;
  });

  const totalPayout = history
    .filter((tx) => tx.tipe === "PAYOUT" || tx.tipe === "TOPUP")
    .reduce((acc, curr) => acc + (curr.nominal || 0), 0);

  return (
    <View style={styles.container}>
      {/* 1. Universal Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>
            {isMahasiswa ? "Dompet Honor" : "Dompet & Escrow"}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isMahasiswa
              ? "Saldo honor & pencairan rekening terproteksi"
              : "Saldo deposit & proteksi transaksi proyek"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => loadWallet()}
          style={styles.refreshIconBtn}
          activeOpacity={0.7}
        >
          <History size={18} color={COLORS.textDark} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
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
        {/* 2. Velvet Indigo Fintech Card */}
        <View style={styles.heroCard}>
          {/* Top Pill & Privacy Eye */}
          <View style={styles.heroTopRow}>
            <View style={styles.escrowBadge}>
              <View style={styles.liveGreenDot} />
              <ShieldCheck size={13} color="#34D399" />
              <Text style={styles.escrowBadgeText}>100% Terproteksi Escrow</Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowBalance(!showBalance)}
              style={styles.eyeBtn}
              activeOpacity={0.7}
            >
              {showBalance ? (
                <Eye size={17} color="rgba(255, 255, 255, 0.8)" />
              ) : (
                <EyeOff size={17} color="rgba(255, 255, 255, 0.8)" />
              )}
            </TouchableOpacity>
          </View>

          {/* Big Balance Amount */}
          <Text style={styles.balanceLabel}>
            {isMahasiswa ? "Saldo Siap Ditarik" : "Saldo Aktif UMKM"}
          </Text>
          <Text style={styles.balanceAmountText}>
            {showBalance
              ? formatCurrency(wallet?.saldo_aktif || 0)
              : "Rp ••••••••"}
          </Text>

          <Text style={styles.balanceSubText}>
            {isMahasiswa
              ? "Dana honor aman yang siap dicairkan ke rekening bank Anda"
              : "Saldo aktif siap dialokasikan untuk pengerjaan proyek mahasiswa"}
          </Text>

          {/* Quick Action Buttons Row */}
          <View style={styles.heroActionsRow}>
            <TouchableOpacity
              style={styles.primaryPillBtn}
              onPress={() => {
                setTxType("WITHDRAW");
                setTxModal(true);
              }}
              activeOpacity={0.88}
            >
              <Banknote size={16} color={COLORS.brandIndigo} />
              <Text style={styles.primaryPillBtnText}>Tarik Saldo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryGlassBtn}
              onPress={() => {
                setTxType("TOPUP");
                setTxModal(true);
              }}
              activeOpacity={0.88}
            >
              <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.secondaryGlassBtnText}>
                {isMahasiswa ? "Isi Saldo" : "Deposit Proyek"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Dual Metric Cards (Escrow Holding & Total Payout) */}
        <View style={styles.metricGridRow}>
          {/* Card 1: Escrow Holding */}
          <View style={styles.metricCard}>
            <View style={styles.metricCardTop}>
              <View style={styles.metricIconWrapCyan}>
                <Lock size={15} color={COLORS.brandCyan} />
              </View>
              <Text style={styles.metricCardTag}>Escrow Terkunci</Text>
            </View>
            <Text style={styles.metricCardValue}>
              {showBalance
                ? formatCurrency(wallet?.saldo_escrow || 0)
                : "Rp ••••••••"}
            </Text>
            <Text style={styles.metricCardSub}>
              {isMahasiswa
                ? "Dalam tahap pengerjaan"
                : "Aman di rekening bersama"}
            </Text>
          </View>

          {/* Card 2: Total Settled / Payout */}
          <View style={styles.metricCard}>
            <View style={styles.metricCardTop}>
              <View style={styles.metricIconWrapGreen}>
                <TrendingUp size={15} color={COLORS.success} />
              </View>
              <Text style={styles.metricCardTag}>Total Mutasi</Text>
            </View>
            <Text style={styles.metricCardValue}>
              {showBalance ? formatCurrency(totalPayout) : "Rp ••••••••"}
            </Text>
            <Text style={styles.metricCardSub}>
              {history.length} Transaksi Selesai
            </Text>
          </View>
        </View>

        {/* 4. Registered Bank Account Card */}
        <View style={styles.bankCard}>
          <View style={styles.bankCardLeft}>
            <View style={styles.bankIconCircle}>
              <Building2 size={18} color={COLORS.brandIndigo} />
            </View>
            <View>
              <View style={styles.bankNameRow}>
                <Text style={styles.bankName}>Bank Central Asia (BCA)</Text>
                <View style={styles.verifiedBankBadge}>
                  <CheckCircle2 size={10} color={COLORS.success} />
                  <Text style={styles.verifiedBankText}>Terverifikasi</Text>
                </View>
              </View>
              <Text style={styles.bankAccountNo}>
                8270-3491-8821 • {user?.nama_lengkap || "Darell Rangga"}
              </Text>
            </View>
          </View>
        </View>

        {/* 5. Transaction History Section */}
        <View style={styles.historySection}>
          <View style={styles.historyHeaderRow}>
            <Text style={styles.historyTitle}>Riwayat Mutasi Saldo</Text>
            <Text style={styles.historyCountText}>
              {filteredHistory.length} Transaksi
            </Text>
          </View>

          {/* Segmented History Filter Tabs */}
          <View style={styles.historyTabsRow}>
            {[
              { id: "ALL", label: "Semua" },
              { id: "IN", label: "Penerimaan (+)" },
              { id: "OUT", label: "Penarikan (-)" },
            ].map((tab) => {
              const isActive = historyTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setHistoryTab(tab.id)}
                  style={[
                    styles.historyTabPill,
                    isActive && styles.historyTabPillActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.historyTabText,
                      isActive && styles.historyTabTextActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Transactions List */}
          {filteredHistory.length === 0 ? (
            <View style={styles.emptyHistoryBox}>
              <History size={32} color={COLORS.textDim} />
              <Text style={styles.emptyHistoryTitle}>
                Belum Ada Mutasi Rekening
              </Text>
              <Text style={styles.emptyHistorySub}>
                Transaksi penerimaan honor & deposit proyek akan otomatis tercatat
                di sini.
              </Text>
            </View>
          ) : (
            filteredHistory.map((tx) => {
              const isIncome = tx.tipe === "TOPUP" || tx.tipe === "PAYOUT";
              return (
                <View key={tx.id} style={styles.txItemCard}>
                  <View style={styles.txItemLeft}>
                    <View
                      style={[
                        styles.txIconBox,
                        isIncome ? styles.txIconGreen : styles.txIconRed,
                      ]}
                    >
                      {isIncome ? (
                        <ArrowDownLeft size={16} color={COLORS.success} />
                      ) : (
                        <ArrowUpRight size={16} color={COLORS.danger} />
                      )}
                    </View>
                    <View style={styles.txInfoGroup}>
                      <Text style={styles.txTypeTitle}>
                        {formatStatus(tx.tipe)}
                      </Text>
                      <Text style={styles.txDescText} numberOfLines={1}>
                        {tx.keterangan || "Transaksi Rekening Escrow"}
                      </Text>
                      <Text style={styles.txDateText}>
                        {formatDate(tx.created_at)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.txItemRight}>
                    <Text
                      style={[
                        styles.txAmountText,
                        isIncome
                          ? { color: COLORS.success }
                          : { color: COLORS.textDark },
                      ]}
                    >
                      {isIncome ? "+" : "-"} {formatCurrency(tx.nominal)}
                    </Text>
                    <View style={styles.txStatusPill}>
                      <Text style={styles.txStatusPillText}>Berhasil</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* 6. Transaction Modal (Withdraw / Deposit Sheet) */}
      <Modal visible={txModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>
              {txType === "WITHDRAW"
                ? "Tarik Saldo ke Rekening"
                : isMahasiswa
                  ? "Isi Saldo Dompet"
                  : "Deposit Saldo Proyek"}
            </Text>
            <Text style={styles.modalSub}>
              {txType === "WITHDRAW"
                ? "Honor akan ditransfer ke rekening Bank BCA Anda tanpa potongan"
                : "Deposit akan disimpan aman di sistem rekening bersama escrow"}
            </Text>

            <Input
              label="Nominal Transaksi (Rp)"
              placeholder="500000"
              value={nominal}
              onChangeText={setNominal}
              keyboardType="numeric"
            />

            {/* Quick Chips */}
            <View style={styles.quickNominalsRow}>
              {["100000", "250000", "500000", "1000000"].map((n) => (
                <TouchableOpacity
                  key={n}
                  onPress={() => setNominal(n)}
                  style={[
                    styles.quickNomChip,
                    nominal === n && styles.quickNomChipActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.quickNomText,
                      nominal === n && styles.quickNomTextActive,
                    ]}
                  >
                    {formatCurrency(parseInt(n, 10))}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActionsRow}>
              <Button
                title="Batal"
                variant="secondary"
                size="md"
                onPress={() => setTxModal(false)}
                style={{ flex: 1 }}
              />
              <Button
                title={txType === "WITHDRAW" ? "Konfirmasi Tarik" : "Konfirmasi Deposit"}
                variant="brand"
                size="md"
                onPress={handleTransaction}
                loading={txLoading}
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

  // 1. Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 54 : 44,
    paddingBottom: 12,
    backgroundColor: COLORS.bgSurface,
  },
  headerTitleGroup: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  refreshIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    alignItems: "center",
    justifyContent: "center",
  },

  // Scroll Content
  scrollArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },

  // 2. Velvet Indigo Hero Card
  heroCard: {
    backgroundColor: "#1E1B4B",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#312E81",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  escrowBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  escrowBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: "#34D399",
    fontWeight: "700",
  },
  eyeBtn: {
    padding: 4,
  },
  balanceLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.75)",
  },
  balanceAmountText: {
    fontFamily: FONTS.displayBold,
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.6,
    marginVertical: 4,
  },
  balanceSubText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 18,
    lineHeight: 16,
  },
  heroActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  primaryPillBtn: {
    flex: 1.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingVertical: 11,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryPillBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  secondaryGlassBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 11,
    borderRadius: 999,
  },
  secondaryGlassBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  // 3. Dual Metric Cards
  metricGridRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  metricCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  metricIconWrapCyan: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.brandCyanLight,
    alignItems: "center",
    justifyContent: "center",
  },
  metricIconWrapGreen: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.successBg,
    alignItems: "center",
    justifyContent: "center",
  },
  metricCardTag: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  metricCardValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 2,
  },
  metricCardSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
  },

  // 4. Bank Card
  bankCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 20,
  },
  bankCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bankIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  bankNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bankName: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  verifiedBankBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 999,
  },
  verifiedBankText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    color: COLORS.success,
    fontWeight: "700",
  },
  bankAccountNo: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // 5. Transaction History
  historySection: {
    marginBottom: 20,
  },
  historyHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  historyTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  historyCountText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  historyTabsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  historyTabPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  historyTabPillActive: {
    backgroundColor: COLORS.brandIndigo,
    borderColor: COLORS.brandIndigo,
  },
  historyTabText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  historyTabTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  txItemCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  txItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  txIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  txIconGreen: {
    backgroundColor: COLORS.successBg,
  },
  txIconRed: {
    backgroundColor: COLORS.dangerBg,
  },
  txInfoGroup: {
    flex: 1,
  },
  txTypeTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  txDescText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  txDateText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  txItemRight: {
    alignItems: "flex-end",
  },
  txAmountText: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
  },
  txStatusPill: {
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  txStatusPillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    color: COLORS.success,
    fontWeight: "700",
  },

  emptyHistoryBox: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  emptyHistoryTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    marginTop: 8,
  },
  emptyHistorySub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 4,
    maxWidth: 260,
  },

  // Modal Sheet
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
  quickNominalsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 12,
  },
  quickNomChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  quickNomChipActive: {
    backgroundColor: COLORS.brandIndigoLight,
    borderColor: COLORS.brandIndigo,
  },
  quickNomText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  quickNomTextActive: {
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  modalActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
});
