import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { certificateApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { MakaryaCertificate } from "../../components/features/MakaryaCertificate";
import { exportElementToPdf } from "../../utils/exportPdf";
import {
  ShieldCheck,
  Building2,
  Calendar,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Printer,
  Download,
  ArrowLeft,
  Copy,
  Users,
  Coins,
} from "lucide-react";

export function VerifyCertificatePage() {
  const { credentialId } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef(null);

  useEffect(() => {
    async function fetchVerification() {
      if (!credentialId) return;
      try {
        setLoading(true);
        setError(null);
        const res = await certificateApi.verify(credentialId);
        setCert(res.data);
      } catch (err) {
        console.error("Gagal memverifikasi sertifikat:", err);
        setError(
          err.response?.data?.detail ||
            "Sertifikat dengan ID kredensial ini tidak ditemukan atau belum terdaftar resmi.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchVerification();
  }, [credentialId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin tautan:", err);
    }
  };

  const handleDownloadPdf = async () => {
    if (!cert) return;
    try {
      setDownloading(true);
      const recipient = cert.recipient_name || "Talenta";
      const sanitizedName = recipient.replace(/[^a-zA-Z0-9_-]/g, "_");
      await exportElementToPdf(
        certRef.current,
        `Sertifikat-Makarya-${sanitizedName}-${cert.credential_id}.pdf`,
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 font-sans print:p-0">
      {/* Navigation Top (Hidden on Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-dark-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda Makarya
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="text-xs font-semibold"
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
            className="text-xs font-semibold hidden sm:inline-flex"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Cetak
          </Button>

          <Button
            variant="brand"
            size="sm"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="text-xs font-bold shadow-xs bg-[#0F172A] text-white hover:bg-slate-800"
          >
            {downloading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />
                Menyiapkan PDF...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Unduh PDF Resmi
              </>
            )}
          </Button>
        </div>
      </div>

      {loading ? (
        <Card className="p-12 text-center space-y-4 bg-surface border-border">
          <div className="w-12 h-12 border-4 border-[#0F172A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-muted">
            Memverifikasi keaslian kredensial di basis data Makarya...
          </p>
        </Card>
      ) : error ? (
        <Card className="p-8 sm:p-12 text-center space-y-4 bg-surface border-rose-200 shadow-xs">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-dark-900">
            Kredensial Tidak Ditemukan
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-md mx-auto">
            {error}
          </p>
          <p className="text-xs font-mono text-slate-500 bg-slate-100 py-1.5 px-3 rounded-lg inline-block">
            ID: {credentialId}
          </p>
          <div className="pt-2">
            <Link to="/talents">
              <Button
                variant="secondary"
                size="sm"
                className="text-xs font-bold"
              >
                Jelajahi Direktori Talenta
              </Button>
            </Link>
          </div>
        </Card>
      ) : cert ? (
        <div className="space-y-6">
          {/* Verification Status Banner (Hidden on Print) */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 text-emerald-900 print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold">
                  Sertifikat Resmi Terverifikasi
                </h3>
                <p className="text-xs text-emerald-700 font-medium">
                  Kredensial ini valid dan tercatat resmi di buku besar Makarya untuk portofolio industri & konversi SKS MBKM.
                </p>
              </div>
            </div>
            <Badge variant="success" className="font-bold text-xs shrink-0">
              Valid & Terverifikasi
            </Badge>
          </div>

          {/* Official Certificate Canvas */}
          <div className="overflow-x-auto pb-4 print:p-0">
            <div className="min-w-[720px] sm:min-w-0">
              <MakaryaCertificate certificate={cert} innerRef={certRef} />
            </div>
          </div>

          {/* Verification Summary & Deliverables Card (Hidden on Print) */}
          <Card className="p-6 bg-surface border-border space-y-4 print:hidden">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Detail Metadata Penugasan Proyek
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] text-muted block uppercase font-bold">Mitra UMKM Pemberi Tugas</span>
                <p className="font-bold text-slate-900 text-sm">{cert.client_name}</p>
                <p className="text-[11px] text-slate-500">{cert.project_category || "Proyek Kemitraan"}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] text-muted block uppercase font-bold">Honor Peran Terverifikasi</span>
                <p className="font-extrabold text-emerald-700 text-sm">
                  {cert.honor_amount || cert.slot_budget
                    ? formatCurrency(cert.honor_amount || cert.slot_budget)
                    : "Sesuai Kontrak"}
                </p>
                <p className="text-[11px] text-slate-500">
                  Model: {cert.collaboration_type === "TIM" ? "Formasi Tim" : "Individu"}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] text-muted block uppercase font-bold">Tanggal Penerbitan</span>
                <p className="font-bold text-slate-900 text-sm">{formatDate(cert.issued_at)}</p>
                <p className="text-[11px] text-emerald-600 font-medium">Garansi Escrow 100% Selesai</p>
              </div>
            </div>

            {cert.deliverable_url && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-muted">Hasil karya proyek:</span>
                <a
                  href={cert.deliverable_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F172A] hover:underline"
                >
                  Buka Deliverable Proyek (Figma / GitHub / Cloud)
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </Card>
        </div>
      ) : null}
    </div>
  );
}
