import React from "react";
import { Card } from "../../../components/ui/Card";
import { Building2, MapPin, Phone, CreditCard } from "lucide-react";

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
                  Data usaha Anda akan tampil pada rincian proyek untuk
                  meyakinkan mahasiswa bertalenta.
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

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-900">
                    Bidang Industri Usaha
                  </label>
                  <select
                    value={umkmData.bidang_industri}
                    onChange={(e) =>
                      setUmkmData({
                        ...umkmData,
                        bidang_industri: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo cursor-pointer"
                  >
                    {industriList.map((ind, idx) => (
                      <option key={idx} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-indigo" />
                    Kota / Wilayah Operasional
                  </label>
                  <input
                    type="text"
                    required
                    value={umkmData.kota}
                    onChange={(e) =>
                      setUmkmData({ ...umkmData, kota: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo"
                    placeholder="Contoh: Jakarta Selatan, Bekasi, Depok"
                  />
                </div>

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
                  Digunakan jika ada refund proyek atau penarikan saldo aktif
                  usaha Anda.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-900">
                    Nama Bank
                  </label>
                  <input
                    type="text"
                    required
                    value={umkmData.nama_bank}
                    onChange={(e) =>
                      setUmkmData({ ...umkmData, nama_bank: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo"
                    placeholder="Contoh: Bank Central Asia (BCA)"
                  />
                </div>

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
          </>

  );
}
