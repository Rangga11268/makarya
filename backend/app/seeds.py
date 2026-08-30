from datetime import datetime, timedelta, timezone
from decimal import Decimal
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.master import MasterProdi, MasterSkill
from app.models.user import User, UserRole
from app.models.profile import ProfileMhs, ProfileUmkm
from app.models.wallet import Wallet
from app.models.project import Project, ProjectStatus, ProjectCategory

PRODI_SEEDS = [
    {"nama_prodi": "Sistem Informasi", "fakultas": "Teknologi Informasi"},
    {"nama_prodi": "Teknologi Informasi", "fakultas": "Teknologi Informasi"},
    {"nama_prodi": "Informatika", "fakultas": "Teknologi Informasi"},
    {"nama_prodi": "Rekayasa Perangkat Lunak", "fakultas": "Teknologi Informasi"},
    {"nama_prodi": "Manajemen", "fakultas": "Ekonomi & Bisnis"},
    {"nama_prodi": "Akuntansi", "fakultas": "Ekonomi & Bisnis"},
    {"nama_prodi": "Ilmu Komunikasi", "fakultas": "Komunikasi & Bahasa"},
    {"nama_prodi": "Desain Komunikasi Visual", "fakultas": "Komunikasi & Bahasa"},
]

SKILL_SEEDS = [
    {"kategori": "DESIGN", "nama_skill": "Logo & Branding"},
    {"kategori": "DESIGN", "nama_skill": "Desain Menu & Banner"},
    {"kategori": "DESIGN", "nama_skill": "Desain Kemasan (Packaging)"},
    {"kategori": "UIUX", "nama_skill": "UI/UX Website"},
    {"kategori": "UIUX", "nama_skill": "UI/UX Mobile App"},
    {"kategori": "UIUX", "nama_skill": "Wireframing & Prototyping"},
    {"kategori": "PEMROGRAMAN", "nama_skill": "Landing Page HTML/CSS"},
    {"kategori": "PEMROGRAMAN", "nama_skill": "WordPress / Web Builder"},
    {"kategori": "PEMROGRAMAN", "nama_skill": "Fullstack Web (React/Python/PHP)"},
    {"kategori": "VIDEO", "nama_skill": "Video Reels / TikTok Promosi"},
    {"kategori": "VIDEO", "nama_skill": "Fotografi Produk UMKM"},
    {"kategori": "COPYWRITING", "nama_skill": "Copywriting Iklan & Social Media"},
    {"kategori": "COPYWRITING", "nama_skill": "Artikel SEO"},
    {"kategori": "ADMIN_DATA", "nama_skill": "Entry Data Excel / Spreadsheet"},
    {"kategori": "ADMIN_DATA", "nama_skill": "Pembukuan Keuangan Sederhana"},
]

def seed_all():
    db = SessionLocal()
    try:
        print("[1/4] Memulai seeding master data Prodi & Skills...")

        for item in PRODI_SEEDS:
            exists = db.query(MasterProdi).filter(MasterProdi.nama_prodi == item["nama_prodi"]).first()
            if not exists:
                db.add(MasterProdi(**item))
                print(f"  + Ditambahkan Prodi: {item['nama_prodi']}")

        for item in SKILL_SEEDS:
            exists = db.query(MasterSkill).filter(MasterSkill.nama_skill == item["nama_skill"]).first()
            if not exists:
                db.add(MasterSkill(**item))
                print(f"  + Ditambahkan Skill: {item['nama_skill']}")

        db.commit()

        print("\n[2/4] Memulai seeding Akun Pengguna (Admin, Mahasiswa, UMKM)...")
        password_hashed = hash_password("password123")

        # Admin
        admin_email = "admin@makarya.id"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            admin = User(
                email=admin_email,
                password_hash=password_hashed,
                role=UserRole.ADMIN,
                is_verified=True,
            )
            db.add(admin)
            db.flush()
            db.add(Wallet(user_id=admin.id, saldo_aktif=Decimal("0"), saldo_escrow=Decimal("0")))
            print(f"  + Admin dibuat: {admin_email}")

        # Mahasiswa
        mhs_data = [
            {
                "email": "darell@ubsi.ac.id",
                "nama": "Darell Rangga Putra",
                "nim": "12219999",
                "prodi_id": 1,
                "rating": Decimal("5.0"),
                "total": 8,
            },
            {
                "email": "adelia@ubsi.ac.id",
                "nama": "Adelia Putri",
                "nim": "12210002",
                "prodi_id": 8,
                "rating": Decimal("4.9"),
                "total": 11,
            },
            {
                "email": "bima@ubsi.ac.id",
                "nama": "Bima Arya",
                "nim": "12210003",
                "prodi_id": 2,
                "rating": Decimal("5.0"),
                "total": 6,
            },
        ]

        for m in mhs_data:
            user = db.query(User).filter(User.email == m["email"]).first()
            if not user:
                user = User(
                    email=m["email"],
                    password_hash=password_hashed,
                    role=UserRole.MHS,
                    is_verified=True,
                )
                db.add(user)
                db.flush()

                profile = ProfileMhs(
                    user_id=user.id,
                    nama_lengkap=m["nama"],
                    nim=m["nim"],
                    prodi_id=m["prodi_id"],
                    rating_avg=m["rating"],
                    total_proyek_selesai=m["total"],
                )
                db.add(profile)

                wallet = Wallet(user_id=user.id, saldo_aktif=Decimal("350000"), saldo_escrow=Decimal("0"))
                db.add(wallet)
                print(f"  + Mahasiswa dibuat: {m['email']} - {m['nama']}")

        # UMKM
        umkm_data = [
            {
                "email": "kopi.nusantara@gmail.com",
                "nama_usaha": "Kopi Kenangan Nusantara",
                "bidang": "F&B / Kuliner Kopi",
                "kota": "Jakarta Selatan",
                "alamat": "Jl. Senopati No. 45, Kebayoran Baru",
            },
            {
                "email": "batik.lestari@gmail.com",
                "nama_usaha": "Batik Lestari Heritage",
                "bidang": "Fashion & Tekstil",
                "kota": "Pekalongan",
                "alamat": "Jl. Hayam Wuruk No. 12",
            },
            {
                "email": "dapur.mama@gmail.com",
                "nama_usaha": "Dapur Mama Bakery",
                "bidang": "Kuliner Roti & Pastry",
                "kota": "Bekasi",
                "alamat": "Ruko Harapan Indah Blok B-12",
            },
        ]

        for u in umkm_data:
            user = db.query(User).filter(User.email == u["email"]).first()
            if not user:
                user = User(
                    email=u["email"],
                    password_hash=password_hashed,
                    role=UserRole.UMKM,
                    is_verified=True,
                )
                db.add(user)
                db.flush()

                profile = ProfileUmkm(
                    user_id=user.id,
                    nama_usaha=u["nama_usaha"],
                    bidang_industri=u["bidang"],
                    kota=u["kota"],
                    alamat=u["alamat"],
                )
                db.add(profile)

                wallet = Wallet(user_id=user.id, saldo_aktif=Decimal("2000000"), saldo_escrow=Decimal("0"))
                db.add(wallet)
                print(f"  + UMKM dibuat: {u['email']} - {u['nama_usaha']}")

        db.commit()

        print("\n[3/4] Memulai seeding Koleksi Proyek UMKM Lengkap...")
        kopi_user = db.query(User).filter(User.email == "kopi.nusantara@gmail.com").first()
        batik_user = db.query(User).filter(User.email == "batik.lestari@gmail.com").first()
        dapur_user = db.query(User).filter(User.email == "dapur.mama@gmail.com").first()

        sample_projects = [
            # DESIGN
            {
                "umkm_id": kopi_user.id if kopi_user else None,
                "judul": "Desain Ulang Logo & Brand Identity Kedai Kopi",
                "kategori": ProjectCategory.DESIGN,
                "deskripsi_raw": "Kami membutuhkan peremajaan logo kedai kopi agar terlihat lebih modern, minimalis, dan estetik untuk kemasan paper cup dan media sosial Instagram.",
                "budget_max": Decimal("650000"),
                "deadline": (datetime.now(timezone.utc) + timedelta(days=7)).date(),
                "status": ProjectStatus.OPEN,
            },
            {
                "umkm_id": batik_user.id if batik_user else None,
                "judul": "Desain Banner Promosi & Katalog Produk Ramadhan",
                "kategori": ProjectCategory.DESIGN,
                "deskripsi_raw": "Dibutuhkan 5 set banner promosi digital untuk postingan feed Instagram dan flyer cetak A5 bertema Ramadhan Festive Batik.",
                "budget_max": Decimal("400000"),
                "deadline": (datetime.now(timezone.utc) + timedelta(days=6)).date(),
                "status": ProjectStatus.OPEN,
            },
            # PEMROGRAMAN
            {
                "umkm_id": kopi_user.id if kopi_user else None,
                "judul": "Pembuatan Website Landing Page Menu & Reservasi",
                "kategori": ProjectCategory.PEMROGRAMAN,
                "deskripsi_raw": "Dibutuhkan mahasiswa web developer untuk membangun landing page responsive 1 halaman berisi menu digital, foto suasana kedai, dan integrasi tombol chat WhatsApp reservasi.",
                "budget_max": Decimal("1200000"),
                "deadline": (datetime.now(timezone.utc) + timedelta(days=14)).date(),
                "status": ProjectStatus.OPEN,
            },
            {
                "umkm_id": dapur_user.id if dapur_user else None,
                "judul": "Sistem Web Kasir & Manajemen Stok Roti Sederhana",
                "kategori": ProjectCategory.PEMROGRAMAN,
                "deskripsi_raw": "Membangun aplikasi web POS kasir sederhana berbasis React/PHP untuk mencatat penjualan harian roti dan rekap sisa stok bahan baku.",
                "budget_max": Decimal("1500000"),
                "deadline": (datetime.now(timezone.utc) + timedelta(days=20)).date(),
                "status": ProjectStatus.OPEN,
            },
            # UIUX
            {
                "umkm_id": batik_user.id if batik_user else None,
                "judul": "Desain UI/UX Aplikasi Mobile Katalog Batik",
                "kategori": ProjectCategory.UIUX,
                "deskripsi_raw": "Mencari mahasiswa UI/UX yang dapat merancang mockup Figma 5-7 layar untuk aplikasi katalog produk batik, mulai dari beranda, detail produk, filter motif, hingga keranjang.",
                "budget_max": Decimal("950000"),
                "deadline": (datetime.now(timezone.utc) + timedelta(days=10)).date(),
                "status": ProjectStatus.OPEN,
            },
            {
                "umkm_id": kopi_user.id if kopi_user else None,
                "judul": "Redesign UI Website Reservasi Meja & Pemesanan",
                "kategori": ProjectCategory.UIUX,
                "deskripsi_raw": "Merancang wireframe dan visual prototype Figma untuk alur booking meja pelanggan dan pre-order menu kopi.",
                "budget_max": Decimal("800000"),
                "deadline": (datetime.now(timezone.utc) + timedelta(days=8)).date(),
                "status": ProjectStatus.OPEN,
            },
            # VIDEO
            {
                "umkm_id": dapur_user.id if dapur_user else None,
                "judul": "Video Promosi Reels & TikTok Produk Roti Rumahan",
                "kategori": ProjectCategory.VIDEO,
                "deskripsi_raw": "Dibutuhkan video editor mahasiswa untuk mengedit 3 video pendek promosi (durasi 30-45 detik) dengan transisi estetik dan backsound tren.",
                "budget_max": Decimal("450000"),
                "deadline": (datetime.now(timezone.utc) + timedelta(days=5)).date(),
                "status": ProjectStatus.OPEN,
            },
            {
                "umkm_id": batik_user.id if batik_user else None,
                "judul": "Editing Video Dokumentasi Proses Membatik Cap & Tulis",
                "kategori": ProjectCategory.VIDEO,
                "deskripsi_raw": "Mengolah video raw footage pembuatan batik menjadi video cinematic pendek 1 menit untuk branding story di YouTube Shorts.",
                "budget_max": Decimal("500000"),
                "deadline": (datetime.now(timezone.utc) + timedelta(days=7)).date(),
                "status": ProjectStatus.OPEN,
            },
            # COPYWRITING
            {
                "umkm_id": dapur_user.id if dapur_user else None,
                "judul": "Copywriting Iklan Instagram & Deskripsi Produk Menu Baru",
                "kategori": ProjectCategory.COPYWRITING,
                "deskripsi_raw": "Membutuhkan 10 set caption postingan Instagram dan teks deskripsi storytelling menarik untuk varian roti sourdough dan croissant terbaru kami.",
                "budget_max": Decimal("350000"),
                "deadline": (datetime.now(timezone.utc) + timedelta(days=4)).date(),
                "status": ProjectStatus.OPEN,
            },
            {
                "umkm_id": kopi_user.id if kopi_user else None,
                "judul": "Penulisan 3 Artikel SEO Edukasi Kopi Nusantara",
                "kategori": ProjectCategory.COPYWRITING,
                "deskripsi_raw": "Menulis 3 artikel blog informatif bertema varietas kopi lokal (Gayo, Toraja, Kintamani) dengan riset kata kunci SEO ramah Google.",
                "budget_max": Decimal("300000"),
                "deadline": (datetime.now(timezone.utc) + timedelta(days=5)).date(),
                "status": ProjectStatus.OPEN,
            },
            # ADMIN_DATA
            {
                "umkm_id": dapur_user.id if dapur_user else None,
                "judul": "Rekapitulasi Data Penjualan & Input Stok Excel",
                "kategori": ProjectCategory.ADMIN_DATA,
                "deskripsi_raw": "Membantu merapikan data nota fisik penjualan bakery selama 3 bulan ke dalam format Google Spreadsheet dengan rumus otomatis.",
                "budget_max": Decimal("300000"),
                "deadline": (datetime.now(timezone.utc) + timedelta(days=4)).date(),
                "status": ProjectStatus.OPEN,
            },
            {
                "umkm_id": batik_user.id if batik_user else None,
                "judul": "Digitalisasi Data Inventaris Motif Batik & Harga Grosir",
                "kategori": ProjectCategory.ADMIN_DATA,
                "deskripsi_raw": "Entri data 150 item kain batik (kode SKU, nama motif, ukuran, stok, dan harga) ke database katalog Excel.",
                "budget_max": Decimal("350000"),
                "deadline": (datetime.now(timezone.utc) + timedelta(days=5)).date(),
                "status": ProjectStatus.OPEN,
            },
        ]

        for p in sample_projects:
            if not p["umkm_id"]:
                continue
            exists = db.query(Project).filter(Project.judul == p["judul"]).first()
            if not exists:
                db.add(Project(**p))
                print(f"  + Proyek dibuat: '{p['judul']}' ({p['kategori']})")

        db.commit()
        print("\n[4/4] SELURUH SEEDER DATABASE BERHASIL 100%!")

    except Exception as e:
        db.rollback()
        print(f"\nGagal seeding database: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    seed_all()
