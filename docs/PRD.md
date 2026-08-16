# 📄 PRD — Product Requirements Document
**Makarya: Platform Micro-Freelancing Mahasiswa × UMKM**
**Versi:** 1.0 | **Status:** Draft

---

## 1. Executive Summary & Product Vision

Makarya adalah platform *micro-freelancing* yang dirancang eksklusif untuk menjembatani **mahasiswa aktif** dengan **UMKM lokal** di area Jabodetabek. Platform ini menyelesaikan dua masalah utama secara bersamaan:

- UMKM kesulitan mendeskripsikan kebutuhan teknis dan tidak memiliki anggaran untuk agensi profesional
- Mahasiswa memiliki skill relevan namun tidak memiliki channel yang aman, terstruktur, dan terpercaya untuk monetisasi kemampuan mereka

---

## 2. Problem Statement

| Pihak | Masalah |
|-------|---------|
| **UMKM** | Tidak tahu cara mendeskripsikan kebutuhan teknis secara spesifik |
| **UMKM** | Anggaran terbatas, tidak mampu bayar agensi konvensional |
| **Mahasiswa** | Tidak ada platform mikro yang aman dengan sistem pembayaran terjamin |
| **Mahasiswa** | Sulit membangun portofolio terverifikasi di awal karir |
| **Keduanya** | Tidak ada jaminan keamanan transaksi (rawan penipuan) |

---

## 3. Scope & Batasan Sistem

| Aspek | Aturan |
|-------|--------|
| Batas nilai proyek | Maksimal **Rp 2.000.000** per proyek |
| Kategori layanan | Desain Grafis, UI/UX, Pemrograman, Video/Foto, Copywriting, Administrasi Data |
| Syarat mahasiswa | Email domain `.ac.id` ATAU upload KTM aktif |
| Batas revisi | Maksimal **2x** revisi (hardcoded di backend) |
| Wilayah studi kasus | Jabodetabek |
| Escrow | Logika escrow dibangun di backend, payment gateway Midtrans |
| Platform | Web App + Mobile App |

---

## 4. Aktor Sistem

| Aktor | Deskripsi | Platform Akses |
|-------|-----------|----------------|
| **UMKM (Klien)** | Pemilik usaha mikro-kecil yang membutuhkan jasa digital | Mobile App |
| **Mahasiswa (Freelancer)** | Mahasiswa aktif ber-email `.ac.id` yang menawarkan jasa | Web App |
| **Admin** | Pengelola platform: pantau transaksi, verifikasi, mediasi sengketa | Web App |
| **Sistem AI** *(opsional)* | Microservice Python yang auto-tag skill dari deskripsi proyek | Internal |
| **Midtrans** | Payment gateway eksternal untuk proses pembayaran masuk & keluar | Eksternal |
| **Firebase FCM** | Layanan push notification | Eksternal |

---

## 5. Spesifikasi Fitur Lengkap

### 🟦 MODUL 1 — AUTENTIKASI & PROFIL

| Kode | Fitur | Aktor | Platform | Prioritas |
|------|-------|-------|----------|-----------|
| AUTH-01 | Registrasi UMKM (nama usaha, bidang, kontak, foto) | UMKM | Mobile | P1 |
| AUTH-02 | Registrasi Mahasiswa dengan verifikasi email `.ac.id` | Mahasiswa | Web | P1 |
| AUTH-03 | Login dengan JWT (access + refresh token) | Semua | Web + Mobile | P1 |
| AUTH-04 | Upload KTM sebagai alternatif verifikasi | Mahasiswa | Web | P2 |
| AUTH-05 | Edit profil UMKM | UMKM | Mobile | P2 |
| AUTH-06 | Edit profil Mahasiswa (prodi, skills, bio, portfolio URL) | Mahasiswa | Web | P2 |
| AUTH-07 | Admin verifikasi manual akun mahasiswa | Admin | Web | P2 |
| AUTH-08 | Prodi-to-Skill auto-suggest saat registrasi | Mahasiswa | Web | P3 |

### 🟩 MODUL 2 — MANAJEMEN PROYEK (UMKM)

| Kode | Fitur | Aktor | Platform | Prioritas |
|------|-------|-------|----------|-----------|
| PROJ-01 | Posting proyek baru (judul, deskripsi, kategori, budget, deadline) | UMKM | Mobile | P1 |
| PROJ-02 | Validasi budget ≤ Rp 2.000.000 | Sistem | Backend | P1 |
| PROJ-03 | Smart Pricing Suggester — estimasi harga wajar otomatis | UMKM | Mobile | P2 |
| PROJ-04 | AI Tag Suggestion — auto-tag skill dari deskripsi *(opsional)* | AI | Mobile | P3 |
| PROJ-05 | Edit/hapus proyek (sebelum ada proposal) | UMKM | Mobile | P2 |
| PROJ-06 | Live Project Tracker — status visual (Bidding→In Progress→Review→Done) | UMKM | Mobile | P1 |
| PROJ-07 | Lihat & bandingkan proposal masuk | UMKM | Mobile | P1 |
| PROJ-08 | Terima / tolak proposal | UMKM | Mobile | P1 |
| PROJ-09 | Review hasil kerja & approve submission | UMKM | Mobile | P1 |
| PROJ-10 | Request revisi (maks 2x, tombol nonaktif otomatis setelah batas) | UMKM | Mobile | P1 |
| PROJ-11 | Beri rating & review ke mahasiswa setelah proyek selesai | UMKM | Mobile | P2 |

### 🟨 MODUL 3 — WORKSPACE MAHASISWA

| Kode | Fitur | Aktor | Platform | Prioritas |
|------|-------|-------|----------|-----------|
| WORK-01 | Browse & filter proyek terbuka (by kategori, budget, deadline) | Mahasiswa | Web | P1 |
| WORK-02 | Kirim proposal (harga tawar, cover letter, estimasi waktu) | Mahasiswa | Web | P1 |
| WORK-03 | Proposal Board — kelola semua lamaran yang dikirim | Mahasiswa | Web | P1 |
| WORK-04 | Upload hasil kerja / file deliverable (final + source file) | Mahasiswa | Web | P1 |
| WORK-05 | Portfolio Builder — tampilkan karya dari proyek selesai | Mahasiswa | Web | P2 |
| WORK-06 | Notifikasi real-time saat proposal diterima/ditolak | Mahasiswa | Web | P2 |
| WORK-07 | Riwayat proyek (semua status) | Mahasiswa | Web | P2 |
| WORK-08 | Lihat rating & review dari UMKM | Mahasiswa | Web | P2 |

### 🟥 MODUL 4 — SISTEM KEUANGAN & ESCROW

| Kode | Fitur | Aktor | Platform | Prioritas |
|------|-------|-------|----------|-----------|
| FIN-01 | UMKM top-up via Midtrans (Virtual Account / QRIS) | UMKM | Mobile | P1 |
| FIN-02 | Dana otomatis hold ke `saldo_escrow` saat proposal diterima | Sistem | Backend | P1 |
| FIN-03 | Dana release ke `saldo_aktif` mahasiswa saat UMKM approve hasil | Sistem | Backend | P1 |
| FIN-04 | Mahasiswa request withdraw ke rekening bank (manual via admin) | Mahasiswa | Web | P2 |
| FIN-05 | Admin proses withdrawal | Admin | Web | P2 |
| FIN-06 | Ledger log semua transaksi (immutable, audit trail) | Sistem | Backend | P1 |
| FIN-07 | Refund ke wallet UMKM jika proyek dibatalkan sebelum dikerjakan | Sistem | Backend | P2 |

### ⬛ MODUL 5 — ADMIN DASHBOARD

| Kode | Fitur | Aktor | Platform | Prioritas |
|------|-------|-------|----------|-----------|
| ADMIN-01 | Pantau semua proyek aktif & historis | Admin | Web | P1 |
| ADMIN-02 | Verifikasi akun mahasiswa (KTM manual) | Admin | Web | P1 |
| ADMIN-03 | Dispute resolution — mediasi sengketa proyek | Admin | Web | P2 |
| ADMIN-04 | Kelola kategori layanan & master skill | Admin | Web | P2 |
| ADMIN-05 | Laporan keuangan escrow & total transaksi | Admin | Web | P2 |
| ADMIN-06 | Suspend/ban akun yang melanggar aturan | Admin | Web | P2 |

---

## 6. Non-Functional Requirements

| Aspek | Kebutuhan |
|-------|-----------|
| **Keamanan** | Password di-hash dengan Bcrypt, semua endpoint butuh JWT |
| **Validasi** | Budget max Rp 2jt dan batas revisi 2x divalidasi di backend, bukan hanya frontend |
| **Reliabilitas** | Webhook Midtrans harus idempotent (transaksi yang sama tidak diproses dua kali) |
| **Skalabilitas** | Arsitektur REST API stateless — bisa horizontal scale |
| **Dokumentasi API** | Swagger/OpenAPI otomatis dari FastAPI (`/docs`) |
