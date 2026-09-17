import React, { useState, useRef } from "react";
import {
  ShieldCheck,
  Download,
  Copy,
  Printer,
  X,
  CheckCircle2,
  ExternalLink,
  Building2,
  Users,
  Coins,
} from "lucide-react";
import { Button } from "../ui/Button";
import { MakaryaCertificate } from "./MakaryaCertificate";
import { exportElementToPdf } from "../../utils/exportPdf";
import { formatCurrency } from "../../utils/formatCurrency";

export function CertificateViewModal({ certificate, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef(null);

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

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      const recipient = certificate.recipient_name || "Talenta";
      const sanitizedName = recipient.replace(/[^a-zA-Z0-9_-]/g, "_");
      await exportElementToPdf(
        certRef.current,
        `Sertifikat-Makarya-${sanitizedName}-${certificate.credential_id}.pdf`,
      );
    } catch (err) {
      console.error("Gagal mengunduh PDF:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-surface w-full max-w-5xl rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:max-w-none print:w-full">
        {/* Modal Top Actions (Hidden on Print) */}
        <div className="px-5 sm:px-6 py-4 border-b border-border flex items-center justify-between bg-slate-50/90 print:hidden">
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
              className="text-xs font-semibold h-8.5"
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
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs font-semibold h-8.5 hidden sm:inline-flex"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Cetak
            </Button>

            <Button
              variant="brand"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="text-xs font-bold h-8.5 shadow-xs bg-[#0F172A] text-white hover:bg-slate-800"
            >
              {downloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />
                  Menyiapkan PDF...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Unduh PDF
                </>
              )}
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

        {/* Certificate Display Body */}
        <div className="p-3 sm:p-6 md:p-8 bg-slate-100/60 overflow-x-auto print:p-0 print:bg-white">
          <div className="min-w-[700px] sm:min-w-0">
            <MakaryaCertificate certificate={certificate} innerRef={certRef} />
          </div>

          {/* Quick Context Summary Below Certificate */}
          <div className="mt-4 max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs print:hidden">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <span className="text-[10px] text-muted block">
                  Mitra UMKM:
                </span>
                <strong className="text-slate-900 font-bold">
                  {certificate.client_name || "-"}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-muted block">
                  Honor Peran Terverifikasi:
                </span>
                <strong className="text-emerald-700 font-extrabold">
                  {certificate.honor_amount || certificate.slot_budget
                    ? formatCurrency(
                        certificate.honor_amount || certificate.slot_budget,
                      )
                    : "Sesuai Kontrak"}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-[10px] text-muted block">
                  Model Formasi:
                </span>
                <strong className="text-slate-900 font-bold">
                  {certificate.collaboration_type === "TIM" ||
                  (certificate.team_breakdown &&
                    certificate.team_breakdown.length > 0)
                    ? `Tim (${certificate.team_breakdown?.length || 0} Peran)`
                    : "Individu"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (Hidden on Print) */}
        <div className="px-6 py-3.5 bg-slate-50/90 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-medium">Tautan Verifikasi Resmi:</span>
            <a
              href={verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0F172A] hover:underline font-mono inline-flex items-center gap-1 font-bold"
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
