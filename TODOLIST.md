# ✅ TODOLIST MAKARYA — Lengkap dari Awal sampai Selesai
**Penyusun:** Darell Rangga Putra | UBSI Kaliabang
**Update terakhir:** Agustus 2026

> **Cara baca:**
> - `[ ]` = belum dikerjakan
> - `[/]` = sedang dikerjakan
> - `[x]` = selesai
>
> Kerjakan **berurutan dari atas ke bawah per fase**.
> Fase 1 & 2 harus selesai dulu sebelum bisa lanjut ke Fase 3+.

---

## 🗂️ URUTAN PENGERJAAN (BACA DULU!)

```
FASE 0  →  Setup & Desain (lakukan SEBELUM nulis kode apapun)
FASE 1  →  Backend Foundation (harus selesai duluan)
FASE 2  →  Core Features Backend
FASE 3  →  Web App & Mobile App (paralel dengan backend fase 2-3)
FASE 4  →  Integrasi Payment & Notifikasi
FASE 5  →  Admin & Polish
FASE 6  →  Testing & Finalisasi Skripsi
```

**Kenapa backend dulu?**
Web dan mobile hanya konsumsi API. Kalau API belum ada, frontend tidak bisa dikembangkan dengan benar.

---

---

# ⚪ FASE 0 — SETUP & DESAIN UI/UX
*Sebelum nulis satu baris kode pun, selesaikan ini semua.*
*Estimasi: 1–2 minggu*

## 0.1 Persiapan Umum
- [ ] Buat akun GitHub, buat 3 repository:
  - [ ] `makarya-backend`
  - [ ] `makarya-web`
  - [ ] `makarya-mobile`
- [ ] Setup `.gitignore` di masing-masing repo (Python, Node, React Native)
- [ ] Buat akun Midtrans Sandbox → catat `Server Key` dan `Client Key`
- [ ] Buat project Firebase → aktifkan Cloud Messaging (FCM) → download `google-services.json`
- [ ] Buat akun Cloudinary → catat `Cloud Name`, `API Key`, `API Secret`
- [ ] Install software yang dibutuhkan:
  - [ ] Python 3.11+
  - [ ] Node.js 20+ dan npm
  - [ ] Android Studio + Android SDK (untuk mobile)
  - [ ] VS Code + ekstensi: Python, ESLint, Prettier, Tailwind IntelliSense

## 0.2 Desain UI/UX di Figma
- [ ] Buat file Figma baru: `Makarya - UI Design`
- [ ] Definisikan Design System:
  - [ ] Warna utama (primary, secondary, danger, success, warning)
  - [ ] Tipografi (font family, ukuran heading, body, caption)
  - [ ] Spacing & border radius
- [ ] Wireframe halaman Web App:
  - [ ] Login & Register Mahasiswa
  - [ ] Dashboard Mahasiswa
  - [ ] Browse Proyek
  - [ ] Detail Proyek
  - [ ] Proposal Board
  - [ ] Portfolio Builder
  - [ ] Wallet
  - [ ] Admin Dashboard
  - [ ] Admin Verifikasi
- [ ] Wireframe halaman Mobile App:
  - [ ] Login & Register UMKM
  - [ ] Home Screen
  - [ ] Post Proyek
  - [ ] Project List
  - [ ] Project Detail + Proposal List
  - [ ] Live Tracker
  - [ ] Wallet + Top-up

---

---

# 🟡 FASE 1 — BACKEND: FOUNDATION
*Kerjakan ini PERTAMA sebelum apapun.*
*Estimasi: 2–3 minggu*

## 1.1 Setup Project FastAPI
- [ ] Buat virtual environment Python: `python -m venv venv`
- [ ] Install dependencies awal: `fastapi uvicorn sqlalchemy alembic pymysql pydantic python-jose passlib python-multipart`
- [ ] Buat file `main.py` dengan app FastAPI dasar
- [ ] Buat struktur folder sesuai `BACKEND_SPEC.md`
- [ ] Setup file `.env` dengan semua variabel konfigurasi
- [ ] Buat `app/core/config.py` untuk load `.env` via Pydantic Settings
- [ ] Pastikan server jalan: `uvicorn main:app --reload` → buka `http://localhost:8000/docs`

## 1.2 Setup Database MySQL
- [ ] Install MySQL 8.0 di lokal atau pakai Docker
- [ ] Buat database: `CREATE DATABASE makarya_db;`
- [ ] Buat file `app/core/database.py` — SQLAlchemy engine + SessionLocal + Base
- [ ] Setup Alembic: `alembic init alembic`
- [ ] Edit `alembic.ini` → arahkan ke database URL dari `.env`

## 1.3 Buat Semua Models (ORM)
- [ ] `app/models/user.py` → tabel `users`
- [ ] `app/models/profile.py` → tabel `profiles_mhs` dan `profiles_umkm`
- [ ] `app/models/master.py` → tabel `master_prodi` dan `master_skills`
- [ ] `app/models/skill.py` → tabel `mhs_skills`
- [ ] `app/models/project.py` → tabel `projects`
- [ ] `app/models/ai_req.py` → tabel `ai_requirements`
- [ ] `app/models/proposal.py` → tabel `proposals`
- [ ] `app/models/submission.py` → tabel `submissions`
- [ ] `app/models/wallet.py` → tabel `wallets` dan `ledger_logs`
- [ ] `app/models/rating.py` → tabel `ratings`
- [ ] `app/models/dispute.py` → tabel `disputes`
- [ ] `app/models/notification.py` → tabel `notifications`

## 1.4 Database Migration
- [ ] Buat migration awal: `alembic revision --autogenerate -m "initial tables"`
- [ ] Jalankan migration: `alembic upgrade head`
- [ ] Verifikasi semua tabel terbuat di MySQL (cek via MySQL Workbench atau phpMyAdmin)
- [ ] Seed data master: isi tabel `master_prodi` dan `master_skills` dengan data awal

## 1.5 Autentikasi — JWT + Bcrypt
- [ ] Buat `app/core/security.py`:
  - [ ] Fungsi `hash_password(plain)` → Bcrypt hash
  - [ ] Fungsi `verify_password(plain, hashed)` → Boolean
  - [ ] Fungsi `create_access_token(user_id, role)` → JWT string
  - [ ] Fungsi `create_refresh_token(user_id)` → JWT string
  - [ ] Fungsi `verify_token(token)` → user_id atau None
- [ ] Buat `app/dependencies.py`:
  - [ ] `get_db()` — dependency untuk database session
  - [ ] `get_current_user()` — dependency baca JWT dari header
  - [ ] `require_role(*roles)` — factory untuk role-based guard
- [ ] Buat Pydantic schemas untuk auth di `app/schemas/auth.py`
- [ ] Buat router `app/routers/auth.py`:
  - [ ] `POST /auth/register/umkm`
  - [ ] `POST /auth/register/mahasiswa` (validasi email `.ac.id`)
  - [ ] `POST /auth/login` (return access + refresh token)
  - [ ] `POST /auth/refresh`
- [ ] Test semua endpoint auth di Postman atau Swagger `/docs`

---

---

# 🟠 FASE 2 — BACKEND: CORE FEATURES
*Kerjakan setelah Fase 1 selesai 100%.*
*Estimasi: 3–4 minggu*

## 2.1 Manajemen Proyek
- [ ] Buat `app/schemas/project.py`:
  - [ ] `ProjectCreate` — dengan validator budget ≤ Rp 2.000.000
  - [ ] `ProjectResponse`
  - [ ] `ProjectUpdate`
- [ ] Buat `app/routers/projects.py`:
  - [ ] `POST /projects` — buat proyek baru (UMKM only)
  - [ ] `GET /projects` — list proyek OPEN (dengan filter kategori, budget, deadline)
  - [ ] `GET /projects/{id}` — detail proyek
  - [ ] `PATCH /projects/{id}` — edit proyek (hanya jika belum ada proposal)
  - [ ] `DELETE /projects/{id}` — hapus proyek (hanya jika belum ada proposal)
- [ ] Test semua endpoint proyek di Postman

## 2.2 Proposal
- [ ] Buat `app/schemas/proposal.py`
- [ ] Buat `app/routers/proposals.py`:
  - [ ] `POST /proposals` — kirim proposal (MHS only)
  - [ ] `GET /proposals` — list proposal milik user yang login
  - [ ] `GET /proposals/{id}` — detail proposal
  - [ ] `PATCH /proposals/{id}/accept` — UMKM terima proposal → ubah status project
  - [ ] `PATCH /proposals/{id}/reject` — UMKM tolak proposal
  - [ ] `PATCH /proposals/{id}/withdraw` — MHS batalkan proposal
- [ ] Test semua endpoint proposal

## 2.3 Submission (Pengiriman Hasil Kerja)
- [ ] Setup Cloudinary SDK di backend
- [ ] Buat `app/routers/submissions.py`:
  - [ ] `POST /submissions` — upload hasil kerja (MHS only) → upload file ke Cloudinary
  - [ ] `GET /submissions/{id}` — detail submission
  - [ ] `PATCH /submissions/{id}/approve` — UMKM setujui hasil
  - [ ] `PATCH /submissions/{id}/revise` — UMKM minta revisi dengan validasi maks 2x
- [ ] Test semua endpoint submission

## 2.4 Rating & Review
- [ ] Buat `app/routers/ratings.py`:
  - [ ] `POST /ratings` — beri rating (UMKM ke MHS, setelah proyek DONE)
  - [ ] Validasi: hanya satu rating per proyek per user
  - [ ] Auto-update `profiles_mhs.rating_avg` setelah rating baru dibuat
- [ ] Test endpoint rating

## 2.5 Profil
- [ ] Buat `app/routers/profiles.py`:
  - [ ] `GET /profiles/me` — lihat profil sendiri
  - [ ] `PATCH /profiles/me` — edit profil
  - [ ] `GET /profiles/mhs/{id}` — lihat profil publik mahasiswa (untuk UMKM)
  - [ ] `POST /profiles/me/skills` — mahasiswa tambah skill
  - [ ] `DELETE /profiles/me/skills/{skill_id}` — hapus skill

## 2.6 Notifikasi
- [ ] Install Firebase Admin SDK: `pip install firebase-admin`
- [ ] Buat `app/services/notification_service.py`:
  - [ ] Fungsi `send_push(user_id, title, body, data)` → kirim FCM ke device token user
- [ ] Tambahkan trigger notifikasi di:
  - [ ] `accept_proposal` → notif ke MHS
  - [ ] `reject_proposal` → notif ke MHS
  - [ ] `create_submission` → notif ke UMKM
  - [ ] `approve_submission` → notif ke MHS
  - [ ] `request_revision` → notif ke MHS

---

---

# 🔴 FASE 3A — WEB APP: SETUP & AUTH
*Bisa dimulai paralel saat backend Fase 1 sudah selesai.*
*Estimasi: 2 minggu*

## 3A.1 Setup Project React
- [ ] Buat project Vite: `npm create vite@latest makarya-web -- --template react`
- [ ] Install dependencies: `npm install react-router-dom axios zustand @tanstack/react-query react-hook-form zod`
- [ ] Install Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`
- [ ] Setup `tailwind.config.js` — definisikan warna brand Makarya
- [ ] Buat struktur folder sesuai `WEB_SPEC.md`
- [ ] Buat file `.env` → `VITE_API_BASE_URL=http://localhost:8000/v1`
- [ ] Buat `src/api/axiosInstance.js` dengan JWT interceptor
- [ ] Buat `src/store/authStore.js` dengan Zustand (simpan token, user data)

## 3A.2 Halaman Auth Web
- [ ] Buat `LoginPage.jsx` — form email + password, call `POST /auth/login`
- [ ] Buat `RegisterPage.jsx` — validasi email `.ac.id`, dropdown prodi, auto-suggest skill
- [ ] Buat `ProtectedRoute.jsx` — redirect ke login jika belum auth
- [ ] Setup routing di `App.jsx` — public routes vs protected routes
- [ ] Test: login berhasil → token tersimpan → redirect ke dashboard

## 3A.3 Halaman Mahasiswa — Core
- [ ] Buat `DashboardPage.jsx` — summary cards (proyek aktif, rating, penghasilan)
- [ ] Buat `BrowseProjectsPage.jsx`:
  - [ ] Fetch `GET /projects` dengan filter
  - [ ] Komponen `ProjectCard.jsx`
  - [ ] Filter bar: kategori, budget range
- [ ] Buat `ProjectDetailPage.jsx`:
  - [ ] Tampilkan info proyek lengkap
  - [ ] Form kirim proposal (modal/drawer): harga, cover letter, estimasi hari
  - [ ] Call `POST /proposals`
- [ ] Buat `ProposalBoardPage.jsx`:
  - [ ] Fetch `GET /proposals` milik user
  - [ ] Tampilkan per kolom status
  - [ ] Jika status ACCEPTED: tampilkan tombol upload hasil kerja
- [ ] Buat `PortfolioPage.jsx` — filter proyek DONE, tampilkan sebagai grid
- [ ] Buat `WalletPage.jsx` — saldo, riwayat transaksi, form request withdraw

## 3A.4 Halaman Admin Web
- [ ] Buat `AdminDashboardPage.jsx` — statistik platform
- [ ] Buat `VerificationPage.jsx` — list akun mahasiswa pending, tombol verifikasi
- [ ] Buat `DisputePage.jsx` — list sengketa, form resolusi

---

---

# 🔵 FASE 3B — MOBILE APP: SETUP & AUTH
*Bisa dimulai paralel saat backend Fase 1 sudah selesai.*
*Estimasi: 2 minggu*

## 3B.1 Setup Project React Native
- [ ] Buat project: `npx react-native init MakaryaMobile`
- [ ] Install dependencies:
  ```
  npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
  npm install react-native-paper axios zustand @react-native-async-storage/async-storage
  npm install react-hook-form @react-native-firebase/app @react-native-firebase/messaging
  ```
- [ ] Install native deps: `npx react-native-asset` dan pod install (iOS)
- [ ] Taruh `google-services.json` di folder `android/app/`
- [ ] Buat struktur folder sesuai `MOBILE_SPEC.md`
- [ ] Buat `src/api/axiosInstance.js` — base URL → `10.0.2.2:8000` (Android emulator)
- [ ] Buat `src/store/authStore.js` — simpan token di `AsyncStorage`

## 3B.2 Navigasi & Auth Mobile
- [ ] Buat `AuthStack.jsx` — stack navigator untuk Login & Register
- [ ] Buat `MainTabs.jsx` — bottom tab navigator 5 tab
- [ ] Buat `AppNavigator.jsx` — cek token: Auth stack vs Main tabs
- [ ] Buat `LoginScreen.jsx` — form login UMKM
- [ ] Buat `RegisterScreen.jsx` — form register UMKM
- [ ] Test: login → masuk MainTabs, logout → kembali ke AuthStack

## 3B.3 Screens Mobile — Core
- [ ] Buat `HomeScreen.jsx` — greeting, summary cards, shortcut
- [ ] Buat `PostProjectScreen.jsx`:
  - [ ] Form: judul, deskripsi, kategori, budget, deadline
  - [ ] Validasi budget ≤ Rp 2.000.000
  - [ ] Komponen `PricingSuggester` — tampilkan warning jika budget rendah
  - [ ] Call `POST /projects`
- [ ] Buat `ProjectListScreen.jsx` — list proyek milik UMKM, filter by status
- [ ] Buat `ProjectDetailScreen.jsx`:
  - [ ] Tampilkan daftar proposal → tombol Terima/Tolak
  - [ ] Tampilkan submission → tombol Approve / Minta Revisi
  - [ ] Komponen `ProjectStatusBar` — progress bar visual
  - [ ] Counter revisi: `2/2` → tombol disabled
- [ ] Buat `TrackerScreen.jsx` — list semua proyek aktif + timeline status
- [ ] Buat `WalletScreen.jsx` — saldo aktif, saldo escrow, riwayat transaksi

---

---

# 🟣 FASE 4 — INTEGRASI PAYMENT & NOTIFIKASI
*Kerjakan setelah Fase 2 dan sebagian Fase 3 selesai.*
*Estimasi: 2 minggu*

## 4.1 Midtrans — Backend
- [ ] Install: `pip install midtransclient`
- [ ] Buat `app/services/midtrans_service.py`:
  - [ ] Fungsi `create_va_charge(order_id, amount, user)` → return VA number
  - [ ] Fungsi `verify_webhook_signature(payload)` → validasi signature Midtrans
- [ ] Buat `app/routers/payments.py`:
  - [ ] `POST /payments/topup` — inisiasi pembayaran, return VA/QRIS info
  - [ ] `POST /payments/webhook` — terima notif dari Midtrans, **idempotency check!**
    - Setelah settlement → update `saldo_aktif` UMKM + INSERT ledger log
- [ ] Buat `app/services/escrow_service.py`:
  - [ ] `hold_escrow(db, umkm_id, nominal, project_id)` → pindah saldo_aktif → saldo_escrow
  - [ ] `release_escrow(db, umkm_id, mhs_id, nominal, project_id)` → release ke MHS
  - [ ] `refund_escrow(db, umkm_id, nominal, project_id)` → kembalikan ke UMKM
- [ ] Hubungkan `hold_escrow` ke `accept_proposal`
- [ ] Hubungkan `release_escrow` ke `approve_submission`
- [ ] Test full flow escrow di Postman + Midtrans Sandbox

## 4.2 Midtrans — Mobile (Top-up)
- [ ] Buat `WalletScreen` → tombol "Top-up" → input nominal
- [ ] Call `POST /payments/topup` → dapat VA number
- [ ] Tampilkan VA number + instruksi transfer ke user
- [ ] Listener `messaging().onMessage()` → tampilkan toast saldo bertambah

## 4.3 Push Notification — Mobile
- [ ] Setup Firebase di React Native sesuai dokumentasi `@react-native-firebase`
- [ ] Minta permission notifikasi saat app pertama dibuka
- [ ] Simpan FCM token device ke backend (buat field `fcm_token` di tabel `users`)
- [ ] Handle notifikasi foreground → tampilkan toast
- [ ] Handle notifikasi background → navigasi ke halaman relevan saat diklik

## 4.4 Push Notification — Web
- [ ] Setup Firebase di React.js (Firebase JS SDK)
- [ ] Minta permission notifikasi browser
- [ ] Handle notifikasi saat web terbuka → toast notification
- [ ] Test: UMKM terima proposal → mahasiswa dapat notif

---

---

# 🟤 FASE 5 — ADMIN, POLISH & FITUR TAMBAHAN
*Estimasi: 1–2 minggu*

## 5.1 Admin — Backend
- [ ] Buat `app/routers/admin.py`:
  - [ ] `GET /admin/accounts` — list akun pending verifikasi
  - [ ] `PATCH /admin/accounts/{id}/verify` — verifikasi akun
  - [ ] `PATCH /admin/accounts/{id}/suspend` — suspend akun
  - [ ] `GET /admin/disputes` — list sengketa
  - [ ] `PATCH /admin/disputes/{id}/resolve` — selesaikan sengketa
  - [ ] `GET /admin/stats` — statistik platform (total user, proyek, transaksi)
- [ ] Semua endpoint admin wajib di-guard dengan `require_role("ADMIN")`

## 5.2 Withdraw — Backend
- [ ] Buat `app/routers/withdrawals.py`:
  - [ ] `POST /withdrawals` — MHS request withdraw (simpan ke tabel baru atau flag di ledger)
  - [ ] `GET /withdrawals` — admin lihat semua request withdraw pending
  - [ ] `PATCH /withdrawals/{id}/process` — admin tandai sudah diproses

## 5.3 Smart Pricing (Mobile)
- [ ] Buat mapping harga wajar per kategori di backend (bisa hardcode sebagai config)
- [ ] `GET /master/pricing-guide` → return range harga per kategori
- [ ] Mobile: tampilkan warning jika input budget di bawah range minimum kategori yang dipilih

## 5.4 Prodi-to-Skill Auto Suggest (Web)
- [ ] Buat mapping prodi → daftar skill di backend
- [ ] `GET /master/prodi/{id}/skills` → return daftar skill rekomendasi
- [ ] Web: setelah pilih prodi saat registrasi, auto-centang skill rekomendasi

## 5.5 Polish UI
- [ ] Web: tambahkan loading state (skeleton) saat fetch data
- [ ] Web: tambahkan empty state jika data kosong (misal: belum ada proposal)
- [ ] Web: tampilkan error message yang user-friendly
- [ ] Mobile: tambahkan pull-to-refresh di semua list screen
- [ ] Mobile: tambahkan loading indicator saat submit form
- [ ] Mobile: pastikan keyboard tidak menutupi form input (KeyboardAvoidingView)

---

---

# 🟢 FASE 6 — TESTING, BUG FIX & FINALISASI SKRIPSI
*Estimasi: 2–3 minggu*

## 6.1 Testing Backend
- [ ] Jalankan semua skenario dari `UAT_PLAN.md` (B-01 sampai B-05)
- [ ] Test B-01: POST project budget > 2jt → 422
- [ ] Test B-02: Request tanpa token → 401
- [ ] Test B-03: Revisi ke-3 → 400
- [ ] Test B-04: Webhook duplikat → tidak double credit
- [ ] Test B-05: MHS akses endpoint admin → 403
- [ ] Catat hasilnya di template laporan UAT

## 6.2 Testing Web App
- [ ] Jalankan skenario W-01 sampai W-06
- [ ] Test W-01: Email non .ac.id → error
- [ ] Test W-02: Pilih prodi → muncul skill suggest
- [ ] Test W-03: Revisi ke-3 → tombol disabled
- [ ] Test W-04: Filter proyek → hasil sesuai filter
- [ ] Test W-05: Submit proposal tanpa cover letter → validasi
- [ ] Test W-06: Portfolio hanya tampil proyek DONE
- [ ] Catat hasilnya di template laporan UAT

## 6.3 Testing Mobile App
- [ ] Jalankan skenario M-01 sampai M-05
- [ ] Test M-01: Budget rendah → smart pricing warning
- [ ] Test M-02: Budget > 2jt → error
- [ ] Test M-03: Terima proposal → cek escrow hold
- [ ] Test M-04: Status tracker update otomatis
- [ ] Test M-05: Rating dua kali → error
- [ ] Catat hasilnya di template laporan UAT

## 6.4 Bug Fixing
- [ ] Perbaiki semua skenario yang status "Fail" dari UAT
- [ ] Re-test setelah perbaikan
- [ ] Pastikan semua 16 skenario status "Pass"

## 6.5 Dokumentasi Teknis
- [ ] FastAPI Swagger (`/docs`) sudah lengkap dan terdokumentasi
- [ ] README masing-masing repo sudah ada cara menjalankan
- [ ] Semua file `.env` sudah ada contohnya di `.env.example`
- [ ] Screenshot semua halaman aplikasi untuk lampiran skripsi

## 6.6 Build & Persiapan Demo Sidang
- [ ] Backend: deploy ke Railway (atau jalankan lokal saat sidang)
- [ ] Web: build production `npm run build` → deploy ke Vercel
- [ ] Mobile: build APK debug untuk demo `npx react-native build-android`
- [ ] Test full flow sekali lagi dari perangkat nyata:
  - [ ] UMKM register → posting proyek
  - [ ] Mahasiswa register → kirim proposal
  - [ ] UMKM terima → bayar → escrow hold
  - [ ] Mahasiswa upload hasil → UMKM approve → dana cair
- [ ] Siapkan akun demo: 1 akun UMKM, 1 akun Mahasiswa, 1 akun Admin

## 6.7 Penulisan Skripsi
- [ ] BAB 1: Pendahuluan (latar belakang, rumusan masalah, tujuan, batasan)
- [ ] BAB 2: Tinjauan Pustaka (teori platform digital, micro-freelancing, UMKM, escrow, dll)
- [ ] BAB 3: Analisis & Perancangan (gunakan dokumen di `docs/`: PRD, ERD, Use Case, Sequence)
- [ ] BAB 4: Implementasi & Pengujian (screenshot implementasi + hasil UAT)
- [ ] BAB 5: Penutup (kesimpulan + saran pengembangan → tulis AI/ML sebagai future work)
- [ ] Daftar Pustaka
- [ ] Lampiran: Kode program, kuesioner UAT (jika ada), dokumentasi API

---

## 📊 Rekap Estimasi Waktu

| Fase | Fokus | Estimasi | Paralel? |
|------|-------|----------|----------|
| Fase 0 | Setup & Figma | 1–2 minggu | — |
| Fase 1 | Backend Foundation | 2–3 minggu | Tidak |
| Fase 2 | Backend Core Features | 3–4 minggu | Tidak |
| Fase 3A | Web App | 2–3 minggu | **Ya** (paralel Fase 2) |
| Fase 3B | Mobile App | 2–3 minggu | **Ya** (paralel Fase 2) |
| Fase 4 | Payment & Notifikasi | 2 minggu | Tidak |
| Fase 5 | Admin, Polish, Fitur Tambahan | 1–2 minggu | Tidak |
| Fase 6 | Testing, Bug Fix, Skripsi | 2–3 minggu | Tidak |
| **TOTAL** | | **~5–6 bulan** | |

---

## 🚨 Aturan Emas Selama Development

1. **Commit kecil, sering** — setiap fitur selesai langsung commit ke GitHub
2. **Backend dulu** — jangan mulai nulis kode frontend sampai endpoint API sudah bisa dipanggil
3. **Test di Postman dulu** — setiap endpoint backend baru, test manual sebelum connect ke frontend
4. **Jangan scope creep** — kalau muncul ide fitur baru, catat dulu, jangan langsung kerjakan
5. **AI = future work** — jangan masukkan ke scope utama, cukup tulis di BAB 5 sebagai saran
