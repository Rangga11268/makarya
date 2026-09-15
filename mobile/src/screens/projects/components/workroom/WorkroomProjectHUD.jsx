import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { FONTS } from "../../../../theme/fonts";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { formatDate, isExpired } from "../../../../utils/formatDate";
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Send,
  Flame,
} from "lucide-react-native";

export function WorkroomProjectHUD({
  project,
  activeDeliverable,
  isUmkmOwner,
  onPingProgress,
  isProjectCompleted,
}) {
  if (!project) return null;

  const deadlineDate = project.deadline ? new Date(project.deadline) : null;
  const createdDate = project.created_at ? new Date(project.created_at) : null;
  const now = new Date();

  // Time & Countdown
  let remainingText = "Tenggat Waktu Ditentukan";
  let urgencyLevel = "normal"; // 'normal' | 'warning' | 'urgent' | 'expired'
  let progressPercent = 50;

  if (deadlineDate) {
    const diffMs = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

    if (isProjectCompleted) {
      remainingText = "Selesai Tepat Waktu";
      urgencyLevel = "completed";
      progressPercent = 100;
    } else if (diffMs < 0) {
      remainingText = `Lewat Tenggat (${formatDate(project.deadline)})`;
      urgencyLevel = "expired";
      progressPercent = 100;
    } else if (diffHours <= 24) {
      remainingText = `Sisa ${diffHours} Jam Terakhir!`;
      urgencyLevel = "urgent";
    } else if (diffDays <= 3) {
      remainingText = `Sisa ${diffDays} Hari Lagi`;
      urgencyLevel = "warning";
    } else {
      remainingText = `Sisa ${diffDays} Hari Pengerjaan`;
      urgencyLevel = "normal";
    }

    if (!isProjectCompleted && createdDate && diffMs >= 0) {
      const totalSpan = deadlineDate.getTime() - createdDate.getTime();
      const elapsed = now.getTime() - createdDate.getTime();
      if (totalSpan > 0) {
        progressPercent = Math.min(
          95,
          Math.max(10, Math.round((elapsed / totalSpan) * 100)),
        );
      }
    }
  }

  // Pipeline Step
  let currentStep = 2;
  if (isProjectCompleted) {
    currentStep = 4;
  } else if (
    activeDeliverable &&
    activeDeliverable.status !== "REVISION_REQUESTED"
  ) {
    currentStep = 3;
  } else if (project.status === "IN_PROGRESS") {
    currentStep = 2;
  }

  const pipelineSteps = [
    { num: 1, label: "Escrow", sub: "100%" },
    { num: 2, label: "Aktif", sub: "Pengerjaan" },
    { num: 3, label: "Review", sub: "Berkas" },
    { num: 4, label: "Selesai", sub: "Lunas" },
  ];

  return (
    <View style={styles.hudCard}>
      {/* Top Meta Strip */}
      <View style={styles.topRow}>
        <View style={styles.badgeGroup}>
          <View
            style={[
              styles.countdownBadge,
              urgencyLevel === "completed" && styles.badgeCompleted,
              urgencyLevel === "expired" && styles.badgeExpired,
              urgencyLevel === "urgent" && styles.badgeUrgent,
              urgencyLevel === "warning" && styles.badgeWarning,
            ]}
          >
            {urgencyLevel === "completed" ? (
              <CheckCircle2 size={12} color="#059669" />
            ) : urgencyLevel === "expired" ? (
              <AlertCircle size={12} color="#DC2626" />
            ) : urgencyLevel === "urgent" ? (
              <Flame size={12} color="#D97706" />
            ) : (
              <Clock size={12} color="#2563EB" />
            )}
            <Text
              style={[
                styles.countdownText,
                urgencyLevel === "completed" && { color: "#065F46" },
                urgencyLevel === "expired" && { color: "#991B1B" },
                urgencyLevel === "urgent" && { color: "#92400E" },
                urgencyLevel === "warning" && { color: "#854D0E" },
              ]}
            >
              {remainingText}
            </Text>
          </View>

          <View style={styles.escrowBadge}>
            <ShieldCheck size={12} color="#059669" />
            <Text style={styles.escrowBadgeText}>
              Escrow Rp {formatCurrency(project.budget_max || 0)}
            </Text>
          </View>
        </View>

        {isUmkmOwner && !isProjectCompleted && onPingProgress && (
          <TouchableOpacity
            onPress={onPingProgress}
            style={styles.pingBtn}
            activeOpacity={0.8}
          >
            <Send size={11} color="#4F46E5" />
            <Text style={styles.pingBtnText}>Tanya Progres</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 4-Step Pipeline */}
      <View style={styles.stepsContainer}>
        <View style={styles.stepGrid}>
          {pipelineSteps.map((s) => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <View
                key={s.num}
                style={[
                  styles.stepCol,
                  isCurrent && styles.stepColActive,
                  isDone && styles.stepColDone,
                ]}
              >
                <View style={styles.stepHeader}>
                  <View
                    style={[
                      styles.stepDot,
                      isDone && styles.stepDotDone,
                      isCurrent && styles.stepDotCurrent,
                    ]}
                  >
                    {isDone ? (
                      <CheckCircle2 size={10} color="#FFFFFF" />
                    ) : (
                      <Text
                        style={[
                          styles.stepNumText,
                          isCurrent && { color: "#FFFFFF" },
                        ]}
                      >
                        {s.num}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isCurrent && styles.stepLabelCurrent,
                      isDone && styles.stepLabelDone,
                    ]}
                    numberOfLines={1}
                  >
                    {s.label}
                  </Text>
                </View>
                <Text style={styles.stepSubText}>{s.sub}</Text>
              </View>
            );
          })}
        </View>

        {/* Progress bar */}
        {!isProjectCompleted && (
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercent}%` },
                urgencyLevel === "urgent" || urgencyLevel === "expired"
                  ? { backgroundColor: "#EF4444" }
                  : urgencyLevel === "warning"
                    ? { backgroundColor: "#F59E0B" }
                    : { backgroundColor: "#2563EB" },
              ]}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hudCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.85)",
    padding: 14,
    marginBottom: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  badgeGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
    flex: 1,
  },
  countdownBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  badgeCompleted: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  badgeExpired: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  badgeUrgent: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  badgeWarning: {
    backgroundColor: "#FEFCE8",
    borderColor: "#FEF08A",
  },
  countdownText: {
    fontSize: 10.5,
    fontFamily: FONTS.bold,
    color: "#1E40AF",
  },
  escrowBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  escrowBadgeText: {
    fontSize: 10.5,
    fontFamily: FONTS.semiBold,
    color: "#065F46",
  },
  pingBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pingBtnText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: "#4F46E5",
  },
  stepsContainer: {
    gap: 8,
  },
  stepGrid: {
    flexDirection: "row",
    gap: 6,
  },
  stepCol: {
    flex: 1,
    padding: 6,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  stepColActive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#93C5FD",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  stepColDone: {
    backgroundColor: "#F8FAFC",
    opacity: 0.9,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  stepDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotDone: {
    backgroundColor: "#059669",
  },
  stepDotCurrent: {
    backgroundColor: "#2563EB",
  },
  stepNumText: {
    fontSize: 8.5,
    fontFamily: FONTS.bold,
    color: "#475569",
  },
  stepLabel: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    color: "#64748B",
    flex: 1,
  },
  stepLabelCurrent: {
    color: "#0F172A",
    fontFamily: FONTS.bold,
  },
  stepLabelDone: {
    color: "#334155",
  },
  stepSubText: {
    fontSize: 8.5,
    fontFamily: FONTS.regular,
    color: "#94A3B8",
    paddingLeft: 20,
  },
  progressBarBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#F1F5F9",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
});
