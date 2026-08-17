# 🎨 Figma Design System & UI Blueprint — Makarya
**Panduan Desain UI/UX Web & Mobile untuk Figma**
**Penyusun:** Darell Rangga Putra | UBSI Kaliabang

---

## 1. Design Tokens & Color Palette

Gunakan palette warna ini sebagai *Color Styles* di Figma:

### Primary & Secondary (Brand Identity)
| Token Name | Hex Code | Penggunaan |
|---|---|---|
| `primary-50` | `#EEF2FF` | Background badge / highlight lembut |
| `primary-500` | `#4F46E5` | Indigo Utama (Tombol utama, active tab, logo) |
| `primary-600` | `#4338CA` | Hover state tombol utama |
| `secondary-500`| `#0EA5E9` | Sky Blue (Aksen info, tracker status, link) |

### Semantic Colors (Status & Alerts)
| Token Name | Hex Code | Penggunaan |
|---|---|---|
| `success-500` | `#10B981` | Emerald Green (Status "DONE", Top-up sukses, Approved) |
| `warning-500` | `#F59E0B` | Amber/Orange (Smart pricing warning, status "REVIEW", Revisi) |
| `danger-500`  | `#EF4444` | Crimson Red (Error validation, Tolak proposal, Max revisi reached) |

### Neutral Colors (Background, Surface & Text)
| Token Name | Hex Code | Penggunaan |
|---|---|---|
| `neutral-50`  | `#F8FAFC` | Page Background (Slate 50) |
| `neutral-100` | `#F1F5F9` | Card background / Input field background |
| `neutral-300` | `#CBD5E1` | Border outline kartu / input form |
| `neutral-500` | `#64748B` | Subtitle text, placeholder, icon secondary |
| `neutral-900` | `#0F172A` | Primary text (Heading, body utama) |

---

## 2. Typography Hierarchy

Gunakan font **Inter** atau **Plus Jakarta Sans** (tersedia gratis di Google Fonts & Figma):

| Tingkat | Font Size | Line Height | Weight | Penggunaan |
|---|---|---|---|---|
| **H1 (Display)** | 32px | 40px | Bold (700) | Judul Hero / Halaman Utama |
| **H2 (Section)** | 24px | 32px | SemiBold (600) | Judul Section / Modal Header |
| **H3 (Card Title)**| 18px | 24px | SemiBold (600) | Judul Proyek, Nama Mahasiswa |
| **Body Regular** | 14px | 20px | Regular (400) | Deskripsi proyek, paragraf umum |
| **Body Medium**  | 14px | 20px | Medium (500) | Label form, teks tombol |
| **Caption/Tag**  | 12px | 16px | Medium (500) | Badge kategori, timestamp, status |

---

## 3. Komponen Utama (Master Components di Figma)

Buat komponen-komponen ini sebagai reusable components (Variants):

1. **Button Component:**
   - Variants: `Primary` (Indigo fill), `Secondary` (Outline), `Danger` (Red fill/outline), `Ghost`.
   - States: `Default`, `Hover`, `Pressed`, `Disabled` (Opacity 50%).
2. **Project Card (Web & Mobile):**
   - Elemen: Kategori Badge, Judul Proyek, Harga/Budget (format Rupiah), Sisa Hari, Status Pill.
3. **Status Pill (Badge Status Proyek):**
   - `OPEN` (Biru)
   - `IN_PROGRESS` (Kuning/Orange)
   - `REVIEW` (Ungu)
   - `DONE` (Hijau)
   - `CANCELLED` (Abu-abu)
4. **Live Project Tracker Bar (Mobile):**
   - Indikator 4 langkah: `1. Bidding` ➔ `2. Pengerjaan` ➔ `3. Review` ➔ `4. Selesai`.

---

## 4. Daftar Frame/Layar yang Perlu Dibuat di Figma

### 📱 A. Mobile App (Untuk UMKM — Frame: Android Large 360x800 atau iPhone 14 393x852)
1. **Screen 1: Login & Register UMKM** (Form nama usaha, bidang, email, no kontak).
2. **Screen 2: Home Dashboard** (Saldo aktif, ringkasan proyek berjalan, tombol quick action "+ Post Proyek").
3. **Screen 3: Post Proyek Baru** (Input judul, kategori picker, deskripsi, input budget + Smart Pricing Warning banner).
4. **Screen 4: Daftar Proyek Saya** (Tab status: Aktif, Selesai, Dibatalkan).
5. **Screen 5: Detail Proyek & Proposal Masuk** (List kartu mahasiswa yang melamar + tombol Terima/Tolak).
6. **Screen 6: Pengerjaan & Review Hasil** (Live tracker bar, preview hasil file kiriman mahasiswa, tombol "Setujui" & "Minta Revisi (Counter: 1/2)").
7. **Screen 7: Wallet & Top-up** (Info saldo escrow, tombol top-up, tampilan Virtual Account Midtrans).

---

### 💻 B. Web App (Untuk Mahasiswa & Admin — Frame: Desktop 1440x900)
1. **Screen 1: Login & Register Mahasiswa** (Input email `.ac.id`, dropdown prodi, auto-suggest skill tags).
2. **Screen 2: Dashboard Mahasiswa** (Statistik penghasilan, proyek aktif, rating score).
3. **Screen 3: Browse Proyek** (Sidebar filter kategori/budget, grid list kartu proyek).
4. **Screen 4: Detail Proyek & Form Lamaran** (Deskripsi lengkap + modal "Kirim Proposal" [harga tawar & cover letter]).
5. **Screen 5: Proposal Board (Kanban / Table)** (Status proposal: Terkirim, Diterima, Ditolak).
6. **Screen 6: Workspace & Upload Hasil** (Upload file deliverable ke Cloudinary + catatan revisi).
7. **Screen 7: Portfolio Builder** (Showcase hasil proyek yang statusnya sudah "DONE").
8. **Screen 8: Admin Dashboard** (Verifikasi manual KTM mahasiswa & pemantauan sengketa/dispute).

---

## 5. Tips Efisiensi untuk Skripsi
- Gunakan **Auto-Layout** di Figma untuk semua card dan tombol agar rapi dan mudah di-export ke Tailwind CSS nantinya.
- Simpan file Figma ini sebagai lampiran desain di **BAB 3 Skripsi**.
