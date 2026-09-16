import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { certificateApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  ShieldCheck,
  Award,
  GraduationCap,
  Building2,
  Calendar,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Printer,
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
            "Sertifikat dengan ID kredensial ini tidak ditemukan atau belum terdaftar resmi."
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 font-sans print:p-0">
      {/* Navigation Top (Hidden on Print) */}
      <div className="flex items-center justify-between print:hidden">
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
            variant="brand"
            size="sm"
            onClick={handlePrint}
            className="text-xs font-semibold shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Cetak / Unduh PDF
          </Button>
        </div>
      </div>

      {loading ? (
        <Card className="p-12 text-center space-y-4 bg-surface border-border">
          <div className="w-12 h-12 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin mx-auto" />
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
              <Button variant="secondary" size="sm" className="text-xs font-bold">
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
                  Kredensial ini valid dan diterbitkan oleh platform Makarya untuk portofolio industri & konversi SKS MBKM.
                </p>
              </div>
            </div>
            <Badge variant="success" className="font-bold text-xs shrink-0">
              Valid & Asli
            </Badge>
          </div>

          {/* Certificate Render */}
          <div className="relative border-4 border-double border-brand-indigo/30 rounded-3xl p-6 sm:p-12 bg-surface text-center shadow-lg overflow-hidden print:shadow-none print:border-none print:p-8">
            {/* Seal Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <Award className="w-96 h-96 text-brand-indigo" />
            </div>

            {/* Header */}
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-indigo/10 text-brand-indigo mb-2">
                <Award className="w-7 h-7" />
              </div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-brand-indigo font-sans">
                PLATFORM MAKARYA INDONESIA
              </p>
              <h1 className="text-2xl sm:text-4xl font-black text-dark-900 tracking-tight font-serif uppercase">
                Sertifikat Penyelesaian Proyek
              </h1>
              <p className="text-xs sm:text-sm text-muted font-sans tracking-wide">
                Certificate of Project Completion & Industry Collaboration
              </p>
            </div>

            <div className="relative z-10 w-24 h-0.5 bg-brand-indigo mx-auto my-6 rounded-full opacity-60" />

            {/* Recipient Details */}
            <div className="relative z-10 space-y-4">
              <p className="text-xs sm:text-sm text-muted font-sans">
                Dengan bangga menyatakan bahwa mahasiswa:
              </p>

              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-dark-900 font-sans tracking-tight">
                  {cert.recipient_name}
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4 text-brand-indigo" />
                    {cert.recipient_kampus}
                  </span>
                  <span>,</span>
                  <span>{cert.recipient_prodi}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed pt-2">
                Telah menuntaskan seluruh penugasan kerja secara profesional dan memenuhi standar kepuasan mitra industri dengan peran:
              </p>

              {/* Role & Project Summary */}
              <div className="bg-slate-50 border border-border/80 rounded-2xl p-5 max-w-lg mx-auto text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted">Peran Penugasan</span>
                  <Badge variant="brand" className="font-bold text-xs">
                    {cert.role_name}
                  </Badge>
                </div>
                <div className="border-t border-slate-200/80 pt-2 space-y-1">
                  <span className="text-[11px] font-semibold text-muted block">Nama Proyek Kemitraan</span>
                  <h4 className="text-sm sm:text-base font-bold text-dark-900">
                    {cert.project_title}
                  </h4>
                </div>
                
                {/* Honor & Collaboration Type */}
                <div className="border-t border-slate-200/80 pt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-muted block">Honor Peran Terverifikasi</span>
                    <span className="font-extrabold text-emerald-700 text-sm flex items-center gap-1 mt-0.5">
                      <Coins className="w-3.5 h-3.5 text-emerald-600" />
                      {cert.honor_amount || cert.slot_budget
                        ? formatCurrency(cert.honor_amount || cert.slot_budget)
                        : "Sesuai Kontrak"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-muted block">Model Penugasan</span>
                    <span className="font-bold text-slate-800 text-xs inline-flex items-center justify-end gap-1 mt-1">
                      <Users className="w-3.5 h-3.5 text-brand-indigo" />
                      {cert.collaboration_type === "TIM" || (cert.team_breakdown && cert.team_breakdown.length > 0)
                        ? `Tim (${cert.team_breakdown?.length || 0} Peran)`
                        : "Individu"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200/80 pt-2 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-muted" />
                    Klien Mitra UMKM: <strong className="text-dark-900">{cert.client_name}</strong>
                  </span>
                  {cert.project_category && (
                    <Badge variant="outline" className="text-[10px]">
                      {cert.project_category}
                    </Badge>
                  )}
                </div>

                {/* Team Breakdown Accordion/Card if Team Collaboration */}
                {cert.team_breakdown && cert.team_breakdown.length > 0 && (
                  <div className="border-t border-slate-200/80 pt-2 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span className="flex items-center gap-1 text-brand-indigo">
                        <Users className="w-3.5 h-3.5" />
                        Alokasi Pagu Tim Awal Klien:
                      </span>
                      {cert.total_project_budget && (
                        <span className="text-slate-900 font-extrabold">
                          Total {formatCurrency(cert.total_project_budget)}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5 bg-white rounded-xl p-2.5 border border-slate-200/80 text-xs">
                      {cert.team_breakdown.map((member, mIdx) => {
                        const isCurrentRecipientRole = member.nama_peran?.toLowerCase() === cert.role_name?.toLowerCase();
                        return (
                          <div
                            key={mIdx}
                            className={`flex items-center justify-between py-1 px-1.5 rounded-lg ${
                              isCurrentRecipientRole ? "bg-brand-indigo/10 font-bold text-brand-indigo" : "text-slate-600"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo shrink-0" />
                              <span className="truncate">
                                {member.nama_peran}
                                {member.mhs_nama && (
                                  <span className="text-[10px] text-muted font-normal ml-1">
                                    ({member.mhs_nama})
                                  </span>
                                )}
                              </span>
                            </div>
                            <span className="font-mono text-xs shrink-0 font-bold">
                              {formatCurrency(member.alokasi_budget)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {cert.deliverable_url && (
                <div className="pt-2 print:hidden">
                  <a
                    href={cert.deliverable_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-indigo hover:underline"
                  >
                    Lihat Hasil Karya Terkait Proyek <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Credential ID and Official Timestamp */}
            <div className="relative z-10 mt-10 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center text-left text-xs">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-muted block uppercase tracking-wider">
                  ID Kredensial Resmi
                </span>
                <span className="font-mono font-bold text-sm text-dark-900 tracking-wider">
                  {cert.credential_id}
                </span>
                <p className="text-[10px] text-muted">
                  Tercatat secara terverifikasi di sistem Makarya.
                </p>
              </div>

              <div className="sm:text-right space-y-1">
                <span className="text-[11px] font-semibold text-muted block">
                  Tanggal Penerbitan Resmi
                </span>
                <span className="font-sans font-bold text-xs text-dark-900 flex items-center sm:justify-end gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-indigo" />
                  {formatDate(cert.issued_at)}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Status: Terverifikasi
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
