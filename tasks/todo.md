# TODO: Perbaikan & Peningkatan Fitur Eksisting Makarya

## Phase 1: Sinkronisasi Mobile Profile & Tanda Tangan Klien UMKM

- [x] **Task 1.1**: Tambahkan Canvas / Upload Tanda Tangan UMKM di `mobile/src/screens/profile/ProfileScreen.jsx` dan hubungkan ke `url_ttd`.
- [x] **Task 1.2**: Update `MobileCertificateModal.jsx` untuk menampilkan TTD mitra UMKM, logo resmi tanpa filter rusak, dan integrasikan fungsi download PDF lokal.

## Phase 2: Workroom, Submissions & Smart Deliverables

- [x] **Task 2.1**: Verifikasi alur `submitWork`, `requestRevision`, dan `approve` pada `SmartDeliverableCard.jsx` (Web) & `MobileSmartDeliverableCard.jsx` (Mobile).
- [x] **Task 2.2**: Pastikan saat approval tugas akhir, escrow terlepas dan sertifikat langsung siap dilihat tanpa reload.

## Phase 3: Dompet (Wallet), Escrow & Midtrans

- [x] **Task 3.1**: Tambahkan auto-dismiss & auto-sync di `WalletScreen.jsx` (Mobile) saat transaksi Midtrans Snap selesai.
- [x] **Task 3.2**: Periksa form penarikan saldo (Withdrawal) agar memvalidasi rekening & saldo minimum dengan pesan error yang jelas.

## Phase 4: Portofolio, Review & Rating Polish

- [x] **Task 4.1**: Rapikan tampilan bintang & ulasan di `PortfolioPage.jsx` dan `PortfolioScreen.jsx` (menggunakan ikon Star konsisten berpenampilan bintang).
- [x] **Task 4.2**: Sinkronkan toggle showcase sertifikat agar langsung tampil pada `TalentDetailPage.jsx`.

## Phase 5: Chat Real-time & Notifikasi

- [x] **Task 5.1**: Pastikan WebSocket chat memiliki mekanisme auto-reconnect saat jaringan putus-sambung.
- [x] **Task 5.2**: Update unread count badge secara realtime saat ada pesan baru atau notifikasi masuk.
