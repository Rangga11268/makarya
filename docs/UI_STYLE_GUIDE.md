# 🎨 Makarya UI/UX Style Guide & Visual Reference
**Aesthetic:** Modern Editorial Minimalist (Inspired by shadcn/ui)  
**Filosofi:** Bersih, Bernilai Tinggi, Tipografi Kuat, Bebas "AI-Slop" Cliché  
**Dokumen Acuan:** Mockup Referensi Web & Mobile `Explore / Freelancery`

---

## 1. Prinsip Desain Utama (Anti-AI Slop Rules)

Untuk menjaga tampilan tetap elegan, profesional, dan berstandar industri tinggi:

| ❌ HINDARI (Cliché AI-Slop) | ✅ GUNAKAN DI MAKARYA |
|---|---|
| Gradasi ungu/neon di atas tema gelap (*purple-on-dark*) | **Monochrome Base** (Putih, Slate, Pitch Black) dengan kontras tinggi |
| Outline border glowing / neon accents | **Crisp 1px Border** halus (`#E4E4E7` / `#EEEEEE`) |
| Tombol/Badge dengan efek glow berlebihan | **Solid Pill Badges & Buttons** hitam pekat (`#18181B`) atau outline abu-abu |
| Bento box yang penuh icon acak | **Hierarki kartu yang fungsional** dengan metadata terstruktur |
| Font generic tanpa tracking/jarak huruf | **Editorial Typography** dengan tracking rapat (`-0.02em`) pada headline |
| Gradient teks warna-warni pada judul | **Solid dark text** (`#09090B`) yang tegas dan sangat mudah dibaca |

---

## 2. Color Palette (Palette Warna Resmi)

### A. Base & Neutral Palette
- **Canvas / Background:** `#F8F9FA` (Off-white / Slate 50 lembut untuk latar belakang halaman)
- **Card Surface:** `#FFFFFF` (Putih murni untuk kartu, container, dan modal)
- **Borders & Dividers:** `#E4E4E7` / `#E5E7EB` (Garis pembatas 1px yang sangat bersih)
- **Primary Text:** `#09090B` / `#121212` (Hitam pekat untuk heading, nama, dan teks utama)
- **Secondary / Muted Text:** `#71717A` / `#64748B` (Abu-abu netral untuk deskripsi, subtitle, metadata)

### B. Action & Accent Palette
- **Primary Action (Buttons & Active Pills):** `#18181B` (Hitam pekat) dengan teks `#FFFFFF`
- **Secondary Action (Hover / Inactive Pills):** `#F4F4F5` (Abu-abu terang) dengan border `#E4E4E7`
- **Warm Accent (Rating & Highlights):** `#FF5E3A` / `#F59E0B` (Coral / Amber hangat untuk bintang rating & badge khusus)
- **Status Escrow / Success:** `#10B981` (Emerald Green untuk status "DONE", Pembayaran Sukses)

---

## 3. Tipografi (Typography Hierarchy)

Font Family: **Inter** atau **Plus Jakarta Sans** (Google Fonts)

```css
/* Headline Display (Contoh: "Explore", "Graphic Designer") */
font-size: 32px;
font-weight: 700; /* Bold */
line-height: 1.2;
letter-spacing: -0.03em;
color: #09090B;

/* Section Header (Contoh: "Design (15)", "Portfolio", "Filters") */
font-size: 20px;
font-weight: 600; /* SemiBold */
letter-spacing: -0.02em;

/* Card Title / Service Name (Contoh: "Landing page design", "Alice Murphy") */
font-size: 16px;
font-weight: 600;
color: #18181B;

/* Body Text / Project Bio */
font-size: 14px;
font-weight: 400; /* Regular */
line-height: 1.5;
color: #71717A;

/* Pill Tag & Metadata (Contoh: "2 years exp", "Project work", "from Rp 250.000") */
font-size: 12px;
font-weight: 500; /* Medium */
letter-spacing: -0.01em;
```

---

## 4. Bedah Anatomi Komponen UI (Sesuai Mockup)

### 🧩 1. Project / Freelancer Card
```
┌─────────────────────────────────────────────────────────┐
│ [Avatar 36px]  Jason Hollis          ⭐ 4.9 (21)   [🔖] │
│                UX/UI Designer                           │
│                                                         │
│ Landing page design                     from Rp 250.000 │
│                                                         │
│ [ 💼 2 years exp ]  [ ⏱️ Project work ]                 │
│                                                         │
│ I'm creating high-quality landing page quickly and      │
│ professionally. I'll be happy to help your project...   │
└─────────────────────────────────────────────────────────┘
```
- **Radius:** `14px`
- **Border:** `1px solid #E4E4E7`
- **Background:** `#FFFFFF`
- **Pill Tags:** `border-radius: 9999px`, padding `4px 12px`, border halus atau background `#F4F4F5`.

---

### 🧩 2. Left Filter Drawer (Web App)
- **Header:** Judul `Filters` tebal + tombol silang `[X]` melingkar.
- **Dropdowns:** Dropdown minimalis untuk `Category` dan `Availability`.
- **Range Sliders:** Dual-point range slider minimalis hitam untuk `Budget / Salary` dan `Experience`.
- **Skill Pill Grid:** Daftar tag keahlian (`Wireframes`, `Spline`, `Illustration`, `Figma`, `React.js`) di mana tag yang aktif berwarna hitam solid dan tag tidak aktif berlatar putih dengan border abu-abu.
- **Action Buttons:** Tombol hitam `Show Results` dan tombol text `Reset All`.

---

### 🧩 3. Horizontal Category Tabs (Web & Mobile)
- Menampilkan nama kategori disertai jumlah proyek/talenta aktif dalam kurung:  
  `Design (15)` &nbsp;|&nbsp; `Programming (21)` &nbsp;|&nbsp; `Video & Animation (14)` &nbsp;|&nbsp; `Marketing (25)` &nbsp;|&nbsp; `Copywriting (8)`
- Kategori aktif bergaris bawah tebal hitam atau menggunakan teks hitam pekat bold.

---

### 🧩 4. Chat & Workspace Drawer (Detail Screen)
- **Header:** Nama mahasiswa / UMKM + status dot hijau `● Online` + tombol close `[X]`.
- **Chat Bubbles:**
  - Pesan keluar (User): Bubble hitam `#18181B` dengan teks putih `#FFFFFF`.
  - Pesan masuk (Partner): Bubble abu-abu `#F4F4F5` dengan teks hitam `#18181B`.
- **Portfolio Media Grid:** Grid 2x2 thumbnail gambar persegi rounded (`border-radius: 12px`) untuk melampirkan hasil karya portofolio langsung di dalam chat.
- **Input Bar:** Input teks persegi panjang bersih dengan tombol kirim berikon pesawat kertas hitam.

---

### 🧩 5. Poster Hero Banner (Card Khusus)
- Card featured dengan background visual grafis / tipografi artistik kontras tinggi.
- Teks hero: *"Connecting You with Trusted Freelancers, Fast."* (Teks putih bold di atas visual dinamis).

---

## 5. Acuan Implementasi Frontend (Nanti di Fase 3)

- **Web (React.js):** Menggunakan **Tailwind CSS** + arsitektur komponen modular **shadcn/ui** (`@/components/ui/badge`, `@/components/ui/button`, `@/components/ui/dialog`, dll).
- **Mobile (React Native):** Menggunakan styling StyleSheet / Tailwind (NativeWind) dengan token warna dan radius yang sama persis seperti spesifikasi di atas.
