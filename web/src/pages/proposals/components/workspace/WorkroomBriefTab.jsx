import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Layers,
  Briefcase,
  ShieldCheck,
  Clock,
  ExternalLink,
  Users,
  Coins,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { formatDate } from "../../../../utils/formatDate";

export function WorkroomBriefTab({
  selectedProject,
  selectedProposal,
  isUmkm,
  assignedRoleName,
  parseCoverLetter,
  handleDownloadSpk,
  downloadingSpk,
  setInvoiceModalOpen,
  onOpenReopenModal,
  onOpenTerminateModal,
  onOpenResignModal,
}) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200 font-sans">
      {/* Metric Summary Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface p-4 rounded-2xl border border-border shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Kategori & Bidang
            </span>
            <Layers className="w-4 h-4 text-brand-indigo" />
          </div>
          <p className="font-bold text-dark-900 text-sm truncate">
            {selectedProject?.kategori ||
              selectedProposal?.project_kategori ||
              "Desain Kreatif"}
          </p>
          <span className="text-[10px] text-muted block">
            Target industri UMKM
          </span>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Posisi Kontrak
            </span>
            <Briefcase className="w-4 h-4 text-brand-indigo" />
          </div>
          <p className="font-bold text-brand-indigo text-sm truncate">
            {assignedRoleName ||
              (selectedProject?.tipe_kolaborasi === "TIM"
                ? "Anggota Tim Proyek"
                : "Pelaksana Utama")}
          </p>
          <span className="text-[10px] text-muted block">
            {selectedProject?.tipe_kolaborasi === "TIM"
              ? "Multi-Talenta Tim"
              : "Pengerjaan Individu"}
          </span>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Garansi Escrow
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-extrabold text-dark-900 text-sm">
            {formatCurrency(
              isUmkm
                ? selectedProject?.budget_max
                : selectedProposal?.harga_tawar || selectedProject?.budget_max,
            )}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold block">
            100% Saldo Diamankan
          </span>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Tenggat Pengerjaan
            </span>
            <Clock className="w-4 h-4 text-brand-indigo" />
          </div>
          <p className="font-bold text-dark-900 text-sm">
            {selectedProject?.deadline
              ? formatDate(selectedProject.deadline)
              : "Ditentukan Klien"}
          </p>
          <span className="text-[10px] text-muted block">
            Durasi waktu kerja
          </span>
        </div>
      </div>

      {/* Full Project Brief Requirements */}
      <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-4">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-dark-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-indigo" />
              <span>Brief & Spesifikasi Kebutuhan Klien UMKM</span>
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Panduan acuan pengerjaan yang disepakati untuk deliverable proyek
            </p>
          </div>
          {isUmkm && (
            <Link
              to={`/projects/${selectedProject?.id}`}
              className="text-xs font-bold text-brand-indigo hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Halaman Eksplorasi</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>

        <div className="bg-canvas p-4 sm:p-5 rounded-2xl border border-border space-y-3">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
            Deskripsi Lengkap Kebutuhan
          </span>
          <p className="text-xs text-dark-900 leading-relaxed whitespace-pre-wrap">
            {selectedProject?.deskripsi_raw ||
              selectedProposal?.project_deskripsi ||
              "Brief kebutuhan proyek resmi yang diterbitkan oleh klien UMKM."}
          </p>
        </div>

        {/* Formasi Peran & Alokasi Pagu Anggaran Awal Klien */}
        {selectedProject?.tipe_kolaborasi === "TIM" ||
        (selectedProject?.slots && selectedProject.slots.length > 0) ? (
          <div className="bg-canvas p-4 sm:p-5 rounded-2xl border border-border space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-indigo" />
                <div>
                  <h4 className="text-xs font-bold text-dark-900">
                    Alokasi Pagu & Honor Formasi Tim Awal Klien
                  </h4>
                  <p className="text-[10px] text-muted">
                    Pembagian honor dan tanggung jawab spesifik per talenta
                    sesuai rancangan awal proyek oleh Klien UMKM
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-muted uppercase">
                  Total Pagu:
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                  {formatCurrency(
                    selectedProject?.budget_max ||
                      selectedProposal?.project_budget_max ||
                      0,
                  )}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {(selectedProject?.slots || []).map((slot, sIdx) => {
                const isMySlot =
                  !isUmkm &&
                  ((selectedProposal?.slot_id &&
                    slot.id === selectedProposal.slot_id) ||
                    (assignedRoleName &&
                      slot.nama_peran?.toLowerCase() ===
                        assignedRoleName?.toLowerCase()));
                const isCompleted = slot.status === "COMPLETED";
                const isFilled =
                  slot.status === "IN_PROGRESS" ||
                  slot.status === "COMPLETED" ||
                  slot.accepted_mhs_id;

                return (
                  <div
                    key={slot.id || sIdx}
                    className={`p-3.5 rounded-xl border space-y-2 transition-all ${
                      isMySlot
                        ? "bg-brand-indigo/5 border-brand-indigo/40 ring-1 ring-brand-indigo/20"
                        : "bg-surface border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${isCompleted ? "bg-emerald-500" : isFilled ? "bg-blue-500" : "bg-slate-300"}`}
                        />
                        <span className="text-xs font-bold text-dark-900 truncate">
                          {slot.nama_peran}
                        </span>
                        {isMySlot && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-brand-indigo text-white shrink-0">
                            Peran Anda
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-extrabold text-emerald-700 font-mono shrink-0">
                        {formatCurrency(slot.alokasi_budget)}
                      </span>
                    </div>

                    {slot.deskripsi_tugas && (
                      <p className="text-[11px] text-muted leading-relaxed line-clamp-2">
                        {slot.deskripsi_tugas}
                      </p>
                    )}

                    <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-[10px] text-slate-500">
                      <span>
                        {slot.accepted_mhs_nama ? (
                          <strong className="text-dark-900 font-semibold">
                            {slot.accepted_mhs_nama}
                          </strong>
                        ) : isFilled ? (
                          "Talenta Terpilih"
                        ) : (
                          "Menunggu Pelamar"
                        )}
                      </span>
                      <span
                        className={`font-semibold ${isCompleted ? "text-emerald-700" : isFilled ? "text-blue-700" : "text-slate-400"}`}
                      >
                        {isCompleted
                          ? "Selesai & Lunas"
                          : isFilled
                            ? "Pengerjaan Aktif"
                            : "Slot Terbuka"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-canvas p-4 sm:p-5 rounded-2xl border border-border space-y-2">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-dark-900">
                  Pagu Anggaran & Honor Pelaksana Proyek
                </span>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                {formatCurrency(
                  isUmkm
                    ? selectedProject?.budget_max
                    : selectedProposal?.harga_tawar ||
                        selectedProject?.budget_max ||
                        0,
                )}
              </span>
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              Pengerjaan proyek berbasis individu dengan pagu kompensasi tunggal
              yang telah disetujui bersama antara Klien UMKM dan Mahasiswa
              Pelaksana.
            </p>
          </div>
        )}

        {/* Quality Standard & Intellectual Property Protection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-canvas border border-border space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-dark-900">
                Peralihan Hak Cipta (IP Transfer)
              </span>
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              Seluruh hak cipta dan kepemilikan intelektual atas deliverable karya
              beralih secara penuh dan eksklusif kepada Klien UMKM setelah
              pelunasan dana escrow disetujui.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-canvas border border-border space-y-2">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-brand-indigo shrink-0" />
              <span className="text-xs font-bold text-dark-900">
                Ketentuan Garansi & Revisi
              </span>
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              Klien berhak mengajukan revisi terstruktur sesuai brief awal. Jika
              klien tidak memberikan tinjauan dalam 7 hari setelah submisi,
              escrow akan otomatis dicairkan sistem demi kepastian talenta.
            </p>
          </div>
        </div>
      </div>

      {/* Proposal Cover Letter if Student view */}
      {!isUmkm &&
        selectedProposal &&
        (() => {
          const parsed = parseCoverLetter(selectedProposal.cover_letter);
          return (
            <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-3.5">
              <div className="border-b border-border pb-3">
                <h3 className="text-sm font-bold text-dark-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-indigo" />
                  <span>Surat Lamaran & Rencana Pengerjaan Anda</span>
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Proposal penawaran yang telah disetujui oleh Klien UMKM
                </p>
              </div>

              <div className="bg-canvas p-4 rounded-2xl border border-border space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                    Penjelasan Pendekatan Pengerjaan
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
            </div>
          );
        })()}

      {/* Contract & Escrow Management Actions */}
      <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-sm font-bold text-dark-900">
              Manajemen Kontrak & Garansi Escrow
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Dokumen legalitas kesepakatan kerja dan jaminan saldo escrow
            </p>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
        </div>

        {/* Official SPK Contract & Receipt Downloads */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-indigo-950 dark:text-indigo-200 block text-xs mb-0.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-brand-indigo" />
              <span>Surat Perjanjian Kerja Sama (SPK) Digital</span>
            </span>
            <p className="text-[11px] text-indigo-900/70 dark:text-indigo-300/80 leading-relaxed">
              Dokumen resmi ber-watermark Makarya yang memuat butir kesepakatan,
              batasan revisi maksimal 2x, garansi escrow, dan tanda tangan
              sistem.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadSpk}
              loading={downloadingSpk}
              className="text-xs font-bold shadow-xs bg-brand-indigo hover:bg-brand-indigo/90 text-white"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Unduh SPK (PDF)
            </Button>
            {isUmkm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInvoiceModalOpen(true)}
                className="text-xs font-bold border-indigo-200 text-indigo-900 dark:text-indigo-200 dark:border-indigo-800"
              >
                <Coins className="w-3.5 h-3.5 mr-1.5" />
                Resi Escrow
              </Button>
            )}
          </div>
        </div>

        {isUmkm && selectedProject?.status === "IN_PROGRESS" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-canvas border border-border flex flex-col justify-between gap-3">
              <div>
                <span className="font-bold text-dark-900 block text-xs mb-1">
                  Ganti Mahasiswa (Buka ke Eksplorasi)
                </span>
                <p className="text-[11px] text-muted leading-relaxed">
                  Jika mahasiswa tidak merespons atau berhalangan melanjutkan,
                  batalkan penugasan ini. Dana escrow otomatis kembali ke Saldo
                  Aktif Anda dan proyek dibuka kembali untuk pelamar baru.
                </p>
              </div>
              <Button
                variant="brand"
                size="sm"
                onClick={onOpenReopenModal}
                className="text-xs font-bold w-full shadow-brand"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Buka Kembali ke Eksplorasi
              </Button>
            </div>

            <div className="p-4 rounded-2xl bg-canvas border border-border flex flex-col justify-between gap-3">
              <div>
                <span className="font-bold text-dark-900 block text-xs mb-1">
                  Batalkan Proyek Permanen
                </span>
                <p className="text-[11px] text-muted leading-relaxed">
                  Hentikan seluruh pengerjaan proyek. Status proyek akan menjadi
                  Dibatalkan (CANCELLED) dan 100% saldo escrow dikembalikan ke
                  Saldo Aktif Anda.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenTerminateModal}
                className="text-xs font-bold w-full text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                <XCircle className="w-3.5 h-3.5 mr-1.5" />
                Batalkan Proyek
              </Button>
            </div>
          </div>
        )}

        {!isUmkm && selectedProposal?.status === "ACCEPTED" && (
          <div className="p-4 rounded-2xl bg-canvas border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-dark-900 block text-xs mb-0.5">
                Ajukan Pengunduran Diri dari Proyek
              </span>
              <p className="text-[11px] text-muted leading-relaxed">
                Jika Anda menghadapi kendala tak terduga yang menghalangi
                penyelesaian proyek, Anda dapat mengajukan pengunduran diri secara
                resmi. Dana escrow akan dikembalikan utuh ke klien UMKM.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenResignModal}
              className="text-xs font-bold shrink-0 text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              <XCircle className="w-3.5 h-3.5 mr-1.5" />
              Pengunduran Diri
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
