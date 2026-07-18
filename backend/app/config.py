"""
App settings, loaded from environment variables / .env.

Copy .env.example to .env and fill in your own key before running.
"""

import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


class Settings:
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    llm_model: str = os.getenv("LLM_MODEL", "openai/gpt-oss-120b")
    tavily_api_key: str = os.getenv("TAVILY_API_KEY", "")

    cors_origins: list[str] = os.getenv(
        "CORS_ORIGINS", "http://localhost:3000"
    ).split(",")


@lru_cache
def get_settings() -> Settings:
    return Settings()
