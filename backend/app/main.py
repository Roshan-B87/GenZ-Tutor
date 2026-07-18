from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import tutor

settings = get_settings()

app = FastAPI(
    title="Dynamic Synaptic Canvas API",
    description="AI-powered interactive STEM learning — widgets, not walls of text.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tutor.router)


@app.get("/health")
def health():
    return {"status": "ok"}
