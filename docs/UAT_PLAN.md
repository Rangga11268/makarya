# ✅ UAT Plan — User Acceptance Testing
**Makarya | Versi 1.0**
**Metode:** Black-box testing oleh pengguna nyata (UMKM & Mahasiswa)

---

## Skenario Pengujian Web App — Mahasiswa

### W-01: Validasi Email Registrasi
| | Detail |
|-|--------|
| **Test ID** | W-01 |
| **Modul** | AUTH-02 |
| **Deskripsi** | Sistem harus menolak registrasi dengan email non `.ac.id` |
| **Pre-condition** | Pengguna belum memiliki akun |
| **Input** | Email: `darell@gmail.com`, Password: `Test1234!` |
| **Langkah** | 1. Buka halaman registrasi mahasiswa → 2. Isi form dengan email gmail → 3. Submit |
| **Expected Result** | Muncul pesan error: *"Gunakan email institusi berakhiran .ac.id"* |
| **Status** | ☐ Pass / ☐ Fail |

---

### W-02: Auto-suggest Skill dari Program Studi
| | Detail |
|-|--------|
| **Test ID** | W-02 |
| **Modul** | AUTH-08 |
| **Deskripsi** | Sistem otomatis merekomendasikan skill sesuai prodi yang dipilih |
| **Pre-condition** | Pengguna registrasi dengan email `.ac.id` valid |
| **Input** | Dropdown Prodi: `Sistem Informasi` |
| **Langkah** | 1. Pilih prodi "Sistem Informasi" → 2. Amati daftar skill yang muncul |
| **Expected Result** | Muncul saran skill: UI/UX Design, Web Development, Database, Analisis Data |
| **Status** | ☐ Pass / ☐ Fail |

---

### W-03: Batas Revisi Hardcoded
| | Detail |
|-|--------|
| **Test ID** | W-03 |
| **Modul** | PROJ-10, WORK-04 |
| **Deskripsi** | Tombol "Request Revisi" harus nonaktif setelah 2x revisi |
| **Pre-condition** | Proyek aktif, `submissions.jumlah_revisi = 2` |
| **Input** | Klik tombol "Minta Revisi" untuk ketiga kalinya |
| **Langkah** | 1. Buka detail proyek → 2. Cek status revisi → 3. Coba klik tombol revisi |
| **Expected Result** | Tombol disabled (tidak bisa diklik), muncul teks: *"Batas revisi telah tercapai (2/2)"* |
| **Status** | ☐ Pass / ☐ Fail |

---

### W-04: Filter Proyek di Browse
| | Detail |
|-|--------|
| **Test ID** | W-04 |
| **Modul** | WORK-01 |
| **Deskripsi** | Filter proyek berdasarkan kategori dan budget |
| **Pre-condition** | Ada minimal 5 proyek aktif dengan kategori berbeda |
| **Input** | Filter: Kategori = `Desain Grafis`, Budget Max = `Rp 500.000` |
| **Expected Result** | Hanya tampil proyek desain grafis dengan budget ≤ Rp 500.000 |
| **Status** | ☐ Pass / ☐ Fail |

---

### W-05: Validasi Form Proposal
| | Detail |
|-|--------|
| **Test ID** | W-05 |
| **Modul** | WORK-02 |
| **Deskripsi** | Form proposal tidak bisa disubmit jika ada field wajib kosong |
| **Input** | Cover letter dikosongkan, harga tawar diisi |
| **Expected Result** | Validasi frontend mencegah submit, muncul: *"Cover letter wajib diisi"* |
| **Status** | ☐ Pass / ☐ Fail |

---

### W-06: Portfolio Builder Menampilkan Proyek Selesai
| | Detail |
|-|--------|
| **Test ID** | W-06 |
| **Modul** | WORK-05 |
| **Deskripsi** | Halaman portofolio hanya menampilkan proyek berstatus DONE |
| **Pre-condition** | Mahasiswa memiliki proyek DONE dan IN_PROGRESS |
| **Expected Result** | Hanya proyek DONE muncul di halaman portfolio publik |
| **Status** | ☐ Pass / ☐ Fail |

---

## Skenario Pengujian Mobile App — UMKM

### M-01: Smart Pricing Warning
| | Detail |
|-|--------|
| **Test ID** | M-01 |
| **Modul** | PROJ-03 |
| **Deskripsi** | Sistem memperingatkan jika budget di bawah estimasi wajar |
| **Input** | Kategori: Desain Logo, Budget: `Rp 50.000` |
| **Langkah** | 1. Buka form posting proyek → 2. Pilih kategori "Desain Grafis" → 3. Input budget Rp 50.000 |
| **Expected Result** | Muncul peringatan kuning: *"Budget ini di bawah estimasi wajar untuk Desain Logo (min. Rp 150.000)"* |
| **Status** | ☐ Pass / ☐ Fail |

---

### M-02: Validasi Batas Budget Rp 2.000.000
| | Detail |
|-|--------|
| **Test ID** | M-02 |
| **Modul** | PROJ-02, FIN-07 |
| **Deskripsi** | Sistem menolak input budget melebihi batas maksimal |
| **Input** | Budget: `Rp 2.500.000` |
| **Expected Result** | Error: *"Budget melebihi batas maksimal platform (Rp 2.000.000)"* |
| **Status** | ☐ Pass / ☐ Fail |

---

### M-03: Escrow Hold Setelah Terima Proposal
| | Detail |
|-|--------|
| **Test ID** | M-03 |
| **Modul** | FIN-02 |
| **Deskripsi** | Dana berpindah ke escrow, bukan langsung ke mahasiswa |
| **Pre-condition** | UMKM memiliki saldo aktif cukup, ada proposal PENDING |
| **Input** | Klik "Terima Proposal" pada proposal senilai Rp 300.000 |
| **Langkah** | 1. Buka proposal → 2. Klik terima → 3. Konfirmasi → 4. Cek wallet |
| **Expected Result** | `saldo_aktif` UMKM berkurang Rp 300.000, `saldo_escrow` bertambah Rp 300.000. `saldo_aktif` mahasiswa **tidak berubah** |
| **Status** | ☐ Pass / ☐ Fail |

---

### M-04: Status Tracker Berubah Otomatis
| | Detail |
|-|--------|
| **Test ID** | M-04 |
| **Modul** | PROJ-06 |
| **Deskripsi** | Status proyek berubah sesuai aksi yang dilakukan |
| **Pre-condition** | Proyek berstatus OPEN |
| **Skenario** | OPEN → [terima proposal] → BIDDING → IN_PROGRESS → [upload hasil] → REVIEW → [approve] → DONE |
| **Expected Result** | Setiap transisi status terekam dan tampil di Live Tracker |
| **Status** | ☐ Pass / ☐ Fail |

---

### M-05: Tidak Bisa Rating Dua Kali
| | Detail |
|-|--------|
| **Test ID** | M-05 |
| **Modul** | PROJ-11 |
| **Pre-condition** | Proyek DONE, UMKM sudah pernah beri rating |
| **Input** | Submit rating kedua untuk proyek yang sama |
| **Expected Result** | Error 400: *"Anda sudah memberikan rating untuk proyek ini"* |
| **Status** | ☐ Pass / ☐ Fail |

---

## Skenario Pengujian Backend API

### B-01: Validasi Budget di API Level
| | Detail |
|-|--------|
| **Test ID** | B-01 |
| **Endpoint** | `POST /projects` |
| **Method** | POST |
| **Request Body** | `{ "budget_max": 3000000, ... }` |
| **Expected Response** | `422 Unprocessable Entity` — field validation error |
| **Status** | ☐ Pass / ☐ Fail |

---

### B-02: Proteksi Endpoint dengan JWT
| | Detail |
|-|--------|
| **Test ID** | B-02 |
| **Endpoint** | `PATCH /proposals/{id}/accept` |
| **Method** | PATCH |
| **Kondisi** | Request tanpa `Authorization` header |
| **Expected Response** | `401 Unauthorized` |
| **Status** | ☐ Pass / ☐ Fail |

---

### B-03: Batas Revisi di API Level
| | Detail |
|-|--------|
| **Test ID** | B-03 |
| **Endpoint** | `PATCH /submissions/{id}/revise` |
| **Kondisi** | `submissions.jumlah_revisi` sudah = 2 |
| **Expected Response** | `400 Bad Request: { "detail": "Max revision limit reached" }` |
| **Status** | ☐ Pass / ☐ Fail |

---

### B-04: Idempotency Midtrans Webhook
| | Detail |
|-|--------|
| **Test ID** | B-04 |
| **Endpoint** | `POST /payments/webhook` |
| **Kondisi** | Webhook dengan `order_id` yang sama dikirim dua kali |
| **Expected** | Transaksi pertama diproses, transaksi kedua diabaikan (tidak double credit) |
| **Status** | ☐ Pass / ☐ Fail |

---

### B-05: Role-based Access Control
| | Detail |
|-|--------|
| **Test ID** | B-05 |
| **Endpoint** | `GET /admin/disputes` |
| **Kondisi** | Request dengan JWT role = MAHASISWA |
| **Expected Response** | `403 Forbidden` |
| **Status** | ☐ Pass / ☐ Fail |

---

## Template Laporan UAT

```
Tanggal Pengujian   : __________
Penguji             : __________
Versi Aplikasi      : __________

| Test ID | Status | Catatan / Bug |
|---------|--------|---------------|
| W-01    |        |               |
| W-02    |        |               |
| W-03    |        |               |
| W-04    |        |               |
| W-05    |        |               |
| W-06    |        |               |
| M-01    |        |               |
| M-02    |        |               |
| M-03    |        |               |
| M-04    |        |               |
| M-05    |        |               |
| B-01    |        |               |
| B-02    |        |               |
| B-03    |        |               |
| B-04    |        |               |
| B-05    |        |               |

Total: __/16 test passed
```
