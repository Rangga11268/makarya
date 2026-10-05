import React from "react";
import { FileCheck2, UploadCloud, CheckCircle2, Clock } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { RoleMilestoneTracker } from "./RoleMilestoneTracker";
import { SmartDeliverableCard } from "./SmartDeliverableCard";

export function WorkroomDeliverablesTab({
  activeProjectId,
  assignedRoleName,
  selectedProject,
  selectedProposal,
  isUmkm,
  isProjectCompleted,
  effectiveSubmissions = [],
  detailsLoading = false,
  projectEscrow,
  user,
  handleOpenSubmission,
  setSelectedSubmissionForRevision,
  setRevisionModalOpen,
  setPendingSubmissionId,
  setHandoffModalOpen,
}) {
  return (
    <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-4 animate-in fade-in duration-200 font-sans">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-dark-900 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-brand-indigo" />
            <span>Pusat Deliverable & Submisi Hasil Kerja</span>
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Tinjau berkas pengerjaan, beri catatan revisi, atau setujui untuk
            mencairkan honor escrow
          </p>
        </div>
        {!isUmkm && !isProjectCompleted && (
          <Button
            variant="brand"
            size="sm"
            onClick={() => handleOpenSubmission(selectedProposal?.project_id)}
            className="text-xs font-bold shadow-brand"
          >
            <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
            <span>
              {effectiveSubmissions.some(
                (s) =>
                  s.proposal_id === selectedProposal?.id ||
                  s.submitter_name === user?.nama,
              )
                ? `Perbarui Berkas (${assignedRoleName || "Saya"})`
                : `Unggah Deliverable (${assignedRoleName || "Saya"})`}
            </span>
          </Button>
        )}
      </div>

      {/* Interactive Role Milestone Tracker */}
      <RoleMilestoneTracker
        projectId={activeProjectId}
        roleName={assignedRoleName}
        slots={selectedProject?.slots || []}
        category={
          selectedProject?.kategori || selectedProposal?.project_kategori
        }
        isUmkm={isUmkm}
        isProjectCompleted={isProjectCompleted}
      />

      {effectiveSubmissions.length > 0 ? (
        <div className="space-y-4">
          {effectiveSubmissions.map((sub, idx) => (
            <SmartDeliverableCard
              key={sub.id || idx}
              submission={sub}
              escrow={projectEscrow}
              isUmkm={isUmkm}
              isProjectCompleted={isProjectCompleted}
              onRequestRevision={(item) => {
                setSelectedSubmissionForRevision(item || sub);
                setRevisionModalOpen(true);
              }}
              onApprove={(item) => {
                setPendingSubmissionId(item?.id || sub?.id);
                setHandoffModalOpen(true);
              }}
            />
          ))}
        </div>
      ) : detailsLoading ? (
        <div className="p-8 text-center bg-canvas rounded-2xl border border-border space-y-3 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-slate-200 mx-auto" />
          <div className="h-4 bg-slate-200 rounded w-48 mx-auto" />
          <div className="h-3 bg-slate-200 rounded w-64 mx-auto" />
        </div>
      ) : isProjectCompleted ? (
        <div className="p-8 text-center bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-emerald-950">
            Deliverable Telah Disetujui & Proyek Selesai!
          </h4>
          <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
            Pekerjaan pada proyek ini telah selesai dan honor 100% telah
            dicairkan ke dompet mahasiswa.
          </p>
        </div>
      ) : (
        <div className="p-8 text-center bg-canvas rounded-2xl border border-border space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-muted mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-dark-900">
              {isUmkm
                ? "Mahasiswa Sedang Mengerjakan Proyek"
                : "Belum Ada Berkas Deliverable"}
            </h4>
            <p className="text-[11px] text-muted max-w-sm mx-auto mt-1 leading-relaxed">
              {isUmkm
                ? "Begitu mahasiswa mengunggah tautan hasil kerja (Figma, GitHub, atau Google Drive), berkas akan otomatis muncul di sini untuk Anda verifikasi."
                : "Setelah pengerjaan selesai sesuai brief, serahkan tautan hasil kerja Anda agar dapat diperiksa klien dan honor escrow dicairkan."}
            </p>
          </div>

          {!isUmkm && (
            <Button
              variant="brand"
              size="sm"
              onClick={() => handleOpenSubmission(selectedProposal?.project_id)}
              className="text-xs font-bold shadow-brand mt-2"
            >
              <UploadCloud className="w-3.5 h-3.5 mr-1" />
              Serahkan Berkas Deliverable Sekarang
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
