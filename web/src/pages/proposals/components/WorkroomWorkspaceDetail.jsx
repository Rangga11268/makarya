import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { WorkroomChatPanel } from "../../../components/features/WorkroomChatPanel";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import { formatDate, isExpired } from "../../../utils/formatDate";
import {
  Briefcase,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  FileCheck2,
  Users,
  FileText,
  RotateCcw,
  CheckCircle2,
  UploadCloud,
  Clock,
  AlertCircle,
} from "lucide-react";

export function WorkroomWorkspaceDetail({
  activeProjectId,
  activeProjectTitle,
  activePartnerName,
  activePartnerRole,
  activePartnerPhoto,
  isUmkm,
  selectedProject,
  selectedProposal,
  activeStageTab,
  setActiveStageTab,
  activeDeliverable,
  projectProposals = [],
  handleOpenSubmission,
  handleApproveWork,
  setSelectedSubmissionForRevision,
  setRevisionModalOpen,
  handleRejectProposal,
  handleAcceptProposal,
  parseCoverLetter,
}) {
  if (!activeProjectId) {
    return (
      <div className="bg-surface rounded-3xl border border-border p-12 text-center space-y-3 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-brand-indigo mx-auto shadow-xs">
          <Briefcase className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-dark-900">
          Pilih Proyek di Sisi Kiri
        </h3>
        <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
          Pilih salah satu proyek atau proposal pada daftar navigator untuk
          langsung membuka ruang obrolan, memverifikasi berkas kerja, dan
          mengelola garansi escrow.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stage Top Bar (Project Card Summary) */}
      <div className="bg-surface rounded-3xl border border-border p-5 sm:p-6 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3.5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-0.5">
              Proyek Aktif
            </span>
            <h2 className="text-base sm:text-lg font-bold text-dark-900 leading-snug">
              {activeProjectTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {selectedProject?.deadline && isExpired(selectedProject.deadline) && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Lewat Tenggat ({formatDate(selectedProject.deadline)})</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Garansi Escrow Aman</span>
            </div>
          </div>
        </div>

        {/* Overdue Warning Callout */}
        {selectedProject?.deadline && isExpired(selectedProject.deadline) && (
          <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs flex items-start gap-2.5 text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-0.5">
              <span className="font-bold block">Peringatan Tenggat Waktu Terlewati</span>
              <p className="text-[11px] text-rose-700 leading-relaxed">
                {isUmkm
                  ? "Pengerjaan proyek oleh mahasiswa telah melewati tenggat waktu yang ditentukan. Anda dapat mendiskusikan kelanjutan via obrolan di bawah atau mengajukan mediasi/sengketa jika diperlukan."
                  : "Batas waktu pengerjaan proyek telah terlewati. Harap segera kirimkan hasil kerja final (deliverable) pada tab Unggah Berkas untuk mencegah pembatalan atau pengajuan sengketa oleh klien."}
              </p>
            </div>
          </div>
        )}

        {/* Partner Info & Quick Metas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
          <div className="flex items-center gap-2.5">
            {activePartnerPhoto ? (
              <img
                src={activePartnerPhoto}
                alt={activePartnerName}
                className="w-8 h-8 rounded-full object-cover border border-border shrink-0 shadow-xs"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20 flex items-center justify-center font-bold text-xs shrink-0">
                {activePartnerName.charAt(0)}
              </div>
            )}
            <div>
              <span className="font-bold text-dark-900 block leading-tight">
                {activePartnerName}
              </span>
              <span className="text-[10px] text-muted">
                {activePartnerRole === "UMKM"
                  ? "Klien Usaha UMKM"
                  : "Mahasiswa Talenta"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 text-muted text-[11px] pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
            <div>
              <span className="block text-[10px]">Nilai Kontrak:</span>
              <span className="font-extrabold text-dark-900 text-xs">
                {formatCurrency(
                  isUmkm
                    ? selectedProject?.budget_max
                    : selectedProposal?.harga_tawar,
                )}
              </span>
            </div>
            {isUmkm && (
              <Link
                to={`/projects/${selectedProject?.id}`}
                className="text-brand-indigo hover:underline flex items-center gap-1 font-bold text-[11px]"
              >
                <span>Lihat Brief Lengkap</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>

        {/* Sub-Nav Segmented Tabs for the Active Workroom */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 pt-2 border-t border-border">
          <button
            onClick={() => setActiveStageTab("chat")}
            className={`px-3 py-2 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeStageTab === "chat"
                ? "bg-brand-indigo text-white shadow-brand"
                : "bg-canvas border border-border text-muted hover:text-dark-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Obrolan</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveStageTab("deliverable")}
            className={`px-3 py-2 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeStageTab === "deliverable"
                ? "bg-dark-900 text-white shadow-xs"
                : "bg-canvas border border-border text-muted hover:text-dark-900"
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Deliverable</span>
            {activeDeliverable && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                Ada
              </span>
            )}
          </button>

          {isUmkm && (
            <button
              onClick={() => setActiveStageTab("applicants")}
              className={`px-3 py-2 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeStageTab === "applicants"
                  ? "bg-dark-900 text-white shadow-xs"
                  : "bg-canvas border border-border text-muted hover:text-dark-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Pelamar ({projectProposals.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveStageTab("brief")}
            className={`px-3 py-2 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeStageTab === "brief"
                ? "bg-dark-900 text-white shadow-xs"
                : "bg-canvas border border-border text-muted hover:text-dark-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Brief & Kontrak</span>
          </button>
        </div>
      </div>

      {/* STAGE TAB 1: INTEGRATED REAL-TIME CHAT PANEL */}
      {activeStageTab === "chat" && (
        <div className="animate-in fade-in duration-200">
          <WorkroomChatPanel
            projectId={activeProjectId}
            projectTitle={activeProjectTitle}
            partnerName={activePartnerName}
            partnerRole={activePartnerRole}
            partnerPhoto={activePartnerPhoto}
          />
        </div>
      )}

      {/* STAGE TAB 2: DELIVERABLE SUBMISSION & REVIEW */}
      {activeStageTab === "deliverable" && (
        <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-bold text-dark-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-brand-indigo" />
              <span>Berkas Hasil Pekerjaan (Deliverable)</span>
            </h3>
            <span className="text-xs text-muted">
              Garansi Escrow Cair setelah disetujui
            </span>
          </div>

          {activeDeliverable ? (
            <div className="space-y-4">
              <div className="p-4 bg-canvas rounded-2xl border border-border space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-dark-900">
                    Tautan Berkas Hasil Pekerjaan:
                  </span>
                  <a
                    href={activeDeliverable.url_berkas}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-900 text-white text-xs font-bold hover:bg-dark-800 transition-colors shadow-xs"
                  >
                    <span>Buka / Unduh Berkas Deliverable</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {activeDeliverable.catatan_pengiriman && (
                  <div className="text-xs text-dark-900/90 bg-surface p-3.5 rounded-xl border border-border">
                    <span className="font-bold text-dark-900 block mb-0.5">
                      Catatan Pengiriman Mahasiswa:
                    </span>
                    "{activeDeliverable.catatan_pengiriman}"
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-[11px] text-muted">
                  <span>
                    Jumlah Revisi:{" "}
                    <b>{activeDeliverable.jumlah_revisi || 0} dari 2 kali</b>
                  </span>
                  <span>
                    Diserahkan:{" "}
                    {formatDate(
                      activeDeliverable.submitted_at ||
                        activeDeliverable.created_at,
                    )}
                  </span>
                </div>
              </div>

              {/* UMKM Action Bar */}
              {isUmkm &&
                activeDeliverable.status !== "APPROVED" &&
                activeDeliverable.status !== "COMPLETED" && (
                  <div className="pt-2 flex flex-col sm:flex-row justify-end gap-2.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSubmissionForRevision(activeDeliverable);
                        setRevisionModalOpen(true);
                      }}
                      disabled={activeDeliverable.jumlah_revisi >= 2}
                      className="text-xs font-bold border-border text-dark-900 hover:bg-canvas"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      {activeDeliverable.jumlah_revisi >= 2
                        ? "Batas Revisi Habis (2/2)"
                        : "Minta Revisi"}
                    </Button>

                    <Button
                      variant="brand"
                      size="sm"
                      onClick={() => handleApproveWork(activeDeliverable.id)}
                      className="text-xs font-bold shadow-brand"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Setujui & Cairkan Honor Escrow
                    </Button>
                  </div>
                )}

              {/* Mahasiswa Update Deliverable Action */}
              {!isUmkm &&
                activeDeliverable.status !== "APPROVED" &&
                activeDeliverable.status !== "COMPLETED" && (
                  <div className="pt-2 flex justify-end">
                    <Button
                      variant="brand"
                      size="sm"
                      onClick={() =>
                        handleOpenSubmission(selectedProposal.project_id)
                      }
                      className="text-xs font-bold shadow-brand"
                    >
                      <UploadCloud className="w-3.5 h-3.5 mr-1" />
                      Perbarui Berkas Deliverable
                    </Button>
                  </div>
                )}

              {/* Approved Completed Success Banner */}
              {(activeDeliverable.status === "APPROVED" ||
                activeDeliverable.status === "COMPLETED") && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-950">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold block">
                        Deliverable Disetujui & Proyek Selesai!
                      </span>
                      <span className="text-[11px] text-emerald-800">
                        Dana honor escrow telah 100% diteruskan ke dompet
                        mahasiswa.
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] uppercase">
                    Lunas & Tuntas
                  </span>
                </div>
              )}
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
                <p className="text-[11px] text-muted max-w-sm mx-auto mt-1">
                  {isUmkm
                    ? "Begitu mahasiswa mengunggah tautan hasil kerja (Figma, GitHub, atau Drive), berkas akan otomatis muncul di sini untuk Anda verifikasi."
                    : "Setelah pekerjaan selesai sesuai brief, unggah tautan hasil kerja Anda agar dapat diperiksa klien dan honor escrow dicairkan."}
                </p>
              </div>

              {!isUmkm && (
                <Button
                  variant="brand"
                  size="sm"
                  onClick={() =>
                    handleOpenSubmission(selectedProposal.project_id)
                  }
                  className="text-xs font-bold shadow-brand mt-2"
                >
                  <UploadCloud className="w-3.5 h-3.5 mr-1" />
                  Serahkan Berkas Deliverable Sekarang
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* STAGE TAB 3: APPLICANTS PROPOSALS (FOR UMKM) */}
      {activeStageTab === "applicants" && isUmkm && (
        <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-bold text-dark-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-indigo" />
              <span>
                Pelamar Mahasiswa yang Masuk ({projectProposals.length})
              </span>
            </h3>
            <span className="text-xs text-muted">
              Evaluasi & pilih kandidat terbaik
            </span>
          </div>

          {projectProposals.length === 0 ? (
            <div className="p-8 text-center bg-canvas rounded-2xl border border-border space-y-1">
              <Users className="w-8 h-8 text-muted mx-auto opacity-40" />
              <p className="text-xs font-bold text-dark-900">
                Belum Ada Pelamar Masuk
              </p>
              <p className="text-[11px] text-muted">
                Proyek Anda sedang aktif tayang di katalog terbuka mahasiswa.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {projectProposals.map((prop) => {
                const isAccepted = prop.status === "ACCEPTED";
                const isRejected = prop.status === "REJECTED";

                return (
                  <div
                    key={prop.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isAccepted
                        ? "bg-emerald-50/20 border-emerald-200 shadow-xs"
                        : isRejected
                          ? "bg-canvas border-border opacity-70"
                          : "bg-canvas border-border hover:border-dark-900/30"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          {prop.mhs_profile?.url_foto ? (
                            <img
                              src={prop.mhs_profile.url_foto}
                              alt={prop.mhs_profile?.nama_lengkap || "Pelamar"}
                              className="w-7 h-7 rounded-full object-cover shrink-0 border border-border shadow-xs"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold text-xs shrink-0">
                              {(prop.mhs_profile?.nama_lengkap || "M")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}
                          <span className="text-xs font-bold text-dark-900">
                            {prop.mhs_profile?.nama_lengkap ||
                              "Mahasiswa Pelamar"}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isAccepted
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : isRejected
                                  ? "bg-rose-50 text-rose-800 border-rose-200"
                                  : "bg-surface text-muted border-border"
                            }`}
                          >
                            {isAccepted
                              ? "Disetujui"
                              : isRejected
                                ? "Ditolak"
                                : "Menunggu Seleksi"}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted mt-0.5">
                          {prop.mhs_profile?.asal_kampus ||
                            "Perguruan Tinggi Terakreditasi"}{" "}
                          • Estimasi: {prop.estimasi_hari} Hari
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-sm font-extrabold text-dark-900">
                          {formatCurrency(prop.harga_tawar)}
                        </span>
                      </div>
                    </div>

                    {(() => {
                      const parsed = parseCoverLetter(prop.cover_letter);
                      return (
                        <div className="bg-surface p-3.5 rounded-xl border border-border text-xs text-dark-900/90 leading-relaxed mb-3 space-y-2">
                          <div>
                            <span className="font-bold text-dark-900 block mb-0.5">
                              Rencana Pengerjaan Pelamar:
                            </span>
                            <p className="whitespace-pre-wrap">{parsed.text}</p>
                          </div>

                          {parsed.tools.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/60">
                              <span className="text-[10px] font-bold text-muted uppercase">
                                Keahlian:
                              </span>
                              {parsed.tools.map((tool) => (
                                <span
                                  key={tool}
                                  className="px-2 py-0.5 rounded-md bg-brand-indigo/10 text-brand-indigo font-bold text-[10px] border border-brand-indigo/20"
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>
                          )}

                          {parsed.portfolio && (
                            <div className="pt-1.5 border-t border-border/60">
                              <a
                                href={parsed.portfolio}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-brand-indigo hover:underline font-bold text-[11px]"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Lihat Portofolio Pelamar</span>
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-border/60">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveStageTab("chat")}
                        className="text-xs font-bold border-brand-indigo/30 text-brand-indigo hover:bg-brand-indigo/5 flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Buka Obrolan</span>
                      </Button>

                      {(selectedProject.status === "OPEN" ||
                        selectedProject.status === "BIDDING") &&
                        prop.status === "PENDING" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectProposal(prop)}
                              className="text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
                            >
                              Tolak
                            </Button>
                            <Button
                              variant="brand"
                              size="sm"
                              onClick={() => handleAcceptProposal(prop)}
                              className="text-xs font-bold shadow-brand"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                              Terima & Kunci Escrow
                            </Button>
                          </>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* STAGE TAB 4: CONTRACT & BRIEF DETAILS */}
      {activeStageTab === "brief" && (
        <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="border-b border-border pb-3">
            <h3 className="text-sm font-bold text-dark-900">
              Rincian Brief & Kesepakatan Kontrak
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Spesifikasi pengerjaan yang disepakati kedua belah pihak
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-canvas p-4 rounded-2xl border border-border space-y-1.5">
              <span className="text-[10px] font-bold text-muted uppercase">
                Kategori & Bidang
              </span>
              <p className="font-bold text-dark-900">
                {isUmkm
                  ? selectedProject?.kategori
                  : selectedProposal?.project_kategori || "Desain Kreatif"}
              </p>
            </div>

            <div className="bg-canvas p-4 rounded-2xl border border-border space-y-1.5">
              <span className="text-[10px] font-bold text-muted uppercase">
                Batas Honor Disepakati
              </span>
              <p className="font-bold text-dark-900">
                {formatCurrency(
                  isUmkm
                    ? selectedProject?.budget_max
                    : selectedProposal?.harga_tawar,
                )}
              </p>
            </div>
          </div>

          {/* Brief Kebutuhan Proyek dari Klien UMKM */}
          <div className="bg-canvas p-4 rounded-2xl border border-border space-y-2 text-xs">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
              Brief & Kebutuhan Proyek Klien
            </span>
            <p className="text-dark-900 leading-relaxed whitespace-pre-wrap">
              {isUmkm
                ? selectedProject?.deskripsi_raw || "Rincian brief proyek UMKM."
                : selectedProposal?.project_deskripsi ||
                  "Brief kebutuhan proyek yang telah diterbitkan oleh klien UMKM."}
            </p>
          </div>

          {/* Proposal Cover Letter if Student view */}
          {!isUmkm &&
            selectedProposal &&
            (() => {
              const parsed = parseCoverLetter(selectedProposal.cover_letter);
              return (
                <div className="bg-canvas p-4 rounded-2xl border border-border space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Surat Lamaran & Rencana Pengerjaan Anda
                    </span>
                    <p className="text-dark-900/90 whitespace-pre-wrap leading-relaxed">
                      {parsed.text}
                    </p>
                  </div>

                  {parsed.tools.length > 0 && (
                    <div className="pt-2 border-t border-border/60">
                      <span className="text-[10px] font-bold text-muted uppercase block mb-1.5">
                        Perangkat & Keahlian yang Diajukan:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {parsed.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-2.5 py-0.5 rounded-lg bg-brand-indigo/10 text-brand-indigo font-bold text-[10px] border border-brand-indigo/20"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {parsed.portfolio && (
                    <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted uppercase">
                        Tautan Portofolio Pendukung:
                      </span>
                      <a
                        href={parsed.portfolio}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-xs text-brand-indigo hover:underline"
                      >
                        <span>Buka Tautan Portofolio</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })()}
        </div>
      )}
    </div>
  );
}
