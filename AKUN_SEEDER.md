# 🔑 Daftar Akun Seeder & Pengujian — Makarya Platform

Dokumen ini berisi daftar akun uji coba resmi yang telah ditanam (*seeded*) di database PostgreSQL untuk pengujian sistem **Makarya (Portal Web Mahasiswa, Admin & Aplikasi Mobile UMKM)**.

> **Password default untuk seluruh akun di bawah adalah:** `password123`

---

## 1. 🛡️ Akun Administrator Platform

| Email | Password | Role | Fitur Akses |
|---|---|---|---|
| `admin@makarya.id` | `password123` | `ADMIN` | Dashboard Admin, Verifikasi Mahasiswa, Pusat Mediasi Sengketa (*Escrow Split Resolution*) |

---

## 2. 🎓 Akun Mahasiswa (Freelancer)

| Email Kampus | Password | Nama Mahasiswa | NIM | Program Studi | Saldo Awal |
|---|---|---|---|---|---|
| `darell@ubsi.ac.id` | `password123` | **Darell Rangga Putra** | `12219999` | Sistem Informasi | Rp 350.000 |
| `adelia@ubsi.ac.id` | `password123` | **Adelia Putri** | `12210002` | Desain Komunikasi Visual | Rp 350.000 |
| `bima@ubsi.ac.id` | `password123` | **Bima Arya** | `12210003` | Teknologi Informasi | Rp 350.000 |

---

## 3. 🏪 Akun Klien UMKM (Pemberi Kerja)

| Email UMKM | Password | Nama Usaha | Bidang Usaha | Kota / Alamat | Saldo Dompet |
|---|---|---|---|---|---|
| `kopi.nusantara@gmail.com` | `password123` | **Kopi Kenangan Nusantara** | F&B / Kuliner Kopi | Jakarta Selatan | Rp 2.000.000 |
| `batik.lestari@gmail.com` | `password123` | **Batik Lestari Heritage** | Fashion & Tekstil | Pekalongan | Rp 2.000.000 |
| `dapur.mama@gmail.com` | `password123` | **Dapur Mama Bakery** | Kuliner Roti & Pastry | Bekasi | Rp 2.000.000 |

---

## 📋 5 Proyek Sampel yang Aktif (Status: OPEN)

1. **[DESIGN]** *Desain Ulang Logo & Brand Identity Kedai Kopi* — Budget: **Rp 650.000** (Klien: Kopi Kenangan Nusantara)
2. **[PEMROGRAMAN]** *Pembuatan Website Landing Page Menu & Reservasi* — Budget: **Rp 1.200.000** (Klien: Kopi Kenangan Nusantara)
3. **[UIUX]** *Desain UI/UX Aplikasi Mobile Katalog Batik* — Budget: **Rp 950.000** (Klien: Batik Lestari Heritage)
4. **[VIDEO]** *Video Promosi Reels & TikTok Produk Roti Rumahan* — Budget: **Rp 450.000** (Klien: Dapur Mama Bakery)
5. **[COPYWRITING]** *Copywriting Iklan Instagram & Deskripsi Produk Menu Baru* — Budget: **Rp 350.000** (Klien: Dapur Mama Bakery)

---

## 🔄 Cara Menjalankan Ulang Seeder (Jika Data Direset)

```powershell
cd D:\ideSkripsi\makarya\backend
.\venv\Scripts\python.exe -m app.seeds
```
