import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
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
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textDark,
    paddingVertical: 2,
    fontWeight: "500",
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
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
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
});
