import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { X, Sparkles } from "lucide-react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { terbilangRupiah, formatNumberDots } from "../../utils/terbilang";

export function CurrencyInput({
  label,
  value,
  onChangeValue,
  placeholder = "0",
  helperText,
  error,
  required = false,
  showTerbilang = true,
  quickNominals,
  style,
  disabled = false,
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);

  // Parse raw numeric string for calculations and parent callback
  const rawNumericString = String(value || "").replace(/\D/g, "");
  const numericVal = rawNumericString ? parseInt(rawNumericString, 10) : 0;
  const displayFormatted = formatNumberDots(rawNumericString);
  const terbilangText =
    showTerbilang && numericVal > 0 ? terbilangRupiah(numericVal) : "";

  const handleChangeText = (text) => {
    const cleanDigits = text.replace(/\D/g, "");
    const num = cleanDigits ? parseInt(cleanDigits, 10) : 0;
    if (onChangeValue) {
      onChangeValue(
        cleanDigits ? num : "",
        cleanDigits ? formatNumberDots(cleanDigits) : "",
      );
    }
  };

  const handleClear = () => {
    if (onChangeValue) {
      onChangeValue("", "");
    }
  };

  const handleQuickSelect = (nominal) => {
    if (onChangeValue) {
      onChangeValue(nominal, formatNumberDots(nominal));
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.requiredStar}>*</Text>}
        </View>
      )}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
          disabled && styles.inputDisabled,
        ]}
      >
        {/* Prefix Rp Badge */}
        <View style={styles.prefixBadge}>
          <Text style={styles.prefixText}>Rp</Text>
        </View>

        <TextInput
          value={displayFormatted}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textDim}
          keyboardType="numeric"
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.input}
          {...rest}
        />

        {/* Clear Button */}
        {displayFormatted.length > 0 && !disabled && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearBtn}
            activeOpacity={0.7}
          >
            <X size={13} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Terbilang Live Preview */}
      {terbilangText ? (
        <View style={styles.terbilangRow}>
          <Sparkles
            size={11}
            color={COLORS.brandIndigo}
            style={{ marginTop: 2 }}
          />
          <Text style={styles.terbilangText} numberOfLines={2}>
            {terbilangText}
          </Text>
        </View>
      ) : null}

      {/* Quick Nominal Chips */}
      {Array.isArray(quickNominals) && quickNominals.length > 0 && (
        <View style={styles.chipsRow}>
          {quickNominals.map((nom) => {
            const isSelected = numericVal === nom;
            return (
              <TouchableOpacity
                key={nom}
                onPress={() => handleQuickSelect(nom)}
                style={[styles.chipBtn, isSelected && styles.chipBtnActive]}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
                >
                  {formatNumberDots(nom)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Error or Helper text */}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 4,
  },
  label: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  requiredStar: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: "700",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgSurface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    paddingLeft: 4,
    paddingRight: 12,
    height: 50,
  },
  inputFocused: {
    borderColor: COLORS.brandIndigo,
    backgroundColor: "#FFFFFF",
    shadowColor: COLORS.brandIndigo,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: "#FEF2F2",
  },
  inputDisabled: {
    opacity: 0.6,
    backgroundColor: COLORS.canvasSoft,
  },
  prefixBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 11,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  prefixText: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.brandIndigo,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    paddingVertical: 0,
    letterSpacing: 0.5,
  },
  clearBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  terbilangRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
    marginTop: 5,
    paddingHorizontal: 4,
  },
  terbilangText: {
    flex: 1,
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.brandIndigo,
    fontStyle: "italic",
    lineHeight: 15,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  chipBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  chipBtnActive: {
    backgroundColor: COLORS.brandIndigoLight,
    borderColor: COLORS.brandIndigo,
  },
  chipText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    fontFamily: FONTS.bodyBold,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  errorText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.danger,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "600",
  },
  helperText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    marginLeft: 4,
  },
});
