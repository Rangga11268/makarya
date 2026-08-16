# 🏗️ Arsitektur Sistem — Makarya
**Versi:** 1.0

---

## 1. High-Level Architecture

```
┌──────────────────────────┐     ┌──────────────────────────┐
│   React Native           │     │   React.js Web App        │
│   Mobile App             │     │   (Mahasiswa + Admin)     │
│   (UMKM - Android/iOS)   │     │                          │
└────────────┬─────────────┘     └────────────┬─────────────┘
             │                                │
             │           REST API (HTTPS/JSON)
             └─────────────────┬──────────────┘
                               │
                  ┌────────────▼────────────┐
                  │    FastAPI (Python)      │
                  │    Main Backend API      │
                  │    Port: 8000            │
                  └──┬──────────┬───────────┘
                     │          │
          ┌──────────▼──┐    ┌──▼──────────────────┐
          │   MySQL      │    │  AI Microservice     │
          │  Database    │    │  FastAPI Python      │
          │  (3NF)       │    │  Port: 8001          │
          └──────────────┘    │  (Opsional/Topping)  │
                              └──────────────────────┘
                     │
          ┌──────────▼──────────────────────┐
          │        External Services         │
          │  ┌─────────────────────────┐    │
          │  │ Midtrans Payment Gateway│    │
          │  │ (VA, QRIS, Webhook)     │    │
          │  └─────────────────────────┘    │
          │  ┌─────────────────────────┐    │
          │  │ Firebase Cloud Messaging│    │
          │  │ (Push Notification)     │    │
          │  └─────────────────────────┘    │
          │  ┌─────────────────────────┐    │
          │  │ Cloudinary              │    │
          │  │ (File & Image Storage)  │    │
          │  └─────────────────────────┘    │
          └─────────────────────────────────┘
```

---

## 2. Tech Stack Final

### Frontend Layer

| Teknologi | Versi | Digunakan Untuk |
|-----------|-------|-----------------|
| **React.js** | 18+ | Web App (mahasiswa & admin) |
| **Tailwind CSS** | 3.x | Styling web — utility first |
| **React Router** | v6 | Navigasi halaman web |
| **Axios** | latest | HTTP client untuk API call |
| **React Native** | 0.73+ | Mobile App (UMKM — Android & iOS) |
| **React Navigation** | v6 | Navigasi mobile (Stack + Bottom Tab) |
| **React Native Paper** | latest | UI component library mobile |

### Backend Layer

| Teknologi | Versi | Digunakan Untuk |
|-----------|-------|-----------------|
| **Python** | 3.11+ | Bahasa backend utama |
| **FastAPI** | 0.110+ | REST API framework |
| **SQLAlchemy** | 2.x | ORM untuk MySQL |
| **Alembic** | latest | Database migration |
| **Pydantic** | v2 | Validasi request/response schema |
| **python-jose** | latest | JWT token management |
| **Bcrypt** | latest | Password hashing |
| **Uvicorn** | latest | ASGI server |

### Database & Storage

| Teknologi | Digunakan Untuk |
|-----------|-----------------|
| **MySQL 8.0+** | Database relasional utama (3NF) |
| **Cloudinary** | Upload file deliverable, KTM, foto profil |

### External Services

| Teknologi | Digunakan Untuk |
|-----------|-----------------|
| **Midtrans** | Payment gateway — Virtual Account, QRIS |
| **Firebase FCM** | Push notification mobile & web |

### AI Layer (Opsional — Future Work)

| Teknologi | Digunakan Untuk |
|-----------|-----------------|
| **HuggingFace Transformers** | Zero-shot classification NLP |
| **IndoBERT / BART** | Model klasifikasi bahasa Indonesia |

### Development Tools

| Teknologi | Digunakan Untuk |
|-----------|-----------------|
| **GitHub** | Version control, branching per fitur |
| **VS Code / WebStorm** | IDE pengembangan |
| **Postman** | Testing API endpoint |
| **Figma** | UI/UX design & wireframing |
| **Railway** | Hosting untuk demo sidang |
| **Swagger (built-in FastAPI)** | Dokumentasi API otomatis di `/docs` |

---

## 3. API Design Pattern

Semua endpoint mengikuti konvensi REST:

```
Base URL: https://api.makarya.id/v1

Auth:
POST   /auth/register/umkm
POST   /auth/register/mahasiswa
POST   /auth/login
POST   /auth/refresh

Proyek:
GET    /projects              ← list proyek terbuka
POST   /projects              ← buat proyek baru
GET    /projects/{id}         ← detail proyek
PATCH  /projects/{id}         ← edit proyek
DELETE /projects/{id}         ← hapus proyek

Proposal:
POST   /proposals             ← kirim proposal
GET    /proposals/{id}
PATCH  /proposals/{id}/accept
PATCH  /proposals/{id}/reject

Submission:
POST   /submissions           ← upload hasil kerja
PATCH  /submissions/{id}/approve
PATCH  /submissions/{id}/revise

Keuangan:
POST   /payments/topup        ← init pembayaran Midtrans
POST   /payments/webhook      ← menerima notif dari Midtrans
POST   /withdrawals           ← request withdraw mahasiswa

Admin:
GET    /admin/accounts        ← list akun untuk verifikasi
PATCH  /admin/accounts/{id}/verify
GET    /admin/disputes
PATCH  /admin/disputes/{id}/resolve
```

---

## 4. Security Architecture

```
Request masuk
     │
     ▼
Rate Limiting (middleware)
     │
     ▼
HTTPS/TLS (transport layer)
     │
     ▼
JWT Validation (auth middleware)
     │
     ├── Token invalid → 401 Unauthorized
     │
     ▼
Role Check (UMKM / MHS / ADMIN)
     │
     ├── Role tidak sesuai → 403 Forbidden
     │
     ▼
Input Validation (Pydantic schema)
     │
     ├── Validasi gagal → 422 Unprocessable Entity
     │
     ▼
Business Logic Handler
     │
     ▼
Response
```

---

## 5. Deployment Architecture (Untuk Demo Sidang)

```
GitHub Repository
       │
       │ Push to main
       ▼
Railway.app (PaaS)
├── Service 1: FastAPI Backend (Python)
│   └── Terhubung ke MySQL
├── Service 2: MySQL Database
├── Service 3: React.js Web (Nginx)
└── (Opsional) Service 4: AI Microservice

Cloudinary       ← File storage eksternal
Firebase         ← Push notification eksternal
Midtrans Sandbox ← Payment testing
```

> **Catatan Skripsi:** Gunakan Midtrans **Sandbox mode** selama pengembangan dan demo sidang. Tidak perlu live mode.
