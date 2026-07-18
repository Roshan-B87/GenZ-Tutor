# Dynamic Synaptic Canvas

Generative AI for STEM — instead of a wall of text, the AI builds an
interactive widget (a graph, a physics sandbox, a flow diagram) and lets the
student discover the answer by playing with it.

## Architecture

```
[Student question] -> FastAPI -> LLM (JSON mode) -> validated widget spec
                                                            |
                                                            v
                                          Next.js frontend renders the
                                          matching component (no LLM-
                                          generated HTML/JS ever runs)
```

The LLM never writes UI code. It only chooses one of three widget shapes and
fills in the JSON. The frontend maps that JSON to a hand-built React
component. This is what makes it stable — the model can pick the wrong
*content*, but it can't produce a broken *interface*.

```
Ai_Stem/
├── backend/     FastAPI — see backend/README.md
│   └── app/models/schemas.py   <- the JSON contract, start reading here
└── frontend/    Next.js — see frontend/README.md
    └── src/components/widgets/ <- CartesianGraph, PhysicsSandbox, FlowDiagram
```

## Quick start

Terminal 1:

    cd backend
    python -m venv venv && source venv/bin/activate
    pip install -r requirements.txt
    cp .env.example .env      # add your GROQ_API_KEY
    uvicorn app.main:app --reload

Terminal 2:

    cd frontend
    npm install
    cp .env.local.example .env.local
    npm run dev

Open http://localhost:3000, ask something like *"How do sound waves cancel
each other out?"*

## Three widgets, three disciplines

| Widget | `widget` value | Discipline | Glow color |
|---|---|---|---|
| `CartesianGraph` | `graph` | Algebra / calculus / trig | cyan |
| `PhysicsSandbox` | `physics` | Mechanics, gravity, collisions (Matter.js) | amber |
| `FlowDiagram` | `flow` | Chemistry / biology processes | green |

Adding a fourth widget touches exactly three files: `backend/app/models/schemas.py`,
`frontend/src/types/widget.ts`, and a new component + case in
`frontend/src/components/WidgetRenderer.tsx`.
