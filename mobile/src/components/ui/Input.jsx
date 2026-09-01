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
      <View
        style={[
          styles.inputWrapper,
          multiline && styles.multilineWrapper,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
        ]}
      >
        {Icon && <View style={styles.icon}>{Icon}</View>}
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
  label: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 7,
    letterSpacing: 0.1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgSurface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    paddingHorizontal: 14,
  },
  inputFocused: {
    borderColor: COLORS.brandIndigo,
    backgroundColor: "#FFFFFF",
  },
  multilineWrapper: {
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textDark,
    fontSize: 14,
    paddingVertical: 12,
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
