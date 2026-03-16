from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.api.v1 import router as api_v1
import os

app = FastAPI(title="Lifestyle Machine Orchestrator")

app.add_middleware( CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Lifestyle Machine Orchestrator API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "UP"}

# TODO: Add Voice Processing Endpoints (STT -> Orchestration -> TTS)
# TODO: Add Palm Reading Interpretation
# TODO: Add Face Reading Interpretation
# TODO: Add Quota Check Logic
