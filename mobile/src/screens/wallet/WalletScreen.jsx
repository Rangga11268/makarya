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
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { CurrencyInput } from "../../components/ui/CurrencyInput";
import { walletApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { formatStatus } from "../../utils/formatStatus";
import {
  ShieldCheck,
  Lock,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Banknote,
  Eye,
  EyeOff,
  History,
  Building2,
  CheckCircle2,
  ChevronRight,
  ArrowRightLeft,
  SlidersHorizontal,
  CreditCard,
  User,
  ArrowLeft,
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

  // Rekening Bank Tujuan Pencairan (tersinkronisasi dari data profil)
  const [destBank, setDestBank] = useState("Bank Central Asia (BCA)");
  const [destAccount, setDestAccount] = useState("8270-3491-8821");
  const [destOwner, setDestOwner] = useState("Darell Rangga Putra");

  const { showToast } = useToastStore();

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    !user?.role ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

  useEffect(() => {
    if (user) {
      if (user.nama_bank) setDestBank(user.nama_bank);
      if (user.nomor_rekening) setDestAccount(user.nomor_rekening);
      if (user.nama_pemilik_rekening || user.nama_lengkap || user.nama_usaha) {
        setDestOwner(
          user.nama_pemilik_rekening || user.nama_lengkap || user.nama_usaha,
        );
      }
    }
  }, [user]);

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
    const minNominal = txType === "WITHDRAW" ? 25000 : 50000;
    if (!num || num < minNominal) {
      showToast(
        `Minimal transaksi adalah Rp ${formatCurrency(minNominal)}`,
        "danger",
      );
      return;
    }

    if (txType === "WITHDRAW" && num > (wallet?.saldo_aktif || 0)) {
      showToast("Saldo aktif tidak mencukupi untuk penarikan ini", "danger");
      return;
    }

    try {
      setTxLoading(true);
      if (txType === "WITHDRAW") {
        await walletApi.withdraw({
          nominal: num,
          nama_bank: destBank.trim() || "BCA",
          nomor_rekening: destAccount.trim() || "827034918821",
          nama_pemilik: destOwner.trim() || "Darell Rangga Putra",
        });
        showToast(
          `Pencairan honor Rp ${formatCurrency(num)} berhasil diajukan ke ${destBank} (${destAccount})!`,
          "success",
        );
      } else {
        await walletApi.topUp(num);
        showToast(
          `Deposit saldo proyek Rp ${formatCurrency(num)} berhasil!`,
          "success",
        );
      }
      setTxModal(false);
      loadWallet();
    } catch (e) {
      showToast(
        e.response?.data?.detail || "Gagal memproses transaksi",
        "danger",
      );
    } finally {
      setTxLoading(false);
    }
  };

  const filteredHistory = history.filter((tx) => {
    if (historyTab === "IN") return tx.tipe === "TOPUP" || tx.tipe === "PAYOUT";
    if (historyTab === "OUT")
      return tx.tipe === "HOLD" || tx.tipe === "WITHDRAW";
    return true;
  });

  // Quick Top Up Presets (styled like the avatar characters in reference mockup)
  const quickTopUpPresets = [
    {
      id: "p1",
      name: "Warren",
      amount: 50000,
      badge: "50K",
      label: "Rp 50rb",
      bgColor: "#ECFDF5",
      borderColor: "#A7F3D0",
      textColor: "#065F46",
    },
    {
      id: "p2",
      name: "Edwards",
      amount: 100000,
      badge: "100K",
      label: "Rp 100rb",
      bgColor: "#EFF6FF",
      borderColor: "#BFDBFE",
      textColor: "#1E40AF",
    },
    {
      id: "p3",
      name: "Ingrid",
      amount: 250000,
      badge: "250K",
      label: "Rp 250rb",
      bgColor: "#FFFBEB",
      borderColor: "#FDE68A",
      textColor: "#92400E",
    },
    {
      id: "p4",
      name: "Sofia",
      amount: 500000,
      badge: "500K",
      label: "Rp 500rb",
      bgColor: "#FAF5FF",
      borderColor: "#E9D5FF",
      textColor: "#6B21A8",
    },
    {
      id: "p5",
      name: "Alex",
      amount: 1000000,
      badge: "1JT",
      label: "Rp 1 Juta",
      bgColor: "#F1F5F9",
      borderColor: "#CBD5E1",
      textColor: "#334155",
    },
  ];

  // Quick Highlight Transactions for the 3 horizontal cards
  const highlightTransactions = history.slice(0, 3).map((tx, idx) => {
    const isIncome = tx.tipe === "TOPUP" || tx.tipe === "PAYOUT";
    const sampleNames = ["Sofia", "Edwards", "Warren"];
    const name = tx.keterangan
      ? tx.keterangan.slice(0, 14)
      : sampleNames[idx] || "Transaksi";
    return {
      id: tx.id,
      name: name,
      date: formatDate(tx.created_at),
      amount: `${isIncome ? "+" : "-"}${formatCurrency(tx.nominal)}`,
      isIncome: isIncome,
      tx: tx,
    };
  });

  // Default sample highlights if history is currently empty
  const displayHighlights =
    highlightTransactions.length > 0
      ? highlightTransactions
      : [
          {
            id: "s1",
            name: "Sofia",
            date: "April 10, 2025",
            amount: "-Rp 36.950",
            isIncome: false,
          },
          {
            id: "s2",
            name: "Edwards",
            date: "April 05, 2025",
            amount: "-Rp 50.000",
            isIncome: false,
          },
          {
            id: "s3",
            name: "Warren",
            date: "March 25, 2025",
            amount: "+Rp 175.750",
            isIncome: true,
          },
        ];

  const cardHolderName =
    user?.nama_lengkap || user?.nama_usaha || "Aditya Sheral";
  const maskedCardNumber = `•••• •••• ${
    user?.id ? String(user.id).slice(-4) : "5678"
  }`;

  return (
    <View style={styles.container}>
      {/* 1. Header Bar matching reference mockup */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => {
            if (navigation?.canGoBack && navigation.canGoBack()) {
              navigation.goBack();
            } else {
              loadWallet();
            }
          }}
          style={styles.headerCircleBtn}
          activeOpacity={0.7}
        >
          {navigation?.canGoBack && navigation.canGoBack() ? (
            <ArrowLeft size={18} color={COLORS.textDark} />
          ) : (
            <SlidersHorizontal size={18} color={COLORS.textDark} />
          )}
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerMainTitle}>Wallet</Text>
          <Text style={styles.headerSubTitle}>My Cards & Transaction</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setTxType("TOPUP");
            setTxModal(true);
          }}
          style={styles.headerCircleBtn}
          activeOpacity={0.7}
        >
          <Plus size={20} color={COLORS.textDark} strokeWidth={2.5} />
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
            tintColor="#7C3AED"
            colors={["#7C3AED"]}
          />
        }
      >
        {/* 2. Hero Wallet Pocket Component */}
        <View style={styles.walletPocketContainer}>
          {/* Peeking Credit Card (Layer 1 - Top) */}
          <View style={styles.peekingCard}>
            <View style={styles.peekingCardTopRow}>
              <View>
                <Text style={styles.peekingCardUserName} numberOfLines={1}>
                  {cardHolderName}
                </Text>
                <Text style={styles.peekingCardNumber}>
                  {maskedCardNumber}
                </Text>
              </View>

              <View style={styles.peekingCardBrandBox}>
                <Text style={styles.peekingCardBrandVisa}>VISA</Text>
                <Text style={styles.peekingCardValidText}>Valid: 05/29</Text>
              </View>
            </View>
          </View>

          {/* Front Leather Pocket (Layer 2 - Front Card Sleeve) */}
          <View style={styles.frontPocket}>
            {/* Top Pocket Stitched Lip Line */}
            <View style={styles.pocketStitchRim} />

            <View style={styles.pocketInnerContent}>
              <View style={styles.pocketHeaderRow}>
                <Text style={styles.pocketBalanceLabel}>Total Balance</Text>
                <View style={styles.escrowMiniBadge}>
                  <ShieldCheck size={11} color="#34D399" />
                  <Text style={styles.escrowMiniBadgeText}>100% Escrow</Text>
                </View>
              </View>

              <View style={styles.pocketAmountRow}>
                <Text style={styles.pocketAmountText}>
                  {showBalance
                    ? formatCurrency(wallet?.saldo_aktif || 0)
                    : "Rp ••••••••"}
                </Text>
                <Text style={styles.pocketCurrencyText}>IDR</Text>
              </View>

              {/* Pocket Actions Row */}
              <View style={styles.pocketActionsRow}>
                {/* + Add Balance Button */}
                <TouchableOpacity
                  style={styles.addBalancePillBtn}
                  onPress={() => {
                    setTxType("TOPUP");
                    setTxModal(true);
                  }}
                  activeOpacity={0.85}
                >
                  <Plus size={13} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.addBalancePillText}>+ Add Balance</Text>
                </TouchableOpacity>

                {/* Right Action Icons Group */}
                <View style={styles.pocketRightIconGroup}>
                  {/* Tarik Saldo / Transfer Button */}
                  <TouchableOpacity
                    style={styles.pocketGlassIconBtn}
                    onPress={() => {
                      setTxType("WITHDRAW");
                      setTxModal(true);
                    }}
                    activeOpacity={0.8}
                  >
                    <ArrowRightLeft size={15} color="#FFFFFF" />
                  </TouchableOpacity>

                  {/* Eye Toggle Show/Hide Balance Button */}
                  <TouchableOpacity
                    style={styles.pocketGlassIconBtn}
                    onPress={() => setShowBalance(!showBalance)}
                    activeOpacity={0.8}
                  >
                    {showBalance ? (
                      <Eye size={15} color="#FFFFFF" />
                    ) : (
                      <EyeOff size={15} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 3. Escrow Locked & Verified Bank Banner */}
        <View style={styles.escrowBankStrip}>
          <View style={styles.escrowLockedCard}>
            <View style={styles.escrowLockIconBox}>
              <Lock size={14} color="#6366F1" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.escrowLockedLabel}>Escrow Terkunci</Text>
              <Text style={styles.escrowLockedValue}>
                {showBalance
                  ? formatCurrency(wallet?.saldo_escrow || 0)
                  : "Rp ••••••••"}
              </Text>
            </View>
          </View>

          <View style={styles.verifiedBankStripCard}>
            <View style={styles.bankIconCircle}>
              <Building2 size={14} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text style={styles.bankNameShort}>BCA • 8821</Text>
                <CheckCircle2 size={10} color="#059669" />
              </View>
              <Text style={styles.bankOwnerShort} numberOfLines={1}>
                {destOwner}
              </Text>
            </View>
          </View>
        </View>

        {/* 4. Quick Top-Up Section */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Quick Top-Up</Text>
            <TouchableOpacity
              onPress={() => {
                setTxType("TOPUP");
                setTxModal(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionSeeMoreText}>See more</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickTopUpScroll}
          >
            {/* 1. Add Button with dashed circular border */}
            <TouchableOpacity
              style={styles.quickAddCol}
              onPress={() => {
                setTxType("TOPUP");
                setTxModal(true);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.dashedAddCircle}>
                <Plus size={22} color="#7C3AED" strokeWidth={2.5} />
              </View>
              <Text style={styles.quickAddLabel}>Add</Text>
            </TouchableOpacity>

            {/* 2. Character Presets (Warren, Edwards, Ingrid, Sofia, Alex) */}
            {quickTopUpPresets.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.quickPresetCol}
                onPress={() => {
                  setNominal(String(p.amount));
                  setTxType("TOPUP");
                  setTxModal(true);
                }}
                activeOpacity={0.82}
              >
                <View
                  style={[
                    styles.quickAvatarCircle,
                    {
                      backgroundColor: p.bgColor,
                      borderColor: p.borderColor,
                    },
                  ]}
                >
                  <Text style={[styles.quickAvatarBadgeText, { color: p.textColor }]}>
                    {p.badge}
                  </Text>
                </View>
                <Text style={styles.quickPresetName}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 5. Latest Transactions Section */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Latest Transactions</Text>
            <TouchableOpacity
              onPress={() => setHistoryTab("ALL")}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionSeeMoreText}>See more</Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal Highlight Cards (Mockup 3 Cards) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.highlightCardsScroll}
          >
            {displayHighlights.map((item, idx) => {
              const iconColors = [
                { bg: "#FCE7F3", border: "#FBCFE8", text: "#BE185D" }, // Sofia
                { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8" }, // Edwards
                { bg: "#ECFDF5", border: "#A7F3D0", text: "#047857" }, // Warren
              ];
              const c = iconColors[idx % iconColors.length];

              return (
                <View key={item.id || idx} style={styles.highlightCard}>
                  <View
                    style={[
                      styles.highlightAvatarCircle,
                      { backgroundColor: c.bg, borderColor: c.border },
                    ]}
                  >
                    <User size={18} color={c.text} />
                  </View>

                  <Text style={styles.highlightNameText} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.highlightDateText} numberOfLines={1}>
                    {item.date}
                  </Text>

                  <Text
                    style={[
                      styles.highlightAmountText,
                      { color: item.isIncome ? "#10B981" : "#EF4444" },
                    ]}
                  >
                    {item.amount}
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          {/* Transaction Ledger & Filter Pills */}
          <View style={styles.ledgerHeaderRow}>
            <Text style={styles.ledgerTitle}>Daftar Semua Mutasi</Text>
            <View style={styles.historyTabsRow}>
              {[
                { id: "ALL", label: "Semua" },
                { id: "IN", label: "Masuk (+)" },
                { id: "OUT", label: "Keluar (-)" },
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
          </View>

          {/* Transactions List */}
          {filteredHistory.length === 0 ? (
            <View style={styles.emptyHistoryBox}>
              <History size={28} color={COLORS.textDim} />
              <Text style={styles.emptyHistoryTitle}>
                Belum Ada Mutasi Saldo
              </Text>
              <Text style={styles.emptyHistorySub}>
                Transaksi penerimaan honor & deposit escrow akan otomatis tercatat
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
                        <ArrowDownLeft size={16} color="#059669" />
                      ) : (
                        <ArrowUpRight size={16} color="#DC2626" />
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
                          ? { color: "#059669" }
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

        <View style={{ height: 40 }} />
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
                ? `Honor akan ditransfer ke rekening ${destBank} Anda`
                : "Deposit akan disimpan aman di sistem rekening bersama escrow"}
            </Text>

            {txType === "WITHDRAW" && (
              <View
                style={{
                  marginBottom: 12,
                  padding: 12,
                  backgroundColor: COLORS.bgSurfaceSubtle,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: COLORS.borderDark,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.bodyBold,
                    fontSize: 11,
                    color: COLORS.textDark,
                    marginBottom: 8,
                  }}
                >
                  Rekening Tujuan Pencairan
                </Text>
                <Input
                  label="Nama Bank"
                  value={destBank}
                  onChangeText={setDestBank}
                  placeholder="Contoh: BCA / Mandiri / BNI"
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
                  placeholder="Contoh: Darell Rangga Putra"
                />
              </View>
            )}

            <CurrencyInput
              label={`Nominal ${txType === "TOPUP" ? "Top Up Saldo" : "Penarikan Dana"}`}
              placeholder="100.000"
              value={nominal}
              onChangeValue={(val) => setNominal(String(val))}
              quickNominals={[50000, 100000, 250000, 500000, 1000000]}
              helperText={`Minimal transaksi: Rp ${txType === "WITHDRAW" ? "25.000" : "50.000"}`}
              required
            />

            <View style={styles.modalActionsRow}>
              <Button
                title="Batal"
                variant="secondary"
                size="md"
                onPress={() => setTxModal(false)}
                style={{ flex: 1 }}
              />
              <Button
                title={
                  txType === "WITHDRAW"
                    ? "Konfirmasi Tarik"
                    : "Konfirmasi Deposit"
                }
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
    backgroundColor: "#F8FAFC",
  },

  // 1. Top Header Bar
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 54 : 44,
    paddingBottom: 12,
    backgroundColor: "#F8FAFC",
  },
  headerCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerCenter: {
    alignItems: "center",
  },
  headerMainTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.4,
  },
  headerSubTitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },

  // Scroll Content
  scrollArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },

  // 2. Hero Wallet Pocket Component
  walletPocketContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 4,
  },

  // Layer 1: Peeking Credit Card (Back/Top)
  peekingCard: {
    width: "88%",
    height: 85,
    backgroundColor: "#8B5CF6",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 12,
    marginBottom: -32,
    zIndex: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  peekingCardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  peekingCardUserName: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  peekingCardNumber: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 3,
    letterSpacing: 1,
  },
  peekingCardBrandBox: {
    alignItems: "flex-end",
  },
  peekingCardBrandVisa: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    fontStyle: "italic",
  },
  peekingCardValidText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },

  // Layer 2: Front Leather Wallet Pocket
  frontPocket: {
    width: "100%",
    backgroundColor: "#4C1D95",
    borderRadius: 28,
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 20,
    zIndex: 2,
    shadowColor: "#4C1D95",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  pocketStitchRim: {
    position: "absolute",
    top: 0,
    left: 28,
    right: 28,
    height: 3.5,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  pocketInnerContent: {
    marginTop: 4,
  },
  pocketHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pocketBalanceLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.75)",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  escrowMiniBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.35)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  escrowMiniBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    color: "#34D399",
    fontWeight: "700",
  },
  pocketAmountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginVertical: 6,
  },
  pocketAmountText: {
    fontFamily: FONTS.displayBold,
    fontSize: 27,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.6,
  },
  pocketCurrencyText: {
    fontFamily: FONTS.displayBold,
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  pocketActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  addBalancePillBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  addBalancePillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  pocketRightIconGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pocketGlassIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  // 3. Escrow & Bank Mini Info Strip
  escrowBankStrip: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  escrowLockedCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  escrowLockIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  escrowLockedLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "#64748B",
    fontWeight: "600",
  },
  escrowLockedValue: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: "#0F172A",
    fontWeight: "700",
    marginTop: 1,
  },
  verifiedBankStripCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  bankIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  bankNameShort: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#0F172A",
    fontWeight: "700",
  },
  bankOwnerShort: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "#64748B",
    marginTop: 1,
  },

  // 4. Section Blocks (Quick Top-Up & Latest Transactions)
  sectionBlock: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  sectionSeeMoreText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },

  // Quick Top-Up Horizontal Scroll
  quickTopUpScroll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingRight: 10,
  },
  quickAddCol: {
    alignItems: "center",
    width: 58,
  },
  dashedAddCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#7C3AED",
    backgroundColor: "#FAF5FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  quickAddLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#0F172A",
    fontWeight: "600",
  },
  quickPresetCol: {
    alignItems: "center",
    width: 58,
  },
  quickAvatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  quickAvatarBadgeText: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "800",
  },
  quickPresetName: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#334155",
    fontWeight: "500",
  },

  // 5. Latest Transactions Horizontal Cards (Sofia, Edwards, Warren)
  highlightCardsScroll: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  highlightCard: {
    width: 122,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  highlightAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  highlightNameText: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },
  highlightDateText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "#94A3B8",
    marginVertical: 2,
    textAlign: "center",
  },
  highlightAmountText: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4,
    textAlign: "center",
  },

  // Ledger List Below
  ledgerHeaderRow: {
    flexDirection: "column",
    gap: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  ledgerTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "700",
  },
  historyTabsRow: {
    flexDirection: "row",
    gap: 6,
  },
  historyTabPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  historyTabPillActive: {
    backgroundColor: "#0F172A",
    borderColor: "#0F172A",
  },
  historyTabText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  historyTabTextActive: {
    color: "#FFFFFF",
  },

  // Transaction Card Items
  txItemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
  },
  txItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  txIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  txIconGreen: {
    backgroundColor: "#ECFDF5",
  },
  txIconRed: {
    backgroundColor: "#FEF2F2",
  },
  txInfoGroup: {
    flex: 1,
  },
  txTypeTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  txDescText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "#64748B",
    marginTop: 1,
  },
  txDateText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 9,
    color: "#94A3B8",
    marginTop: 1,
  },
  txItemRight: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  txAmountText: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
  },
  txStatusPill: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 999,
    marginTop: 2,
  },
  txStatusPillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 8,
    color: "#059669",
    fontWeight: "700",
  },

  emptyHistoryBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyHistoryTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    color: "#0F172A",
    marginTop: 8,
  },
  emptyHistorySub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    maxWidth: 240,
  },

  // 6. Modal Sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    maxHeight: "90%",
  },
  modalTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    marginBottom: 16,
  },
  modalActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
});
