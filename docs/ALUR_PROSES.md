# 🔄 Alur Proses — Sequence Diagram
**Makarya | Versi 1.0**

---

## SD-01: Alur Registrasi & Verifikasi Mahasiswa

```
Mahasiswa        Web App         FastAPI BE       Email/Cloudinary    Admin
    │               │                │                  │               │
    │─ Isi form ───►│                │                  │               │
    │  email .ac.id │                │                  │               │
    │  + data prodi │─ POST ────────►│                  │               │
    │               │  /register/mhs │                  │               │
    │               │                │─ Cek email ──────►              │
    │               │                │  domain .ac.id    │               │
    │               │                │                  │               │
    │               │                │  [Jika non .ac.id]               │
    │               │                │─ Minta KTM ──────►              │
    │               │                │◄─ URL KTM ────────              │
    │               │                │                  │               │
    │               │                │─ INSERT users ───►              │
    │               │                │  (is_verified=false)             │
    │               │◄─ 201 Created ─│                  │               │
    │◄─ "Menunggu   │                │                  │               │
    │   verifikasi" │                │                  │               │
    │               │                │                  │        ◄─ Admin login
    │               │                │                  │        │  lihat antrian
    │               │                │                  │─ PATCH ►│
    │               │                │                  │ /admin/accounts/{id}/verify
    │               │                │◄─────────────────────────────────│
    │               │                │─ UPDATE is_verified=true          │
    │◄─ Notifikasi  │                │─ FCM Push ────────────────────────
    │   "Akun aktif"│                │
```

---

## SD-02: Alur Posting Proyek & Notifikasi Mahasiswa

```
UMKM         Mobile App       FastAPI BE      AI Service (opt)    DB           Mahasiswa
  │               │                │                │               │               │
  │─ Isi form ───►│                │                │               │               │
  │  judul,       │                │                │               │               │
  │  deskripsi,   │─ POST ────────►│                │               │               │
  │  budget, dll  │  /projects     │                │               │               │
  │               │                │─ Validasi ─────────────────────               │
  │               │                │  budget ≤ 2jt  │               │               │
  │               │                │                │               │               │
  │               │                │─ [Opsional] ──►│               │               │
  │               │                │  Kirim teks    │               │               │
  │               │                │◄─ Skill tags ──│               │               │
  │               │                │  + confidence  │               │               │
  │               │                │                │               │               │
  │               │                │─ INSERT projects ─────────────►│               │
  │               │                │─ INSERT ai_requirements ───────►│               │
  │               │                │                │               │               │
  │               │                │─ QUERY mhs dengan skill match ─►│               │
  │               │                │◄─ List mhs_id ─────────────────│               │
  │               │                │                │               │               │
  │               │◄─ 201 Created ─│                │               │               │
  │◄─ "Proyek     │                │─ FCM Push ─────────────────────────────────►  │
  │   berhasil"   │                │                │               │  "Proyek baru │
  │               │                │                │               │   sesuai skill│
  │               │                │                │               │   kamu!"      │
```

---

## SD-03: Alur Kirim & Terima Proposal

```
Mahasiswa       Web App         FastAPI BE          DB           Mobile UMKM
    │               │                │               │               │
    │─ Buka proyek ►│                │               │               │
    │               │─ GET ─────────►│               │               │
    │               │  /projects/{id}│               │               │
    │               │◄─ Detail ──────│               │               │
    │◄─ Tampil ──────│               │               │               │
    │               │                │               │               │
    │─ Isi proposal ►│               │               │               │
    │  harga, cover  │─ POST ────────►│               │               │
    │  letter, hari  │  /proposals    │               │               │
    │               │                │─ INSERT ──────►│               │
    │               │◄─ 201 Created ─│               │               │
    │◄─ "Proposal    │               │               │               │
    │   terkirim"    │               │─ FCM Push ─────────────────────►
    │               │                │               │   "Proposal    │
    │               │                │               │    baru masuk" │
    │               │                │               │               │
    │               │                │               │    UMKM review►│
    │               │                │               │    dan terima  │
    │               │                │◄──────────────────────────────│
    │               │                │ PATCH /proposals/{id}/accept  │
    │               │                │─ UPDATE proposal.status=ACCEPTED
    │               │                │─ UPDATE project.status=IN_PROGRESS
    │               │                │─ HOLD saldo_escrow ───────────►│
    │               │                │─ INSERT ledger HOLD ───────────►│
    │               │◄───────────────│               │               │
    │◄─ Notif ───────│               │               │               │
    │   "Proposal    │               │               │               │
    │    diterima!"  │               │               │               │
```

---

## SD-04: Alur Escrow & Pembayaran (UMKM Top-up)

```
UMKM         Mobile App       FastAPI BE        Midtrans          DB
  │               │                │                │               │
  │─ Top-up ─────►│                │                │               │
  │  nominal X    │─ POST ────────►│                │               │
  │               │  /payments/topup│               │               │
  │               │                │─ Create charge►│               │
  │               │                │◄─ VA Number ───│               │
  │               │◄─ VA Info ─────│                │               │
  │◄─ Tampil VA ──│                │                │               │
  │               │                │                │               │
  │─ Transfer via─►                │                │               │
  │  bank/QRIS    │                │                │               │
  │               │                │◄─ Webhook ─────│               │
  │               │                │  payment.status= SETTLEMENT    │
  │               │                │─ Idempotency check ────────────►
  │               │                │  (cek referensi_gateway)       │
  │               │                │─ UPDATE saldo_aktif += X ──────►│
  │               │                │─ INSERT ledger TOPUP ──────────►│
  │               │◄───────────────│               │               │
  │◄─ Notif ───────│               │                │               │
  │   "Saldo +X"  │                │                │               │
```

---

## SD-05: Alur Pengiriman & Approval Hasil Kerja

```
Mahasiswa       Web App         FastAPI BE       Cloudinary        DB         UMKM Mobile
    │               │                │                │               │               │
    │─ Upload file ─►│               │                │               │               │
    │               │─ POST file ───►│                │               │               │
    │               │               │─ Upload ───────►│               │               │
    │               │               │◄─ URL berkas ───│               │               │
    │               │               │─ INSERT submissions ───────────►│               │
    │               │               │  status=SUBMITTED               │               │
    │               │◄─ 201 Created ─│               │               │               │
    │◄─ "Berhasil    │               │─ FCM Push ──────────────────────────────────►  │
    │   dikirim"    │               │               │               │  "Hasil kerja   │
    │               │               │               │               │   telah dikirim"│
    │               │               │               │               │               │
    │               │               │               │               │  ◄─ UMKM review│
    │               │               │               │               │     dan approve │
    │               │               │◄──────────────────────────────────────────────│
    │               │               │ PATCH /submissions/{id}/approve               │
    │               │               │─ UPDATE submission.status=APPROVED            │
    │               │               │─ UPDATE project.status=DONE                   │
    │               │               │─ RELEASE escrow ────────────────────────────► │
    │               │               │  saldo_escrow UMKM → saldo_aktif MHS          │
    │               │               │─ INSERT ledger RELEASE ────────────────────── │
    │               │◄──────────────│               │               │               │
    │◄─ Notif ───────│               │               │               │               │
    │   "Dana cair! │               │               │               │               │
    │    +Rp X"     │               │               │               │               │
```

---

## SD-06: Alur Request Revisi (dengan Batas 2x)

```
UMKM         Mobile App       FastAPI BE          DB
  │               │                │               │
  │─ Klik         │                │               │
  │   Minta Revisi►│               │               │
  │               │─ PATCH ───────►│               │
  │               │ /submissions/{id}/revise       │
  │               │                │─ GET jumlah_revisi ────────────►
  │               │                │◄─ current count ───────────────
  │               │                │               │
  │               │                │ IF count >= 2:│
  │               │                │─ return 400 ──►
  │               │◄─ Error 400 ───│  "Max revision│
  │◄─ Tombol      │  "Batas revisi │   reached"    │
  │   disabled    │   habis"       │               │
  │               │                │               │
  │               │                │ IF count < 2: │
  │               │                │─ UPDATE jumlah_revisi += 1 ────►
  │               │                │─ UPDATE status=REVISION_REQUESTED
  │               │◄─ 200 OK ──────│               │
  │◄─ Notif ───────│               │─ FCM → Mahasiswa "Ada revisi"
```
