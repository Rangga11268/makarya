import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { FONTS } from "../../../theme/fonts";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import { formatStatus } from "../../../utils/formatStatus";
import { AppleGlossyCard } from "../../../components/ui/AppleGlossyCard";
import {
  ArrowDownLeft,
  ArrowUpRight,
  History,
  ShieldCheck,
} from "lucide-react-native";

export function WalletTransactionHistory({
  history,
  filteredHistory,
  historyTab,
  onTabChange,
}) {
  const tabs = [
    { id: "ALL", label: "Semua" },
    { id: "IN", label: "Pemasukan" },
    { id: "OUT", label: "Pengeluaran" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Riwayat Mutasi Terkini</Text>
        <Text style={styles.countText}>{history.length} Transaksi</Text>
      </View>

      {/* Segmented Filter Control */}
      <View style={styles.segmentedFilter}>
        {tabs.map((tab) => {
          const isActive = historyTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.segmentedTabItem,
                isActive && styles.segmentedTabItemActive,
              ]}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.segmentedTabText,
                  isActive && styles.segmentedTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Transaction List Cards */}
      {filteredHistory.length === 0 ? (
        <AppleGlossyCard style={styles.emptyCard}>
          <View style={styles.emptyIconBox}>
            <History size={24} color="#94A3B8" />
          </View>
          <Text style={styles.emptyTitle}>Belum Ada Mutasi</Text>
          <Text style={styles.emptyDesc}>
            Penerimaan honor pengerjaan proyek dan deposit saldo escrow akan
            tercatat otomatis di sini.
          </Text>
        </AppleGlossyCard>
      ) : (
        <View style={styles.txList}>
          {filteredHistory.map((tx, idx) => {
            const isIncome = tx.tipe === "TOPUP" || tx.tipe === "PAYOUT";
            return (
              <AppleGlossyCard key={tx.id || idx} style={styles.txItemCard}>
                <View style={styles.txItemLeft}>
                  <View
                    style={[
                      styles.txIconBox,
                      isIncome ? styles.txIconIncome : styles.txIconOutcome,
                    ]}
                  >
                    {isIncome ? (
                      <ArrowDownLeft
                        size={16}
                        color="#059669"
                        strokeWidth={2.2}
                      />
                    ) : (
                      <ArrowUpRight
                        size={16}
                        color="#2563EB"
                        strokeWidth={2.2}
                      />
                    )}
                  </View>

                  <View style={styles.txMetaInfo}>
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
                      isIncome ? styles.txAmountIncome : styles.txAmountOutcome,
                    ]}
                  >
                    {isIncome ? "+" : "-"} {formatCurrency(tx.nominal)}
                  </Text>
                  <View style={styles.txStatusPill}>
                    <ShieldCheck size={9} color="#059669" />
                    <Text style={styles.txStatusText}>Berhasil</Text>
                  </View>
                </View>
              </AppleGlossyCard>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontFamily: FONTS.displayBold,
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  countText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
  },
  segmentedFilter: {
    flexDirection: "row",
    backgroundColor:
      Platform.OS === "android" ? "#F1F5F9" : "rgba(15, 23, 42, 0.05)",
    borderRadius: 13,
    padding: 3,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.8)",
    marginBottom: 12,
  },
  segmentedTabItem: {
    flex: 1,
    paddingVertical: 7,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  segmentedTabItemActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 1,
  },
  segmentedTabText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11.5,
    color: "#64748B",
  },
  segmentedTabTextActive: {
    fontFamily: FONTS.displaySemiBold,
    color: "#2563EB",
    fontWeight: "700",
  },
  emptyCard: {
    alignItems: "center",
    padding: 24,
    borderRadius: 20,
  },
  emptyIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  emptyTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13.5,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  emptyDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 16,
    maxWidth: "85%",
  },
  txList: {
    gap: 10,
  },
  txItemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 13,
    borderRadius: 18,
  },
  txItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    flex: 1,
    marginRight: 10,
  },
  txIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  txIconIncome: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  txIconOutcome: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  txMetaInfo: {
    flex: 1,
  },
  txTypeTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 12.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  txDescText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  txDateText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 2,
  },
  txItemRight: {
    alignItems: "flex-end",
  },
  txAmountText: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "800",
  },
  txAmountIncome: {
    color: "#059669",
  },
  txAmountOutcome: {
    color: "#0F172A",
  },
  txStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    marginTop: 4,
  },
  txStatusText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 9.5,
    fontWeight: "600",
    color: "#166534",
  },
});
