import React from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

/**
 * Inline vector logo mark for Makarya so html2canvas renders it 100% reliably
 */
export function MakaryaLogoMark({ className = "w-7 h-7" }) {
  return (
    <svg viewBox="0 0 512 512" fill="none" className={className}>
      <defs>
        <linearGradient
          id="certIndigoGrad"
          x1="60"
          y1="100"
          x2="450"
          y2="420"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#4338CA" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>
        <linearGradient
          id="certCyanGrad"
          x1="120"
          y1="200"
          x2="390"
          y2="340"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#00F2FE" />
          <stop offset="60%" stopColor="#4FACFE" />
          <stop offset="100%" stopColor="#00C0FF" />
        </linearGradient>
        <filter
          id="certSubtleShadow"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="4"
            floodColor="#1E1B4B"
            floodOpacity="0.15"
          />
        </filter>
      </defs>

      {/* Outer M Arch */}
      <path
        d="M 88 380 L 88 160 C 88 118, 140 100, 172 135 L 256 226 L 340 135 C 372 100, 424 118, 424 160 L 424 380"
        stroke="url(#certIndigoGrad)"
        strokeWidth="48"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#certSubtleShadow)"
      />

      {/* Inner Infinity Loop */}
      <path
        d="M 256 280 C 200 210, 120 210, 120 280 C 120 350, 200 350, 256 280 C 312 210, 392 210, 392 280 C 392 350, 312 350, 256 280 Z"
        stroke="url(#certCyanGrad)"
        strokeWidth="42"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom Arch Support */}
      <path
        d="M 180 300 C 205 350, 307 350, 332 300"
        stroke="url(#certIndigoGrad)"
        strokeWidth="48"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
        aspectRatio: "1.414 / 1", // Standar A4 Landscape Proportions
        minHeight: "560px",
      }}
    >
      {/* Container Grid: Left Main Content (68%) & Right Geometric Panel (32%) */}
      <div className="w-full h-full flex flex-col sm:flex-row relative">
        {/* ================= LEFT MAIN CONTENT ================= */}
        <div className="flex-1 p-6 sm:p-9 lg:p-10 flex flex-col justify-between relative z-10">
          {/* Top Decorative Leaves / Accents */}
          <div className="absolute top-0 left-0 w-28 h-28 pointer-events-none opacity-80">
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

          {/* Top Brand Header & Badges */}
          <div className="space-y-2 pl-6 sm:pl-8">
            <div className="flex items-center justify-between pb-0.5">
              <div className="flex items-center gap-2">
                <MakaryaLogoMark className="w-7 h-7" />
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                  Makarya<span className="text-[#4F46E5]">.</span>
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#065F46] text-[10px] font-bold tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>ESCROW VERIFIED PLATFORM</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-wider uppercase font-sans">
              SERTIFIKAT
            </h1>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="inline-block bg-[#FEF3C7] text-[#92400E] font-bold text-[10px] sm:text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
                PENGHARGAAN PRESTASI PROYEK INDUSTRI
              </span>
            </div>

            <div className="pt-0.5">
              <span className="inline-block bg-[#F1F5F9] text-[#334155] font-bold text-[9.5px] sm:text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider">
                SERTIFIKAT INI DENGAN BANGGA DISERAHKAN KEPADA
              </span>
            </div>
          </div>

          {/* Center Recipient Name & Campus */}
          <div className="my-auto py-3 pl-6 sm:pl-8 space-y-1.5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight uppercase leading-tight font-sans">
              {recipientName}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              {campus} • {prodi}
            </p>

            {/* Statement Text */}
            <p className="text-[11px] sm:text-xs lg:text-[12px] text-slate-600 max-w-lg leading-relaxed pt-0.5 font-normal">
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
          <div className="grid grid-cols-3 items-end gap-2 pt-3 pb-1 pl-6 sm:pl-8 border-t border-slate-200/80">
            {/* Left Signature: Mitra Klien UMKM */}
            <div className="text-center space-y-1">
              <div className="h-12 sm:h-13 flex items-end justify-center">
                {certificate.client_signature_url ? (
                  <img
                    src={certificate.client_signature_url}
                    alt="Tanda Tangan Mitra"
                    className="max-h-12 sm:max-h-13 object-contain"
                  />
                ) : (
                  <svg
                    className="w-24 sm:w-28 h-9 text-slate-800"
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
              <div className="border-t border-slate-900/60 pt-1">
                <p className="text-[11px] sm:text-xs font-bold text-slate-900 truncate">
                  {clientName}
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">
                  Mitra Klien UMKM
                </p>
              </div>
            </div>

            {/* Center Medal Seal */}
            <div className="flex flex-col items-center justify-center my-auto">
              <div className="relative flex items-center justify-center">
                {/* Gold Rosette SVG */}
                <svg
                  className="w-13 sm:w-15 h-13 sm:h-15 text-[#F59E0B]"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  {/* Rosette petaling */}
                  <circle cx="50" cy="45" r="32" fill="#FBBF24" />
                  <circle cx="50" cy="45" r="26" fill="#D97706" />
                  <circle cx="50" cy="45" r="22" fill="#FEF3C7" />
                  {/* Ribbons */}
                  <path
                    d="M36 68 L28 92 L44 86 L50 92 L50 68 Z"
                    fill="#D97706"
                  />
                  <path
                    d="M64 68 L72 92 L56 86 L50 92 L50 68 Z"
                    fill="#B45309"
                  />
                </svg>
                <div className="absolute top-[16px] sm:top-[18px] text-center">
                  <ShieldCheck className="w-5 sm:w-5.5 h-5 sm:h-5.5 text-[#92400E] mx-auto" />
                </div>
              </div>
              <span className="text-[8px] sm:text-[9px] font-black text-[#92400E] uppercase tracking-widest mt-0.5">
                TERVERIFIKASI
              </span>
            </div>

            {/* Right Signature: User Official Signature */}
            <div className="text-center space-y-1">
              <div className="h-12 sm:h-13 flex items-end justify-center">
                <img
                  src="/signature.png"
                  alt="Tanda Tangan Resmi"
                  className="max-h-12 sm:max-h-13 object-contain"
                />
              </div>
              <div className="border-t border-slate-900/60 pt-1">
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
        <div className="w-full sm:w-[32%] bg-[#0F172A] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden text-white">
          {/* Decorative Polygon / Floral Facets */}
          <div className="absolute -top-10 -right-10 w-48 h-48 opacity-20 pointer-events-none">
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

          {/* Dot Matrix Pattern */}
          <div className="absolute top-8 right-6 opacity-30 flex gap-2">
            <div className="grid grid-cols-4 gap-1.5">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-white" />
              ))}
            </div>
          </div>

          {/* Top Brand Emblem with Inline Vector Logo */}
          <div className="relative z-10 space-y-2 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-2.5">
              <MakaryaLogoMark className="w-full h-full" />
            </div>
            <h3 className="text-xl font-black tracking-wider text-white uppercase font-sans">
              MAKARYA
            </h3>
            <p className="text-[10px] text-slate-300 font-medium tracking-wide leading-relaxed">
              Platform Kolaborasi Industri & Mahasiswa Bergaransi Escrow
            </p>
          </div>

          {/* Center Graphic Icon Motif with Inline Vector */}
          <div className="relative z-10 my-auto py-4 flex flex-col items-center justify-center opacity-90">
            <div className="w-20 h-20 rounded-full border border-emerald-500/30 flex items-center justify-center bg-white/5 backdrop-blur-sm p-4">
              <MakaryaLogoMark className="w-12 h-12 opacity-95" />
            </div>
          </div>

          {/* Bottom Credential Barcode / Verification Badge */}
          <div className="relative z-10 pt-3 pb-1 border-t border-white/10 space-y-1">
            <div className="flex items-center justify-between text-[9px] font-mono text-emerald-400">
              <span>ID KREDENSIAL</span>
              <span className="flex items-center gap-1 font-bold text-white">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                TERCATAT
              </span>
            </div>
            <p className="font-mono text-xs font-bold text-white tracking-wider truncate">
              {credentialId}
            </p>
            <p className="text-[8.5px] text-slate-400 leading-tight">
              Validasi: makarya.id/certificates/verify/{credentialId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
