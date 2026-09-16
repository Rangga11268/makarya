import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { ChevronDown, Check, X, Search, Edit3 } from "lucide-react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

export function SelectWithOther({
  label,
  options = [],
  value = "",
  onChangeText,
  placeholder = "Pilih salah satu...",
  otherPlaceholder = "Ketik pilihan Anda...",
  otherLabel = "Lainnya (Ketik Sendiri)",
  title = "Pilih Opsi",
  icon: Icon = null,
  helperText = "",
  containerStyle,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isPredefined = options.includes(value);
  const isOtherSelected = !isPredefined && Boolean(value);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    return options.filter((opt) =>
      opt.toLowerCase().includes(searchQuery.trim().toLowerCase()),
    );
  }, [options, searchQuery]);

  const handleSelectOption = (opt) => {
    onChangeText?.(opt);
    setModalVisible(false);
    setSearchQuery("");
  };

  const handleSelectOther = () => {
    // If not already a custom string, set empty string so user can type
    if (isPredefined) {
      onChangeText?.("");
    }
    setModalVisible(false);
    setSearchQuery("");
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <View style={styles.labelRow}>
          {Icon && (
            <Icon
              size={14}
              color={COLORS.brandIndigo}
              style={{ marginRight: 6 }}
            />
          )}
          <Text style={styles.label}>{label}</Text>
        </View>
      ) : null}

      {/* Select Trigger Box */}
      <TouchableOpacity
        style={[styles.triggerBox, isOtherSelected && styles.triggerBoxActive]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.triggerText, !value && styles.triggerPlaceholder]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <ChevronDown size={18} color={COLORS.textMuted} />
      </TouchableOpacity>

      {/* If "Other" is active or custom value is entered, show editable field */}
      {isOtherSelected && (
        <View style={styles.customInputWrapper}>
          <Edit3
            size={15}
            color={COLORS.brandIndigo}
            style={styles.customInputIcon}
          />
          <TextInput
            style={styles.customTextInput}
            value={value}
            onChangeText={onChangeText}
            placeholder={otherPlaceholder}
            placeholderTextColor={COLORS.textDim}
          />
        </View>
      )}

      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}

      {/* Bottom Sheet Picker Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />

          <View style={styles.sheetContainer}>
            <View style={styles.sheetGrabber} />

            {/* Modal Header */}
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>{title}</Text>
                <Text style={styles.sheetSub}>
                  Pilih dari daftar atau ketik manual jika tidak tersedia
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                <X size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchWrapper}>
              <Search
                size={16}
                color={COLORS.textMuted}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Cari..."
                placeholderTextColor={COLORS.textDim}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <X size={14} color={COLORS.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* List */}
            <FlatList
              data={filteredOptions}
              keyExtractor={(item, index) => item + index}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    styles.otherOptionItem,
                    isOtherSelected && styles.optionItemActive,
                  ]}
                  onPress={handleSelectOther}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionTextRow}>
                    <Text style={[styles.optionText, styles.otherOptionText]}>
                      {otherLabel}
                    </Text>
                  </View>
                  {isOtherSelected && (
                    <Check size={18} color={COLORS.brandIndigo} />
                  )}
                </TouchableOpacity>
              }
              renderItem={({ item }) => {
                const isSelected = value === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemActive,
                    ]}
                    onPress={() => handleSelectOption(item)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <Check size={18} color={COLORS.brandIndigo} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  triggerBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.bgSurfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  triggerBoxActive: {
    borderColor: COLORS.brandIndigo,
  },
  triggerText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: COLORS.textDark,
    flex: 1,
    marginRight: 8,
  },
  triggerPlaceholder: {
    color: COLORS.textDim,
  },
  customInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(37, 99, 235, 0.4)",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  customInputIcon: {
    marginRight: 8,
  },
  customTextInput: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: COLORS.textDark,
    paddingVertical: 10,
  },
  helperText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "80%",
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  sheetGrabber: {
    width: 36,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  sheetTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  sheetSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: COLORS.canvasSoft,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: COLORS.textDark,
    padding: 0,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 4,
  },
  otherOptionItem: {
    backgroundColor: "rgba(37, 99, 235, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(37, 99, 235, 0.15)",
    marginBottom: 8,
  },
  optionItemActive: {
    backgroundColor: "rgba(37, 99, 235, 0.1)",
  },
  optionTextRow: {
    flex: 1,
  },
  optionText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: COLORS.textDark,
  },
  otherOptionText: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.brandIndigo,
    fontWeight: "600",
  },
  optionTextActive: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
});
