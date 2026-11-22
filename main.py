import os
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.config import APP_TITLE, APP_DESCRIPTION, APP_VERSION
from app.api.routes_plants import router as plants_router
from app.api.routes_identify import router as identify_router
from app.api.routes_diagnose import router as diagnose_router
from app.api.routes_chat import router as chat_router

app = FastAPI(
    title=APP_TITLE,
    description=APP_DESCRIPTION,
    version=APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for local frontend, LAN access, and cloud deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(plants_router)
app.include_router(identify_router)
app.include_router(diagnose_router)
app.include_router(chat_router)

@app.get("/api/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": "KrishiAR-FastAPI-VisionCore",
        "version": APP_VERSION,
        "supported_crops_count": 50,
        "port": 8000
    }

# Production Static Frontend Mounting (Single Unified Full-Stack Port)
FRONTEND_DIST = Path(__file__).resolve().parent.parent.parent / "dist"

if FRONTEND_DIST.exists() and (FRONTEND_DIST / "index.html").exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="frontend")
else:
    @app.get("/", tags=["System"])
    def root():
        return {
            "status": "online",
            "system": "KrishiAR AI Agricultural Backend",
            "version": APP_VERSION,
            "docs_url": "/docs"
        }
