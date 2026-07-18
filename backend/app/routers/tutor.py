from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.models.schemas import AskRequest, AskResponse
from app.services.llm_service import generate_widget_spec, generate_widget_stream

router = APIRouter(prefix="/api/tutor", tags=["tutor"])


@router.post("/ask", response_model=AskResponse)
async def ask(payload: AskRequest) -> AskResponse:
    """
    Takes a student's free-text question, returns a validated widget spec
    for the frontend to render.
    """
    try:
        spec = await generate_widget_spec(payload.question)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    return AskResponse(spec=spec)


@router.post("/ask/stream")
async def ask_stream(payload: AskRequest):
    """
    Takes a student's free-text question and streams the progress back
    as newline-delimited JSON before finally emitting the widget spec.
    """
    return StreamingResponse(
        generate_widget_stream(payload.question),
        media_type="application/x-ndjson",
    )


@router.get("/examples")
async def get_examples():
    """
    Returns curated examples to show in the gallery.
    """
    return {
        "examples": [
            {
                "widget": "graph",
                "tutor_text": "See how amplitude changes this wave.",
                "equation": "A*sin(B*x)",
                "x_range": [-10, 10],
                "controls": [
                    {"type": "slider", "label": "A", "range": [0.1, 5], "step": 0.1, "default": 1},
                    {"type": "slider", "label": "B", "range": [0.1, 5], "step": 0.1, "default": 1}
                ]
            },
            {
                "widget": "physics",
                "tutor_text": "Drop these balls to see gravity in action.",
                "gravity": 1.0,
                "bodies": [
                    {"id": "ball1", "shape": "circle", "x": 200, "y": 50, "radius": 25, "is_static": False, "color": "#22D3EE"},
                    {"id": "ground", "shape": "rectangle", "x": 320, "y": 340, "width": 600, "height": 20, "is_static": True, "color": "#20232E"}
                ],
                "controls": [
                    {"type": "slider", "label": "Gravity", "range": [0, 5], "step": 0.1, "default": 1}
                ]
            },
            {
                "widget": "flow",
                "tutor_text": "Photosynthesis process.",
                "nodes": [
                    {"id": "n1", "label": "Sunlight"},
                    {"id": "n2", "label": "Chloroplast"},
                    {"id": "n3", "label": "Glucose"}
                ],
                "edges": [
                    {"source": "n1", "target": "n2", "label": "Energy", "animated": True},
                    {"source": "n2", "target": "n3", "label": "Produces", "animated": True}
                ]
            }
        ]
    }
