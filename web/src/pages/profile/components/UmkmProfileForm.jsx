import React from "react";
import { Card } from "../../../components/ui/Card";
import { SelectWithOther } from "../../../components/ui/SelectWithOther";
import {
  INDUSTRI_OPTIONS,
  KOTA_OPTIONS,
  BANK_OPTIONS,
} from "../../../constants/formOptions";
import { Building2, MapPin, Phone, CreditCard } from "lucide-react";
import {
  Building2,
  MapPin,
  Phone,
  CreditCard,
  PenTool,
  UploadCloud,
  CheckCircle2,
  Trash2,
} from "lucide-react";

export function UmkmProfileForm({ umkmData, setUmkmData, industriList }) {
  return (
    <>
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="border-b border-border pb-4">
          <h3 className="text-base font-bold text-dark-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-indigo" />
            Informasi Profil Usaha UMKM
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Data usaha Anda akan tampil pada rincian proyek untuk meyakinkan
            mahasiswa bertalenta.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark-900">
              Nama Usaha / Toko / Merek
            </label>
            <input
              type="text"
              required
              value={umkmData.nama_usaha}
              onChange={(e) =>
                setUmkmData({ ...umkmData, nama_usaha: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo"
              placeholder="Contoh: Kopi Senja Studio"
            />
          </div>

          <SelectWithOther
            label="Bidang Industri Usaha"
            options={
              industriList && industriList.length > 0
                ? industriList
                : INDUSTRI_OPTIONS
            }
            value={umkmData.bidang_industri}
            onChange={(val) =>
              setUmkmData({
                ...umkmData,
                bidang_industri: val,
              })
            }
            placeholder="Pilih Bidang Industri"
            otherPlaceholder="Ketik bidang industri usaha..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <SelectWithOther
            label="Kota / Wilayah Operasional"
            icon={MapPin}
            options={KOTA_OPTIONS}
            value={umkmData.kota}
            onChange={(val) => setUmkmData({ ...umkmData, kota: val })}
            placeholder="Pilih Kota / Wilayah"
            otherPlaceholder="Ketik nama kota/kabupaten..."
            otherLabel="Kota Lainnya (Ketik Manual)"
          />

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-indigo" />
              Nomor Kontak WhatsApp Usaha
            </label>
            <input
              type="tel"
              required
              value={umkmData.no_kontak}
              onChange={(e) =>
                setUmkmData({ ...umkmData, no_kontak: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo font-mono"
              placeholder="0812xxxxxxxx"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-dark-900">
            Alamat Lengkap Usaha
          </label>
          <textarea
            rows={3}
            value={umkmData.alamat}
            onChange={(e) =>
              setUmkmData({ ...umkmData, alamat: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo leading-relaxed"
            placeholder="Alamat jalan, nomor ruko/outlet, kecamatan, dan provinsi..."
          />
        </div>
      </Card>

      {/* Rekening Pengembalian / Pencairan Dana UMKM */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="border-b border-border pb-4">
          <h3 className="text-base font-bold text-dark-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-indigo" />
            Rekening Bank Pengembalian / Pencairan Saldo
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Digunakan jika ada refund proyek atau penarikan saldo aktif usaha
            Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <SelectWithOther
            label="Nama Bank / E-Wallet"
            options={BANK_OPTIONS}
            value={umkmData.nama_bank}
            onChange={(val) => setUmkmData({ ...umkmData, nama_bank: val })}
            placeholder="Pilih Bank / E-Wallet"
            otherPlaceholder="Ketik nama bank/e-wallet..."
            otherLabel="Bank Lainnya (Ketik Manual)"
          />

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark-900">
              Nomor Rekening
            </label>
            <input
              type="text"
              required
              value={umkmData.nomor_rekening}
              onChange={(e) =>
                setUmkmData({
                  ...umkmData,
                  nomor_rekening: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo font-mono font-bold"
              placeholder="Contoh: 1234567890"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark-900">
              Nama Pemilik Rekening
            </label>
            <input
              type="text"
              required
              value={umkmData.nama_pemilik_rekening}
              onChange={(e) =>
                setUmkmData({
                  ...umkmData,
                  nama_pemilik_rekening: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo"
              placeholder="Contoh: Nama Pemilik / Nama Usaha"
            />
          </div>
        </div>
      </Card>

      {/* Tanda Tangan Digital Resmi UMKM untuk Sertifikat Talenta */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="border-b border-border pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-dark-900 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-brand-indigo" />
                Tanda Tangan Digital Resmi UMKM (Otorisasi Sertifikat)
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Tanda tangan ini akan otomatis disematkan pada sertifikat digital
                setiap mahasiswa/talenta yang menyelesaikan proyek Anda.
              </p>
            </div>
            {umkmData.url_ttd && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                TTD Tersimpan & Aktif
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Sisi Kiri: Preview TTD Aktif */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-dark-900 block">
              Pratinjau Tanda Tangan Saat Ini
            </label>
            <div className="w-full h-40 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
              {umkmData.url_ttd ? (
                <>
                  <img
                    src={umkmData.url_ttd}
                    alt="Tanda Tangan Digital"
                    className="max-h-28 max-w-full object-contain filter contrast-125"
                  />
                  <div className="absolute inset-0 bg-dark-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setUmkmData({ ...umkmData, url_ttd: "" })}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus TTD
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-1.5 text-slate-400">
                  <PenTool className="w-8 h-8 mx-auto stroke-1 text-slate-300" />
                  <p className="text-xs font-semibold text-slate-500">
                    Belum ada tanda tangan tersimpan
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    Sertifikat akan menggunakan tanda tangan verifikasi digital
                    otomatis sebelum Anda mengunggah atau menggambar TTD.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Upload Action */}
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:border-brand-indigo bg-white text-xs font-bold text-dark-900 hover:text-brand-indigo cursor-pointer transition-all shadow-xs">
                <UploadCloud className="w-4 h-4 text-brand-indigo" />
                <span>Unggah Foto / Gambar TTD (PNG/JPG)</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setUmkmData({ ...umkmData, url_ttd: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Sisi Kanan: Canvas Signature Pad Langsung */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-dark-900">
                Atau Gambar Tanda Tangan Langsung
              </label>
              <span className="text-[11px] text-muted">
                Gunakan mouse / layar sentuh
              </span>
            </div>

            <SignaturePadCanvas
              onSave={(dataUrl) => {
                setUmkmData({ ...umkmData, url_ttd: dataUrl });
              }}
            />
          </div>
        </div>
      </Card>
    </>
  );
}

function SignaturePadCanvas({ onSave }) {
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [hasDrawn, setHasDrawn] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0F172A";
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
  };

  return (
    <div className="space-y-2">
      <div className="relative rounded-2xl border border-slate-300 bg-white shadow-inner overflow-hidden">
        <canvas
          ref={canvasRef}
          width={360}
          height={160}
          className="w-full h-40 touch-none cursor-crosshair block"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <span className="text-xs font-medium text-slate-300 select-none">
              Tanda tangani di area ini
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleClear}
          disabled={!hasDrawn}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          Bersihkan Kanvas
        </button>

        <button
          type="button"
          onClick={handleApply}
          disabled={!hasDrawn}
          className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <PenTool className="w-3.5 h-3.5" />
          Terapkan TTD Ini
        </button>
      </div>
    </div>
  );
}
