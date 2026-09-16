import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { COLORS } from "../../../../theme/colors";
import { FONTS } from "../../../../theme/fonts";
import { ListChecks, Check, Users } from "lucide-react-native";
import { projectApi } from "../../../../api";
import { useAuthStore } from "../../../../store/authStore";

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

  if (
    r.includes("UI") ||
    r.includes("UX") ||
    r.includes("DESIGN") ||
    c.includes("DESAIN")
  ) {
    return DEFAULT_MILESTONES["UI/UX"];
  }
  if (
    r.includes("FRONTEND") ||
    r.includes("WEB") ||
    r.includes("MOBILE") ||
    r.includes("REACT") ||
    r.includes("FLUTTER")
  ) {
    return DEFAULT_MILESTONES.FRONTEND;
  }
  if (
    r.includes("BACKEND") ||
    r.includes("API") ||
    r.includes("SERVER") ||
    r.includes("DATABASE")
  ) {
    return DEFAULT_MILESTONES.BACKEND;
  }
  return DEFAULT_MILESTONES.DEFAULT;
}

export function MobileRoleMilestoneTracker({
  projectId,
  roleName,
  slots = [],
  category,
  isUmkmOwner,
  isProjectCompleted,
}) {
  const { user } = useAuthStore();

  const availableRoles = useMemo(() => {
    if (slots && slots.length > 0) {
      const distinct = Array.from(
        new Set(slots.map((s) => s.nama_peran).filter(Boolean)),
      );
      if (distinct.length > 0) return distinct;
    }
    return [roleName || "Utama"];
  }, [slots, roleName]);

  const initialRole = useMemo(() => {
    if (roleName && availableRoles.includes(roleName)) {
      return roleName;
    }
    if (user?.id && slots && slots.length > 0) {
      const mySlot = slots.find((s) => s.accepted_mhs_id === user.id);
      if (mySlot?.nama_peran) return mySlot.nama_peran;
    }
    return availableRoles[0] || "Utama";
  }, [roleName, availableRoles, user, slots]);

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [milestonesMap, setMilestonesMap] = useState({});
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (
      initialRole &&
      (!selectedRole || !availableRoles.includes(selectedRole))
    ) {
      setSelectedRole(initialRole);
    }
  }, [initialRole, availableRoles]);

  const activeMilestoneList = useMemo(
    () => getMilestonesForRole(selectedRole, category),
    [selectedRole, category],
  );

  const fetchMilestones = useCallback(async () => {
    if (!projectId) return;
    try {
      const res = await projectApi.getMilestones(projectId);
      if (res.data?.milestones) {
        const parsedMap = {};
        Object.entries(res.data.milestones).forEach(([key, val]) => {
          parsedMap[key] = Array.isArray(val?.completed_indices)
            ? val.completed_indices
            : [];
        });
        setMilestonesMap(parsedMap);
      }
    } catch (err) {
      console.error("[MobileMilestoneTracker] Fetch failed:", err);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMilestones();
    const interval = setInterval(fetchMilestones, 6000);
    return () => clearInterval(interval);
  }, [fetchMilestones]);

  const completedIndices = useMemo(() => {
    if (isProjectCompleted) {
      return activeMilestoneList.map((_, i) => i);
    }
    return milestonesMap[selectedRole] || [];
  }, [isProjectCompleted, activeMilestoneList, milestonesMap, selectedRole]);

  const canEdit = useMemo(() => {
    if (isProjectCompleted || isUmkmOwner) return false;
    if (slots && slots.length > 0) {
      const matchingSlot = slots.find((s) => s.nama_peran === selectedRole);
      if (matchingSlot?.accepted_mhs_id) {
        return matchingSlot.accepted_mhs_id === user?.id;
      }
    }
    return !isUmkmOwner;
  }, [isProjectCompleted, isUmkmOwner, slots, selectedRole, user]);

  const toggleMilestone = async (index) => {
    if (!canEdit || syncing) return;

    const exists = completedIndices.includes(index);
    const nextIndices = exists
      ? completedIndices.filter((i) => i !== index)
      : [...completedIndices, index].sort((a, b) => a - b);

    setMilestonesMap((prev) => ({
      ...prev,
      [selectedRole]: nextIndices,
    }));

    try {
      setSyncing(true);
      await projectApi.updateMilestones(projectId, {
        role_name: selectedRole,
        completed_indices: nextIndices,
      });
    } catch (err) {
      console.error("[MobileMilestoneTracker] Update failed:", err);
      fetchMilestones();
    } finally {
      setSyncing(false);
    }
  };

  const progressPercent = Math.round(
    (completedIndices.length / activeMilestoneList.length) * 100,
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <ListChecks size={16} color={COLORS.primary} />
            <Text style={styles.titleText}>
              Milestone & Sub-Task Pelaksanaan
            </Text>
          </View>
          <Text style={styles.subtitleText}>
            {isUmkmOwner
              ? "Pantau progres tahapan kerja tim"
              : canEdit
                ? "Ketuk sub-tugas yang telah selesai"
                : `Melihat progres ${selectedRole}`}
          </Text>
        </View>

        <View style={styles.progressPill}>
          <Text style={styles.progressPercent}>{progressPercent}%</Text>
        </View>
      </View>

      {/* Role Switcher Pills (If multiple slots exist) */}
      {availableRoles.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.roleTabsContainer}
        >
          {availableRoles.map((role) => {
            const isSelected = selectedRole === role;
            const roleIndices = milestonesMap[role] || [];
            const roleMilestones = getMilestonesForRole(role, category);
            const rolePct = Math.round(
              (roleIndices.length / roleMilestones.length) * 100,
            );

            return (
              <TouchableOpacity
                key={role}
                activeOpacity={0.7}
                onPress={() => setSelectedRole(role)}
                style={[
                  styles.rolePill,
                  isSelected ? styles.rolePillActive : styles.rolePillInactive,
                ]}
              >
                <Text
                  style={[
                    styles.rolePillText,
                    isSelected
                      ? styles.rolePillTextActive
                      : styles.rolePillTextInactive,
                  ]}
                >
                  {role}
                </Text>
                <View
                  style={[
                    styles.roleBadge,
                    isSelected
                      ? styles.roleBadgeActive
                      : styles.roleBadgeInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.roleBadgeText,
                      isSelected
                        ? styles.roleBadgeTextActive
                        : styles.roleBadgeTextInactive,
                    ]}
                  >
                    {rolePct}%
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Checklist */}
      <View style={styles.listContainer}>
        {activeMilestoneList.map((item, idx) => {
          const isDone = completedIndices.includes(idx);
          return (
            <TouchableOpacity
              key={idx}
              disabled={!canEdit}
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
                style={[styles.itemText, isDone && styles.itemTextDone]}
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
  roleTabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 2,
  },
  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  rolePillActive: {
    backgroundColor: COLORS.primary,
  },
  rolePillInactive: {
    backgroundColor: "#F1F5F9",
  },
  rolePillText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  rolePillTextActive: {
    color: "#FFF",
  },
  rolePillTextInactive: {
    color: COLORS.textSecondary,
  },
  roleBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  roleBadgeActive: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  roleBadgeInactive: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleBadgeText: {
    fontSize: 9,
    fontFamily: FONTS.bold,
  },
  roleBadgeTextActive: {
    color: "#FFF",
  },
  roleBadgeTextInactive: {
    color: COLORS.textSecondary,
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
