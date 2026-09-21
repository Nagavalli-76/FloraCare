"""
FloraCare backend entry point.

Run locally (Windows PowerShell):
    cd backend
    python -m venv venv
    venv\\Scripts\\activate
    pip install -r requirements.txt
    python -m app.seed
    uvicorn app.main:app --reload
"""
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from app.database import Base, engine
from app.routers import flowers, plants, maintenance, irrigation, health, alerts, dashboard

Base.metadata.create_all(bind=engine)

FRONTEND_DIST = Path(__file__).resolve().parents[2] / "frontend" / "dist"
FRONTEND_INDEX = FRONTEND_DIST / "index.html"

app = FastAPI(
    title="FloraCare API",
    description="Smart Floriculture Nursery Management & Plant Care Assistant -- backend API.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173",
        ).split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(flowers.router)
app.include_router(plants.router)
app.include_router(maintenance.router)
app.include_router(irrigation.router)
app.include_router(health.router)
app.include_router(alerts.router)
app.include_router(dashboard.router)


@app.get("/api/health-check")
def health_check():
    return {"status": "ok"}


if (FRONTEND_DIST / "assets").is_dir():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")


@app.get("/{frontend_path:path}")
def serve_frontend(frontend_path: str):
    """Serve built assets and fall back to index.html for React Router paths."""
    if frontend_path == "" or frontend_path.startswith("api/"):
        if frontend_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not Found")
        requested_file = FRONTEND_INDEX
    else:
        requested_file = FRONTEND_DIST / frontend_path
        if not requested_file.is_file():
            requested_file = FRONTEND_INDEX

    if not requested_file.is_file():
        return {"message": "FloraCare API is running.", "docs": "/docs"}
    return FileResponse(requested_file)
