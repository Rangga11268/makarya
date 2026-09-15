import React from "react";
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  Flame,
} from "lucide-react";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { formatDate, isExpired } from "../../../../utils/formatDate";

export function WorkspaceProjectHUD({
  project,
  projectEscrow,
  activeDeliverable,
  isUmkm,
  onPingProgress,
  isProjectCompleted,
}) {
  if (!project) return null;

  const deadlineDate = project.deadline ? new Date(project.deadline) : null;
  const createdDate = project.created_at ? new Date(project.created_at) : null;
  const now = new Date();

  // Time & Countdown Calculation
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

  // Pipeline Step Index:
  // 1: Escrow Diamankan
  // 2: Pengerjaan Aktif (IN_PROGRESS)
  // 3: Tinjauan Deliverable (REVIEW / activeDeliverable submitted)
  // 4: Selesai & Honor Cair (DONE / COMPLETED)
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
    { num: 1, label: "Escrow Diamankan", sub: "Garansi 100%" },
    { num: 2, label: "Pengerjaan Aktif", sub: "Coding / Desain" },
    { num: 3, label: "Review Deliverable", sub: "Verifikasi Berkas" },
    { num: 4, label: "Selesai & Lunas", sub: "Honor Cair" },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-slate-50/80 rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-4">
      {/* Top HUD Row: Time Gauge, Escrow Badge & Ping Shortcut */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          {/* Urgency / Countdown Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors ${
              urgencyLevel === "completed"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : urgencyLevel === "expired"
                  ? "bg-rose-50 border-rose-200 text-rose-700"
                  : urgencyLevel === "urgent"
                    ? "bg-amber-50 border-amber-300 text-amber-900 animate-pulse"
                    : urgencyLevel === "warning"
                      ? "bg-amber-50 border-amber-200 text-amber-800"
                      : "bg-blue-50/80 border-blue-200 text-blue-800"
            }`}
          >
            {urgencyLevel === "completed" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : urgencyLevel === "expired" ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            ) : urgencyLevel === "urgent" ? (
              <Flame className="w-3.5 h-3.5 text-amber-600" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-blue-600" />
            )}
            <span>{remainingText}</span>
          </div>

          {/* Guaranteed Escrow & Auto-Approval Tags */}
          {(() => {
            let escrowStatusLabel = "Escrow Aman";
            let escrowAmount = projectEscrow
              ? projectEscrow.amount_total
              : project.budget_max || 0;
            let autoApproveRemainingText = null;

            if (projectEscrow) {
              if (
                projectEscrow.status === "SUBMITTED" &&
                projectEscrow.auto_approve_at
              ) {
                const autoApproveDate = new Date(projectEscrow.auto_approve_at);
                const diffAutoMs = autoApproveDate.getTime() - now.getTime();
                if (diffAutoMs > 0) {
                  const autoDays = Math.floor(
                    diffAutoMs / (1000 * 60 * 60 * 24),
                  );
                  const autoHours = Math.floor(
                    (diffAutoMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
                  );
                  autoApproveRemainingText =
                    autoDays > 0
                      ? `${autoDays}h ${autoHours}j`
                      : `${autoHours} jam`;
                } else {
                  autoApproveRemainingText = "Sedang diproses";
                }
                escrowStatusLabel = "Review Escrow";
              } else if (projectEscrow.status === "REVISION") {
                escrowStatusLabel = "Masa Revisi";
              } else if (projectEscrow.status === "RELEASED") {
                escrowStatusLabel = "Honor Dicairkan";
              } else if (projectEscrow.status === "PARTIALLY_RELEASED") {
                escrowStatusLabel = "Putusan Sengketa";
              } else if (projectEscrow.status === "DISPUTED") {
                escrowStatusLabel = "Mediasi Sengketa";
              } else if (projectEscrow.status === "REFUNDED") {
                escrowStatusLabel = "Dana Dikembalikan";
              } else {
                escrowStatusLabel = "100% Escrow Aman";
              }
            }

            return (
              <>
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {escrowStatusLabel}: {formatCurrency(escrowAmount)}
                  </span>
                </div>
                {autoApproveRemainingText && (
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold animate-pulse"
                    title="Dana escrow otomatis dicairkan ke mahasiswa jika klien UMKM tidak mereview dalam 7 hari"
                  >
                    <Clock className="w-3 h-3 text-blue-600" />
                    <span>Auto-Approve: {autoApproveRemainingText}</span>
                  </div>
                )}
              </>
            );
          })()}
        </div>

        {/* Right Action: UMKM Ping Progress button */}
        {isUmkm && !isProjectCompleted && onPingProgress && (
          <button
            type="button"
            onClick={onPingProgress}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all shadow-2xs hover:shadow-xs active:scale-95"
            title="Kirim pengingat pesan perkembangan ramah ke ruang chat mahasiswa"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
            <span>Tanya Perkembangan</span>
          </button>
        )}
      </div>

      {/* Pipeline Stepper Visual (4 Node Track) */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {pipelineSteps.map((step) => {
            const isDone = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            return (
              <div
                key={step.num}
                className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? "bg-white border-blue-500/60 shadow-[0_2px_10px_rgba(37,99,235,0.08)] ring-1 ring-blue-500/20"
                    : isDone
                      ? "bg-slate-50/70 border-slate-200/80 opacity-90"
                      : "bg-slate-50/40 border-slate-200/40 opacity-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isDone
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                          ? "bg-blue-600 text-white ring-2 ring-blue-100"
                          : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-3 h-3" /> : step.num}
                  </div>
                  <span
                    className={`text-xs font-bold truncate ${
                      isCurrent
                        ? "text-slate-900 font-extrabold"
                        : isDone
                          ? "text-slate-700"
                          : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate pl-7">
                  {step.sub}
                </p>
              </div>
            );
          })}
        </div>

        {/* Progress Bar Micro Tracker */}
        {!isProjectCompleted && (
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 px-1">
              <span>Waktu Pengerjaan Terpakai</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  urgencyLevel === "urgent" || urgencyLevel === "expired"
                    ? "bg-rose-500"
                    : urgencyLevel === "warning"
                      ? "bg-amber-500"
                      : "bg-blue-600"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
