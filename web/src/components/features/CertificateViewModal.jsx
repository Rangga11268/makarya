import React, { useState, useRef } from "react";
import {
  ShieldCheck,
  Download,
  Copy,
  Printer,
  X,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "../ui/Button";
import { MakaryaCertificate } from "./MakaryaCertificate";
import { exportElementToPdf } from "../../utils/exportPdf";

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-3 sm:p-5 print:p-0 print:bg-white print:static">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto print:shadow-none print:border-none print:max-w-none print:w-full">
        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-sans">
              Sertifikat Digital Resmi
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
                  Salin Link
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs font-semibold h-8 hidden sm:inline-flex"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Cetak
            </Button>

            <Button
              variant="brand"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="text-xs font-bold h-8 shadow-xs bg-[#0F172A] text-white hover:bg-slate-800"
            >
              {downloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />
                  Menyiapkan...
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
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors ml-1 cursor-pointer"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="p-3 sm:p-5 bg-slate-100/60 overflow-y-auto flex-1 print:p-0 print:bg-white flex items-center justify-center">
          <div className="w-full">
            <MakaryaCertificate certificate={certificate} innerRef={certRef} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 bg-white border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0 print:hidden">
          <div className="flex items-center gap-1.5 truncate">
            <span>ID Kredensial:</span>
            <a
              href={verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-900 font-mono font-bold hover:underline inline-flex items-center gap-1"
            >
              {certificate.credential_id}
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="text-xs h-7 px-3"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
