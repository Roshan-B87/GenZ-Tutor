# Backend — Dynamic Synaptic Canvas API

FastAPI service that turns a student's question into a validated JSON widget
spec (see `app/models/schemas.py`) for the Next.js frontend to render.

## Setup

    python -m venv venv
    source venv/bin/activate        # Windows: venv\Scripts\activate
    pip install -r requirements.txt
    cp .env.example .env            # then add your GROQ_API_KEY

## Run

    uvicorn app.main:app --reload

API docs at http://localhost:8000/docs

## Where to work

- `app/models/schemas.py` — the JSON contract with the frontend. Start here.
- `app/services/llm_service.py` — the prompt + the LLM call. This is the
  part most worth iterating on.
- `app/routers/tutor.py` — the single `/api/tutor/ask` endpoint.
