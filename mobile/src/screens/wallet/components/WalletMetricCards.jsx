import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FONTS } from "../../../theme/fonts";
import { formatCurrency } from "../../../utils/formatCurrency";
import { AppleGlossyCard } from "../../../components/ui/AppleGlossyCard";
import {
  AppleEscrowLockIcon,
  AppleShieldVerifiedIcon,
} from "../../../components/ui/AppleGlossyIcons";

export function WalletMetricCards({ wallet, user, showBalance, displayName }) {
  const hasBankAccount = Boolean(user?.nomor_rekening && user?.nama_bank);

  return (
    <View style={styles.container}>
      {/* 1. Escrow Locked Stat Card */}
      <AppleGlossyCard style={styles.metricCard}>
        <View style={styles.cardHeader}>
          <AppleEscrowLockIcon size={18} />
          <Text style={styles.metricLabel}>ESCROW TERKUNCI</Text>
        </View>
        <Text style={styles.metricAmount} numberOfLines={1}>
          {showBalance
            ? formatCurrency(wallet?.saldo_escrow || 0)
            : "Rp ••••••••"}
        </Text>
        <Text style={styles.metricSubtext}>
          Aman di rekening bersama hingga deliverable disetujui
        </Text>
      </AppleGlossyCard>

      {/* 2. Verified Bank Account Stat Card */}
      <AppleGlossyCard style={styles.metricCard}>
        <View style={styles.cardHeader}>
          <AppleShieldVerifiedIcon size={18} />
          <Text style={styles.metricLabel}>REKENING PENCAIRAN</Text>
        </View>
        {hasBankAccount ? (
          <>
            <Text style={styles.bankNameText} numberOfLines={1}>
              {user.nama_bank} • {String(user.nomor_rekening).slice(-4)}
            </Text>
            <Text style={styles.metricSubtext} numberOfLines={1}>
              a.n {user.nama_pemilik_rekening || displayName}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.bankNameText} numberOfLines={1}>
              Belum Terhubung
            </Text>
            <Text style={styles.metricSubtext}>
              Atur saat ajukan penarikan saldo
            </Text>
          </>
        )}
      </AppleGlossyCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  metricCard: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  metricLabel: {
    fontFamily: FONTS.displayBold,
    fontSize: 9.5,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.5,
  },
  metricAmount: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  bankNameText: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  metricSubtext: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10.5,
    color: "#64748B",
    lineHeight: 14,
  },
});
