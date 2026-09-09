import React, { useRef } from "react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { ShieldCheck, Printer, X, CheckCircle2, Download, Building2, GraduationCap } from "lucide-react";
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
  const isCompleted = project.status === "DONE" || project.status === "COMPLETED";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top Control Header (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-brand-indigo" />
            <span>Faktur Resmi Perlindungan Escrow Makarya</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="brand"
              size="sm"
              onClick={handlePrint}
              className="text-xs font-bold shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              <span>Cetak / Simpan PDF</span>
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div ref={printRef} className="p-8 sm:p-10 font-sans text-slate-900 bg-white">
          {/* Invoice Top Brand & Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-950 font-display">
                  MAKARYA<span className="text-brand-indigo">.</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                  OFFICIAL RECEIPT
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                Platform Kolaborasi Proyek Digital UMKM dan Mahasiswa Indonesia
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Nomor Faktur
              </span>
              <span className="text-base font-mono font-bold text-slate-900 block">
                {invoiceNo}
              </span>
              <span className="text-xs text-slate-500 block">
                Tanggal: {transactionDate}
              </span>
            </div>
          </div>

          {/* Status Banner */}
          <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isCompleted
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                    : "bg-blue-100 text-blue-700 border border-blue-300"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-blue-700" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {isCompleted
                    ? "Transaksi Selesai (Dana Telah Dicairkan)"
                    : "Dana Tersimpan Aman di Rekening Bersama (Escrow)"}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {isCompleted
                    ? "Deliverable hasil pekerjaan telah disetujui klien."
                    : "Dana dikunci oleh sistem Makarya hingga pekerjaan disetujui."}
                </span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <span
                className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                  isCompleted
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : "bg-blue-50 text-blue-800 border-blue-300"
                }`}
              >
                {isCompleted ? "SELESAI" : "ESCROW ACTIVE"}
              </span>
            </div>
          </div>

          {/* Two Parties Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-200 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <Building2 className="w-3.5 h-3.5" />
                <span>Pihak Pertama (Klien UMKM)</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">
                {umkmName || project.umkm_profile?.nama_usaha || "Klien UMKM Terdaftar"}
              </p>
              <p className="text-slate-500">
                Bidang: {project.umkm_profile?.bidang_industri || "Usaha Mandiri / UMKM"}
              </p>
              <p className="text-slate-500">
                Lokasi: {project.umkm_profile?.kota || "Indonesia"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Pihak Kedua (Mahasiswa Pelaksana)</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">
                {mhsName || project.accepted_mhs_nama || "Mahasiswa Terverifikasi"}
              </p>
              <p className="text-slate-500">Peran: Pelaksana Tugas Proyek</p>
              <p className="text-slate-500">Status: Identitas Kampus Terverifikasi</p>
            </div>
          </div>

          {/* Project Details Table */}
          <div className="py-6 border-b border-slate-200">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="pb-2.5 font-bold">Rincian Deskripsi Proyek</th>
                  <th className="pb-2.5 font-bold text-center">Kategori</th>
                  <th className="pb-2.5 font-bold text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3">
                    <span className="font-bold text-slate-900 block text-xs">
                      {project.judul}
                    </span>
                    <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {project.deskripsi_raw}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-[11px] text-slate-700">
                      {project.kategori}
                    </span>
                  </td>
                  <td className="py-3 text-right font-bold text-slate-900">
                    {formatCurrency(contractAmount)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500">
                    Biaya Proteksi Escrow & Fasilitasi Platform
                  </td>
                  <td className="py-2 text-center text-slate-400">Gratis</td>
                  <td className="py-2 text-right font-medium text-slate-500">Rp 0</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Calculation Row */}
          <div className="pt-4 flex justify-end">
            <div className="w-full sm:w-64 space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal Kontrak:</span>
                <span className="font-semibold">{formatCurrency(contractAmount)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Biaya Layanan:</span>
                <span className="font-semibold">Rp 0</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Escrow:</span>
                <span className="text-base text-brand-indigo font-display font-extrabold">
                  {formatCurrency(contractAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Legal Escrow Footer Note */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">
              Jaminan Keabsahan & Rekening Bersama:
            </p>
            <p className="leading-relaxed">
              Faktur ini merupakan bukti sah transaksi penjaminan dana melalui sistem Rekening
              Bersama (Escrow) Makarya. Hak cipta deliverable sepenuhnya berpindah ke Klien UMKM
              setelah dana honor resmi dicairkan ke mahasiswa. Dokumen ini sah dan diakui untuk
              kebutuhan pembukuan operasional UMKM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
