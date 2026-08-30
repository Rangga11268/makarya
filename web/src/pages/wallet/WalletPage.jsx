import React, { useState, useEffect } from "react";
import { walletApi } from "../../api";
import { useToastStore } from "../../store/toastStore";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { CurrencyInput } from "../../components/ui/CurrencyInput";
import { Modal } from "../../components/ui/Modal";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { 
  Wallet as WalletIcon, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  Lock, 
  ReceiptText 
} from "lucide-react";

export function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({
    nominal: "",
    nama_bank: "BCA",
    nomor_rekening: "",
    nama_pemilik: "",
  });
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState(null);
  const { addToast } = useToastStore();

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
      setWithdrawForm({ nominal: "", nama_bank: "BCA", nomor_rekening: "", nama_pemilik: "" });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-900 tracking-tight">
          Dompet & Keuangan Mahasiswa
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Pusat saldo aktif hasil freelance, dana terkunci escrow, dan penarikan ke rekening bank lokal
        </p>
      </div>

      {/* Saldo Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4 bg-dark-900 text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Saldo Aktif (Siap Ditarik)
            </span>
            <WalletIcon className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="text-3xl sm:text-4xl font-black tracking-tight">
            {formatCurrency(wallet?.saldo_aktif || 0)}
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={() => setWithdrawModalOpen(true)}
            className="w-full justify-center font-bold text-xs"
          >
            <ArrowUpRight className="w-4 h-4 mr-1" />
            Tarik Saldo ke Rekening Bank
          </Button>
        </Card>

        <Card className="p-6 space-y-4 bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Saldo Dalam Proyek (Escrow)
            </span>
            <Lock className="w-5 h-5 text-amber-500" />
          </div>

          <div className="text-3xl sm:text-4xl font-black text-dark-900 tracking-tight">
            {formatCurrency(wallet?.saldo_escrow || 0)}
          </div>

          <p className="text-xs text-muted leading-relaxed">
            Dana yang sedang dikerjakan dan akan otomatis cair ke saldo aktif setelah hasil kerja disetujui klien UMKM.
          </p>
        </Card>
      </div>

      {/* Ledger Log Immutable Audit Trail Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-dark-900 flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-dark-900" />
            Riwayat Mutasi Saldo (Audit Trail Immutable)
          </h2>
          <span className="text-xs text-muted">{history.length} Transaksi</span>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-border text-dark-900 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Tipe Transaksi</th>
                  <th className="py-3 px-4">Nominal</th>
                  <th className="py-3 px-4">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-muted">
                      Belum ada riwayat transaksi keuangan tercatat.
                    </td>
                  </tr>
                ) : (
                  history.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4 text-muted whitespace-nowrap">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="py-3.5 px-4">{getBadgeType(log.tipe)}</td>
                      <td className="py-3.5 px-4 font-bold text-dark-900 whitespace-nowrap">
                        {log.tipe === "WITHDRAW" ? "-" : "+"} {formatCurrency(log.nominal)}
                      </td>
                      <td className="py-3.5 px-4 text-muted max-w-xs sm:max-w-md truncate">
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
            <span className="font-black text-dark-900">{formatCurrency(wallet?.saldo_aktif || 0)}</span>
          </div>

          <Input
            label="Nominal Penarikan (Rp)"
            type="number"
            min="25000"
            placeholder="Minimal 25000"
          <CurrencyInput
            label="Nominal Penarikan"
            placeholder="50.000"
            value={withdrawForm.nominal}
            onChange={(e) => setWithdrawForm({ ...withdrawForm, nominal: e.target.value })}
            onChange={(val) => setWithdrawForm({ ...withdrawForm, nominal: val })}
            helperText="Minimal penarikan Rp 25.000"
            required
          />

          <div className="w-full space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider">
              Bank Tujuan
            </label>
            <select
              value={withdrawForm.nama_bank}
              onChange={(e) => setWithdrawForm({ ...withdrawForm, nama_bank: e.target.value })}
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
            onChange={(e) => setWithdrawForm({ ...withdrawForm, nomor_rekening: e.target.value })}
            required
          />

          <Input
            label="Nama Pemilik Rekening"
            placeholder="Harus sesuai dengan nama buku tabungan"
            value={withdrawForm.nama_pemilik}
            onChange={(e) => setWithdrawForm({ ...withdrawForm, nama_pemilik: e.target.value })}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button variant="secondary" size="md" onClick={() => setWithdrawModalOpen(false)} disabled={withdrawLoading}>
              Batal
            </Button>
            <Button variant="primary" size="md" type="submit" loading={withdrawLoading}>
              Konfirmasi Penarikan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
