import React, { useState, useEffect } from "react";
import { CheckCircle2, Circle, ListChecks, Sparkles, TrendingUp, Check } from "lucide-react";
import { Badge } from "../../../../components/ui/Badge";

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

  if (r.includes("UI") || r.includes("UX") || r.includes("DESIGN") || c.includes("DESAIN")) {
    return DEFAULT_MILESTONES["UI/UX"];
  }
  if (r.includes("FRONTEND") || r.includes("WEB") || r.includes("MOBILE") || r.includes("REACT") || r.includes("FLUTTER")) {
    return DEFAULT_MILESTONES.FRONTEND;
  }
  if (r.includes("BACKEND") || r.includes("API") || r.includes("SERVER") || r.includes("DATABASE")) {
    return DEFAULT_MILESTONES.BACKEND;
  }
  return DEFAULT_MILESTONES.DEFAULT;
}

export function RoleMilestoneTracker({
  projectId,
  roleName,
  category,
  isUmkm,
  isProjectCompleted,
}) {
  const milestoneKey = `makarya_milestones_${projectId}_${roleName || "default"}`;
  const milestoneList = React.useMemo(
    () => getMilestonesForRole(roleName, category),
    [roleName, category]
  );

  const [completedIndices, setCompletedIndices] = useState(() => {
    try {
      const saved = localStorage.getItem(milestoneKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return isProjectCompleted ? milestoneList.map((_, i) => i) : [0];
  });

  useEffect(() => {
    try {
      localStorage.setItem(milestoneKey, JSON.stringify(completedIndices));
    } catch (e) {}
  }, [completedIndices, milestoneKey]);

  useEffect(() => {
    if (isProjectCompleted) {
      setCompletedIndices(milestoneList.map((_, i) => i));
    }
  }, [isProjectCompleted, milestoneList]);

  const toggleMilestone = (index) => {
    if (isUmkm && !isProjectCompleted) return; // Only students can check off their tasks, or clients view
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
    <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-brand-indigo" />
            <h3 className="text-sm sm:text-base font-bold text-dark-900 font-sans">
              Milestone & Sub-Task Pelaksanaan: {roleName || "Peran Tim"}
            </h3>
          </div>
          <p className="text-xs text-muted mt-0.5 font-sans">
            {isUmkm
              ? "Pantau perkembangan tahapan kerja tim secara transparan dan terstruktur."
              : "Centang sub-tugas yang telah selesai agar mitra UMKM mengetahui progres Anda."}
          </p>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl">
          <div className="text-right">
            <span className="text-[10px] font-bold text-muted block uppercase tracking-wider">
              Progres Kerja
            </span>
            <span className="text-sm font-black text-dark-900">
              {progressPercent}%
            </span>
          </div>
          <div className="w-16 h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                progressPercent === 100
                  ? "bg-emerald-500"
                  : "bg-brand-indigo"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist List */}
      <div className="space-y-2.5">
        {milestoneList.map((item, idx) => {
          const isDone = completedIndices.includes(idx);
          return (
            <div
              key={idx}
              onClick={() => !isUmkm && toggleMilestone(idx)}
              className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isDone
                  ? "bg-emerald-50/40 border-emerald-200/80 text-emerald-950"
                  : "bg-canvas border-border/80 text-dark-900 hover:border-slate-300"
              } ${!isUmkm ? "cursor-pointer select-none" : ""}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  disabled={isUmkm}
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
