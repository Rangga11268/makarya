import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { Search, X, SlidersHorizontal } from "lucide-react-native";

export function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = "Cari...",
  showFilterBtn = false,
  onFilterPress,
  activeFilterCount = 0,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Search size={16} color={COLORS.brandIndigo} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={COLORS.textDim}
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
        />
        {value?.length > 0 && (
          <TouchableOpacity onPress={onClear} activeOpacity={0.7}>
            <X size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {showFilterBtn && (
        <TouchableOpacity
          style={[
            styles.filterBtn,
            activeFilterCount > 0 && styles.filterBtnActive,
          ]}
          activeOpacity={0.8}
          onPress={onFilterPress}
        >
          <SlidersHorizontal
            size={18}
            color={activeFilterCount > 0 ? "#FFFFFF" : COLORS.textDark}
          />
          {activeFilterCount > 0 && (
            <View style={styles.badgeCount}>
              <Text style={styles.badgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.90)",
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.90)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.9)"
        : "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    elevation: Platform.OS === "android" ? 0 : 1,
    gap: 8,
  },
  input: {
    fontFamily: FONTS.bodyMedium,
    flex: 1,
    fontSize: 13,
    color: COLORS.textDark,
    paddingVertical: 2,
    fontWeight: "500",
    backgroundColor: "transparent",
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.90)",
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.90)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.9)"
        : "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    elevation: Platform.OS === "android" ? 0 : 1,
    position: "relative",
  },
  filterBtnActive: {
    backgroundColor: COLORS.brandIndigo,
    borderColor: COLORS.brandIndigo,
  },
  badgeCount: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#F43F5E",
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    fontFamily: FONTS.bodyBold,
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
});
