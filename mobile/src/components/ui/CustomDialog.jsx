import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { useDialogStore } from "../../store/dialogStore";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  HelpCircle,
  ShieldAlert,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

export function CustomDialog() {
  const {
    isOpen,
    title,
    message,
    type,
    confirmText,
    cancelText,
    showCancel,
    onConfirm,
    onCancel,
    closeDialog,
  } = useDialogStore();

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    closeDialog();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    closeDialog();
  };

  const getThemeConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle2 size={32} color="#10B981" strokeWidth={2.5} />,
          bgIcon: "#ECFDF5",
          btnColor: COLORS.brandIndigo,
          badgeColor: "#10B981",
        };
      case "danger":
      case "error":
        return {
          icon: <XCircle size={32} color="#EF4444" strokeWidth={2.5} />,
          bgIcon: "#FEF2F2",
          btnColor: "#EF4444",
          badgeColor: "#EF4444",
        };
      case "warning":
        return {
          icon: <AlertTriangle size={32} color="#F59E0B" strokeWidth={2.5} />,
          bgIcon: "#FFFBEB",
          btnColor: COLORS.brandIndigo,
          badgeColor: "#F59E0B",
        };
      case "confirm":
        return {
          icon: (
            <HelpCircle
              size={32}
              color={COLORS.brandIndigo}
              strokeWidth={2.5}
            />
          ),
          bgIcon: COLORS.brandIndigoLight,
          btnColor: COLORS.brandIndigo,
          badgeColor: COLORS.brandIndigo,
        };
      case "info":
      default:
        return {
          icon: <Info size={32} color={COLORS.brandIndigo} strokeWidth={2.5} />,
          bgIcon: COLORS.brandIndigoLight,
          btnColor: COLORS.brandIndigo,
          badgeColor: COLORS.brandIndigo,
        };
    }
  };

  const theme = getThemeConfig();

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialogCard}>
          {/* Top Floating SVG Icon Circle */}
          <View style={[styles.iconCircle, { backgroundColor: theme.bgIcon }]}>
            {theme.icon}
          </View>

          {/* Dialog Title & Message */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Action Buttons */}
          <View style={styles.btnRow}>
            {showCancel && (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleCancel}
                activeOpacity={0.75}
              >
                <Text style={styles.cancelBtnText}>
                  {cancelText || "Batal"}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.confirmBtn,
                { backgroundColor: theme.btnColor },
                !showCancel && { flex: 1 },
              ]}
              onPress={handleConfirm}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmBtnText}>{confirmText || "Oke"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.68)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  dialogCard: {
    width: Math.min(width - 48, 380),
    backgroundColor: COLORS.bgSurface,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    ...SHADOWS.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.textDark,
    textAlign: "center",
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  message: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 6,
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: COLORS.canvasSoft,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  cancelBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  confirmBtn: {
    flex: 1.2,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.sm,
  },
  confirmBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});
