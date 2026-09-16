import React, { useRef } from "react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import {
  ShieldCheck,
  Printer,
  X,
  CheckCircle2,
  Building2,
  GraduationCap,
} from "lucide-react";
import { Button } from "../ui/Button";

export function InvoiceReceiptModal({
  isOpen,
  onClose,
  project,
  proposal,
  umkmName,
  mhsName,
}) {
  const printRef = useRef(null);

  if (!isOpen || !project) return null;

  const invoiceNo = `INV-MKR-${new Date(project.created_at || Date.now()).getFullYear()}-${(project.id || "").substring(0, 8).toUpperCase()}`;
  const transactionDate = formatDate(project.created_at || new Date());
  const contractAmount = proposal?.harga_tawar || project.budget_max || 0;
  const isCompleted =
    project.status === "DONE" || project.status === "COMPLETED";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Top Control Header (Hidden in Print) */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-slate-50/80 border-b border-slate-200/80 shrink-0 print:hidden">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-brand-indigo" />
            <span>Faktur Resmi Escrow</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="brand"
              size="sm"
              onClick={handlePrint}
              className="h-8 px-2.5 text-[11px] font-bold shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              <span>Cetak PDF</span>
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Tutup Faktur"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div
          ref={printRef}
          className="overflow-y-auto p-4 sm:p-6 font-sans text-slate-900 bg-white space-y-3.5"
        >
          {/* Invoice Top Brand & Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-950 font-display">
                  MAKARYA<span className="text-brand-indigo">.</span>
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80">
                  OFFICIAL RECEIPT
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                Platform Kolaborasi UMKM & Mahasiswa
              </p>
            </div>

            <div className="text-right space-y-0.5 shrink-0">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Nomor Faktur
              </span>
              <span className="text-xs font-mono font-bold text-slate-900 block">
                {invoiceNo}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {transactionDate}
              </span>
            </div>
          </div>

          {/* Escrow Status Banner */}
          <div className="p-3 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isCompleted
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-blue-100 text-brand-indigo"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-brand-indigo" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {isCompleted
                    ? "Transaksi Selesai (Dana Dicairkan)"
                    : "Dana Tersimpan Aman di Rekening Escrow"}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  {isCompleted
                    ? "Pekerjaan telah disetujui resmi oleh klien."
                    : "Dana terkunci aman hingga pekerjaan disetujui."}
                </span>
              </div>
            </div>

            <span
              className={`text-[9.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 border ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-blue-50 text-blue-800 border-blue-200"
              }`}
            >
              {isCompleted ? "SELESAI" : "ESCROW ACTIVE"}
            </span>
          </div>

          {/* Two Parties Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-0.5">
              <div className="flex items-center gap-1 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span>Pihak Pertama (Klien UMKM)</span>
              </div>
              <p className="font-bold text-slate-900 text-xs truncate">
                {umkmName ||
                  project.umkm_profile?.nama_usaha ||
                  "Klien UMKM Terdaftar"}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {project.umkm_profile?.bidang_industri || "Usaha Mandiri"} •{" "}
                {project.umkm_profile?.kota || "Indonesia"}
              </p>
            </div>

            <div className="p-3 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-0.5">
              <div className="flex items-center gap-1 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                <GraduationCap className="w-3 h-3 text-slate-400" />
                <span>Pihak Kedua (Mahasiswa)</span>
              </div>
              <p className="font-bold text-slate-900 text-xs truncate">
                {mhsName ||
                  project.accepted_mhs_nama ||
                  "Mahasiswa Terverifikasi"}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Pelaksana Proyek • Terverifikasi
              </p>
            </div>
          </div>

          {/* Project Details Breakdown Card */}
          <div className="p-3 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-slate-900 text-xs">
                    {project.judul}
                  </span>
                  {project.kategori && (
                    <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-brand-indigo font-semibold text-[9.5px]">
                      {project.kategori}
                    </span>
                  )}
                </div>
                {project.deskripsi_raw && (
                  <p className="text-[10.5px] text-slate-400 line-clamp-1 mt-0.5">
                    {project.deskripsi_raw}
                  </p>
                )}
              </div>
              <span className="font-bold text-slate-900 text-xs shrink-0 font-mono">
                {formatCurrency(contractAmount)}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>Proteksi Escrow & Fasilitasi Platform</span>
              <span className="font-medium text-emerald-600">
                Gratis (Rp 0)
              </span>
            </div>
          </div>

          {/* Total Calculation Row */}
          <div className="pt-1 flex justify-end">
            <div className="w-full sm:w-56 space-y-1 text-xs">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Subtotal Kontrak:</span>
                <span className="font-semibold text-slate-700">
                  {formatCurrency(contractAmount)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Biaya Layanan:</span>
                <span className="font-semibold text-slate-700">Rp 0</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-900 pt-1.5 border-t border-slate-200 items-center">
                <span>Total Escrow:</span>
                <span className="text-sm text-brand-indigo font-display font-extrabold">
                  {formatCurrency(contractAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Legal Escrow Footer Note */}
          <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed space-y-0.5">
            <p className="font-semibold text-slate-600">
              Jaminan Keabsahan & Rekening Bersama:
            </p>
            <p>
              Faktur ini merupakan bukti sah penjaminan dana melalui sistem
              Escrow Makarya. Hak cipta hasil pekerjaan beralih ke Klien UMKM
              setelah dana dicairkan. Dokumen ini sah untuk pembukuan UMKM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
