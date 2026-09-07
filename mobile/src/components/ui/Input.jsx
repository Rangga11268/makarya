import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { X, Eye, EyeOff } from "lucide-react-native";

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  isPassword = false,
  allowClear = true,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  error,
  helperText,
  required = false,
  prefix,
  suffix,
  icon: Icon,
  style,
  inputStyle,
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isSecure = isPassword ? !showPassword : secureTextEntry;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.requiredStar}>*</Text>}
        </View>
      )}

      <View
        style={[
          styles.inputWrapper,
          multiline && styles.multilineWrapper,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
        ]}
      >
        {Icon && <View style={styles.icon}>{Icon}</View>}

        {prefix && (
          <View style={styles.prefixContainer}>
            <Text style={styles.prefixText}>{prefix}</Text>
          </View>
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textDim}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.input, multiline && styles.multilineInput, inputStyle]}
          {...rest}
        />

        {suffix && (
          <View style={styles.suffixContainer}>
            <Text style={styles.suffixText}>{suffix}</Text>
          </View>
        )}

        {/* 1. Password Eye / EyeOff Toggle */}
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.actionBtn}
            activeOpacity={0.7}
          >
            {showPassword ? (
              <EyeOff size={18} color={COLORS.textMuted} />
            ) : (
              <Eye size={18} color={COLORS.textMuted} />
            )}
          </TouchableOpacity>
        ) : /* 2. Clear Button (Only for non-password fields) */
        allowClear && !multiline && value && value.length > 0 ? (
          <TouchableOpacity
            onPress={() => onChangeText("")}
            style={styles.clearBtn}
            activeOpacity={0.7}
          >
            <X size={13} color={COLORS.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

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
    fontWeight: "600",
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 7,
    letterSpacing: 0.1,
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
    paddingHorizontal: 14,
    minHeight: 48,
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
  multilineWrapper: {
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  icon: {
    marginRight: 10,
  },
  prefixContainer: {
    marginRight: 6,
    paddingRight: 6,
    borderRightWidth: 1,
    borderRightColor: COLORS.borderDark,
  },
  prefixText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12.5,
    color: COLORS.brandIndigo,
  },
  suffixContainer: {
    marginLeft: 6,
    paddingLeft: 6,
  },
  suffixText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textDark,
    fontSize: 14,
    paddingVertical: 12,
    paddingVertical: 11,
    fontWeight: "500",
  },
  multilineInput: {
    height: 90,
    textAlignVertical: "top",
    paddingVertical: 0,
  },
  actionBtn: {
    padding: 6,
    marginLeft: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: "#FEF2F2",
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
