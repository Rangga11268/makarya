import React from "react";
import {
  Users,
  ShieldCheck,
  Building2,
  MapPin,
  MessageSquare,
  GraduationCap,
  Check,
  ExternalLink,
  Palette,
  FileCode,
  FolderArchive,
} from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { Avatar } from "../../../../components/ui/Avatar";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { TeamWorkspaceMatrix } from "./TeamWorkspaceMatrix";

export function WorkroomCollaborationTab({
  selectedProject,
  selectedProposal,
  isUmkm,
  assignedRoleName,
  clientData,
  studentData,
  handleOpenChat,
  setPendingSubmissionId,
  setHandoffModalOpen,
  activeDeliverable,
}) {
  if (
    selectedProject?.tipe_kolaborasi === "TIM" ||
    (selectedProject?.slots && selectedProject.slots.length > 0)
  ) {
    return (
      <div className="animate-in fade-in duration-200">
        <TeamWorkspaceMatrix
          project={selectedProject}
          isUmkm={isUmkm}
          onApproveSlot={(slot) => {
            setPendingSubmissionId(activeDeliverable?.id);
            setHandoffModalOpen(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h3 className="text-sm font-bold text-dark-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-indigo" />
              <span>Formasi Kemitraan Proyek (Duo Kolaborasi)</span>
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Rincian identitas dan peran kerja antara Klien Pemberi Kerja dan
              Mahasiswa Pelaksana
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kolaborasi Terproteksi Escrow</span>
          </div>
        </div>

        {/* Two Rich Profile Cards (Client & Student) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Card 1: Klien Pemberi Kerja (UMKM) */}
          <div className="p-5 rounded-2xl bg-canvas border border-border space-y-4 flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                  Pemberi Kerja / Klien Usaha
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Klien Terverifikasi
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <Avatar
                  src={clientData.fotoUsaha}
                  name={clientData.namaUsaha}
                  role="UMKM"
                  size="xl"
                  className="rounded-2xl"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-extrabold text-dark-900 text-sm sm:text-base leading-tight">
                    {clientData.namaUsaha}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{clientData.bidang}</span>
                    </span>
                    <span className="text-slate-300">/</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{clientData.kota}</span>
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted leading-relaxed line-clamp-2 bg-surface p-3 rounded-xl border border-border/70">
                {clientData.deskripsi}
              </p>
            </div>

            <div className="pt-3 border-t border-border/80 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px]">
                <span className="text-muted block">Peran dalam Proyek:</span>
                <span className="font-bold text-dark-900">
                  Penanggung Jawab Brief & Owner
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenChat}
                className="text-xs font-bold border-brand-indigo/30 text-brand-indigo hover:bg-brand-indigo/5 flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Kirim Pesan</span>
              </Button>
            </div>
          </div>

          {/* Card 2: Mahasiswa Pelaksana (Talenta) */}
          <div className="p-5 rounded-2xl bg-canvas border border-border space-y-4 flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                  Pelaksana Kerja Terpilih
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  Talenta Ditugaskan
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <Avatar
                  src={studentData.foto}
                  name={studentData.namaLengkap}
                  role="MHS"
                  size="xl"
                  className="rounded-2xl"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-dark-900 text-sm sm:text-base leading-tight">
                      {studentData.namaLengkap}
                    </h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
                    <span className="inline-flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{studentData.kampus}</span>
                    </span>
                    <span className="text-slate-300">/</span>
                    <span className="font-medium text-brand-indigo">
                      {studentData.prodi}
                    </span>
                  </div>
                </div>
              </div>

              {/* Keahlian & Tools */}
              <div className="space-y-1.5 bg-surface p-3 rounded-xl border border-border/70">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                  Posisi:{" "}
                  <strong className="text-dark-900">
                    {assignedRoleName || "Pelaksana Utama"}
                  </strong>
                </span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {studentData.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-brand-indigo/10 text-brand-indigo font-bold text-[10.5px] border border-brand-indigo/20"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/80 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px]">
                <span className="text-muted block">Honor & Waktu:</span>
                <span className="font-extrabold text-emerald-700">
                  {formatCurrency(
                    isUmkm
                      ? selectedProject?.budget_max
                      : selectedProposal?.harga_tawar,
                  )}
                  <span className="text-muted font-normal">
                    {" "}
                    ({studentData.estimasiHari} Hari)
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                {studentData.portfolio && (
                  <a
                    href={studentData.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border text-dark-900 font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    <span>Portofolio</span>
                    <ExternalLink className="w-3 h-3 text-muted" />
                  </a>
                )}
                <Button
                  variant="brand"
                  size="sm"
                  onClick={handleOpenChat}
                  className="text-xs font-bold shadow-brand flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Buka Chat</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hub Saluran Kolaborasi & Aset Bersama */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
                Saluran Kolaborasi & Tautan Kerja Bersama
              </h4>
              <p className="text-[11px] text-muted">
                Akses repositori, kanvas desain, dan folder berkas proyek
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Figma */}
            <div className="p-4 rounded-2xl bg-canvas border border-border hover:border-purple-300 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
                  <Palette className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Desain UI/UX
                </span>
              </div>
              <h5 className="font-bold text-dark-900">Figma Canvas</h5>
              <p className="text-[11px] text-muted">
                Kanvas kolaboratif desain antarmuka, wireframe, & aset visual.
              </p>
            </div>

            {/* GitHub */}
            <div className="p-4 rounded-2xl bg-canvas border border-border hover:border-slate-400 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 flex items-center justify-center">
                  <FileCode className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                  Source Code
                </span>
              </div>
              <h5 className="font-bold text-dark-900">GitHub / Git Repo</h5>
              <p className="text-[11px] text-muted">
                Repositori kode sumber program & branch kolaborasi fitur.
              </p>
            </div>

            {/* Google Drive */}
            <div className="p-4 rounded-2xl bg-canvas border border-border hover:border-blue-300 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <FolderArchive className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Cloud Storage
                </span>
              </div>
              <h5 className="font-bold text-dark-900">Google Drive Assets</h5>
              <p className="text-[11px] text-muted">
                Penyimpanan berkas mentah video, audio, foto, & dokumen referensi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
