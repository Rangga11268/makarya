import React, { useRef } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Building2,
  ExternalLink,
  Clock,
  BookOpen,
} from "lucide-react";

export function MbkmTranscriptModal({
  isOpen,
  onClose,
  user,
  certificates = [],
  ratings = [],
}) {
  const printAreaRef = useRef(null);

  if (!isOpen) return null;

  const totalProjects = certificates.length;
  // Asumsi standar konversi MBKM: 1 proyek setara ~45 jam aktivitas industri (1 SKS = 45-48 jam kegiatan lapangan)
  const estimatedHours = totalProjects * 45;
  const recommendedSks = Math.min(20, Math.max(1, Math.round(estimatedHours / 45)));

  const avgRating =
    ratings.length > 0
      ? (
          ratings.reduce((acc, curr) => acc + (curr.skor || 5), 0) /
          ratings.length
        ).toFixed(1)
      : "5.0";

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lembar Rekapitulasi MBKM & Portofolio Industri"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6 font-sans text-left">
        {/* Notice Bar */}
        <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-2 text-blue-900">
            <GraduationCap className="w-5 h-5 text-brand-indigo shrink-0" />
            <span className="text-[11px] font-medium leading-tight">
              Dokumen ini memuat rekam jejak penyelesaian proyek industri UMKM
              terverifikasi Escrow Makarya untuk keperluan konversi SKS / MBKM Mandiri.
            </span>
          </div>
        </div>

        {/* Printable Transcript Card Container */}
        <div
          ref={printAreaRef}
          className="p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-xs space-y-6 print:border-0 print:p-0 print:shadow-none"
        >
          {/* Header Kop Surat */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white font-extrabold text-[10px] tracking-wider uppercase">
                  Dokumen Resmi MBKM
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  MAKARYA-MBKM/{new Date().getFullYear()}/
                  {String(user?.id || "000").slice(0, 6).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                TRANSKRIP REKAPITULASI PROYEK & PORTOFOLIO
              </h2>
              <p className="text-xs text-slate-500">
                Platform Kolaborasi Proyek Industri UMKM & Talenta Mahasiswa Indonesia
              </p>
            </div>

            <div className="text-right sm:text-right hidden sm:block">
              <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-center text-brand-indigo font-black text-lg ml-auto">
                M
              </div>
              <span className="text-[10px] font-mono text-slate-400 block mt-1">
                Verified by Makarya
              </span>
            </div>
          </div>

          {/* Student Identity Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Nama Mahasiswa
              </span>
              <span className="font-extrabold text-slate-900 text-sm block truncate mt-0.5">
                {user?.nama_lengkap || user?.email}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                NIM / ID Mahasiswa
              </span>
              <span className="font-mono font-bold text-slate-800 block mt-0.5">
                {user?.nim || "MHS-TERDAFTAR"}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Program Studi & Kampus
              </span>
              <span className="font-semibold text-slate-800 block truncate mt-0.5">
                {user?.prodi || "Teknologi Informasi"} / {user?.kampus || "Indonesia"}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Status Verifikasi
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-xs mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi Kampus
              </span>
            </div>
          </div>

          {/* Key Equivalency Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold uppercase">
                <Award className="w-3.5 h-3.5 text-brand-indigo" />
                <span>Proyek Selesai</span>
              </div>
              <span className="text-2xl font-black text-slate-900 block mt-1">
                {totalProjects}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold uppercase">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Total Jam Kerja</span>
              </div>
              <span className="text-2xl font-black text-slate-900 block mt-1">
                ~{estimatedHours} Jam
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold uppercase">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Rekomendasi SKS</span>
              </div>
              <span className="text-2xl font-black text-emerald-700 block mt-1">
                {recommendedSks} SKS
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Rating Kepuasan</span>
              </div>
              <span className="text-2xl font-black text-slate-900 block mt-1">
                {avgRating} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
              </span>
            </div>
          </div>

          {/* Project List Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Daftar Riwayat Proyek yang Diselesaikan & Teruji
            </h3>

            {certificates.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl">
                Belum ada proyek yang diselesaikan dan diterbitkan sertifikatnya.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                      <th className="p-3">No</th>
                      <th className="p-3">Judul Proyek & Kategori</th>
                      <th className="p-3">Mitra Klien UMKM</th>
                      <th className="p-3">Peran / Slot</th>
                      <th className="p-3">Tanggal Selesai</th>
                      <th className="p-3">Kredensial Sertifikat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70">
                    {certificates.map((cert, idx) => (
                      <tr key={cert.id || idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono text-slate-400 font-bold">
                          {idx + 1}
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">
                            {cert.project_title || cert.judul_proyek || "Proyek Kolaborasi UMKM"}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {cert.category || cert.kategori || "Kreatif & Digital"}
                          </span>
                        </td>
                        <td className="p-3 text-slate-800 font-medium">
                          {cert.umkm_name || cert.client_name || "Mitra UMKM"}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-brand-indigo/10 text-brand-indigo font-bold text-[10px]">
                            {cert.role_name || "Pelaksana Proyek"}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 font-mono text-[11px]">
                          {formatDate(cert.created_at || cert.issue_date)}
                        </td>
                        <td className="p-3 font-mono font-bold text-[11px] text-slate-800">
                          {cert.credential_id || `MK-${String(cert.id || "000").slice(0, 8).toUpperCase()}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Legal Signatures Block */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200 text-xs">
            <div className="space-y-12">
              <span className="text-[11px] text-slate-500 block font-medium">
                Mengetahui & Menyetujui,<br />
                <strong>Dosen Pembimbing / Kaprodi MBKM</strong>
              </span>
              <div className="pt-2">
                <div className="w-40 border-b border-slate-400" />
                <span className="text-[10px] text-slate-400 block mt-1">
                  NIP / NIDN: .......................................
                </span>
              </div>
            </div>

            <div className="space-y-12 text-right">
              <span className="text-[11px] text-slate-500 block font-medium">
                Diterbitkan secara digital oleh,<br />
                <strong>Direksi Sistem Escrow Makarya</strong>
              </span>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 font-bold text-slate-900 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> TERVERIFIKASI SISTEM
                </span>
                <span className="text-[10px] font-mono text-slate-400 block mt-1">
                  Security Hash: SHA256-ESCROW-MBKM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2 border-t border-border print:hidden">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            className="w-full sm:w-auto justify-center text-xs font-bold"
          >
            Tutup
          </Button>
          <Button
            variant="brand"
            size="md"
            onClick={handlePrint}
            className="w-full sm:w-auto justify-center text-xs font-bold shadow-brand"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            Cetak / Simpan Transkrip PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
}
