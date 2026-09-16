import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { COLORS } from "../../../../../theme/colors";
import { FONTS } from "../../../../../theme/fonts";
import { ListChecks, Check, Award } from "lucide-react-native";

const DEFAULT_MILESTONES = {
  "UI/UX": [
    "Riset Kebutuhan & Wireframe Low-Fi",
    "Design System & Color Tokens",
    "High-Fidelity Visual Design",
    "Interactive Clickable Prototype",
    "Design Handoff & Assets Export",
  ],
  FRONTEND: [
    "Setup Boilerplate & Slicing UI",
    "State Management & API Integration",
    "Validasi Input & Error Handling",
    "Responsive Layout Testing",
    "Build Production & Live Demo",
  ],
  BACKEND: [
    "Database Schema & Migrations",
    "Authentication & Security Rules",
    "Core API Business Logic",
    "Escrow Ledger Transaction Validation",
    "API Documentation & Unit Tests",
  ],
  DEFAULT: [
    "Analisis Kebutuhan Awal",
    "Pengerjaan Draft / Prototype",
    "Uji Coba Internal & Perbaikan",
    "Review Bersama Klien UMKM",
    "Final Deliverable Handoff",
  ],
};

function getMilestonesForRole(roleName, category) {
  const r = (roleName || "").toUpperCase();
  const c = (category || "").toUpperCase();

  if (r.includes("UI") || r.includes("UX") || r.includes("DESIGN") || c.includes("DESAIN")) {
    return DEFAULT_MILESTONES["UI/UX"];
  }
  if (r.includes("FRONTEND") || r.includes("WEB") || r.includes("MOBILE")) {
    return DEFAULT_MILESTONES.FRONTEND;
  }
  if (r.includes("BACKEND") || r.includes("API") || r.includes("DATABASE")) {
    return DEFAULT_MILESTONES.BACKEND;
  }
  return DEFAULT_MILESTONES.DEFAULT;
}

export function MobileRoleMilestoneTracker({
  projectId,
  roleName,
  category,
  isUmkmOwner,
  isProjectCompleted,
}) {
  const milestoneList = getMilestonesForRole(roleName, category);
  const [completedIndices, setCompletedIndices] = useState(
    isProjectCompleted ? milestoneList.map((_, i) => i) : [0]
  );

  const toggleMilestone = (index) => {
    if (isUmkmOwner && !isProjectCompleted) return;
    setCompletedIndices((prev) => {
      const exists = prev.includes(index);
      if (exists) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index].sort((a, b) => a - b);
      }
    });
  };

  const progressPercent = Math.round(
    (completedIndices.length / milestoneList.length) * 100
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <ListChecks size={16} color={COLORS.primary} />
            <Text style={styles.titleText}>
              Milestone: {roleName || "Pelaksana"}
            </Text>
          </View>
          <Text style={styles.subtitleText}>
            {isUmkmOwner
              ? "Pantau progres tahapan kerja tim"
              : "Ketuk sub-tugas yang telah selesai"}
          </Text>
        </View>

        <View style={styles.progressPill}>
          <Text style={styles.progressPercent}>{progressPercent}%</Text>
        </View>
      </View>

      {/* Checklist */}
      <View style={styles.listContainer}>
        {milestoneList.map((item, idx) => {
          const isDone = completedIndices.includes(idx);
          return (
            <TouchableOpacity
              key={idx}
              disabled={isUmkmOwner}
              onPress={() => toggleMilestone(idx)}
              activeOpacity={0.7}
              style={[
                styles.itemRow,
                isDone ? styles.itemRowDone : styles.itemRowPending,
              ]}
            >
              <View
                style={[
                  styles.checkbox,
                  isDone ? styles.checkboxDone : styles.checkboxPending,
                ]}
              >
                {isDone && <Check size={11} color="#FFF" strokeWidth={3} />}
              </View>

              <Text
                style={[
                  styles.itemText,
                  isDone && styles.itemTextDone,
                ]}
                numberOfLines={2}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 16,
    gap: 12,
    marginVertical: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  titleText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  subtitleText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  progressPill: {
    backgroundColor: "rgba(79, 70, 229, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progressPercent: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  listContainer: {
    gap: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  itemRowDone: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  itemRowPending: {
    backgroundColor: "#F8FAFC",
    borderColor: COLORS.border,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: {
    backgroundColor: COLORS.success,
  },
  checkboxPending: {
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
  },
  itemText: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  itemTextDone: {
    textDecorationLine: "line-through",
    color: COLORS.textSecondary,
  },
});
