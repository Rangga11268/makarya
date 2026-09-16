import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  CreditCard,
  QrCode,
  Building2,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  ExternalLink,
  Smartphone,
  AlertCircle,
} from "lucide-react";

export function PaymentGatewayModal({
  isOpen,
  onClose,
  nominal,
  onSuccess,
  userName = "Pengguna Makarya",
}) {
  const [activeChannel, setActiveChannel] = useState("VA_BCA");
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState("CHECKOUT"); // 'CHECKOUT' | 'SUCCESS'

  const parsedNominal = parseInt(nominal, 10) || 500000;
  const adminFee = 0; // Bebas biaya admin di Makarya
  const totalPayment = parsedNominal + adminFee;

  // Generate deterministic/realistic virtual account numbers based on channel
  const vaNumbers = {
    VA_BCA: "3901" + "081234567890".slice(-8),
    VA_MANDIRI: "88708" + "081234567890".slice(-8),
    VA_BRI: "12800" + "081234567890".slice(-8),
    VA_BNI: "8277" + "081234567890".slice(-8),
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    try {
      if (onSuccess) {
        await onSuccess(parsedNominal);
      }
      setPaymentStep("SUCCESS");
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    setPaymentStep("CHECKOUT");
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setPaymentStep("CHECKOUT");
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleFinish}
      title="Payment Gateway Sandbox (Midtrans / Xendit)"
    >
      <div className="space-y-5 font-sans">
        {paymentStep === "SUCCESS" ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Pembayaran Berhasil Diterima
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Dana sebesar{" "}
                <span className="font-bold text-slate-900">
                  {formatCurrency(totalPayment)}
                </span>{" "}
                telah berhasil ditambahkan ke saldo aktif dompet Anda.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Status Transaksi</span>
                <Badge variant="success" className="text-[10px]">
                  SETTLED / LUNAS
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Waktu Pembayaran</span>
                <span className="font-mono text-slate-800">
                  {new Date().toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Metode</span>
                <span className="font-semibold text-slate-800">
                  {activeChannel.replace("_", " ")}
                </span>
              </div>
            </div>

            <Button
              variant="brand"
              size="md"
              onClick={handleFinish}
              className="w-full font-bold shadow-brand text-xs"
            >
              Selesai & Lihat Saldo
            </Button>
          </div>
        ) : (
          <>
            {/* Header Summary & Escrow Protection */}
            <div className="p-3.5 bg-brand-indigo-light/25 border border-brand-indigo/20 rounded-2xl flex items-start justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-brand-indigo">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Escrow Safe Checkout</span>
                </div>
                <p className="text-[11px] text-brand-indigo/80">
                  Total Tagihan Pembayaran:
                </p>
                <div className="text-xl font-black text-slate-900 tabular-nums">
                  {formatCurrency(totalPayment)}
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                  <Clock className="w-3 h-3" /> 23:59:59
                </span>
              </div>
            </div>

            {/* Channels Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900">
                Pilih Metode Pembayaran
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-xl">
                {[
                  { id: "VA_BCA", label: "BCA VA", icon: Building2 },
                  { id: "VA_MANDIRI", label: "Mandiri", icon: Building2 },
                  { id: "VA_BRI", label: "BRI", icon: Building2 },
                  { id: "VA_BNI", label: "BNI", icon: Building2 },
                  { id: "QRIS", label: "QRIS / E-Wallet", icon: QrCode },
                ].map((channel) => {
                  const Icon = channel.icon;
                  const isActive = activeChannel === channel.id;
                  return (
                    <button
                      key={channel.id}
                      type="button"
                      onClick={() => setActiveChannel(channel.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg text-center transition-all cursor-pointer ${
                        isActive
                          ? "bg-white text-brand-indigo shadow-xs border border-slate-200/80 font-bold"
                          : "text-slate-600 hover:text-slate-900 font-medium"
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <span className="text-[11px] leading-tight">
                        {channel.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Channel Display Card */}
            {activeChannel.startsWith("VA_") ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Nomor Virtual Account {activeChannel.replace("VA_", "")}
                    </span>
                    <div className="text-base sm:text-lg font-mono font-black text-slate-900 tracking-wider">
                      {vaNumbers[activeChannel]}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(vaNumbers[activeChannel])}
                    className="text-xs font-semibold"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />{" "}
                        Disalin
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" /> Salin VA
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-xs space-y-1 pt-2 border-t border-slate-200 text-slate-600">
                  <p className="font-semibold text-slate-800">
                    Petunjuk Pembayaran:
                  </p>
                  <ol className="list-decimal list-inside space-y-0.5 text-[11px] leading-relaxed text-slate-600">
                    <li>Buka aplikasi Mobile Banking atau ATM bank Anda.</li>
                    <li>
                      Pilih menu <strong>Transfer Virtual Account</strong>.
                    </li>
                    <li>
                      Masukkan nomor VA di atas dan pastikan nominal tagihan
                      sesuai (<strong>{formatCurrency(totalPayment)}</strong>).
                    </li>
                    <li>
                      Konfirmasi pembayaran dan saldo dompet akan otomatis
                      terisi seketika.
                    </li>
                  </ol>
                </div>
              </div>
            ) : (
              /* QRIS & E-Wallet Channel */
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-800">
                  <Smartphone className="w-4 h-4 text-brand-indigo" />
                  <span>Scan QRIS dengan GoPay, OVO, ShopeePay, DANA, BCA</span>
                </div>

                {/* Realistic Simulated QR Code Box */}
                <div className="w-44 h-44 bg-white border-2 border-slate-900 rounded-xl mx-auto p-3 flex flex-col items-center justify-between shadow-xs">
                  <div className="w-full flex justify-between items-center text-[8px] font-black text-slate-800 tracking-widest border-b pb-1">
                    <span>QRIS</span>
                    <span>MAKARYA PAY</span>
                  </div>
                  <div className="w-28 h-28 bg-slate-100 rounded-lg flex items-center justify-center p-2">
                    <QrCode className="w-full h-full text-slate-900" />
                  </div>
                  <div className="text-[9px] font-mono text-slate-500">
                    NMID: ID1020304050607
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Arahkan kamera e-wallet Anda ke kode QRIS di atas untuk
                  menyelesaikan tagihan deposit.
                </p>
              </div>
            )}

            {/* Sandbox Simulation Bar */}
            <div className="p-3 bg-indigo-50/80 border border-indigo-200/80 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-indigo-900">
                <AlertCircle className="w-4 h-4 shrink-0 text-indigo-600" />
                <span className="text-[11px] font-medium leading-tight">
                  Mode Pengujian Sandbox: Simulasikan pembayaran sukses tanpa
                  debit rekening asli.
                </span>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onClose}
                className="text-xs font-semibold"
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="brand"
                size="md"
                loading={isProcessing}
                onClick={handleSimulatePayment}
                className="text-xs font-bold shadow-brand"
              >
                <Check className="w-4 h-4 mr-1.5" />
                Simulasi Bayar Berhasil (Sandbox)
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
