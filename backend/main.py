from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

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