import os
import sys
from pathlib import Path
import uvicorn

# Ensure UTF-8 output encoding on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

if __name__ == "__main__":
    print("=" * 65)
    print("Starting KrishiAR Python AI Backend (FastAPI + VisionCore)")
    print("API Documentation (Swagger UI): http://localhost:8000/docs")
    print("API Health Check:              http://localhost:8000/api/health")
    print("=" * 65)
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)
