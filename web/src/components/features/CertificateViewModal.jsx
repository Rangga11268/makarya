import React, { useState } from "react";
import {
  Award,
  CheckCircle2,
  Copy,
  Printer,
  X,
  ExternalLink,
  ShieldCheck,
  Building2,
  GraduationCap,
  Calendar,
  Users,
  Coins,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

export function CertificateViewModal({ certificate, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !certificate) return null;

  const verificationUrl = `${window.location.origin}/certificates/verify/${certificate.credential_id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Gagal menyalin tautan:", err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-surface w-full max-w-3xl rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:max-w-none print:w-full">
        {/* Modal Top Actions (Hidden on Print) */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-slate-50/75 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-dark-900 font-sans">
              Sertifikat Digital Terverifikasi Makarya
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="text-xs font-semibold h-8"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Salin Tautan
                </>
              )}
            </Button>
            <Button
              variant="brand"
              size="sm"
              onClick={handlePrint}
              className="text-xs font-semibold h-8 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Cetak / PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 text-muted hover:text-dark-900 rounded-lg hover:bg-slate-200/60 transition-colors ml-1"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Clean, Academic & Professional Layout) */}
        <div className="p-6 sm:p-10 bg-gradient-to-b from-slate-50/50 via-surface to-slate-50/30 print:p-8">
          <div className="relative border-4 border-double border-brand-indigo/30 rounded-2xl p-6 sm:p-10 bg-surface text-center shadow-xs overflow-hidden">
            {/* Background Seal Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <Award className="w-96 h-96 text-brand-indigo" />
            </div>

            {/* Header / Logo */}
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-indigo/10 text-brand-indigo mb-2">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-brand-indigo font-sans">
                PLATFORM MAKARYA INDONESIA
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-dark-900 tracking-tight font-serif uppercase">
                Sertifikat Penyelesaian Proyek
              </h2>
              <p className="text-xs text-muted font-sans tracking-wide">
                Certificate of Project Completion & Industry Collaboration
              </p>
            </div>

            {/* Decorative Divider */}
            <div className="relative z-10 w-24 h-0.5 bg-brand-indigo mx-auto my-6 rounded-full opacity-60" />

            {/* Recipient Statement */}
            <div className="relative z-10 space-y-4">
              <p className="text-xs sm:text-sm text-muted font-sans">
                Dengan bangga menyatakan bahwa talenta mahasiswa:
              </p>

              <div className="space-y-1">
                <h3 className="text-2xl sm:text-3xl font-black text-dark-900 font-sans tracking-tight">
                  {certificate.recipient_name}
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4 text-brand-indigo" />
                    {certificate.recipient_kampus}
                  </span>
                  <span>,</span>
                  <span>{certificate.recipient_prodi}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed pt-2">
                Telah menyelesaikan seluruh penugasan kerja secara tuntas,
                profesional, dan memenuhi standar kepuasan mitra industri dengan
                peran:
              </p>

              {/* Role & Project Card */}
              <div className="bg-slate-50 border border-border/80 rounded-2xl p-4 sm:p-5 max-w-lg mx-auto text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted">
                    Peran Penugasan
                  </span>
                  <Badge variant="brand" className="font-bold text-xs">
                    {certificate.role_name}
                  </Badge>
                </div>
                <div className="border-t border-slate-200/80 pt-2 space-y-1">
                  <span className="text-[11px] font-semibold text-muted block">
                    Nama Proyek Kemitraan
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-dark-900">
                    {certificate.project_title}
                  </h4>
                </div>

                {/* Honor & Collaboration Type */}
                <div className="border-t border-slate-200/80 pt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-muted block">
                      Honor Peran Terverifikasi
                    </span>
                    <span className="font-extrabold text-emerald-700 text-sm flex items-center gap-1 mt-0.5">
                      <Coins className="w-3.5 h-3.5 text-emerald-600" />
                      {certificate.honor_amount || certificate.slot_budget
                        ? formatCurrency(
                            certificate.honor_amount || certificate.slot_budget,
                          )
                        : "Sesuai Kontrak"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-muted block">
                      Model Penugasan
                    </span>
                    <span className="font-bold text-slate-800 text-xs inline-flex items-center justify-end gap-1 mt-1">
                      <Users className="w-3.5 h-3.5 text-brand-indigo" />
                      {certificate.collaboration_type === "TIM" ||
                      (certificate.team_breakdown &&
                        certificate.team_breakdown.length > 0)
                        ? `Tim (${certificate.team_breakdown?.length || 0} Peran)`
                        : "Individu"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200/80 pt-2 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-muted" />
                    Klien Mitra UMKM:{" "}
                    <strong className="text-dark-900">
                      {certificate.client_name}
                    </strong>
                  </span>
                  {certificate.project_category && (
                    <Badge variant="outline" className="text-[10px]">
                      {certificate.project_category}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Footer / Credential ID & Sign-off */}
            <div className="relative z-10 mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center text-left text-xs">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-muted block uppercase tracking-wider">
                  ID Kredensial Resmi
                </span>
                <span className="font-mono font-bold text-sm text-dark-900 tracking-wider">
                  {certificate.credential_id}
                </span>
                <p className="text-[10px] text-muted">
                  Dapat divalidasi keasliannya oleh Dosen Pembimbing / Klien.
                </p>
              </div>

              <div className="sm:text-right space-y-1">
                <span className="text-[11px] font-semibold text-muted block">
                  Tanggal Penerbitan Resmi
                </span>
                <span className="font-sans font-bold text-xs text-dark-900 flex items-center sm:justify-end gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-indigo" />
                  {formatDate(certificate.issued_at)}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Tercatat di Buku Besar Makarya
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (Hidden on Print) */}
        <div className="px-6 py-4 bg-slate-50/75 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-medium">Tautan Verifikasi:</span>
            <a
              href={verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-indigo hover:underline font-mono inline-flex items-center gap-1 font-semibold"
            >
              {certificate.credential_id}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto text-xs font-semibold"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
