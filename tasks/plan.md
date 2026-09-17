# Implementation Plan: Perbaikan & Peningkatan Fitur Eksisting Makarya

## Overview

Menyempurnakan seluruh fitur utama platform Makarya (Web, Mobile, Backend) agar bebas bug, konsisten, cepat, dan terintegrasi mulus.

## Architecture Decisions

- Mempertahankan arsitektur stateless FastAPI + JWT auth.
- Menggunakan library yang sudah terinstal (`expo-print`, `expo-sharing`, `html2canvas`, `jspdf`, `lucide-react`, `lucide-react-native`).
- Tanpa dependensi baru yang tidak perlu (YAGNI & lazy senior dev mode).

## Task List & Checkpoints

### Phase 1: Mobile Profile, TTD Klien & Sertifikat

- [ ] Task 1.1: Sinkronisasi TTD Klien UMKM di Mobile Profile
- [ ] Task 1.2: Penyempurnaan Modal Sertifikat Mobile & Direct PDF Export

### Checkpoint 1

- [ ] Profil UMKM tersimpan dengan `url_ttd`
- [ ] Sertifikat mobile menampilkan TTD klien dan dapat diekspor

### Phase 2: Workroom, Submissions & Milestone Flow

- [ ] Task 2.1: Interaksi Pengumpulan Tugas, Catatan Revisi & Persetujuan Milestone
- [ ] Task 2.2: Polish Empty State & Responsivitas Workroom Hub

### Checkpoint 2

- [ ] Flow submit karya -> review UMKM -> approve -> escrow release & certificate generation berjalan tanpa hambatan

### Phase 3: Dompet (Wallet), Escrow & Midtrans Resilience

- [ ] Task 3.1: Callback & Deep-link Midtrans Snap di Mobile
- [ ] Task 3.2: Validasi Penarikan Dana & Riwayat Mutasi Dompet

### Checkpoint 3

- [ ] Saldo escrow terkunci dan terlepas sesuai milestone; top up & withdraw aman dari race condition

### Phase 4: Portofolio, Review & Direktori Talenta

- [ ] Task 4.1: Pembersihan Tampilan Rating, Bintang & Kartu Portofolio
- [ ] Task 4.2: Showcase Karya & Pin Sertifikat Terverifikasi di Profil Publik

### Phase 5: Real-time Chat & Notifikasi

- [ ] Task 5.1: WebSocket Reconnection & Unread Badge Counter
- [ ] Task 5.2: Polishing Notifikasi Event Penting

## Risks and Mitigations

| Risk                                         | Impact | Mitigation                                                                         |
| :------------------------------------------- | :----: | :--------------------------------------------------------------------------------- |
| Race condition saat approval milestone ganda |  High  | Backend DB lock dan idempotent transaction di endpoint `/submissions/{id}/approve` |
| Beda rendering PDF antara OS Android & iOS   |  Med   | Menggunakan HTML template print standar melalui `expo-print`                       |
