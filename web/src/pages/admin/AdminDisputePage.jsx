import React, { useState, useEffect } from "react";
import { disputeApi } from "../../api";
import { useToastStore } from "../../store/toastStore";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input, TextArea } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Pagination } from "../../components/ui/Pagination";
import { formatDate } from "../../utils/formatDate";
import { Scale, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { Scale, ShieldCheck, CheckCircle2, Clock, Search } from "lucide-react";

export function AdminDisputePage() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [resolveForm, setResolveForm] = useState({
    keputusan_admin: "",
    persentase_klien: "50",
    persentase_freelancer: "50",
  });
  const [resolveLoading, setResolveLoading] = useState(false);
  const [resolveError, setResolveError] = useState(null);
  const { addToast } = useToastStore();

  // Search, Filter & Pagination
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const res = await disputeApi.getAll();
      setDisputes(res.data);
    } catch (err) {
      console.error("Gagal memuat sengketa:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleOpenResolve = (dispute) => {
    setSelectedDispute(dispute);
    setResolveForm({
      keputusan_admin: "",
      persentase_klien: "50",
      persentase_freelancer: "50",
    });
    setResolveError(null);
    setModalOpen(true);
  };

  const handlePercentKlienChange = (val) => {
    const num = Math.min(100, Math.max(0, parseInt(val, 10) || 0));
    setResolveForm({
      ...resolveForm,
      persentase_klien: num.toString(),
      persentase_freelancer: (100 - num).toString(),
    });
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    setResolveError(null);

    const k = parseFloat(resolveForm.persentase_klien);
    const f = parseFloat(resolveForm.persentase_freelancer);

    if (k + f !== 100) {
      setResolveError("Total pembagian harus tepat 100%");
      return;
    }
    if (resolveForm.keputusan_admin.trim().length < 10) {
      setResolveError("Alasan & pertimbangan keputusan minimal 10 karakter");
      return;
    }

    try {
      setResolveLoading(true);
      await disputeApi.resolve(selectedDispute.id, {
        keputusan_admin: resolveForm.keputusan_admin.trim(),
        persentase_klien: k,
        persentase_freelancer: f,
        keputusan: "RESOLVED",
        catatan_admin: resolveForm.keputusan_admin.trim(),
        split_klien: k,
        split_freelancer: f,
      });

      addToast("Sengketa berhasil diputuskan & escrow split dieksekusi!", "success");
      addToast("Sengketa berhasil diputuskan dan dana escrow dialokasikan.", "success");
      setModalOpen(false);
      fetchDisputes();
    } catch (err) {
      const msg = err.response?.data?.detail || "Gagal menyelesaikan sengketa.";
      setResolveError(msg);
      setResolveError(err.response?.data?.detail || "Gagal memproses resolusi sengketa");
    } finally {
      setResolveLoading(false);
    }
  };

  const filteredDisputes = disputes.filter((d) => {
    const matchStatus = statusFilter === "ALL" || d.status === statusFilter;
    const searchLower = searchKeyword.trim().toLowerCase();
    const matchSearch =
      !searchLower ||
      (d.dekripsi_masalah || "").toLowerCase().includes(searchLower) ||
      (d.id || "").toLowerCase().includes(searchLower);
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filteredDisputes.length / itemsPerPage) || 1;
  const paginatedDisputes = filteredDisputes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-900 tracking-tight">
        <span className="text-xs font-bold uppercase tracking-wider text-muted font-sans">
          Pusat Keadilan Ekosistem
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-900 tracking-tight leading-tight mt-1 font-normal">
          Pusat Resolusi Sengketa (Admin Mediation)
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Mediasi sengketa antara UMKM dan Mahasiswa dengan pembagian dana escrow yang adil
        <p className="text-xs sm:text-sm text-muted font-sans mt-1">
          Mediasi sengketa antara UMKM dan Mahasiswa dengan pembagian dana escrow yang adil dan transparan.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3 rounded-2xl border border-border">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: "ALL", label: "Semua Status" },
            { id: "OPEN", label: "Kasus Terbuka" },
            { id: "RESOLVED", label: "Telah Diputuskan" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-dark-900 text-white shadow-xs"
                  : "text-muted hover:text-dark-900 hover:bg-canvas"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari ID / keluhan sengketa..."
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-canvas border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-brand-indigo font-sans"
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-32 bg-surface rounded-card border border-border animate-pulse" />
              <div key={n} className="h-32 bg-surface rounded-3xl border border-border animate-pulse" />
            ))}
          </div>
        ) : disputes.length === 0 ? (
          <Card className="text-center py-16">
        ) : filteredDisputes.length === 0 ? (
          <Card className="text-center py-16 rounded-3xl bg-surface border-border">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3 opacity-80" />
            <h3 className="text-base font-bold text-dark-900">Tidak ada sengketa aktif</h3>
            <h3 className="text-base font-bold text-dark-900">
              {searchKeyword || statusFilter !== "ALL"
                ? "Tidak ada kasus sengketa yang cocok dengan filter."
                : "Tidak ada sengketa aktif"}
            </h3>
            <p className="text-xs text-muted max-w-sm mx-auto mt-1">
              Seluruh proyek berjalan lancar tanpa kendala dead-lock.
            </p>
          </Card>
        ) : (
          disputes.map((d) => (
            <Card key={d.id} className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant={d.status === "OPEN" ? "danger" : "success"}>
                    {d.status}
                  </Badge>
                  <span className="text-xs text-muted">
                    Dilaporkan: {formatDate(d.created_at)}
                  </span>
          <div className="space-y-4">
            {paginatedDisputes.map((d) => (
              <Card key={d.id} className="p-6 space-y-4 rounded-3xl border border-border bg-surface shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={d.status === "OPEN" ? "danger" : "success"}>
                      {d.status}
                    </Badge>
                    <span className="text-xs font-mono font-bold text-dark-900">
                      ID #{d.id.substring(0, 8)}
                    </span>
                    <span className="text-xs text-muted">
                      • Dilaporkan: {formatDate(d.created_at)}
                    </span>
                  </div>

                  {d.status === "OPEN" && (
                    <Button
                      variant="brand"
                      size="sm"
                      onClick={() => handleOpenResolve(d)}
                      className="text-xs font-bold shadow-brand"
                    >
                      <Scale className="w-3.5 h-3.5 mr-1.5" />
                      Putuskan Resolusi & Split Escrow
                    </Button>
                  )}
                </div>

                {d.status === "OPEN" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenResolve(d)}
                    className="text-xs font-bold"
                  >
                    <Scale className="w-3.5 h-3.5 mr-1" />
                    Putuskan Resolusi & Split Escrow
                  </Button>
                <div className="text-xs space-y-1.5">
                  <span className="text-muted block font-semibold">Keluhan Sengketa:</span>
                  <p className="font-normal text-dark-900 bg-canvas p-4 rounded-2xl border border-border leading-relaxed">
                    "{d.dekripsi_masalah}"
                  </p>
                </div>

                {d.resolusi_masalah && (
                  <div className="text-xs space-y-1.5 pt-3 border-t border-border">
                    <span className="text-emerald-700 font-bold block">Keputusan & Eksekusi Admin:</span>
                    <p className="text-dark-900 font-normal bg-emerald-50/50 p-3 rounded-xl border border-emerald-200">
                      {d.resolusi_masalah}
                    </p>
                  </div>
                )}
              </div>
              </Card>
            ))}

              <div className="text-xs space-y-1">
                <span className="text-muted block">Keluhan Sengketa:</span>
                <p className="font-medium text-dark-900 bg-gray-50 p-3 rounded-xl border border-border">
                  "{d.dekripsi_masalah}"
                </p>
            {filteredDisputes.length > itemsPerPage && (
              <div className="bg-surface p-4 rounded-2xl border border-border">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredDisputes.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={(p) => setCurrentPage(p)}
                />
              </div>

              {d.resolusi_masalah && (
                <div className="text-xs space-y-1 pt-2 border-t border-border">
                  <span className="text-emerald-700 font-bold block">Keputusan & Eksekusi Admin:</span>
                  <p className="text-dark-900 font-medium">{d.resolusi_masalah}</p>
                </div>
              )}
            </Card>
          ))
            )}
          </div>
        )}
      </div>

      {/* Modal Resolve */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Mediasi Sengketa & Pembagian Dana Escrow"
      >
        <form onSubmit={handleResolveSubmit} className="space-y-4">
          {resolveError && (
            <div className="p-3 text-xs font-medium bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {resolveError}
            </div>
          )}

          <div className="p-3 bg-gray-50 border border-border rounded-xl text-xs space-y-2">
            <span className="font-bold text-dark-900 block">Atur Pembagian Dana Escrow (%):</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-muted block mb-1">
                  Kembalikan ke UMKM (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={resolveForm.persentase_klien}
                  onChange={(e) => handlePercentKlienChange(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-dark-900 text-sm font-bold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted block mb-1">
                  Cairkan ke Mahasiswa (%)
                </label>
                <input
                  type="number"
                  disabled
                  value={resolveForm.persentase_freelancer}
                  className="w-full px-3 py-2 bg-gray-100 border border-border rounded-lg text-dark-900 text-sm font-bold opacity-75 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <TextArea
            label="Alasan & Dasar Keputusan Mediasi"
            rows={4}
            placeholder="Jelaskan pertimbangan hasil mediasi yang adil bagi kedua belah pihak..."
            value={resolveForm.keputusan_admin}
            onChange={(e) => setResolveForm({ ...resolveForm, keputusan_admin: e.target.value })}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button variant="secondary" size="md" onClick={() => setModalOpen(false)} disabled={resolveLoading}>
              Batal
            </Button>
            <Button variant="primary" size="md" type="submit" loading={resolveLoading}>
              Eksekusi Resolusi Sengketa
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
