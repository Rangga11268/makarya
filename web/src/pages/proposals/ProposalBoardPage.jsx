import React, { useState, useEffect } from "react";
import { proposalApi, submissionApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { SubmissionModal } from "../../components/features/SubmissionModal";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  UploadCloud, 
  FileText,
  AlertCircle 
} from "lucide-react";

export function ProposalBoardPage() {
  const [proposals, setMyProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const res = await proposalApi.getMyProposals();
      setMyProposals(res.data);
    } catch (err) {
      console.error("Gagal memuat proposal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const filteredProposals = proposals.filter((p) => {
    if (activeTab === "ALL") return true;
    return p.status === activeTab;
  });

  const handleOpenSubmission = (projectId) => {
    setSelectedProjectId(projectId);
    setSubmissionModalOpen(true);
  };

  const statusBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
        return <Badge variant="success">Disetujui • Proyek Berjalan</Badge>;
      case "PENDING":
        return <Badge variant="warning">Menunggu Keputusan</Badge>;
      case "REJECTED":
        return <Badge variant="danger">Ditolak</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-900 tracking-tight">
          Proposal & Pengerjaan Proyek
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Pantau status lamaran kerja dan serahkan hasil deliverable untuk pencairan dana escrow
        </p>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        {[
          { key: "ALL", label: `Semua (${proposals.length})` },
          { key: "ACCEPTED", label: `Aktif / Berjalan (${proposals.filter(p => p.status === "ACCEPTED").length})` },
          { key: "PENDING", label: `Menunggu (${proposals.filter(p => p.status === "PENDING").length})` },
          { key: "REJECTED", label: `Ditolak (${proposals.filter(p => p.status === "REJECTED").length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === tab.key
                ? "bg-dark-900 text-white"
                : "text-muted hover:text-dark-900 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-surface rounded-card border border-border animate-pulse" />
          ))}
        </div>
      ) : filteredProposals.length === 0 ? (
        <Card className="text-center py-16">
          <Briefcase className="w-12 h-12 text-muted mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-dark-900">Belum ada proposal pada tab ini</h3>
          <p className="text-xs text-muted max-w-sm mx-auto mt-1">
            Silakan jelajah proyek terbuka dan kirimkan proposal penawaran Anda.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredProposals.map((proposal) => (
            <Card key={proposal.id} className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {statusBadge(proposal.status)}
                    <span className="text-xs text-muted">
                      Dikirim: {formatDate(proposal.created_at)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-dark-900">
                    Penawaran Proyek #{proposal.project_id.slice(0, 8)}
                  </h3>
                </div>

                <div className="flex sm:flex-col items-baseline sm:items-end justify-between gap-1 text-right">
                  <span className="text-xs text-muted uppercase tracking-wider font-semibold">
                    Harga Tawar
                  </span>
                  <span className="text-lg font-black text-dark-900">
                    {formatCurrency(proposal.harga_tawar)}
                  </span>
                </div>
              </div>

              {/* Cover Letter Snippet */}
              <div className="bg-gray-50 border border-border p-3.5 rounded-xl text-xs text-dark-900/90 leading-relaxed font-normal">
                <span className="font-bold text-dark-900 block mb-1">Pesan & Rencana Kerja:</span>
                "{proposal.cover_letter}"
              </div>

              {/* Action Buttons for Accepted Proposals */}
              {proposal.status === "ACCEPTED" && (
                <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dana escrow sebesar <b>{formatCurrency(proposal.harga_tawar)}</b> sudah dikunci klien.</span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenSubmission(proposal.project_id)}
                    className="w-full sm:w-auto text-xs font-bold"
                  >
                    <UploadCloud className="w-3.5 h-3.5 mr-1" />
                    Serahkan Hasil Kerja
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal Upload Deliverable */}
      {selectedProjectId && (
        <SubmissionModal
          isOpen={submissionModalOpen}
          onClose={() => setSubmissionModalOpen(false)}
          projectId={selectedProjectId}
          onSuccess={fetchProposals}
        />
      )}
    </div>
  );
}
