import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { walletApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { useAlertStore } from "../../store/alertStore";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { CurrencyInput } from "../../components/ui/CurrencyInput";
import { Modal } from "../../components/ui/Modal";
import { Pagination } from "../../components/ui/Pagination";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import {
  Wallet as WalletIcon,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Lock,
  ReceiptText,
  PlusCircle,
  Building2,
  GraduationCap,
  CreditCard,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  Printer,
  FileCheck
} from "lucide-react";

export function WalletPage() {
  const { user } = useAuthStore();
  const isUmkm = user?.role === "UMKM";
  const { addToast } = useToastStore();
  const { showSuccess, showError } = useAlertStore();

  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter & Pagination states for Ledger
  const [txSearch, setTxSearch] = useState("");
  const [txTypeFilter, setTxTypeFilter] = useState("ALL");
  const [txPage, setTxPage] = useState(1);
  const txPerPage = 6;

  // Receipt Modal state
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Modals
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);

  // Top Up state (UMKM)
  const [topUpNominal, setTopUpNominal] = useState("500000");
  const [topUpMethod, setTopUpMethod] = useState("BCA");
  const [topUpLoading, setTopUpLoading] = useState(false);

  // Withdraw state (MHS)
  const [withdrawForm, setWithdrawForm] = useState({
    nominal: "",
    nama_bank: "BCA",
    nomor_rekening: "",
    nama_pemilik: "",
  });
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState(null);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [walletRes, historyRes] = await Promise.all([
        walletApi.getMe(),
        walletApi.getHistory(),
      ]);
      setWallet(walletRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      console.error("Gagal memuat dompet:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  // Handle UMKM Top-Up
  const handleTopUp = async (e) => {
    e.preventDefault();
    const nominal = parseInt(topUpNominal, 10);
    if (!nominal || nominal < 50000) {
      showError(
        "Nominal Tidak Valid",
        "Minimal top-up saldo dompet adalah Rp 50.000."
      );
      return;
    }

    try {
      setTopUpLoading(true);
      const res = await walletApi.topUp(nominal);
      const { snap_token, redirect_url, order_id } = res.data;

      // Jika Midtrans Snap script terpasang di window
      if (window.snap && snap_token) {
        window.snap.pay(snap_token, {
          onSuccess: function (result) {
            setTopUpModalOpen(false);
            showSuccess(
              "Top-Up Berhasil Diproses",
              `Deposit saldo Rp ${formatCurrency(nominal)} berhasil masuk.`
            );
            fetchWalletData();
          },
          onPending: function (result) {
            setTopUpModalOpen(false);
            showSuccess(
              "Menunggu Pembayaran",
              `Selesaikan pembayaran via VA/QRIS sebelum batas waktu.`
            );
            fetchWalletData();
          },
          onError: function (result) {
            showError("Top-Up Gagal", "Transaksi gagal diproses oleh gateway.");
          },
          onClose: function () {
            addToast("Pembayaran dibatalkan atau popup ditutup.", "info");
          },
        });
      } else {
        // Fallback demo/sandbox tanpa script CDN snap aktif
        setTopUpModalOpen(false);
        showSuccess(
          "Simulasi Top-Up Berhasil",
          `Order ID ${order_id} sebesar ${formatCurrency(nominal)} berhasil diproses via simulasi.`
        );
        fetchWalletData();
      }
    } catch (err) {
      showError(
        "Gagal Memproses Top-Up",
        err.response?.data?.detail || "Terjadi kendala pada gateway pembayaran."
      );
    } finally {
      setTopUpLoading(false);
    }
  };

  // Handle MHS Withdraw
  const handleWithdraw = async (e) => {
    e.preventDefault();
    setWithdrawError(null);

    const nominal = parseInt(withdrawForm.nominal, 10);
    if (!nominal || nominal < 25000) {
      setWithdrawError("Minimal penarikan saldo adalah Rp 25.000");
      return;
    }

    if (nominal > (wallet?.saldo_aktif || 0)) {
      setWithdrawError("Saldo aktif Anda tidak mencukupi untuk penarikan ini");
      return;
    }

    try {
      setWithdrawLoading(true);
      await walletApi.withdraw({
        nominal,
        nama_bank: withdrawForm.nama_bank,
        nomor_rekening: withdrawForm.nomor_rekening,
        nama_pemilik: withdrawForm.nama_pemilik,
      });

      setWithdrawModalOpen(false);
      showSuccess(
        "Permintaan Penarikan Berhasil",
        `Dana ${formatCurrency(nominal)} sedang diproses transfer ke rekening ${withdrawForm.nama_bank} (${withdrawForm.nomor_rekening}).`
      );
      setWithdrawForm({
        nominal: "",
        nama_bank: "BCA",
        nomor_rekening: "",
        nama_pemilik: "",
      });
      fetchWalletData();
    } catch (err) {
      setWithdrawError(
        err.response?.data?.detail || "Gagal mengajukan penarikan dana"
      );
    } finally {
      setWithdrawLoading(false);
    }
  };

  const getBadgeType = (type) => {
    switch (type) {
      case "TOPUP":
        return <Badge variant="success">Top-Up Saldo</Badge>;
      case "HOLD":
        return <Badge variant="warning">Escrow Lock</Badge>;
      case "RELEASE":
        return <Badge variant="brand">Pencairan Honor</Badge>;
      case "WITHDRAW":
        return <Badge variant="neutral">Penarikan Bank</Badge>;
      case "REFUND":
        return <Badge variant="danger">Pengembalian Dana</Badge>;
      default:
        return <Badge variant="neutral">{type}</Badge>;
    }
  };

  const filteredHistory = history.filter((log) => {
    const matchType = txTypeFilter === "ALL" || log.tipe === txTypeFilter;
    const searchLower = txSearch.trim().toLowerCase();
    const matchSearch =
      !searchLower ||
      (log.keterangan || "").toLowerCase().includes(searchLower) ||
      (log.id || "").toLowerCase().includes(searchLower) ||
      log.nominal.toString().includes(searchLower);
    return matchType && matchSearch;
  });

  const totalTxPages = Math.ceil(filteredHistory.length / txPerPage) || 1;
  const paginatedHistory = filteredHistory.slice(
    (txPage - 1) * txPerPage,
    txPage * txPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted font-sans">
            Sistem Keuangan & Rekening Bersama
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-900 tracking-tight leading-tight mt-1 font-normal">
            Dompet & Keuangan Makarya
          </h1>
          <p className="text-xs sm:text-sm text-muted font-sans mt-1">
            Pengelolaan saldo operasional, proteksi escrow holding, dan riwayat mutasi transaksi keuangan Anda.
          </p>
        </div>

        {/* Quick Action Button Header */}
        <div className="flex items-center gap-2">
          {isUmkm ? (
            <Button
              variant="brand"
              size="md"
              onClick={() => setTopUpModalOpen(true)}
              className="text-xs font-bold shadow-brand"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Deposit Saldo UMKM
            </Button>
          ) : (
            <Button
              variant="brand"
              size="md"
              onClick={() => setWithdrawModalOpen(true)}
              className="text-xs font-bold shadow-brand"
            >
              <ArrowDownLeft className="w-4 h-4 mr-1.5" />
              Tarik ke Rekening Bank
            </Button>
          )}
        </div>
      </div>

      {/* Saldo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Saldo Aktif */}
        <Card className="p-6 sm:p-8 bg-surface border-border relative overflow-hidden flex flex-col justify-between space-y-6 rounded-3xl shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
                Saldo Aktif Dapat Digunakan
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-dark-900 font-sans tracking-tight">
                {loading ? (
                  <div className="h-9 w-44 bg-gray-200 animate-pulse rounded-lg mt-1" />
                ) : (
                  formatCurrency(wallet?.saldo_aktif || 0)
                )}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-indigo-light/50 border border-brand-indigo/20 flex items-center justify-center text-brand-indigo">
              <WalletIcon className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-muted leading-relaxed">
              {isUmkm
                ? "Saldo siap pakai untuk mengunci pembayaran proyek mahasiswa baru (*Escrow Deposit*)."
                : "Saldo honor proyek yang telah disetujui UMKM dan siap ditarik ke rekening bank pribadi Anda."}
            </p>

            <div className="flex items-center gap-3 pt-2 border-t border-border">
              {isUmkm ? (
                <Button
                  variant="brand"
                  size="sm"
                  onClick={() => setTopUpModalOpen(true)}
                  className="text-xs font-bold shadow-brand"
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1" />
                  Top-Up Saldo
                </Button>
              ) : (
                <Button
                  variant="brand"
                  size="sm"
                  onClick={() => setWithdrawModalOpen(true)}
                  className="text-xs font-bold shadow-brand"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5 mr-1" />
                  Tarik Saldo
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Card 2: Saldo Terkunci di Escrow Holding */}
        <Card className="p-6 sm:p-8 bg-surface border-border relative overflow-hidden flex flex-col justify-between space-y-6 rounded-3xl shadow-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
                  Saldo Terkunci di Rekening Bersama (Escrow)
                </span>
                <ShieldCheck className="w-4 h-4 text-brand-cyan" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-brand-indigo font-sans tracking-tight">
                {loading ? (
                  <div className="h-9 w-44 bg-gray-200 animate-pulse rounded-lg mt-1" />
                ) : (
                  formatCurrency(wallet?.saldo_escrow || 0)
                )}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Lock className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-muted leading-relaxed">
              {isUmkm
                ? "Dana proyek yang sedang dikerjakan mahasiswa. Dana ini aman tersimpan dan baru akan cair setelah Anda menyetujui hasil deliverable."
                : "Honor proyek aktif yang sedang Anda kerjakan. Dana sudah terkunci 100% dari klien dan pasti cair begitu hasil kerja Anda disetujui."}
            </p>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Link
                to={isUmkm ? "/projects" : "/proposals"}
                className="text-xs font-bold text-brand-indigo hover:underline flex items-center gap-1"
              >
                <span>Lihat Proyek Terkait</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Ledger Log Immutable Audit Trail Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-dark-900 flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-brand-indigo" />
            Riwayat Mutasi Saldo & Bukti Transaksi
          </h2>
          <span className="text-xs font-bold text-muted bg-surface border border-border px-3 py-1 rounded-full w-fit">
            {history.length} Transaksi Tercatat
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3 rounded-2xl border border-border">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {[
              { id: "ALL", label: "Semua" },
              { id: "TOPUP", label: "Top-Up" },
              { id: "HOLD", label: "Escrow Hold" },
              { id: "RELEASE", label: "Pencairan" },
              { id: "WITHDRAW", label: "Tarik Bank" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setTxTypeFilter(tab.id);
                  setTxPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  txTypeFilter === tab.id
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
              placeholder="Cari transaksi / keterangan / nominal..."
              value={txSearch}
              onChange={(e) => {
                setTxSearch(e.target.value);
                setTxPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-canvas border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-brand-indigo font-sans"
            />
          </div>
        </div>

        <Card className="p-0 overflow-hidden rounded-2xl border border-border shadow-xs">
          {/* Mobile View: Clean Transaction Cards (sm:hidden) */}
          <div className="block sm:hidden divide-y divide-border">
            {paginatedHistory.length === 0 ? (
              <div className="py-12 px-4 text-center text-muted text-xs">
                {txSearch || txTypeFilter !== "ALL"
                  ? "Tidak ada transaksi yang cocok dengan filter pencarian."
                  : "Belum ada riwayat transaksi keuangan tercatat."}
              </div>
            ) : (
              paginatedHistory.map((log) => {
                const isDeduct = log.tipe === "WITHDRAW" || log.tipe === "HOLD";
                return (
                  <div key={log.id} className="p-4 space-y-2.5 bg-surface hover:bg-canvas/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getBadgeType(log.tipe)}
                        <span className="text-[10px] text-muted font-mono">
                          {formatDate(log.created_at)}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-black font-sans ${
                          isDeduct ? "text-dark-900" : "text-emerald-600"
                        }`}
                      >
                        {isDeduct ? "-" : "+"} {formatCurrency(log.nominal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs">
                      <p className="text-dark-900/90 flex-1 leading-snug">
                        {log.keterangan || "-"}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReceipt(log)}
                        className="text-[11px] py-1 px-2.5 font-bold shrink-0"
                      >
                        <Printer className="w-3.5 h-3.5 mr-1" />
                        Struk
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop View: Spacious Data Table (hidden sm:block) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas border-b border-border text-dark-900 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Waktu Transaksi</th>
                  <th className="py-3.5 px-4">Tipe Transaksi</th>
                  <th className="py-3.5 px-4">Nominal</th>
                  <th className="py-3.5 px-4">Keterangan</th>
                  <th className="py-3.5 px-4 text-right">Bukti Cetak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedHistory.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-muted">
                      {txSearch || txTypeFilter !== "ALL"
                        ? "Tidak ada transaksi yang cocok dengan filter pencarian."
                        : "Belum ada riwayat transaksi keuangan tercatat."}
                    </td>
                  </tr>
                ) : (
                  paginatedHistory.map((log) => {
                    const isDeduct = log.tipe === "WITHDRAW" || log.tipe === "HOLD";
                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-canvas/50 transition-colors"
                      >
                        <td className="py-3.5 px-4 text-muted whitespace-nowrap font-mono text-[11px]">
                          {formatDate(log.created_at)}
                        </td>
                        <td className="py-3.5 px-4">{getBadgeType(log.tipe)}</td>
                        <td
                          className={`py-3.5 px-4 font-bold whitespace-nowrap font-sans ${
                            isDeduct ? "text-dark-900" : "text-emerald-600 font-extrabold"
                          }`}
                        >
                          {isDeduct ? "-" : "+"}{" "}
                          {formatCurrency(log.nominal)}
                        </td>
                        <td className="py-3.5 px-4 text-dark-900 max-w-xs sm:max-w-md truncate font-normal">
                          {log.keterangan || "-"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReceipt(log)}
                            className="text-[11px] py-1 px-2.5 font-bold"
                          >
                            <Printer className="w-3.5 h-3.5 mr-1" />
                            Struk
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {filteredHistory.length > 0 && (
            <div className="p-4 bg-surface border-t border-border">
              <Pagination
                currentPage={txPage}
                totalPages={totalTxPages}
                totalItems={filteredHistory.length}
                itemsPerPage={txPerPage}
                onPageChange={(p) => setTxPage(p)}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Modal Cetak Struk Transaksi Resmi */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title="Bukti Transaksi Resmi Makarya"
        >
          <div className="space-y-6">
            <div className="p-6 bg-canvas border border-border rounded-2xl space-y-4 font-sans text-xs">
              {/* Receipt Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h4 className="text-base font-serif font-bold text-dark-900 tracking-tight">
                    MAKARYA
                  </h4>
                  <span className="text-[10px] text-muted uppercase tracking-wider block">
                    Voucher Transaksi Keuangan Escrow
                  </span>
                </div>
                <div className="text-right">
                  <Badge variant="success" className="text-[10px]">TERVERIFIKASI</Badge>
                  <span className="text-[10px] font-mono text-muted block mt-1">
                    ID #{selectedReceipt.id.substring(0, 8)}
                  </span>
                </div>
              </div>

              {/* Receipt Body Info */}
              <div className="space-y-2.5">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted">Tanggal Transaksi</span>
                  <span className="font-semibold text-dark-900">{formatDate(selectedReceipt.created_at)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted">Tipe Mutasi</span>
                  <span className="font-bold text-dark-900">{selectedReceipt.tipe}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted">Akun Pengguna</span>
                  <span className="font-semibold text-dark-900">{user?.nama_lengkap || user?.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted">Keterangan</span>
                  <span className="font-medium text-dark-900 max-w-xs text-right">{selectedReceipt.keterangan || "-"}</span>
                </div>
                <div className="flex justify-between py-2 pt-3 border-t border-border text-sm">
                  <span className="font-bold text-dark-900">Total Nominal</span>
                  <span className="font-extrabold text-brand-indigo font-sans">
                    {formatCurrency(selectedReceipt.nominal)}
                  </span>
                </div>
              </div>

              {/* Seal Footer */}
              <div className="p-3 bg-brand-indigo-light/30 border border-brand-indigo/20 rounded-xl flex items-center gap-2 text-[11px] text-brand-indigo">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Transaksi diamankan oleh Sistem Rekening Bersama (Escrow Holding) Makarya.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedReceipt(null)}
                className="text-xs font-bold"
              >
                Tutup
              </Button>
              <Button
                variant="brand"
                size="md"
                onClick={() => window.print()}
                className="text-xs font-bold shadow-brand"
              >
                <Printer className="w-4 h-4 mr-1.5" />
                Cetak / Simpan PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Withdraw */}
      <Modal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        title="Tarik Saldo ke Rekening Bank"
      >
        <form onSubmit={handleWithdraw} className="space-y-4">
          {withdrawError && (
            <div className="p-3 text-xs font-medium bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {withdrawError}
            </div>
          )}

          <div className="p-3 bg-gray-50 border border-border rounded-xl text-xs flex justify-between items-center">
            <span className="text-muted">Saldo Aktif Anda:</span>
            <span className="font-black text-dark-900">
              {formatCurrency(wallet?.saldo_aktif || 0)}
            </span>
          </div>

          <CurrencyInput
            label="Nominal Penarikan"
            placeholder="50.000"
            value={withdrawForm.nominal}
            onChange={(val) =>
              setWithdrawForm({ ...withdrawForm, nominal: val })
            }
            helperText="Minimal penarikan Rp 25.000"
            required
          />

          <div className="w-full space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider">
              Bank Tujuan
            </label>
            <select
              value={withdrawForm.nama_bank}
              onChange={(e) =>
                setWithdrawForm({ ...withdrawForm, nama_bank: e.target.value })
              }
              className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 focus:outline-none focus:border-dark-800"
            >
              <option value="BCA">BCA (Bank Central Asia)</option>
              <option value="Mandiri">Bank Mandiri</option>
              <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
              <option value="BNI">BNI (Bank Negara Indonesia)</option>
              <option value="BSI">BSI (Bank Syariah Indonesia)</option>
              <option value="Jago">Bank Jago</option>
              <option value="SeaBank">SeaBank</option>
            </select>
          </div>

          <Input
            label="Nomor Rekening"
            placeholder="Contoh: 1234567890"
            value={withdrawForm.nomor_rekening}
            onChange={(e) =>
              setWithdrawForm({
                ...withdrawForm,
                nomor_rekening: e.target.value,
              })
            }
            required
          />

          <Input
            label="Nama Pemilik Rekening"
            placeholder="Harus sesuai dengan nama buku tabungan"
            value={withdrawForm.nama_pemilik}
            onChange={(e) =>
              setWithdrawForm({ ...withdrawForm, nama_pemilik: e.target.value })
            }
            required
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setWithdrawModalOpen(false)}
              disabled={withdrawLoading}
            >
              Batal
            </Button>
            <Button
              variant="brand"
              size="md"
              type="submit"
              loading={withdrawLoading}
            >
              Konfirmasi Penarikan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Top-Up UMKM */}
      <Modal
        isOpen={topUpModalOpen}
        onClose={() => setTopUpModalOpen(false)}
        title="Deposit Saldo Operasional UMKM"
      >
        <form onSubmit={handleTopUp} className="space-y-4 font-sans">
          <div className="p-3 bg-brand-indigo-light/30 border border-brand-indigo/20 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-brand-indigo">
              <ShieldCheck className="w-4 h-4" />
              <span>Proteksi 100% Rekening Bersama (Escrow)</span>
            </div>
            <p className="text-brand-indigo/80 text-[11px] leading-relaxed">
              Saldo yang Anda depositkan akan tersimpan aman dan hanya dikunci saat Anda menyetujui proposal mahasiswa.
            </p>
          </div>

          <CurrencyInput
            label="Nominal Deposit (Rp)"
            placeholder="500.000"
            value={topUpNominal}
            onChange={(val) => setTopUpNominal(val)}
            helperText="Minimal top-up saldo Rp 50.000"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-dark-900">
              Pilih Saluran Pembayaran (Simulasi / Gateway)
            </label>
            <select
              value={topUpMethod}
              onChange={(e) => setTopUpMethod(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-medium bg-surface border border-border rounded-xl text-dark-900 focus:outline-none focus:border-brand-indigo"
            >
              <option value="BCA">BCA Virtual Account</option>
              <option value="Mandiri">Mandiri Bill Payment</option>
              <option value="BRI">BRI Virtual Account (BRIVA)</option>
              <option value="BNI">BNI Virtual Account</option>
              <option value="QRIS">QRIS (GoPay, OVO, ShopeePay, DANA)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setTopUpModalOpen(false)}
              className="text-xs font-bold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="brand"
              size="md"
              loading={topUpLoading}
              className="text-xs font-bold shadow-brand"
            >
              Konfirmasi Top-Up
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}