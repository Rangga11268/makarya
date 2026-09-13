import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import Svg, {
  Rect,
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import { FONTS } from "../../../theme/fonts";
import { COLORS } from "../../../theme/colors";
import { formatCurrency } from "../../../utils/formatCurrency";
import {
  Eye,
  EyeOff,
  ArrowUpRight,
  Plus,
  ArrowRightLeft,
  ShieldCheck,
} from "lucide-react-native";

/**
 * Apple EMV Chip & Contactless Wave Vector
 */
function AppleEmvChip() {
  return (
    <Svg width={38} height={28} viewBox="0 0 38 28" fill="none">
      <Defs>
        <LinearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FDE68A" />
          <Stop offset="50%" stopColor="#F59E0B" />
          <Stop offset="100%" stopColor="#D97706" />
        </LinearGradient>
      </Defs>
      <Rect
        x="1"
        y="1"
        width="36"
        height="26"
        rx="5"
        fill="url(#chipGrad)"
        stroke="#B45309"
        strokeWidth="0.75"
      />
      <Path
        d="M1 10H14M1 18H14M24 10H37M24 18H37M14 1V27M24 1V27"
        stroke="#78350F"
        strokeWidth="0.7"
        strokeOpacity="0.4"
      />
      <Rect
        x="14"
        y="8"
        width="10"
        height="12"
        rx="2"
        fill="#FEF3C7"
        fillOpacity="0.6"
      />
    </Svg>
  );
}

function AppleContactlessWave() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.5 16.5C9.5 15.5 10 14 10 12C10 10 9.5 8.5 8.5 7.5"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Path
        d="M12.5 19C14.5 17 15.5 14.5 15.5 12C15.5 9.5 14.5 7 12.5 5"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Path
        d="M16.5 21.5C19.5 19 21 15.5 21 12C21 8.5 19.5 5 16.5 2.5"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * AppleWalletHeroCard
 * Premium Titanium & Midnight Glass Card for Makarya Escrow Wallet
 */
export function AppleWalletHeroCard({
  wallet,
  user,
  isMahasiswa,
  showBalance,
  onToggleBalance,
  onPrimaryAction,
  onSecondaryAction,
}) {
  const displayName =
    user?.nama_lengkap ||
    user?.nama_usaha ||
    (user?.email ? user.email.split("@")[0] : "Pengguna Makarya");

  const displayUserRole = isMahasiswa ? "TALENTA MAHASISWA" : "KLIEN UMKM";
  const userCardId = user?.id
    ? `•••• •••• ${String(user.id).slice(-4).padStart(4, "0")}`
    : "•••• •••• 8821";

  return (
    <View style={styles.cardContainer}>
      {/* Background SVG Glass Sheen */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Svg width="100%" height="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="titaniumBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#0B1120" />
              <Stop offset="45%" stopColor="#0F172A" />
              <Stop offset="100%" stopColor="#1E293B" />
            </LinearGradient>
            <LinearGradient id="sheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.12" />
              <Stop offset="60%" stopColor="#818CF8" stopOpacity="0.04" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" rx={24} fill="url(#titaniumBg)" />
          <Rect width="100%" height="100%" rx={24} fill="url(#sheen)" />
        </Svg>
      </View>

      {/* Top Header: EMV Chip & Brand Title */}
      <View style={styles.topRow}>
        <View style={styles.chipWaveRow}>
          <AppleEmvChip />
          <AppleContactlessWave />
        </View>

        <View style={styles.brandBox}>
          <Text style={styles.brandName}>MAKARYA</Text>
          <View style={styles.escrowPill}>
            <ShieldCheck size={10} color="#34D399" />
            <Text style={styles.escrowPillText}>ESCROW CARD</Text>
          </View>
        </View>
      </View>

      {/* Middle: Big Saldo Balance Display */}
      <View style={styles.balanceSection}>
        <View style={styles.balanceLabelRow}>
          <Text style={styles.balanceLabel}>
            {isMahasiswa ? "SALDO SIAP DITARIK" : "SALDO AKTIF PROYEK"}
          </Text>
          <TouchableOpacity
            onPress={onToggleBalance}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            {showBalance ? (
              <Eye size={15} color="rgba(255,255,255,0.65)" />
            ) : (
              <EyeOff size={15} color="rgba(255,255,255,0.65)" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.amountRow}>
          <Text style={styles.currencyPrefix}>Rp</Text>
          <Text style={styles.amountValue}>
            {showBalance
              ? formatCurrency(wallet?.saldo_aktif || 0).replace(/^Rp\s?/, "")
              : "••••••••"}
          </Text>
          <Text style={styles.currencySuffix}>IDR</Text>
        </View>
      </View>

      {/* Cardholder Info & Number */}
      <View style={styles.cardholderRow}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text style={styles.cardholderRole}>{displayUserRole}</Text>
          <Text style={styles.cardholderName} numberOfLines={1}>
            {displayName}
          </Text>
        </View>
        <Text style={styles.cardNumber}>{userCardId}</Text>
      </View>

      {/* Integrated Apple Glass Quick Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.primaryActionBtn}
          onPress={onPrimaryAction}
          activeOpacity={0.82}
        >
          {isMahasiswa ? (
            <ArrowUpRight size={16} color="#FFFFFF" strokeWidth={2.4} />
          ) : (
            <Plus size={16} color="#FFFFFF" strokeWidth={2.4} />
          )}
          <Text style={styles.primaryActionText}>
            {isMahasiswa ? "Tarik Saldo" : "Tambah Saldo"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryActionBtn}
          onPress={onSecondaryAction}
          activeOpacity={0.82}
        >
          <ArrowRightLeft size={14} color="rgba(255,255,255,0.85)" />
          <Text style={styles.secondaryActionText}>
            {isMahasiswa ? "Deposit" : "Tarik Dana"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  chipWaveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  brandBox: {
    alignItems: "flex-end",
  },
  brandName: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1.5,
  },
  escrowPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 3,
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.3)",
  },
  escrowPillText: {
    fontFamily: FONTS.displayBold,
    fontSize: 9,
    fontWeight: "700",
    color: "#34D399",
    letterSpacing: 0.5,
  },
  balanceSection: {
    marginBottom: 16,
  },
  balanceLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 4,
  },
  balanceLabel: {
    fontFamily: FONTS.displayBold,
    fontSize: 10.5,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.65)",
    letterSpacing: 0.8,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
  },
  currencyPrefix: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.8)",
  },
  amountValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  currencySuffix: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.55)",
    marginLeft: 3,
  },
  cardholderRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 14,
  },
  cardholderRole: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 9.5,
    color: "rgba(255, 255, 255, 0.5)",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  cardholderName: {
    fontFamily: FONTS.displayBold,
    fontSize: 13.5,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.95)",
    marginTop: 2,
  },
  cardNumber: {
    fontFamily: FONTS.displayBold,
    fontSize: 12.5,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
    letterSpacing: 1,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  primaryActionBtn: {
    flex: 1.6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryActionText: {
    fontFamily: FONTS.displayBold,
    fontSize: 12.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  secondaryActionText: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
});
