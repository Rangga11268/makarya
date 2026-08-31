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
    const nominalNum = parseFloat(topUpNominal);
    if (!nominalNum || nominalNum < 50000) {
      showError("Nominal Tidak Valid", "Top-up saldo minimal Rp 50.000");
      return;
    }

    try {
      setTopUpLoading(true);
      const res = await walletApi.requestTopUp({ nominal: nominalNum });

      if (res.data?.snap_token) {
        addToast("Membuka gateway pembayaran Midtrans Snap...", "info");
      } else {
        showSuccess(
          "Top-Up Saldo Berhasil!",
          `Saldo deposit usaha Anda bertambah sebesar ${formatCurrency(nominalNum)}. Siap digunakan untuk mengunci dana escrow proyek!`,
        );
      }

      setTopUpModalOpen(false);
      fetchWalletData();
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Gagal memproses permintaan top-up.";
      showError("Gagal Top-Up", msg);
    } finally {
      setTopUpLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setWithdrawError(null);

    const nominalNum = parseFloat(withdrawForm.nominal);
    if (!nominalNum || nominalNum < 25000) {
      setWithdrawError("Penarikan minimal Rp 25.000");
      return;
    }
    if (nominalNum > parseFloat(wallet?.saldo_aktif || 0)) {
      setWithdrawError("Saldo aktif Anda tidak mencukupi untuk penarikan ini.");
      return;
    }

    try {
      setWithdrawLoading(true);
      await walletApi.withdraw({
        nominal: nominalNum,
        nama_bank: withdrawForm.nama_bank,
        nomor_rekening: withdrawForm.nomor_rekening.trim(),
        nama_pemilik: withdrawForm.nama_pemilik.trim(),
      });

      addToast("Permintaan pencairan dana berhasil diproses!", "success");
      setWithdrawModalOpen(false);
      setWithdrawForm({
        nominal: "",
        nama_bank: "BCA",
        nomor_rekening: "",
        nama_pemilik: "",
      });
      fetchWalletData();
    } catch (err) {
      const msg = err.response?.data?.detail || "Gagal melakukan penarikan.";
      setWithdrawError(msg);
    } finally {
      setWithdrawLoading(false);
    }
  };

  const getBadgeType = (tipe) => {
    switch (tipe) {
      case "RELEASE":
      case "TOPUP":
        return <Badge variant="success">{tipe}</Badge>;
      case "WITHDRAW":
        return <Badge variant="danger">{tipe}</Badge>;
      case "HOLD":
        return <Badge variant="warning">{tipe}</Badge>;
      default:
        return <Badge variant="default">{tipe}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted font-sans">
            {isUmkm
              ? "Manajemen Keuangan & Escrow UMKM"
              : "Dompet & Rekening Mahasiswa"}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-900 tracking-tight leading-tight mt-1">
            {isUmkm
              ? "Dompet & Saldo Escrow UMKM"
              : "Dompet & Keuangan Mahasiswa"}
          </h1>
          <p className="text-xs sm:text-sm text-muted font-sans mt-1">
            {isUmkm
              ? "Kelola saldo deposit modal proyek, isi ulang saldo untuk pendanaan proyek, dan pantau dana yang dikunci aman di sistem Escrow Holding Makarya."
              : "Pusat saldo aktif hasil freelance proyek UMKM, dana pengerjaan dalam escrow, dan penarikan langsung ke rekening bank lokal Anda."}
          </p>
        </div>

        {isUmkm && (
          <Button
            variant="brand"
            size="md"
            onClick={() => setTopUpModalOpen(true)}
            className="shadow-brand text-xs font-bold shrink-0"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />+ Isi Ulang / Top-Up Saldo
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Isi Ulang Saldo Deposit
          </Button>
        )}
      </div>

      {/* Saldo Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="p-6 sm:p-7 space-y-5 bg-dark-900 text-white rounded-3xl shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {isUmkm
                  ? "Saldo Deposit Aktif (Siap Pakai)"
                  : "Saldo Aktif (Siap Ditarik)"}
              </span>
              <WalletIcon className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="text-3xl sm:text-4xl font-black tracking-tight font-sans">
              {formatCurrency(wallet?.saldo_aktif || 0)}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {isUmkm
                ? "Saldo aktif yang siap dialokasikan untuk mendanai dan mengunci escrow proyek baru saat Anda menerima proposal mahasiswa."
                : "Total honor dari proyek selesai yang siap ditarik ke rekening bank lokal Anda kapan saja."}
            </p>
          </div>

          <div className="pt-2">
            {isUmkm ? (
              <Button
                variant="secondary"
                size="md"
                onClick={() => setTopUpModalOpen(true)}
                className="w-full justify-center font-bold text-xs bg-white text-dark-900 hover:bg-slate-100"
              >
                <PlusCircle className="w-4 h-4 mr-1.5 text-brand-indigo" />+ Isi
                Ulang / Top Up Saldo Deposit
                <PlusCircle className="w-4 h-4 mr-1.5 text-brand-indigo" />
                Isi Ulang Saldo Deposit
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="md"
                onClick={() => setWithdrawModalOpen(true)}
                className="w-full justify-center font-bold text-xs bg-white text-dark-900 hover:bg-slate-100"
              >
                <ArrowUpRight className="w-4 h-4 mr-1 text-emerald-600" />↗
                Tarik Saldo ke Rekening Bank
              </Button>
            )}
          </div>
        </Card>

        <Card className="p-6 sm:p-7 space-y-5 bg-surface border border-border rounded-3xl shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                {isUmkm
                  ? "Saldo Terkunci di Escrow Holding"
                  : "Honor dalam Pengerjaan (Escrow)"}
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Lock className="w-4 h-4 text-amber-600" />
              </div>
            </div>

            <div className="text-3xl sm:text-4xl font-black text-dark-900 tracking-tight font-sans">
              {formatCurrency(wallet?.saldo_escrow || 0)}
            </div>

            <p className="text-xs text-muted leading-relaxed font-normal">
              {isUmkm
                ? "Dana proyek berjalan yang sedang diamankan sistem Escrow Makarya. Otomatis diteruskan ke mahasiswa setelah Anda memeriksa dan menyetujui hasil deliverable."
                : "Dana honor proyek yang sedang Anda kerjakan. Otomatis cair ke saldo aktif setelah klien UMKM menyetujui hasil pengerjaan Anda."}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-border">
            <span className="text-muted flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Terproteksi Escrow 100%
            </span>
            <Link
              to="/proposals"
              className="font-bold text-brand-indigo hover:underline flex items-center gap-1"
            >
              Lihat Proyek Berjalan →
            </Link>
          </div>
        </Card>
      </div>

      {/* Ledger Log Immutable Audit Trail Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-dark-900 flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-brand-indigo" />
            Riwayat Mutasi Saldo (Audit Trail Immutable)
          </h2>
          <span className="text-xs font-bold text-muted bg-canvas border border-border px-3 py-1 rounded-full">
            {history.length} Transaksi Tercatat
          </span>
        </div>

        <Card className="p-0 overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-border text-dark-900 uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Waktu</th>
                  <th className="py-3.5 px-4">Tipe Transaksi</th>
                  <th className="py-3.5 px-4">Nominal</th>
                  <th className="py-3.5 px-4">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-10 text-center text-muted">
                      Belum ada riwayat transaksi keuangan tercatat.
                    </td>
                  </tr>
                ) : (
                  history.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-muted whitespace-nowrap">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="py-3.5 px-4">{getBadgeType(log.tipe)}</td>
                      <td className="py-3.5 px-4 font-bold text-dark-900 whitespace-nowrap">
                        {log.tipe === "WITHDRAW" || log.tipe === "HOLD"
                          ? "-"
                          : "+"}{" "}
                        {formatCurrency(log.nominal)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 max-w-xs sm:max-w-md truncate">
                        {log.keterangan || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

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
              variant="primary"
              size="md"
              type="submit"
              loading={withdrawLoading}
            >
              Konfirmasi Penarikan
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: UMKM TOP-UP DEPOSIT MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={topUpModalOpen}
        onClose={() => setTopUpModalOpen(false)}
        title="Isi Ulang / Top-Up Saldo Usaha"
      >
        <form onSubmit={handleTopUp} className="space-y-4 font-sans">
          <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-2xl text-xs space-y-1">
            <p className="font-bold text-indigo-950">
              Alokasi Saldo Deposit UMKM:
            </p>
            <p className="text-indigo-900/80 leading-relaxed">
              Saldo yang di-topup akan tersimpan di dompet usaha Anda dan
              digunakan untuk mengunci dana proyek (Escrow Holding) saat Anda
              menyetujui proposal mahasiswa.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-dark-900 mb-1.5">
              Pilih Nominal Cepat
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[100000, 250000, 500000, 1000000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTopUpNominal(String(preset))}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                    topUpNominal === String(preset)
                      ? "bg-dark-900 text-white border-dark-900 shadow-xs"
                      : "bg-surface text-slate-700 border-border hover:border-slate-400"
                  }`}
                >
                  {formatCurrency(preset)}
                </button>
              ))}
            </div>
          </div>

          <CurrencyInput
            label="Atau Masukkan Nominal Kustom (Rp)"
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
              Konfirmasi Top-Up 💳
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
