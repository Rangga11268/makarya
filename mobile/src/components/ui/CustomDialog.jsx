import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FONTS } from "../../theme/fonts";
import { useDialogStore } from "../../store/dialogStore";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
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
    isDestructive,
    icon: customIcon,
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
      case "danger":
      case "error":
        return {
          icon: <AlertTriangle size={20} color="#DC2626" strokeWidth={2.2} />,
          bgIcon: "rgba(220, 38, 38, 0.08)",
          actionColor: "#DC2626",
        };
      case "success":
        return {
          icon: <CheckCircle2 size={20} color="#059669" strokeWidth={2.2} />,
          bgIcon: "rgba(5, 150, 105, 0.08)",
          actionColor: "#059669",
        };
      case "warning":
        return {
          icon: <AlertTriangle size={20} color="#D97706" strokeWidth={2.2} />,
          bgIcon: "rgba(217, 119, 6, 0.08)",
          actionColor: isDestructive ? "#DC2626" : "#2563EB",
        };
      case "confirm":
        return {
          icon: <ShieldCheck size={20} color="#2563EB" strokeWidth={2.2} />,
          bgIcon: "rgba(37, 99, 235, 0.08)",
          actionColor: isDestructive ? "#DC2626" : "#2563EB",
        };
      case "info":
      default:
        return {
          icon: <Info size={20} color="#2563EB" strokeWidth={2.2} />,
          bgIcon: "rgba(37, 99, 235, 0.08)",
          actionColor: "#2563EB",
        };
    }
  };

  const theme = getThemeConfig();
  const displayIcon = customIcon || theme.icon;

  // iOS layout adapts to stacked action buttons if button labels are long
  const isStacked =
    Boolean(showCancel) &&
    ((cancelText && cancelText.length > 11) ||
      (confirmText && confirmText.length > 13));

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.dialogCard}>
          {/* Content Area */}
          <View style={styles.contentContainer}>
            {displayIcon ? (
              <View
                style={[styles.iconContainer, { backgroundColor: theme.bgIcon }]}
              >
                {displayIcon}
              </View>
            ) : null}

            <Text style={styles.title}>{title}</Text>
            {message ? <Text style={styles.message}>{message}</Text> : null}
          </View>

          {/* iOS Hairline Action Bar */}
          {showCancel ? (
            isStacked ? (
              <View style={styles.actionColumn}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.borderBottomHairline]}
                  onPress={handleConfirm}
                  activeOpacity={0.65}
                >
                  <Text
                    style={[
                      styles.confirmText,
                      { color: isDestructive ? "#DC2626" : theme.actionColor },
                    ]}
                  >
                    {confirmText || "Lanjutkan"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={handleCancel}
                  activeOpacity={0.65}
                >
                  <Text style={styles.cancelText}>{cancelText || "Batal"}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.borderRightHairline]}
                  onPress={handleCancel}
                  activeOpacity={0.65}
                >
                  <Text style={styles.cancelText}>{cancelText || "Batal"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={handleConfirm}
                  activeOpacity={0.65}
                >
                  <Text
                    style={[
                      styles.confirmText,
                      { color: isDestructive ? "#DC2626" : theme.actionColor },
                    ]}
                  >
                    {confirmText || "Oke"}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleConfirm}
                activeOpacity={0.65}
              >
                <Text
                  style={[
                    styles.confirmText,
                    { color: isDestructive ? "#DC2626" : theme.actionColor },
                  ]}
                >
                  {confirmText || "Mengerti"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  dialogCard: {
    width: Math.min(width - 56, 290),
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(15, 23, 42, 0.1)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
  },
  contentContainer: {
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontFamily: FONTS.displayBold,
    fontSize: 16.5,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  message: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    lineHeight: 18.5,
    marginTop: 6,
    paddingHorizontal: 2,
  },
  actionRow: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(15, 23, 42, 0.12)",
    height: 46,
    backgroundColor: "#FFFFFF",
  },
  actionColumn: {
    flexDirection: "column",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(15, 23, 42, 0.12)",
    backgroundColor: "#FFFFFF",
  },
  actionBtn: {
    flex: 1,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  borderRightHairline: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "rgba(15, 23, 42, 0.12)",
  },
  borderBottomHairline: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(15, 23, 42, 0.12)",
  },
  cancelText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 15,
    fontWeight: "500",
    color: "#64748B",
    textAlign: "center",
  },
  confirmText: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
});
