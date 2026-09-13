import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { FONTS } from "../../../theme/fonts";
import { Plus } from "lucide-react-native";

export function WalletQuickNominals({
  isMahasiswa,
  quickOptions,
  onSelectNominal,
  onCustomNominal,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          {isMahasiswa ? "Pilihan Cepat Tarik Saldo" : "Pilihan Cepat Deposit"}
        </Text>
        <TouchableOpacity onPress={onCustomNominal} activeOpacity={0.7}>
          <Text style={styles.seeMoreText}>Nominal Lain</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Custom Plus Button */}
        <TouchableOpacity
          style={styles.customBtn}
          onPress={onCustomNominal}
          activeOpacity={0.8}
        >
          <View style={styles.plusIconBox}>
            <Plus size={16} color="#2563EB" strokeWidth={2.5} />
          </View>
          <Text style={styles.customBtnText}>Kustom</Text>
        </TouchableOpacity>

        {/* Preset Chips */}
        {quickOptions.map((opt, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.presetChip}
            onPress={() => onSelectNominal(opt.value)}
            activeOpacity={0.8}
          >
            <Text style={styles.chipTagText}>{opt.label}</Text>
            <Text style={styles.chipSubText}>{opt.sub}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  seeMoreText: {
    fontFamily: FONTS.displayBold,
    fontSize: 11.5,
    fontWeight: "600",
    color: "#2563EB",
  },
  scrollContainer: {
    gap: 8,
    paddingRight: 10,
  },
  customBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  plusIconBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  customBtnText: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#1D4ED8",
  },
  presetChip: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  chipTagText: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  chipSubText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "#64748B",
    marginTop: 1,
  },
});
