import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  CheckCircle2,
  Circle,
  ListChecks,
  Sparkles,
  TrendingUp,
  Check,
  Users,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "../../../../components/ui/Badge";
import { projectApi } from "../../../../api";
import { useAuthStore } from "../../../../store/authStore";

const DEFAULT_MILESTONES = {
  "UI/UX": [
    "Riset Kebutuhan & Wireframe Low-Fi",
    "Design System, Typography & Color Tokens",
    "High-Fidelity Visual Design Mockups",
    "Interactive Clickable Prototype (Figma)",
    "Design Handoff & Export Assets",
  ],
  FRONTEND: [
    "Setup Boilerplate & Slicing Desain UI",
    "State Management & Integrasi Endpoint API",
    "Validasi Input Form & Error Handling",
    "Responsive Layout Testing (Mobile & Desktop)",
    "Build Production & Live Preview Demo",
  ],
  BACKEND: [
    "Desain Skema Database & Migrasi",
    "Autentikasi Pengguna & Role-Based Access",
    "Implementasi Endpoint Logika Bisnis",
    "Audit Trail & Validasi Transaksi Escrow",
    "Dokumentasi API & Testing",
  ],
  DEFAULT: [
    "Analisis Kebutuhan & Perencanaan Awal",
    "Pengerjaan Draft / Prototype Utama",
    "Uji Coba Internal & Penyempurnaan",
    "Review Bersama Klien UMKM",
    "Final Deliverable & Penyerahan Hasil Kerja",
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

export function RoleMilestoneTracker({
  projectId,
  roleName,
  slots = [],
  category,
  isUmkm,
  isProjectCompleted,
}) {
  const { user } = useAuthStore();

  // Extract distinct available roles from slots or fallback to roleName
  const availableRoles = useMemo(() => {
    if (slots && slots.length > 0) {
      const distinct = Array.from(
        new Set(slots.map((s) => s.nama_peran).filter(Boolean)),
      );
      if (distinct.length > 0) return distinct;
    }
    return [roleName || "Utama"];
  }, [slots, roleName]);

  // Determine initial active role: student's assigned role, or first available slot
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

  // Synchronize initialRole changes when props update
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

  // Fetch milestones from backend
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
      console.error("[MilestoneTracker] Failed to fetch milestones:", err);
    }
  }, [projectId]);

  // Initial fetch and 6-second live polling while on workspace
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

  // Check if current user can edit the currently selected role
  const canEdit = useMemo(() => {
    if (isProjectCompleted || isUmkm) return false;
    if (slots && slots.length > 0) {
      const matchingSlot = slots.find((s) => s.nama_peran === selectedRole);
      if (matchingSlot?.accepted_mhs_id) {
        return matchingSlot.accepted_mhs_id === user?.id;
      }
    }
    // If solo project or unassigned slot, allow student in workspace to toggle
    return !isUmkm;
  }, [isProjectCompleted, isUmkm, slots, selectedRole, user]);

  const toggleMilestone = async (index) => {
    if (!canEdit || syncing) return;

    const exists = completedIndices.includes(index);
    const nextIndices = exists
      ? completedIndices.filter((i) => i !== index)
      : [...completedIndices, index].sort((a, b) => a - b);

    // Optimistic update
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
      console.error("[MilestoneTracker] Failed to save milestone:", err);
      // Revert on error
      fetchMilestones();
    } finally {
      setSyncing(false);
    }
  };

  const progressPercent = Math.round(
    (completedIndices.length / activeMilestoneList.length) * 100,
  );

  return (
    <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-brand-indigo" />
            <h3 className="text-sm sm:text-base font-bold text-dark-900 font-sans">
              Milestone & Sub-Task Pelaksanaan
            </h3>
          </div>
          <p className="text-xs text-muted mt-0.5 font-sans">
            {isUmkm
              ? "Pantau perkembangan tahapan kerja tim secara transparan dan terstruktur."
              : canEdit
                ? "Centang sub-tugas yang telah selesai agar mitra UMKM dan rekan tim mengetahui progres Anda secara real-time."
                : `Melihat progres ${selectedRole}. Hanya talenta yang ditugaskan dapat mencentang sub-tugas ini.`}
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full sm:w-auto min-w-[180px] bg-slate-50 border border-slate-200/80 p-3 sm:px-4 sm:py-2.5 rounded-xl space-y-1.5 self-stretch sm:self-auto shrink-0 shadow-2xs">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
              Progres {selectedRole}
            </span>
            <span className="text-xs font-black text-dark-900">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full sm:w-36 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                progressPercent === 100 ? "bg-emerald-500" : "bg-brand-indigo"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Role Switcher Pills (If multiple slots exist) */}
      {availableRoles.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-muted mr-1 flex items-center gap-1.5 shrink-0">
            <Users className="w-3.5 h-3.5" />
            <span>Peran:</span>
          </span>
          {availableRoles.map((role) => {
            const isSelected = selectedRole === role;
            const roleIndices = milestonesMap[role] || [];
            const roleMilestones = getMilestonesForRole(role, category);
            const rolePct = Math.round(
              (roleIndices.length / roleMilestones.length) * 100,
            );

            return (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-brand-indigo text-white shadow-xs shadow-brand-indigo/20"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <span>{role}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  {rolePct}%
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Checklist List */}
      <div className="space-y-2.5">
        {activeMilestoneList.map((item, idx) => {
          const isDone = completedIndices.includes(idx);
          return (
            <div
              key={idx}
              onClick={() => canEdit && toggleMilestone(idx)}
              className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isDone
                  ? "bg-emerald-50/40 border-emerald-200/80 text-emerald-950"
                  : "bg-canvas border-border/80 text-dark-900 hover:border-slate-300"
              } ${canEdit ? "cursor-pointer select-none" : "cursor-default"}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  disabled={!canEdit}
                  className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                    isDone
                      ? "bg-emerald-600 text-white"
                      : "border border-slate-300 bg-white"
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                </button>
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    isDone
                      ? "line-through text-slate-500"
                      : "text-dark-900 font-semibold"
                  }`}
                >
                  {item}
                </span>
              </div>

              <Badge
                variant={isDone ? "success" : "outline"}
                className="text-[10px] font-bold shrink-0"
              >
                {isDone ? "Selesai" : `Tahap ${idx + 1}`}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
