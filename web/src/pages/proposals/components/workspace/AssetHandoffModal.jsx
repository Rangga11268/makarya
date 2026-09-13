import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  X,
  FileCheck2,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { Button } from "../../../../components/ui/Button";

export function AssetHandoffModal({
  isOpen,
  onClose,
  onConfirm,
  projectTitle,
  budgetAmount = 0,
  loading = false,
}) {
  const [checklist, setChecklist] = useState({
    filesVerified: false,
    rightsTransferred: false,
    briefFulfilled: false,
    escrowApproved: false,
  });

  if (!isOpen) return null;

  const toggleItem = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isAllChecked =
    checklist.filesVerified &&
    checklist.rightsTransferred &&
    checklist.briefFulfilled &&
    checklist.escrowApproved;

  const checkAll = () => {
    const target = !isAllChecked;
    setChecklist({
      filesVerified: target,
      rightsTransferred: target,
      briefFulfilled: target,
      escrowApproved: target,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-b from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                Protokol Serah Terima Aset
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                Verifikasi & Pencairan Escrow
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Project & Payout Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Proyek yang Diselesaikan:
            </span>
            <p className="text-sm font-bold text-slate-900 line-clamp-1">
              {projectTitle}
            </p>
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">
                Total Honor Escrow yang Dicairkan:
              </span>
              <span className="text-base font-extrabold text-emerald-700">
                Rp {formatCurrency(budgetAmount)}
              </span>
            </div>
          </div>

          {/* Explanation Notice */}
          <p className="text-xs text-slate-600 leading-relaxed">
            Sebelum dana garansi escrow Makarya diteruskan 100% ke dompet
            mahasiswa, mohon konfirmasi bahwa berkas pengerjaan telah Anda
            terima dengan lengkap:
          </p>

          {/* Interactive Handoff Checklist */}
          <div className="space-y-2.5">
            {[
              {
                key: "filesVerified",
                title: "Berkas Master / Kode Sumber Teruji",
                desc: "File pengerjaan dapat dibuka, tidak rusak, dan berfungsi normal sesuai instruksi.",
              },
              {
                key: "rightsTransferred",
                title: "Hak Milik / Akses Digital Lengkap",
                desc: "Seluruh hak pakai, akses akun, atau aset desain telah diserahkan ke pihak UMKM.",
              },
              {
                key: "briefFulfilled",
                title: "Kesesuaian Deliverable",
                desc: "Hasil akhir telah sesuai dengan rincian brief awal dan tidak memerlukan revisi lagi.",
              },
              {
                key: "escrowApproved",
                title: "Otorisasi Pencairan 100% Escrow",
                desc: "Saya menyatakan pekerjaan selesai dan menyetujui pelepasan honor ke mahasiswa.",
              },
            ].map((item) => {
              const isChecked = checklist[item.key];
              return (
                <label
                  key={item.key}
                  onClick={() => toggleItem(item.key)}
                  className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                    isChecked
                      ? "bg-emerald-50/70 border-emerald-300/80 text-emerald-950 shadow-2xs"
                      : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div className="flex-1 space-y-0.5">
                    <span className="text-xs font-bold block">
                      {item.title}
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Select All Toggle */}
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={checkAll}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isAllChecked ? "Hapus Centang Semua" : "Centang Semua Poin"}
            </button>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-end gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={loading}
            className="text-xs font-bold border-slate-200"
          >
            Batal
          </Button>

          <Button
            variant="brand"
            size="md"
            onClick={onConfirm}
            loading={loading}
            disabled={!isAllChecked || loading}
            className="text-xs font-bold shadow-brand bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 px-5"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Konfirmasi & Cairkan Honor
          </Button>
        </div>
      </div>
    </div>
  );
}
