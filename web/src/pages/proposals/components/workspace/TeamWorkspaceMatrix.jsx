import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  FileCode,
  Palette,
  FolderArchive,
  Globe,
  FileText,
  Sparkles,
  ArrowRight,
  UserCheck,
  Share2,
  X,
} from "lucide-react";
import { ProjectBriefVectorIcon } from "../../../../components/icons/ProjectVectorIcon";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { formatDate } from "../../../../utils/formatDate";
import { Button } from "../../../../components/ui/Button";

// Initial mock shared resources if none yet added
const DEFAULT_SHARED_RESOURCES = [
  {
    id: "sr-1",
    title: "Design System & Figma Tokens",
    type: "FIGMA",
    uploaderName: "Mahasiswa UI/UX",
    uploaderRole: "UI/UX Designer",
    url: "https://figma.com/@makarya/design-tokens",
    note: "Komponen dasar button, typography scale, dan warna primer untuk developer frontend.",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: "sr-2",
    title: "Dokumentasi API & Schema Payload",
    type: "CODE",
    uploaderName: "Mahasiswa Backend",
    uploaderRole: "Backend Developer",
    url: "https://github.com/makarya/api-spec",
    note: "Kontrak response JSON endpoint auth, katalog produk, dan webhook pembayaran.",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

export function TeamWorkspaceMatrix({
  project,
  isUmkm = false,
  onApproveSlot,
}) {
  const slots = project?.slots || [];
  const [sharedResources, setSharedResources] = useState(
    DEFAULT_SHARED_RESOURCES,
  );
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    title: "",
    type: "FIGMA",
    url: "",
    note: "",
  });

  // Calculate team progress stats
  const totalSlots = slots.length;
  const filledSlots = slots.filter(
    (s) => s.status === "IN_PROGRESS" || s.status === "COMPLETED",
  ).length;
  const completedSlots = slots.filter((s) => s.status === "COMPLETED").length;
  const teamProgressPercent =
    totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

  const handleAddResource = (e) => {
    e.preventDefault();
    if (!newResource.title || !newResource.url) return;

    const resourceItem = {
      id: `sr-${Date.now()}`,
      title: newResource.title,
      type: newResource.type,
      uploaderName: isUmkm ? "Klien UMKM" : "Mahasiswa Tim",
      uploaderRole: isUmkm ? "Owner Klien" : "Talenta Tim",
      url: newResource.url,
      note: newResource.note || "Aset pendukung pengerjaan proyek bersama tim.",
      createdAt: new Date().toISOString(),
    };

    setSharedResources([resourceItem, ...sharedResources]);
    setNewResource({ title: "", type: "FIGMA", url: "", note: "" });
    setIsShareModalOpen(false);
  };

  const getRoleBadgeStyle = (roleName = "") => {
    const lower = roleName.toLowerCase();
    if (
      lower.includes("ui") ||
      lower.includes("ux") ||
      lower.includes("desain")
    ) {
      return {
        bg: "bg-purple-50 text-purple-700 border-purple-200",
        dot: "bg-purple-500",
      };
    }
    if (
      lower.includes("front") ||
      lower.includes("web") ||
      lower.includes("mobile")
    ) {
      return {
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-500",
      };
    }
    if (
      lower.includes("back") ||
      lower.includes("api") ||
      lower.includes("data")
    ) {
      return {
        bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
        dot: "bg-indigo-500",
      };
    }
    if (
      lower.includes("copy") ||
      lower.includes("konten") ||
      lower.includes("content")
    ) {
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
      };
    }
    return {
      bg: "bg-slate-100 text-slate-700 border-slate-200",
      dot: "bg-slate-500",
    };
  };

  return (
    <div className="space-y-6">
      {/* 1. Team Progress Barometer Card */}
      <div className="bg-gradient-to-b from-white to-slate-50/70 rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_4px_24px_rgba(15,23,42,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 shadow-2xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 block">
                Struktur & Formasi Tim Proyek
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Kolaborasi Multi-Talenta Mahasiswa ({totalSlots} Peran Kerja)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
              {filledSlots} dari {totalSlots} Talenta Terisi
            </span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              {completedSlots} Selesai ({teamProgressPercent}%)
            </span>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500 font-semibold px-1">
            <span>Tingkat Penyelesaian Tim Keseluruhan</span>
            <span>{teamProgressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${teamProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Interactive Role Matrix Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ProjectBriefVectorIcon
              size={16}
              className="w-4 h-4 text-indigo-600 shrink-0"
            />
            <span>Matriks Pembagian Peran & Alokasi Escrow</span>
          </h4>
          <span className="text-xs text-slate-500">
            Escrow cair per-slot saat tugas peran disetujui
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {slots.map((slot, sIdx) => {
            const isFilled =
              slot.status === "IN_PROGRESS" || slot.status === "COMPLETED";
            const isCompleted = slot.status === "COMPLETED";
            const roleStyle = getRoleBadgeStyle(slot.nama_peran);

            return (
              <div
                key={slot.id || sIdx}
                className={`rounded-2xl border p-4 transition-all flex flex-col justify-between space-y-3 ${
                  isCompleted
                    ? "bg-emerald-50/40 border-emerald-200 shadow-2xs"
                    : isFilled
                      ? "bg-white border-slate-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.03)]"
                      : "bg-slate-50/50 border-dashed border-slate-300"
                }`}
              >
                <div className="space-y-2.5">
                  {/* Top: Role Badge & Budget */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold border ${roleStyle.bg}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${roleStyle.dot}`}
                      />
                      <span className="truncate max-w-[130px]">
                        {slot.nama_peran}
                      </span>
                    </span>

                    <span className="text-xs font-extrabold text-slate-900">
                      {formatCurrency(slot.alokasi_budget)}
                    </span>
                  </div>

                  {/* Task Description */}
                  {slot.deskripsi_tugas && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {slot.deskripsi_tugas}
                    </p>
                  )}

                  {/* Assigned Student Profile */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2.5">
                    {isFilled ? (
                      <>
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          {slot.accepted_mhs_nama
                            ? slot.accepted_mhs_nama.charAt(0).toUpperCase()
                            : "M"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-slate-900 truncate block">
                            {slot.accepted_mhs_nama || "Mahasiswa Pelaksana"}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate">
                            Talenta Terpilih
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 py-1">
                        <Users className="w-4 h-4" />
                        <span className="text-xs italic">
                          Menunggu penetapan pelamar
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Actions Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Selesai & Lunas</span>
                      </span>
                    ) : isFilled ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>Pengerjaan Aktif</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400">
                        Slot Terbuka
                      </span>
                    )}
                  </div>

                  {/* UMKM Independent Slot Approval Button */}
                  {isUmkm && isFilled && !isCompleted && onApproveSlot && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onApproveSlot(slot)}
                      className="text-[11px] font-bold py-1 px-2.5 h-auto rounded-lg text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Cairkan Slot
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Estafet Berkas & Shared Team Resource Hub */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_4px_24px_rgba(15,23,42,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Papan Estafet Aset & Berkas Kerja Tim (Shared Resources)
              </h4>
              <p className="text-xs text-slate-500">
                Ruang pertukaran aset internal antar-mahasiswa (Token desain,
                API doc, materi teks)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs shrink-0 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Bagikan Aset ke Rekan Tim</span>
          </button>
        </div>

        {/* Resource Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sharedResources.map((res) => {
            const isFigma = res.type === "FIGMA";
            const isCode = res.type === "CODE";
            return (
              <div
                key={res.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 ${
                        isFigma
                          ? "bg-purple-600"
                          : isCode
                            ? "bg-slate-800"
                            : "bg-blue-600"
                      }`}
                    >
                      {isFigma ? (
                        <Palette className="w-4 h-4" />
                      ) : isCode ? (
                        <FileCode className="w-4 h-4" />
                      ) : (
                        <FolderArchive className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block truncate max-w-[180px]">
                        {res.title}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Oleh {res.uploaderName} ({res.uploaderRole})
                      </span>
                    </div>
                  </div>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline shrink-0"
                  >
                    <span>Buka Aset</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 italic">
                  "{res.note}"
                </p>

                <div className="pt-1 text-[10px] text-slate-400">
                  Dibagikan {formatDate(res.createdAt)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share Resource Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Bagikan Aset Kerja ke Rekan Tim
              </h3>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddResource} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama / Judul Aset
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Figma UI Kit v1.0 / Endpoint Postman"
                  value={newResource.title}
                  onChange={(e) =>
                    setNewResource({ ...newResource, title: e.target.value })
                  }
                  required
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tipe Aset
                </label>
                <select
                  value={newResource.type}
                  onChange={(e) =>
                    setNewResource({ ...newResource, type: e.target.value })
                  }
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="FIGMA">Figma / Desain UI</option>
                  <option value="CODE">GitHub / Repositori / API</option>
                  <option value="DRIVE">Google Drive / Cloud Folder</option>
                  <option value="DOCS">Dokumen / Copywriting</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tautan URL Aset
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newResource.url}
                  onChange={(e) =>
                    setNewResource({ ...newResource, url: e.target.value })
                  }
                  required
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Catatan untuk Rekan Tim
                </label>
                <textarea
                  rows={2}
                  placeholder="Jelaskan cara penggunaan atau bagian yang perlu dilanjutkan..."
                  value={newResource.note}
                  onChange={(e) =>
                    setNewResource({ ...newResource, note: e.target.value })
                  }
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                >
                  Batal
                </Button>
                <Button variant="brand" size="sm" type="submit">
                  Bagikan Sekarang
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
