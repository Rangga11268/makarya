import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FONTS } from "../../theme/fonts";
import { COLORS } from "../../theme/colors";
import { Check, ShieldCheck } from "lucide-react-native";

export function ProjectStatusBar({ currentStatus }) {
  const steps = [
    { key: "BIDDING", label: "Proposals", sub: "Reviewing" },
    { key: "IN_PROGRESS", label: "In Progress", sub: "Escrow Active" },
    { key: "REVIEW", label: "Delivery", sub: "Under Review" },
    { key: "COMPLETED", label: "Completed", sub: "Funds Released" },
  ];

  const getStepIndex = (status) => {
    const s = String(status || "").toUpperCase();
    if (s === "COMPLETED" || s === "DONE" || s === "SELESAI") return 3;
    if (s === "REVIEW" || s === "SUBMITTED" || s === "REVISION") return 2;
    if (s === "IN_PROGRESS" || s === "ACCEPTED" || s === "ONGOING") return 1;
    return 0; // OPEN, BIDDING, TERBUKA, PENDING
  };

  const currentIndex = getStepIndex(currentStatus);
  const statusUpper = String(currentStatus || "").toUpperCase();
  const isAllCompleted =
    currentIndex === 3 &&
    (statusUpper === "COMPLETED" ||
      statusUpper === "DONE" ||
      statusUpper === "SELESAI");

  const getProgressPercentage = () => {
    switch (currentIndex) {
      case 0:
        return "25%";
      case 1:
        return "50%";
      case 2:
        return "75%";
      case 3:
        return "100%";
      default:
        return "25%";
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <ShieldCheck size={14} color={COLORS.brandIndigo} />
          <Text style={styles.headerTitle}>Escrow Workflow</Text>
        </View>
        <Text
          style={[
            styles.headerProgressText,
            isAllCompleted && styles.headerProgressCompleted,
          ]}
        >
          Progress: {getProgressPercentage()}
        </Text>
      </View>

      {/* Stepper Timeline */}
      <View style={styles.timeline}>
        {steps.map((step, idx) => {
          const isDone = idx < currentIndex || (isAllCompleted && idx === 3);
          const isCurrent = idx === currentIndex && !isAllCompleted;

          return (
            <React.Fragment key={step.key}>
              {/* Connector line */}
              {idx > 0 && (
                <View
                  style={[
                    styles.connector,
                    idx <= currentIndex
                      ? styles.connectorActive
                      : styles.connectorInactive,
                  ]}
                />
              )}

              {/* Step Circle & Label */}
              <View style={styles.stepWrapper}>
                <View
                  style={[
                    styles.circle,
                    isDone && styles.circleDone,
                    isCurrent && styles.circleCurrent,
                    !isDone && !isCurrent && styles.circleInactive,
                  ]}
                >
                  {isDone ? (
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  ) : isCurrent ? (
                    <View style={styles.dotCurrent} />
                  ) : (
                    <View style={styles.dotInactive} />
                  )}
                </View>

                <Text
                  style={[
                    styles.label,
                    isCurrent && styles.labelCurrent,
                    isDone && styles.labelDone,
                  ]}
                >
                  {step.label}
                </Text>
                <Text style={styles.subLabel}>{step.sub}</Text>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  headerTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  headerProgressText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  headerProgressCompleted: {
    color: COLORS.success,
  },
  timeline: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  stepWrapper: {
    alignItems: "center",
    zIndex: 2,
    width: 62,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  circleDone: {
    backgroundColor: COLORS.success,
  },
  circleCurrent: {
    backgroundColor: COLORS.bgSurface,
    borderWidth: 2,
    borderColor: COLORS.brandIndigo,
  },
  circleInactive: {
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  dotCurrent: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.brandIndigo,
  },
  dotInactive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textDim,
  },
  connector: {
    flex: 1,
    height: 2,
    marginTop: 11,
    marginHorizontal: -10,
    zIndex: 1,
  },
  connectorActive: {
    backgroundColor: COLORS.success,
  },
  connectorInactive: {
    backgroundColor: COLORS.borderDark,
  },
  label: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textMuted,
    textAlign: "center",
  },
  labelCurrent: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  labelDone: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.textDark,
    fontWeight: "700",
  },
  subLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 9,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 1,
  },
});
