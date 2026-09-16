# 💳 Panduan Integrasi & Konfigurasi Payment Gateway Midtrans (Makarya)

Sistem pembayaran Makarya telah terintegrasi secara penuh dan otomatis dengan **Midtrans Snap** (Virtual Account, QRIS, GoPay, ShopeePay, dan Kartu Kredit).

Anda hanya perlu menaruh API Key Midtrans ke dalam file environment `.env`.

---

## 🚀 Langkah Cepat Menaruh API Key

### 1. Dapatkan API Key dari Midtrans

1. Buka dan masuk ke **[Midtrans Dashboard](https://dashboard.midtrans.com/)** (atau Sandbox: **[dashboard.sandbox.midtrans.com](https://dashboard.sandbox.midtrans.com/)**).
2. Pastikan Anda berada di mode yang diinginkan (**Environment: Sandbox** untuk uji coba, atau **Production** untuk live).
3. Buka menu **Settings** > **Access Keys**.
4. Salin:
   - **Merchant ID** (contoh: `G123456789`)
   - **Client Key** (contoh: `SB-Mid-client-xxxxxxxxxxxxxxxx` atau `Mid-client-xxxxxxxxxxxxxxxx`)
   - **Server Key** (contoh: `SB-Mid-server-xxxxxxxxxxxxxxxx` atau `Mid-server-xxxxxxxxxxxxxxxx`)

---

### 2. Taruh Key di Backend (`backend/.env`)

Buka file `backend/.env` dan perbarui nilai berikut:

```env
# MIDTRANS PAYMENT GATEWAY
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxx
MIDTRANS_MERCHANT_ID=Gxxxxxxxx
MIDTRANS_IS_PRODUCTION=False
```

> **Catatan:**
>
> - Jika menggunakan mode **Sandbox**, set `MIDTRANS_IS_PRODUCTION=False`.
> - Jika menggunakan mode **Production**, set `MIDTRANS_IS_PRODUCTION=True`.

---

### 3. Taruh Key di Frontend (`web/.env`)

Buka file `web/.env` dan sesuaikan Client Key:

```env
# MIDTRANS FRONTEND CLIENT
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxx
VITE_MIDTRANS_IS_PRODUCTION=false
```

---

## 🔔 Konfigurasi Webhook Notification URL (Midtrans Dashboard)

Agar status pembayaran dari Midtrans langsung diteruskan secara otomatis ke server Makarya:

1. Di Dashboard Midtrans, buka menu **Settings** > **Configuration**.
2. Pada bagian **Payment Notification URL**, masukkan URL endpoint webhook backend:
   ```text
   https://api.domain-anda.com/v1/wallet/webhook/midtrans
   ```
3. Klik **Save Changes**.

> 💡 **Untuk Pengujian Lokal (Development / Localhost):**
> Anda tidak wajib menggunakan tunnel/ngrok karena frontend Makarya sudah dilengkapi tombol / alur sinkronisasi status otomatis (`POST /v1/wallet/sync-status/{order_id}`) yang langsung menanyakan status pembayaran ke server Midtrans begitu pembayaran berhasil di antarmuka Snap.

---

## 🧪 Simulator & Alat Uji Coba Pembayaran (Sandbox)

Saat menguji di mode Sandbox, gunakan simulator resmi Midtrans untuk menyelesaikan pembayaran:

- **Simulator Pembayaran Midtrans**: [https://simulator.sandbox.midtrans.com/](https://simulator.sandbox.midtrans.com/)
  - **BCA Virtual Account Simulator**: Masukkan nomor VA yang muncul di Snap popup untuk disimulasikan lunas.
  - **QRIS / GoPay Simulator**: Scan atau masukkan QR string untuk simulasi sukses.
  - **Kartu Kredit Testing**: Gunakan nomor kartu uji coba dari [Dokumentasi Midtrans](https://docs.midtrans.com/reference/testing-credentials).

---

## 🛡️ Fitur Keamanan & Anti-Fraud yang Terpasang

- **SHA-512 Signature Hash Verification**: Memverifikasi keaslian setiap data webhook yang masuk menggunakan rumus `SHA512(order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY)`.
- **Idempotency Guard**: Mencegah penambahan saldo berulang (_double-credit_) untuk satu transaksi yang sama.
- **Pessimistic Row Lock (`with_for_update`)**: Memastikan konsistensi saldo di database tanpa race conditions.
