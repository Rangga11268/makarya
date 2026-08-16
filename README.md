# 🚀 Makarya — Platform Micro-Freelancing Mahasiswa × UMKM

> Platform digital yang menghubungkan mahasiswa aktif dengan UMKM lokal
> untuk kolaborasi proyek digital skala mikro secara aman dan terstruktur.

**Penyusun:** Darell Rangga Putra
**Program Studi:** Sistem Informasi S1 — UBSI Kaliabang, Bekasi Utara
**Semester:** 5
**Target:** Skripsi / MVP

---

## 📁 Struktur Dokumen

```
makarya/
├── README.md                    ← Dokumen ini
├── docs/
│   ├── PRD.md                   ← Product Requirements Document
│   ├── ARSITEKTUR.md            ← Arsitektur Sistem & Tech Stack
│   ├── ERD.md                   ← Entity Relationship Diagram
│   ├── USE_CASE.md              ← Use Case Diagram & Deskripsi
│   ├── ALUR_PROSES.md           ← Sequence Diagram alur utama
│   └── UAT_PLAN.md              ← User Acceptance Testing Plan
├── backend/
│   └── BACKEND_SPEC.md          ← Spesifikasi Backend FastAPI + MySQL
├── web/
│   └── WEB_SPEC.md              ← Spesifikasi Web App React.js
└── mobile/
    └── MOBILE_SPEC.md           ← Spesifikasi Mobile App React Native
```

---

## 🎯 Ringkasan Proyek

| Aspek | Detail |
|-------|--------|
| **Platform** | Web App (React.js) + Mobile App (React Native) |
| **Backend** | Python FastAPI + MySQL |
| **Payment** | Midtrans (VA, QRIS, Escrow logic) |
| **Notifikasi** | Firebase Cloud Messaging |
| **AI (opsional)** | HuggingFace Transformers — microservice terpisah |
| **Target pengguna** | Mahasiswa aktif + Pemilik UMKM lokal Jabodetabek |
| **Batas transaksi** | Maks Rp 2.000.000 per proyek |
| **Batas revisi** | Maks 2x per proyek |

---

## 🔗 Quick Links

- [Product Requirements Document](docs/PRD.md)
- [Arsitektur Sistem](docs/ARSITEKTUR.md)
- [ERD Database](docs/ERD.md)
- [Use Case Diagram](docs/USE_CASE.md)
- [Alur Proses (Sequence)](docs/ALUR_PROSES.md)
- [UAT Plan](docs/UAT_PLAN.md)
- [Backend Spec](backend/BACKEND_SPEC.md)
- [Web App Spec](web/WEB_SPEC.md)
- [Mobile App Spec](mobile/MOBILE_SPEC.md)

---

## 📅 Roadmap Skripsi

| Fase | Bulan | Target |
|------|-------|--------|
| Fase 1 | 1–2 | Setup, Auth, ERD → DB Migration, Figma UI |
| Fase 2 | 3–4 | Core features: Proyek, Proposal, Submission, FCM |
| Fase 3 | 5 | Escrow + Midtrans integration, Admin Dashboard |
| Fase 4 | 6 | UAT, Bug fixing, Dokumentasi, BAB 4 & 5 |
