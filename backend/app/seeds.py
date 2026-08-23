from app.core.database import SessionLocal
from app.models.master import MasterProdi, MasterSkill

# Data awal Program Studi di Kampus
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

# Data awal Keahlian Digital untuk UMKM
SKILL_SEEDS = [
    {"kategori": "DESAIN", "nama_skill": "Logo & Branding"},
    {"kategori": "DESAIN", "nama_skill": "Desain Menu & Banner"},
    {"kategori": "DESAIN", "nama_skill": "Desain Kemasan (Packaging)"},
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


def seed_master_data():
    db = SessionLocal()
    try:
        print("🌱 Memulai seeding master data...")

        # 1. Seed Master Prodi
        for item in PRODI_SEEDS:
            exists = db.query(MasterProdi).filter(MasterProdi.nama_prodi == item["nama_prodi"]).first()
            if not exists:
                db.add(MasterProdi(**item))
                print(f"  + Ditambahkan Prodi: {item['nama_prodi']}")

        # 2. Seed Master Skills
        for item in SKILL_SEEDS:
            exists = db.query(MasterSkill).filter(MasterSkill.nama_skill == item["nama_skill"]).first()
            if not exists:
                db.add(MasterSkill(**item))
                print(f"  + Ditambahkan Skill: {item['nama_skill']}")

        db.commit()
        print("✅ Seeding master data berhasil!")
    except Exception as e:
        db.rollback()
        print(f"❌ Gagal seeding data: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_master_data()