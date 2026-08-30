# ✅ TODOLIST MAKARYA — Master Engineering Checklist

**Penyusun:** Darell Rangga Putra | UBSI Kaliabang (Junior Backend Engineer)  
**Tech Lead / Mentor:** Antigravity (Senior Developer)  
**Arsitektur:** Python FastAPI + MySQL (3NF) | React.js (shadcn/ui style) | React Native  
**Repositori:** 1 Single Monorepo (`makarya`)

---

## 🗂️ STATUS FASE

- [x] **Fase 0.1:** Persiapan Lingkungan Lokal & Akun 3rd Party
  - [x] Python 3.12.6, Node v24.12.0, npm 11.5.1, Git, Android Studio & SDK
  - [x] 1 Repository Monorepo: `makarya` (Root `.gitignore` melindungi `.env`, `venv/`, `node_modules/`)
  - [x] Akun 3rd Party: Midtrans Sandbox, Cloudinary, Firebase Console
- [x] **Fase 0.2:** UI/UX Design System Specification (Minimalist Editorial / shadcn/ui style)
- [x] **Fase 1:** Backend Foundation & Database (PostgreSQL + SQLAlchemy + Alembic + Seeder 100% DONE)
- [ ] **Fase 2:** Backend Core & Security Hardening (Auth, Projects, Proposals, Escrow, Idempotency)
- [ ] **Fase 3A:** Web App Development (React + Tailwind + shadcn/ui pattern)
- [ ] **Fase 3B:** Mobile App Development (React Native)
- [ ] **Fase 4:** Integrasi Payment Gateway & Push Notification
- [ ] **Fase 5:** Admin Dashboard & Final Polish
- [ ] **Fase 6:** UAT & Finalisasi Skripsi

---

## 🟡 FASE 1 — BACKEND: FOUNDATION & DATABASE

_Mode: Anda (Junior Dev) menulis kodenya berdasarkan instruksi & arsitektur dari Senior Dev._

### 1.1 Project Initialization & Settings

- [x] Buat virtual environment: `python -m venv venv` dan aktivasi
- [x] Buat file `backend/requirements.txt` (FastAPI, SQLAlchemy, Alembic, PyMySQL, Pydantic, SlowAPI, etc.)
- [x] Install dependencies: `pip install -r requirements.txt`
- [x] Buat file `backend/.env` & `backend/.env.example`
- [x] Buat `backend/app/core/config.py` menggunakan `pydantic-settings` untuk membaca `.env` secara typesafe
- [x] Buat file entry point `backend/main.py` dan verifikasi `http://localhost:8000/docs` (Status: 200 OK)

### 1.2 Database & SQLAlchemy Engine

- [x] Buat database lokal di PostgreSQL: `CREATE DATABASE makarya_db WITH ENCODING = 'UTF8';`
- [x] Buat `backend/app/core/database.py` (Engine, SessionLocal, Base model, Connection Pool)
- [x] Setup Alembic untuk migrasi database: `alembic init alembic`
- [x] Hubungkan `alembic.ini` dan `alembic/env.py` ke SQLAlchemy Base Model & PostgreSQL URI
- [x] Verifikasi koneksi database (Status: Connected to PostgreSQL 18.6)

### 1.3 Database Models (SQLAlchemy ORM - 3NF)

- [x] `app/models/user.py` → Model `User` (UUID, username, email, password_hash, role, is_verified, is_active)
- [x] `app/models/profile.py` → Model `ProfileMhs` & `ProfileUmkm`
- [x] `app/models/master.py` → Model `MasterProdi` & `MasterSkill`
- [x] `app/models/skill.py` → Model `MhsSkill` (Junction Table)
- [x] `app/models/project.py` → Model `Project` (dengan check constraint budget <= 2jt)
- [x] `app/models/proposal.py` → Model `Proposal`
- [x] `app/models/submission.py` → Model `Submission` (dengan check constraint revisi <= 2)
- [x] `app/models/wallet.py` → Model `Wallet` (`saldo_aktif`, `saldo_escrow`) & `LedgerLog` (Immutable)
- [x] `app/models/rating.py` → Model `Rating` (skor 1-5, unique per user per project)
- [x] `app/models/dispute.py` → Model `Dispute`
- [x] `app/models/notification.py` → Model `Notification`
- [x] `app/models/ai_req.py` → Model `AiRequirement`
- [x] Jalankan migrasi pertama: `alembic revision --autogenerate -m "Initial 13 tables schema"`
- [x] Terapkan migrasi ke PostgreSQL: `alembic upgrade head` (15 tabel live)
- [x] Seed data master: `python -m app.seeds` (8 Prodi, 15 Skills terisi)

---

## 🟠 FASE 2 — BACKEND: SECURITY HARDENING & CORE APIS

_Penerapan prinsip /security-and-hardening, OWASP Top 10, dan Design Patterns._

### 2.1 Security Layer & Auth

- [x] `app/core/security.py` → Bcrypt hashing (rounds=12) & JWT Access/Refresh Token Generator
- [x] `app/core/limiter.py` → SlowAPI Rate Limiter (mencegah Brute Force & DoS)
- [x] `app/dependencies.py` → OAuth2 Bearer token parser, `get_current_user`, `require_role("UMKM", "MHS", "ADMIN")`
- [x] `app/schemas/auth.py` → Pydantic schema untuk Register UMKM, Register MHS (validasi regex `.ac.id`), Login, Token
- [x] `app/routers/auth.py` → Endpoint `/auth/register/umkm`, `/auth/register/mahasiswa`, `/auth/login`, `/auth/refresh`, `/auth/me` (Teruji di Swagger 201/200 OK)

### 2.2 Project Management & Resource Ownership

- [x] `app/schemas/project.py` → Form buat & edit proyek (validasi budget max 2jt, deadline di masa depan)
- [x] `app/routers/projects.py`:
  - [x] `POST /projects` (Khusus UMKM terverifikasi)
  - [x] `GET /projects` (Browse & filter: kategori, budget range, keyword, pagination)
  - [x] `GET /projects/my-projects` (Daftar proyek milik UMKM login)
  - [x] `GET /projects/{id}` (Detail proyek + profil UMKM)
  - [x] `PATCH /projects/{id}` (Security: Validasi bahwa yang mengedit adalah pemilik proyek / BOLA check)
  - [x] `DELETE /projects/{id}` (Hanya bisa dihapus jika belum ada proposal berjalan)

### 2.3 Proposal & Selection Module (Escrow Trigger)

- [x] `app/schemas/proposal.py` → Pydantic schema proposal (harga_tawar, cover_letter, estimasi_hari, MhsSummary)
- [x] `app/routers/proposals.py` → Mahasiswa submit proposal (validasi budget max & status project OPEN/BIDDING)
- [x] `app/routers/proposals.py` → UMKM accept proposal:
  - Validasi saldo dompet UMKM cukup
  - Hold saldo ke escrow (`saldo_aktif` -> `saldo_escrow`) dengan Pessimistic Lock (`with_for_update`)
  - Auto-reject pelamar lain & ubah status project -> `IN_PROGRESS`
  - Catat log transaksi di `LedgerLog` (Immutable audit trail)
- [x] `app/routers/proposals.py` → UMKM reject proposal & Mahasiswa view my proposals (Teruji di Swagger 200/201 OK))

### 2.4 Escrow Engine & Financial Security

- [ ] `app/services/escrow_service.py`:
- [x] `app/services/escrow_service.py`:
  - [x] **Pessimistic Locking (`with_for_update`)** saat lock baris wallet agar bebas race condition
  - [x] `hold_escrow()`: Pindahkan `saldo_aktif` UMKM ke `saldo_escrow`
  - [x] `release_escrow()`: Pindahkan `saldo_escrow` UMKM ke `saldo_aktif` Mahasiswa
  - [x] `refund_escrow()`: Kembalikan `saldo_escrow` ke `saldo_aktif` UMKM jika dibatalkan
  - [x] Catat setiap perpindahan ke tabel `ledger_logs` (Append-only / Immutable)

### 2.5 Submission, Review, Revision Counter & Escrow Release

- [x] `app/schemas/submission.py` → Schema kirim berkas hasil kerja, catatan, dan form minta revisi
- [x] `app/routers/submissions.py`:
  - [x] `POST /submissions` (Mahasiswa upload link hasil kerja / status `SUBMITTED`)
  - [x] `GET /submissions/project/{project_id}` (Melihat hasil kerja proyek)
  - [x] `PATCH /submissions/{id}/approve` (UMKM menyetujui hasil kerja ➔ Release Escrow ke Mahasiswa + Project status `DONE`)
  - [x] `PATCH /submissions/{id}/request-revision` (UMKM minta revisi dengan pembatasan ketat Max 2x / anti-eksploitasi mahasiswa) (Teruji 100% OK)

### 2.6 Midtrans Integration & Idempotency Webhook

- [ ] `app/services/midtrans_service.py` → Create VA / QRIS Charge
- [ ] `app/routers/payments.py`:
  - [ ] `POST /payments/topup` → Inisiasi pembayaran
  - [ ] `POST /payments/webhook` → Menerima callback Midtrans
  - [ ] **Idempotency Check:** Cek apakah `order_id` / transaksi sudah pernah tercatat di `ledger_logs` sebelum menambah saldo
  - [ ] **Signature Verification:** Verifikasi hash SHA512 dari Midtrans untuk mencegah spoofing

---

## 🔴 FASE 3A — WEB APP (MAHASISWA & ADMIN)

_Styling: Tailwind CSS + shadcn/ui aesthetic (Monochrome, Pill badges, Crisp borders)._

- [ ] Setup Vite + React 18 + Tailwind CSS + Lucide Icons
- [ ] Setup shadcn/ui components (`Button`, `Card`, `Badge`, `Dialog`, `Table`, `Input`, `DropdownMenu`)
- [ ] Setup Axios Interceptor dengan auto-attach JWT & Refresh Token handling
- [ ] Halaman `LoginPage` & `RegisterPage` (Auto-suggest skill saat memilih prodi)
- [ ] Halaman `DashboardPage` (3 Kartu statistik + Tabel proyek aktif)
- [ ] Halaman `BrowseProjectsPage` (Layout persis referensi: Filter drawer sebelah kiri + Card grid + Category tabs)
- [ ] Halaman `ProjectDetailPage` + Modal `Kirim Proposal`
- [ ] Halaman `ProposalBoardPage` (Status Kanban/Tabel)
- [ ] Halaman `PortfolioPage` (Grid portfolio karya dari proyek selesai)
- [ ] Halaman `WalletPage` (Saldo aktif, escrow, riwayat transaksi ledger, request withdraw)
- [ ] Halaman `AdminDashboardPage` (Verifikasi KTM mahasiswa & Dispute resolution)

---

## 🔵 FASE 3B — MOBILE APP (UMKM)

_Tech: React Native 0.73+ (Tampilan identik dengan mockup mobile)._

- [ ] Init React Native dengan package name: `npx @react-native-community/cli init MakaryaMobile --package-name com.makarya.mobile`
- [ ] Hubungkan `google-services.json` dari Firebase Console ke `mobile/android/app/`
- [ ] Setup React Navigation (Auth Stack + Main Bottom Tabs)
- [ ] Screen `LoginScreen` & `RegisterScreen` (UMKM)
- [ ] Screen `HomeScreen` (Saldo, ringkasan proyek aktif, quick action post proyek)
- [ ] Screen `PostProjectScreen` (Form posting + Smart Pricing Suggester)
- [ ] Screen `ProjectListScreen` & `ProjectDetailScreen` (Lihat pelamar, Terima/Tolak proposal)
- [ ] Screen `WorkspaceReviewScreen` (Live status tracker, preview hasil kerja, tombol Approve / Revisi maks 2x)
- [ ] Screen `WalletScreen` (Info saldo escrow, Top-up VA Midtrans)
- [ ] Setup Firebase Cloud Messaging listener untuk push notifications

---

## 🟣 FASE 4 — TESTING & AUDIT SKRIPSI (UAT)

- [ ] Test 16 Skenario Pengujian UAT (W-01 s/d W-06, M-01 s/d M-05, B-01 s/d B-05)
- [ ] Security Verification:
  - [ ] Test bypass budget limit (> 2jt) -> Blocked
  - [ ] Test race condition saldo wallet -> Blocked by pessimistic lock
  - [ ] Test webhook duplicate -> Handled by Idempotency key
  - [ ] Test SQL Injection & XSS payload -> Sanitized by SQLAlchemy & Pydantic
- [ ] Build Demo APK & Deploy Backend ke Cloud (Railway/VPS)
- [ ] Finalisasi penulisan skripsi BAB 1 s/d BAB 5
