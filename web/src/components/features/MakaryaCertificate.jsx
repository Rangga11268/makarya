import React from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export function MakaryaCertificate({ certificate, className = "", innerRef }) {
  if (!certificate) return null;

  const recipientName =
    certificate.recipient_name ||
    certificate.user_name ||
    certificate.nama_lengkap ||
    "Penerima Sertifikat";

  const clientName = certificate.client_name || "Mitra Klien UMKM";
  const projectTitle =
    certificate.project_title || "Pengembangan Proyek Industri";
  const roleName = certificate.role_name || "Pelaksana Proyek";
  const campus =
    certificate.recipient_kampus ||
    certificate.universitas ||
    "Perguruan Tinggi Terdaftar";
  const prodi =
    certificate.recipient_prodi || certificate.prodi || "Talenta Industri";
  const credentialId = certificate.credential_id || "MKY-2026-OFFICIAL";

  return (
    <div
      ref={innerRef}
      id="makarya-official-certificate"
      className={`relative w-full max-w-4xl mx-auto bg-[#FFFFFF] text-[#0F172A] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 select-none font-sans ${className}`}
      style={{
        aspectRatio: "1.414 / 1",
        minHeight: "540px",
      }}
    >
      {/* Container Grid: Left Main Content (70%) & Right Geometric Panel (30%) */}
      <div className="w-full h-full flex flex-col sm:flex-row relative">
        {/* ================= LEFT MAIN CONTENT ================= */}
        <div className="flex-1 p-6 sm:p-8 lg:p-9 pb-8 sm:pb-9 lg:pb-10 flex flex-col justify-between relative z-10">
          {/* Top Decorative Vector Accents */}
          <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none opacity-80">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path
                d="M0 0C40 10 70 40 70 80C30 70 10 40 0 0Z"
                fill="#0F172A"
                opacity="0.85"
              />
              <path
                d="M0 40C25 50 45 70 50 100C25 95 10 75 0 40Z"
                fill="#10B981"
                opacity="0.75"
              />
              <circle cx="65" cy="25" r="4" fill="#F59E0B" />
            </svg>
          </div>

          {/* Top Brand Header */}
          <div className="space-y-2 pl-6 sm:pl-8">
            <div className="pb-1">
              <img
                src="/logo.webp"
                alt="Makarya"
                crossOrigin="anonymous"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-wider uppercase font-sans">
              SERTIFIKAT
            </h1>

            <p className="text-[11px] sm:text-xs font-bold text-amber-700 uppercase tracking-widest">
              Penghargaan Prestasi Proyek Industri
            </p>

            <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider pt-0.5">
              Sertifikat ini dengan bangga diserahkan kepada:
            </p>
          </div>

          {/* Center Recipient Name & Campus */}
          <div className="my-auto py-2.5 pl-6 sm:pl-8 space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase leading-tight font-sans">
              {recipientName}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              {campus} • {prodi}
            </p>

            {/* Statement Text */}
            <p className="text-[11px] sm:text-xs text-slate-600 max-w-xl leading-relaxed pt-1 font-normal">
              Sertifikat ini diberikan atas penyelesaian penugasan proyek
              industri bersama mitra{" "}
              <strong className="text-slate-900 font-bold">{clientName}</strong>{" "}
              pada proyek{" "}
              <strong className="text-slate-900 font-bold">
                "{projectTitle}"
              </strong>{" "}
              sebagai{" "}
              <strong className="text-[#4F46E5] font-bold">{roleName}</strong>,
              dan membuktikan bahwa yang bersangkutan memiliki kompetensi
              profesional serta dedikasi nyata yang telah terverifikasi resmi
              oleh Makarya Escrow Guarantee.
            </p>
          </div>

          {/* Bottom Signatures & Gold Seal Medal */}
          <div className="grid grid-cols-3 items-end gap-2 pt-3 pb-2 pl-6 sm:pl-8 border-t border-slate-200">
            {/* Left Signature: Mitra Klien UMKM */}
            <div className="text-center space-y-1">
              <div className="h-11 sm:h-12 flex items-end justify-center">
                {certificate.client_signature_url ? (
                  <img
                    src={certificate.client_signature_url}
                    alt="Tanda Tangan Mitra"
                    crossOrigin="anonymous"
                    className="max-h-11 sm:max-h-12 max-w-[120px] object-contain"
                  />
                ) : (
                  <svg
                    className="w-24 sm:w-28 h-8 text-slate-800"
                    viewBox="0 0 120 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M10 28 C25 15, 35 32, 50 18 C65 6, 75 35, 95 22 C105 15, 110 25, 115 20" />
                    <path
                      d="M30 32 L85 30"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  </svg>
                )}
              </div>
              <div className="border-t border-slate-900/50 pt-1">
                <p className="text-[11px] sm:text-xs font-bold text-slate-900 truncate">
                  {clientName}
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">
                  Mitra Klien UMKM
                </p>
              </div>
            </div>

            {/* Center Medal Seal */}
            <div className="flex flex-col items-center justify-center my-auto pb-0.5">
              <div className="relative flex items-center justify-center">
                {/* Gold Rosette SVG */}
                <svg
                  className="w-12 sm:w-14 h-12 sm:h-14 text-[#F59E0B]"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <circle cx="50" cy="45" r="32" fill="#FBBF24" />
                  <circle cx="50" cy="45" r="26" fill="#D97706" />
                  <circle cx="50" cy="45" r="22" fill="#FEF3C7" />
                  <path
                    d="M36 68 L28 92 L44 86 L50 92 L50 68 Z"
                    fill="#D97706"
                  />
                  <path
                    d="M64 68 L72 92 L56 86 L50 92 L50 68 Z"
                    fill="#B45309"
                  />
                </svg>
                <div className="absolute top-[14px] sm:top-[16px] text-center">
                  <ShieldCheck className="w-4.5 sm:w-5 h-4.5 sm:h-5 text-[#92400E] mx-auto" />
                </div>
              </div>
              <span className="text-[8px] sm:text-[9px] font-black text-[#92400E] uppercase tracking-widest mt-0.5">
                TERVERIFIKASI
              </span>
            </div>

            {/* Right Signature: User Official Signature */}
            <div className="text-center space-y-1">
              <div className="h-11 sm:h-12 flex items-end justify-center">
                <img
                  src="/signature.png"
                  alt="Tanda Tangan Resmi"
                  crossOrigin="anonymous"
                  className="max-h-11 sm:max-h-12 max-w-[120px] object-contain"
                />
              </div>
              <div className="border-t border-slate-900/50 pt-1">
                <p className="text-[11px] sm:text-xs font-bold text-slate-900">
                  Rangga / Direktur
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">
                  Platform Makarya Indonesia
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT GEOMETRIC SLICE ================= */}
        <div className="w-full sm:w-[30%] bg-[#0F172A] p-6 sm:p-7 pb-8 sm:pb-9 flex flex-col justify-between relative overflow-hidden text-white">
          {/* Decorative Polygon / Floral Facets */}
          <div className="absolute -top-10 -right-10 w-44 h-44 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path
                d="M50 0 C70 30 70 70 50 100 C30 70 30 30 50 0Z"
                fill="#10B981"
              />
              <path
                d="M0 50 C30 70 70 70 100 50 C70 30 30 30 0 50Z"
                fill="#6366F1"
              />
            </svg>
          </div>

          <div className="absolute top-1/2 -right-12 w-40 h-40 opacity-15 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <polygon points="50,0 100,50 50,100 0,50" fill="#10B981" />
            </svg>
          </div>

          {/* Top Brand Logo */}
          <div className="relative z-10 space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <img
                src="/logo-icon.svg"
                alt="Makarya"
                crossOrigin="anonymous"
                className="h-7 w-7 object-contain shrink-0"
              />
              <span className="text-xl font-black tracking-tight text-white font-sans">
                Makarya<span className="text-emerald-400">.</span>
              </span>
            </div>
            <p className="text-[9.5px] text-slate-300 font-medium tracking-wide leading-relaxed pt-1">
              Platform Kolaborasi Industri & Mahasiswa Bergaransi Escrow
            </p>
          </div>

          {/* Center Graphic Icon Motif */}
          <div className="relative z-10 my-auto py-3 flex flex-col items-center justify-center opacity-85">
            <div className="w-16 h-16 rounded-2xl border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm p-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          {/* Bottom Credential Barcode / Verification Badge */}
          <div className="relative z-10 pt-3 pb-2 border-t border-white/10 space-y-0.5">
            <div className="flex items-center justify-between text-[8.5px] font-mono text-emerald-400">
              <span>ID KREDENSIAL</span>
              <span className="flex items-center gap-1 font-bold text-white">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                TERCATAT
              </span>
            </div>
            <p className="font-mono text-[11px] font-bold text-white tracking-wider truncate">
              {credentialId}
            </p>
            <p className="text-[8px] text-slate-400 leading-tight">
              Validasi: makarya.id/certificates/verify/{credentialId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
