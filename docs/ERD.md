# 🗄️ ERD — Entity Relationship Diagram
**Makarya Database Schema | MySQL 8.0+ | Normalisasi 3NF**

---

## Diagram ERD

```mermaid
erDiagram
    USERS {
        uuid id PK
        varchar email UK
        varchar password_hash
        enum role "UMKM, MHS, ADMIN"
        boolean is_verified
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    MASTER_PRODI {
        int id PK
        varchar nama_prodi
        varchar fakultas
    }

    MASTER_SKILLS {
        int id PK
        varchar kategori
        varchar nama_skill
    }

    PROFILES_MHS {
        uuid user_id PK_FK
        int prodi_id FK
        varchar nama_lengkap
        varchar nim
        varchar url_ktm
        varchar url_foto
        varchar url_portfolio
        text bio
        decimal rating_avg
        int total_proyek_selesai
    }

    PROFILES_UMKM {
        uuid user_id PK_FK
        varchar nama_usaha
        varchar bidang_industri
        varchar alamat
        varchar kota
        varchar no_kontak
        varchar url_foto_usaha
    }

    MHS_SKILLS {
        uuid mhs_id FK
        int skill_id FK
        enum tingkat "BEGINNER, INTERMEDIATE, ADVANCED"
    }

    PROJECTS {
        uuid id PK
        uuid umkm_id FK
        varchar judul
        text deskripsi_raw
        enum kategori "DESAIN, UIUX, PROGRAMMING, VIDEO, COPYWRITING, ADMIN"
        decimal budget_max
        date deadline
        enum status "OPEN, BIDDING, IN_PROGRESS, REVIEW, DONE, CANCELLED"
        timestamp created_at
        timestamp updated_at
    }

    AI_REQUIREMENTS {
        uuid id PK
        uuid project_id FK
        int skill_id FK
        decimal ai_confidence_score
        timestamp processed_at
    }

    PROPOSALS {
        uuid id PK
        uuid project_id FK
        uuid mhs_id FK
        decimal harga_tawar
        text cover_letter
        int estimasi_hari
        enum status "PENDING, ACCEPTED, REJECTED, WITHDRAWN"
        timestamp created_at
        timestamp updated_at
    }

    SUBMISSIONS {
        uuid id PK
        uuid proposal_id FK
        varchar url_berkas
        varchar url_source_file
        text catatan_pengiriman
        int jumlah_revisi
        enum status "SUBMITTED, REVISION_REQUESTED, APPROVED"
        timestamp submitted_at
        timestamp updated_at
    }

    WALLETS {
        uuid id PK
        uuid user_id FK
        decimal saldo_aktif
        decimal saldo_escrow
        timestamp updated_at
    }

    LEDGER_LOGS {
        uuid id PK
        uuid wallet_id FK
        uuid project_id FK
        enum tipe "TOPUP, HOLD, RELEASE, WITHDRAW, REFUND"
        decimal nominal
        varchar referensi_gateway
        text keterangan
        timestamp created_at
    }

    RATINGS {
        uuid id PK
        uuid project_id FK
        uuid dari_user_id FK
        uuid ke_user_id FK
        int skor
        text ulasan
        timestamp created_at
    }

    DISPUTES {
        uuid id PK
        uuid project_id FK
        uuid pelapor_id FK
        text deskripsi_masalah
        enum status "OPEN, IN_REVIEW, RESOLVED, CLOSED"
        text resolusi_admin
        uuid admin_id FK
        timestamp created_at
        timestamp resolved_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        varchar judul
        text pesan
        varchar url_referensi
        enum tipe "PROPOSAL, PAYMENT, SUBMISSION, SYSTEM, DISPUTE"
        boolean is_read
        timestamp created_at
    }

    USERS ||--o| PROFILES_MHS : "has"
    USERS ||--o| PROFILES_UMKM : "has"
    USERS ||--|| WALLETS : "owns"
    MASTER_PRODI ||--o{ PROFILES_MHS : "belongs to"
    PROFILES_MHS ||--o{ MHS_SKILLS : "has"
    MASTER_SKILLS ||--o{ MHS_SKILLS : "categorizes"
    USERS ||--o{ PROJECTS : "posts"
    PROJECTS ||--o{ AI_REQUIREMENTS : "analyzed by"
    MASTER_SKILLS ||--o{ AI_REQUIREMENTS : "tagged as"
    PROJECTS ||--o{ PROPOSALS : "receives"
    PROFILES_MHS ||--o{ PROPOSALS : "submits"
    PROPOSALS ||--o| SUBMISSIONS : "has"
    WALLETS ||--o{ LEDGER_LOGS : "records"
    PROJECTS ||--o{ RATINGS : "has"
    PROJECTS ||--o{ DISPUTES : "triggers"
    USERS ||--o{ NOTIFICATIONS : "receives"
```

---

## Deskripsi Tabel Lengkap

### Modul Autentikasi & Profil

#### `users` — Tabel induk semua pengguna
| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| `id` | UUID | PK | Generated UUID v4 |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login identifier |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hash |
| `role` | ENUM | NOT NULL | UMKM / MHS / ADMIN |
| `is_verified` | BOOLEAN | DEFAULT FALSE | Diverifikasi admin/email |
| `is_active` | BOOLEAN | DEFAULT TRUE | Untuk suspend akun |
| `created_at` | TIMESTAMP | DEFAULT NOW() | — |
| `updated_at` | TIMESTAMP | ON UPDATE NOW() | — |

#### `master_prodi` — Referensi program studi
| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| `id` | INT | PK, AUTO_INCREMENT | — |
| `nama_prodi` | VARCHAR(100) | NOT NULL | Misal: Sistem Informasi |
| `fakultas` | VARCHAR(100) | NOT NULL | — |

#### `master_skills` — Master daftar keahlian
| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| `id` | INT | PK, AUTO_INCREMENT | — |
| `kategori` | VARCHAR(50) | NOT NULL | Misal: Desain, Programming |
| `nama_skill` | VARCHAR(100) | NOT NULL | Misal: UI Design, React.js |

#### `profiles_mhs` — Profil mahasiswa
| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| `user_id` | UUID | PK, FK → users | 1-to-1 dengan users |
| `prodi_id` | INT | FK → master_prodi | — |
| `nama_lengkap` | VARCHAR(150) | NOT NULL | — |
| `nim` | VARCHAR(20) | — | Nomor Induk Mahasiswa |
| `url_ktm` | TEXT | — | Link foto KTM di Cloudinary |
| `url_foto` | TEXT | — | Foto profil |
| `url_portfolio` | TEXT | — | Link portofolio eksternal |
| `bio` | TEXT | — | Deskripsi diri |
| `rating_avg` | DECIMAL(3,2) | DEFAULT 0 | Rata-rata rating |
| `total_proyek_selesai` | INT | DEFAULT 0 | Counter proyek selesai |

#### `profiles_umkm` — Profil UMKM
| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| `user_id` | UUID | PK, FK → users | 1-to-1 dengan users |
| `nama_usaha` | VARCHAR(150) | NOT NULL | — |
| `bidang_industri` | VARCHAR(100) | — | Kuliner, Fashion, dll |
| `alamat` | TEXT | — | — |
| `kota` | VARCHAR(100) | — | Untuk filter lokasi |
| `no_kontak` | VARCHAR(20) | — | WhatsApp/HP |
| `url_foto_usaha` | TEXT | — | Foto toko/usaha |

#### `mhs_skills` — Junction table mahasiswa × skill
| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| `mhs_id` | UUID | FK → profiles_mhs | — |
| `skill_id` | INT | FK → master_skills | — |
| `tingkat` | ENUM | NOT NULL | BEGINNER / INTERMEDIATE / ADVANCED |
| **PK** | — | (mhs_id, skill_id) | Composite primary key |

---

### Modul Proyek

#### `projects` — Data proyek yang diposting UMKM
| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| `id` | UUID | PK | — |
| `umkm_id` | UUID | FK → users | Pembuat proyek |
| `judul` | VARCHAR(200) | NOT NULL | — |
| `deskripsi_raw` | TEXT | NOT NULL | Deskripsi asli dari UMKM |
| `kategori` | ENUM | NOT NULL | Kategori layanan |
| `budget_max` | DECIMAL(12,2) | NOT NULL, CHECK ≤ 2000000 | — |
| `deadline` | DATE | NOT NULL | — |
| `status` | ENUM | DEFAULT 'OPEN' | Status alur proyek |

#### `ai_requirements` — Hasil analisis AI
| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| `id` | UUID | PK | — |
| `project_id` | UUID | FK → projects | — |
| `skill_id` | INT | FK → master_skills | Tag skill yang dideteksi |
| `ai_confidence_score` | DECIMAL(4,3) | — | Nilai 0.000 – 1.000 |
| `processed_at` | TIMESTAMP | DEFAULT NOW() | — |

#### `proposals` — Lamaran mahasiswa ke proyek
| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| `id` | UUID | PK | — |
| `project_id` | UUID | FK → projects | — |
| `mhs_id` | UUID | FK → users | — |
| `harga_tawar` | DECIMAL(12,2) | NOT NULL | — |
| `cover_letter` | TEXT | NOT NULL | — |
| `estimasi_hari` | INT | NOT NULL | — |
| `status` | ENUM | DEFAULT 'PENDING' | — |

#### `submissions` — Pengiriman hasil kerja
| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| `id` | UUID | PK | — |
| `proposal_id` | UUID | FK → proposals | 1-to-1 |
| `url_berkas` | TEXT | NOT NULL | Link file final |
| `url_source_file` | TEXT | — | Link source file |
| `catatan_pengiriman` | TEXT | — | Pesan dari mahasiswa |
| `jumlah_revisi` | INT | DEFAULT 0, CHECK ≤ 2 | **Hardcoded maks 2** |
| `status` | ENUM | DEFAULT 'SUBMITTED' | — |

---

### Modul Keuangan

#### `wallets` — Dompet digital setiap user
| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| `id` | UUID | PK | — |
| `user_id` | UUID | FK → users, UNIQUE | 1-to-1 |
| `saldo_aktif` | DECIMAL(15,2) | DEFAULT 0 | Dana bisa dipakai/withdraw |
| `saldo_escrow` | DECIMAL(15,2) | DEFAULT 0 | Dana tertahan untuk proyek aktif |

#### `ledger_logs` — Audit trail transaksi (immutable)
| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| `id` | UUID | PK | — |
| `wallet_id` | UUID | FK → wallets | Wallet yang bergerak |
| `project_id` | UUID | FK → projects, NULL | Referensi proyek (jika ada) |
| `tipe` | ENUM | NOT NULL | TOPUP/HOLD/RELEASE/WITHDRAW/REFUND |
| `nominal` | DECIMAL(15,2) | NOT NULL | Jumlah transaksi |
| `referensi_gateway` | VARCHAR(100) | — | ID dari Midtrans |
| `keterangan` | TEXT | — | Deskripsi transaksi |
| `created_at` | TIMESTAMP | DEFAULT NOW() | **Tidak ada UPDATE/DELETE** |

---

### Modul Tambahan

#### `ratings` — Rating & review antar pengguna
#### `disputes` — Sengketa proyek (dimediasi admin)
#### `notifications` — Push notification log

> Detail kolom tabel tambahan tersedia di skema SQL di folder `backend/`.

---

## Catatan Normalisasi (3NF)

- Tidak ada atribut yang bergantung secara transitif pada non-primary key
- `master_prodi` dan `master_skills` dipisah sebagai tabel referensi
- `ledger_logs` tidak boleh di-UPDATE atau DELETE — hanya INSERT (append-only)
- `saldo_escrow` dan `saldo_aktif` dipisah untuk mencegah race condition finansial
