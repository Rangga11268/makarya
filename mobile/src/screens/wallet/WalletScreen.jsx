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
  Wallet,
  AlertCircle,
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

  // Rekening Bank Tujuan Pencairan (tersinkronisasi dari database profil)
  const [destBank, setDestBank] = useState(user?.nama_bank || "BCA");
  const [destAccount, setDestAccount] = useState(user?.nomor_rekening || "");
  const [destOwner, setDestOwner] = useState(
    user?.nama_pemilik_rekening || user?.nama_lengkap || user?.nama_usaha || "",
  );

  const { showToast } = useToastStore();

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    (!user?.role &&
      (user?.email?.includes(".ac.id") || user?.email === "darell@ubsi.ac.id"));

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

    if (txType === "WITHDRAW" && (!destAccount.trim() || !destOwner.trim())) {
      showToast("Nomor rekening dan nama pemilik wajib diisi", "danger");
      return;
    }

    try {
      setTxLoading(true);
      if (txType === "WITHDRAW") {
        await walletApi.withdraw({
          nominal: num,
          nama_bank: destBank.trim() || "BCA",
          nomor_rekening: destAccount.trim(),
          nama_pemilik: destOwner.trim(),
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

  // Real Top Up Nominal Presets
  const quickNominalOptions = [
    { label: "50K", value: 50000, sub: "Rp 50rb" },
    { label: "100K", value: 100000, sub: "Rp 100rb" },
    { label: "250K", value: 250000, sub: "Rp 250rb" },
    { label: "500K", value: 500000, sub: "Rp 500rb" },
    { label: "1JT", value: 1000000, sub: "Rp 1 Juta" },
    { label: "2.5JT", value: 2500000, sub: "Rp 2.5 Juta" },
  ];

  // Dynamic Cardholder data from user session/database
  const displayName =
    user?.nama_lengkap ||
    user?.nama_usaha ||
    (user?.email ? user.email.split("@")[0] : "Pengguna Makarya");

  const displayUserRole = isMahasiswa ? "TALENTA MAHASISWA" : "KLIEN UMKM";
  const memberSince = user?.created_at
    ? `Sejak ${formatDate(user.created_at)}`
    : "Akun Terverifikasi";

  const userCardId = user?.id
    ? `•••• •••• ${String(user.id).slice(-4).padStart(4, "0")}`
    : "•••• •••• 8821";

  const hasBankAccount = Boolean(user?.nomor_rekening && user?.nama_bank);

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
            <ArrowLeft size={18} color="#0F172A" />
          ) : (
            <SlidersHorizontal size={18} color="#0F172A" />
          )}
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerMainTitle}>Dompet Digital</Text>
          <Text style={styles.headerSubTitle}>
            Kartu Escrow & Riwayat Mutasi
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setTxType(isMahasiswa ? "WITHDRAW" : "TOPUP");
            setTxModal(true);
          }}
          style={styles.headerCircleBtn}
          activeOpacity={0.7}
        >
          <Plus size={20} color="#0F172A" strokeWidth={2.5} />
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
            tintColor="#4F46E5"
            colors={["#4F46E5"]}
          />
        }
      >
        {/* 2. Sleek Cardholder Wallet Pocket Component */}
        <View style={styles.walletPocketContainer}>
          {/* Peeking Card (Layer 1 - Top) */}
          <View style={styles.peekingCard}>
            <View style={styles.peekingCardTopRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.peekingCardRoleTag}>{displayUserRole}</Text>
                <Text style={styles.peekingCardUserName} numberOfLines={1}>
                  {displayName}
                </Text>
                <Text style={styles.peekingCardNumber}>{userCardId}</Text>
              </View>

              <View style={styles.peekingCardBrandBox}>
                <Text style={styles.peekingCardBrandText}>MAKARYA</Text>
                <Text style={styles.peekingCardValidText}>{memberSince}</Text>
              </View>
            </View>
          </View>

          {/* Front Card Sleeve (Layer 2 - Deep Royal Indigo Leather Pocket) */}
          <View style={styles.frontPocket}>
            {/* Top Pocket Stitched Rim Detail */}
            <View style={styles.pocketStitchRim} />

            <View style={styles.pocketInnerContent}>
              <View style={styles.pocketHeaderRow}>
                <Text style={styles.pocketBalanceLabel}>
                  {isMahasiswa ? "Saldo Siap Ditarik" : "Saldo Aktif UMKM"}
                </Text>
                <View style={styles.escrowMiniBadge}>
                  <ShieldCheck size={11} color="#34D399" />
                  <Text style={styles.escrowMiniBadgeText}>
                    Garansi Escrow 100%
                  </Text>
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
                {/* Primary Action Button */}
                <TouchableOpacity
                  style={styles.addBalancePillBtn}
                  onPress={() => {
                    setTxType(isMahasiswa ? "WITHDRAW" : "TOPUP");
                    setTxModal(true);
                  }}
                  activeOpacity={0.85}
                >
                  <Plus size={13} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.addBalancePillText}>
                    {isMahasiswa ? "Tarik Honor" : "Tambah Saldo"}
                  </Text>
                </TouchableOpacity>

                {/* Right Action Icons */}
                <View style={styles.pocketRightIconGroup}>
                  {/* Secondary Action: TopUp for Mhs, Withdraw for UMKM */}
                  <TouchableOpacity
                    style={styles.pocketGlassIconBtn}
                    onPress={() => {
                      setTxType(isMahasiswa ? "TOPUP" : "WITHDRAW");
                      setTxModal(true);
                    }}
                    activeOpacity={0.8}
                  >
                    <ArrowRightLeft size={15} color="#FFFFFF" />
                  </TouchableOpacity>

                  {/* Eye Toggle Show/Hide Balance */}
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

        {/* 3. Escrow Locked & Real Bank Account Strip */}
        <View style={styles.escrowBankStrip}>
          <View style={styles.escrowLockedCard}>
            <View style={styles.escrowLockIconBox}>
              <Lock size={14} color="#4F46E5" />
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
              {hasBankAccount ? (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Text style={styles.bankNameShort}>
                      {user.nama_bank} • {String(user.nomor_rekening).slice(-4)}
                    </Text>
                    <CheckCircle2 size={10} color="#059669" />
                  </View>
                  <Text style={styles.bankOwnerShort} numberOfLines={1}>
                    {user.nama_pemilik_rekening || displayName}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.bankNameShort}>
                    Rekening Belum Diatur
                  </Text>
                  <Text style={styles.bankOwnerShort}>
                    Atur saat tarik saldo
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* 4. Quick Top-Up / Deposit Section */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              {isMahasiswa
                ? "Pilihan Cepat Tarik Saldo"
                : "Pilihan Cepat Deposit"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setTxType(isMahasiswa ? "WITHDRAW" : "TOPUP");
                setTxModal(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionSeeMoreText}>Nominal Lain</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickTopUpScroll}
          >
            {/* Custom Add Button with Dashed Border */}
            <TouchableOpacity
              style={styles.quickAddCol}
              onPress={() => {
                setTxType(isMahasiswa ? "WITHDRAW" : "TOPUP");
                setTxModal(true);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.dashedAddCircle}>
                <Plus size={22} color="#4F46E5" strokeWidth={2.5} />
              </View>
              <Text style={styles.quickAddLabel}>Kustom</Text>
            </TouchableOpacity>

            {/* Quick Preset Nominal Chips */}
            {quickNominalOptions.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.quickPresetCol}
                onPress={() => {
                  setNominal(String(item.value));
                  setTxType(isMahasiswa ? "WITHDRAW" : "TOPUP");
                  setTxModal(true);
                }}
                activeOpacity={0.82}
              >
                <View style={styles.quickAvatarCircle}>
                  <Text style={styles.quickAvatarBadgeText}>{item.label}</Text>
                </View>
                <Text style={styles.quickPresetName}>{item.sub}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 5. Latest Transactions Section (Real API Data) */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Riwayat Mutasi Terkini</Text>
            <Text style={styles.sectionSeeMoreText}>
              {history.length} Transaksi
            </Text>
          </View>

          {/* Horizontal Highlight Cards (Top 3 Real Transactions from Database) */}
          {history.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.highlightCardsScroll}
            >
              {history.slice(0, 4).map((item, idx) => {
                const isIncome =
                  item.tipe === "TOPUP" || item.tipe === "PAYOUT";
                return (
                  <View key={item.id || idx} style={styles.highlightCard}>
                    <View
                      style={[
                        styles.highlightAvatarCircle,
                        {
                          backgroundColor: isIncome ? "#ECFDF5" : "#EFF6FF",
                          borderColor: isIncome ? "#A7F3D0" : "#BFDBFE",
                        },
                      ]}
                    >
                      {isIncome ? (
                        <ArrowDownLeft size={16} color="#059669" />
                      ) : (
                        <ArrowUpRight size={16} color="#4F46E5" />
                      )}
                    </View>

                    <Text style={styles.highlightNameText} numberOfLines={1}>
                      {formatStatus(item.tipe)}
                    </Text>
                    <Text style={styles.highlightDateText} numberOfLines={1}>
                      {formatDate(item.created_at)}
                    </Text>

                    <Text
                      style={[
                        styles.highlightAmountText,
                        { color: isIncome ? "#059669" : "#0F172A" },
                      ]}
                    >
                      {isIncome ? "+" : "-"} {formatCurrency(item.nominal)}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          )}

          {/* Transaction Ledger Header & Segment Tabs */}
          <View style={styles.ledgerHeaderRow}>
            <View style={styles.historyTabsRow}>
              {[
                { id: "ALL", label: "Semua" },
                { id: "IN", label: "Penerimaan (+)" },
                { id: "OUT", label: "Pengeluaran (-)" },
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
              <History size={26} color={COLORS.textDim} />
              <Text style={styles.emptyHistoryTitle}>
                Belum Ada Mutasi Transaksi
              </Text>
              <Text style={styles.emptyHistorySub}>
                Penerimaan honor pengerjaan proyek dan deposit saldo escrow akan
                tercatat otomatis di sini.
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
                        <ArrowUpRight size={16} color="#4F46E5" />
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
                        isIncome ? { color: "#059669" } : { color: "#0F172A" },
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
                ? `Dana akan ditransfer langsung ke rekening ${destBank || "bank"} Anda`
                : "Deposit tersimpan aman di rekening bersama Makarya (Garansi 100% Escrow)"}
            </Text>

            {txType === "WITHDRAW" && (
              <View style={styles.withdrawBankBox}>
                <Text style={styles.withdrawBankTitle}>
                  Rekening Tujuan Pencairan
                </Text>
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
            )}

            <CurrencyInput
              label={`Nominal ${txType === "TOPUP" ? "Deposit" : "Penarikan"}`}
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
    paddingBottom: 14,
    backgroundColor: "#F8FAFC",
  },
  headerCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  headerCenter: {
    alignItems: "center",
  },
  headerMainTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    fontWeight: "800",
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
    paddingTop: 10,
    paddingBottom: 40,
  },

  // 2. Sleek Cardholder Wallet Pocket Component
  walletPocketContainer: {
    alignItems: "center",
    marginBottom: 18,
    marginTop: 4,
  },

  // Layer 1: Peeking Card (Back/Top)
  peekingCard: {
    width: "90%",
    height: 90,
    backgroundColor: "#312E81", // Deep indigo
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 12,
    marginBottom: -38,
    zIndex: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  peekingCardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  peekingCardRoleTag: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    color: "#A5B4FC",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 2,
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
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
    letterSpacing: 1.2,
  },
  peekingCardBrandBox: {
    alignItems: "flex-end",
  },
  peekingCardBrandText: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  peekingCardValidText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
  },

  // Layer 2: Front Pocket (Deep Midnight Slate/Indigo Leather)
  frontPocket: {
    width: "100%",
    backgroundColor: "#0F172A", // Slate 900: Makarya signature brand
    borderRadius: 26,
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 20,
    zIndex: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  pocketStitchRim: {
    position: "absolute",
    top: 0,
    left: 24,
    right: 24,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
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
    color: "rgba(255, 255, 255, 0.7)",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  escrowMiniBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
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
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.6,
  },
  pocketCurrencyText: {
    fontFamily: FONTS.displayBold,
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.65)",
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
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.22)",
    paddingVertical: 8,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  // 3. Escrow & Bank Mini Strip
  escrowBankStrip: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
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

  // 4. Quick Top-Up / Deposit Section
  sectionBlock: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  sectionSeeMoreText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: "#4F46E5",
    fontWeight: "600",
  },

  quickTopUpScroll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingRight: 10,
  },
  quickAddCol: {
    alignItems: "center",
    width: 56,
  },
  dashedAddCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#4F46E5",
    backgroundColor: "#EEF2FF",
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
    width: 56,
  },
  quickAvatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  quickAvatarBadgeText: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
  },
  quickPresetName: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "#64748B",
    fontWeight: "500",
  },

  // 5. Latest Transactions Horizontal Cards
  highlightCardsScroll: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  highlightCard: {
    width: 124,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  highlightAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  highlightNameText: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },
  highlightDateText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 9,
    color: "#94A3B8",
    marginVertical: 2,
    textAlign: "center",
  },
  highlightAmountText: {
    fontFamily: FONTS.displayBold,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
    textAlign: "center",
  },

  // Ledger Filter Pills
  ledgerHeaderRow: {
    marginBottom: 10,
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
    borderRadius: 16,
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
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  txIconGreen: {
    backgroundColor: "#ECFDF5",
  },
  txIconRed: {
    backgroundColor: "#EEF2FF",
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
    borderRadius: 18,
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
    marginBottom: 14,
  },
  withdrawBankBox: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  withdrawBankTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#0F172A",
    marginBottom: 8,
  },
  modalActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
});
