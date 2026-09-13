import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from "react-native";
import { FONTS } from "../../theme/fonts";
import { OrganicRibbonBackground } from "../../components/ui/OrganicRibbonBackground";
import { walletApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { ArrowLeft, SlidersHorizontal, Plus } from "lucide-react-native";
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";

// Modular Sub-Components
import { AppleWalletHeroCard } from "./components/AppleWalletHeroCard";
import { WalletMetricCards } from "./components/WalletMetricCards";
import { WalletQuickNominals } from "./components/WalletQuickNominals";
import { WalletTransactionHistory } from "./components/WalletTransactionHistory";
import { WalletTransactionModal } from "./components/WalletTransactionModal";

const QUICK_NOMINAL_OPTIONS = [
  { label: "50K", value: 50000, sub: "Rp 50rb" },
  { label: "100K", value: 100000, sub: "Rp 100rb" },
  { label: "250K", value: 250000, sub: "Rp 250rb" },
  { label: "500K", value: 500000, sub: "Rp 500rb" },
  { label: "1JT", value: 1000000, sub: "Rp 1 Juta" },
  { label: "2.5JT", value: 2500000, sub: "Rp 2.5 Juta" },
];

export function WalletScreen({ navigation }) {
  const { user } = useAuthStore();
  const { responsiveContainerStyle } = useResponsiveLayout();
  const { showToast } = useToastStore();

  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);

  // Modal & Transaction States
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

  const filteredHistory = useMemo(() => {
    return history.filter((tx) => {
      if (historyTab === "IN")
        return tx.tipe === "TOPUP" || tx.tipe === "PAYOUT";
      if (historyTab === "OUT")
        return tx.tipe === "HOLD" || tx.tipe === "WITHDRAW";
      return true;
    });
  }, [history, historyTab]);

  const displayName =
    user?.nama_lengkap ||
    user?.nama_usaha ||
    (user?.email ? user.email.split("@")[0] : "Pengguna Makarya");

  return (
    <View style={styles.container}>
      <OrganicRibbonBackground height={400} />

      {/* Top Header Bar with Apple Glass Aesthetics */}
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
        contentContainerStyle={[styles.content, responsiveContainerStyle]}
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
        {/* 1. Hero Card: Apple Titanium & Midnight Glass Card */}
        <AppleWalletHeroCard
          wallet={wallet}
          user={user}
          isMahasiswa={isMahasiswa}
          showBalance={showBalance}
          onToggleBalance={() => setShowBalance(!showBalance)}
          onPrimaryAction={() => {
            setTxType(isMahasiswa ? "WITHDRAW" : "TOPUP");
            setTxModal(true);
          }}
          onSecondaryAction={() => {
            setTxType(isMahasiswa ? "TOPUP" : "WITHDRAW");
            setTxModal(true);
          }}
        />

        {/* 2. Escrow & Verified Bank Metric Cards */}
        <WalletMetricCards
          wallet={wallet}
          user={user}
          showBalance={showBalance}
          displayName={displayName}
        />

        {/* 3. Quick Nominals Chips */}
        <WalletQuickNominals
          isMahasiswa={isMahasiswa}
          quickOptions={QUICK_NOMINAL_OPTIONS}
          onSelectNominal={(val) => {
            setNominal(String(val));
            setTxType(isMahasiswa ? "WITHDRAW" : "TOPUP");
            setTxModal(true);
          }}
          onCustomNominal={() => {
            setTxType(isMahasiswa ? "WITHDRAW" : "TOPUP");
            setTxModal(true);
          }}
        />

        {/* 4. Transaction History with Apple Segmented Control */}
        <WalletTransactionHistory
          history={history}
          filteredHistory={filteredHistory}
          historyTab={historyTab}
          onTabChange={setHistoryTab}
        />

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* 5. Transaction Modal (Withdraw & Deposit Sheet) */}
      <WalletTransactionModal
        visible={txModal}
        onClose={() => setTxModal(false)}
        txType={txType}
        isMahasiswa={isMahasiswa}
        destBank={destBank}
        setDestBank={setDestBank}
        destAccount={destAccount}
        setDestAccount={setDestAccount}
        destOwner={destOwner}
        setDestOwner={setDestOwner}
        nominal={nominal}
        setNominal={setNominal}
        onSubmit={handleTransaction}
        loading={txLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 54 : 34,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(226, 232, 240, 0.7)",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  headerCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(241, 245, 249, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerMainTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  headerSubTitle: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: "#64748B",
    marginTop: 1,
  },
  scrollArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
