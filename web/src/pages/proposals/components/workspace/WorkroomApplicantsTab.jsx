import React from "react";
import { Briefcase, Users, Clock, ExternalLink, MessageSquare, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/Button";
import { Avatar } from "../../../../components/ui/Avatar";
import { formatCurrency } from "../../../../utils/formatCurrency";

export function WorkroomApplicantsTab({
  projectProposals = [],
  selectedProject,
  activeProjectId,
  parseCoverLetter,
  handleRejectProposal,
  handleAcceptProposal,
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-4 animate-in fade-in duration-200 font-sans">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-dark-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-brand-indigo" />
            <span>
              Pelamar Mahasiswa yang Masuk ({projectProposals.length})
            </span>
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Tinjau penawaran harga, estimasi waktu, dan portofolio kandidat mahasiswa
          </p>
        </div>
        <span className="text-xs text-muted">
          Escrow dikunci setelah memilih kandidat
        </span>
      </div>

      {projectProposals.length === 0 ? (
        <div className="p-8 text-center bg-canvas rounded-2xl border border-border space-y-2">
          <Users className="w-8 h-8 text-muted mx-auto opacity-40" />
          <p className="text-xs font-bold text-dark-900">
            Belum Ada Pelamar Masuk
          </p>
          <p className="text-[11px] text-muted max-w-xs mx-auto">
            Proyek Anda sedang tayang di katalog eksplorasi terbuka untuk mahasiswa.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projectProposals.map((prop) => {
            const isAccepted = prop.status === "ACCEPTED";
            const isRejected = prop.status === "REJECTED";
            const isWithdrawn = prop.status === "WITHDRAWN";

            return (
              <div
                key={prop.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isAccepted
                    ? "bg-emerald-50/20 border-emerald-200 shadow-xs"
                    : isRejected || isWithdrawn
                      ? "bg-canvas border-border opacity-80"
                      : "bg-canvas border-border hover:border-dark-900/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={prop.mhs_profile?.url_foto}
                        name={prop.mhs_profile?.nama_lengkap || "Mahasiswa"}
                        role="MHS"
                        size="xs"
                        className="border border-border shadow-xs"
                      />
                      <span className="text-xs font-bold text-dark-900">
                        {prop.mhs_profile?.nama_lengkap || "Mahasiswa Pelamar"}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10.5px] font-semibold px-2 py-0.5 rounded-md border ${
                          isAccepted
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : isRejected
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : isWithdrawn
                                ? "bg-slate-100 text-slate-700 border-slate-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isAccepted
                              ? "bg-emerald-500"
                              : isRejected
                                ? "bg-rose-500"
                                : isWithdrawn
                                  ? "bg-slate-400"
                                  : "bg-amber-500"
                          }`}
                        />
                        {isAccepted
                          ? "Disetujui"
                          : isRejected
                            ? "Ditolak"
                            : isWithdrawn
                              ? "Proposal Ditarik"
                              : "Menunggu Seleksi"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="text-[11px] text-muted font-medium">
                        {prop.mhs_profile?.asal_kampus ||
                          "Perguruan Tinggi Terakreditasi"}
                      </span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-[10.5px] font-medium text-slate-700">
                        <Clock className="w-2.5 h-2.5 text-slate-400" />
                        {prop.estimasi_hari} Hari Kerja
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-sm font-extrabold text-dark-900">
                      {formatCurrency(prop.harga_tawar)}
                    </span>
                  </div>
                </div>

                {(() => {
                  const parsed = parseCoverLetter(prop.cover_letter);
                  return (
                    <div className="bg-surface p-3.5 rounded-xl border border-border text-xs text-dark-900/90 leading-relaxed mb-3 space-y-2">
                      <div>
                        <span className="font-bold text-dark-900 block mb-0.5">
                          Rencana Pengerjaan Pelamar:
                        </span>
                        <p className="whitespace-pre-wrap">{parsed.text}</p>
                      </div>

                      {parsed.tools.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/60">
                          <span className="text-[10px] font-bold text-muted uppercase">
                            Keahlian:
                          </span>
                          {parsed.tools.map((tool) => (
                            <span
                              key={tool}
                              className="px-2 py-0.5 rounded-md bg-brand-indigo/10 text-brand-indigo font-bold text-[10px] border border-brand-indigo/20"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}

                      {parsed.portfolio && (
                        <div className="pt-1.5 border-t border-border/60">
                          <a
                            href={parsed.portfolio}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-brand-indigo hover:underline font-bold text-[11px]"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Lihat Portofolio Pelamar</span>
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/chat?talent=${prop.mhs_id}&project=${activeProjectId}`,
                      )
                    }
                    className="text-xs font-bold border-brand-indigo/30 text-brand-indigo hover:bg-brand-indigo/5 flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Kirim Pesan</span>
                  </Button>

                  {(selectedProject?.status === "OPEN" ||
                    selectedProject?.status === "BIDDING") &&
                    prop.status === "PENDING" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectProposal(prop)}
                          className="text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
                        >
                          Tolak
                        </Button>
                        <Button
                          variant="brand"
                          size="sm"
                          onClick={() => handleAcceptProposal(prop)}
                          className="text-xs font-bold shadow-brand"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                          Terima & Kunci Escrow
                        </Button>
                      </>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
