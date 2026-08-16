# ⚙️ Backend Specification — Makarya
**Tech: Python + FastAPI + MySQL + SQLAlchemy**
**Versi:** 1.0

---

## Struktur Folder Project

```
makarya-backend/
├── main.py                  ← Entry point FastAPI app
├── requirements.txt         ← Dependencies
├── .env                     ← Environment variables (gitignore!)
├── alembic/                 ← Database migrations
│   ├── alembic.ini
│   └── versions/
├── app/
│   ├── core/
│   │   ├── config.py        ← Settings dari .env
│   │   ├── security.py      ← JWT & Bcrypt utils
│   │   └── database.py      ← SQLAlchemy engine & session
│   ├── models/              ← SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── proposal.py
│   │   ├── submission.py
│   │   ├── wallet.py
│   │   └── ...
│   ├── schemas/             ← Pydantic request/response schemas
│   │   ├── user.py
│   │   ├── project.py
│   │   └── ...
│   ├── routers/             ← API route handlers
│   │   ├── auth.py
│   │   ├── projects.py
│   │   ├── proposals.py
│   │   ├── submissions.py
│   │   ├── payments.py
│   │   └── admin.py
│   ├── services/            ← Business logic
│   │   ├── escrow_service.py
│   │   ├── midtrans_service.py
│   │   ├── notification_service.py
│   │   └── ...
│   └── dependencies.py      ← get_current_user, get_db, dll
└── tests/
    └── test_api.py
```

---

## Environment Variables (.env)

```env
# Database
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/makarya_db

# JWT
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Midtrans
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxx
MIDTRANS_IS_PRODUCTION=false

# Firebase
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Dependencies (requirements.txt)

```txt
fastapi==0.110.0
uvicorn[standard]==0.27.0
sqlalchemy==2.0.28
alembic==1.13.1
pymysql==1.1.0
pydantic[email]==2.6.0
pydantic-settings==2.2.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9
midtransclient==1.4.2
firebase-admin==6.4.0
cloudinary==1.38.0
httpx==0.27.0
```

---

## Core Patterns

### 1. Dependency Injection — Auth

```python
# app/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.security import verify_token
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db = Depends(get_db)):
    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Token tidak valid")
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Akun tidak aktif")
    return user

def require_role(*roles):
    def checker(user: User = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Akses ditolak")
        return user
    return checker
```

### 2. Validasi Budget di Schema

```python
# app/schemas/project.py
from pydantic import BaseModel, validator
from decimal import Decimal

class ProjectCreate(BaseModel):
    judul: str
    deskripsi_raw: str
    kategori: str
    budget_max: Decimal
    deadline: date

    @validator('budget_max')
    def validate_budget(cls, v):
        if v > Decimal('2000000'):
            raise ValueError('Budget melebihi batas maksimal Rp 2.000.000')
        if v <= 0:
            raise ValueError('Budget harus lebih dari 0')
        return v
```

### 3. Escrow Logic — Service Layer

```python
# app/services/escrow_service.py
from sqlalchemy.orm import Session
from app.models.wallet import Wallet
from app.models.ledger import LedgerLog

def hold_escrow(db: Session, umkm_id: str, nominal: Decimal, project_id: str):
    wallet = db.query(Wallet).filter(Wallet.user_id == umkm_id).with_for_update().first()

    if wallet.saldo_aktif < nominal:
        raise HTTPException(status_code=400, detail="Saldo tidak cukup")

    wallet.saldo_aktif -= nominal
    wallet.saldo_escrow += nominal

    log = LedgerLog(
        wallet_id=wallet.id,
        project_id=project_id,
        tipe="HOLD",
        nominal=nominal,
        keterangan=f"Escrow hold untuk proyek {project_id}"
    )
    db.add(log)
    db.commit()

def release_escrow(db: Session, umkm_id: str, mhs_id: str, nominal: Decimal, project_id: str):
    umkm_wallet = db.query(Wallet).filter(Wallet.user_id == umkm_id).with_for_update().first()
    mhs_wallet = db.query(Wallet).filter(Wallet.user_id == mhs_id).with_for_update().first()

    umkm_wallet.saldo_escrow -= nominal
    mhs_wallet.saldo_aktif += nominal

    # Log kedua sisi transaksi
    db.add(LedgerLog(wallet_id=umkm_wallet.id, project_id=project_id,
                     tipe="RELEASE", nominal=nominal, keterangan="Dana dilepas ke mahasiswa"))
    db.add(LedgerLog(wallet_id=mhs_wallet.id, project_id=project_id,
                     tipe="RELEASE", nominal=nominal, keterangan="Dana diterima dari escrow"))
    db.commit()
```

### 4. Validasi Batas Revisi

```python
# app/routers/submissions.py
@router.patch("/{id}/revise")
async def request_revision(id: str, db = Depends(get_db),
                            current_user = Depends(require_role("UMKM"))):
    submission = db.query(Submission).filter(Submission.id == id).first()

    if submission.jumlah_revisi >= 2:
        raise HTTPException(
            status_code=400,
            detail="Batas revisi maksimal (2x) telah tercapai"
        )

    submission.jumlah_revisi += 1
    submission.status = "REVISION_REQUESTED"
    db.commit()
    # Kirim FCM notification ke mahasiswa ...
    return {"message": f"Revisi ke-{submission.jumlah_revisi} berhasil diminta"}
```

### 5. Midtrans Webhook (Idempotent)

```python
# app/routers/payments.py
@router.post("/webhook")
async def midtrans_webhook(payload: dict, db = Depends(get_db)):
    order_id = payload.get("order_id")
    status = payload.get("transaction_status")

    # Idempotency check — jangan proses dua kali
    existing = db.query(LedgerLog).filter(
        LedgerLog.referensi_gateway == order_id,
        LedgerLog.tipe == "TOPUP"
    ).first()

    if existing:
        return {"message": "Already processed"}

    if status == "settlement":
        # Proses top-up wallet...
        pass

    return {"message": "OK"}
```

---

## API Endpoints Summary

| Method | Endpoint | Auth | Role | Deskripsi |
|--------|----------|------|------|-----------|
| POST | `/auth/register/umkm` | ✗ | — | Registrasi UMKM |
| POST | `/auth/register/mahasiswa` | ✗ | — | Registrasi Mahasiswa |
| POST | `/auth/login` | ✗ | — | Login, return JWT |
| POST | `/auth/refresh` | ✗ | — | Refresh access token |
| GET | `/projects` | ✓ | MHS | Browse proyek terbuka |
| POST | `/projects` | ✓ | UMKM | Posting proyek baru |
| GET | `/projects/{id}` | ✓ | ALL | Detail proyek |
| PATCH | `/projects/{id}` | ✓ | UMKM | Edit proyek |
| DELETE | `/projects/{id}` | ✓ | UMKM | Hapus proyek |
| POST | `/proposals` | ✓ | MHS | Kirim proposal |
| PATCH | `/proposals/{id}/accept` | ✓ | UMKM | Terima proposal |
| PATCH | `/proposals/{id}/reject` | ✓ | UMKM | Tolak proposal |
| POST | `/submissions` | ✓ | MHS | Upload hasil kerja |
| PATCH | `/submissions/{id}/approve` | ✓ | UMKM | Setujui hasil kerja |
| PATCH | `/submissions/{id}/revise` | ✓ | UMKM | Minta revisi (maks 2x) |
| POST | `/payments/topup` | ✓ | UMKM | Inisiasi top-up Midtrans |
| POST | `/payments/webhook` | ✗ | — | Webhook dari Midtrans |
| POST | `/withdrawals` | ✓ | MHS | Request withdraw |
| GET | `/admin/accounts` | ✓ | ADMIN | List akun pending verifikasi |
| PATCH | `/admin/accounts/{id}/verify` | ✓ | ADMIN | Verifikasi akun mahasiswa |
| GET | `/admin/disputes` | ✓ | ADMIN | Daftar sengketa |
| PATCH | `/admin/disputes/{id}/resolve` | ✓ | ADMIN | Selesaikan sengketa |

---

## Cara Menjalankan (Development)

```bash
# Clone & setup
git clone https://github.com/darell/makarya-backend
cd makarya-backend
python -m venv venv
venv\Scripts\activate         # Windows
pip install -r requirements.txt

# Setup database
alembic upgrade head

# Jalankan server
uvicorn main:app --reload --port 8000

# Akses dokumentasi API otomatis
# http://localhost:8000/docs
```
