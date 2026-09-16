# Task Breakdown: Portofolio Showcase & Sertifikat Digital Proyek

## Task 1: Backend Certificate Model & Schemas
- [ ] Buat `backend/app/models/certificate.py` dengan field `credential_id`, `mhs_id`, `project_id`, `proposal_id`, `role_name`, `project_title`, `client_name`, `issued_at`, `is_showcase`, `showcase_description`, `showcase_url`.
- [ ] Daftarkan model di `backend/app/models/__init__.py`.
- [ ] Buat `backend/app/schemas/certificate.py` (`CertificateResponse`, `CertificateToggleShowcaseRequest`, `CertificateVerifyResponse`).

## Task 2: Backend Certificate Router & Auto-Issuance
- [ ] Buat `backend/app/routers/certificates.py` dengan endpoint:
  - `GET /certificates/my` (Daftar sertifikat milik mahasiswa login)
  - `PATCH /certificates/{id}/toggle-showcase` (Toggle tampil di portofolio publik & update deskripsi showcase)
  - `GET /certificates/verify/{credential_id}` (Verifikasi keaslian sertifikat untuk publik/dosen)
  - `GET /certificates/user/{user_id}/showcase` (Daftar sertifikat & portofolio publik milik seorang mahasiswa)
- [ ] Tambahkan pemanggilan auto-issuance sertifikat di `approve_submission` (`backend/app/routers/submissions.py`).
- [ ] Daftarkan router di `backend/app/main.py`.

## Task 3: Web Frontend API & Certificate Viewer Modal
- [ ] Tambahkan `certificateApi` di `web/src/api/index.js`.
- [ ] Buat `web/src/components/features/CertificateViewModal.jsx` dengan desain sertifikat resmi, credential ID, QR Code verifikasi, tombol Cetak/Unduh PDF, dan salin link verifikasi.

## Task 4: Web Portfolio & Talent Showcase UI
- [ ] Perbarui `web/src/pages/portfolio/PortfolioPage.jsx` untuk menampilkan daftar proyek selesai, sertifikat digital, tombol lihat sertifikat, dan switch toggle showcase publik.
- [ ] Perbarui `web/src/pages/talents/TalentDetailPage.jsx` untuk menampilkan showcase proyek dan sertifikat terverifikasi dari talenta tersebut.
- [ ] Tambahkan tautan/banner sertifikat di `WorkroomWorkspaceDetail.jsx` saat proyek berstatus selesai.

## Task 5: Mobile App Certificate Integration
- [ ] Tambahkan `certificateApi` di `mobile/src/api/index.js`.
- [ ] Buat `mobile/src/components/features/certificates/MobileCertificateModal.jsx`.
- [ ] Integrasikan akses sertifikat di `mobile/src/screens/projects/components/WorkroomActiveView.jsx`.

## Task 6: Build Verification & Deployment
- [ ] Jalankan `npm run build` di `web/` untuk memastikan zero errors.
- [ ] Commit dan push ke GitHub `main`.
