import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FONTS } from "../../theme/fonts";
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
} from "lucide-react-native";
import { CustomDialog } from "./CustomDialog";
import {
  showAlert,
  showConfirm,
  useDialogStore,
} from "../../store/dialogStore";

/**
 * Inline Apple/iOS-style Callout Banner
 * Follows /antislop-ui: subtle tinted background, 1px translucent border, clean typography.
 */
export function AlertBanner({
  variant = "info",
  title,
  children,
  icon: CustomIcon,
  style,
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
      case "error":
        return {
          box: styles.dangerBox,
          iconColor: "#DC2626",
          DefaultIcon: AlertCircle,
        };
      case "success":
        return {
          box: styles.successBox,
          iconColor: "#059669",
          DefaultIcon: CheckCircle2,
        };
      case "warning":
        return {
          box: styles.warningBox,
          iconColor: "#D97706",
          DefaultIcon: AlertTriangle,
        };
      case "brand":
        return {
          box: styles.brandBox,
          iconColor: "#2563EB",
          DefaultIcon: ShieldCheck,
        };
      case "info":
      default:
        return {
          box: styles.infoBox,
          iconColor: "#2563EB",
          DefaultIcon: Info,
        };
    }
  };

  const v = getVariantStyles();
  const IconComponent = CustomIcon || v.DefaultIcon;

  return (
    <View style={[styles.baseBox, v.box, style]}>
      <IconComponent size={18} color={v.iconColor} style={styles.icon} />
      <View style={styles.content}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {typeof children === "string" ? (
          <Text style={styles.description}>{children}</Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
}

// Re-export CustomDialog and helpers so Alert can be used both as dialog & banner
export { CustomDialog as AlertModal, showAlert, showConfirm, useDialogStore };
export default CustomDialog;

const styles = StyleSheet.create({
  baseBox: {
    flexDirection: "row",
    gap: 10,
    padding: 13,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "flex-start",
  },
  icon: {
    marginTop: 1.5,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: FONTS.displayBold,
    fontSize: 12.5,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  description: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: "#475569",
    lineHeight: 16.5,
  },
  infoBox: {
    backgroundColor: "rgba(37, 99, 235, 0.07)",
    borderColor: "rgba(37, 99, 235, 0.18)",
  },
  brandBox: {
    backgroundColor: "rgba(37, 99, 235, 0.08)",
    borderColor: "rgba(37, 99, 235, 0.2)",
  },
  successBox: {
    backgroundColor: "rgba(5, 150, 105, 0.07)",
    borderColor: "rgba(5, 150, 105, 0.18)",
  },
  warningBox: {
    backgroundColor: "rgba(245, 158, 11, 0.07)",
    borderColor: "rgba(245, 158, 11, 0.18)",
  },
  dangerBox: {
    backgroundColor: "rgba(220, 38, 38, 0.07)",
    borderColor: "rgba(220, 38, 38, 0.18)",
  },
});
