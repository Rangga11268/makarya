from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from apscheduler.schedulers.background import BackgroundScheduler

from app.core.config import settings
from app.core.database import get_db, SessionLocal
from app.core.limiter import limiter
from app.routers import auth, projects, proposals, wallet, submissions, ratings, disputes, chat, talents
from app.routers.notifications import router as notifications_router
from app.services.scheduler import run_project_deadline_check

# Inisialisasi Scheduler Background
scheduler = BackgroundScheduler()

def daily_project_check():
    db = SessionLocal()
    try:
        run_project_deadline_check(db)
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Dijalankan saat aplikasi startup
    # Eksekusi cron setiap hari pukul 00:00
    scheduler.add_job(daily_project_check, "cron", hour=0, minute=0)
    scheduler.start()
    
    yield
    
    # Dijalankan saat shutdown
    scheduler.shutdown()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Backend API Platfrom Makarya (Mahasiswa Berkarya.)",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Pasang Rate Limiter state & execption handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# setup cors Security (Hanya origin yang bisa akses api + regex untuk semua port lokal)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.0\.\d+\.\d+)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Daftarkan router
app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["Authentication"])
app.include_router(projects.router, prefix=settings.API_V1_STR, tags=["Projects"])
app.include_router(proposals.router, prefix=settings.API_V1_STR, tags=["Proposals"])
app.include_router(wallet.router, prefix=settings.API_V1_STR, tags=["Wallet & Escrow"])
app.include_router(submissions.router, prefix=settings.API_V1_STR, tags=["Submissions & Revision Control"])
app.include_router(ratings.router, prefix=settings.API_V1_STR, tags=["Ratings & Reviews"])
app.include_router(disputes.router, prefix=settings.API_V1_STR, tags=["Dispute Resolution"])
app.include_router(chat.router, prefix=settings.API_V1_STR, tags=["Realtime Collaboration Chat"])
app.include_router(talents.router, prefix=settings.API_V1_STR, tags=["Talents & Directory"])
app.include_router(notifications_router, prefix=settings.API_V1_STR, tags=["Notifications"])


@app.get("/", tags=["Cek Health"])
async def root():
    return {
        "app" : settings.PROJECT_NAME,
        "status" : "healthy",
        "env" : settings.APP_ENV
    }

@app.get("/db-check", tags=["Cek Health"])
async def check_db(db: Session = Depends(get_db)):
    try:
        # Cek koneksi database versi postgres
        result = db.execute(text("SELECT version();")).scalar()
        return {
            "status": "connected",
            "database" :settings.DB_NAME,
            "version": result,
            "message": "Database connection successful"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Database connection failed: {str(e)}"
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)