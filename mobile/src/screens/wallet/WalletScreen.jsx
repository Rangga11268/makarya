import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  StatusBar,
} from "react-native";
import { FONTS } from "../../theme/fonts";
import { COLORS } from "../../theme/colors";
import { OrganicRibbonBackground } from "../../components/ui/OrganicRibbonBackground";
import { Header, HeaderCircleButton } from "../../components/ui/Header";
import { walletApi } from "../../api";
import * as WebBrowser from "expo-web-browser";
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
        `Minimal transaksi adalah ${formatCurrency(minNominal)}`,
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
          `Pencairan honor ${formatCurrency(num)} berhasil diajukan ke ${destBank} (${destAccount})!`,
          "success",
        );
      } else {
        const topUpRes = await walletApi.requestTopUp({ nominal: num });
        const resData = topUpRes.data;
        if (resData?.redirect_url) {
          showToast("Membuka gerbang pembayaran Midtrans...", "info");
          try {
            await WebBrowser.openBrowserAsync(resData.redirect_url);
            if (resData.order_id) {
              const syncRes = await walletApi
                .syncStatus(resData.order_id)
                .catch(() => null);
              if (
                syncRes?.data?.status === "SETTLEMENT" ||
                syncRes?.data?.status === "SUCCESS"
              ) {
                showToast(
                  `Deposit saldo proyek ${formatCurrency(num)} berhasil masuk!`,
                  "success",
                );
              } else {
                showToast(
                  "Transaksi diproses. Saldo akan otomatis bertambah setelah pembayaran selesai diverifikasi.",
                  "info",
                );
              }
            }
          } catch (browserErr) {
            console.log("Browser flow note:", browserErr);
          }
        }
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
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Global Atmospheric Ambient Canvas */}
      <OrganicRibbonBackground height={480} />

      {/* Top Header: Standar Desain Makarya Mobile */}
      <Header
        title="Dompet Digital"
        subtitle="100% Proteksi Escrow"
        leftAction={
          <HeaderCircleButton
            onPress={() => {
              if (navigation?.canGoBack && navigation.canGoBack()) {
                navigation.goBack();
              } else {
                loadWallet();
              }
            }}
            icon={
              navigation?.canGoBack && navigation.canGoBack()
                ? ArrowLeft
                : SlidersHorizontal
            }
          />
        }
        rightAction={
          <HeaderCircleButton
            onPress={() => {
              setTxType(isMahasiswa ? "WITHDRAW" : "TOPUP");
              setTxModal(true);
            }}
            icon={Plus}
          />
        }
      />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[styles.content, responsiveContainerStyle]}
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
  scrollArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
