"""
The "Brain" — turns a student's question into a validated WidgetSpec.

Uses the openai/gpt-oss-120b model via Groq with streaming for better UX.
Integrates Tavily web search for real-time context enrichment.
"""

import json
import logging

from groq import Groq
from pydantic import ValidationError

from app.config import get_settings
from app.models.schemas import WidgetSpec, GraphWidget, PhysicsWidget, FlowWidget
from app.services.tavily_service import search_web, should_search

logger = logging.getLogger(__name__)

settings = get_settings()
client = Groq(api_key=settings.groq_api_key)

SYSTEM_PROMPT = """You are a STEM tutor. Output ONLY valid JSON (no markdown, no commentary) for ONE widget:

Graph: {"widget":"graph","tutor_text":"...","equation":"A*sin(B*x)","x_range":[-10,10],"controls":[{"type":"slider","label":"A","range":[0.1,5],"step":0.1,"default":1}]}

Physics: {"widget":"physics","tutor_text":"...","gravity":1.0,"bodies":[{"id":"b1","shape":"circle","x":200,"y":50,"radius":25,"is_static":false,"color":"#22D3EE"},{"id":"ground","shape":"rectangle","x":320,"y":340,"width":600,"height":20,"is_static":true,"color":"#20232E"}],"controls":[{"type":"slider","label":"Gravity","range":[0,5],"step":0.1,"default":1}]}

Flow: {"widget":"flow","tutor_text":"...","nodes":[{"id":"n1","label":"Step 1"}],"edges":[{"source":"n1","target":"n2","label":"...","animated":true}]}

Rules: tutor_text=1-2 engaging sentences. Graph equations use mathjs syntax. Physics canvas=640x360. Flow=3-8 nodes. Output valid JSON only."""


async def generate_widget_spec(question: str) -> WidgetSpec:
    """Generate a widget spec, optionally enriched with web search context."""
    # Check if question would benefit from web search
    web_context = ""
    if should_search(question):
        web_context = await search_web(question)
        logger.info("Web search context retrieved: %d chars", len(web_context))

    raw = await _call_llm_json(question, web_context)
    return _validate(raw)


async def _call_llm_json(question: str, web_context: str = "") -> dict:
    """Call the LLM with streaming and collect the full JSON response."""
    user_message = question
    if web_context:
        # Truncate web context to avoid exceeding TPM limits
        user_message = f"{question}\n\n[Context]\n{web_context[:500]}"

    # Use streaming to collect the response
    collected = []
    completion = client.chat.completions.create(
        model=settings.llm_model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        temperature=1,
        max_completion_tokens=4096,
        top_p=1,
        reasoning_effort="medium",
        stream=True,
        stop=None,
    )

    for chunk in completion:
        delta = chunk.choices[0].delta.content
        if delta:
            collected.append(delta)

    raw_text = "".join(collected)
    logger.debug("Raw LLM response: %s", raw_text[:500])

    # Strip markdown fences if the model wraps them
    raw_text = raw_text.strip()
    if raw_text.startswith("```json"):
        raw_text = raw_text[7:]
    if raw_text.startswith("```"):
        raw_text = raw_text[3:]
    if raw_text.endswith("```"):
        raw_text = raw_text[:-3]
    raw_text = raw_text.strip()

    return json.loads(raw_text)


async def generate_widget_stream(question: str):
    """Generator that yields SSE chunks as the LLM streams its response.
    
    Yields status updates and finally the complete widget spec.
    """
    import asyncio
    
    # Step 1: Web search (if applicable)
    web_context = ""
    if should_search(question):
        yield json.dumps({"type": "status", "message": "Searching the web for context..."}) + "\n"
        web_context = await search_web(question)
        if web_context:
            yield json.dumps({"type": "status", "message": "Found relevant information. Building widget..."}) + "\n"
    
    yield json.dumps({"type": "status", "message": "AI is thinking..."}) + "\n"
    
    user_message = question
    if web_context:
        # Truncate web context to avoid exceeding TPM limits
        user_message = f"{question}\n\n[Context]\n{web_context[:500]}"

    # Step 2: Stream the LLM response
    collected = []
    try:
        completion = client.chat.completions.create(
            model=settings.llm_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=1,
            max_completion_tokens=4096,
            top_p=1,
            reasoning_effort="medium",
            stream=True,
            stop=None,
        )

        yield json.dumps({"type": "status", "message": "Building your interactive widget..."}) + "\n"
        
        for chunk in completion:
            delta = chunk.choices[0].delta.content
            if delta:
                collected.append(delta)
                # Send progress updates periodically
                if len(collected) % 20 == 0:
                    yield json.dumps({"type": "progress", "tokens": len(collected)}) + "\n"

        raw_text = "".join(collected)
        raw_text = raw_text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        raw_text = raw_text.strip()

        data = json.loads(raw_text)
        spec = _validate(data)
        
        # Send the final widget spec
        result = spec.model_dump()
        yield json.dumps({"type": "widget", "spec": result}) + "\n"
        
    except Exception as e:
        logger.exception("Stream generation failed")
        yield json.dumps({"type": "error", "message": str(e)}) + "\n"


def _validate(raw: dict) -> WidgetSpec:
    """Validate against the right model based on the `widget` discriminator."""
    widget_type = raw.get("widget")
    model_map = {
        "graph": GraphWidget,
        "physics": PhysicsWidget,
        "flow": FlowWidget,
    }
    model = model_map.get(widget_type)
    if model is None:
        raise ValueError(f"Unknown widget type from LLM: {widget_type!r}")
    try:
        return model.model_validate(raw)
    except ValidationError as e:
        raise ValueError(f"LLM output failed schema validation: {e}") from e
