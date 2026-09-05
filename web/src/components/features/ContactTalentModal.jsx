import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { projectApi } from "../../api";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { StarRating } from "../ui/StarRating";
import {
  X,
  MessageSquare,
  Mail,
  ExternalLink,
  Briefcase,
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

  const isUmkm = isAuthenticated && user?.role?.toUpperCase() === "UMKM";

  useEffect(() => {
    if (isOpen && isUmkm) {
      async function loadProjects() {
        try {
          setLoadingProjects(true);
          const res = await projectApi.getMyProjects();
          const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
          setMyProjects(list);
          if (list.length > 0) {
            setSelectedProjectId(list[0].id);
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

  const handleOpenProjectChat = () => {
    if (!selectedProjectId) return;
    onClose();
    navigate(`/projects/${selectedProjectId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-canvas/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-cyan to-brand-indigo text-white font-serif font-bold text-base flex items-center justify-center shadow-xs">
              {talent.nama_lengkap ? talent.nama_lengkap.charAt(0).toUpperCase() : "M"}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-dark-900 leading-tight">
                  {talent.nama_lengkap}
                </h3>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-brand-indigo" />
                <span>{talent.prodi}</span>
                <span>•</span>
                <span className="font-semibold text-emerald-700">Terverifikasi</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-muted hover:text-dark-900 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Key Stats Summary */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-canvas rounded-2xl border border-border">
            <div>
              <span className="text-[11px] text-muted block">Rating Kepuasan</span>
              <div className="flex items-center gap-1.5 mt-1">
                <StarRating rating={Number(talent.rating_avg) || 5.0} size="xs" />
                <span className="text-xs font-bold text-dark-900">
                  {Number(talent.rating_avg).toFixed(1)}
                </span>
              </div>
            </div>
            <div>
              <span className="text-[11px] text-muted block">Proyek Selesai</span>
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
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-brand-indigo-light text-brand-indigo border border-brand-indigo/15"
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
                  <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-3">
                    <label className="text-xs font-bold text-indigo-950 block">
                      Pilih Proyek Anda untuk Diskusi / Chat:
                    </label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-surface border border-indigo-200 rounded-xl text-dark-900 font-sans focus:outline-none focus:border-brand-indigo"
                    >
                      {myProjects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.judul} ({p.status})
                        </option>
                      ))}
                    </select>

                    <Button
                      variant="brand"
                      size="sm"
                      onClick={handleOpenProjectChat}
                      className="w-full font-bold text-xs shadow-brand"
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                      Buka Ruang Diskusi Proyek
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-canvas border border-border rounded-2xl space-y-2 text-center">
                    <p className="text-xs text-muted">
                      Anda belum memiliki proyek aktif untuk mengajak mahasiswa ini.
                    </p>
                    <Link to="/projects/new" onClick={onClose}>
                      <Button variant="brand" size="sm" className="font-bold text-xs">
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
                      <span className="font-semibold text-dark-900 block">Email Institusi</span>
                      <span className="text-[11px] text-muted">{talent.email}</span>
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
              <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl text-center space-y-2">
                <ShieldCheck className="w-6 h-6 text-brand-indigo mx-auto" />
                <p className="text-xs text-indigo-950 font-medium">
                  Masuk sebagai <b>Klien UMKM</b> untuk langsung mengajak talenta ini berkolaborasi dalam proyek Anda.
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <Link to="/login" onClick={onClose}>
                    <Button variant="brand" size="sm" className="text-xs font-bold">
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
