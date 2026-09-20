import os
import sys

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from engine.api.routes import router as api_router

app = FastAPI(
    title="Nuper Citadel Deterministic Engine",
    description="Local Air-Gapped Military Qualification & Pre-FEA Simulation Preparation Engine",
    version="1.0.0-alpha",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration for desktop shell (Tauri / Local Web)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "tauri://localhost",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
def root():
    return {
        "engine": "Nuper Citadel",
        "status": "online",
        "mode": "air-gapped",
        "security": "zero-cloud-telemetry",
        "version": "1.0.0-alpha",
        "docs": "/docs",
    }


def start_server(host: str = "127.0.0.1", port: int = 8765):
    uvicorn.run("engine.main:app", host=host, port=port, reload=False)


if __name__ == "__main__":
    port = int(os.environ.get("NUPER_PORT", 8765))
    host = os.environ.get("NUPER_HOST", "127.0.0.1")
    start_server(host=host, port=port)
