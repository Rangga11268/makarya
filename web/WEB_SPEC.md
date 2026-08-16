# 🌐 Web App Specification — Makarya
**Tech: React.js 18 + Tailwind CSS + React Router v6**
**Target User: Mahasiswa (Freelancer) + Admin**
**Versi:** 1.0

---

## Struktur Folder Project

```
makarya-web/
├── index.html
├── package.json
├── vite.config.js           ← Menggunakan Vite sebagai build tool
├── tailwind.config.js
├── .env
├── public/
│   └── favicon.ico
└── src/
    ├── main.jsx             ← Entry point
    ├── App.jsx              ← Router setup
    ├── api/
    │   ├── axiosInstance.js ← Base URL + interceptor JWT
    │   ├── auth.api.js
    │   ├── project.api.js
    │   ├── proposal.api.js
    │   └── wallet.api.js
    ├── store/               ← State management (Zustand)
    │   ├── authStore.js
    │   └── notifStore.js
    ├── pages/
    │   ├── auth/
    │   │   ├── LoginPage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── dashboard/
    │   │   └── DashboardPage.jsx
    │   ├── projects/
    │   │   ├── BrowseProjectsPage.jsx
    │   │   └── ProjectDetailPage.jsx
    │   ├── proposals/
    │   │   └── ProposalBoardPage.jsx
    │   ├── portfolio/
    │   │   └── PortfolioPage.jsx
    │   ├── wallet/
    │   │   └── WalletPage.jsx
    │   └── admin/
    │       ├── AdminDashboardPage.jsx
    │       ├── VerificationPage.jsx
    │       └── DisputePage.jsx
    ├── components/
    │   ├── ui/              ← Reusable components
    │   │   ├── Button.jsx
    │   │   ├── Badge.jsx
    │   │   ├── Modal.jsx
    │   │   └── Toast.jsx
    │   ├── layout/
    │   │   ├── Navbar.jsx
    │   │   └── Sidebar.jsx
    │   └── features/
    │       ├── ProjectCard.jsx
    │       ├── ProposalForm.jsx
    │       └── SkillSelector.jsx
    └── utils/
        ├── formatCurrency.js
        └── validators.js
```

---

## Environment Variables (.env)

```env
VITE_API_BASE_URL=http://localhost:8000/v1
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

---

## Halaman & Fitur per Halaman

### 🔐 Auth Pages

#### `/register` — Halaman Registrasi Mahasiswa
**Komponen:** `RegisterPage.jsx`

Form fields:
- Nama Lengkap
- Email (validasi domain `.ac.id` di frontend & backend)
- Password + Confirm Password
- Program Studi (dropdown dari `GET /master/prodi`)
- Upload KTM (jika email non-.ac.id)

Behaviour:
- Setelah submit sukses → redirect ke halaman "Menunggu Verifikasi"
- Auto-suggest skill muncul setelah prodi dipilih

---

#### `/login` — Halaman Login
**Komponen:** `LoginPage.jsx`

- Email + Password form
- Simpan `access_token` di memory, `refresh_token` di httpOnly cookie
- Redirect berdasarkan role: Mahasiswa → `/dashboard`, Admin → `/admin`

---

### 🏠 Dashboard

#### `/dashboard` — Dashboard Mahasiswa
**Komponen:** `DashboardPage.jsx`

Menampilkan:
- Ringkasan: proyek aktif, total penghasilan, rating rata-rata
- Shortcut ke: Browse Proyek, Proposal Board, Portfolio
- Notifikasi terbaru

---

### 📋 Proyek

#### `/projects` — Browse Proyek
**Komponen:** `BrowseProjectsPage.jsx`

Fitur:
- List proyek dengan status OPEN
- Filter: kategori, budget range, deadline
- Search by keyword
- Card menampilkan: judul, kategori badge, budget, sisa hari
- Klik card → `/projects/:id`

---

#### `/projects/:id` — Detail Proyek
**Komponen:** `ProjectDetailPage.jsx`

Menampilkan:
- Deskripsi lengkap proyek
- Tag skill (dari AI atau manual)
- Info UMKM (nama usaha, kota)
- Tombol "Kirim Proposal" → buka modal form
- Estimasi harga yang wajar (dari smart pricing)

---

### 📬 Proposal

#### `/proposals` — Proposal Board
**Komponen:** `ProposalBoardPage.jsx`

Tampilan kolom berdasarkan status:
- **Pending** — menunggu keputusan UMKM
- **Accepted** — diterima, proyek berjalan
- **Rejected** — ditolak
- **Withdrawn** — dibatalkan mahasiswa

Setiap card proposal menampilkan:
- Nama proyek, harga tawar, tanggal kirim
- Status badge
- Jika Accepted → tombol "Upload Hasil Kerja"

---

### 💼 Portfolio

#### `/portfolio` — Portfolio Builder
**Komponen:** `PortfolioPage.jsx`

Menampilkan:
- Grid karya dari proyek yang berstatus DONE
- Setiap item: nama proyek, kategori, tanggal selesai, link file
- Tombol "Bagikan Portfolio" → generate URL publik

---

### 💰 Wallet

#### `/wallet` — Halaman Wallet Mahasiswa
**Komponen:** `WalletPage.jsx`

Menampilkan:
- Saldo aktif dan saldo escrow
- Riwayat transaksi (ledger log)
- Form request withdraw: nominal + nomor rekening

---

### ⚙️ Admin Pages

#### `/admin` — Admin Dashboard
- Statistik: total proyek, total transaksi, user aktif
- Tabel proyek aktif

#### `/admin/verification` — Verifikasi Mahasiswa
- List akun mahasiswa dengan `is_verified = false`
- Tombol "Lihat KTM" → preview gambar
- Tombol "Verifikasi" / "Tolak"

#### `/admin/disputes` — Dispute Resolution
- List sengketa aktif
- Detail sengketa + riwayat chat/catatan
- Form resolusi admin

---

## Routing & Protected Routes

```jsx
// App.jsx
<Routes>
  {/* Public */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />

  {/* Mahasiswa */}
  <Route element={<ProtectedRoute role="MHS" />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/projects" element={<BrowseProjectsPage />} />
    <Route path="/projects/:id" element={<ProjectDetailPage />} />
    <Route path="/proposals" element={<ProposalBoardPage />} />
    <Route path="/portfolio" element={<PortfolioPage />} />
    <Route path="/wallet" element={<WalletPage />} />
  </Route>

  {/* Admin */}
  <Route element={<ProtectedRoute role="ADMIN" />}>
    <Route path="/admin" element={<AdminDashboardPage />} />
    <Route path="/admin/verification" element={<VerificationPage />} />
    <Route path="/admin/disputes" element={<DisputePage />} />
  </Route>
</Routes>
```

---

## Axios Instance + JWT Interceptor

```javascript
// src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach token ke setiap request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh token jika expired
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      // Coba refresh token...
      // Jika gagal → logout
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## Cara Menjalankan (Development)

```bash
# Setup
git clone https://github.com/darell/makarya-web
cd makarya-web
npm install

# Jalankan dev server
npm run dev
# → http://localhost:5173

# Build production
npm run build
```

---

## Package.json Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "axios": "^1.6.7",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.24.0",
    "react-hook-form": "^7.51.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "vite": "^5.1.4",
    "@vitejs/plugin-react": "^4.2.1",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.18"
  }
}
```
