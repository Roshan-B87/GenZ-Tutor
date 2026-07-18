"""
Tavily web search integration.

Used to enrich the AI's context with real-time web data when a student's
question involves recent events, specific data, or topics that benefit
from up-to-date information.
"""

import logging
from tavily import TavilyClient
from app.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()
_client: TavilyClient | None = None


def _get_client() -> TavilyClient:
    global _client
    if _client is None:
        _client = TavilyClient(api_key=settings.tavily_api_key)
    return _client


async def search_web(query: str, max_results: int = 3) -> str:
    """Search the web using Tavily and return a formatted context string."""
    if not settings.tavily_api_key:
        logger.warning("No Tavily API key configured — skipping web search.")
        return ""

    try:
        client = _get_client()
        response = client.search(
            query=query,
            search_depth="basic",
            max_results=max_results,
            include_answer=True,
        )

        parts = []
        if response.get("answer"):
            parts.append(f"Summary: {response['answer']}")

        for result in response.get("results", [])[:max_results]:
            title = result.get("title", "")
            content = result.get("content", "")
            url = result.get("url", "")
            parts.append(f"- {title}: {content[:300]} (Source: {url})")

        return "\n".join(parts)

    except Exception as e:
        logger.warning(f"Tavily search failed: {e}")
        return ""


def should_search(question: str) -> bool:
    """Heuristic: decide if a question would benefit from web search."""
    search_triggers = [
        "latest", "recent", "current", "today", "2024", "2025", "2026",
        "news", "discovery", "discovered", "new research",
        "who invented", "when was", "how many",
        "real world", "real-world", "example of",
        "data", "statistics", "fact",
    ]
    q_lower = question.lower()
    return any(trigger in q_lower for trigger in search_triggers)
