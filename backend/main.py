from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.config import settings
from app.core.database import get_db

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Backend API Platfrom Makarya (Mahasiswa Berkarya.)",
    docs_url="/docs",
    redoc_url="/redoc",
)

# setup cors Security (Hanya origin yang bisa akses api)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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