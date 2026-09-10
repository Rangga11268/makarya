import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FONTS } from "../../theme/fonts";
import { COLORS } from "../../theme/colors";
import { formatCurrency } from "../../utils/formatCurrency";
import { AlertCircle, CheckCircle2 } from "lucide-react-native";

export function PricingSuggester({ category, budget }) {
  const estimates = {
    DESIGN: { min: 150000, max: 500000, label: "Desain Grafis & Logo" },
    UIUX: { min: 300000, max: 1000000, label: "UI/UX App & Web" },
    PEMROGRAMAN: { min: 500000, max: 1500000, label: "Website & Coding" },
    VIDEO: { min: 200000, max: 600000, label: "Video Promosi Reels" },
    COPYWRITING: { min: 100000, max: 350000, label: "Copywriting & Artikel" },
    ADMIN_DATA: { min: 100000, max: 300000, label: "Admin & Excel" },
  };

  const currentEst = estimates[category] || estimates.DESIGN;
  const numBudget = parseInt(budget, 10) || 0;

  const isTooLow = numBudget > 0 && numBudget < currentEst.min;
  const isOptimal = numBudget >= currentEst.min && numBudget <= currentEst.max;
  const isAboveEst = numBudget > currentEst.max && numBudget <= 2000000;
  const isOverMax = numBudget > 2000000;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.headerMicroLabel}>PANDUAN ESTIMASI PASAR</Text>
          <Text style={styles.title} numberOfLines={1}>
            {currentEst.label}
          </Text>
        </View>
        <View style={styles.rangePill}>
          <Text style={styles.range}>
            {formatCurrency(currentEst.min)} - {formatCurrency(currentEst.max)}
          </Text>
        </View>
      </View>

      {isTooLow && (
        <View style={[styles.banner, styles.bannerWarn]}>
          <AlertCircle size={14} color={COLORS.warning} />
          <Text style={styles.bannerTextWarn}>
            Budget di bawah estimasi wajar. Mahasiswa mungkin kurang berminat
            melamar.
          </Text>
        </View>
      )}

      {isOptimal && (
        <View style={[styles.banner, styles.bannerSuccess]}>
          <CheckCircle2 size={14} color={COLORS.success} />
          <Text style={styles.bannerTextSuccess}>
            Budget optimal! Menarik minat talenta mahasiswa terbaik.
          </Text>
        </View>
      )}

      {isOverMax && (
        <View style={[styles.banner, styles.bannerDanger]}>
          <AlertCircle size={14} color={COLORS.danger} />
          <Text style={styles.bannerTextDanger}>
            Melebihi batas pagu anggaran platform (Maksimal Rp 2.000.000).
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  titleWrap: {
    flex: 1,
    minWidth: 130,
  },
  headerMicroLabel: {
    fontFamily: FONTS.displayBold,
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  title: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 12,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  rangePill: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  range: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  bannerWarn: {
    backgroundColor: COLORS.warningBg,
  },
  bannerSuccess: {
    backgroundColor: COLORS.successBg,
  },
  bannerDanger: {
    backgroundColor: COLORS.dangerBg,
  },
  bannerTextWarn: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.warning,
    flexShrink: 1,
  },
  bannerTextSuccess: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.success,
    flexShrink: 1,
    fontWeight: "600",
  },
  bannerTextDanger: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.danger,
    flexShrink: 1,
  },
});
