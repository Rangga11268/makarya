# 📱 Mobile App Specification — Makarya
**Tech: React Native 0.73+ + React Navigation v6**
**Target User: UMKM (Klien)**
**Platform: Android (utama) + iOS**
**Versi:** 1.0

---

## Struktur Folder Project

```
makarya-mobile/
├── package.json
├── app.json
├── .env                     ← Gunakan react-native-dotenv
├── android/                 ← Native Android files
├── ios/                     ← Native iOS files
└── src/
    ├── api/
    │   ├── axiosInstance.js  ← Base URL + JWT interceptor
    │   ├── auth.api.js
    │   ├── project.api.js
    │   ├── payment.api.js
    │   └── proposal.api.js
    ├── store/               ← Zustand state management
    │   ├── authStore.js
    │   └── notifStore.js
    ├── navigation/
    │   ├── AppNavigator.jsx  ← Root navigator
    │   ├── AuthStack.jsx     ← Stack sebelum login
    │   └── MainTabs.jsx      ← Bottom tab setelah login
    ├── screens/
    │   ├── auth/
    │   │   ├── LoginScreen.jsx
    │   │   └── RegisterScreen.jsx
    │   ├── home/
    │   │   └── HomeScreen.jsx
    │   ├── projects/
    │   │   ├── PostProjectScreen.jsx
    │   │   ├── ProjectListScreen.jsx
    │   │   └── ProjectDetailScreen.jsx
    │   ├── proposals/
    │   │   └── ProposalListScreen.jsx
    │   ├── tracker/
    │   │   └── TrackerScreen.jsx
    │   └── wallet/
    │       └── WalletScreen.jsx
    ├── components/
    │   ├── ui/
    │   │   ├── Button.jsx
    │   │   ├── Badge.jsx
    │   │   └── Toast.jsx
    │   └── features/
    │       ├── ProjectStatusBar.jsx
    │       ├── PricingSuggester.jsx
    │       └── ProposalCard.jsx
    └── utils/
        ├── formatCurrency.js
        └── validators.js
```

---

## Navigasi App

### Struktur Navigasi

```
AppNavigator (Root)
├── AuthStack (jika belum login)
│   ├── LoginScreen
│   └── RegisterScreen
│
└── MainTabs (setelah login - Bottom Tab Navigator)
    ├── Tab: Beranda      → HomeScreen
    ├── Tab: Proyek Saya  → ProjectListScreen
    ├── Tab: Post Proyek  → PostProjectScreen  [+ FAB Button]
    ├── Tab: Tracker      → TrackerScreen
    └── Tab: Dompet       → WalletScreen
```

---

## Screens & Fitur per Screen

### 🔐 Auth Screens

#### `LoginScreen.jsx`
- Form: Email + Password
- Tombol login → call `POST /auth/login`
- Simpan JWT di `AsyncStorage`
- Navigasi ke `MainTabs` setelah sukses

#### `RegisterScreen.jsx`
- Form: Nama Usaha, Nama Pemilik, Email, Password, No. HP
- Pilih Bidang Industri (dropdown)
- Tombol "Daftar" → call `POST /auth/register/umkm`
- Redirect ke Login setelah sukses

---

### 🏠 Home Screen

#### `HomeScreen.jsx`
Menampilkan:
- Greeting: *"Halo, [Nama Usaha]!"*
- Summary cards:
  - Proyek aktif
  - Proposal masuk
  - Saldo wallet
- Shortcut ke "Post Proyek Baru" dan "Live Tracker"
- Daftar notifikasi terbaru (3 terakhir)

---

### 📋 Post Proyek Screen

#### `PostProjectScreen.jsx`
**PROJ-01 — Form Posting Proyek**

Form fields:
- Judul Proyek (text input)
- Deskripsi kebutuhan (textarea — bahasa bebas)
- Kategori (picker: Desain, UI/UX, Programming, Video, Copywriting, Admin)
- Budget (numeric input dengan validasi ≤ Rp 2.000.000)
- Deadline (date picker)

**PROJ-03 — Smart Pricing Suggester**
Ketika budget diisi, tampilkan estimasi wajar:
```
Budget kamu: Rp 100.000
Estimasi wajar untuk "Desain Logo": Rp 150.000 - Rp 400.000
[⚠️] Budget di bawah estimasi — mahasiswa mungkin tidak tertarik
```

**PROJ-04 — AI Tag (Opsional)**
Setelah deskripsi diketik dan blur:
```
→ call AI microservice (fire-and-forget)
→ Tampilkan chip tags: "Desain Grafis", "Ilustrasi"
→ UMKM bisa hapus/tambah manual
```

---

### 📂 Project List Screen

#### `ProjectListScreen.jsx`
**PROJ-07 — Daftar Semua Proyek UMKM**

List proyek milik UMKM yang login:
- Filter by status (OPEN, IN_PROGRESS, REVIEW, DONE)
- Setiap item: judul, status badge, deadline, jumlah proposal
- Klik item → `ProjectDetailScreen`

---

### 🔍 Project Detail Screen

#### `ProjectDetailScreen.jsx`
Menampilkan:
- Semua info proyek
- **Jika OPEN:** Daftar proposal masuk — tiap proposal ada tombol Terima/Tolak
- **Jika IN_PROGRESS / REVIEW:** Tampilkan submission mahasiswa + tombol Approve / Minta Revisi
- **Counter revisi:** `Revisi: 2/2` (tombol disabled jika sudah 2x)

**Komponen `ProjectStatusBar`:**
```
[●]──────[●]──────[○]──────[○]
Bidding  In Progress  Review  Done
```

---

### 🧭 Tracker Screen

#### `TrackerScreen.jsx`
**PROJ-06 — Live Project Tracker**

Timeline visual semua proyek aktif:
- Scrollable list proyek
- Setiap proyek punya progress bar horizontal: Bidding → In Progress → Review → Done
- Warna berbeda per status
- Klik → DetailScreen

---

### 💰 Wallet Screen

#### `WalletScreen.jsx`
Menampilkan:
- Saldo Aktif (bisa digunakan)
- Saldo Escrow (tertahan untuk proyek aktif)
- Tombol "Top-up" → buka bottom sheet Midtrans payment
- Riwayat transaksi (ledger log)

**Alur Top-up:**
```
1. UMKM pilih nominal top-up
2. Call POST /payments/topup → dapat VA Number
3. Tampilkan VA Number + instruksi transfer
4. Backend menerima webhook dari Midtrans
5. Push notif → "Saldo berhasil ditambahkan +Rp X"
```

---

## Push Notification (Firebase FCM)

Konfigurasi di `app.json` dan setup `@react-native-firebase/messaging`:

```javascript
// Listener di AppNavigator
useEffect(() => {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    // Tampilkan in-app notification toast
    showToast(remoteMessage.notification.title, remoteMessage.notification.body);
  });
  return unsubscribe;
}, []);
```

**Tipe notifikasi yang diterima UMKM:**
| Trigger | Judul | Pesan |
|---------|-------|-------|
| Proposal baru masuk | 📬 Proposal Baru | "Ada mahasiswa yang melamar proyek kamu!" |
| Hasil kerja dikirim | 📦 Hasil Terkirim | "Mahasiswa telah mengirim hasil proyek kamu" |
| Top-up berhasil | ✅ Top-up Berhasil | "Saldo kamu bertambah Rp X" |

---

## Environment & Dependencies

```env
# .env
API_BASE_URL=http://10.0.2.2:8000/v1   ← Android emulator ke localhost
CLOUDINARY_CLOUD_NAME=your-cloud-name
```

```json
// package.json key dependencies
{
  "dependencies": {
    "react-native": "0.73.4",
    "react": "18.2.0",
    "@react-navigation/native": "^6.1.10",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "axios": "^1.6.7",
    "zustand": "^4.5.0",
    "@react-native-async-storage/async-storage": "^1.22.0",
    "react-native-paper": "^5.12.0",
    "@react-native-firebase/app": "^19.3.0",
    "@react-native-firebase/messaging": "^19.3.0",
    "react-native-dotenv": "^3.4.9",
    "react-hook-form": "^7.51.0"
  }
}
```

---

## Cara Menjalankan (Development)

```bash
# Setup
git clone https://github.com/darell/makarya-mobile
cd makarya-mobile
npm install

# Android (pastikan emulator/device terhubung)
npx react-native run-android

# iOS (Mac only)
cd ios && pod install && cd ..
npx react-native run-ios
```

> **Catatan Skripsi:** Cukup demo di Android. Build APK debug sudah cukup untuk sidang.
> Gunakan `npx react-native build-android` untuk generate APK demo.

---

## Checklist Sebelum Demo Sidang

- [ ] Login/Register UMKM berjalan
- [ ] Posting proyek dengan validasi budget
- [ ] Smart Pricing Suggester tampil
- [ ] Proposal masuk dan bisa diterima
- [ ] Escrow hold/release berjalan
- [ ] Live Tracker update status
- [ ] Push notification diterima
- [ ] Top-up via Midtrans Sandbox
- [ ] Request revisi dengan batas 2x
- [ ] Approve hasil dan dana cair
