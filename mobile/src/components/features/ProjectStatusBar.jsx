import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";
import { Check } from "lucide-react-native";

export function ProjectStatusBar({ currentStatus }) {
  const steps = [
    { key: "OPEN", label: "Bidding" },
    { key: "IN_PROGRESS", label: "Pengerjaan" },
    { key: "REVIEW", label: "Review" },
    { key: "COMPLETED", label: "Selesai" },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case "OPEN":
      case "BIDDING":
        return 0;
      case "IN_PROGRESS":
        return 1;
      case "REVIEW":
        return 2;
      case "DONE":
      case "COMPLETED":
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <View style={styles.container}>
      <View style={styles.timeline}>
        {steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <React.Fragment key={step.key}>
              {/* Line connector */}
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

              {/* Step circle */}
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
                  ) : (
                    <View
                      style={[
                        styles.dot,
                        isCurrent ? styles.dotCurrent : styles.dotInactive,
                      ]}
                    />
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
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginVertical: 12,
  },
  timeline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepWrapper: {
    alignItems: "center",
    zIndex: 2,
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  circleDone: {
    backgroundColor: COLORS.brandIndigo,
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
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotCurrent: {
    backgroundColor: COLORS.brandIndigo,
  },
  dotInactive: {
    backgroundColor: COLORS.textDim,
  },
  connector: {
    flex: 1,
    height: 2,
    marginHorizontal: -6,
    zIndex: 1,
  },
  connectorActive: {
    backgroundColor: COLORS.brandIndigo,
  },
  connectorInactive: {
    backgroundColor: COLORS.borderDark,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textMuted,
    marginTop: 6,
  },
  labelCurrent: {
    color: COLORS.brandIndigo,
    fontWeight: "800",
  },
  labelDone: {
    color: COLORS.textDark,
    fontWeight: "700",
  },
});