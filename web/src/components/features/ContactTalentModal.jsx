import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { projectApi } from "../../api";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { StarRating } from "../ui/StarRating";
import { formatStatus } from "../../utils/formatStatus";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  X,
  MessageSquare,
  Mail,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function ContactTalentModal({ isOpen, onClose, talent }) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [myProjects, setMyProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  const isUmkm = isAuthenticated && user?.role?.toUpperCase() === "UMKM";

  useEffect(() => {
    if (isOpen && isUmkm) {
      async function loadProjects() {
        try {
          setLoadingProjects(true);
          const res = await projectApi.getMyProjects();
          const list = Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res)
              ? res
              : [];
          setMyProjects(list);
          if (list.length > 0) {
            setSelectedProjectId(list[0].id);
            if (list[0].slots && list[0].slots.length > 0) {
              const openSlot = list[0].slots.find(
                (s) => s.status === "OPEN" || (!s.status && !s.assigned_to),
              );
              setSelectedSlotId(openSlot ? openSlot.id : list[0].slots[0].id);
            } else {
              setSelectedSlotId(null);
            }
          }
        } catch (err) {
          console.error("Gagal memuat proyek UMKM:", err);
        } finally {
          setLoadingProjects(false);
        }
      }
      loadProjects();
    }
  }, [isOpen, isUmkm]);

  if (!isOpen || !talent) return null;

  const selectedProject = myProjects.find((p) => p.id === selectedProjectId);
  const isTeamProject =
    selectedProject?.tipe_kolaborasi === "TIM" ||
    (Array.isArray(selectedProject?.slots) &&
      selectedProject?.slots.length > 0);

  const handleSelectProject = (project) => {
    setSelectedProjectId(project.id);
    if (project.slots && project.slots.length > 0) {
      const openSlot = project.slots.find(
        (s) => s.status === "OPEN" || (!s.status && !s.assigned_to),
      );
      setSelectedSlotId(openSlot ? openSlot.id : project.slots[0].id);
    } else {
      setSelectedSlotId(null);
    }
  };

  const handleOpenProjectChat = () => {
    if (!selectedProjectId) return;
    onClose();
    const slotQuery = selectedSlotId ? `&slot_id=${selectedSlotId}` : "";
    navigate(`/proposals/${selectedProjectId}?tab=chat${slotQuery}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-canvas/40">
          <div className="flex items-center gap-3">
            {talent.url_foto ? (
              <img
                src={talent.url_foto}
                alt={talent.nama_lengkap || "Talenta"}
                className="w-10 h-10 rounded-full object-cover shadow-xs border border-border"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-indigo text-white font-serif font-bold text-base flex items-center justify-center shadow-xs">
                {talent.nama_lengkap
                  ? talent.nama_lengkap.charAt(0).toUpperCase()
                  : "M"}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-dark-900 leading-tight">
                  {talent.nama_lengkap}
                </h3>
                {talent.verified && (
                  <CheckCircle2 className="w-4 h-4 text-brand-indigo shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
                <span>{talent.prodi}</span>
                <span className="text-slate-300 font-normal">/</span>
                <span className="font-semibold text-emerald-700">
                  Terverifikasi
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-dark-900 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Key Stats Summary */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-canvas rounded-2xl border border-border">
            <div>
              <span className="text-[11px] text-muted block">
                Rating Kepuasan
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <StarRating
                  rating={Number(talent.rating_avg) || 5.0}
                  size="xs"
                />
                <span className="text-xs font-bold text-dark-900">
                  {Number(talent.rating_avg).toFixed(1)}
                </span>
              </div>
            </div>
            <div>
              <span className="text-[11px] text-muted block">
                Proyek Selesai
              </span>
              <span className="text-sm font-extrabold text-dark-900 block mt-0.5">
                {talent.total_proyek_selesai || 0} Proyek
              </span>
            </div>
          </div>

          {/* Bio / Overview */}
          {talent.bio && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
                Ringkasan Profil
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {talent.bio}
              </p>
            </div>
          )}

          {/* Skills */}
          {talent.skills && talent.skills.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
                Keahlian Utama
              </span>
              <div className="flex flex-wrap gap-1.5">
                {talent.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-brand-indigo-light text-brand-indigo border border-brand-indigo/15"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Section */}
          <div className="pt-3 border-t border-border space-y-3">
            <span className="text-xs font-bold text-dark-900 block">
              Pilihan Komunikasi & Kolaborasi:
            </span>

            {isUmkm ? (
              <div className="space-y-3">
                {loadingProjects ? (
                  <div className="p-3 text-center text-xs text-muted">
                    Memeriksa daftar proyek aktif Anda...
                  </div>
                ) : myProjects.length > 0 ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <label className="text-xs font-bold text-dark-900 block">
                      Pilih Proyek Anda untuk Diskusi / Kolaborasi:
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {myProjects.map((p) => {
                        const isSelected = selectedProjectId === p.id;
                        const isOpen =
                          p.status === "OPEN" || p.status === "BIDDING";
                        const isInProgress = p.status === "IN_PROGRESS";
                        const isTeam =
                          p.tipe_kolaborasi === "TIM" ||
                          (Array.isArray(p.slots) && p.slots.length > 0);

                        return (
                          <div
                            key={p.id}
                            onClick={() => handleSelectProject(p)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                              isSelected
                                ? "bg-white border-brand-indigo ring-1.5 ring-brand-indigo shadow-xs"
                                : "bg-white/80 border-border hover:border-slate-400"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-dark-900 truncate block">
                                  {p.judul}
                                </span>
                                {isTeam && (
                                  <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                                    Tim ({p.slots?.length || 0} Peran)
                                  </span>
                                )}
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                                    isOpen
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : isInProgress
                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                        : "bg-slate-100 text-slate-700 border border-slate-200"
                                  }`}
                                >
                                  {formatStatus(p.status)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-muted">
                                <span className="font-bold text-brand-indigo font-mono">
                                  {formatCurrency(p.budget_max)}
                                </span>
                                <span className="text-slate-300 font-normal">
                                  /
                                </span>
                                <span>{p.kategori || "UMKM Digital"}</span>
                              </div>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? "border-brand-indigo bg-brand-indigo"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Team Slots Selection Sub-Panel */}
                    {isTeamProject && selectedProject?.slots?.length > 0 && (
                      <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-slate-800">
                            Pilih Posisi / Slot Peran yang Ditawarkan:
                          </label>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {
                              selectedProject.slots.filter(
                                (s) =>
                                  s.status === "OPEN" ||
                                  (!s.status && !s.assigned_to),
                              ).length
                            }{" "}
                            slot terbuka
                          </span>
                        </div>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {selectedProject.slots.map((slot) => {
                            const isFilled =
                              slot.status === "IN_PROGRESS" ||
                              slot.status === "COMPLETED" ||
                              Boolean(slot.assigned_to);
                            const isSlotSelected = selectedSlotId === slot.id;

                            return (
                              <div
                                key={slot.id}
                                onClick={() => {
                                  if (!isFilled) {
                                    setSelectedSlotId(slot.id);
                                  }
                                }}
                                className={`p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between gap-2 ${
                                  isFilled
                                    ? "bg-slate-100/70 border-slate-200 opacity-60 cursor-not-allowed"
                                    : isSlotSelected
                                      ? "bg-white border-brand-indigo ring-1 ring-brand-indigo shadow-2xs cursor-pointer"
                                      : "bg-white border-slate-200 hover:border-slate-300 cursor-pointer"
                                }`}
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-900 truncate">
                                      {slot.nama_peran}
                                    </span>
                                    <span
                                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${
                                        isFilled
                                          ? "bg-slate-200/80 text-slate-600 border-slate-300"
                                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      }`}
                                    >
                                      {isFilled ? "Sudah Terisi" : "Terbuka"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                                    <span className="font-semibold text-brand-indigo font-mono">
                                      {formatCurrency(slot.alokasi_budget)}
                                    </span>
                                    {slot.deskripsi_tugas && (
                                      <>
                                        <span className="text-slate-300">
                                          /
                                        </span>
                                        <span className="truncate max-w-[150px]">
                                          {slot.deskripsi_tugas}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                {!isFilled && (
                                  <div
                                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                      isSlotSelected
                                        ? "border-brand-indigo bg-brand-indigo"
                                        : "border-slate-300 bg-white"
                                    }`}
                                  >
                                    {isSlotSelected && (
                                      <div className="w-1 h-1 rounded-full bg-white" />
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <Button
                      variant="brand"
                      size="sm"
                      onClick={handleOpenProjectChat}
                      className="w-full font-bold text-xs shadow-brand py-2.5 mt-2"
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                      Buka Ruang Diskusi Proyek
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-canvas border border-border rounded-2xl space-y-2 text-center">
                    <p className="text-xs text-muted">
                      Anda belum memiliki proyek aktif untuk mengajak mahasiswa
                      ini.
                    </p>
                    <Link to="/projects/new" onClick={onClose}>
                      <Button
                        variant="brand"
                        size="sm"
                        className="font-bold text-xs"
                      >
                        <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                        Pasang Proyek Baru Sekarang
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Direct Verified Email Channel */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-canvas border border-border text-xs">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-brand-indigo" />
                    <div>
                      <span className="font-semibold text-dark-900 block">
                        Email Institusi
                      </span>
                      <span className="text-[11px] text-muted">
                        {talent.email}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`mailto:${talent.email}?subject=Tawaran%20Proyek%20Makarya`}
                    className="px-2.5 py-1 text-[11px] font-bold text-brand-indigo hover:underline"
                  >
                    Kirim Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
                <ShieldCheck className="w-6 h-6 text-brand-indigo mx-auto" />
                <p className="text-xs text-dark-800 font-medium">
                  Masuk sebagai <b>Klien UMKM</b> untuk langsung mengajak
                  talenta ini berkolaborasi dalam proyek Anda.
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <Link to="/login" onClick={onClose}>
                    <Button
                      variant="brand"
                      size="sm"
                      className="text-xs font-bold"
                    >
                      Masuk Klien UMKM
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Portfolio Link */}
            {talent.url_portofolio && (
              <a
                href={
                  talent.url_portofolio.startsWith("http")
                    ? talent.url_portofolio
                    : `https://${talent.url_portofolio}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl border border-border text-xs font-semibold text-dark-900 hover:bg-canvas transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-muted" />
                <span>Lihat Portofolio Lengkap Talenta</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
